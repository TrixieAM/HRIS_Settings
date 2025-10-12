const db = require("../db");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const xlsx = require("xlsx");


const router = express.Router();





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
  console.log("POST Data Received:", req.body);


  const {
    person_id,
    graduateNameOfSchool,
    graduateDegree,
    graduatePeriodFrom,
    graduatePeriodTo,
    graduateHighestAttained,
    graduateYearGraduated,
    graduateScholarshipAcademicHonorsReceived,
  } = req.body;


  const query = `
    INSERT INTO graduate_table (
      person_id,
      graduateNameOfSchool,
      graduateDegree,
      graduatePeriodFrom,
      graduatePeriodTo,
      graduateHighestAttained,
      graduateYearGraduated,
      graduateScholarshipAcademicHonorsReceived
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(query, [
    person_id,
    graduateNameOfSchool,
    graduateDegree,
    graduatePeriodFrom,
    graduatePeriodTo,
    graduateHighestAttained,
    graduateYearGraduated,
    graduateScholarshipAcademicHonorsReceived,
  ], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
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
    graduateNameOfSchool,
    graduateDegree,
    graduatePeriodFrom,
    graduatePeriodTo,
    graduateHighestAttained,
    graduateYearGraduated,
    graduateScholarshipAcademicHonorsReceived,
  } = req.body;


  const query = `
    UPDATE graduate_table SET
      person_id = ?,
      graduateNameOfSchool = ?,
      graduateDegree = ?,
      graduatePeriodFrom = ?,
      graduatePeriodTo = ?,
      graduateHighestAttained = ?,
      graduateYearGraduated = ?,
      graduateScholarshipAcademicHonorsReceived = ?
    WHERE id = ?
  `;


  db.query(query, [
    person_id,
    graduateNameOfSchool,
    graduateDegree,
    graduatePeriodFrom,
    graduatePeriodTo,
    graduateHighestAttained,
    graduateYearGraduated,
    graduateScholarshipAcademicHonorsReceived,
    id,
  ], (err) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Error updating graduate study" });
    }
    res.json({ message: "Graduate study updated" });
  });
});


// DELETE - Remove a graduate study by ID
router.delete("/graduate-table/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM graduate_table WHERE id = ?`;
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Error deleting graduate study" });
    }
    res.json({ message: "Graduate study deleted" });
  });
});


module.exports = router;



