import React from 'react';
import Column from './Column';

export default function Board({ board, onAddTask, onEditTask, onDeleteTask, onMoveTask }) {
  if (!board || !board.columns) {
    return (
      <div className="board-loading">
        <p>Loading board data...</p>
      </div>
    );
  }

  const columns = board.columns || [];

  return (
    <div className="board-container">
      <div className="board-columns-grid">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            allColumns={columns}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
          />
        ))}
      </div>
    </div>
  );
}
