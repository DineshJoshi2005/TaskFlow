import { db } from '../../database/db.js';

const BoardModel = {
  getAllBoards() {
    const query = `SELECT * FROM boards ORDER BY id ASC`;
    return db.prepare(query).all();
  },

  getBoardById(boardId) {
    const boardQuery = `SELECT * FROM boards WHERE id = ?`;
    const board = db.prepare(boardQuery).get(boardId);

    if (!board) {
      return null;
    }

    const columnsQuery = `
      SELECT * FROM columns 
      WHERE board_id = ? 
      ORDER BY order_index ASC
    `;
    const columns = db.prepare(columnsQuery).all(boardId);

    const tasksQuery = `
      SELECT t.* 
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      WHERE c.board_id = ?
      ORDER BY t.created_at DESC
    `;
    const tasks = db.prepare(tasksQuery).all(boardId);

    const columnsWithTasks = columns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.column_id === column.id)
    }));

    return {
      ...board,
      columns: columnsWithTasks
    };
  },

  getTaskCountPerColumn(boardId) {
    const query = `
      SELECT 
        c.id AS column_id, 
        c.name AS column_name, 
        c.order_index, 
        COUNT(t.id) AS task_count
      FROM columns c
      LEFT JOIN tasks t ON c.id = t.column_id
      WHERE c.board_id = ?
      GROUP BY c.id, c.name, c.order_index
      ORDER BY c.order_index ASC;
    `;
    return db.prepare(query).all(boardId);
  }
};

export default BoardModel;
