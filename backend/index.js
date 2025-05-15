const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');




const fileUpload = require('express-fileupload');




const webtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser');
const xlsx = require('xlsx');
const childrenRouter = require('./dashboardRoutes/Children');




const EligibilityRoute = require('./dashboardRoutes/Eligibility');
const VoluntaryWork = require('./dashboardRoutes/Voluntary');
const CollegeRoute = require('./dashboardRoutes/College');
const VocationalRoute = require('./dashboardRoutes/Vocational');
const PersonalRoute = require('./dashboardRoutes/PersonalInfo');
const WorkExperienceRoute = require('./dashboardRoutes/WorkExperience');
const OtherInfo = require('./dashboardRoutes/OtherSkills');
const GraduateRoute = require('./dashboardRoutes/Graduate')

const AllData = require('./dashboardRoutes/DataRoute');
const Attendance = require('./dashboardRoutes/Attendance');




const EmployeeSalaryGrade = require('./payrollRoutes/EmployeeSalaryGrade');
const PlantillaTable = require('./payrollRoutes/PlantilliaTable');
const SalaryGradeTable = require('./payrollRoutes/SalaryGradeTable');
const Remittance = require('./payrollRoutes/Remittance');




const app = express();




//MIDDLEWARE
app.use(fileUpload());
app.use(express.json());




app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // BAgo
app.use('/ChildrenRoute', childrenRouter);
app.use('/VoluntaryRoute', VoluntaryWork);
app.use('/eligibilityRoute', EligibilityRoute);
app.use('/college', CollegeRoute);
app.use('/GraduateRoute', GraduateRoute);
app.use('/vocational', VocationalRoute);
app.use('/personalinfo', PersonalRoute);
app.use('/WorkExperienceRoute', WorkExperienceRoute);
app.use('/OtherInfo', OtherInfo);


app.use('/allData', AllData);
app.use('/attendance', Attendance);


app.use('/EmployeeSalaryGrade', EmployeeSalaryGrade);
app.use('/PlantillaTable', PlantillaTable);
app.use('/SalaryGradeTable', SalaryGradeTable);
app.use('/Remittance', Remittance);









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




module.exports = db;












// Test connection
//db.getConnection((err, connection) => {
  //if (err) {
  //  console.error("Database connection failed:", err);
    //return;
  //}
  //console.log("Database Connected");
  //connection.release(); // Important: release connection back to the pool
//});




