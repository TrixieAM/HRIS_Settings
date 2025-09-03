const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
require("dotenv").config();




// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });




// MYSQL CONNECTION
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});








// ✅ GET all users
router.get("/users", (req, res) => {
  const sql = "SELECT username AS name, email, employeeNumber FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});








// ✅ TEST endpoint
router.get("/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    gmailConfigured: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS)
  });
});




// ✅ SEND payslip via Gmail
router.post("/send-payslip", upload.single("pdf"), async (req, res) => {
  try {
    const { name, employeeNumber } = req.body;
    const pdfFile = req.file;




    if (!name || !employeeNumber || !pdfFile) {
      return res.status(400).json({
        error: "Missing required fields",
        received: { name, employeeNumber, hasFile: !!pdfFile },
      });
    }




    // ✅ Lookup only by employeeNumber
    const sql = "SELECT email FROM users WHERE employeeNumber = ?";
    db.query(sql, [employeeNumber], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });




      const email = results[0].email;




                if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.error("❌ Gmail credentials are missing in .env file");
            }




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




            // ✅ Verify Gmail connection at startup
            transporter.verify((error, success) => {
            if (error) {
                console.error("❌ Gmail connection failed:", error);
            } else {
                console.log("✅ Gmail is ready to send emails");
            }
            });








                const mailOptions = {
                    from: `"EARIST HR Testing Notice" <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: `Payslip for ${name}`,
                    text: `Dear ${name},\n\nPlease find your payslip attached. We encourage you to review the details carefully.\n\nIf you have any questions, notice mismatches and errors, or require further clarification, kindly reach out to the\nHR team at earisthrmstesting@gmail.com or go to the HR Office. Your concerns will be addressed promptly.\n\nWe sincerely appreciate your hard work and contributions to the Institution. Thank you for your continued dedication.\n\nBest regards,\nEARIST HR Testing Team`,
                    attachments: [
                    {
                        filename: `${name}_payslip.pdf`,
                        content: pdfFile.buffer,
                    },
                    ],
                };




                await transporter.sendMail(mailOptions);
                res.json({ success: true, message: "Payslip sent successfully" });
                });
            } catch (err) {
                res.status(500).json({ success: false, error: err.message });
            }
            });


// ✅ SEND payslips to selected employees only
router.post("/send-bulk", upload.array("pdfs"), async (req, res) => {
  try {
    // Parse the selected employees sent from frontend
    const payslips = req.body.payslips ? JSON.parse(req.body.payslips) : [];
    const pdfFiles = req.files;


    if (!payslips.length || !pdfFiles.length) {
      return res.status(400).json({ error: "Missing payslips or pdf files" });
    }


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });


    let results = [];


    for (let i = 0; i < payslips.length; i++) {
      const { name, employeeNumber } = payslips[i];
      const pdfFile = pdfFiles[i];


      // ✅ Fetch Gmail from DB
      const [rows] = await db.promise().query(
        "SELECT email FROM users WHERE employeeNumber = ?",
        [employeeNumber]
      );


      if (rows.length === 0) {
        results.push({
          employeeNumber,
          success: false,
          error: "User not found",
        });
        continue;
      }


      const email = rows[0].email;


      // Updated email options in your SendPayslip.js backend
const mailOptions = {
  from: `"EARIST HR Testing Notice" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: `Payslip for ${name} - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
  text: `Dear ${name},


Please find your payslip attached. We encourage you to review the details carefully.


If you have any questions, notice mismatches and errors, or require further clarification, kindly reach out to the
HR team at earisthrmstesting@gmail.com or go to the HR Office. Your concerns will be addressed promptly.


We sincerely appreciate your hard work and contributions to the Institution. Thank you for your continued dedication.


Best regards,
EARIST HR Testing Team`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h3 style="color: #6D2323;">EARIST HR - Monthly Payslip</h3>
     
      <p>Dear <strong>${name}</strong>,</p>
     
      <p>Please find your payslip attached. We encourage you to review the details carefully.</p>
     
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #6D2323; margin: 20px 0;">
        <p style="margin: 0;"><strong>Important:</strong> If you have any questions, notice mismatches and errors, or require further clarification, kindly reach out to the HR team.</p>
      </div>
     
      <p><strong>Contact Information:</strong><br>
      📧 Email: <a href="mailto:earisthrmstesting@gmail.com">earisthrmstesting@gmail.com</a><br>
      🏢 Visit: HR Office</p>
     
      <p>We sincerely appreciate your hard work and contributions to the Institution. Thank you for your continued dedication.</p>
     
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">
        Best regards,<br>
        <strong>EARIST HR Testing Team</strong><br>
        Eulogio "Amang" Rodriguez Institute of Science and Technology
      </p>
    </div>
  `,
  attachments: [
    {
      filename: `${name}_payslip_${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_')}.pdf`,
      content: pdfFile.buffer,
    },
  ],
};


      try {
        await transporter.sendMail(mailOptions);
        results.push({ employeeNumber, success: true });
      } catch (err) {
        results.push({ employeeNumber, success: false, error: err.message });
      }
    }


    res.json({ success: true, results });
  } catch (err) {
    console.error("Bulk send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});






module.exports = router;





