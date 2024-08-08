import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [taskInputs, setTaskInputs] = useState({});

  useEffect(() => {
    async function fetchBoards() {
      const response = await axios.get('http://localhost:5000/boards');
      setBoards(response.data);
    }
    fetchBoards();
  }, []);

  async function updateBoards(updatedBoards) {
    setBoards(updatedBoards);
    for (const board of updatedBoards) {
      await axios.put(`http://localhost:5000/boards/${board._id}`, board);
    }
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
  }

  function dragLeaveHandler(e) {
    e.target.classList.remove('drag-over');
  }

  function dragStartHandler(e, board, item) {
    setCurrentBoard(board);
    setCurrentItem(item);
  }

  function dragEndHandler(e) {
    e.target.classList.remove('drag-over');
  }

  async function dropHandler(e, board, item) {
    e.preventDefault();
    if (!currentBoard || !currentItem) return;

    const updatedBoards = boards.map((b) => {
      if (b._id === board._id) {
        const newItems = [...b.items];
        const dropIndex = newItems.indexOf(item);

        if (currentBoard._id === board._id) {
          const currentIndex = newItems.indexOf(currentItem);
          newItems.splice(currentIndex, 1);
          newItems.splice(dropIndex, 0, currentItem);
        } else {
          const currentBoardItems = [...currentBoard.items];
          const currentIndex = currentBoardItems.indexOf(currentItem);
          currentBoardItems.splice(currentIndex, 1);

          newItems.splice(dropIndex, 0, currentItem);
          return { ...b, items: newItems };
        }

        return { ...b, items: newItems };
      }

      if (b._id === currentBoard._id) {
        return { ...b, items: b.items.filter((i) => i !== currentItem) };
      }

      return b;
    });

    await updateBoards(updatedBoards);
    e.target.classList.remove('drag-over');
  }

  async function handleAddTask(boardId) {
    const task = taskInputs[boardId];
    if (!task || task.trim() === '') return;

    const updatedBoards = boards.map((board) => {
      if (board._id === boardId) {
        const newItem = {
          id: Date.now(),
          title: task,
        };
        return { ...board, items: [...board.items, newItem] };
      }
      return board;
    });

    await updateBoards(updatedBoards);
    setTaskInputs((prev) => ({ ...prev, [boardId]: '' }));
  }

  async function handleDeleteTask(boardId, itemId) {
    const updatedBoards = boards.map((board) => {
      if (board._id === boardId) {
        const updatedItems = board.items.filter((item) => item.id !== itemId);
        return { ...board, items: updatedItems };
      }
      return board;
    });

    await updateBoards(updatedBoards);
  }

  async function newBoard() {
    const newBoard = {
      title: 'New Board',
      items: [],
    };

    const response = await axios.post('http://localhost:5000/boards', newBoard);
    setBoards([...boards, response.data]);
  }

  const handleInputChange = (boardId, value) => {
    setTaskInputs((prev) => ({ ...prev, [boardId]: value }));
  };

  return (
    <div className="wrapper">
      <div className="app">
        {boards.map((board) => (
          <div
            key={board._id}
            className="board"
            onDragOver={dragOverHandler}
            onDrop={(e) => dropHandler(e, board)}
          >
            <div className="board__title">{board.title}</div>
            <div className="board__items">
              {board.items.map((item) => (
                <div
                  key={item.id}
                  className="board__item"
                  draggable
                  onDragOver={dragOverHandler}
                  onDragLeave={dragLeaveHandler}
                  onDragStart={(e) => dragStartHandler(e, board, item)}
                  onDragEnd={dragEndHandler}
                  onDrop={(e) => dropHandler(e, board, item)}
                >
                  <div className="btn-wrapper">
                    <span>{item.title}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(board._id, item.id)}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="board__footer">
              <input
                type="text"
                value={taskInputs[board._id] || ''}
                onChange={(e) => handleInputChange(board._id, e.target.value)}
                placeholder="Add a task..."
              />
              <button onClick={() => handleAddTask(board._id)}>+</button>
            </div>
          </div>
        ))}
        <button className="new-board" onClick={newBoard}>
          Add Board
        </button>
      </div>
    </div>
  );
}

export default App;