// REGISTER
app.post("/register", async (req, res) => {
  const { username, password, employeeNumber } = req.body;


  try {
    // hash the password
    const hashedPass = await bcrypt.hash(password, 10);


    const query = `
      INSERT INTO users (
        username,
        role,
        password,
        employeeNumber,
        employmentCategory,
        access_level
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;


     db.query(query, [
      username,
      'staff',       // default role
      hashedPass,
      employeeNumber,
      1,             // default employmentCategory
      'user'         // default access_level
    ]);


    res.status(200).send({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send({ error: "Failed to register user" });
  }
});





//LOGIN
app.post('/login', (req, res) => {
  const { employeeNumber, password } = req.body;


  const query = `SELECT * FROM users WHERE employeeNumber = ?
   
    `;
  db.query(query, [employeeNumber], async (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0)
      return res
        .status(400)
        .send({ message: 'User not found or Employee Number does not match' });




    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);




    if (!isMatch)
      return res.status(400).send({ message: 'Invalid Credentials' });




    const token = webtoken.sign(
      {
        id: user.id,
        username: user.username,
        employeeNumber: user.employeeNumber,
        email: user.email,
        role: user.role,
      },
      'secret',
      { expiresIn: '1h' }
    );
    res.status(200).send({
      token,
      email: user.email,
      role: user.role,
      employeeNumber: user.employeeNumber,
    });
  });
});




//data
app.get('/data', (req, res) => {
  const query = `SELECT * FROM learning_and_development_table`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});




//Read
app.get('/learning_and_development_table', (req, res) => {
  const query = 'SELECT * FROM learning_and_development_table';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});




//Add
app.post('/learning_and_development_table', (req, res) => {
  const {
    titleOfProgram,
    dateFrom,
    dateTo,
    numberOfHours,
    typeOfLearningDevelopment,
    conductedSponsored,
    person_id,
  } = req.body;
  const query =
    'INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored, person_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(
    query,
    [
      titleOfProgram,
      dateFrom,
      dateTo,
      numberOfHours,
      typeOfLearningDevelopment,
      conductedSponsored,
      person_id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: 'Item created', id: result.insertId });
    }
  );
});




//Update
app.put('/learning_and_development_table/:id', (req, res) => {
  const {
    titleOfProgram,
    dateFrom,
    dateTo,
    numberOfHours,
    typeOfLearningDevelopment,
    conductedSponsored,
    person_id,
  } = req.body;
  const { id } = req.params;
  const query =
    'UPDATE learning_and_development_table SET titleOfProgram = ?, dateFrom = ?, dateTo = ?, numberOfHours = ?, typeOfLearningDevelopment = ?, conductedSponsored = ?, person_id = ? WHERE id = ?';
  db.query(
    query,
    [
      titleOfProgram,
      dateFrom,
      dateTo,
      numberOfHours,
      typeOfLearningDevelopment,
      conductedSponsored,
      person_id,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item updated' });
    }
  );
});




//delete
app.delete('/learning_and_development_table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM learning_and_development_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Item deleted' });
  });
});




// File uploads
const upload = multer({ dest: 'uploads/' });
// Convert Excel date to normalized UTC date
function excelDateToUTCDate(excelDate) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}




app.post(
  '/upload_learning_and_development_table',
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }




    try {
      // Read the uploaded XLS file
      const workbook = xlsx.readFile(req.file.path);
      const sheet_name = workbook.SheetNames[0];
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);




      // Log the uploaded data for troubleshooting
      console.log('Uploaded employee info data:', sheet);




      // Insert data into MySQL
      sheet.forEach((row) => {
        const titleOfProgram = row.titleOfProgram;
        const dateFrom = excelDateToUTCDate(row.dateFrom);
        const formattedDateFrom = dateFrom.toISOString().split('T')[0];
        const dateTo = excelDateToUTCDate(row.dateTo);
        const formattedDateTo = dateTo.toISOString().split('T')[0];
        const numberOfHours = row.numberOfHours;
        const typeOfLearningDevelopment = row.typeOfLearningDevelopment;
        const conductedSponsored = row.conductedSponsored;




        const query =
          'INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(
          query,
          [
            titleOfProgram,
            formattedDateFrom,
            formattedDateTo,
            numberOfHours,
            typeOfLearningDevelopment,
            conductedSponsored,
          ],
          (err, result) => {
            if (err) {
              console.error('Error inserting data into the table', err);
              return;
            }
            console.log('Data inserted into the table successfully:', result);
          }
        );
      });




      // Send response after insertion
      res.json({
        message: 'Excel file uploaded and data inserted successfully',
      });
    } catch (error) {
      console.error('Error processing uploaded XLS file:', error);
      res.status(500).json({ error: 'Error processing uploaded XLS file' });
    } finally {
      // Delete the uploaded file to save space on the server
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting uploaded file:', err);
        } else {
          console.log('Uploaded excel file deleted');
        }
      });
    }
  }
);




// File upload config
const storage = multer.diskStorage({
  destination: './uploads/', //BAgo
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});




const upload1 = multer({ storage });




// Get settings
app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM settings WHERE id = 1', (err, result) => {
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
app.post('/api/settings', upload1.single('logo'), (req, res) => {
  const companyName = req.body.company_name || '';
  const headerColor = req.body.header_color || '#ffffff';
  const footerText = req.body.footer_text || '';
  const footerColor = req.body.footer_color || '#ffffff';
  const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;




  // Check if settings already exist
  db.query('SELECT * FROM settings WHERE id = 1', (err, result) => {
    if (err) throw err;




    if (result.length > 0) {
      // Existing settings found




      const oldLogoUrl = result[0].logo_url; // Save old logo URL for deletion




      // Update existing settings
      const query =
        'UPDATE settings SET company_name = ?, header_color = ?, footer_text = ?, footer_color = ?' +
        (logoUrl ? ', logo_url = ?' : '') +
        ' WHERE id = 1';
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
      const query =
        'INSERT INTO settings (company_name, header_color, footer_text, footer_color, logo_url) VALUES (?, ?, ?, ?, ?)';
      db.query(
        query,
        [companyName, headerColor, footerText, footerColor, logoUrl],
        (err) => {
          if (err) throw err;
          res.send({ success: true });
        }
      );
    }
  });
});




// Fetch official time records for a person_id (Monday to Sunday)
app.get('/officialtimetable/:employeeID', (req, res) => {
  const { employeeID } = req.params;
  const sql = 'SELECT * FROM officialtime WHERE employeeID = ? ORDER BY id';




  db.query(sql, [employeeID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });




    res.json(results);
  });
});




// app.post("/officialtimetable", (req, res) => {
//   const { employeeID, records } = req.body;




//   // Insert or update logic
//   const sql = `
//     INSERT INTO officialtime (
//       employeeID, day,
//       officialTimeIN,
//       officialBreaktimeIN,
//       officialBreaktimeOUT,
//       officialTimeOUT,
//       officialHonorariumTimeIN,
//       officialHonorariumTimeOUT,
//       officialServiceCreditTimeIN,
//       officialServiceCreditTimeOUT,
//       officialOverTimeIN,
//       officialOverTimeOUT,
//       breaktime
//     )
//     VALUES ?
//     ON DUPLICATE KEY UPDATE
//       officialTimeIN = VALUES(officialTimeIN),
//       officialBreaktimeIN = VALUES(officialBreaktimeIN),
//       officialBreaktimeOUT = VALUES(officialBreaktimeOUT),
//       officialTimeOUT = VALUES(officialTimeOUT),
//       officialHonorariumTimeIN = VALUES(officialHonorariumTimeIN),
//       officialHonorariumTimeOUT = VALUES(officialHonorariumTimeOUT),
//       officialServiceCreditTimeIN = VALUES(officialServiceCreditTimeIN),
//       officialServiceCreditTimeOUT = VALUES(officialServiceCreditTimeOUT),
//       officialOverTimeIN = VALUES(officialOverTimeIN),
//       officialOverTimeOUT = VALUES(officialOverTimeOUT)
//       WHERE employeeID = employeeID and day = day
//   `;




//   const values = records.map((r) => [
//     employeeID,
//     r.day,
//     r.officialTimeIN,
//     r.officialBreaktimeIN,
//     r.officialBreaktimeOUT,
//     r.officialTimeOUT,
//     r.officialHonorariumTimeIN,
//     r.officialHonorariumTimeOUT,
//     r.officialServiceCreditTimeIN,
//     r.officialServiceCreditTimeOUT,
//     r.officialOverTimeIN,
//     r.officialOverTimeOUT,
//     r.breaktime,
//   ]);




//   db.query(sql, [values], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Records saved successfully" });
//   });
// });




app.post('/officialtimetable', (req, res) => {
  const { employeeID, records } = req.body;




  if (!records || records.length === 0) {
    return res.status(400).json({ message: 'No records to insert or update.' });
  }




  // Prepare values for bulk insert
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




  const sql = `
    INSERT INTO officialtime (
      employeeID, 
      day,
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
      officialOverTimeOUT = VALUES(officialOverTimeOUT),
      breaktime = VALUES(breaktime)
  `;




  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting or updating records:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Records inserted or updated successfully' });
  });
});




// EXCEL UPLOAD FOR OFFICIAL TIME






app.post("/upload-excel-faculty-official-time", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }


  const file = req.files.file;
  const workbook = xlsx.read(file.data, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });


  if (!sheet.length) {
    return res.status(400).json({ message: "Excel file is empty." });
  }


  const cleanedSheet = sheet.map((row) => {
    const cleanedRow = {};
    for (const key in row) {
      const cleanKey = key.replace(/\u00A0/g, "").trim();
      cleanedRow[cleanKey] = row[key];
    }
    return cleanedRow;
  });


  let insertedCount = 0;
  let updatedCount = 0;


  for (const row of cleanedSheet) {
    const {
      employeeID,
      day,
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
    } = row;


    if (!employeeID || !day) continue;


    const checkQuery = `SELECT id FROM officialtime WHERE employeeID = ? AND day = ?`;
    const checkValues = [employeeID, day];


    try {
      const [rows] = await db.promise().query(checkQuery, checkValues);


      if (rows.length > 0) {
        // Exists – perform UPDATE
        const updateQuery = `
          UPDATE officialtime SET
            officialTimeIN = ?,
            officialBreaktimeIN = ?,
            officialBreaktimeOUT = ?,
            officialTimeOUT = ?,
            officialHonorariumTimeIN = ?,
            officialHonorariumTimeOUT = ?,
            officialServiceCreditTimeIN = ?,
            officialServiceCreditTimeOUT = ?,
            officialOverTimeIN = ?,
            officialOverTimeOUT = ?
          WHERE employeeID = ? AND day = ?
        `;


        const updateValues = [
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
          employeeID,
          day,
        ];


        const [result] = await db.promise().query(updateQuery, updateValues);
        if (result.affectedRows > 0) updatedCount++;
      } else {
        // Not found – perform INSERT
        const insertQuery = `
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
            officialOverTimeOUT
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const insertValues = [
          employeeID,
          day,
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
        ];


        const [result] = await db.promise().query(insertQuery, insertValues);
        if (result.affectedRows > 0) insertedCount++;
      }
    } catch (err) {
      
      console.error(`Error processing row for employeeID: ${employeeID}, day: ${day}`, err.message);
    }
  }


  res.json({
    message: "Upload complete.",
    inserted: insertedCount,
    updated: updatedCount,
  });
});




//////// ROLES




app.get('/api/user-role/:user', (req, res) => {
  const { user } = req.params;
  const query = 'SELECT role FROM users where id = ?';
  db.query(query, [user], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.lengt > 0) {
      res.json({ role: results[0].role });
    } else {
      console.log(res);
      res.status(400).json({ error: 'User not found' });
    }
  });
});




//////// REMITTANCE
app.get('/employee-remittance', (req, res) => {
  const sql = 'SELECT * FROM employee_remittance_table';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching data' });
    } else {
      res.json(result);
    }
  });
});




// POST: Add new remittance data
app.post('/employee-remittance', (req, res) => {
  const {
    employeeNumber,
    disallowance,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gfal,
    cpl,
    mpl,
    mplLite,
    emergencyLoan,
    nbc594,
    increment,
    pagibig,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
  } = req.body;




  const sql = `INSERT INTO employee_remittance_table (employeeNumber, disallowance, gsisSalaryLoan, gsisPolicyLoan, gfal, cpl, mpl, mplLite, emergencyLoan, nbc594, increment, pagibig, pagibigFundCont, pagibig2, multiPurpLoan, landbankSalaryLoan, earistCreditCoop, feu)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;




  const values = [
    employeeNumber,
    disallowance,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gfal,
    cpl,
    mpl,
    mplLite,
    emergencyLoan,
    nbc594,
    increment,
    pagibig,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
  ];




  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error during POST request:', err);
      res.status(500).json({ message: 'Error adding data' });
    } else {
      res.status(200).json({ message: 'Data added successfully' });
    }
  });
});




