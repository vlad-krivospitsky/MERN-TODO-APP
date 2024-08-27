import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TaskCard from '../TaskCard/TaskCard';
import { LOCALHOST } from '../../config';
import './Todo.css';

interface TaskItem {
  id: string;
  title: string;
  titleDetails?: string;
}

interface Board {
  _id: string;
  title: string;
  items: TaskItem[];
}

const Todo: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentItem, setCurrentItem] = useState<TaskItem | null>(null);
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [isEditingTitle, setIsEditingTitle] = useState<Record<string, boolean>>({});
  const [newTitle, setNewTitle] = useState<Record<string, string>>({});
  const [newBoardTitle, setNewBoardTitle] = useState<string>('');

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await axios.get<Board[]>(`${LOCALHOST}/boards`);
        setBoards(response.data);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      }
    }
    fetchBoards();
  }, []);

  async function updateBoards(updatedBoards: Board[]) {
    setBoards(updatedBoards);
    for (const board of updatedBoards) {
      await axios.put(`${LOCALHOST}/boards/${board._id}`, board);
    }
  }

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }


  function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove('drag-over');
  }

  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, board: Board, item: TaskItem) {
    setCurrentBoard(board);
    setCurrentItem(item);
  }

  function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove('drag-over');
  }

  async function dropHandler(e: React.DragEvent<HTMLDivElement>, board: Board, item: TaskItem) {
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
    e.currentTarget.classList.remove('drag-over');
  }

  async function handleAddTask(boardId: string) {
    const task = taskInputs[boardId];
    if (!task || task.trim() === '') return;

    const updatedBoards = boards.map((board) => {
      if (board._id === boardId) {
        const newItem: TaskItem = {
          id: Date.now().toString(),
          title: task,
        };
        return { ...board, items: [...board.items, newItem] };
      }
      return board;
    });

    await updateBoards(updatedBoards);
    setTaskInputs((prev) => ({ ...prev, [boardId]: '' }));
  }

  async function handleDeleteTask(boardId: string, itemId: string) {
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

    try {
      const response = await axios.post<Board>(`${LOCALHOST}/boards`, newBoard);
      setBoards([...boards, response.data]);
      setNewBoardTitle('');
    } catch (error) {
      console.error('Failed to create new board:', error);
    }
  }

  async function handleDeleteBoard(boardId: string) {
    try {
      await axios.delete(`${LOCALHOST}/boards/${boardId}`);
      const updatedBoards = boards.filter((board) => board._id !== boardId);
      setBoards(updatedBoards);
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  }

  function handleTitleInputChange(boardId: string, value: string) {
    setNewTitle((prev) => ({ ...prev, [boardId]: value }));
  }

  async function handleTitleChange(boardId: string) {
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

  const handleInputChange = (boardId: string, value: string) => {
    setTaskInputs((prev) => ({ ...prev, [boardId]: value }));
  };

  return (
    <div className="wrapper">
      <Link to="/" className="logout-btn">
        Log Out
      </Link>
      <div className="app">
        {boards.map((board) => (
          <div
            key={board._id}
            className="board"
            onDragOver={dragOverHandler}
            onDrop={(e) => dropHandler(e, board, e.currentTarget as unknown as TaskItem)}
          >
            <div className="board__title">
              {isEditingTitle[board._id] ? (
                <input
                  type="text"
                  value={newTitle[board._id] || board.title}
                  onChange={(e) => handleTitleInputChange(board._id, e.target.value)}
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
              <button className='delete-board' onClick={() => handleDeleteBoard(board._id)}><DeleteOutlineIcon/></button> 
            </div>

            <div className="board__items">
              {board.items.map((item, index) => (
                <TaskCard
                  description={item.titleDetails || ''}
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
              <button className="add-btn" onClick={() => handleAddTask(board._id)}>
                +
              </button>
            </div>
          </div>
        ))}
        <div className="new-board-section board">
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
};

export default Todo;
