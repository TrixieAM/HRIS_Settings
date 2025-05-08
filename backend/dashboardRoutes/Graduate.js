const express = require("express");
const mysql = require("mysql2");

const multer = require("multer");

const fs = require("fs");
const xlsx = require("xlsx");

const router = express.Router();


//MYSQL CONNECTION
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'earist_hris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



// READ - Get all graduate studies
router.get("/graduate-table", (req, res) => {
  const query = "SELECT * FROM graduate_table";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching graduate studies" });
    res.json(results);
  });
});


// CREATE - Add new graduate study
router.post("/graduate-table", (req, res) => {
  console.log("POST Data Received:", req.body);  // Log the received body
  const {
    person_id,
    SchoolName,
    Degree,
    graduatePeriodFrom,
    graduatePeriodTo,
    HighestAttained,
    YearGraduated,
    ScholarshipAcademicHonorsReceived,
  } = req.body;


  const query = `
    INSERT INTO graduate_table
    (person_id, SchoolName, Degree, graduatePeriodFrom, graduatePeriodTo, HighestAttained, YearGraduated, ScholarshipAcademicHonorsReceived)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;


  db.query(query, [
    person_id,
    SchoolName,
    Degree,
    graduatePeriodFrom,
    graduatePeriodTo,
    HighestAttained,
    YearGraduated,
    ScholarshipAcademicHonorsReceived,

  ], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err); // Log the error
      return res.status(500).json({ error: "Error adding graduate study" });
    }
    res.status(201).json({ message: "Graduate study added", id: result.insertId });
  });
});


// UPDATE - Update a graduate study by ID
router.put("/graduate-table/:id", (req, res) => {
  const { id } = req.params;
  const {
    person_id,
    SchoolName,
    Degree,
    graduatePeriodFrom,
    graduatePeriodTo,
    HighestAttained,
    YearGraduated,
    ScholarshipAcademicHonorsReceived,
    
  } = req.body;


  const query = `
    UPDATE graduate_table
    SET  person_id = ?, SchoolName = ?, Degree = ?, graduatePeriodFrom = ?, graduatePeriodTo = ?, HighestAttained = ?, YearGraduated = ?, ScholarshipAcademicHonorsReceived = ?
    WHERE id = ?`;


  db.query(query, [
    person_id,
    SchoolName,
    Degree,
    graduatePeriodFrom,
    graduatePeriodTo,
    HighestAttained,
    YearGraduated,
    ScholarshipAcademicHonorsReceived,
    id,
  ], (err) => {
    if (err) return res.status(500).json({ error: "Error updating graduate study" });
    res.json({ message: "Graduate study updated" });
  });
});


// DELETE - Remove a graduate study by ID
router.delete("/graduate-table/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM graduate_table WHERE id = ?`;
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: "Error deleting graduate study" });
    res.json({ message: "Graduate study deleted" });
  });
});


module.exports = router;



