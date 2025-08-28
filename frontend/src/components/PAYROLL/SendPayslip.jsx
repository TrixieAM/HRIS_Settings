import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Payslip from "./Payslip";


const SendPayslip = () => {
  const [users, setUsers] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sendingPayslips, setSendingPayslips] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const payslipRef = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  useEffect(() => {
    // Fetch both users and payroll data
    const fetchData = async () => {
      try {
        const [usersResponse, payrollResponse] = await Promise.all([
          axios.get("http://localhost:5000/SendPayslipRoute/users"),
          axios.get("http://localhost:5000/api/finalized-payroll")
        ]);
       
        setUsers(usersResponse.data);
        setPayrollData(payrollResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };


    fetchData();
  }, []);


  // Function to get payroll data for a specific user
  const getPayrollDataForUser = (user, filterByMonth = false) => {
    // Try to match by employeeNumber first, then by name
    let payrollRecords = payrollData.filter(p =>
      p.employeeNumber === user.employeeNumber ||
      p.employeeNumber?.toString() === user.employeeNumber?.toString() ||
      (user.name && p.name?.toLowerCase() === user.name?.toLowerCase())
    );


    // If we have a month filter and filterByMonth is true, try to match that too
    if (filterByMonth && selectedMonth && payrollRecords.length > 0) {
      const monthFilteredRecord = payrollRecords.find(p =>
        p.month === selectedMonth || p.payPeriod === selectedMonth
      );
     
      if (monthFilteredRecord) {
        return monthFilteredRecord;
      }
    }


    // Return the first matching record or undefined
    return payrollRecords[0];
  };


  // Filter users based on search query and whether they have payroll data
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.employeeNumber &&
        user.employeeNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()));
   
    // Only include users who have corresponding payroll data
    const hasPayrollData = getPayrollDataForUser(user) !== undefined;
   
    return matchesSearch && hasPayrollData;
  });


  // Handle individual user selection
  const handleUserSelection = (user, isSelected) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter(u => u.employeeNumber !== user.employeeNumber));
    }
  };


  // Handle select all functionality
  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    if (isSelected) {
      // Get fresh filtered users to avoid stale closure
      const currentFilteredUsers = users.filter((user) => {
        const matchesSearch =
          (user.name &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.employeeNumber &&
            user.employeeNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()));
       
        const hasPayrollData = getPayrollDataForUser(user) !== undefined;
        return matchesSearch && hasPayrollData;
      });
     
      setSelectedUsers(currentFilteredUsers.filter(user => user.name && user.employeeNumber));
    } else {
      setSelectedUsers([]);
    }
  };


  // Check if user is selected
  const isUserSelected = (user) => {
    return selectedUsers.some(u => u.employeeNumber === user.employeeNumber);
  };


  // Generate PDF from employee data without DOM
  const generatePDF = async (employeeData) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;


      // Helper function to get pay period
      const getPayPeriod = (employee) => {
        if (employee.month) {
          return `Month of ${employee.month} ${employee.year || new Date().getFullYear()}`;
        }
        return "Current Pay Period";
      };


      // Header
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("EARIST PAYSLIP", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;


      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Pay Period: ${getPayPeriod(employeeData)}`, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 8;


      pdf.text(`Date Issued: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 20;


      // Employee Information
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("EMPLOYEE INFORMATION", margin, yPosition);
      yPosition += 10;


      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Employee #: ${employeeData.employeeNumber}`, margin, yPosition);
      pdf.text(`Name: ${employeeData.name}`, margin + 80, yPosition);
      yPosition += 6;
      pdf.text(`Position: ${employeeData.position || "N/A"}`, margin, yPosition);
      pdf.text(`Department: ${employeeData.department || "N/A"}`, margin + 80, yPosition);
      yPosition += 15;


      // Earnings
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("EARNINGS", margin, yPosition);
      yPosition += 10;


      pdf.setFontSize(12);
      pdf.text("Gross Salary:", margin, yPosition);
      pdf.text(`₱${parseFloat(employeeData.grossSalary || 0).toLocaleString()}`, pageWidth - margin - 40, yPosition, { align: "right" });
      yPosition += 15;


      // Deductions
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("DEDUCTIONS", margin, yPosition);
      yPosition += 10;


      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const deductions = [
        { label: "Withholding Tax", value: employeeData.withholdingTax || 0 },
        { label: "GSIS Contributions", value: employeeData.totalGsisDeds || 0 },
        { label: "Pag-IBIG Contributions", value: employeeData.totalPagibigDeds || 0 },
        { label: "PhilHealth", value: employeeData.PhilHealthContribution || 0 },
        { label: "Other Deductions", value: employeeData.totalOtherDeds || 0 }
      ];


      deductions.forEach(deduction => {
        pdf.text(deduction.label, margin, yPosition);
        pdf.text(`₱${parseFloat(deduction.value).toLocaleString()}`, pageWidth - margin - 40, yPosition, { align: "right" });
        yPosition += 6;
      });


      yPosition += 5;
      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL DEDUCTIONS:", margin, yPosition);
      pdf.text(`₱${parseFloat(employeeData.totalDeductions || 0).toLocaleString()}`, pageWidth - margin - 40, yPosition, { align: "right" });
      yPosition += 15;


      // Net Pay
      pdf.setFontSize(14);
      pdf.text("NET PAY COMPUTATION", margin, yPosition);
      yPosition += 10;


      pdf.setFontSize(12);
      pdf.text("Net Salary:", margin, yPosition);
      pdf.text(`₱${parseFloat(employeeData.netSalary || 0).toLocaleString()}`, pageWidth - margin - 40, yPosition, { align: "right" });
      yPosition += 15;


      // Pay Distribution
      pdf.setFontSize(14);
      pdf.text("PAY DISTRIBUTION", margin, yPosition);
      yPosition += 10;


      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("1st Pay Period:", margin, yPosition);
      pdf.text(`₱${parseFloat(employeeData.pay1st || 0).toLocaleString()}`, margin + 60, yPosition);
      yPosition += 8;
      pdf.text("2nd Pay Period:", margin, yPosition);
      pdf.text(`₱${parseFloat(employeeData.pay2nd || 0).toLocaleString()}`, margin + 60, yPosition);
      yPosition += 20;


      // Footer
      pdf.setFontSize(8);
      pdf.text("This payslip is computer generated and does not require signature.", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 5;
      pdf.text("For any payroll inquiries, please contact the Human Resources Department.", pageWidth / 2, yPosition, { align: "center" });


      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };


  // Send all selected payslips
  const handleSendAllPayslips = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to send payslips.");
      return;
    }


    setSendingPayslips(true);
    let successCount = 0;
    let failCount = 0;


    for (const user of selectedUsers) {
      try {
        const payrollRecord = getPayrollDataForUser(user, !!selectedMonth);
        if (!payrollRecord) {
          console.warn(`No payroll data found for ${user.name}${selectedMonth ? ` in ${selectedMonth}` : ''}`);
          failCount++;
          continue;
        }


        // Merge user data with payroll data
        const employeeData = {
          ...payrollRecord,
          email: user.email,
          selectedMonth: selectedMonth,
          selectedYear: selectedYear
        };


        // Generate PDF
        const pdfBlob = await generatePDF(employeeData);


        // Send the PDF
        const formData = new FormData();
        formData.append("pdf", pdfBlob, `${user.name}_payslip.pdf`);
        formData.append("name", user.name);
        formData.append("employeeNumber", user.employeeNumber);
        formData.append("email", user.email);


        await axios.post(
          "http://localhost:5000/SendPayslipRoute/send-payslip",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );


        successCount++;
      } catch (error) {
        console.error(`Error sending payslip for ${user.name}:`, error);
        failCount++;
      }
    }


    setSendingPayslips(false);
    setSelectedEmployee(null); // Clear after all done
    alert(`Payslips sent: ${successCount} successful, ${failCount} failed`);
   
    // Clear selections
    setSelectedUsers([]);
    setSelectAll(false);
  };


  return (
    <Container maxWidth="xl">
      <Paper
        elevation={6}
        sx={{ backgroundColor: 'rgb(109, 35, 35)', color: '#fff', p: 3, borderRadius: 3, borderEndEndRadius: '0', borderEndStartRadius: '0' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <EmailIcon fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Send Payslips
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Send payslips to employees via email
            </Typography>
          </Box>
        </Box>
      </Paper>


      {/* Month and Year Selection */}
      <Box mt={2} sx={{ backgroundColor: '#fff', p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Payslip Period
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>


      <Box mt={2} sx={{ backgroundColor: '#fff', p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Bulk Actions
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                sx={{
                  color: '#6D2323',
                  '&.Mui-checked': {
                    color: '#6D2323',
                  },
                }}
              />
            }
            label="Select All"
          />
          <Button
            variant="contained"
            disabled={selectedUsers.length === 0 || sendingPayslips}
            sx={{
              backgroundColor: '#6D2323',
              '&:hover': {
                backgroundColor: '#B22222',
              },
              padding: '10px 20px',
              fontSize: '16px',
            }}
            onClick={handleSendAllPayslips}
          >
            {sendingPayslips ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Sending Payslips...
              </>
            ) : (
              `Send Selected Payslips (${selectedUsers.length})`
            )}
          </Button>
        </Box>
      </Box>


      {/* Search Section */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by Name or Employee Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: 'white', borderRadius: 1, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#6D2323', marginRight: 1 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>


      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3, mt: 2 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Has Payroll Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const hasPayrollData = getPayrollDataForUser(user) !== undefined;
                    return (
                      <TableRow key={user.employeeNumber || user.id || Math.random()}>
                        <TableCell>
                          <Checkbox
                            checked={isUserSelected(user)}
                            onChange={(e) => handleUserSelection(user, e.target.checked)}
                            disabled={!user.name || !user.employeeNumber || !hasPayrollData}
                            sx={{
                              color: '#6D2323',
                              '&.Mui-checked': {
                                color: '#6D2323',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>{user.name || "N/A"}</TableCell>
                        <TableCell>{user.employeeNumber || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              color: hasPayrollData ? 'green' : 'red',
                              fontWeight: 'bold'
                            }}
                          >
                            {hasPayrollData ? '✓ Yes' : '✗ No'}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'red' }}>
                      No users with payroll data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}


      {/* Hidden Payslip component for PDF generation */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        {selectedEmployee && <Payslip ref={payslipRef} employee={selectedEmployee} />}
      </div>
    </Container>
  );
};


export default SendPayslip;

