import React, { useRef, forwardRef, useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import logo from "../../assets/logo.png";


const PayslipBulk = forwardRef(({ employee }, ref) => {
  const payslipRef = ref || useRef();


  const [allPayroll, setAllPayroll] = useState([]);
  const [displayEmployee, setDisplayEmployee] = useState(employee || null);
  const [loading, setLoading] = useState(!employee);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "success",
    message: "",
  });


  // 🔍 Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredPayroll, setFilteredPayroll] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);


  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];


  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);


  // 📌 Fetch payroll
  useEffect(() => {
    if (!employee) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            "http://localhost:5000/api/finalized-payroll"
          );
          setAllPayroll(res.data);
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


  // 📌 Filter payroll by Year, Month, and Search
  useEffect(() => {
    let result = [...allPayroll];


    if (selectedMonth) {
      const monthIndex = months.indexOf(selectedMonth);
      result = result.filter((emp) => {
        if (!emp.startDate) return false;
        const date = new Date(emp.startDate);
        return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
      });
    }


    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.employeeNumber.toString().includes(q)
      );
    }


    setFilteredPayroll(result);
    setSelectedEmployees([]); // reset selection when filters change
  }, [selectedMonth, selectedYear, searchQuery, allPayroll]);


  // 📌 Month select
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setDisplayEmployee(null);
  };


  // ☑️ Checkbox logic
  const allSelected =
    filteredPayroll.length > 0 &&
    selectedEmployees.length === filteredPayroll.length;
  const someSelected =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < filteredPayroll.length;


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(filteredPayroll.map((emp) => emp.employeeNumber));
    } else {
      setSelectedEmployees([]);
    }
  };


  const handleSelectOne = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };


  // 📤 Bulk send selected payslips
  const sendSelectedPayslips = async () => {
    if (selectedEmployees.length === 0) return;


    setSending(true);
    try {
      const formData = new FormData();
      let payslipMeta = [];


      for (const emp of filteredPayroll.filter((e) =>
        selectedEmployees.includes(e.employeeNumber)
      )) {
        setDisplayEmployee(emp);
        await new Promise((resolve) => setTimeout(resolve, 1000));


        const input = payslipRef.current;
        if (!input) throw new Error("Payslip element not found");


        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");


        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);


        const pdfBlob = pdf.output("blob");
        formData.append("pdfs", pdfBlob, `${emp.name}_payslip.pdf`);


        payslipMeta.push({
          name: emp.name,
          employeeNumber: emp.employeeNumber,
        });
      }


      formData.append("payslips", JSON.stringify(payslipMeta));


      await axios.post(
        "http://localhost:5000/SendPayslipRoute/send-bulk",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );


      setModal({
        open: true,
        type: "success",
        message: "Selected payslips sent successfully via Gmail!",
      });
    } catch (err) {
      console.error("Error sending bulk payslips:", err);
      setModal({
        open: true,
        type: "error",
        message: "An error occurred while sending bulk payslips.",
      });
    } finally {
      setSending(false);
    }
  };


  return (
    <Container maxWidth="lg">
      {/* Header Bar */}
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
              Overall Employee Payslip
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Generate and manage employee payslips
            </Typography>
          </Box>
        </Box>
      </Paper>


      {/* Filters: Search + Year + Month */}
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
          p: 3,
        }}
      >
        {/* Search Bar */}
        <TextField
          label="Search by Name or Employee Number"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 400 }}
        />


        {/* Year + Month */}
        <Box display="flex" gap={2} alignItems="center">
          {/* Year Dropdown */}
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            size="small"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>


          {/* Month Buttons */}
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
                    backgroundColor:
                      m === selectedMonth ? "#B22222" : "#f5f5f5",
                  },
                }}
                onClick={() => handleMonthSelect(m)}
              >
                {m}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>


      {/* Employee Table */}
      {selectedMonth && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Employee Number</b></TableCell>
                  <TableCell><b>Payslip</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayroll.length > 0 ? (
                  filteredPayroll.map((emp) => {
                    const hasPayslip = !!emp.startDate;
                    return (
                      <TableRow key={emp.employeeNumber}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedEmployees.includes(
                              emp.employeeNumber
                            )}
                            onChange={() =>
                              handleSelectOne(emp.employeeNumber)
                            }
                          />
                        </TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.employeeNumber}</TableCell>
                        <TableCell>
                          {hasPayslip ? (
                            <Typography color="green">✔</Typography>
                          ) : (
                            <Typography color="red">✖</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No employee data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}


      {/* Bulk Send Button */}
      {selectedMonth && filteredPayroll.length > 0 && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            onClick={sendSelectedPayslips}
            disabled={sending || selectedEmployees.length === 0}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            {sending ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Bulk Send Payslips"
            )}
          </Button>
        </Box>
      )}


      {/* Hidden Payslip Renderer */}
      {displayEmployee && (
                <Paper


          ref={payslipRef}
          elevation={4}
          sx={{
            p: 3,
            position: "absolute",  // 👈 offscreen instead of display:none
            top: "-9999px",   // 👈 render offscreen but still "visible"
            left: "-9999px",
            mt: 2,
            border: "2px solid black",
            borderRadius: 1,
            backgroundColor: "#fff",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={2}>
          {/* Logo on the left */}
          <Box>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "70px", marginRight: "5px" }}
            />
          </Box>


          {/* Text on the right */}
          <Box textAlign="center" flex={1}>
            <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
              Republic of the Philippines
            </Typography>
            <Typography variant="subtitle5" fontWeight="bold"  sx={{ ml: '25px' }} >
              EULOGIO “AMANG” RODRIGUEZ INSTITUTE OF SCIENCE AND TECHNOLOGY
            </Typography>
            <Typography variant="body2">Nagtahan, Sampaloc Manila</Typography>
          </Box>
        </Box>




          {/* Rows */}
          <Box sx={{ border: "2px solid black", borderBottom: '0px' }}>
            {/* Row template */}
            {[
              {
                label: "PERIOD:",
                value: (
                  <span style={{ fontWeight: "bold" }}>
                    {(() => {
                      if (!displayEmployee.startDate || !displayEmployee.endDate) return "—";
                      const start = new Date(displayEmployee.startDate);
                      const end = new Date(displayEmployee.endDate);
                      const month = start.toLocaleString("en-US", { month: "long" }).toUpperCase();
                      return `${month} ${start.getDate()}-${end.getDate()} ${end.getFullYear()}`;
                    })()}
                  </span>
                ),
              },
              {
                label: "EMPLOYEE NUMBER:",
                 value: (
                  <Typography sx={{ color: "red", fontWeight: "bold" }}>
                    {displayEmployee.employeeNumber
                      ? `${parseFloat(displayEmployee.employeeNumber)}`
                      : ""}
                  </Typography>
                ),
              },
              {
                label: "NAME:",
                 value: (
                  <Typography sx={{ color: "red", fontWeight: "bold" }}>
                    {displayEmployee.name
                      ? `${(displayEmployee.name)}`
                      : ""}
                  </Typography>
                ),
              },
              {
                label: "GROSS SALARY:",
                value: displayEmployee.grossSalary
                  ? `₱${parseFloat(displayEmployee.grossSalary).toLocaleString()}`
                  : "",
              },
              {
                label: "ABS:",
                value: displayEmployee.abs
                  ? `₱${parseFloat(displayEmployee.abs).toLocaleString()}`
                  : "",
              },
              {
                label: "WITHHOLDING TAX:",
                value: displayEmployee.withholdingTax
                  ? `₱${parseFloat(displayEmployee.withholdingTax).toLocaleString()}`
                  : "",
              },
              {
                label: "L.RET:",
                value: displayEmployee.personalLifeRetIns
                  ? `₱${parseFloat(displayEmployee.personalLifeRetIns).toLocaleString()}`
                  : "",
              },
              {
                label: "GSIS SALARY LOAN:",
                value: displayEmployee.gsisSalaryLoan
                  ? `₱${parseFloat(displayEmployee.gsisSalaryLoan).toLocaleString()}`
                  : "",
              },
              {
                label: "POLICY:",
                value: displayEmployee.gsisPolicyLoan
                  ? `₱${parseFloat(displayEmployee.gsisPolicyLoan).toLocaleString()}`
                  : "",
              },


              {
                label: "HOUSING LOAN:",
                value: displayEmployee.gsisSalaryLoan
                ? `₱${parseFloat(displayEmployee.gsisSalaryLoan || 0).toLocaleString()}`
                : "",
              },
              {
                label: "GSIS ARREARS:",
                value: displayEmployee.gsisArrears
                    ? `₱${parseFloat(displayEmployee.gsisArrears).toLocaleString()}`
                    : "",              
               },
               {
                label: "GFAL:",
                value: '',          
               },
               {
                label: "CPL:",
                value: displayEmployee.cpl
                    ? `₱${parseFloat(displayEmployee.cpl).toLocaleString()}`
                    : "",              
               },
               {
                label: "MPL:",
                value: displayEmployee.mpl
                    ? `₱${parseFloat(displayEmployee.mpl).toLocaleString()}`
                    : "",              
               },
               {
                label: "MPL LITE:",
                value: displayEmployee.mplLite
                    ? `₱${parseFloat(displayEmployee.mplLite).toLocaleString()}`
                    : "",              
               },
               {
                label: "ELA:",
                value: "",              
               },
               {
                label: "PAG-IBIG:",
                value: displayEmployee.pagibigFundCont
                    ? `₱${parseFloat(displayEmployee.pagibigFundCont).toLocaleString()}`
                    : "",              
               },
               {
                label: "MPL:",
                value: displayEmployee.mpl
                    ? `₱${parseFloat(displayEmployee.mpl).toLocaleString()}`
                    : "",              
               },
               {
                label: "PHILHEALTH:",
                value: displayEmployee.PhilHealthContribution
                    ? `₱${parseFloat(displayEmployee.PhilHealthContribution).toLocaleString()}`
                    : "",              
               },
               {
                label: "PHILHEALTH (DIFF'L):",
                value: "",              
               },
               {
                label: "PAG-IBIG 2:",
                value: displayEmployee.PhilHealthContribution
                    ? `₱${parseFloat(displayEmployee.PhilHealthContribution).toLocaleString()}`
                    : "",              
               },
               {
                label: "LBP LOAN:",
                value: "",              
               },
               {
                label: "MTSLAI:",
                value: "",              
               },
               {
                label: "ECC:",
                value: "",              
               },
               {
                label: "TO BE REFUNDED:",
                value: "",              
               },
               {
                label: "FEU:",
                value: displayEmployee.feu
                    ? `₱${parseFloat(displayEmployee.feu).toLocaleString()}`
                    : "",              
               },
              {
                label: "ESLAI:",
                value: "",              
               },
               {
                label: "TOTAL DEDUCTIONS:",
                value: displayEmployee.totalDeductions
                    ? `₱${parseFloat(displayEmployee.totalDeductions).toLocaleString()}`
                    : "",              
               },
               {
                label: "NET SALARY:",
                value: displayEmployee.netSalary
                    ? `₱${parseFloat(displayEmployee.netSalary).toLocaleString()}`
                    : "",              
               },
              {
                label: "1ST QUINCENA:",
                value: displayEmployee.pay1st
                    ? `₱${parseFloat(displayEmployee.pay1st).toLocaleString()}`
                    : "",              
               },
               {
                label: "2ND QUINCENA:",
                value: displayEmployee.pay1st
                    ? `₱${parseFloat(displayEmployee.pay2nd).toLocaleString()}`
                    : "",              
               },
            ].map((row, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  borderBottom: "1px solid black", // ✅ always show border


                }}
              >
                {/* Left column (label) */}
                <Box sx={{ p: 1, width: "25%" }}>
                  <Typography fontWeight="bold">{row.label}</Typography>
                </Box>


                {/* Right column (value with left border) */}
                <Box
                  sx={{
                    flex: 1,
                    p: 1,
                    borderLeft: "1px solid black",
                  }}
                >
                  <Typography>{row.value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>




          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            sx={{ fontSize: "0.85rem" }}
          >
            <Typography>Certified Correct:</Typography>
            <Typography>plus PERA – 2,000.00</Typography>
          </Box>


          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography  sx={{ fontSize: "0.85rem", fontWeight:'bold' }}
            >GIOVANNI L. AHUNIN</Typography>
          </Box>
          <Typography>Director, Administrative Services</Typography>
        </Paper>
      )}


      {/* Modal */}
      <Dialog
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
      >
        <DialogTitle>
          {modal.type === "success" ? "✅ Success" : "❌ Error"}
        </DialogTitle>
        <DialogContent>
          <Typography>{modal.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal({ ...modal, open: false })} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});


export default PayslipBulk;