// PUT: Update remittance data by ID
app.put('/employee-remittance/:id', (req, res) => {
  const { id } = req.params;
  const {
    employeeNumber,
    disallowance,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gfal,
    cpl,
    mpl,
    mplLite,
    emergencyLoan,
    nbc594,
    increment,
    pagibig,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
  } = req.body;




  const sql = `UPDATE employee_remittance_table SET 
  employeeNumber = ?, 
  disallowance = ?, 
  gsisSalaryLoan = ?, 
  gsisPolicyLoan = ?, 
  gfal = ?, 
  cpl = ?, 
  mpl = ?, 
  mplLite = ?, 
  emergencyLoan = ?, 
  nbc594 = ?, 
  increment = ?, 
  pagibig = ?,
  pagibigFundCont = ?, 
  pagibig2 = ?, 
  multiPurpLoan = ?, 
  landbankSalaryLoan = ?, 
  earistCreditCoop = ?, 
  feu = ?
               WHERE id = ?`;




  const values = [
    employeeNumber,
    disallowance,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gfal,
    cpl,
    mpl,
    mplLite,
    emergencyLoan,
    nbc594,
    increment,
    pagibig,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
    id,
  ];




  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error updating data' });
    } else {
      res.status(200).json({ message: 'Data updated successfully' });
    }
  });
});




// DELETE: Delete remittance data by ID
app.delete('/employee-remittance/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM employee_remittance_table WHERE id = ?';




  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error deleting data' });
    } else {
      res.status(200).json({ message: 'Data deleted successfully' });
    }
  });
});




/////// ITEM-TABLE

// Get all records (Include `dateCreated`)
app.get('/api/item-table', (req, res) => {
  const sql = `
    SELECT id, item_description, employeeID, name, item_code, salary_grade, step, effectivityDate, dateCreated
    FROM item_table
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

// Add new item (Do NOT include `dateCreated` — it auto-generates)
app.post('/api/item-table', (req, res) => {
  const { item_description, employeeID, name, item_code, salary_grade, step, effectivityDate } = req.body;

  const sql = `
    INSERT INTO item_table (item_description, employeeID, name, item_code, salary_grade, step, effectivityDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [item_description, employeeID, name, item_code, salary_grade, step, effectivityDate],
    (err, result) => {
      if (err) {
        console.error('Database Insert Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({
        message: 'Item record added successfully',
        id: result.insertId,
      });
    }
  );
});

