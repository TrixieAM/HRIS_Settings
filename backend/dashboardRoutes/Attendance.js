const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});

// Endpoint to fetch attendance records
// Endpoint to fetch attendance records
router.get("/api/attendance", (req, res) => {
  const { personId, startDate, endDate } = req.query;
  const sql = `
    SELECT attendanceRecord.*, users.employeeNumber, users.username,
    users.employmentCategory,officialtime.*
    FROM attendanceRecord 
    JOIN users ON attendanceRecord.personID = users.employeeNumber 
    JOIN officialtime ON attendanceRecord.Day = officialtime.day
    WHERE attendanceRecord.personID = ? 
    AND attendanceRecord.date BETWEEN ? AND ?
  `;
  db.query(sql, [personId, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
      return;
    }
    res.json(results);
  });
});

// Endpoint to check if attendance record exists
router.get("/api/check-attendance", (req, res) => {
  const { personID, date } = req.query;
  const sql = `SELECT EXISTS(SELECT * FROM attendanceRecord WHERE personID = ? AND date = ?) AS exists`;
  db.query(sql, [personID, date], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});



// Endpoint to update attendance records
router.post("/api/update-attendance", (req, res) => {
  const { records } = req.body;

  const promises = records.map((record) => {
    const sql = `UPDATE attendanceRecord SET timeIN = ?, breaktimeIN = ?, breaktimeOUT = ?, timeOUT = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [record.timeIN, record.breaktimeIN, record.breaktimeOUT, record.timeOUT, record.id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  Promise.all(promises)
    .then(() => res.json({ message: "Records updated successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Additional endpoint for attendance with date filtering
router.post("/api/attendance", (req, res) => {
  const { personID, startDate, endDate } = req.body;

  const query = `
    SELECT PersonID, AttendanceDateTime, AttendanceState 
    FROM AttendanceRecordInfo 
    WHERE PersonID = ? 
    AND AttendanceDateTime BETWEEN ? AND ?`;

  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();

  db.query(query, [personID, startTimestamp, endTimestamp], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const records = results.map((record) => {
      const date = new Date(record.AttendanceDateTime);
      const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const manilaDate = date.toLocaleString("en-PH", options);

      return {
        PersonID: record.PersonID,
        Date: manilaDate.split(",")[0], // Date part
        Time: manilaDate.split(",")[1].trim(), // Time part
        AttendanceState: record.AttendanceState,
      };
    });

    res.json(records);
  });
});

// Endpoint to fetch all attendance records with specific time columns
router.post("/api/all-attendance", (req, res) => {
  const { personID, startDate, endDate } = req.body;

  const query = `
    SELECT 
      PersonID, PersonName,
      DATE_FORMAT(FROM_UNIXTIME(AttendanceDateTime/1000), '%Y-%m-%d') AS Date,
      MIN(CASE WHEN AttendanceState = 1 THEN AttendanceDateTime END) AS Time1,
      MIN(CASE WHEN AttendanceState = 2 THEN AttendanceDateTime END) AS Time2,
      MIN(CASE WHEN AttendanceState = 3 THEN AttendanceDateTime END) AS Time3,
      MAX(CASE WHEN AttendanceState = 4 THEN AttendanceDateTime END) AS Time4
    FROM AttendanceRecordInfo
    WHERE PersonID = ? AND AttendanceDateTime BETWEEN ? AND ?
    GROUP BY Date, PersonID, PersonName;
  `;

  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();

  db.query(query, [personID, startTimestamp, endTimestamp], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const records = results.map((record) => {
      const convertToManilaTime = (timestamp) => {
        if (!timestamp) return null;
        const date = new Date(timestamp);
        return date
          .toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
          .split(", ")[1];
      };

      return {
        PersonID: record.PersonID,
        PersonName: record.PersonName,
        Date: record.Date,
        Time1: convertToManilaTime(record.Time1),
        Time2: convertToManilaTime(record.Time2),
        Time3: convertToManilaTime(record.Time3),
        Time4: convertToManilaTime(record.Time4),
      };
    });

    res.json(records);
  });
});

// Endpoint to save attendance records
router.post("/api/save-attendance", (req, res) => {
  const { records } = req.body;

  const promises = records.map((record) => {
    return new Promise((resolve, reject) => {
      const checkSql = `SELECT EXISTS(SELECT * FROM attendanceRecord WHERE personID = ? AND date = ?) AS recordExists`;
      db.query(checkSql, [record.personID, record.date], (err, checkResult) => {
        if (err) return reject(err);

        const exists = checkResult[0].recordExists;
        if (exists) {
          resolve({
            status: "exists",
            personID: record.personID,
            date: record.date,
          });
        } else {
          const insertSql = `INSERT INTO attendanceRecord (personID, date, day, timeIN, breaktimeIN, breaktimeOUT, timeOUT) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          db.query(insertSql, [record.personID, record.date, record.Day, record.timeIN, record.breaktimeIN, record.breaktimeOUT, record.timeOUT], (err) => {
            if (err) return reject(err);
            resolve({
              status: "saved",
              personID: record.personID,
              date: record.date,
            });
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then((results) => res.json(results))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// // Fetch records
// router.post("/api/view-attendance", (req, res) => {
//   const { personID, startDate, endDate } = req.body;

//   const query = `
//     SELECT attendanceRecord.personID, attendanceRecord.date,
//            DAYNAME(date) AS Day,
//            attendanceRecord.timeIN, attendanceRecord.breaktimeIN, attendanceRecord.breaktimeOUT, attendanceRecord.timeOUT, profile.*
//     FROM attendanceRecord
//     INNER JOIN profile ON attendanceRecord.personID = profile.employeeID
//     INNER JOIN profile ON attendanceRecord.Day = officialtime.day
//     WHERE personID = ? AND date BETWEEN ? AND ?
//     ORDER BY date ASC
//   `;

//   db.query(query, [personID, startDate, endDate], (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.send(results);
//   });
// });

// Fetch records
router.post("/api/view-attendance", (req, res) => {
  const { personID, startDate, endDate } = req.body;

  const query = `
    SELECT attendanceRecord.personID, attendanceRecord.date, 
    DAYNAME(date) AS Day, 
    attendanceRecord.timeIN, attendanceRecord.breaktimeIN, 
    attendanceRecord.breaktimeOUT, attendanceRecord.timeOUT, 
    profile.*, 
    officialtime.officialTimeIN, officialtime.officialTimeOUT
    FROM attendanceRecord
    INNER JOIN profile ON attendanceRecord.personID = profile.employeeID
    INNER JOIN officialtime ON DAYNAME(attendanceRecord.date) = officialtime.day
    WHERE attendanceRecord.personID = ? AND attendanceRecord.date BETWEEN ? AND ?
    ORDER BY attendanceRecord.date ASC;

  `;

  db.query(query, [personID, startDate, endDate], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Update records
router.put("/api/view-attendance", (req, res) => {
  const { records } = req.body;

  const updatePromises = records.map((record) => {
    const query = `
      UPDATE attendanceRecord
      SET timeIN = ?, breaktimeIN = ?, breaktimeOUT = ?, timeOUT = ?
      WHERE personID = ? AND date = ?
    `;

    const params = [record.timeIN, record.breaktimeIN, record.breaktimeOUT, record.timeOUT, record.personID, record.date];

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => res.send({ message: "Records updated successfully." }))
    .catch((err) => res.status(500).send(err));
});

// GET API for fetching attendance records
router.get("/api/dtr", (req, res) => {
  const { personID, startDate, endDate } = req.query;

  if (!personID || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  const query = `
    SELECT 
      id, date, personID,  time 
    FROM 
      attendancerecord 
    WHERE 
      personID = ? AND date BETWEEN ? AND ?
  `;

  db.query(query, [personID, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed." });
    }

    res.json(results);
  });
});

router.post("/api/overall_attendance", (req, res) => {
  const {
    personID ,
    startDate,
    endDate,
    totalRenderedTimeMorning,
    totalRenderedTimeMorningTardiness,

    totalRenderedTimeAfternoon,
    totalRenderedTimeAfternoonTardiness,

    totalRenderedHonorarium,
    totalRenderedHonorariumTardiness,

    totalRenderedServiceCredit,
    totalRenderedServiceCreditTardiness,

    totalRenderedOvertime,
    totalRenderedOvertimeTardiness,

    overallRenderedOfficialTime,
    overallRenderedOfficialTimeTardiness,
  } = req.body;

  const query = `
    INSERT INTO overall_attendance_record (
      personID, 
      startDate, 
      endDate, 
      totalRenderedTimeMorning,
      totalRenderedTimeMorningTardiness,
      
      totalRenderedTimeAfternoon,
      totalRenderedTimeAfternoonTardiness,

      totalRenderedHonorarium,
      totalRenderedHonorariumTardiness,

      totalRenderedServiceCredit,
      totalRenderedServiceCreditTardiness,

      totalRenderedOvertime,
      totalRenderedOvertimeTardiness,

      overallRenderedOfficialTime,
      overallRenderedOfficialTimeTardiness

    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      personID,
      startDate,
      endDate,
      totalRenderedTimeMorning,
      totalRenderedTimeMorningTardiness,
      totalRenderedTimeAfternoon,
      totalRenderedTimeAfternoonTardiness,

      totalRenderedHonorarium,
      totalRenderedHonorariumTardiness,

      totalRenderedServiceCredit,
      totalRenderedServiceCreditTardiness,

      totalRenderedOvertime,
      totalRenderedOvertimeTardiness,

      overallRenderedOfficialTime,
      overallRenderedOfficialTimeTardiness,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ message: "Database error", error });
      }
      res.status(201).json({ message: "Attendance record saved successfully", data: results });
    }
  );
});

router.get("/api/overall_attendance_record", (req, res) => {
  const { personID, startDate, endDate } = req.query;
  console.log("Received parameters:", { personID, startDate, endDate });

  const query = `
   SELECT 
  overall_attendance_record.*, 
  department_assignment.code 
FROM 
  overall_attendance_record
LEFT JOIN 
  department_assignment 
ON 
  department_assignment.employeeNumber = overall_attendance_record.personID
WHERE 
  overall_attendance_record.personID = ? 
  AND overall_attendance_record.startDate >= ? 
  AND overall_attendance_record.endDate <= ?
`;

  db.query(query, [personID, startDate, endDate], (error, results) => {
    if (error) {
      console.error("Error Fetching data:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    res.status(200).json({ message: "Overall attendance record fetched successfully", data: results });
  });
});


router.put("/api/overall_attendance_record/:id", (req, res) => {
  const {
    personID, 
    startDate, 
    endDate, 
    totalRenderedTimeMorning, 
    totalRenderedTimeMorningTardiness, 
    totalRenderedTimeAfternoon, 
    totalRenderedTimeAfternoonTardiness, 
    totalRenderedHonorarium, 
    totalRenderedHonorariumTardiness, 
    totalRenderedServiceCredit, 
    totalRenderedServiceCreditTardiness, 
    totalRenderedOvertime, 
    totalRenderedOvertimeTardiness, 
    overallRenderedOfficialTime, 
    overallRenderedOfficialTimeTardiness
  } = req.body;

  const { id } = req.params;

  // First, check if the updated data already exists in the database (to prevent duplicates)
  const checkQuery = `
    SELECT * FROM overall_attendance_record WHERE personID = ? AND startDate = ? AND endDate = ? AND id != ?;
  `;
  console.log("Checking for duplicates with", { personID, startDate, endDate, id });

  db.query(checkQuery, [personID, startDate, endDate, id], (checkError, checkResults) => {
    if (checkError) {
      return res.status(500).json({ message: "Database error while checking for duplicates", error: checkError });
    }

    if (checkResults.length > 0) {
      // If there's a record with the same personID, startDate, and endDate, return a duplicate error
      return res.status(400).json({ message: "Duplicate record found with the same personID, startDate, and endDate" });
    }

    // Proceed with the update since no duplicates were found
    const query = `
      UPDATE overall_attendance_record SET
      personID = ?, 
      startDate = ?, 
      endDate = ?, 
      totalRenderedTimeMorning = ?, 
      totalRenderedTimeMorningTardiness = ?, 
      totalRenderedTimeAfternoon = ?, 
      totalRenderedTimeAfternoonTardiness = ?, 
      totalRenderedHonorarium = ?, 
      totalRenderedHonorariumTardiness = ?, 
      totalRenderedServiceCredit = ?, 
      totalRenderedServiceCreditTardiness = ?, 
      totalRenderedOvertime = ?, 
      totalRenderedOvertimeTardiness = ?, 
      overallRenderedOfficialTime = ?, 
      overallRenderedOfficialTimeTardiness = ? 
      WHERE id = ?;
    `;

    db.query(query, [
      personID, 
      startDate, 
      endDate, 
      totalRenderedTimeMorning, 
      totalRenderedTimeMorningTardiness, 
      totalRenderedTimeAfternoon, 
      totalRenderedTimeAfternoonTardiness, 
      totalRenderedHonorarium, 
      totalRenderedHonorariumTardiness, 
      totalRenderedServiceCredit, 
      totalRenderedServiceCreditTardiness, 
      totalRenderedOvertime, 
      totalRenderedOvertimeTardiness, 
      overallRenderedOfficialTime, 
      overallRenderedOfficialTimeTardiness, 
      id
    ], (error, results) => {
      if (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: "Database error", error });
      }
      res.status(200).json({ message: "Record updated successfully", data: results });
    });
  });
});



router.delete("/api/overall_attendance_record/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM overall_attendance_record WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send({ message: "Internal Server Error" });
    res.status(200).send({ message: "Attendance entry deleted" });
  });
});







module.exports = router;
