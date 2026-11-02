// src/controllers/taskController.js
// Validates input, calls the model, sends the HTTP response. No SQL here.

const taskModel = require('../models/taskModel');

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1' || val === 'on';
  return Boolean(val);
};

const taskController = {
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await taskModel.findAll();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  getTaskById: async (req, res, next) => {
    try {
      const task = await taskModel.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  createTask: async (req, res, next) => {
    try {
      const { title, description, status, completed } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const taskStatus = status ? status.toLowerCase().replace(' ', '_') : 'pending';
      const isCompleted = completed !== undefined 
        ? parseBoolean(completed) 
        : taskStatus === 'completed';

      const newTask = await taskModel.create({
        title: title.trim(),
        description: description ? description.trim() : null,
        status: taskStatus,
        completed: isCompleted,
      });

      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, status, completed } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const taskStatus = status ? status.toLowerCase().replace(' ', '_') : 'pending';
      const isCompleted = completed !== undefined 
        ? parseBoolean(completed) 
        : taskStatus === 'completed';

      const updatedTask = await taskModel.update(id, {
        title: title.trim(),
        description: description ? description.trim() : null,
        status: taskStatus,
        completed: isCompleted,
      });

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  patchTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, status, completed } = req.body;

      if (title === undefined && description === undefined && status === undefined && completed === undefined) {
        return res.status(400).json({
          error: 'Provide at least one field to update',
        });
      }

      if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }

      const fields = {};
      if (title !== undefined) fields.title = title.trim();
      if (description !== undefined) fields.description = description.trim();
      
      if (status !== undefined) {
        const taskStatus = status.toLowerCase().replace(' ', '_');
        fields.status = taskStatus;
        if (completed === undefined) {
          fields.completed = taskStatus === 'completed';
        }
      }
      
      if (completed !== undefined) {
        fields.completed = parseBoolean(completed);
      }

      const updatedTask = await taskModel.partialUpdate(id, fields);

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const deleted = await taskModel.remove(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = taskController;