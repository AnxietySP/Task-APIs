require('dotenv').config();
const express = require('express');
const pool = require('./src/db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// GET /api/tasks - Retrieve all tasks from MySQL
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET /api/tasks/:id - Retrieve a single task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// POST /api/tasks - Create a new task in MySQL
app.post('/api/tasks', async (req, res) => {
    const { title, description, status } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const taskStatus = status || 'pending';
    const completed = taskStatus === 'completed' ? 1 : 0;

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, status, completed) VALUES (?, ?, ?, ?)',
            [title, description || '', taskStatus, completed]
        );
        const [newRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(newRows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id - Update an existing task
app.put('/api/tasks/:id', async (req, res) => {
    const { title, description, status, completed } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTitle = title !== undefined ? title : existing[0].title;
        const updatedDesc = description !== undefined ? description : existing[0].description;
        const updatedStatus = status !== undefined ? status : existing[0].status;
        const updatedCompleted = completed !== undefined ? completed : (updatedStatus === 'completed' ? 1 : 0);

        await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ?, completed = ? WHERE id = ?',
            [updatedTitle, updatedDesc, updatedStatus, updatedCompleted, req.params.id]
        );

        const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        res.json(updatedRows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