// Update item (Do NOT touch `dateCreated`)
app.put('/api/item-table/:id', (req, res) => {
  const { id } = req.params;
  const { item_description, employeeID, name, item_code, salary_grade, step, effectivityDate } = req.body;

  const sql = `
    UPDATE item_table SET
      item_description = ?,
      employeeID = ?,
      name = ?,
      item_code = ?,
      salary_grade = ?,
      step = ?,
      effectivityDate = ?
   
    WHERE id = ?
  `;
  db.query(
    sql,
    [item_description, employeeID, name, item_code, salary_grade, step, effectivityDate, id],
    (err, result) => {
      if (err) {
        console.error('Database Update Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Item record updated successfully' });
    }
  );
});

// Delete item
app.delete('/api/item-table/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM item_table WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database Delete Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item record deleted successfully' });
  });
});





// Get all records
app.get('/api/salary-grade-status', (req, res) => {
  db.query('SELECT * FROM salary_grade_status', (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result);
  });
});




// Add a new record
app.post('/api/salary-grade-status', (req, res) => {
  const { effectivityDate, step_number, status } = req.body;




  const sql = `
    INSERT INTO salary_grade_status (effectivityDate, step_number, status)
    VALUES (?, ?, ?)
  `;




  db.query(sql, [effectivityDate, step_number, status], (err, result) => {
    if (err) res.status(500).send(err);
    else
      res.json({ message: 'Record added successfully', id: result.insertId });
  });
});




// Update a record
app.put('/api/salary-grade-status/:id', (req, res) => {
  const { id } = req.params;
  const { effectivityDate, step_number, status } = req.body;




  const sql = `
    UPDATE salary_grade_status
    SET effectivityDate = ?, step_number = ?, status = ?
    WHERE id = ?
  `;




  db.query(sql, [effectivityDate, step_number, status, id], (err) => {
    if (err) res.status(500).send(err);
    else res.json({ message: 'Record updated successfully' });
  });
});




// Delete a record
app.delete('/api/salary-grade-status/:id', (req, res) => {
  const { id } = req.params;




  db.query('DELETE FROM salary_grade_status WHERE id = ?', [id], (err) => {
    if (err) res.status(500).send(err);
    else res.json({ message: 'Record deleted successfully' });
  });
});




// Get all department table
app.get('/api/department-table', (req, res) => {
  db.query('SELECT * FROM department_table', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




// Get a single department table by ID
app.get('/api/department-table/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM department_table WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send('Department not found');
      res.json(result[0]);
    }
  );
});




// Add a new department table
app.post('/api/department-table', (req, res) => {
  const { code, description } = req.body;
  if (!code || !description)
    return res.status(400).send('Code and description are required');




  const sql = `INSERT INTO department_table (code, description) VALUES (?, ?)`;
  db.query(sql, [code, description], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, code, description });
  });
});




// Update a department table
app.put('/api/department-table/:id', (req, res) => {
  const { id } = req.params;
  const { code, description } = req.body;




  const sql = `UPDATE department_table SET code = ?, description = ? WHERE id = ?`;
  db.query(sql, [code, description, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Department updated successfully');
  });
});




// Delete a department table
app.delete('/api/department-table/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM department_table WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Department deleted successfully');
  });
});




/////////////////////////////////////////////////////////////////////////////
// Get all department assignments
app.get('/api/department-assignment', (req, res) => {
  db.query('SELECT * FROM department_assignment', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




// Get a single department assignment by ID
app.get('/api/department-assignment/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM department_assignment WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send('Department Assignment not found');
      res.json(result[0]);
    }
  );
});




// Add a new department assignment (now using department code)
app.post('/api/department-assignment', (req, res) => {
  const { code, name, employeeNumber } = req.body;
  if (!code || !employeeNumber)
    return res.status(400).send('Code and Employee Number are required');




  const sql = `INSERT INTO department_assignment (code, name, employeeNumber) VALUES (?, ?, ?)`;
  db.query(sql, [code, name, employeeNumber], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, code, name, employeeNumber });
  });
});




// Update a department assignment (by ID)
app.put('/api/department-assignment/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, employeeNumber } = req.body;




  const sql = `UPDATE department_assignment SET code = ?, name = ?, employeeNumber = ? WHERE id = ?`;
  db.query(sql, [code, name, employeeNumber, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Department assignment updated successfully');
  });
});




// Delete a department assignment
app.delete('/api/department-assignment/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM department_assignment WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Department assignment deleted successfully');
    }
  );
});




// LEAVE




app.get('/leave', (req, res) => {
  const sql = `SELECT * FROM leave_table`;




  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});




