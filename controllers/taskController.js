const Task = require('../models/Task');

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
        
        // Build filter object
        const filter = { userId: req.user._id };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Build sort object
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj = { [sortBy]: sortOrder };

        const tasks = await Task.find(filter).sort(sortObj);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.user._id
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        const task = await Task.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields if provided
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Toggle task status between Pending and Completed
const toggleTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Toggle between Pending and Completed
        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
        
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const stats = await Task.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const total = await Task.countDocuments({ userId });
        
        const formattedStats = {
            total,
            pending: 0,
            inProgress: 0,
            completed: 0
        };
        
        stats.forEach(stat => {
            switch (stat._id) {
                case 'Pending':
                    formattedStats.pending = stat.count;
                    break;
                case 'In Progress':
                    formattedStats.inProgress = stat.count;
                    break;
                case 'Completed':
                    formattedStats.completed = stat.count;
                    break;
            }
        });
        
        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskStats
};
