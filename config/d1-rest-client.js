// backend/config/d1-rest-client.js
// Cloudflare D1 REST API client for Node.js backend
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Extract account ID and database ID from D1_DATABASE_URL
const D1_URL = process.env.D1_DATABASE_URL;
const CF_API_TOKEN = process.env.CF_API_TOKEN || process.env.D1_AUTH_TOKEN;

let ACCOUNT_ID = null;
let DATABASE_ID = null;

// Parse D1 URL (e.g., https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{DATABASE_ID}/query)
if (D1_URL) {
  const match = D1_URL.match(/accounts\/([a-f0-9]+)\/d1\/database\/([a-f0-9-]+)/);
  if (match) {
    ACCOUNT_ID = match[1];
    DATABASE_ID = match[2];
  }
}

// Check essential configuration
if (!ACCOUNT_ID || !DATABASE_ID || !CF_API_TOKEN) {
  console.error('⚠️  Cloudflare D1 configuration incomplete!');
  console.error('Required environment variables:');
  console.error('  - D1_DATABASE_URL:', D1_URL ? '✓' : '✗');
  console.error('  - CF_API_TOKEN or D1_AUTH_TOKEN:', CF_API_TOKEN ? '✓' : '✗');
  if (D1_URL && (!ACCOUNT_ID || !DATABASE_ID)) {
    console.error('  - Could not parse account/database ID from D1_DATABASE_URL');
  }
}

// Construct Cloudflare API endpoint
const getApiUrl = () =>
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

/**
 * 🔧 Execute SQL query via Cloudflare D1 REST API
 * @param {string} sql - SQL statement
 * @param {array} params - SQL parameters (optional)
 * @returns {Promise<object>} normalized result object
 */
export const queryD1 = async (sql, params = []) => {
  if (!ACCOUNT_ID || !DATABASE_ID || !CF_API_TOKEN) {
    throw new Error('Cloudflare D1 is not properly configured');
  }

  try {
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok || !data.success) {
      const msg = data.errors?.[0]?.message || response.statusText || 'Unknown error';
      throw new Error(`D1 Query Failed: ${msg}`);
    }

    // ✅ Normalize result structure (handles variations in API responses)
    const resultSet = Array.isArray(data.result)
      ? data.result[0]
      : data.result;

    const rows =
      resultSet?.results ||
      resultSet?.rows ||
      data.result?.rows ||
      [];

    return {
      results: rows,
      meta: resultSet?.meta || {},
      success: true,
    };
  } catch (error) {
    console.error('❌ D1 Query Error:', error.message);
    throw error;
  }
};

/**
 * 🚀 Run multiple SQL queries in a batch
 * @param {Array<{sql:string, params:array}>} queries
 */
export const batchD1 = async (queries = []) => {
  if (!ACCOUNT_ID || !DATABASE_ID || !CF_API_TOKEN) {
    throw new Error('Cloudflare D1 is not properly configured');
  }

  try {
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        queries.map(q => ({ sql: q.sql, params: q.params || [] }))
      ),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const msg = data.errors?.[0]?.message || response.statusText || 'Unknown error';
      throw new Error(`D1 Batch Failed: ${msg}`);
    }

    return data.result || [];
  } catch (error) {
    console.error('❌ D1 Batch Error:', error.message);
    throw error;
  }
};

/**
 * 🔍 Helper: Query all rows
 */
export const query = async (sql, params = []) => {
  const result = await queryD1(sql, params);
  return result.results || [];
};

/**
 * 🔍 Helper: Query first single row
 */
export const queryOne = async (sql, params = []) => {
  console.log('🔍 D1 queryOne SQL:', sql);
  console.log('🔍 D1 queryOne Params:', params);

  const result = await queryD1(sql, params);

  console.log('📊 D1 queryOne Raw:', JSON.stringify(result, null, 2));

  return result.results?.[0] || null;
};

/**
 * ✏️ Helper: Execute non-select queries (INSERT/UPDATE/DELETE)
 */
export const execute = async (sql, params = []) => {
  const result = await queryD1(sql, params);
  return {
    changes: result.meta?.changes || 0,
    lastRowId: result.meta?.last_row_id || null,
    success: result.success,
  };
};

/**
 * ✅ Test connection to Cloudflare D1
 */
export const testConnection = async () => {
  try {
    const test = await queryD1('SELECT 1 as test');
    console.log('✅ Cloudflare D1 connection successful');
    return test;
  } catch (err) {
    console.error('❌ Cloudflare D1 connection failed:', err.message);
    return false;
  }
};

/**
 * 🔧 Initialize D1 setup
 */
export const initDatabase = async () => {
  console.log('🔧 Initializing Cloudflare D1 connection...');
  if (!ACCOUNT_ID || !DATABASE_ID || !CF_API_TOKEN) {
    throw new Error('Missing D1 configuration. Check your .env file.');
  }
  console.log(`✅ Account ID: ${ACCOUNT_ID}`);
  console.log(`✅ Database ID: ${DATABASE_ID}`);
  return true;
};

// Default export
export default {
  queryD1,
  batchD1,
  query,
  queryOne,
  execute,
  testConnection,
  initDatabase,
};
