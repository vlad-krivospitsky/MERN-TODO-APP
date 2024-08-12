import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface TaskCardProps {
  board: {
    _id: string;
  };
  item: {
    id: string;
    title: string;
  };
  dragOverHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dragLeaveHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dragStartHandler: (
    e: React.DragEvent<HTMLDivElement>,
    board: TaskCardProps['board'],
    item: TaskCardProps['item']
  ) => void;
  dragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dropHandler: (
    e: React.DragEvent<HTMLDivElement>,
    board: TaskCardProps['board'],
    item: TaskCardProps['item']
  ) => void;
  handleDeleteTask: (boardId: string, itemId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  board,
  item,
  dragOverHandler,
  dragLeaveHandler,
  dragStartHandler,
  dragEndHandler,
  dropHandler,
  handleDeleteTask,
}) => {
  return (
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
  );
};

export default TaskCard;
