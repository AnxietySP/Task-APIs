// src/models/taskModel.js
// Database queries only. No req, no res, no HTTP status codes.

const pool = require('../db');

const taskModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async ({ title, description = null, status = 'pending', completed = false }) => {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status, completed) VALUES (?, ?, ?, ?)',
      [title, description, status, completed]
    );
    return taskModel.findById(result.insertId);
  },

  update: async (id, { title, description = null, status = 'pending', completed }) => {
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, completed = ? WHERE id = ?',
      [title, description, status, completed, id]
    );
    if (result.affectedRows === 0) return null;
    return taskModel.findById(id);
  },

  partialUpdate: async (id, fields) => {
    const updates = [];
    const values = [];

    if (fields.title !== undefined) {
      updates.push('title = ?');
      values.push(fields.title);
    }
    if (fields.description !== undefined) {
      updates.push('description = ?');
      values.push(fields.description);
    }
    if (fields.status !== undefined) {
      updates.push('status = ?');
      values.push(fields.status);
    }
    if (fields.completed !== undefined) {
      updates.push('completed = ?');
      values.push(fields.completed);
    }

    if (updates.length === 0) return taskModel.findById(id);

    values.push(id);

    const [result] = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;
    return taskModel.findById(id);
  },

  remove: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = taskModel;