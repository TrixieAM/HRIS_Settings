const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// MYSQL CONNECTION
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'earist_hris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ============================
// LEAVE TABLE ROUTES (unchanged)
// ============================

router.get('/leave_table', (req, res) => {
  db.query('SELECT * FROM leave_table', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/leave_table', (req, res) => {
  const { leave_description, leave_code, leave_hours } = req.body;

  if (!leave_description || !leave_code || leave_hours === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO leave_table (leave_description, leave_code, leave_hours) VALUES (?, ?, ?)';
  db.query(query, [leave_description, leave_code, leave_hours], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, leave_description, leave_code, leave_hours });
  });
});

router.put('/leave_table/:id', (req, res) => {
  const { id } = req.params;
  const { leave_description, leave_code, leave_hours } = req.body;

  const query = 'UPDATE leave_table SET leave_description = ?, leave_code = ?, leave_hours = ? WHERE id = ?';
  db.query(query, [leave_description, leave_code, leave_hours, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Leave type not found' });
    res.json({ id, leave_description, leave_code, leave_hours });
  });
});

router.delete('/leave_table/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM leave_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Leave type not found' });
    res.json({ message: 'Deleted successfully' });
  });
});

// ============================
// LEAVE ASSIGNMENT ROUTES (updated)
// ============================

router.get('/leave_assignment', (req, res) => {
  const query = `
    SELECT 
      la.*,
      lt.leave_hours as total_hours
    FROM leave_assignment la
    JOIN leave_table lt ON la.leave_code = lt.leave_code
    ORDER BY la.id DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/leave_assignment', (req, res) => {
  const { leave_code, employeeNumber, approve_date } = req.body;

  if (!leave_code || !employeeNumber) {
    return res.status(400).json({ error: 'Missing required fields: leave_code and employeeNumber' });
  }

  // Get leave_hours from leave_table to set as total_hours
  const getLeaveTypeQuery = 'SELECT leave_hours FROM leave_table WHERE leave_code = ?';
  db.query(getLeaveTypeQuery, [leave_code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Leave type not found' });
    }

    const totalHours = results[0].leave_hours;

    const insertQuery = `
      INSERT INTO leave_assignment 
      (leave_code, employeeNumber, total_hours, remaining_hours, used_hours, approve_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(insertQuery, [
      leave_code, 
      employeeNumber, 
      totalHours, 
      totalHours, // remaining_hours starts as total_hours
      0, // used_hours starts at 0
      approve_date || null
    ], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({
        id: result.insertId,
        leave_code,
        employeeNumber,
        total_hours: totalHours,
        remaining_hours: totalHours,
        used_hours: 0,
        approve_date: approve_date || null
      });
    });
  });
});

router.put('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;
  const { leave_code, employeeNumber, remaining_hours, used_hours, approve_date } = req.body;

  // Get total_hours from leave_table
  const getLeaveTypeQuery = 'SELECT leave_hours FROM leave_table WHERE leave_code = ?';
  db.query(getLeaveTypeQuery, [leave_code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Leave type not found' });
    }

    const totalHours = results[0].leave_hours;

    const updateQuery = `
      UPDATE leave_assignment 
      SET leave_code = ?, employeeNumber = ?, total_hours = ?, remaining_hours = ?, used_hours = ?, approve_date = ?
      WHERE id = ?
    `;
    
    db.query(updateQuery, [
      leave_code, 
      employeeNumber, 
      totalHours, 
      remaining_hours || (totalHours - (used_hours || 0)), 
      used_hours || 0, 
      approve_date || null,
      id
    ], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Leave assignment not found' });
      
      res.json({
        id,
        leave_code,
        employeeNumber,
        total_hours: totalHours,
        remaining_hours: remaining_hours || (totalHours - (used_hours || 0)),
        used_hours: used_hours || 0,
        approve_date: approve_date || null
      });
    });
  });
});

router.delete('/leave_assignment/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM leave_assignment WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Leave assignment not found' });
    res.json({ message: 'Deleted successfully' });
  });
});

// ============================
// LEAVE REQUEST ROUTES (updated with proper relationships)
// ============================

router.get('/leave_request', (req, res) => {
  const query = `
    SELECT 
      id,
      employeeNumber,
      leave_code,
      DATE_FORMAT(leave_date, '%Y-%m-%d') as leave_date,
      status,
      created_at
    FROM leave_request 
    ORDER BY leave_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.get('/leave_request/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;
  const query = `
    SELECT 
      id,
      employeeNumber,
      leave_code,
      DATE_FORMAT(leave_date, '%Y-%m-%d') as leave_date,
      status,
      created_at
    FROM leave_request 
    WHERE employeeNumber = ? 
    ORDER BY leave_date DESC
  `;
  
  db.query(query, [employeeNumber], (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================
// POST /leave_request - FIXED
// ============================
router.post('/leave_request', (req, res) => {
  const { employeeNumber, leave_code, leave_dates, status = 0 } = req.body;

  if (!employeeNumber || !leave_code || !Array.isArray(leave_dates) || leave_dates.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const numStatus = Number(status);
  if (![0, 1, 2, 3].includes(numStatus)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const formatDateForMySQL = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateStr}`);
    return date.toISOString().split('T')[0];
  };

  try {
    const insertRequests = leave_dates.map(dateStr => [
      employeeNumber,
      leave_code,
      formatDateForMySQL(dateStr),
      numStatus
    ]);

    const insertRequestQuery = 'INSERT INTO leave_request (employeeNumber, leave_code, leave_date, status) VALUES ?';
    db.query(insertRequestQuery, [insertRequests], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Add notification for Admin
      const notifQuery = "INSERT INTO notifications (employeeNumber, description, read_status) VALUES (?, ?, 0)";
      db.query(notifQuery, [employeeNumber, `${employeeNumber} has added a leave request`], (notifErr) => {
        if (notifErr) console.error('Notification error:', notifErr);
      });

      if (numStatus === 2) {
        // Process approvals immediately
        createAssignments(employeeNumber, leave_code, leave_dates, res);
      } else {
        res.json({ message: 'Leave request created successfully', inserted: result.affectedRows });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid date format in request' });
  }

  // Helper function to create assignments
  function createAssignments(empNum, leaveCode, dates, responseObj) {
    let createdAssignments = [];
    let processed = 0;
    let hasResponded = false;

    dates.forEach((dateStr) => {
      const formattedDate = formatDateForMySQL(dateStr);

      // Get the last assignment for this employee & leave_code
      const lastAssignmentQuery = `
        SELECT * FROM leave_assignment 
        WHERE employeeNumber = ? AND leave_code = ? 
        ORDER BY id DESC LIMIT 1
      `;
      db.query(lastAssignmentQuery, [empNum, leaveCode], (err, lastResults) => {
        if (err) {
          if (!hasResponded) {
            hasResponded = true;
            return responseObj.status(500).json({ error: err.message });
          }
          return;
        }

        if (lastResults.length === 0) {
          // First assignment -> fetch total_hours from leave_table
          db.query('SELECT leave_hours FROM leave_table WHERE leave_code = ?', [leaveCode], (err2, leaveTypeResults) => {
            if (err2) {
              if (!hasResponded) {
                hasResponded = true;
                return responseObj.status(500).json({ error: err2.message });
              }
              return;
            }
            if (leaveTypeResults.length === 0) {
              if (!hasResponded) {
                hasResponded = true;
                return responseObj.status(404).json({ error: 'Leave type not found' });
              }
              return;
            }

            const totalHours = leaveTypeResults[0].leave_hours;
            insertAssignment(totalHours);
          });
        } else {
          // Subsequent assignment -> total_hours = previous remaining_hours
          const totalHours = lastResults[0].remaining_hours;
          insertAssignment(totalHours);
        }

        function insertAssignment(totalHoursForRow) {
          const usedHours = 8; // 1 day = 8 hours
          const remainingHours = totalHoursForRow - usedHours;

          const insertQuery = `
            INSERT INTO leave_assignment 
            (leave_code, employeeNumber, total_hours, used_hours, remaining_hours, approved_date) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          db.query(insertQuery, [leaveCode, empNum, totalHoursForRow, usedHours, remainingHours, formattedDate], (err3, result3) => {
            if (err3) {
              if (!hasResponded) {
                hasResponded = true;
                return responseObj.status(500).json({ error: err3.message });
              }
              return;
            }

            createdAssignments.push({
              id: result3.insertId,
              employeeNumber: empNum,
              leave_code: leaveCode,
              total_hours: totalHoursForRow,
              used_hours: usedHours,
              remaining_hours: remainingHours,
              approve_date: formattedDate
            });

            processed++;
            if (processed === dates.length && !hasResponded) {
              hasResponded = true;
              responseObj.json({
                message: 'Leave request approved and leave_assignments created',
                assignments: createdAssignments
              });
            }
          });
        }
      });
    });
  }
});

// ============================
// PUT /leave_request/:id - FIXED
// ============================
router.put('/leave_request/:id', (req, res) => {
  const { id } = req.params;
  const { employeeNumber, leave_code, leave_date, status } = req.body;

  const numStatus = Number(status);
  if (![0,1,2,3].includes(numStatus)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  let formattedDate = leave_date;
  if (leave_date) {
    const date = new Date(leave_date);
    if (isNaN(date.getTime())) return res.status(400).json({ error: 'Invalid date format' });
    formattedDate = date.toISOString().split('T')[0];
  }

  const updateQuery = 'UPDATE leave_request SET employeeNumber = ?, leave_code = ?, leave_date = ?, status = ? WHERE id = ?';
  db.query(updateQuery, [employeeNumber, leave_code, formattedDate, numStatus, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Leave request not found' });

    // Add notification for Staff
    const notifQuery = "INSERT INTO notifications (employeeNumber, description, read_status) VALUES (?, ?, 0)";
    db.query(notifQuery, [employeeNumber, `Your leave request status has been updated`], (notifErr) => {
      if (notifErr) console.error('Notification error:', notifErr);
    });

    if (numStatus === 2) {
      createAssignment(employeeNumber, leave_code, formattedDate, res);
    } else {
      rollbackAssignment(employeeNumber, leave_code, formattedDate, res);
    }
  });

  // Create assignment row
  function createAssignment(empNum, leaveCode, approveDate, responseObj) {
    const lastAssignmentQuery = `
      SELECT * FROM leave_assignment 
      WHERE employeeNumber = ? AND leave_code = ? 
      ORDER BY id DESC LIMIT 1
    `;
    db.query(lastAssignmentQuery, [empNum, leaveCode], (err, lastResults) => {
      if (err) return responseObj.status(500).json({ error: err.message });

      const insertAssignment = (totalHoursForRow) => {
        const usedHours = 8;
        const remainingHours = totalHoursForRow - usedHours;
        const insertQuery = `
          INSERT INTO leave_assignment 
          (leave_code, employeeNumber, total_hours, used_hours, remaining_hours, approved_date) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [leaveCode, empNum, totalHoursForRow, usedHours, remainingHours, approveDate], (err2, result2) => {
          if (err2) return responseObj.status(500).json({ error: err2.message });
          responseObj.json({
            message: 'Leave request approved and leave_assignment created',
            assignment: {
              id: result2.insertId,
              employeeNumber: empNum,
              leave_code: leaveCode,
              total_hours: totalHoursForRow,
              used_hours: usedHours,
              remaining_hours: remainingHours,
              approve_date: approveDate
            }
          });
        });
      };

      if (lastResults.length === 0) {
        db.query('SELECT leave_hours FROM leave_table WHERE leave_code = ?', [leaveCode], (err2, leaveTypeResults) => {
          if (err2) return responseObj.status(500).json({ error: err2.message });
          if (leaveTypeResults.length === 0) return responseObj.status(404).json({ error: 'Leave type not found' });
          insertAssignment(leaveTypeResults[0].leave_hours);
        });
      } else {
        insertAssignment(lastResults[0].remaining_hours);
      }
    });
  }

  // Rollback assignment row
  function rollbackAssignment(empNum, leaveCode, approveDate, responseObj) {
    // Delete the assignment that matches this approve_date
    const deleteQuery = `DELETE FROM leave_assignment WHERE employeeNumber = ? AND leave_code = ? AND approved_date = ?`;
    db.query(deleteQuery, [empNum, leaveCode, approveDate], (err, result) => {
      if (err) return responseObj.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return responseObj.json({ message: 'Leave request updated (no assignment to rollback)' });
      }

      // Recalculate all later assignments in order
      const recalcQuery = `
        SELECT * FROM leave_assignment 
        WHERE employeeNumber = ? AND leave_code = ? 
        ORDER BY approved_date ASC
      `;
      db.query(recalcQuery, [empNum, leaveCode], (err2, assignments) => {
        if (err2) return responseObj.status(500).json({ error: err2.message });

        db.query('SELECT leave_hours FROM leave_table WHERE leave_code = ?', [leaveCode], (err3, leaveTypeResults) => {
          if (err3) return responseObj.status(500).json({ error: err3.message });
          if (leaveTypeResults.length === 0) return responseObj.status(404).json({ error: 'Leave type not found' });

          let runningTotal = leaveTypeResults[0].leave_hours;

          const updates = assignments.map(row => {
            const newTotal = runningTotal;
            const used = row.used_hours;
            const newRemaining = newTotal - used;
            runningTotal = newRemaining;
            return new Promise((resolve, reject) => {
              const updateRow = `UPDATE leave_assignment SET total_hours = ?, remaining_hours = ? WHERE id = ?`;
              db.query(updateRow, [newTotal, newRemaining, row.id], (err4) => {
                if (err4) reject(err4);
                else resolve();
              });
            });
          });

          Promise.all(updates)
            .then(() => {
              responseObj.json({ message: 'Leave request status changed, assignments recalculated' });
            })
            .catch(e => responseObj.status(500).json({ error: e.message }));
        });
      });
    });
  }
});

router.delete('/leave_request/:id', (req, res) => {
  const { id } = req.params;
  
  // First get the leave request details before deleting
  db.query('SELECT employeeNumber, leave_code, status FROM leave_request WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Leave request not found' });
    
    const { employeeNumber, leave_code, status } = results[0];
    
    // Delete the leave request
    const deleteQuery = 'DELETE FROM leave_request WHERE id = ?';
    db.query(deleteQuery, [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      
      // If the deleted request was approved, recalculate leave_assignment
      if (status === 2) {
        const countQuery = 'SELECT COUNT(*) as approved_days FROM leave_request WHERE employeeNumber = ? AND leave_code = ? AND status = 2';
        
        db.query(countQuery, [employeeNumber, leave_code], (err3, countResults) => {
          if (err3) return res.status(500).json({ error: err3.message });

          const approvedDays = countResults[0].approved_days || 0;
          const usedHours = approvedDays * 8;

          // Recalculate leave_assignment
          const updateAssignmentQuery = `
            UPDATE leave_assignment la
            JOIN leave_table lt ON la.leave_code = lt.leave_code
            SET 
              la.used_hours = ?,
              la.remaining_hours = lt.leave_hours - ?,
              la.total_hours = lt.leave_hours
            WHERE la.employeeNumber = ? AND la.leave_code = ?
          `;

          db.query(updateAssignmentQuery, [usedHours, usedHours, employeeNumber, leave_code], (err4) => {
            if (err4) return res.status(500).json({ error: err4.message });
            res.json({ message: 'Leave request deleted and leave_assignment recalculated' });
          });
        });
      } else {
        res.json({ message: 'Leave request deleted successfully' });
      }
    });
  });
});

module.exports = router;