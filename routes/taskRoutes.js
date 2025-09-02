const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskStats
} = require('../controllers/taskController');

// All task routes require authentication
router.use(auth);

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', getTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', getTaskById);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/toggle - Toggle task status
router.patch('/:id/toggle', toggleTaskStatus);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
