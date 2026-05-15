// backend/config/cloudflare-d1.js
// Cloudflare D1 database connection configuration
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

// Check if D1 credentials are provided
const D1_URL = process.env.D1_DATABASE_URL || process.env.CLOUDFLARE_D1_URL;
const D1_TOKEN = process.env.D1_AUTH_TOKEN || process.env.CLOUDFLARE_D1_TOKEN;

if (!D1_URL || !D1_TOKEN) {
  console.error('⚠️  Cloudflare D1 credentials not found!');
  console.error('Please set the following environment variables:');
  console.error('  - D1_DATABASE_URL (your D1 database URL)');
  console.error('  - D1_AUTH_TOKEN (your D1 auth token)');
  console.error('\nYou can get these from your Cloudflare dashboard:');
  console.error('  1. Go to https://dash.cloudflare.com/');
  console.error('  2. Navigate to Workers & Pages > D1');
  console.error('  3. Select your database');
  console.error('  4. Copy the connection URL and auth token');
}

// Create Cloudflare D1 client
let db = null;

export const initDatabase = async () => {
  if (!D1_URL || !D1_TOKEN) {
    throw new Error('Cloudflare D1 credentials are required');
  }

  db = createClient({
    url: D1_URL,
    authToken: D1_TOKEN,
  });

  console.log('✅ Connected to Cloudflare D1 database');
  return db;
};

// Get database instance
export const getDb = async () => {
  if (!db) {
    await initDatabase();
  }
  return db;
};

// Test connection
export const testConnection = async () => {
  try {
    const database = await getDb();
    await database.execute('SELECT 1');
    console.log('✅ Cloudflare D1 connection successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudflare D1 connection failed:', error.message);
    return false;
  }
};

// Execute a query (INSERT, UPDATE, DELETE)
export const execute = async (sql, params = []) => {
  try {
    const database = await getDb();
    const result = await database.execute({
      sql,
      args: params,
    });
    return result;
  } catch (error) {
    console.error('Database execute error:', error.message);
    throw error;
  }
};

// Query multiple rows
export const query = async (sql, params = []) => {
  try {
    const database = await getDb();
    const result = await database.execute({
      sql,
      args: params,
    });
    return result.rows || [];
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

// Query single row
export const queryOne = async (sql, params = []) => {
  try {
    const database = await getDb();
    const result = await database.execute({
      sql,
      args: params,
    });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Database queryOne error:', error.message);
    throw error;
  }
};

// Batch execute multiple queries
export const batch = async (queries) => {
  try {
    const database = await getDb();
    const result = await database.batch(queries);
    return result;
  } catch (error) {
    console.error('Database batch error:', error.message);
    throw error;
  }
};

export default { initDatabase, getDb, testConnection, execute, query, queryOne, batch };