app.post('/leave', (req, res) => {
  const { leave_code, description, number_hours, status } = req.body;




  if (!leave_code) {
    return res.status(400).json({ error: 'Leave code is required' });
  }




  const sql = `INSERT INTO leave_table (leave_code, description, number_hours, status) VALUES (?,?,?,?)`;
  db.query(
    sql,
    [leave_code, description, number_hours, status],
    (err, result) => {
      if (err) {
        console.error('Database Insert Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }




      res.status(201).json({
        message: 'Leave record added successfully',
        id: result.insertId,
      });
    }
  );
});




app.put('/leave/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const { leave_code, description, number_hours, status } = req.body;




  if (!leave_code) {
    return res.status(400).json({ error: 'Leave code is required' });
  }




  const sql = `UPDATE leave_table SET leave_code = ?, description = ?, number_hours = ?, status = ? WHERE id = ?`;
  db.query(
    sql,
    [leave_code, description, number_hours, status, id],
    (err, result) => {
      if (err) {
        console.error('Database Update Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }




      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Leave record not found' });
      }




      res.json({ message: 'Leave record updated successfully' });
    }
  );
});




app.delete('/leave/:id', (req, res) => {
  const { id } = req.params;




  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const sql = `DELETE FROM leave_table WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database Delete Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave record not found' });
    }




    res.json({ message: 'Leave record deleted successfully' });
  });
});




//LEAVE ASSIGNMENT START
// CREATE Leave Assignment
app.post('/leave_assignment', (req, res) => {
  const { employeeID, leaveID, noOfLeaves } = req.body;
  const sql =
    'INSERT INTO leave_assignment (employeeID, leaveID, noOfLeaves) VALUES (?, ?, ?)';
  db.query(sql, [employeeID, leaveID, noOfLeaves], (err, result) => {
    if (err) return res.status(500).json(err);
    res
      .status(201)
      .json({ message: 'Leave Assignment Created', id: result.insertId });
  });
});




// READ Leave Assignments
app.get('/leave_assignment', (req, res) => {
  const sql = 'SELECT * FROM leave_assignment';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});




// UPDATE Leave Assignment
app.put('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;
  const { employeeID, leaveID, noOfLeaves } = req.body;
  const sql =
    'UPDATE leave_assignment SET employeeID=?, leaveID=?, noOfLeaves=? WHERE id=?';
  db.query(sql, [employeeID, leaveID, noOfLeaves, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Leave Assignment Updated' });
  });
});




// DELETE Leave Assignment
app.delete('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM leave_assignment WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Leave Assignment Deleted' });
  });
});




// HOLIDAY




app.get('/holiday-suspension', (req, res) => {
  const sql = `SELECT * FROM holidayandsuspension`;




  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});




app.post('/holiday-suspension', (req, res) => {
  const { description, date, status } = req.body;




  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }




  const sql = `INSERT INTO holidayandsuspension (description, date, status) VALUES (?, ?, ?)`;
  db.query(sql, [description, date, status], (err, result) => {
    if (err) {
      console.error('Database Insert Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    res.status(201).json({
      message: 'Holiday and Suspension record added successfully',
      id: result.insertId,
    });
  });
});




app.put('/holiday-suspension/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const { description, date, status } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }




  const sql = `UPDATE holidayandsuspension SET description = ?, date = ?, status = ? WHERE id = ?`;
  db.query(sql, [description, date, status, id], (err, result) => {
    if (err) {
      console.error('Database Update Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Holiday suspension record not found' });
    }




    res.json({ message: 'Holiday suspension record updated successfully' });
  });
});




app.delete('/holiday-suspension/:id', (req, res) => {
  const { id } = req.params;




  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const sql = `DELETE FROM holidayandsuspension WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database Delete Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Holiday suspension record not found' });
    }




    res.json({ message: 'Holiday suspension record deleted successfully' });
  });
});




app.get('/personalinfo/person_table/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;
  const query = 'SELECT * FROM person_table WHERE agencyEmployeeNum = ?';




  db.query(query, [employeeNumber], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }




    if (result.length === 0) {
      return res.status(404).send('Employee not found');
    }




    res.status(200).send(result[0]); // Send first matched result
  });
});




app.get('/college/college-table/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;
  const query = 'SELECT * FROM college_table WHERE person_id = ?';




  db.query(query, [employeeNumber], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }




    if (result.length === 0) {
      return res.status(404).send('Employee not found');
    }




    res.status(200).send(result[0]); // Send first matched result
  });
});


  app.get(`/GraduateRoute/graduate-table/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM graduate_table WHERE person_id = ?`;








    db.query(query, [employeeNumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }




      // Always respond with 200. If nothing found, send null
      res.status(200).send(result.length > 0 ? result[0] : null);
    });
  });




app.get('/vocational/vocational-table/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;
  const query = 'SELECT * FROM vocational_table WHERE person_id = ?';




  db.query(query, [employeeNumber], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }




    if (result.length === 0) {
      return res.status(404).send('Employee not found');
    }




    res.status(200).send(result[0]); // Send first matched result
  });
});






for (let i = 1; i <= 12; i++) {
  app.get(`/childrenRoute/children-table${i}/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM children_table WHERE person_id = ? AND incValue=${i}`;




    db.query(query, [employeeNumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }




      if (result.length === 0) {
        return res.status(404).send('Employee not found');
      }




      res.status(200).send(result[0]); // Send first matched result
    });
  });
}




for (let i = 1; i <= 7; i++) {
  app.get(`/eligibilityRoute/eligibility${i}/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM eligibility_table WHERE person_id = ? AND incValue = ?`;




    db.query(query, [employeeNumber, i], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }




      // Always respond with 200. If nothing found, send null
      res.status(200).send(result.length > 0 ? result[0] : null);
    });
  });
}




for (let i = 1; i <= 26; i++) {
  app.get(
    `/WorkExperienceRoute/work-experience-table${i}/:employeeNumber`,
    (req, res) => {
      const { employeeNumber } = req.params;
      const query = `SELECT * FROM work_experience_table WHERE person_id = ? AND incValue = ?`;




      db.query(query, [employeeNumber, i], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Internal Server Error');
        }




        // Always respond with 200. If nothing found, send null
        res.status(200).send(result.length > 0 ? result[0] : null);
      });
    }
  );
}




for (let i = 1; i <= 7; i++) {
  app.get(`/VoluntaryRoute/voluntary-work${i}/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM voluntary_work_table WHERE person_id = ? AND incValue = ?`;




    db.query(query, [employeeNumber, i], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }




      // Always respond with 200. If nothing found, send null
      res.status(200).send(result.length > 0 ? result[0] : null);
    });
  });
}


for (let i = 1; i <= 21; i++) {
  app.get(`/learning_and_development_table${i}/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM learning_and_development_table WHERE person_id = ? AND incValue = ?`;




    db.query(query, [employeeNumber, i], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }




      // Always respond with 200. If nothing found, send null
      res.status(200).send(result.length > 0 ? result[0] : null);
    });
  });
}


for (let i = 1; i <= 7; i++) {
  app.get(`/OtherInfo/other-information${i}/:employeeNumber`, (req, res) => {
    const { employeeNumber } = req.params;
    const query = `SELECT * FROM other_information_table WHERE person_id = ? AND incValue = ?` ;

    console.log(`Request received for incValue ${i} and employeeNumber ${employeeNumber}`);

    db.query(query, [employeeNumber, i], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.status(200).json(result.length > 0 ? result[0] : null); // use json() to ensure proper format
    });
  });
}







