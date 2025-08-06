const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_CHI1fq5PdBpl@ep-morning-block-a1btyrr7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the pool for use in other modules
module.exports = pool;