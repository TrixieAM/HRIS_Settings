const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const webtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const xlsx = require("xlsx");
const childrenRouter = require("./dashboardRoutes/Children");
const EligibilityRoute = require("./dashboardRoutes/Eligibility");
const VoluntaryWork = require("./dashboardRoutes/Voluntary");
const CollegeRoute = require("./dashboardRoutes/College");
const VocationalRoute = require("./dashboardRoutes/Vocational");
const PersonalRoute = require("./dashboardRoutes/PersonalInfo");
const WorkExperienceRoute = require("./dashboardRoutes/WorkExperience");
const OtherInformation = require("./dashboardRoutes/OtherSkills");
const AllData = require("./dashboardRoutes/DataRoute");
const Attendance = require("./dashboardRoutes/Attendance");

const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // BAgo
app.use("/childrenAPI", childrenRouter);
app.use("/voluntaryworkRoute", VoluntaryWork);
app.use("/eligibilityRoute", EligibilityRoute);
app.use("/college", CollegeRoute);
app.use("/vocational", VocationalRoute);
app.use("/personalinfo", PersonalRoute);
app.use("/workExperienceRoute", WorkExperienceRoute);
app.use("/otherInfo", OtherInformation);
app.use("/allData", AllData);
app.use("/attendance", Attendance);

//MYSQL CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

//REGISTER
app.post("/register", async (req, res) => {
  const { employeeNumber, username, email, role, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (employeeNumber, username, email, role, password) VALUES (?,?,?,?,?)`;

  db.query(query, [employeeNumber, username, email, role, hashedPass], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "User Registered Successfully" });
  });
});

//LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?
    
    `;

  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(400).send({ message: "User not found or Employee Number does not match" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).send({ message: "Invalid Credentials" });

    const token = webtoken.sign(
      {
        id: user.id,
        username: user.username,
        employeeNumber: user.employeeNumber,
        email: user.email,
        role: user.role,
      },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).send({ token, user: { username: user.username, employeeNumber: user.employeeNumber, email: user.email, role: user.role } });
  });
});

//data
app.get("/data", (req, res) => {
  const query = `SELECT * FROM learning_and_development_table`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

//Read
app.get("/learning_and_development_table", (req, res) => {
  const query = "SELECT * FROM learning_and_development_table";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

//Add
app.post("/learning_and_development_table", (req, res) => {
  const { titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored } = req.body;
  const query = "INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: "Item created", id: result.insertId });
  });
});

//Update
app.put("/learning_and_development_table/:id", (req, res) => {
  const { titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored } = req.body;
  const { id } = req.params;
  const query = "UPDATE learning_and_development_table SET titleOfProgram = ?, dateFrom = ?, dateTo = ?, numberOfHours = ?, typeOfLearningDevelopment = ?, conductedSponsored = ? WHERE id = ?";
  db.query(query, [titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item updated" });
  });
});

//delete
app.delete("/learning_and_development_table/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM learning_and_development_table WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item deleted" });
  });
});

// File uploads
const upload = multer({ dest: "uploads/" });
// Convert Excel date to normalized UTC date
function excelDateToUTCDate(excelDate) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

app.post("/upload_learning_and_development_table", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    // Log the uploaded data for troubleshooting
    console.log("Uploaded employee info data:", sheet);

    // Insert data into MySQL
    sheet.forEach((row) => {
      const titleOfProgram = row.titleOfProgram;
      const dateFrom = excelDateToUTCDate(row.dateFrom);
      const formattedDateFrom = dateFrom.toISOString().split("T")[0];
      const dateTo = excelDateToUTCDate(row.dateTo);
      const formattedDateTo = dateTo.toISOString().split("T")[0];
      const numberOfHours = row.numberOfHours;
      const typeOfLearningDevelopment = row.typeOfLearningDevelopment;
      const conductedSponsored = row.conductedSponsored;

      const query = "INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(query, [titleOfProgram, formattedDateFrom, formattedDateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored], (err, result) => {
        if (err) {
          console.error("Error inserting data into the table", err);
          return;
        }
        console.log("Data inserted into the table successfully:", result);
      });
    });

    // Send response after insertion
    res.json({ message: "Excel file uploaded and data inserted successfully" });
  } catch (error) {
    console.error("Error processing uploaded XLS file:", error);
    res.status(500).json({ error: "Error processing uploaded XLS file" });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting uploaded file:", err);
      } else {
        console.log("Uploaded excel file deleted");
      }
    });
  }
});

