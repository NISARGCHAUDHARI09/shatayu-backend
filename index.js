import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Using Cloudflare D1 REST API client
import { initDatabase, testConnection } from './config/d1-rest-client.js';
import staffRoutes from './routes/staffroutes.js';
import inventoryRoutes from './routes/inventoryroutes.js';
import ipdRoutes from './routes/ipdroutes.js';
import opdRoutes from './routes/opdroutes.js';
import medicineVedicRoutes from './routes/medicineVedicRoutes.js';
import medicineCustomRoutes from './routes/medicineCustomRoutes.js';
import medicineBillRoutes from './routes/medicinebillroutes.js';
import medicineDraftRoutes from './routes/medicinedraftroutes.js';
import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import billingRoutes from './routes/billingroutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = 'hardcoded_secret_for_demo';

// Initialize Cloudflare D1 database on startup
await initDatabase();
await testConnection();

// IMPORTANT: Apply middleware BEFORE routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  if (req.url.includes('/api/auth') || req.url.includes('/api/users')) {
    console.log(`\n📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('🔧 Headers:', JSON.stringify(req.headers, null, 2));
    if (req.method !== 'GET') {
      console.log('📝 Body:', JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Events API (placeholder - implement with database as needed)
app.get('/api/events', async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);

// User management routes (Admin only)
app.use('/api/users', userRoutes);

// Patient management routes
app.use('/api/opd', opdRoutes);
app.use('/api/ipd', ipdRoutes);

// Staff routes
app.use('/api/staff', staffRoutes);

// Inventory routes
app.use('/api/inventory', inventoryRoutes);

// Medicine routes
app.use('/api/medicines/vedic', medicineVedicRoutes);
app.use('/api/medicines/custom', medicineCustomRoutes);

// Medicine Bill routes
app.use('/api/medicine-bills', medicineBillRoutes);

// Medicine Draft routes
app.use('/api/medicine-drafts', medicineDraftRoutes);

// Billing routes
app.use('/api/billing', billingRoutes);

// Simple auth middleware for other routes that need it
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🔧 Initializing Cloudflare D1 connection...`);
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🏥 Hospital Management System API Ready`);
  console.log(`📋 Available routes:`);
  console.log(`   • GET  /api/health - Health check`);
  console.log(`   • POST /api/auth/login - User authentication`);
  console.log(`   • GET  /api/users - User management (authenticated)`);
  console.log(`   • POST /api/users - Create user (authenticated)`);
  console.log(`   • PUT  /api/users/:id - Update user (authenticated)`);
  console.log(`   • DELETE /api/users/:id - Delete user (authenticated)`);
  console.log(`   • GET  /api/users/statistics - User statistics (authenticated)`);
});