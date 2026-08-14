import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function Column({ column, allColumns, onAddTask, onEditTask, onDeleteTask, onMoveTask }) {
  const taskCount = column.tasks ? column.tasks.length : 0;

  return (
    <div className="board-column">
      <div className="column-header">
        <div className="column-title-group">
          <h3 className="column-title">{column.name}</h3>
          <span className="task-count-badge" title={`${taskCount} tasks in ${column.name}`}>
            {taskCount}
          </span>
        </div>

        <button
          className="btn-add-column-task"
          onClick={() => onAddTask(column.id)}
          title={`Add task to ${column.name}`}
          aria-label={`Add task to ${column.name}`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="task-list">
        {taskCount === 0 ? (
          <div className="column-empty-state">
            <p>No tasks yet</p>
            <button
              className="btn-link-add"
              onClick={() => onAddTask(column.id)}
            >
              + Create one
            </button>
          </div>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={allColumns}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
