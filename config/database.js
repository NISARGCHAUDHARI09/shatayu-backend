// backend/config/database.js
// Cloudflare D1 / SQLite database connection configuration
import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (local D1-compatible SQLite)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/hospital.db');

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQL.js database
let db = null;

export const initDatabase = async () => {
  const SQL = await initSqlJs();
  
  try {
    // Try to load existing database
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } catch (error) {
    // Create new database if doesn't exist
    db = new SQL.Database();
  }
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');
  
  return db;
};

// Save database to file
export const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
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
    database.exec('SELECT 1');
    console.log('✅ Database connected successfully');
    console.log(`📁 Database location: ${DB_PATH}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Helper functions for D1-style query execution
export const execute = async (sql, params = []) => {
  try {
    const database = await getDb();
    database.run(sql, params);
    saveDatabase();
    return { changes: database.getRowsModified() };
  } catch (error) {
    console.error('Database execute error:', error.message);
    throw error;
  }
};

export const query = async (sql, params = []) => {
  try {
    const database = await getDb();
    const stmt = database.prepare(sql);
    stmt.bind(params);
    
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

export const queryOne = async (sql, params = []) => {
  try {
    const database = await getDb();
    const stmt = database.prepare(sql);
    stmt.bind(params);
    
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    
    return result;
  } catch (error) {
    console.error('Database queryOne error:', error.message);
    throw error;
  }
};

export default db;
