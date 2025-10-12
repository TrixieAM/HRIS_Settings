const db = require("../db");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


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
    console.log('Decoded JWT:', user);
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
  if (!user || !user.employeeNumber) {
    console.error('Invalid user object for audit logging:', user);
    return;
  }


  const auditQuery = `
    INSERT INTO audit_log (employeeNumber, action, table_name, record_id, targetEmployeeNumber, timestamp)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;


  console.log(`Audit Log: ${action} on ${tableName} by ${user.employeeNumber}`);


  db.query(
    auditQuery,
    [user.employeeNumber, action, tableName, recordId, targetEmployeeNumber],
    (err) => {
      if (err) {
        console.error('Error inserting audit log:', err);
        console.error('Audit query:', auditQuery);
        console.error('Audit values:', [
          user.employeeNumber,
          action,
          tableName,
          recordId,
          targetEmployeeNumber,
        ]);
      } else {
        console.log(
          `Audit log successfully recorded: ${action} on ${tableName}`
        );
      }
    }
  );
}





// GET all released payroll records
router.get('/released-payroll', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM payroll_released ORDER BY dateReleased DESC';


  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching released payroll:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    // Audit log: viewing released payroll
    logAudit(
      req.user,
      'view',
      'payroll_released',
      results.length > 0 ? results[0].id : null
    );


    res.json(results);
  });
});


// GET released payroll with detailed joins (for payslip components)
router.get('/released-payroll-detailed', authenticateToken, (req, res) => {
  const query = `
    SELECT
      pr.id,
      pr.employeeNumber,
      pr.startDate,
      pr.endDate,
      pr.name,
      pr.rateNbc584,
      pr.nbc594,
      pr.rateNbc594,
      pr.nbcDiffl597,
      pr.grossSalary,
      pr.abs,
      pr.h,
      pr.m,
      pr.s,
      pr.netSalary,
      pr.withholdingTax,
      pr.personalLifeRetIns,
      pr.totalGsisDeds,
      pr.totalPagibigDeds,
      pr.totalOtherDeds,
      pr.totalDeductions,
      pr.pay1st,
      pr.pay2nd,
      pr.pay1stCompute,
      pr.pay2ndCompute,
      pr.rtIns,
      pr.ec,
      pr.increment,
      pr.gsisSalaryLoan,
      pr.gsisPolicyLoan,
      pr.gsisArrears,
      pr.cpl,
      pr.mpl,
      pr.eal,
      pr.mplLite,
      pr.emergencyLoan,
      pr.pagibigFundCont,
      pr.pagibig2,
      pr.multiPurpLoan,
      pr.position,
      pr.liquidatingCash,
      pr.landbankSalaryLoan,
      pr.earistCreditCoop,
      pr.feu,
      pr.PhilHealthContribution,
      pr.department,
      pr.rh,
      pr.sss,
      pr.dateReleased,
      pr.releasedBy
    FROM payroll_released pr
    ORDER BY pr.dateReleased DESC
  `;


  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching detailed released payroll:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    // Audit log: viewing detailed released payroll
    logAudit(
      req.user,
      'view',
      'payroll_released_detailed',
      results.length > 0 ? results[0].id : null
    );


    res.json(results);
  });
});


// POST - Release payroll records (move from finalized to released)
// POST - Release payroll records (copy from finalized to released, don't delete)
router.post('/release-payroll', authenticateToken, (req, res) => {
  const { payrollIds, releasedBy } = req.body;


  if (!payrollIds || !Array.isArray(payrollIds) || payrollIds.length === 0) {
    return res
      .status(400)
      .json({ error: 'No payroll IDs provided for release.' });
  }


  // First, get the payroll data from finalized_payroll
  const getQuery = 'SELECT * FROM finalize_payroll WHERE id IN (?)';


  db.query(getQuery, [payrollIds], (err, payrollData) => {
    if (err) {
      console.error('Error fetching payroll data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    if (payrollData.length === 0) {
      return res
        .status(404)
        .json({ error: 'No payroll records found to release.' });
    }


    // Check if any of these records are already released
    const checkReleasedQuery =
      'SELECT employeeNumber, startDate, endDate FROM payroll_released WHERE employeeNumber IN (?) AND startDate IN (?) AND endDate IN (?)';
    const employeeNumbers = payrollData.map((record) => record.employeeNumber);
    const startDates = payrollData.map((record) => record.startDate);
    const endDates = payrollData.map((record) => record.endDate);


    db.query(
      checkReleasedQuery,
      [employeeNumbers, startDates, endDates],
      (checkErr, existingReleased) => {
        if (checkErr) {
          console.error('Error checking existing released records:', checkErr);
          return res.status(500).json({ error: 'Internal server error' });
        }


        // Filter out already released records
        const alreadyReleasedKeys = new Set(
          existingReleased.map(
            (record) =>
              `${record.employeeNumber}-${record.startDate}-${record.endDate}`
          )
        );


        const recordsToRelease = payrollData.filter(
          (record) =>
            !alreadyReleasedKeys.has(
              `${record.employeeNumber}-${record.startDate}-${record.endDate}`
            )
        );


        if (recordsToRelease.length === 0) {
          return res
            .status(400)
            .json({ error: 'All selected records are already released.' });
        }


        // Prepare data for insertion into payroll_released
        const values = recordsToRelease.map((record) => [
          record.employeeNumber,
          record.startDate,
          record.endDate,
          record.name,
          record.rateNbc584,
          record.nbc594,
          record.rateNbc594,
          record.nbcDiffl597,
          record.grossSalary,
          record.abs,
          record.h,
          record.m,
          record.s,
          record.netSalary,
          record.withholdingTax,
          record.personalLifeRetIns,
          record.totalGsisDeds,
          record.totalPagibigDeds,
          record.totalOtherDeds,
          record.totalDeductions,
          record.pay1st,
          record.pay2nd,
          record.pay1stCompute,
          record.pay2ndCompute,
          record.rtIns,
          record.ec,
          record.increment,
          record.gsisSalaryLoan,
          record.gsisPolicyLoan,
          record.gsisArrears,
          record.cpl,
          record.mpl,
          record.eal,
          record.mplLite,
          record.emergencyLoan,
          record.pagibigFundCont,
          record.pagibig2,
          record.multiPurpLoan,
          record.position,
          record.liquidatingCash,
          record.landbankSalaryLoan,
          record.earistCreditCoop,
          record.feu,
          record.PhilHealthContribution,
          record.department,
          record.rh,
          record.sss,
          releasedBy || req.user.employeeNumber,
        ]);


        const insertQuery = `
        INSERT INTO payroll_released (
          employeeNumber, startDate, endDate, name, rateNbc584, nbc594, rateNbc594, nbcDiffl597, grossSalary,
          abs, h, m, s, netSalary, withholdingTax, personalLifeRetIns, totalGsisDeds,
          totalPagibigDeds, totalOtherDeds, totalDeductions, pay1st, pay2nd,
          pay1stCompute, pay2ndCompute, rtIns, ec, increment, gsisSalaryLoan,
          gsisPolicyLoan, gsisArrears, cpl, mpl, eal, mplLite, emergencyLoan,
          pagibigFundCont, pagibig2, multiPurpLoan, position, liquidatingCash,
          landbankSalaryLoan, earistCreditCoop, feu, PhilHealthContribution, department, rh, sss, releasedBy
        ) VALUES ?
      `;


        db.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error('Error inserting released payroll:', err);
            logAudit(
              req.user,
              'create_failed',
              'payroll_released',
              null,
              payrollIds.join(', ')
            );
            return res.status(500).json({ error: 'Internal server error' });
          }


          // Log successful insertion
          logAudit(
            req.user,
            'create',
            'payroll_released',
            result.insertId,
            payrollIds.join(', ')
          );


          // IMPORTANT: Don't delete from finalize_payroll - just copy to payroll_released
          // The records should remain in finalize_payroll for the PayrollProcessed view


          res.json({
            message: 'Payroll records released successfully.',
            released: result.affectedRows,
            alreadyReleased: payrollData.length - recordsToRelease.length,
          });
        });
      }
    );
  });
});


// GET single released payroll record
router.get('/released-payroll/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM payroll_released WHERE id = ?';


  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching released payroll record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: 'Released payroll record not found' });
    }


    // Audit log: viewing single released payroll record
    logAudit(req.user, 'view', 'payroll_released', id);


    res.json(result[0]);
  });
});


// DELETE released payroll record (if needed for admin purposes)
router.delete('/released-payroll/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM payroll_released WHERE id = ?';


  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting released payroll record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Released payroll record not found' });
    }


    // Audit log: deleting released payroll record
    logAudit(req.user, 'delete', 'payroll_released', id);


    res.json({ message: 'Released payroll record deleted successfully' });
  });
});


// GET released payroll statistics
router.get('/released-payroll-stats', authenticateToken, (req, res) => {
  const query = `
    SELECT
      COUNT(*) as totalReleased,
      COUNT(DISTINCT employeeNumber) as uniqueEmployees,
      COUNT(DISTINCT DATE(dateReleased)) as releaseDays,
      SUM(grossSalary) as totalGrossSalary,
      SUM(netSalary) as totalNetSalary,
      AVG(grossSalary) as avgGrossSalary,
      AVG(netSalary) as avgNetSalary
    FROM payroll_released
  `;


  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching released payroll statistics:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }


    // Audit log: viewing released payroll statistics
    logAudit(req.user, 'view', 'payroll_released_stats', null);


    res.json(result[0]);
  });
});


module.exports = router;



