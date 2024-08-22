import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Modal from '../Modal/Modal';

const TaskCard = ({
  description,
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
        <Modal description={description} />
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
