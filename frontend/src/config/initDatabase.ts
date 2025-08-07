// This file is only meant to be run in a Node.js environment
import fs from 'fs';
import path from 'path';

// Dynamic import to avoid browser issues
let pool;
try {
  const { pool: dbPool } = require('./database');
  pool = dbPool;
} catch (error) {
  console.error('Error loading database module:', error);
  // Create a mock pool for browser environment
  pool = {
    query: async () => ({ rows: [] })
  };
}

export const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}