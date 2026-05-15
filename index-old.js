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
  if (req.url.includes('/api/auth')) {
    console.log(`\n📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('🔧 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📝 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Events API (mock endpoints - replace with database implementation if needed)
app.get('/api/events', async (req, res) => {
  try {
    // TODO: Implement events from SQLite database
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});
app.get('/api/events/:id', async (req, res) => {
  try {
    // TODO: Implement event fetch from SQLite database
    res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});
app.post('/api/events', async (req, res) => {
  try {
    // TODO: Implement event creation in SQLite database
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data or database error', error: err.message });
  }
});
app.put('/api/events/:id', async (req, res) => {
  try {
    // TODO: Implement event update in SQLite database
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data or database error', error: err.message });
  }
});
app.delete('/api/events/:id', async (req, res) => {
  try {
    // TODO: Implement event deletion in SQLite database
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);

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

// User management routes (Admin only)
app.use('/api/users', userRoutes);

// Simple auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = user;
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔧 Initializing Cloudflare D1 connection...`);
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🏥 Hospital Management System API Ready`);
  console.log(`📋 Available routes:`);
  console.log(`   • POST /api/auth/login - User authentication`);
  console.log(`   • GET  /api/users - User management (authenticated)`);
  console.log(`   • GET  /api/health - Health check`);
});

// In-memory Live Consultations data
let liveConsultations = [];
app.get('/api/live-consultations', authenticateToken, (req, res) => {
  res.json(liveConsultations);
});
app.post('/api/live-consultations', authenticateToken, (req, res) => {
  const newConsult = { id: Date.now(), ...req.body };
  liveConsultations.push(newConsult);
  res.status(201).json(newConsult);
});
app.put('/api/live-consultations/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = liveConsultations.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  liveConsultations[idx] = { ...liveConsultations[idx], ...req.body };
  res.json(liveConsultations[idx]);
});
app.delete('/api/live-consultations/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  liveConsultations = liveConsultations.filter(c => c.id !== id);
  res.status(204).end();
});

// In-memory Live Meetings data
let liveMeetings = [];
app.get('/api/live-meetings', authenticateToken, (req, res) => {
  res.json(liveMeetings);
});
app.post('/api/live-meetings', authenticateToken, (req, res) => {
  const newMeeting = { id: Date.now(), ...req.body };
  liveMeetings.push(newMeeting);
  res.status(201).json(newMeeting);
});
app.put('/api/live-meetings/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = liveMeetings.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  liveMeetings[idx] = { ...liveMeetings[idx], ...req.body };
  res.json(liveMeetings[idx]);
});
app.delete('/api/live-meetings/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  liveMeetings = liveMeetings.filter(m => m.id !== id);
  res.status(204).end();
});

// In-memory Inventory data
let inventory = [];
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});
app.post('/api/inventory', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  inventory.push(newItem);
  res.status(201).json(newItem);
});
app.put('/api/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = inventory.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  inventory[idx] = { ...inventory[idx], ...req.body };
  res.json(inventory[idx]);
});
app.delete('/api/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);
  inventory = inventory.filter(i => i.id !== id);
  res.status(204).end();
});


// In-memory Suppliers data
let suppliers = [
  {
    id: 1,
    name: 'Himalaya Wellness',
    contact: 'Mr. Sharma',
    address: 'Bangalore, India',
    email: 'contact@himalayawellness.com',
    phone: '+91 9876543210'
  },
  {
    id: 2,
    name: 'Patanjali Ayurved',
    contact: 'Ms. Gupta',
    address: 'Haridwar, India',
    email: 'info@patanjaliayurved.org',
    phone: '+91 9876543211'
  }
];

// Suppliers Endpoints
app.get('/api/suppliers', (req, res) => {
  res.json(suppliers);
});
app.post('/api/suppliers', (req, res) => {
  const newSupplier = { id: Date.now(), ...req.body };
  suppliers.push(newSupplier);
  res.status(201).json(newSupplier);
});
app.put('/api/suppliers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  suppliers[idx] = { ...suppliers[idx], ...req.body };
  res.json(suppliers[idx]);
});
app.delete('/api/suppliers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  suppliers = suppliers.filter(s => s.id !== id);
  res.status(204).end();
});

// In-memory Billing data
let billing = [
  {
    id: 1,
    invoiceId: 'INV-1001',
    patientName: 'Rajesh Kumar',
    patientId: '10001',
    phone: '+91 9876543210',
    services: ['Consultation', 'X-Ray'],
    amount: 1200,
    paid: 1200,
    status: 'Paid',
    paymentMethod: 'cash',
    date: '2025-09-10',
    notes: 'N/A'
  },
  {
    id: 2,
    invoiceId: 'INV-1002',
    patientName: 'Priya Sharma',
    patientId: '10002',
    phone: '+91 9876543211',
    services: ['Blood Test'],
    amount: 800,
    paid: 500,
    status: 'Partial',
    paymentMethod: 'card',
    date: '2025-09-12',
    notes: 'Pending payment'
  },
  {
    id: 3,
    invoiceId: 'INV-1003',
    patientName: 'Amit Patel',
    patientId: '10003',
    phone: '+91 9876543212',
    services: ['MRI Scan'],
    amount: 5000,
    paid: 0,
    status: 'Pending',
    paymentMethod: 'upi',
    date: '2025-09-15',
    notes: 'Awaiting payment'
  }
];
app.get('/api/billing', (req, res) => {
  res.json(billing);
});
app.post('/api/billing', (req, res) => {
  const newBill = { id: Date.now(), ...req.body };
  billing.push(newBill);
  res.status(201).json(newBill);
});
app.put('/api/billing/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = billing.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  billing[idx] = { ...billing[idx], ...req.body };
  res.json(billing[idx]);
});
app.delete('/api/billing/:id', (req, res) => {
  const id = parseInt(req.params.id);
  billing = billing.filter(b => b.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
