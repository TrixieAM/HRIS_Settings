const express = require("express");
const multer = require("multer");
const fs = require("fs"); // Import file system module
const router = express.Router();
const mysql = require("mysql2");
const xlsx = require("xlsx");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});

// CRUD for Children
router.get("/children-table", (req, res) => {
  const query = "SELECT * FROM children_table";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching children" });
    res.json(results);
  });
});

router.post("/children-table", (req, res) => {
  const { childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id } = req.body;
  const query = `INSERT INTO children_table (childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error adding child" });
    res.status(201).json({ message: "Child added", id: result.insertId });
  });
});

router.put("/children-table/:id", (req, res) => {
  const { id } = req.params;
  const { childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id } = req.body;
  const query = `UPDATE children_table SET childrenFirstName = ?, childrenMiddleName = ?, childrenLastName = ?, childrenNameExtension = ?, dateOfBirth = ?, person_id = ? WHERE id = ?`;
  db.query(query, [childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id, id], (err) => {
    if (err) return res.status(500).json({ error: "Error updating child" });
    res.json({ message: "Child updated" });
  });
});

router.delete("/children-table/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM children_table WHERE id = ?`;
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: "Error deleting child" });
    res.json({ message: "Child deleted" });
  });
});

module.exports = router;
