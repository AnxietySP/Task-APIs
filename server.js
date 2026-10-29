// server.js - PART 1 (In-memory Task API)
const express = require('express');
const app = express();

// Middleware to parse incoming JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Temporary in-memory storage (wiped when the server restarts)[span_3](start_span)[span_3](end_span)[span_4](start_span)[span_4](end_span)
let tasks = [];
let nextId = 1;

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Task API is ready!' });
});

// GET /tasks - Return all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// GET /tasks/:id - Get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find((item) => item.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// PATCH /tasks/:id - Update task completion status
app.patch('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { completed } = req.body;
    const task = tasks.find((item) => item.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    task.completed = completed;
    res.json(task);
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = tasks.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(index, 1);
    res.status(204).send();
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