// Get all payroll
app.get('/api/payroll', (req, res) => {
  db.query('SELECT * FROM payroll_processing', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});








app.get('/api/payroll-with-remittance', (req, res) => {
  const query = `
  SELECT
    p.id,
    p.department AS code,
    p.employeeNumber,
    p.startDate,
    p.endDate,
    p.rateNbc584,
    p.rateNbc594,
    p.nbcDiffl597,
    p.grossSalary,
    p.abs,
    p.h,
    p.m,
    p.s,
    p.netSalary,
    p.withholdingTax,
    p.personalLifeRetIns,
    p.totalGsisDeds,
    p.totalPagibigDeds,
    p.totalOtherDeds,
    p.totalDeductions,
    p.pay1st,
    p.pay2nd,
    p.pay1stCompute,
    p.pay2ndCompute,
    p.rtIns,
    p.ec,




    p.status,




    CONCAT_WS(', ', pt.lastName, CONCAT_WS(' ', pt.firstName, pt.middleName, pt.nameExtension)) AS name,






    r.nbc594,
    r.increment,
    r.gsisSalaryLoan,
    r.gsisPolicyLoan,
    r.gsisArrears,
    r.cpl,
    r.mpl,
    r.eal,
    r.mplLite,
    r.emergencyLoan,
    r.pagibigFundCont,
    r.pagibig2,
    r.multiPurpLoan,
    r.landbankSalaryLoan,
    r.earistCreditCoop,
    r.feu,
    r.liquidatingCash,
    itt.item_description,






    pt2.position,
    sgt.sg_number,






    ph.PhilHealthContribution,




    da.code AS department,


    CASE itt.step
    WHEN 'step1' THEN sgt.step1
    WHEN 'step2' THEN sgt.step2
    WHEN 'step3' THEN sgt.step3
    WHEN 'step4' THEN sgt.step4
    WHEN 'step5' THEN sgt.step5
    WHEN 'step6' THEN sgt.step6
    WHEN 'step7' THEN sgt.step7
    WHEN 'step8' THEN sgt.step8
    -- Add more steps if necessary
    ELSE NULL
  END AS rateNbc594
   
  FROM payroll_processing p
  LEFT JOIN person_table pt
    ON pt.agencyEmployeeNum = p.employeeNumber
  LEFT JOIN remittance_table r
    ON p.employeeNumber = r.employeeNumber
  LEFT JOIN plantilla_table pt2
    ON p.employeeNumber = pt2.employeeNumber
  LEFT JOIN philhealth ph
    ON p.employeeNumber = ph.employeeNumber
  LEFT JOIN department_assignment da
    ON p.employeeNumber = da.employeeNumber




  LEFT JOIN item_table as itt
  ON itt.employeeID = p.employeeNumber
 
  LEFT JOIN salary_grade_table sgt
  ON sgt.sg_number = itt.salary_grade AND sgt.effectivityDate = itt.effectivityDate
  ;
 
 




`;








  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching joined payroll data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});








app.put('/api/payroll-with-remittance/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;
  const {
    startDate,
    endDate,
    name,
    rateNbc584,
    rateNbc594,
    nbcDiffl597,
    grossSalary,
    abs,
    h,
    m,
    s,
    netSalary,
    withholdingTax,
    personalLifeRetIns,
    totalGsisDeds,
    totalPagibigDeds,
    totalOtherDeds,
    totalDeductions,
    pay1st,
    pay2nd,
    pay1stCompute,
    pay2ndCompute,
    rtIns,
    ec,
    nbc594,
    increment,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gsisArrears,
    cpl,
    mpl,
    eal,
    mplLite,
    emergencyLoan,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    position,
    liquidatingCash,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
    PhilHealthContribution,
    department
  } = req.body;




  const nameExtensionCandidates = ['Jr.', 'Sr.', 'II', 'III', 'IV'];




  let lastName = '';
  let firstName = '';
  let middleName = '';
  let nameExtension = '';




  if (typeof name === 'string') {
    const [last, firstMiddle] = name.split(',').map(part => part.trim());




    if (last && firstMiddle) {
      lastName = last;




      const nameParts = firstMiddle.split(' ').filter(Boolean);
      if (nameParts.length > 0) {
        firstName = nameParts[0];
        const middleParts = [];




        for (let i = 1; i < nameParts.length; i++) {
          if (nameExtensionCandidates.includes(nameParts[i])) {
            nameExtension = nameParts[i];
          } else {
            middleParts.push(nameParts[i]);
          }
        }




        middleName = middleParts.join(' ');
      }
    }
  } else {
    console.error('Invalid name input:', name);
  }




  const query = `
    UPDATE payroll_processing p
    LEFT JOIN remittance_table r ON p.employeeNumber = r.employeeNumber
    LEFT JOIN plantilla_table pt2 ON p.employeeNumber = pt2.employeeNumber
    SET
      p.department = ?,
      p.startDate = ?,
      p.endDate = ?,
      p.name = ?,
      p.rateNbc584 =?,
      p.rateNbc594 = ?,
      p.nbcDiffl597 =?,
      p.grossSalary = ?,
      p.abs = ?,
      p.h = ?,
      p.m = ?,
      p.s = ?,
      p.netSalary = ?,
      p.withholdingTax = ?,
      p.personalLifeRetIns = ?,
      p.totalGsisDeds = ?,
      p.totalPagibigDeds = ?,
      p.totalOtherDeds = ?,
      p.totalDeductions = ?,
      p.pay1st = ?,
      p.pay2nd = ?,


      p.pay1stCompute = ?,
      p.pay2ndCompute = ?,
      p.rtIns = ?,
      p.ec = ?,




      r.nbc594 = ?,
      r.increment = ?,
      r.gsisSalaryLoan = ?,
      r.gsisPolicyLoan = ?,
      r.gsisArrears = ?,
      r.cpl = ?,
      r.mpl = ?,
      r.eal =?,
      r.mplLite = ?,
      r.emergencyLoan = ?,
      r.pagibigFundCont = ?,
      r.pagibig2 = ?,
      r.multiPurpLoan = ?,
      pt2.position = ?,      
      r.liquidatingCash = ?,
      r.landBankSalaryLoan = ?,
      r.earistCreditCoop = ?,
      r.feu = ?
    WHERE p.employeeNumber = ?
  `;




  const values = [
    department,
    startDate,
    endDate,
    name,
    rateNbc584,
    rateNbc594,
    nbcDiffl597,
    grossSalary,
    abs,
    h,
    m,
    s,
    netSalary,
    withholdingTax,
    personalLifeRetIns,
    totalGsisDeds,
    totalPagibigDeds,
    totalOtherDeds,
    totalDeductions,
    pay1st,
    pay2nd,
    pay1stCompute,
    pay2ndCompute,
    rtIns,
    ec,
    nbc594,
    increment,
    gsisSalaryLoan,
    gsisPolicyLoan,
    gsisArrears,
    cpl,
    mpl,
    eal,
    mplLite,
    emergencyLoan,
    pagibigFundCont,
    pagibig2,
    multiPurpLoan,
    position,
    liquidatingCash,
    landbankSalaryLoan,
    earistCreditCoop,
    feu,
    employeeNumber
  ];




  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating payroll data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }




    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }




    // Update person_table
    const personQuery = `
      UPDATE person_table
      SET firstName = ?, middleName = ?, lastName = ?, nameExtension = ?
      WHERE agencyEmployeeNum = ?
    `;




    db.query(
      personQuery,
      [firstName, middleName, lastName, nameExtension, employeeNumber],
      (err2) => {
        if (err2) {
          console.error('Error updating person name:', err2);
          return res.status(500).json({ error: 'Internal server error' });
        }




        // Update PhilHealth contribution
        const philHealthQuery = `
          UPDATE philhealth
          SET PhilHealthContribution = ?
          WHERE employeeNumber = ?
        `;




        db.query(
          philHealthQuery,
          [PhilHealthContribution, employeeNumber],
          (err3) => {
            if (err3) {
              console.error('Error updating PhilHealth contribution:', err3);
              return res.status(500).json({ error: 'Internal server error' });
            }




            // Update department_assignment table
            const departmentAssignmentQuery = `
              UPDATE department_assignment
              SET code = ?
              WHERE employeeNumber = ?
            `;




            db.query(
              departmentAssignmentQuery,
              [department, employeeNumber],
              (err4) => {
                if (err4) {
                  console.error('Error updating department assignment:', err4);
                  return res.status(500).json({ error: 'Internal server error' });
                }




                res.json({ message: 'Payroll record updated successfully' });
              }
            );
          }
        );
      }
    );
  });
});












