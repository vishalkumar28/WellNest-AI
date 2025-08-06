import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_CHI1fq5PdBpl@ep-morning-block-a1btyrr7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful!');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../src/config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
    
    // Test by querying the demo user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', ['demo@wellnest.com']);
    console.log('Demo user found:', result.rows.length > 0);
    
    // Test wellness entries
    const entriesResult = await pool.query('SELECT COUNT(*) FROM wellness_entries');
    console.log('Wellness entries count:', entriesResult.rows[0].count);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run initialization
initDatabase()
  .then(() => {
    console.log('Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });