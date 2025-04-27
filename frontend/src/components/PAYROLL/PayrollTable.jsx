import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Container,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const Payroll = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payroll-with-remittance");
        const seen = new Set();
        const uniqueData = [];

        for (const item of res.data) {
          if (!seen.has(item.employeeNumber)) {
            seen.add(item.employeeNumber);
            uniqueData.push(item);
          } else {
            setError(`Duplicate entry found for Employee Number: ${item.employeeNumber}`);
          }
        }

        setData(uniqueData);
        setFilteredData(uniqueData);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError("An error occurred while fetching the payroll data.");
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department-table");
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchPayrollData();
    fetchDepartments();
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    applyFilters(selectedDept, searchTerm);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(selectedDepartment, term);
  };

  const applyFilters = (department, search) => {
    let filtered = [...data];

    if (department) {
      filtered = filtered.filter((record) => record.department === department);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((record) =>
        `${record.firstName} ${record.middleName} ${record.lastName}`
          .toLowerCase()
          .includes(lowerSearch)
      );
    }

    setFilteredData(filtered);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{ backgroundColor: "rgb(109, 35, 35)", color: "#fff", p: 3, borderRadius: 3, mb: 3 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessCenterIcon fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Payroll Dashboard
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Manage employee payroll records effectively
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, backgroundColor: "#fff", borderRadius: 1 }}
            >
              <InputLabel id="department-label"><b>Department</b></InputLabel>
              <Select
                labelId="department-label"
                id="department-select"
                value={selectedDepartment}
                label="Department"
                onChange={handleDepartmentChange}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: 1,
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.code}>
                    {dept.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              label="Search Name"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 250, backgroundColor: "#fff", borderRadius: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: "#F1F1F1" }}>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Rate NBC 188</TableCell>
                  <TableCell>RNBC 594</TableCell>
                  <TableCell>Increment</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>ABS</TableCell>
                  <TableCell>H</TableCell>
                  <TableCell>M</TableCell>
                  <TableCell>S</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell>Personal Life Ret. Ins.</TableCell>
                  <TableCell>Total GSIS Deductions</TableCell>
                  <TableCell>Total Pag-ibig Deductions</TableCell>
                  <TableCell>PhilHealth</TableCell>
                  <TableCell>Total Other Deductions</TableCell>
                  <TableCell>Total Deductions</TableCell>
                  <TableCell>1st Pay</TableCell>
                  <TableCell>2nd Pay</TableCell>
                  <TableCell>RT Ins.</TableCell>
                  <TableCell>EC</TableCell>
                  <TableCell>GSIS Salary Loan</TableCell>
                  <TableCell>GSIS Policy Loan</TableCell>
                  <TableCell>GFAL</TableCell>
                  <TableCell>CPL</TableCell>
                  <TableCell>MPL</TableCell>
                  <TableCell>MPL LITE</TableCell>
                  <TableCell>Emergency Loan</TableCell>
                  <TableCell>Date Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={`${row.employeeNumber}-${row.dateCreated}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.employeeNumber}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.rateNbc188}</TableCell>
                      <TableCell>{row.nbc594}</TableCell>
                      <TableCell>{row.increment}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell>{row.abs}</TableCell>
                      <TableCell>{row.h}</TableCell>
                      <TableCell>{row.m}</TableCell>
                      <TableCell>{row.s}</TableCell>
                      <TableCell>{row.netSalary}</TableCell>
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.personalLifeRetIns}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.philhealth}</TableCell>
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell>{row.pay1st}</TableCell>
                      <TableCell>{row.pay2nd}</TableCell>
                      <TableCell>{row.rtIns}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      <TableCell>{row.gsisSalaryLoan}</TableCell>
                      <TableCell>{row.gsisPolicyLoan}</TableCell>
                      <TableCell>{row.gfal}</TableCell>
                      <TableCell>{row.cpl}</TableCell>
                      <TableCell>{row.mpl}</TableCell>
                      <TableCell>{row.mplLite}</TableCell>
                      <TableCell>{row.emergencyLoan}</TableCell>
                      <TableCell>{row.dateCreated}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={34} align="left">
                      Loading or No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Payroll;
