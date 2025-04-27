const express = require("express");
const mysql = require("mysql2");

const multer = require("multer");

const fs = require("fs"); // Import file system module
const xlsx = require("xlsx");

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});

const upload = multer({ dest: "uploads/" });

// Convert Excel date to normalized UTC date
function excelDateToUTCDate(excelDate) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

router.post("/upload_eligibility", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    if (!sheet.length) {
      return res.status(400).json({ error: "Uploaded file is empty" });
    }

    console.log("Uploaded sheet data:", sheet);

    // Insert data into MySQL

    const insertPromises = sheet.map((row) => {
      const eligibilityName = row.eligibilityName;
      const eligibilityRating = row.eligibilityRating;
      const eligibilityDateOfExam = excelDateToUTCDate(row.eligibilityDateOfExam);
      const formattedDateOfExam = eligibilityDateOfExam.toISOString().split("T")[0];
      const eligibilityPlaceOfExam = row.eligibilityPlaceOfExam;
      const licenseNumber = row.licenseNumber;
      const DateOfValidity = excelDateToUTCDate(row.DateOfValidity);
      const formattedDateOfValidity = DateOfValidity.toISOString().split("T")[0];
      const person_id = row.person_id;

      const sql = "INSERT INTO eligibility_table (eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
      return new Promise((resolve, reject) => {
        db.query(sql, [eligibilityName, eligibilityRating, formattedDateOfExam, eligibilityPlaceOfExam, licenseNumber, formattedDateOfValidity, person_id], (err) => {
          if (err) {
            console.error("Error inserting data:", err);
            return reject(err);
          }
          console.log("Data inserted successfully for:", eligibilityName);
          resolve();
        });
      });
    });

    await Promise.all(insertPromises);
    res.json({ message: "File uploaded and data inserted successfully" });
  } catch (error) {
    console.error("Error processing XLS file:", error);
    res.status(500).json({ error: "Error processing XLS file" });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting uploaded file:", err);
      } else {
        console.log("Uploaded file deleted");
      }
    });
  }
});

//data
router.get("/data", (req, res) => {
  const query = `SELECT * FROM eligibility_table`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

// Read (Get All Eligibility Data)
router.get("/eligibility", (req, res) => {
  const query = "SELECT * FROM eligibility_table";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

// Create (Add New Eligibility)
router.post("/eligibility", (req, res) => {
  const { eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id } = req.body;
  const query = "INSERT INTO eligibility_table (eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id], (err, result) => {
    if (err) {
      console.error("Error adding eligibility:", err);
      return res.status(500).send(err);
    }
    res.status(201).send({ message: "Eligibility created", id: result.insertId });
  });
});

// Update Eligibility Record
router.put("/eligibility/:id", (req, res) => {
  const { eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id } = req.body;
  const { id } = req.params;
  const query = "UPDATE eligibility_table SET eligibilityName = ?, eligibilityRating = ?, eligibilityDateOfExam = ?, eligibilityPlaceOfExam = ?, licenseNumber = ?, DateOfValidity = ?, person_id = ? WHERE id = ?";
  db.query(query, [eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, person_id, id], (err, result) => {
    if (err) {
      console.error("Error updating eligibility:", err);
      return res.status(500).send({ message: "Error updating eligibility" });
    }
    res.status(200).send({ message: "Eligibility record updated" });
  });
});

// Delete Eligibility Record
router.delete("/eligibility/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM eligibility_table WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Eligibility record deleted" });
  });
});

module.exports = router;
