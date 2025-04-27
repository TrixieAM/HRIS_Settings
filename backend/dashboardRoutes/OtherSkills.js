const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});

router.get("/other-information", (req, res) => {
  const query = "SELECT * FROM other_information_table";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

router.post("/other-information", (req, res) => {
  const { specialSkills, nonAcademicDistinctions, membershipInAssociation, person_id } = req.body;
  const query = "INSERT INTO other_information_table (specialSkills, nonAcademicDistinctions, membershipInAssociation, person_id) VALUES (?, ?, ?, ?)";
  db.query(query, [specialSkills, nonAcademicDistinctions, membershipInAssociation, person_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: "Record created", id: result.insertId });
  });
});

router.put("/other-information/:id", (req, res) => {
  const { specialSkills, nonAcademicDistinctions, membershipInAssociation, person_id } = req.body;
  const { id } = req.params;

  const query = "UPDATE other_information_table SET specialSkills = ?, nonAcademicDistinctions = ?, membershipInAssociation = ?, person_id = ? WHERE id = ?";

  db.query(query, [specialSkills, nonAcademicDistinctions, membershipInAssociation, person_id, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item updated" });
  });
});

router.delete("/other-information/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM other_information_table WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item deleted" });
  });
});

module.exports = router;
