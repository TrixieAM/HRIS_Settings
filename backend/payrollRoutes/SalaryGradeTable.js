const express = require("express");
const router = express.Router();
const mysql = require("mysql2");


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});


// SALARY GRADE TABLE START
// Create
router.post('/salary-grade', (req, res) => {
    const { effectivityDate, sg_number, step1, step2, step3, step4, step5, step6, step7, step8 } = req.body;
   
    const query = 'INSERT INTO salary_grade_table (effectivityDate, sg_number, step1, step2, step3, step4, step5, step6, step7, step8) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [effectivityDate, sg_number, step1, step2, step3, step4, step5, step6, step7, step8];
   
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
      } else {
        res.status(200).send('Salary grade added successfully');
      }
    });
  });
 
 
  // Read (Get all records)
  router.get('/salary-grade', (req, res) => {
    const query = 'SELECT * FROM salary_grade_table';
   
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
      } else {
        res.status(200).json(results);
      }
    });
  });
 
 
  // Update (Update a record by ID)
  router.put('/salary-grade/:id', (req, res) => {
    const { id } = req.params;
    const { effectivityDate, sg_number, step1, step2, step3, step4, step5, step6, step7, step8 } = req.body;
   
    const query = 'UPDATE salary_grade_table SET effectivityDate = ?, sg_number = ?, step1 = ?, step2 = ?, step3 = ?, step4 = ?, step5 = ?, step6 = ?, step7 = ?, step8 = ? WHERE id = ?';
    const values = [effectivityDate, sg_number, step1, step2, step3, step4, step5, step6, step7, step8, id];
   
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
      } else {
        res.status(200).send('Salary grade updated successfully');
      }
    });
  });
 
 
  // Delete (Delete a record by ID)
  router.delete('/salary-grade/:id', (req, res) => {
    const { id } = req.params;
   
    const query = 'DELETE FROM salary_grade_table WHERE id = ?';
   
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
      } else {
        res.status(200).send('Salary grade deleted successfully');
      }
    });
  });


module.exports = router;

