// boardUtils.js
import axios from 'axios';
import { LOCALHOST } from '../config';

// Fetch boards
export async function fetchBoards(setBoards) {
  const response = await axios.get(`${LOCALHOST}/boards`);
  setBoards(response.data);
}

// Update boards
export async function updateBoards(updatedBoards, boards, setBoards) {
  setBoards(updatedBoards);
  for (const board of updatedBoards) {
    await axios.put(`${LOCALHOST}/boards/${board._id}`, board);
  }
}

// Handle drag events
export function dragOverHandler(e) {
  e.preventDefault();
  e.target.classList.add('drag-over');
}

export function dragLeaveHandler(e) {
  e.target.classList.remove('drag-over');
}

export function dragStartHandler(
  e,
  setCurrentBoard,
  setCurrentItem,
  board,
  item
) {
  setCurrentBoard(board);
  setCurrentItem(item);
}

export function dragEndHandler(e) {
  e.target.classList.remove('drag-over');
}

// Handle drop events
export async function dropHandler(
  e,
  board,
  item,
  currentBoard,
  currentItem,
  boards,
  updateBoards
) {
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

// Add task
export async function handleAddTask(
  boardId,
  taskInputs,
  boards,
  updateBoards,
  setTaskInputs
) {
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

// Delete task
export async function handleDeleteTask(boardId, itemId, boards, updateBoards) {
  const updatedBoards = boards.map((board) => {
    if (board._id === boardId) {
      const updatedItems = board.items.filter((item) => item.id !== itemId);
      return { ...board, items: updatedItems };
    }
    return board;
  });

  await updateBoards(updatedBoards);
}

// Add new board
export async function newBoard(
  newBoardTitle,
  boards,
  setBoards,
  setNewBoardTitle
) {
  if (newBoardTitle.trim() === '') return;

  const newBoard = {
    title: newBoardTitle,
    items: [],
  };

  const response = await axios.post(`${LOCALHOST}/boards`, newBoard);
  setBoards([...boards, response.data]);
  setNewBoardTitle('');
}

// Handle title input change
export function handleTitleInputChange(boardId, value, setNewTitle) {
  setNewTitle((prev) => ({ ...prev, [boardId]: value }));
}

// Handle title change
export async function handleTitleChange(
  boardId,
  newTitle,
  boards,
  updateBoards,
  setIsEditingTitle
) {
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

export const handleInputChange = (boardId, value) => {
  setTaskInputs((prev) => ({ ...prev, [boardId]: value }));
};
