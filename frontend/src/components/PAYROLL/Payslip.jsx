// Payslip.jsx
import React, { useRef, forwardRef, useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Snackbar,
  Divider,
  Grid,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import WorkIcon from "@mui/icons-material/Work";
import logo from "../../assets/logo.png";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Payslip = forwardRef(({ employee }, ref) => {
  const payslipRef = ref || useRef();

  const [allPayroll, setAllPayroll] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(employee || null);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(!employee);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showSearchError, setShowSearchError] = useState(false);

  // Fetch payroll data only once and only if no employee prop is provided
  useEffect(() => {
    if (!employee) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get("http://localhost:5000/api/finalized-payroll");
          setAllPayroll(res.data);
          if (res.data.length > 0) {
            setCurrentEmployee(res.data[0]);
          }
          setLoading(false);
        } catch (err) {
          console.error("Error fetching payroll:", err);
          setError("Failed to fetch payroll data. Please try again.");
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [employee]);

  // Search employee with improved logic
  const handleSearch = () => {
    if (!search.trim()) {
      setSearchError("Please enter a search term");
      setShowSearchError(true);
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    
    // Filter employees based on search term
    let filteredEmployees = allPayroll.filter((emp) => {
      const matchesNumber = emp.employeeNumber && 
        emp.employeeNumber.toString().toLowerCase().includes(searchTerm);
      const matchesName = emp.name && 
        emp.name.toLowerCase().includes(searchTerm);
      return matchesNumber || matchesName;
    });

    // If month is selected, further filter by month (if your data has month info)
    if (selectedMonth && filteredEmployees.length > 0) {
      // Assuming your payroll data has a month field
      // If not, you might need to adjust this based on your data structure
      const monthFilteredEmployees = filteredEmployees.filter(emp => 
        emp.month === selectedMonth || emp.payPeriod === selectedMonth
      );
      
      // If month filtering returns results, use it; otherwise use the name/number filtered results
      if (monthFilteredEmployees.length > 0) {
        filteredEmployees = monthFilteredEmployees;
      }
    }

    if (filteredEmployees.length > 0) {
      setCurrentEmployee(filteredEmployees[0]); // Take the first match
      setSearchError("");
      setShowSearchError(false);
      
      // If multiple matches, you could show a message about taking the first one
      if (filteredEmployees.length > 1) {
        setSearchError(`Found ${filteredEmployees.length} matches. Showing first result.`);
        setShowSearchError(true);
      }
    } else {
      setSearchError(`No employee found matching "${search}"`);
      setShowSearchError(true);
    }
  };

  // Handle Enter key press in search field
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search and reset to first employee
  const clearSearch = () => {
    setSearch("");
    setSelectedMonth("");
    setSearchError("");
    setShowSearchError(false);
    if (allPayroll.length > 0) {
      setCurrentEmployee(allPayroll[0]);
    }
  };

  // Download PDF
  const downloadPDF = () => {
    const input = payslipRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentEmployee?.name || "EARIST"}-Payslip.pdf`);
    });
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "rgb(109, 35, 35)",
          color: "#fff",
          p: 3,
          borderRadius: 3,
          borderEndEndRadius: "0",
          borderEndStartRadius: "0",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <WorkIcon fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Employee Payslip
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              View and download employee payslips
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Search + Month Selector + Date Issued */}
      <Box 
        
        mb={2} 
        display="flex" 
        flexDirection="column" 
        gap={2}
        sx={{
          backgroundColor: "white",
          border: "2px solid #6D2323",
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          p: 3
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Employee # or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6D2323", marginRight: 1 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 1,
              flex: 1
            }}
          />
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!search.trim()}
              sx={{
                backgroundColor: "#6D2323",
                "&:hover": { backgroundColor: "#B22222" },
                "&:disabled": { backgroundColor: "#ccc" },
              }}
            >
              Search Employee
            </Button>
            <Button
              variant="outlined"
              onClick={clearSearch}
              sx={{
                borderColor: "#6D2323",
                color: "#6D2323",
                "&:hover": { borderColor: "#B22222", backgroundColor: "#f5f5f5" },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
        
        <Typography variant="subtitle2" color="textSecondary">
          Search By Month (Optional)
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {months.map((m) => (
            <Button
              key={m}
              variant={m === selectedMonth ? "contained" : "outlined"}
              size="small"
              sx={{
                backgroundColor: m === selectedMonth ? "#6D2323" : "#fff",
                color: m === selectedMonth ? "#fff" : "#6D2323",
                borderColor: "#6D2323",
                "&:hover": {
                  backgroundColor: m === selectedMonth ? "#B22222" : "#f5f5f5",
                },
              }}
              onClick={() => setSelectedMonth(selectedMonth === m ? "" : m)}
            >
              {m}
            </Button>
          ))}
        </Box>

        {/* Date Issued Field */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle2" color="textSecondary" sx={{ minWidth: "100px" }}>
            Date Issued:
          </Typography>
          <TextField
            type="date"
            size="small"
            value={dateIssued}
            onChange={(e) => setDateIssued(e.target.value)}
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 1,
              maxWidth: "200px"
            }}
          />
        </Box>
      </Box>

      {/* Payslip Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress sx={{ color: "#6D2323" }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : currentEmployee ? (
        <Paper
          ref={payslipRef}
          elevation={4}
          sx={{
            p: 4,
            mt: 2,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          {/* Header Section */}
          <Box mb={3}>
            <img src={logo} alt="Logo" style={{ width: "80px", marginBottom: "10px" }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#6D2323", mb: 1 }}>
              EARIST PAYSLIP
            </Typography>
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              Month of {selectedMonth || "—"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
              Date Issued: {new Date(dateIssued).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, borderWidth: 2 }} />

          {/* Employee Information */}
          <Box textAlign="left" mb={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#6D2323", mb: 2 }}>
              EMPLOYEE INFORMATION
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="space-between" py={0.5}>
                  <Typography fontWeight="bold">Employee #:</Typography>
                  <Typography>{currentEmployee.employeeNumber}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" py={0.5}>
                  <Typography fontWeight="bold">Name:</Typography>
                  <Typography>{currentEmployee.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="space-between" py={0.5}>
                  <Typography fontWeight="bold">Position:</Typography>
                  <Typography>{currentEmployee.position}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" py={0.5}>
                  <Typography fontWeight="bold">Department:</Typography>
                  <Typography>{currentEmployee.department || "—"}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Earnings Section */}
          <Box textAlign="left" mb={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#6D2323", mb: 2 }}>
              EARNINGS
            </Typography>
            <Box display="flex" justifyContent="space-between" py={1} sx={{ backgroundColor: "#f8f9fa", px: 2 }}>
              <Typography fontWeight="bold" variant="h6">Gross Salary:</Typography>
              <Typography fontWeight="bold" variant="h6" sx={{ color: "#2e7d32" }}>
                ₱{parseFloat(currentEmployee.grossSalary || 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Deductions Section */}
          <Box textAlign="left" mb={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#6D2323", mb: 2 }}>
              DEDUCTIONS
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", border: "none", py: 0.5 }}>
                      Withholding Tax
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 0.5 }}>
                      ₱{parseFloat(currentEmployee.withholdingTax || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", border: "none", py: 0.5 }}>
                      GSIS Contributions
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 0.5 }}>
                      ₱{parseFloat(currentEmployee.totalGsisDeds || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", border: "none", py: 0.5 }}>
                      Pag-IBIG Contributions
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 0.5 }}>
                      ₱{parseFloat(currentEmployee.totalPagibigDeds || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", border: "none", py: 0.5 }}>
                      PhilHealth 
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 0.5 }}>
                      ₱{parseFloat(currentEmployee.PhilHealthContribution || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", border: "none", py: 0.5 }}>
                      Other Deductions
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 0.5 }}>
                      ₱{parseFloat(currentEmployee.totalOtherDeds || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#ffebee" }}>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", border: "none", py: 1 }}>
                      TOTAL DEDUCTIONS:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d32f2f", border: "none", py: 1 }}>
                      ₱{parseFloat(currentEmployee.totalDeductions || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Net Pay Section */}
          <Box textAlign="left" mb={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#6D2323", mb: 2 }}>
              NET PAY COMPUTATION
            </Typography>
            <Box display="flex" justifyContent="space-between" py={1} sx={{ backgroundColor: "#e8f5e8", px: 2, mb: 2 }}>
              <Typography fontWeight="bold" variant="h6">Net Salary:</Typography>
              <Typography fontWeight="bold" variant="h6" sx={{ color: "#2e7d32" }}>
                ₱{parseFloat(currentEmployee.netSalary || 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Pay Distribution */}
          <Box textAlign="left">
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#6D2323", mb: 2 }}>
              PAY DISTRIBUTION
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    backgroundColor: "#fff3e0", 
                    p: 2, 
                    borderRadius: 2, 
                    border: "2px solid #ff9800",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#e65100" }}>
                    1st Pay Period
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "#e65100", mt: 1 }}>
                    ₱{parseFloat(currentEmployee.pay1st || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    backgroundColor: "#e3f2fd", 
                    p: 2, 
                    borderRadius: 2, 
                    border: "2px solid #2196f3",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0d47a1" }}>
                    2nd Pay Period
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "#0d47a1", mt: 1 }}>
                    ₱{parseFloat(currentEmployee.pay2nd || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box mt={4} pt={3} borderTop="1px solid #eee">
            <Typography variant="body2" color="textSecondary" textAlign="center">
              This payslip is computer generated and does not require signature.
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mt: 1 }}>
              For any payroll inquiries, please contact the Human Resources Department.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mt: 3 }}>
          No employee data available. Please check if the payroll data is loaded correctly.
        </Alert>
      )}

      {/* Download PDF Button */}
      {currentEmployee && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            onClick={downloadPDF}
            sx={{
              backgroundColor: "#6D2323",
              "&:hover": { backgroundColor: "#B22222" },
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Download Payslip | PDF
          </Button>
        </Box>
      )}

      {/* Search Error Snackbar */}
      <Snackbar
        open={showSearchError}
        autoHideDuration={4000}
        onClose={() => setShowSearchError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSearchError(false)} 
          severity={searchError.includes('Found') ? 'info' : 'warning'}
        >
          {searchError}
        </Alert>
      </Snackbar>
    </Container>
  );
});

export default Payslip;