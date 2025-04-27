const express = require("express");
const router = express.Router();
const mysql = require("mysql2");


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});


// GET all plantilla
router.get('/plantilla', (req, res) => {
    db.query('SELECT * FROM plantilla_table', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });
 
  // CREATE plantilla
  router.post('/plantilla', (req, res) => {
    const { employeeNumber, plantilla_code, position, salary_grade_id } = req.body;
    const query = 'INSERT INTO plantilla_table (employeeNumber, plantilla_code, position, salary_grade_id) VALUES (?, ?, ?, ?)';
    db.query(query, [employeeNumber, plantilla_code, position, salary_grade_id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, employeeNumber, plantilla_code, position, salary_grade_id });
    });
  });
 
  // UPDATE plantilla
  router.put('/plantilla/:id', (req, res) => {
    const { id } = req.params;
    const { employeeNumber, plantilla_code, position, salary_grade_id } = req.body;
    const query = 'UPDATE plantilla_table SET employeeNumber = ?, plantilla_code = ?, position = ?, salary_grade_id = ? WHERE id = ?';
    db.query(query, [employeeNumber, plantilla_code, position, salary_grade_id, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, employeeNumber, plantilla_code, position, salary_grade_id });
    });
  });
 
  // DELETE plantilla
  router.delete('/plantilla/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM plantilla_table WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Deleted successfully' });
    });
  });

  router.get('/plantillia', (req, res) => {
    const sql = 'SELECT * FROM plantillia_table';
    db.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching data' });
      } else {
        res.json(result);
      }
    });
  });
 


module.exports = router;

