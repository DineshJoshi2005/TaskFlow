import React from 'react';
import { Edit2, Trash2, Calendar, ArrowRightLeft } from 'lucide-react';

export default function TaskCard({ task, columns, onEdit, onDelete, onMove }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      case 'medium':
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority || 'Medium'}
        </span>

        <div className="task-card-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-card-action btn-edit"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn-card-action btn-delete"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-date">
          <Calendar size={12} />
          <span>{formatDate(task.created_at)}</span>
        </div>

        <div className="task-move-control">
          <ArrowRightLeft size={12} className="move-icon" />
          <select
            value={task.column_id}
            onChange={(e) => onMove(task.id, Number(e.target.value))}
            className="select-move-column"
            title="Move task to column"
            aria-label="Move task to column"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
