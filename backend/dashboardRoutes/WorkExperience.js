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

router.get("/work-experience-table", (req, res) => {
  const query = "SELECT * FROM work_experience_table";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

router.post("/work-experience-table", (req, res) => {
  const { person_id, workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, SalaryJobOrPayGrade, StatusOfAppointment, isGovtService } = req.body;

  const query = "INSERT INTO work_experience_table (person_id, workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, SalaryJobOrPayGrade, StatusOfAppointment, isGovtService) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [person_id, workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, SalaryJobOrPayGrade, StatusOfAppointment, isGovtService], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: "Item created", id: result.insertId });
  });
});

router.put("/work-experience-table/:id", (req, res) => {
  const { person_id, workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, SalaryJobOrPayGrade, StatusOfAppointment, isGovtService } = req.body;
  const { id } = req.params;

  const query = "UPDATE work_experience_table SET person_id = ?, workDateFrom = ?, workDateTo = ?, workPositionTitle = ?, workCompany = ?, workMonthlySalary = ?, SalaryJobOrPayGrade = ?, StatusOfAppointment = ?, isGovtService = ? WHERE id = ?";

  db.query(query, [person_id, workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, SalaryJobOrPayGrade, StatusOfAppointment, isGovtService, id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item updated" });
  });
});

router.delete("/work-experience-table/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM work_experience_table WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item deleted" });
  });
});

module.exports = router;
