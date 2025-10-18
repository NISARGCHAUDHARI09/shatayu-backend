// Express.js REST API for calendar events using MySQL (mysql2)
// Place this file as backend/events.js or similar

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_mysql_user', // <-- CHANGE THIS
  password: 'your_mysql_password', // <-- CHANGE THIS
  database: 'your_db_name', // <-- CHANGE THIS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Table creation SQL (run once in your DB):
// CREATE TABLE events (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   start_datetime DATETIME NOT NULL,
//   end_datetime DATETIME NOT NULL,
//   event_type ENUM('holiday','treatment','meeting','custom') NOT NULL,
//   doctor_id INT,
//   patient_id INT,
//   created_by INT
// );

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// GET single event by id
app.get('/api/events/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// CREATE new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, start_datetime, end_datetime, event_type, doctor_id, patient_id, created_by } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, start_datetime, end_datetime, event_type, doctor_id, patient_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, start_datetime, end_datetime, event_type, doctor_id, patient_id, created_by]
    );
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data or database error', error: err.message });
  }
});

// UPDATE event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { title, description, start_datetime, end_datetime, event_type, doctor_id, patient_id, created_by } = req.body;
    const [result] = await pool.query(
      'UPDATE events SET title=?, description=?, start_datetime=?, end_datetime=?, event_type=?, doctor_id=?, patient_id=?, created_by=? WHERE id=?',
      [title, description, start_datetime, end_datetime, event_type, doctor_id, patient_id, created_by, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data or database error', error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
