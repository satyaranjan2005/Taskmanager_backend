const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');

// All user routes require authentication
router.use(auth);

// GET /api/users/profile - Get user profile
router.get('/profile', getProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', updateProfile);

// PUT /api/users/change-password - Change password
router.put('/change-password', changePassword);

module.exports = router;