app.delete('/api/payroll-with-remittance/:id', (req, res) => {
  const { id } = req.params;








  const query = `
    DELETE FROM payroll_processing
    WHERE id = ?
  `;








  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting payroll data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }








    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }








    res.json({ message: 'Payroll record deleted successfully' });
  });
});








app.get('/api/payroll-with-remittance', (req, res) => {
  const { employeeNumber, startDate, endDate } = req.query;








  if (!employeeNumber || !startDate || !endDate) {
    return res
      .status(400)
      .json({ error: 'employeeNumber, startDate, and endDate are required' });
  }








  const query = `
    SELECT * FROM payroll_processing
    WHERE employeeNumber = ? AND startDate = ? AND endDate = ?
  `;








  db.query(query, [employeeNumber, startDate, endDate], (err, result) => {
    if (err) {
      console.error('Error retrieving payroll data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }








    if (result.length > 0) {
      // Found existing record
      return res.json({ exists: true });
    }








    res.json({ exists: false });
  });
});








app.post('/api/add-rendered-time', async (req, res) => {
  const attendanceData = req.body;








  if (!Array.isArray(attendanceData)) {
    return res.status(400).json({ error: 'Expected an array of data.' });
  }








  try {
    for (const record of attendanceData) {
      const {
        employeeNumber,
        startDate,
        endDate,
        overallRenderedOfficialTimeTardiness,
      } = record;








      // Fetch the department code based on the employee number from department_assignment
      const departmentQuery = `
        SELECT code FROM department_assignment WHERE employeeNumber = ?
      `;








      const [departmentRows] = await db
        .promise()
        .query(departmentQuery, [employeeNumber]);








      // Check if a department is found for the employee
      if (departmentRows.length === 0) {
        return res.status(404).json({
          error: `Department not found for employee ${employeeNumber}.`,
        });
      }








      const departmentCode = departmentRows[0].code;








      // Parse HH:MM:SS into h, m, s
      let h = '00';
      let m = '00';
      let s = '00';








      if (overallRenderedOfficialTimeTardiness) {
        const parts = overallRenderedOfficialTimeTardiness.split(':');
        if (parts.length === 3) {
          h = parts[0].padStart(2, '0');
          m = parts[1].padStart(2, '0');
          s = parts[2].padStart(2, '0');
        }
      }








      // Insert the record into payroll including the department (code)
      const insertQuery = `
        INSERT INTO payroll_processing (employeeNumber, startDate, endDate, h, m, s, department)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;








      await db
        .promise()
        .query(insertQuery, [
          employeeNumber,
          startDate,
          endDate,
          h,
          m,
          s,
          departmentCode,
        ]);
    }








    res
      .status(200)
      .json({ message: 'Records added to payroll with time data.' });
  } catch (err) {
    console.error('Error inserting into payroll:', err);
    res.status(500).json({ error: 'Failed to insert payroll records.' });
  }
});








app.post('/api/finalized-payroll', (req, res) => {
  const payrollData = req.body;


  if (!Array.isArray(payrollData) || payrollData.length === 0) {
    return res.status(400).json({ error: 'No payroll data received.' });
  }


  const values = payrollData.map((entry) => [
    entry.employeeNumber,
    entry.startDate,
    entry.endDate,
    entry.name,
    entry.rateNbc584,
    entry.nbc594,
    entry.rateNbc594,
    entry.nbcDiffl597,
    entry.grossSalary,
    entry.abs,
    entry.h,
    entry.m,
    entry.s,
    entry.netSalary,
    entry.withholdingTax,
    entry.personalLifeRetIns,
    entry.totalGsisDeds,
    entry.totalPagibigDeds,
    entry.totalOtherDeds,
    entry.totalDeductions,
    entry.pay1st,
    entry.pay2nd,
    entry.pay1stCompute,
    entry.pay2ndCompute,
    entry.rtIns,
    entry.ec,
    entry.increment,
    entry.gsisSalaryLoan,
    entry.gsisPolicyLoan,
    entry.gsisArrears,
    entry.cpl,
    entry.mpl,
    entry.eal,
    entry.mplLite,
    entry.emergencyLoan,
    entry.pagibigFundCont,
    entry.pagibig2,
    entry.multiPurpLoan,
    entry.position,
    entry.liquidatingCash,
    entry.landbankSalaryLoan,
    entry.earistCreditCoop,
    entry.feu,
    entry.PhilHealthContribution,
    entry.department
  ]);


  const insertQuery = `
    INSERT INTO finalize_payroll (
      employeeNumber, startDate, endDate, name, rateNbc584, nbc594, rateNbc594, nbcDiffl597, grossSalary,
      abs, h, m, s, netSalary, withholdingTax, personalLifeRetIns, totalGsisDeds,
      totalPagibigDeds, totalOtherDeds, totalDeductions, pay1st, pay2nd,
      pay1stCompute, pay2ndCompute, rtIns, ec, increment, gsisSalaryLoan,
      gsisPolicyLoan, gsisArrears, cpl, mpl, eal, mplLite, emergencyLoan,
      pagibigFundCont, pagibig2, multiPurpLoan, position, liquidatingCash,
      landbankSalaryLoan, earistCreditCoop, feu, PhilHealthContribution, department
    ) VALUES ?
  `;


  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error inserting finalized payroll:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    // Extract names to update status
    const employeeNames = payrollData.map(entry => entry.name);


    const updateQuery = `
      UPDATE payroll_processing
      SET status = 1
      WHERE name IN (?)
    `;


    db.query(updateQuery, [employeeNames], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating status in payroll_processing:', updateErr);
        return res.status(500).json({ error: 'Payroll inserted, but failed to update status.' });
      }


      res.json({
        message: 'Finalized payroll inserted and status updated successfully.',
        inserted: result.affectedRows,
        updated: updateResult.affectedRows
      });
    });
  });
});








app.get('/api/finalized-payroll', (req, res) => {
  const query = 'SELECT * FROM finalize_payroll ORDER BY dateCreated DESC';








  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching finalized payroll:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});




app.delete('/api/finalized-payroll/:id', (req, res) => {
  const { id } = req.params;
  const { employeeNumber, name } = req.body;


  const deleteQuery = 'DELETE FROM finalize_payroll WHERE id = ?';
  const updateQuery = `
    UPDATE payroll_processing
    SET status = 0
    WHERE name = ?
  `;


  // First delete
  db.query(deleteQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }


    // Then update status
    db.query(updateQuery, [name], (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Deleted but failed to update status.' });
      }


      res.json({
        message: 'Deleted and status updated.',
        deleted: results.affectedRows,
        updated: updateResult.affectedRows
      });
    });
  });
});






app.post('/api/philhealth', (req, res) => {
  const { employeeNumber, PhilHealthContribution } = req.body;




  const query =
    'INSERT INTO philhealth (employeeNumber, PhilHealthContribution) VALUES (?, ?)';
  db.query(query, [employeeNumber, PhilHealthContribution], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: 'PhilHealth contribution added successfully' });
  });
});




app.get('/api/philhealth', (req, res) => {
  db.query('SELECT * FROM philhealth', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});




app.put('/api/philhealth/:id', (req, res) => {
  const { id } = req.params;
  const { employeeNumber, PhilHealthContribution } = req.body;




  const query =
    'UPDATE philhealth SET employeeNumber = ?, PhilHealthContribution = ? WHERE id = ?';
  db.query(
    query,
    [employeeNumber, PhilHealthContribution, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Contribution not found' });
      }
      res.json({ message: 'PhilHealth contribution updated successfully' });
    }
  );
});






app.delete('/api/philhealth/:id', (req, res) => {
  const { id } = req.params;




  const query = 'DELETE FROM philhealth WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    res.json({ message: 'PhilHealth contribution deleted successfully' });
  });
});




// BULK REGISTER
app.post("/excel-register", (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "No users data provided" });
  }

  const results = [];
  const errors = [];

  users.forEach((user) => {
    const queryCheck =
      "SELECT * FROM users WHERE employeeNumber = ?";
    db.query(queryCheck, [user.employeeNumber], (err, existingUser) => {
      if (err) {
        errors.push(`Error checking user ${user.employeeNumber}: ${err.message}`);
        return;
      }

      if (existingUser.length > 0) {
        errors.push(`Employee number ${user.employeeNumber} already exists`);
      } else {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const queryInsert =
          "INSERT INTO users (username, email, role, password, employeeNumber, employmentCategory, access_level) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        db.query(
          queryInsert,
          [
            user.username,
            user.email,
            user.role,
            hashedPassword,
            user.employeeNumber,
            user.employmentCategory,
            user.access_level,
          ],
          (err, result) => {
            if (err) {
              errors.push(`Error processing user ${user.employeeNumber}: ${err.message}`);
            } else {
              results.push({
                employeeNumber: user.employeeNumber,
                username: user.username,
                status: "success",
              });
            }
          }
        );
      }
    });
  });

  // Delay sending response to allow for asynchronous processing
  setTimeout(() => {
    res.json({
      message: "Bulk registration completed",
      successful: results,
      errors: errors,
    });
  }, 1000); // Adjust delay if necessary for your use case
});




app.listen(5000, () => {
  console.log('Server runnning');
});
