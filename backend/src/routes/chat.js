const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validator');
const { chatLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

// POST /api/chat/send - Main chat endpoint
router.post('/send', authenticate, chatLimiter, validateChatMessage, chatController.sendMessage);

// GET /api/chat/history/:userId - Conversation history
router.get('/history/:userId', authenticate, chatController.getChatHistory);

// POST /api/chat/crisis-check - Crisis detection endpoint
router.post('/crisis-check', authenticate, validateChatMessage, chatController.checkCrisis);

module.exports = router;