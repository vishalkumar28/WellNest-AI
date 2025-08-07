import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_CHI1fq5PdBpl@ep-morning-block-a1btyrr7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };