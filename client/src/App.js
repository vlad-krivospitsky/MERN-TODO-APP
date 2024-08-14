import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import TaskCard from './components/TaskCard';
import { LOCALHOST } from './config';
// import AuthForm from './components/AuthForm/AuthForm';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [taskInputs, setTaskInputs] = useState({});
  const [isEditingTitle, setIsEditingTitle] = useState({});
  const [newTitle, setNewTitle] = useState({});
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    async function fetchBoards() {
      const response = await axios.get(`${LOCALHOST}/boards`);
      setBoards(response.data);
    }
    fetchBoards();
  }, []);

  async function updateBoards(updatedBoards) {
    setBoards(updatedBoards);
    for (const board of updatedBoards) {
      await axios.put(`${LOCALHOST}/boards/${board._id}`, board);
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
    if (newBoardTitle.trim() === '') return;

    const newBoard = {
      title: newBoardTitle,
      items: [],
    };

    const response = await axios.post(`${LOCALHOST}/boards`, newBoard);
    setBoards([...boards, response.data]);
    setNewBoardTitle('');
  }

  function handleTitleInputChange(boardId, value) {
    setNewTitle((prev) => ({ ...prev, [boardId]: value }));
  }

  async function handleTitleChange(boardId) {
    try {
      const updatedBoards = boards.map((board) =>
        board._id === boardId ? { ...board, title: newTitle[boardId] } : board
      );
      setBoards(updatedBoards);

      await axios.put(`${LOCALHOST}/boards/${boardId}`, {
        ...updatedBoards.find((board) => board._id === boardId),
      });

      setIsEditingTitle((prev) => ({ ...prev, [boardId]: false }));
    } catch (error) {
      console.error('Failed to update board title:', error);
    }
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
            <div className="board__title">
              {isEditingTitle[board._id] ? (
                <input
                  type="text"
                  value={newTitle[board._id] || board.title}
                  onChange={(e) =>
                    handleTitleInputChange(board._id, e.target.value)
                  }
                  onBlur={() => handleTitleChange(board._id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleChange(board._id);
                    }
                  }}
                />
              ) : (
                <div
                  onClick={() => {
                    setIsEditingTitle((prev) => ({
                      ...prev,
                      [board._id]: true,
                    }));
                    setNewTitle((prev) => ({
                      ...prev,
                      [board._id]: board.title,
                    }));
                  }}
                >
                  {board.title}
                </div>
              )}
              <EditIcon />
            </div>

            <div className="board__items">
              {board.items.map((item, index) => (
                <TaskCard
                  description={item.titleDetails}
                  key={item.id}
                  board={board}
                  item={item}
                  dragOverHandler={dragOverHandler}
                  dragLeaveHandler={dragLeaveHandler}
                  dragStartHandler={dragStartHandler}
                  dragEndHandler={dragEndHandler}
                  dropHandler={dropHandler}
                  handleDeleteTask={handleDeleteTask}
                  className={
                    index === board.items.length - 1 ? 'done-card' : ''
                  }
                />
              ))}
            </div>
            <div className="board__footer">
              <input
                type="text"
                value={taskInputs[board._id] || ''}
                onChange={(e) => handleInputChange(board._id, e.target.value)}
                placeholder="Add a task..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTask(board._id);
                  }
                }}
              />
              <button
                className="add-btn"
                onClick={() => handleAddTask(board._id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <div className="new-board-section">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter new board title..."
          />
          <button onClick={newBoard}>Create Board</button>
        </div>
      </div>
    </div>
  );
}

export default App;
