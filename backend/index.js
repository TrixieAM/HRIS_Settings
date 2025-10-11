
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");





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
const Leave = require('./dashboardRoutes/Leave');
const Attendance = require('./dashboardRoutes/Attendance');


const SalaryGradeTable = require('./payrollRoutes/SalaryGradeTable');
const Remittance = require('./payrollRoutes/Remittance');


const SendPayslip = require('./payrollRoutes/SendPayslip');
const Payroll = require('./payrollRoutes/Payroll');
const PayrollReleased = require('./payrollRoutes/PayrollReleased');






const app = express();

const nodemailer = require('nodemailer');
require('dotenv').config();



function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth header:', authHeader);
  console.log('Token:', token ? 'Token exists' : 'No token');

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Decoded JWT:', user); // 👈 see what fields are in the token
    req.user = user;
    next();
  });
}

function logAudit(
  user,
  action,
  tableName,
  recordId,
  targetEmployeeNumber = null
) {
  const auditQuery = `
    INSERT INTO audit_log (employeeNumber, action, table_name, record_id, targetEmployeeNumber, timestamp)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    auditQuery,
    [user.employeeNumber, action, tableName, recordId, targetEmployeeNumber],
    (err) => {
      if (err) {
        console.error('Error inserting audit log:', err);
      }
    }
  );
}


app.use(express.json());
// Define allowed origins
const allowedOrigins = [
  "http://localhost:5137",
  "http://192.168.20.16:5137",       // Local dev
  "http://192.168.50.50:5137",       // LAN
  "http://136.239.248.42:5137",      // Public
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin 
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, //auth/origins
  })
);
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

// File upload configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Create necessary directories
const profilePicturesDir = path.join(__dirname, 'uploads', 'profile_pictures');
if (!fs.existsSync(profilePicturesDir)) {
  fs.mkdirSync(profilePicturesDir, { recursive: true });
}

app.use('/uploads', express.static('uploads'));
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


app.use('/SalaryGradeTable', SalaryGradeTable);
app.use('/Remittance', Remittance);
app.use('/leaveRoute', Leave);
app.use('/SendPayslipRoute', SendPayslip);
app.use('/PayrollRoute', Payroll);
app.use('/PayrollReleasedRoute', PayrollReleased);


const RECAPTCHA_SECRET_KEY = "6LczLdwrAAAAAOJjTxN85KXGfCSZfM68l4YOYMr9"; // your secret key








//MYSQL CONNECTION
// Determine which database host to use based on environment
const getDbHost = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DB_HOST_PUBLIC;
  } else if (process.env.NODE_ENV === 'local') {
    return process.env.DB_HOST_LOCAL;
  } else {
    return 'localhost'; // fallback for development
  }
};

//MYSQL CONNECTION
const db = mysql.createPool({
  host: getDbHost(),
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'HRIST',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'earist_hris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const ensureAuditLogTableSQL = `
  CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeNumber VARCHAR(64) NULL,
    action VARCHAR(512) NOT NULL,
    table_name VARCHAR(128) NULL,
    record_id INT NULL,
    targetEmployeeNumber VARCHAR(64) NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

db.query(ensureAuditLogTableSQL, (err) => {
  if (err) {
    console.error('Failed to ensure audit_log table exists:', err);
  } else {
    console.log('');
  }
});

const PORT = process.env.WEB_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running...`);
});

module.exports = db;



// Audit log
function insertAuditLog(employeeNumber, action) {
  const sql = `INSERT INTO audit_log (employeeNumber, action) VALUES (?, ?)`;
  db.query(sql, [employeeNumber, action], (err, result) => {
    if (err) {
      console.error("Error inserting audit log:", err);
    } else {
      console.log("Audit log inserted:", result.insertId);
    }
  });
}


// Test connection
//db.getConnection((err, connection) => {
  //if (err) {
  //  console.error("Database connection failed:", err);
    //return;
  //}
  //console.log("Database Connected");
  //connection.release(); // Important: release connection back to the pool
//});



//RESET PASSWORD (BAGO 'TO - HANNA)
// Add this after your other middleware configurations
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ allow Gmail cert
  },
});

const twoFACodes = {}; // { email: { code, expiresAt } }

//UPDATING EMAIL
app.post("/update-email", authenticateToken, (req, res) => {
  const { email } = req.body;
  const userId = req.user.id;               // users table PK
  const employeeNumber = req.user.employeeNumber; // for person_table

  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!employeeNumber) return res.status(400).json({ error: "employeeNumber missing in JWT" });

  console.log("Updating person_table for employeeNumber:", employeeNumber);

  // Update users table
  db.query(
    "UPDATE users SET email = ? WHERE id = ?",
    [email, userId],
    (err, userResult) => {
      if (err) return res.status(500).json({ error: "Failed to update users table." });

      if (userResult.affectedRows === 0)
        return res.status(404).json({ error: "User not found in users table." });

      // Update person_table using employeeNumber
      db.query(
        "UPDATE person_table SET emailAddress = ? WHERE agencyEmployeeNum = ?",
        [email, employeeNumber],
        (err, personResult) => {
          if (err) return res.status(500).json({ error: "Failed to update person_table." });

          if (personResult.affectedRows === 0)
            return res.status(404).json({ 
              error: "User not found in person_table. Check employeeNumber." 
            });

          res.json({ message: "Email updated in both users and person_table." });
        }
      );
    }
  );
});


// Forgot password start      
// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

// Generate random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Forgot password route - send verification code with reCAPTCHA verification
app.post('/forgot-password', async (req, res) => {
  const { email, recaptchaToken } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!recaptchaToken) {
    return res.status(400).json({ error: 'Please verify that you are not a robot.' });
  }

  // Verify reCAPTCHA
  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const response = await fetch(verificationURL, { method: "POST" });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed.' });
    }
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    return res.status(500).json({ error: "Server error during reCAPTCHA verification." });
  }

  try {
    // Check if user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No account found with this email address' });
      }

      const user = results[0];
      const verificationCode = generateVerificationCode();

      // Store code with 15-minute expiration
      verificationCodes.set(email, {
        code: verificationCode,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        userId: user.id
      });

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A31D1D;">Password Reset Request</h2>
            <p>Hello ${user.username},</p>
            <p>You requested to reset your password. Below is the verification code:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #A31D1D; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
            </div>
            <p>This code will expire in 15 minutes. Make sure to use it before expiration.</p>
            <p>Please ignore this message if you didn't request this password reset.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message from your HRIS system.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Verification code sent to your email' });
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});


// Verify code route
app.post('/verify-reset-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  const storedData = verificationCodes.get(email);
  
  if (!storedData) {
    return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
  }

  if (Date.now() > storedData.expires) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  if (storedData.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  res.json({ 
    message: 'Code verified successfully', 
    userId: storedData.userId,
    verified: true 
  });
});

// Reset password route
app.post('/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const storedData = verificationCodes.get(email);
  
  if (!storedData) {
    return res.status(400).json({ error: 'Invalid or expired session. Please start over.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(query, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update password' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Clean up the verification code
      verificationCodes.delete(email);
      
      res.json({ message: 'Password updated successfully' });
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});


// reCAPTCHA verification endpoint
app.post("/verify-recaptcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "reCAPTCHA token is required." });
  }

  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;
    const response = await fetch(verificationURL, { method: "POST" });
    const data = await response.json();

    if (data.success) {
      return res.json({ success: true, message: "reCAPTCHA verified." });
    } else {
      return res.status(400).json({ success: false, error: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    console.error("Error verifying reCAPTCHA:", err);
    return res.status(500).json({ success: false, error: "Server error during reCAPTCHA verification." });
  }
});

// Endpoint to verify current password
app.post('/verify-current-password', authenticateToken, async (req, res) => {
  try {
    const { email, currentPassword } = req.body;
    
    if (!email || !currentPassword) {
      return res.status(400).json({ error: 'Email and current password are required' });
    }
    
    // Get user from database
    const query = 'SELECT password FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = results[0];
      
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      res.json({ message: 'Password verified', verified: true });
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 1. Send verification code for password change
app.post('/send-password-change-code', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verify user exists and get full name
    const query = `
      SELECT p.firstName, p.middleName, p.lastName, p.nameExtension,
             CONCAT(p.firstName, 
                    CASE WHEN p.middleName IS NOT NULL THEN CONCAT(' ', p.middleName) ELSE '' END,
                    ' ', p.lastName,
                    CASE WHEN p.nameExtension IS NOT NULL THEN CONCAT(' ', p.nameExtension) ELSE '' END
             ) as fullName
      FROM users u 
      LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum 
      WHERE u.email = ?
    `;
    
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = result[0];
      
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in the same Map you use for forgot-password
      verificationCodes.set(email, {
        code: code,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      // Send email
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Password Change Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #A31D1D;">Password Change Request</h2>
              <p>Hello ${user.fullName},</p>
              <p>You requested to change your password. Your verification code is:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                <h1 style="color: #A31D1D; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email and contact HRIS immediately.</p>
              <hr style="margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">This is an automated message from your HRIS system.</p>
            </div>
          `
        });

        res.json({ message: 'Verification code sent successfully' });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        res.status(500).json({ error: 'Failed to send email' });
      }
    });
  } catch (error) {
    console.error('Error sending password change code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// 2. Verify the code (reuses your existing verificationCodes Map)
app.post('/verify-password-change-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const storedData = verificationCodes.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }
    
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }
    
    if (storedData.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    res.json({ verified: true, message: 'Code verified successfully' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 3. Complete password change after verification
app.post('/complete-password-change', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    
    // Validate
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Verify code was validated (still exists in Map)
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({ error: 'Invalid or expired session. Please start over.' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password in MySQL
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(query, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update password' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Clean up verification code
      verificationCodes.delete(email);
      
      res.json({ message: 'Password changed successfully' });
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { 
    firstName, 
    middleName, 
    lastName, 
    nameExtension,
    email, 
    password, 
    employeeNumber 
  } = req.body;

  try {
    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Build full name
    const fullName = [
      firstName,
      middleName || "",
      lastName,
      nameExtension || ""
    ]
      .filter(Boolean)
      .join(" ");

    // Check if employee number already exists
    const checkQuery = `
      SELECT employeeNumber FROM users WHERE employeeNumber = ? 
      UNION 
      SELECT agencyEmployeeNum FROM person_table WHERE agencyEmployeeNum = ?
    `;
    
    db.query(checkQuery, [employeeNumber, employeeNumber], (err, existingRecords) => {
      if (err) {
        console.error("Error checking existing records:", err);
        return res.status(500).send({ error: "Failed to check existing records" });
      }

      if (existingRecords.length > 0) {
        return res.status(400).send({ error: "Employee number already exists" });
      }

      // Insert into users table first
      const userQuery = `
        INSERT INTO users (
          email,
          role,
          password,
          employeeNumber,
          employmentCategory,
          access_level,
          username
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(userQuery, [
        email,
        "staff",       // default role
        hashedPass,
        employeeNumber,
        1,             // default employmentCategory
        "user",        // default access_level
        fullName
      ], (err) => {
        if (err) {
          console.error("Error inserting into users table:", err);
          return res.status(500).send({ error: "Failed to create user record" });
        }

        // Insert into person_table after user is created
        const personQuery = `
          INSERT INTO person_table (
            firstName,
            middleName,
            lastName,
            nameExtension,
            agencyEmployeeNum
          ) VALUES (?, ?, ?, ?, ?)
        `;

        db.query(personQuery, [
          firstName,
          middleName || null,
          lastName,
          nameExtension || null,
          employeeNumber
        ], (err) => {
          if (err) {
            console.error("Error inserting into person_table:", err);
            // Clean up user record if person insert fails
            const cleanupQuery = "DELETE FROM users WHERE employeeNumber = ?";
            db.query(cleanupQuery, [employeeNumber], (cleanupErr) => {
              if (cleanupErr) {
                console.error("Error cleaning up user record:", cleanupErr);
              }
            });
            return res.status(500).send({ error: "Failed to create person record" });
          }

          res.status(200).send({ message: "User Registered Successfully" });
        });
      });
    });

  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send({ error: "Failed to register user" });
  }
});

// BULK REGISTER
app.post("/excel-register", async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "No users data provided" });
  }

  const results = [];
  const errors = [];

  try {
    await Promise.all(
      users.map(
        (user) =>
          new Promise((resolve) => {
            // Build full name
            const fullName = [
              user.firstName,
              user.middleName || "",
              user.lastName,
              user.nameExtension || ""
            ]
              .filter(Boolean)
              .join(" ");

            // Check if employee number already exists
            const queryCheck = `
              SELECT employeeNumber FROM users WHERE employeeNumber = ? 
              UNION 
              SELECT agencyEmployeeNum FROM person_table WHERE agencyEmployeeNum = ?
            `;
            
            db.query(queryCheck, [user.employeeNumber, user.employeeNumber], (err, existingRecords) => {
              if (err) {
                errors.push(
                  `Error checking user ${user.employeeNumber}: ${err.message}`
                );
                return resolve();
              }

              if (existingRecords.length > 0) {
                errors.push(
                  `Employee number ${user.employeeNumber} already exists`
                );
                return resolve();
              }

              // Insert into users
              const userQuery = `
                INSERT INTO users (
                  email,
                  role,
                  password,
                  employeeNumber,
                  employmentCategory,
                  access_level,
                  username
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `;

              db.query(userQuery, [
                user.email,
                "staff",
                bcrypt.hashSync(user.password, 10),
                user.employeeNumber,
                "0",
                "user",
                fullName
              ], (err) => {
                if (err) {
                  errors.push(
                    `Error inserting user ${user.employeeNumber}: ${err.message}`
                  );
                  return resolve();
                }

                // Insert into person_table
                const personQuery = `
                  INSERT INTO person_table (
                    firstName,
                    middleName,
                    lastName,
                    nameExtension,
                    agencyEmployeeNum
                  ) VALUES (?, ?, ?, ?, ?)
                `;

                db.query(personQuery, [
                  user.firstName,
                  user.middleName || null,
                  user.lastName,
                  user.nameExtension || null,
                  user.employeeNumber
                ], (err) => {
                  if (err) {
                    errors.push(
                      `Error inserting person ${user.employeeNumber}: ${err.message}`
                    );
                    // Clean up user record if person insert fails
                    const cleanupQuery = "DELETE FROM users WHERE employeeNumber = ?";
                    db.query(cleanupQuery, [user.employeeNumber], (cleanupErr) => {
                      if (cleanupErr) {
                        console.error("Error cleaning up user record:", cleanupErr);
                      }
                    });
                    return resolve();
                  }

                  results.push({
                    employeeNumber: user.employeeNumber,
                    name: fullName,
                    status: "success",
                  });
                  resolve();
                });
              });
            });
          })
      )
    );

    res.json({
      message: "Bulk registration completed",
      successful: results,
      errors: errors,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// GET ALL REGISTERED USERS WITH PAGE ACCESS
app.get("/users", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.employeeNumber,
        u.email,
        u.role,
        u.employmentCategory,
        u.access_level,
        p.firstName,
        p.middleName,
        p.lastName,
        p.nameExtension,
        u.created_at,
        pa.page_id,
        pa.page_privilege
      FROM users u
      LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum
      LEFT JOIN page_access pa ON u.employeeNumber = pa.employeeNumber
      ORDER BY u.created_at DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Failed to fetch users" });
      }

      // Group page access per user
      const usersMap = {};
      results.forEach(row => {
        if (!usersMap[row.employeeNumber]) {
          usersMap[row.employeeNumber] = {
            employeeNumber: row.employeeNumber,
            fullName: `${row.firstName || ''} ${row.middleName ? row.middleName + ' ' : ''}${row.lastName || ''}${row.nameExtension ? ' ' + row.nameExtension : ''}`.trim(),
            firstName: row.firstName,
            middleName: row.middleName,
            lastName: row.lastName,
            nameExtension: row.nameExtension,
            email: row.email,
            role: row.role,
            employmentCategory: row.employmentCategory,
            accessLevel: row.access_level,
            createdAt: row.created_at,
            pageAccess: [] // add privileges
          };
        }

        if (row.page_id) {
          usersMap[row.employeeNumber].pageAccess.push({
            page_id: row.page_id,
            page_privilege: row.page_privilege
          });
        }
      });

      res.status(200).json({
        message: "Users fetched successfully",
        users: Object.values(usersMap),
        total: Object.keys(usersMap).length
      });
    });

  } catch (err) {
    console.error("Error during user fetch:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});





// GET ALL PAGES
app.get("/pages", async (req, res) => {
  const query = `
    SELECT id, page_name, page_description, page_url, page_group
    FROM pages
    ORDER BY page_description ASC
  `;

  try {
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching pages:", err);
        return res.status(500).json({ error: "Failed to fetch pages" });
      }

      res.status(200).json(result);
    });
  } catch (err) {
    console.error("Error during page fetch:", err);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

// CREATE PAGE - Add this to your backend routes
app.post("/pages", async (req, res) => {
  const { page_name, page_description, page_url, page_group } = req.body;

  // Validate required fields
  if (!page_name || !page_description || !page_group) {
    return res.status(400).json({ 
      error: "Page name, description, and group are required" 
    });
  }

  try {
    const query = `
      INSERT INTO pages (page_name, page_description, page_url, page_group)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [page_name, page_description, page_url || null, page_group], (err, result) => {
      if (err) {
        console.error("Error creating page:", err);
        return res.status(500).json({ error: "Failed to create page" });
      }

      res.status(201).json({ 
        message: "Page created successfully",
        pageId: result.insertId 
      });
    });
  } catch (err) {
    console.error("Error during page creation:", err);
    res.status(500).json({ error: "Failed to create page" });
  }
});

// Also fix your CREATE PAGE ACCESS endpoint to handle the employeeNumber from request body
app.post("/page_access", async (req, res) => {
  const { employeeNumber, page_id, page_privilege } = req.body;

  // Validate required fields
  if (!employeeNumber || !page_id || !page_privilege) {
    return res.status(400).json({ 
      error: "Employee number, page ID, and privilege are required" 
    });
  }

  try {
    // Check if record already exists
    const checkQuery = `
      SELECT * FROM page_access 
      WHERE employeeNumber = ? AND page_id = ?
    `;
    
    db.query(checkQuery, [employeeNumber, page_id], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking existing page access:", checkErr);
        return res.status(500).json({ error: "Failed to check page access" });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({ error: "Page access already exists for this user" });
      }

      // Insert new page access
      const insertQuery = `
        INSERT INTO page_access (employeeNumber, page_id, page_privilege)
        VALUES (?, ?, ?)
      `;
      
      db.query(insertQuery, [employeeNumber, page_id, page_privilege], (insertErr) => {
        if (insertErr) {
          console.error("Error creating page access:", insertErr);
          return res.status(500).json({ error: "Failed to create page access" });
        }
        res.status(201).json({ message: "Page access created successfully" });
      });
    });
  } catch (err) {
    console.error("Error during page access creation:", err);
    res.status(500).json({ error: "Failed to create page access" });
  }
});


// UPDATE PAGE
app.put("/pages/:id", async (req, res) => {
  const { id } = req.params;
  const { page_name, page_description, page_url, page_group } = req.body;

  try {
    const query = `
      UPDATE pages 
      SET page_name = ?, page_description = ?, page_url = ?, page_group = ?
      WHERE id = ?
    `;

    db.query(query, [page_name, page_description, page_url, page_group, id], (err, result) => {
      if (err) {
        console.error("Error updating page:", err);
        return res.status(500).json({ error: "Failed to update page" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.status(200).json({ message: "Page updated successfully" });
    });
  } catch (err) {
    console.error("Error during page update:", err);
    res.status(500).json({ error: "Failed to update page" });
  }
});

// DELETE PAGE
app.delete("/pages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM pages WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting page:", err);
        return res.status(500).json({ error: "Failed to delete page" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.status(200).json({ message: "Page deleted successfully" });
    });
  } catch (err) {
    console.error("Error during page deletion:", err);
    res.status(500).json({ error: "Failed to delete page" });
  }
});




// GET USER PAGE ACCESS
app.get("/page_access/:employeeNumber", async (req, res) => {
  const { employeeNumber } = req.params;

  try {
    const query = `
      SELECT page_id, page_privilege 
      FROM page_access 
      WHERE employeeNumber = ?
    `;
    
    db.query(query, [employeeNumber], (err, results) => {
      if (err) {
        console.error("Error fetching page access:", err);
        return res.status(500).json({ error: "Failed to fetch page access" });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error("Error during page access fetch:", err);
    res.status(500).json({ error: "Failed to fetch page access" });
  }
});


// CREATE PAGE ACCESS
app.post("/page_access", async (req, res) => {
  const { employeeNumber, page_id, page_privilege } = req.body;

  try {
    const query = `
      INSERT INTO page_access (employeeNumber, page_id, page_privilege)
      VALUES (?, ?, ?)
    `;
    
    db.query(query, [employeeNumber, page_id, page_privilege], (err) => {
      if (err) {
        console.error("Error creating page access:", err);
        return res.status(500).json({ error: "Failed to create page access" });
      }
      res.status(200).json({ message: "Page access created successfully" });
    });
  } catch (err) {
    console.error("Error during page access creation:", err);
    res.status(500).json({ error: "Failed to create page access" });
  }
});

// UPDATE PAGE ACCESS
app.put("/page_access/:employeeNumber/:pageId", async (req, res) => {
  const { employeeNumber, pageId } = req.params;
  const { page_privilege } = req.body;

  try {
    const query = `
      UPDATE page_access 
      SET page_privilege = ? 
      WHERE employeeNumber = ? AND page_id = ?
    `;
    
    db.query(query, [page_privilege, employeeNumber, pageId], (err, result) => {
      if (err) {
        console.error("Error updating page access:", err);
        return res.status(500).json({ error: "Failed to update page access" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Page access record not found" });
      }
      res.status(200).json({ message: "Page access updated successfully" });
    });
  } catch (err) {
    console.error("Error during page access update:", err);
    res.status(500).json({ error: "Failed to update page access" });
  }
});


// GET SINGLE USER WITH PAGE ACCESS
app.get("/users/:employeeNumber", async (req, res) => {
  const { employeeNumber } = req.params;

  try {
    const query = `
      SELECT 
        u.employeeNumber,
        u.email,
        u.role,
        u.employmentCategory,
        u.access_level,
        p.firstName,
        p.middleName,
        p.lastName,
        p.nameExtension,
        u.created_at,
        pa.page_id,
        pa.page_privilege
      FROM users u
      LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum
      LEFT JOIN page_access pa ON u.employeeNumber = pa.employeeNumber
      WHERE u.employeeNumber = ?
    `;

    db.query(query, [employeeNumber], (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Failed to fetch user" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const base = results[0];
      const user = {
        employeeNumber: base.employeeNumber,
        fullName: `${base.firstName || ''} ${base.middleName ? base.middleName + ' ' : ''}${base.lastName || ''}${base.nameExtension ? ' ' + base.nameExtension : ''}`.trim(),
        firstName: base.firstName,
        middleName: base.middleName,
        lastName: base.lastName,
        nameExtension: base.nameExtension,
        email: base.email,
        role: base.role,
        employmentCategory: base.employmentCategory,
        accessLevel: base.access_level,
        createdAt: base.created_at,
        pageAccess: results
          .filter(r => r.page_id)
          .map(r => ({
            page_id: r.page_id,
            page_privilege: r.page_privilege
          }))
      };

      res.status(200).json({
        message: "User fetched successfully",
        user
      });
    });

  } catch (err) {
    console.error("Error during user fetch:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});




//LOGIN - Updated to get full name from person_table

app.post('/login', (req, res) => {
  const { employeeNumber, password } = req.body;

  const query = `
    SELECT u.*, 
           p.firstName, 
           p.middleName, 
           p.lastName, 
           p.nameExtension,
           CONCAT(p.firstName, 
                  CASE WHEN p.middleName IS NOT NULL THEN CONCAT(' ', p.middleName) ELSE '' END,
                  ' ', p.lastName,
                  CASE WHEN p.nameExtension IS NOT NULL THEN CONCAT(' ', p.nameExtension) ELSE '' END
           ) as fullName
    FROM users u 
    LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum 
    WHERE u.employeeNumber = ?
  `;

  db.query(query, [employeeNumber], async (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0)
      return res.status(400).send({ message: 'User not found' });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

    // don’t issue token yet, wait until 2FA is completed
    res.status(200).send({
      email: user.email,
      employeeNumber: user.employeeNumber,
      fullName: user.fullName,
    });
  });
});

// send 2FA code - Updated to get full name from person_table
app.post("/send-2fa-code", async (req, res) => {
  const { email, employeeNumber } = req.body;
  if (!email || !employeeNumber) {
    return res.status(400).json({ error: "Email and employee number required" });
  }

  // Join to get full name from person_table
  const query = `
    SELECT p.firstName, 
           p.middleName, 
           p.lastName, 
           p.nameExtension,
           CONCAT(p.firstName, 
                  CASE WHEN p.middleName IS NOT NULL THEN CONCAT(' ', p.middleName) ELSE '' END,
                  ' ', p.lastName,
                  CASE WHEN p.nameExtension IS NOT NULL THEN CONCAT(' ', p.nameExtension) ELSE '' END
           ) as fullName
    FROM users u 
    LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum 
    WHERE u.email = ? AND u.employeeNumber = ?
  `;
  
  db.query(query, [email, employeeNumber], async (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];

    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // store in memory (indexed by email)
    twoFACodes[email] = { code, expiresAt };

    try {
      await transporter.sendMail({
        from: '"EARIST HR Testing" <yourgmail@gmail.com>',
        to: email,
        subject: "Login Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6d2323;">Login Verification</h2>
            <p>Hello ${user.fullName},</p>
            <p>We detected a login attempt to your account. For your security, please verify your identity by entering the verification code below:</p>
            
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #6d2323; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            
            <p>This code will expire in 15 minutes. Do not share it with anyone.</p>
            <p>If this login attempt wasn't made by you, we recommend securing your account immediately.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message from your HRIS system.</p>
          </div>
        `
      });

      res.json({ message: "Verification code sent" });
    } catch (err) {
      console.error("Email send error:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
});

// verify code
app.post("/verify-2fa-code", (req, res) => {
  const { email, code } = req.body;
  const record = twoFACodes[email];

  if (!record) {
    return res.status(400).json({ error: "No code found. Please request again." });
  }

  if (Date.now() > record.expiresAt) {
    delete twoFACodes[email];
    return res.status(400).json({ error: "Code expired. Please request a new one." });
  }

  if (record.code !== code) {
    return res.status(400).json({ error: "Invalid code" });
  }

  res.json({ verified: true });
});

// complete login (issue JWT) - Updated to get full name from person_table
app.post("/complete-2fa-login", (req, res) => {
  const { email, employeeNumber } = req.body;
 
  // Join to get full name from person_table
  const query = `
    SELECT u.*, 
           p.firstName, 
           p.middleName, 
           p.lastName, 
           p.nameExtension,
           CONCAT(p.firstName, 
                  CASE WHEN p.middleName IS NOT NULL THEN CONCAT(' ', p.middleName) ELSE '' END,
                  ' ', p.lastName,
                  CASE WHEN p.nameExtension IS NOT NULL THEN CONCAT(' ', p.nameExtension) ELSE '' END
           ) as fullName
    FROM users u 
    LEFT JOIN person_table p ON u.employeeNumber = p.agencyEmployeeNum 
    WHERE u.email = ? OR u.employeeNumber = ?
  `;
 
  db.query(query, [email, employeeNumber], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Database error" });
    }
   
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
   
    const user = result[0];
   
    // Clean up the 2FA code since login is successful
    delete twoFACodes[email];
   
    // Generate JWT with actual user data including full name
    const token = jwt.sign(
      {
        id: user.id,
        username: user.fullName, // Using constructed full name
        employeeNumber: user.employeeNumber,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nameExtension: user.nameExtension
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "10h" }
    );

    res.json({
      token,
      role: user.role,
      employeeNumber: user.employeeNumber,
      email: user.email,
      username: user.fullName, // Full name as username
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      nameExtension: user.nameExtension
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
              insertAuditLog(person_id || "SYSTEM", `Added Program for ${person_id} in Learning and Development Program`);
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
app.post('/api/settings', upload.single('logo'), (req, res) => {
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
app.get('/officialtimetable/:employeeID', authenticateToken, (req, res) => {
  const { employeeID } = req.params;
  const { date } = req.query;
  const sql = 'SELECT * FROM officialtime WHERE employeeID = ? ORDER BY id';


  db.query(sql, [employeeID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });


    try {
      logAudit(req.user, `View`, 'Official Time', null, employeeID);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    if (date) {
      try {
        logAudit(req.user, 'search', 'official-time-table', date, employeeID);
      } catch (e) {
        console.error('Audit log error:', e);
      }
    }
    res.json(results);
  });
});


app.post('/officialtimetable', authenticateToken, (req, res) => {
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
    try {
      logAudit(
        req.user,
        `Insert official time-table for ${employeeID} (${records.length} rows)`,
        'Official Time',
        null,
        employeeID
      );
    } catch (e) {
      console.error('Audit log error:', e);
    }
    res.json({ message: 'Records inserted or updated successfully' });
  });
});


// EXCEL UPLOAD FOR OFFICIAL TIME


app.post(
  '/upload-excel-faculty-official-time',
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }


    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: null,
        raw: false,
      });


      if (!sheet.length) {
        return res.status(400).json({ message: 'Excel file is empty.' });
      }


      const cleanedSheet = sheet.map((row) => {
        const normalized = {};
        for (const key in row) {
          const cleanKey = key
            .replace(/\u00A0/g, '')
            .trim()
            .toLowerCase();
          normalized[cleanKey] = row[key];
        }
        return normalized;
      });


      const getField = (r, names) => {
        for (const n of names) {
          if (r[n] != null) return r[n];
        }
        return null;
      };


      let insertedCount = 0;
      let updatedCount = 0;
      const processedRecords = []; // ADD THIS LINE


      for (const r of cleanedSheet) {
        const employeeID = getField(r, [
          'employeeid',
          'employeenumber',
          'employee number',
          'employee_id',
        ]);
        const day = getField(r, ['day', 'weekday']);
        const officialTimeIN = getField(r, [
          'officialtimein',
          'time in',
          'timein',
        ]);
        const officialBreaktimeIN = getField(r, [
          'officialbreaktimein',
          'break in',
          'breakin',
        ]);
        const officialBreaktimeOUT = getField(r, [
          'officialbreaktimeout',
          'break out',
          'breakout',
        ]);
        const officialTimeOUT = getField(r, [
          'officialtimeout',
          'time out',
          'timeout',
        ]);
        const officialHonorariumTimeIN = getField(r, [
          'officialhonorariumtimein',
          'honorarium time in',
          'honorariumtimein',
        ]);
        const officialHonorariumTimeOUT = getField(r, [
          'officialhonorariumtimeout',
          'honorarium time out',
          'honorariumtimeout',
        ]);
        const officialServiceCreditTimeIN = getField(r, [
          'officialservicecredittimein',
          'service credit time in',
          'servicecredittimein',
        ]);
        const officialServiceCreditTimeOUT = getField(r, [
          'officialservicecredittimeout',
          'service credit time out',
          'servicecredittimeout',
        ]);
        const officialOverTimeIN = getField(r, [
          'officialovertimein',
          'overtime in',
          'ot in',
          'overtimein',
        ]);
        const officialOverTimeOUT = getField(r, [
          'officialovertimeout',
          'overtime out',
          'ot out',
          'overtimeout',
        ]);


        if (!employeeID || !day) continue;


        // ADD THIS: Store the record for return
        const recordData = {
          employeeID,
          day,
          officialTimeIN: officialTimeIN || '00:00:00 AM',
          officialBreaktimeIN: officialBreaktimeIN || '00:00:00 AM',
          officialBreaktimeOUT: officialBreaktimeOUT || '00:00:00 AM',
          officialTimeOUT: officialTimeOUT || '00:00:00 AM',
          officialHonorariumTimeIN: officialHonorariumTimeIN || '00:00:00 AM',
          officialHonorariumTimeOUT: officialHonorariumTimeOUT || '00:00:00 AM',
          officialServiceCreditTimeIN:
            officialServiceCreditTimeIN || '00:00:00 AM',
          officialServiceCreditTimeOUT:
            officialServiceCreditTimeOUT || '00:00:00 AM',
          officialOverTimeIN: officialOverTimeIN || '00:00:00 AM',
          officialOverTimeOUT: officialOverTimeOUT || '00:00:00 AM',
        };
        processedRecords.push(recordData);


        const checkQuery = `SELECT id FROM officialtime WHERE employeeID = ? AND day = ?`;
        const checkValues = [employeeID, day];


        try {
          const [rows] = await db.promise().query(checkQuery, checkValues);


          if (rows.length > 0) {
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


            const [result] = await db
              .promise()
              .query(updateQuery, updateValues);
            if (result.affectedRows > 0) updatedCount++;
          } else {
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


            const [result] = await db
              .promise()
              .query(insertQuery, insertValues);
            if (result.affectedRows > 0) insertedCount++;
          }
        } catch (err) {
          console.error(
            `Error processing row for employeeID: ${employeeID}, day: ${day}`,
            err.message
          );
        }
      }


      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });


      // MODIFY THIS: Return the processed records
      res.json({
        message: 'Upload complete.',
        inserted: insertedCount,
        updated: updatedCount,
        records: processedRecords, // ADD THIS LINE
      });
    } catch (error) {
      console.error('Error processing Excel file:', error);
      res.status(500).json({ message: 'Error processing Excel file.' });
    }
  }
);








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

app.get('/api/item-table', authenticateToken, (req, res) => {
  const sql = `
    SELECT id, item_description, employeeID, name, item_code, salary_grade, step, effectivityDate, dateCreated
    FROM item_table
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    try {
      logAudit(req.user, 'View', 'item_table', null, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.json(result);
  });
});

// Add new item (Do NOT include `dateCreated` — it auto-generates)
app.post('/api/item-table', authenticateToken, (req, res) => {
  const {
    item_description,
    employeeID,
    name,
    item_code,
    salary_grade,
    step,
    effectivityDate,
  } = req.body;

  const sql = `
    INSERT INTO item_table (item_description, employeeID, name, item_code, salary_grade, step, effectivityDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      item_description,
      employeeID,
      name,
      item_code,
      salary_grade,
      step,
      effectivityDate,
    ],
    (err, result) => {
      if (err) {
        console.error('Database Insert Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      try {
        logAudit(req.user, 'Insert', 'item_table', result.insertId, employeeID);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      
      res.json({
        message: 'Item record added successfully',
        id: result.insertId,
      });
    }
  );
});

// Update item (Do NOT touch `dateCreated`)
app.put('/api/item-table/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    item_description,
    employeeID,
    name,
    item_code,
    salary_grade,
    step,
    effectivityDate,
  } = req.body;

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
    [
      item_description,
      employeeID,
      name,
      item_code,
      salary_grade,
      step,
      effectivityDate,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('Database Update Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      try {
        logAudit(req.user, 'Update', 'item_table', id, employeeID);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      
      res.json({ message: 'Item record updated successfully' });
    }
  );
});

// Delete item
app.delete('/api/item-table/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM item_table WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database Delete Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    try {
      logAudit(req.user, 'Delete', 'item_table', id, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.json({ message: 'Item record deleted successfully' });
  });
});






// Get all records
app.get('/api/salary-grade-status', authenticateToken, (req, res) => {
  db.query('SELECT * FROM salary_grade_status', (err, result) => {
    if (err) res.status(500).send(err);
    else {
      try {
        logAudit(req.user, 'View', 'salary_grade_status', null, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      res.json(result);
    }
  });
});

// Add a new record
app.post('/api/salary-grade-status', authenticateToken, (req, res) => {
  const { effectivityDate, step_number, status } = req.body;

  const sql = `
    INSERT INTO salary_grade_status (effectivityDate, step_number, status)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [effectivityDate, step_number, status], (err, result) => {
    if (err) res.status(500).send(err);
    else {
      try {
        logAudit(req.user, 'Insert', 'salary_grade_status', result.insertId, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      res.json({ message: 'Record added successfully', id: result.insertId });
    }
  });
});

// Update a record
app.put('/api/salary-grade-status/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { effectivityDate, step_number, status } = req.body;

  const sql = `
    UPDATE salary_grade_status
    SET effectivityDate = ?, step_number = ?, status = ?
    WHERE id = ?
  `;

  db.query(sql, [effectivityDate, step_number, status, id], (err) => {
    if (err) res.status(500).send(err);
    else {
      try {
        logAudit(req.user, 'Update', 'salary_grade_status', id, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      res.json({ message: 'Record updated successfully' });
    }
  });
});

// Delete a record
app.delete('/api/salary-grade-status/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM salary_grade_status WHERE id = ?', [id], (err) => {
    if (err) res.status(500).send(err);
    else {
      try {
        logAudit(req.user, 'Delete', 'salary_grade_status', id, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      res.json({ message: 'Record deleted successfully' });
    }
  });
});




app.get('/api/department-table', authenticateToken, (req, res) => {
  db.query('SELECT * FROM department_table', (err, results) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'View', 'department_table', null, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.json(results);
  });
});

// Get a single department table by ID
app.get('/api/department-table/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM department_table WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send('Department not found');
      
      try {
        logAudit(req.user, 'View', 'department_table', id, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      
      res.json(result[0]);
    }
  );
});

// Add a new department table
app.post('/api/department-table', authenticateToken, (req, res) => {
  const { code, description } = req.body;
  if (!code || !description)
    return res.status(400).send('Code and description are required');

  const sql = `INSERT INTO department_table (code, description) VALUES (?, ?)`;
  db.query(sql, [code, description], (err, result) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'Insert', 'department_table', result.insertId, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.status(201).json({ id: result.insertId, code, description });
  });
});

// Update a department table
app.put('/api/department-table/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { code, description } = req.body;

  const sql = `UPDATE department_table SET code = ?, description = ? WHERE id = ?`;
  db.query(sql, [code, description, id], (err, result) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'Update', 'department_table', id, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.send('Department updated successfully');
  });
});

// Delete a department table
app.delete('/api/department-table/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM department_table WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'Delete', 'department_table', id, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.send('Department deleted successfully');
  });
});

/////////////////////////////////////////////////////////////////////////////
// Get all department assignments
app.get('/api/department-assignment', authenticateToken, (req, res) => {
  db.query('SELECT * FROM department_assignment', (err, results) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'View', 'department_assignment', null, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.json(results);
  });
});

// Get a single department assignment by ID
app.get('/api/department-assignment/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM department_assignment WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send('Department Assignment not found');
      
      try {
        logAudit(req.user, 'View', 'department_assignment', id, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      
      res.json(result[0]);
    }
  );
});

// Add a new department assignment (now using department code)
app.post('/api/department-assignment', authenticateToken, (req, res) => {
  const { code, name, employeeNumber } = req.body;
  if (!code || !employeeNumber)
    return res.status(400).send('Code and Employee Number are required');

  const sql = `INSERT INTO department_assignment (code, name, employeeNumber) VALUES (?, ?, ?)`;
  db.query(sql, [code, name, employeeNumber], (err, result) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'Insert', 'department_assignment', result.insertId, employeeNumber);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.status(201).json({ id: result.insertId, code, name, employeeNumber });
  });
});

// Update a department assignment (by ID)
app.put('/api/department-assignment/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { code, name, employeeNumber } = req.body;

  const sql = `UPDATE department_assignment SET code = ?, name = ?, employeeNumber = ? WHERE id = ?`;
  db.query(sql, [code, name, employeeNumber, id], (err, result) => {
    if (err) return res.status(500).send(err);
    
    try {
      logAudit(req.user, 'Update', 'department_assignment', id, employeeNumber);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.send('Department assignment updated successfully');
  });
});

// Delete a department assignment
app.delete('/api/department-assignment/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM department_assignment WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      
      try {
        logAudit(req.user, 'Delete', 'department_assignment', id, null);
      } catch (e) {
        console.error('Audit log error:', e);
      }
      
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




app.get('/holiday', (req, res) => {
  const sql = `SELECT * FROM holiday`;




  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});




app.post('/holiday', (req, res) => {
  const { description, date, status } = req.body;




  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }




  const sql = `INSERT INTO holiday (description, date, status) VALUES (?, ?, ?)`;
  db.query(sql, [description, date, status], (err, result) => {
    if (err) {
      console.error('Database Insert Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    res.status(201).json({
      message: 'Holiday record added successfully',
      id: result.insertId,
    });
  });
});




app.put('/holiday/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const { description, date, status } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }




  const sql = `UPDATE holiday SET description = ?, date = ?, status = ? WHERE id = ?`;
  db.query(sql, [description, date, status, id], (err, result) => {
    if (err) {
      console.error('Database Update Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Hol record not found' });
    }




    res.json({ message: 'Hol record updated successfully' });
  });
});




app.delete('/holiday/:id', (req, res) => {
  const { id } = req.params;




  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }




  const sql = `DELETE FROM holiday WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database Delete Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }




    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Hol record not found' });
    }




    res.json({ message: 'Hol record deleted successfully' });
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
app.post("/excel-register", async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "No users data provided" });
  }

  const results = [];
  const errors = [];

  try {
    await Promise.all(
      users.map(
        (user) =>
          new Promise((resolve) => {
            const queryCheck = "SELECT * FROM users WHERE employeeNumber = ?";
            db.query(queryCheck, [user.employeeNumber], (err, existingUser) => {
              if (err) {
                errors.push(
                  `Error checking user ${user.employeeNumber}: ${err.message}`
                );
                return resolve();
              }

              if (existingUser.length > 0) {
                errors.push(
                  `Employee number ${user.employeeNumber} already exists`
                );
                return resolve();
              }

              const hashedPassword = bcrypt.hashSync(user.password, 10);
              const queryInsert =
                "INSERT INTO users (username, email, role, password, employeeNumber, employmentCategory, access_level) VALUES (?, ?, ?, ?, ?, ?, ?)";

              db.query(
                queryInsert,
                [
                  user.username,
                  user.email,
                  "staff",
                  hashedPassword,
                  user.employeeNumber,
                  "0",
                  "user",
                ],
                (err) => {
                  if (err) {
                    errors.push(
                      `Error processing user ${user.employeeNumber}: ${err.message}`
                    );
                  } else {
                    results.push({
                      employeeNumber: user.employeeNumber,
                      username: user.username,
                      status: "success",
                    });
                  }
                  resolve();
                }
              );
            });
          })
      )
    );

    // Send final results AFTER all queries are processed
    res.json({
      message: "Bulk registration completed",
      successful: results,
      errors: errors,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});







// app.listen(5000, () => {
//   console.log('Server runnning');
// });

// Profile picture upload endpoint
app.post('/upload-profile-picture/:employeeNumber', profileUpload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { employeeNumber } = req.params;
    const filePath = `/uploads/profile_pictures/${req.file.filename}`;

    // Update the person_table with the new profile picture path
    const query = 'UPDATE person_table SET profile_picture = ? WHERE agencyEmployeeNum = ?';
    
    db.query(query, [filePath, employeeNumber], (err, result) => {
      if (err) {
        console.error('Error updating profile picture:', err);
        return res.status(500).json({ error: 'Failed to update profile picture' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json({
        message: 'Profile picture updated successfully',
        filePath: filePath
      });
    });
  } catch (error) {
    console.error('Error in profile picture upload:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

 
  // Announcements endpoints
  app.get('/api/announcements', (req, res) => {
    const query = 'SELECT * FROM announcements ORDER BY date DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching announcements:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });

  app.post('/api/announcements', upload.single('image'), (req, res) => {
    const { title, about, date } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO announcements (title, about, date, image) VALUES (?, ?, ?, ?)';
    db.query(query, [title, about, date, image], (err, result) => {
      if (err) {
        console.error('Error creating announcement:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ 
        message: 'Announcement created successfully',
        id: result.insertId 
      });
    });
  });

  // Update announcement
app.put('/api/announcements/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, about, date } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // Build query dynamically if image is updated
  let query, params;
  if (image) {
    query = 'UPDATE announcements SET title = ?, about = ?, date = ?, image = ? WHERE id = ?';
    params = [title, about, date, image, id];
  } else {
    query = 'UPDATE announcements SET title = ?, about = ?, date = ? WHERE id = ?';
    params = [title, about, date, id];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating announcement:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement updated successfully' });
  });
});


  app.delete('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    
    // First get the announcement to check if it has an image
    const getQuery = 'SELECT image FROM announcements WHERE id = ?';
    db.query(getQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Announcement not found' });
      }

      // If there's an image, delete it from the filesystem
      if (results[0].image) {
        const imagePath = path.join(__dirname, results[0].image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image:', err);
        });
      }

      // Delete the announcement from the database
      const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
      db.query(deleteQuery, [id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Announcement deleted successfully' });
      });
    });
  });




app.get('/audit-logs', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM audit_log ORDER BY timestamp DESC';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching audit logs:', err);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
    
    try {
      logAudit(req.user, 'View', 'audit_log', null, null);
    } catch (e) {
      console.error('Audit log error:', e);
    }
    
    res.json(result);
  });
});





// HR TASKS

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { title, priority } = req.body;
  db.query(
    "INSERT INTO tasks (title, priority) VALUES (?, ?)",
    [title, priority],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title, priority, completed: false });
    }
  );
});

// Toggle task completed
app.put("/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE tasks SET completed = NOT completed WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

