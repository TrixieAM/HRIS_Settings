// backend/routes/leaveRequest.js

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// MYSQL CONNECTION
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'earist_hris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// LEAVE TABLE ROUTES
// GET all leave types
router.get('/leave_table', (req, res) => {
  db.query('SELECT * FROM leave_table', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// CREATE a new leave type
router.post('/leave_table', (req, res) => {
  const { leave_description, leave_code, leave_hours } = req.body;
  const query = 'INSERT INTO leave_table (leave_description, leave_code, leave_hours) VALUES (?, ?, ?)';
  db.query(query, [leave_description, leave_code, leave_hours], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, leave_description, leave_code, leave_hours });
  });
});

// UPDATE a leave type
router.put('/leave_table/:id', (req, res) => {
  const { id } = req.params;
  const { leave_description, leave_code, leave_hours } = req.body;
  const query = 'UPDATE leave_table SET leave_description = ?, leave_code = ?, leave_hours = ? WHERE id = ?';
  db.query(query, [leave_description, leave_code, leave_hours, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, leave_description, leave_code, leave_hours });
  });
});

// DELETE a leave type
router.delete('/leave_table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM leave_table WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted successfully' });
  });
});

// LEAVE ASSIGNMENT ROUTES
// GET all leave assignments
router.get('/leave_assignment', (req, res) => {
  db.query('SELECT * FROM leave_assignment', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// CREATE a new leave assignment
router.post('/leave_assignment', (req, res) => {
  const { leave_code, employeeNumber } = req.body;
  const query = 'INSERT INTO leave_assignment (leave_code, employeeNumber) VALUES (?, ?)';
  db.query(query, [leave_code, employeeNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, leave_code, employeeNumber });
  });
});

// UPDATE a leave assignment
router.put('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;
  const { leave_code, employeeNumber } = req.body;
  const query = 'UPDATE leave_assignment SET leave_code = ?, employeeNumber = ? WHERE id = ?';
  db.query(query, [leave_code, employeeNumber, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, leave_code, employeeNumber });
  });
});

// DELETE a leave assignment
router.delete('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM leave_assignment WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted successfully' });
  });
});

// GET all leave requests
router.get('/leave_request', (req, res) => {
  db.query('SELECT * FROM leave_request', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// CREATE a new leave request
router.post('/leave_request', (req, res) => {
  const { employeeNumber, leave_code, leave_date, status } = req.body;
  
  // Validate status value
  const validStatuses = ['0', '1', '2', '3'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const query = 'INSERT INTO leave_request (employeeNumber, leave_code, leave_date, status) VALUES (?, ?, ?, ?)';
  db.query(query, [employeeNumber, leave_code, leave_date, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, employeeNumber, leave_code, leave_date, status });
  });
});

// UPDATE a leave request
router.put('/leave_request/:id', (req, res) => {
  const { id } = req.params;
  const { employeeNumber, leave_code, leave_date, status } = req.body;

  // Validate status value
  const validStatuses = ['0', '1', '2', '3'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const query = 'UPDATE leave_request SET employeeNumber = ?, leave_code = ?, leave_date = ?, status = ? WHERE id = ?';
  db.query(query, [employeeNumber, leave_code, leave_date, status, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, employeeNumber, leave_code, leave_date, status });
  });
});

// DELETE a leave request
router.delete('/leave_request/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM leave_request WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted successfully' });
  });
});

module.exports = router;