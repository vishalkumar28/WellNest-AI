const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Set environment variables if not loaded from .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_CHI1fq5PdBpl@ep-morning-block-a1btyrr7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
}
if (!process.env.PORT) {
  process.env.PORT = '3001';
}

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'NOT LOADED');
console.log('PORT:', process.env.PORT);

const chatRoutes = require('./routes/chat');
const wellnessRoutes = require('./routes/wellness');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WellNest AI Assistant is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;