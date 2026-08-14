import { db } from '../../database/db.js';

const TaskModel = {
  getTaskById(id) {
    const query = `
      SELECT t.*, c.name AS column_name
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      WHERE t.id = ?
    `;
    return db.prepare(query).get(id);
  },

  createTask({ column_id, title, description = '', priority = 'Medium' }) {
    const query = `
      INSERT INTO tasks (column_id, title, description, priority)
      VALUES (?, ?, ?, ?)
    `;
    const result = db.prepare(query).run(column_id, title.trim(), description ? description.trim() : '', priority);
    return this.getTaskById(result.lastInsertRowid);
  },

  updateTask(id, { title, description = '', priority }) {
    const query = `
      UPDATE tasks
      SET title = ?, description = ?, priority = ?
      WHERE id = ?
    `;
    db.prepare(query).run(title.trim(), description ? description.trim() : '', priority, id);
    return this.getTaskById(id);
  },

  moveTaskColumn(id, newColumnId) {
    const query = `
      UPDATE tasks
      SET column_id = ?
      WHERE id = ?
    `;
    db.prepare(query).run(newColumnId, id);
    return this.getTaskById(id);
  },

  deleteTask(id) {
    const query = `DELETE FROM tasks WHERE id = ?`;
    const result = db.prepare(query).run(id);
    return result.changes > 0;
  },

  getTasksByPriority(priority) {
    const query = `
      SELECT t.*, c.name AS column_name
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      WHERE t.priority = ?
      ORDER BY t.created_at DESC;
    `;
    return db.prepare(query).all(priority);
  },

  searchTasks(searchTerm) {
    const query = `
      SELECT t.*, c.name AS column_name
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      WHERE t.title LIKE ?
      ORDER BY t.created_at DESC;
    `;
    return db.prepare(query).all(`%${searchTerm}%`);
  },

  getAllTasks() {
    const query = `
      SELECT t.*, c.name AS column_name
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      ORDER BY t.created_at DESC;
    `;
    return db.prepare(query).all();
  }
};

export default TaskModel;
