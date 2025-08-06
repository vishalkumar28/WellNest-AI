const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');
const { validateWellnessEntry } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// GET /api/wellness/context/:userId - User wellness context
router.get('/context/:userId', authenticate, wellnessController.getWellnessContext);

// POST /api/wellness/entries - Create wellness entry
router.post('/entries', authenticate, validateWellnessEntry, wellnessController.createWellnessEntry);

// GET /api/wellness/entries/:userId - Get wellness entries for user
router.get('/entries/:userId', authenticate, wellnessController.getWellnessEntries);

// GET /api/wellness/analytics/:userId - Get wellness analytics for user
router.get('/analytics/:userId', authenticate, wellnessController.getWellnessAnalytics);

module.exports = router;