// File upload config
const storage = multer.diskStorage({
  destination: "./uploads/", //BAgo
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload1 = multer({ storage });

// Get settings
app.get("/api/settings", (req, res) => {
  db.query("SELECT * FROM settings WHERE id = 1", (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Helper function to delete old logo
const deleteOldLogo = (logoUrl) => {
  if (!logoUrl) return; // If no logo URL, exit early

  const logoPath = path.join(__dirname, logoUrl); // Construct the full path to the logo file
  fs.unlink(logoPath, (err) => {
    if (err) {
      console.error(`Error deleting old logo at ${logoPath}: ${err}`);
    } else {
      console.log(`Previous logo at ${logoPath} deleted successfully.`);
    }
  });
};

// Update settings
app.post("/api/settings", upload1.single("logo"), (req, res) => {
  const companyName = req.body.company_name || "";
  const headerColor = req.body.header_color || "#ffffff";
  const footerText = req.body.footer_text || "";
  const footerColor = req.body.footer_color || "#ffffff";
  const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Check if settings already exist
  db.query("SELECT * FROM settings WHERE id = 1", (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // Existing settings found

      const oldLogoUrl = result[0].logo_url; // Save old logo URL for deletion

      // Update existing settings
      const query = "UPDATE settings SET company_name = ?, header_color = ?, footer_text = ?, footer_color = ?" + (logoUrl ? ", logo_url = ?" : "") + " WHERE id = 1";
      const params = [companyName, headerColor, footerText, footerColor];
      if (logoUrl) params.push(logoUrl);

      db.query(query, params, (err) => {
        if (err) throw err;

        // If there's a new logo, delete the old one
        if (logoUrl && oldLogoUrl) {
          deleteOldLogo(oldLogoUrl);
        }

        res.send({ success: true });
      });
    } else {
      // Insert new settings
      const query = "INSERT INTO settings (company_name, header_color, footer_text, footer_color, logo_url) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [companyName, headerColor, footerText, footerColor, logoUrl], (err) => {
        if (err) throw err;
        res.send({ success: true });
      });
    }
  });
});

// Fetch official time records for a person_id (Monday to Sunday)
app.get("/officialtimetable/:employeeID", (req, res) => {
  const { employeeID } = req.params;
  const sql = "SELECT * FROM officialtime WHERE employeeID = ? ORDER BY id";

  db.query(sql, [employeeID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

app.post("/officialtimetable", (req, res) => {
  const { employeeID, records } = req.body;

  // Insert or update logic
  const sql = `
    INSERT INTO officialtime (
      employeeID, day,
      officialTimeIN,
      officialBreaktimeIN,
      officialBreaktimeOUT,
      officialTimeOUT,
      officialHonorariumTimeIN,
      officialHonorariumTimeOUT,
      officialServiceCreditTimeIN,
      officialServiceCreditTimeOUT,
      officialOverTimeIN,
      officialOverTimeOUT,
      breaktime
    )
    VALUES ? 
    ON DUPLICATE KEY UPDATE 
      officialTimeIN = VALUES(officialTimeIN),
      officialBreaktimeIN = VALUES(officialBreaktimeIN),
      officialBreaktimeOUT = VALUES(officialBreaktimeOUT),
      officialTimeOUT = VALUES(officialTimeOUT),
      officialHonorariumTimeIN = VALUES(officialHonorariumTimeIN),
      officialHonorariumTimeOUT = VALUES(officialHonorariumTimeOUT),
      officialServiceCreditTimeIN = VALUES(officialServiceCreditTimeIN),
      officialServiceCreditTimeOUT = VALUES(officialServiceCreditTimeOUT),
      officialOverTimeIN = VALUES(officialOverTimeIN),
      officialOverTimeOUT = VALUES(officialOverTimeOUT)
  `;

  const values = records.map((r) => [
    employeeID,
    r.day,
    r.officialTimeIN,
    r.officialBreaktimeIN,
    r.officialBreaktimeOUT,
    r.officialTimeOUT,
    r.officialHonorariumTimeIN,
    r.officialHonorariumTimeOUT,
    r.officialServiceCreditTimeIN,
    r.officialServiceCreditTimeOUT,
    r.officialOverTimeIN,
    r.officialOverTimeOUT,
    r.breaktime,
  ]);

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Records saved successfully" });
  });
});

app.listen(5000, () => {
  console.log("Server runnning");
});
