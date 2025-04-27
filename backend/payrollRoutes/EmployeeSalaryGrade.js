const express = require("express");
const router = express.Router();
const mysql = require("mysql2");


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});


// Get all salary grades
router.get('/employee-salary-grade', (req, res) => {
  db.query('SELECT * FROM employee_salary_grade', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// POST a new record
router.post('/employee-salary-grade', (req, res) => {
  const { employeeNumber, plantilla_id, step, created_at } = req.body;
  if (!employeeNumber || !plantilla_id || step == null || !created_at) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO employee_salary_grade (employeeNumber, plantilla_id, step, created_at) VALUES (?, ?, ?, ?)';
  db.query(sql, [employeeNumber, plantilla_id, step, created_at], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Record added', id: result.insertId });
  });
});


// PUT (update) a record by ID
router.put('/employee-salary-grade/:id', (req, res) => {
  const { employeeNumber, plantilla_id, step, created_at } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE employee_salary_grade SET employeeNumber = ?, plantilla_id = ?, step = ?, created_at = ? WHERE id = ?';
  db.query(sql, [employeeNumber, plantilla_id, step, created_at, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record updated' });
  });
});


// DELETE a record by ID
router.delete('/employee-salary-grade/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM employee_salary_grade WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record deleted' });
  });
});


module.exports = router;



