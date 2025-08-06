const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, authController.login);

// GET /api/auth/profile - Get current user profile (protected route)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;