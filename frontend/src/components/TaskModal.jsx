import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task = null, defaultColumnId = 1, columns = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [columnId, setColumnId] = useState(defaultColumnId);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setColumnId(task.column_id || defaultColumnId);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setColumnId(defaultColumnId);
    }
    setError('');
    setIsSubmitting(false);
  }, [task, defaultColumnId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        id: task?.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        column_id: columnId
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title">
              Title <span className="required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`input-text ${error ? 'input-error' : ''}`}
              placeholder="e.g. Design database schema"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description (Optional)</label>
            <textarea
              id="task-description"
              className="textarea"
              rows={3}
              placeholder="Add any extra details or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="select-dropdown"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {!task && (
              <div className="form-group flex-1">
                <label htmlFor="task-column">Column</label>
                <select
                  id="task-column"
                  className="select-dropdown"
                  value={columnId}
                  onChange={(e) => setColumnId(Number(e.target.value))}
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
