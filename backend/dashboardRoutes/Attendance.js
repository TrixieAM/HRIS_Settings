const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'earist_hris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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

// Endpoint to fetch attendance records
router.get("/api/attendance", (req, res) => {
  const { personId, startDate, endDate } = req.query;
  const sql = `
    SELECT attendanceRecord.*, users.employeeNumber, users.username,
    users.employmentCategory, officialtime.*
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
    insertAuditLog(personId, `Viewed attendance records of ${personId} from ${startDate} to ${endDate}`);
    res.json(results);
  });
});

// Endpoint to check if attendance record exists
router.get("/api/check-attendance", (req, res) => {
  const { personID, date } = req.query;
  const sql = `SELECT EXISTS(SELECT * FROM attendanceRecord WHERE personID = ? AND date = ?) AS exists`;
  db.query(sql, [personID, date], (err, results) => {
    if (err) throw err;
    insertAuditLog(personID, `Checked attendance for ${date}`);
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
        insertAuditLog(record.personID || "SYSTEM", `Updated attendance record for ID ${record.id}`);
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

    insertAuditLog(personID, `Viewed Record State of ${personID} from ${startDate} to ${endDate}`);

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
        Date: manilaDate.split(",")[0],
        Time: manilaDate.split(",")[1].trim(),
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

    insertAuditLog(personID, `Viewed Device Record of ${personID} from ${startDate} to ${endDate}`);

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
            insertAuditLog(record.personID, `Saved new attendance record for ${record.date}`);
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

// Fetch records
router.post("/api/view-attendance", (req, res) => {
  const { personID, startDate, endDate } = req.body;

  const query = `
    SELECT 
      ar.personID, 
      ar.date, 
      DAYNAME(ar.date) AS Day, 
      ar.timeIN, ar.breaktimeIN, ar.breaktimeOUT, ar.timeOUT, 
      p.*, 
      ot.officialTimeIN, ot.officialTimeOUT
    FROM attendanceRecord ar
    INNER JOIN person_table p ON ar.personID = p.agencyEmployeeNum
    INNER JOIN (
      SELECT day, MIN(officialTimeIN) AS officialTimeIN, MIN(officialTimeOUT) AS officialTimeOUT
      FROM officialtime
      GROUP BY day
    ) ot ON DAYNAME(ar.date) = ot.day
    WHERE ar.personID = ? AND ar.date BETWEEN ? AND ?
    ORDER BY ar.date ASC;
  `;

  db.query(query, [personID, startDate, endDate], (err, results) => {
    if (err) return res.status(500).send(err);
    insertAuditLog(personID, `Viewed Daily Time Record of ${personID} from ${startDate} to ${endDate} in Overall Daily Time Record`);
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
        else {
          insertAuditLog(record.personID, `Updated attendance record of ${record.personID} for ${record.date} in Attendance Management`);
          resolve(result);
        }
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
    insertAuditLog(personID, `Fetched DTR from ${startDate} to ${endDate}`);
    res.json(results);
  });
});

// Insert overall attendance record
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
      insertAuditLog(personID, `Inserted overall attendance record from ${startDate} to ${endDate}`);
      res.status(201).json({ message: "Attendance record saved successfully", data: results });
    }
  );
});

// Fetch overall attendance record
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
    insertAuditLog(personID, `Viewed overall attendance record from ${startDate} to ${endDate}`);
    res.status(200).json({ message: "Overall attendance record fetched successfully", data: results });
  });
});

// Update overall attendance record
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

  const checkQuery = `
    SELECT * FROM overall_attendance_record WHERE personID = ? AND startDate = ? AND endDate = ? AND id != ?;
  `;
  console.log("Checking for duplicates with", { personID, startDate, endDate, id });

  db.query(checkQuery, [personID, startDate, endDate, id], (checkError, checkResults) => {
    if (checkError) {
      return res.status(500).json({ message: "Database error while checking for duplicates", error: checkError });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ message: "Duplicate record found with the same personID, startDate, and endDate" });
    }

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
        console.error(error);
        return res.status(500).json({ message: "Database error", error });
      }
      insertAuditLog(personID, `Updated overall attendance record (ID ${id})`);
      res.status(200).json({ message: "Record updated successfully", data: results });
    });
  });
});

// Delete overall attendance record
router.delete("/api/overall_attendance_record/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM overall_attendance_record WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send({ message: "Internal Server Error" });
    insertAuditLog("SYSTEM", `Deleted overall attendance record ID ${id}`);
    res.status(200).send({ message: "Attendance entry deleted" });
  });
});



// fetch audit logs
router.get("/api/audit-log", (req, res) => {
  const sql = `SELECT * FROM audit_log ORDER BY timestamp DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching audit logs" });
    res.json(results);
  });
});

module.exports = router;
