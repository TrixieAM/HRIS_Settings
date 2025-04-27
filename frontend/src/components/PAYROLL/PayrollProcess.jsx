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
  Button,
  Modal,
  Grid,  // Added Grid import
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';

const PayrollProcess = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null);  // Added missing state for editRow

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payroll-with-remittance");
        console.log(res.data);

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

  const handleSubmitPayroll = async () => {
    try {
      // Send all payroll data directly to finalize payroll without checking status
      const response = await axios.post("http://localhost:5000/api/finalize_payroll", filteredData);
  
      // Update the status of all payroll entries to "Finalized"
      const updatedData = filteredData.map(item => ({
        ...item,
        status: "Finalized"
      }));
  
      setFilteredData(updatedData);
      setData(updatedData);
  
      alert("Payroll finalized and submitted successfully!");
  
    } catch (error) {
      console.error('Error submitting payroll:', error);
      alert("Error submitting payroll.");
    }
  };
  
  
  
  

  const handleEdit = (rowId) => {
    const row = filteredData.find((item) => item.id === rowId);
    setEditRow(row);
    setOpenModal(true);
  };

  const handleDelete = async (rowId) => {
    try {
      await axios.delete(`http://localhost:5000/api/payroll-with-remittance/${rowId}`);
      setFilteredData(filteredData.filter((item) => item.id !== rowId));
    } catch (error) {
      console.error("Error deleting payroll data:", error);
    }
  };
  
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setOpenModal(false);
    setEditRow(null);  // Clear the modal data on cancel
  };

  const handleSave = async () => {
    try {
      // Assuming `editRow` contains the current edited data in the modal
      const response = await axios.post(
        `http://localhost:5000/api/payroll-with-remittance/${editRow.employeeNumber}`, // employeeNumber is used as the parameter
        editRow // The updated payroll data
      );
      
      console.log('Payroll record updated successfully:', response.data);
      
      // Close the modal after saving
      setOpenModal(false);
  
      // Optionally, you can update the filteredData to reflect the changes
      setFilteredData(prevData => prevData.map(item => 
        item.employeeNumber === editRow.employeeNumber ? { ...item, ...editRow } : item
      ));
    } catch (error) {
      console.error('Error updating payroll:', error);
      setError('Failed to update payroll data.');
    }
  };
  

  const employeeFields = ["employeeNumber", "department", "startDate", "endDate", "name", "position"];
  const salaryFields = ["rateNbc188", "grossSalary", "abs", "h", "m", "s", "netSalary"];
  const deductionFields = [
    "withholdingTax", "personalLifeRetIns", "totalGsisDeds",
    "totalPagibigDeds", "philhealth", "totalOtherDeds", "totalDeductions"
  ];
  const otherFields = ["pay1st", "pay2nd", "rtIns", "ec"];
  const otherFields2 = ["nbc594", "increment", "gsisSalaryLoan", "gsisPolicyLoan", "gfal", "cpl", "mpl", "mplLite", "emergencyLoan", "pagibigFundCont", "pagibig2", "multiPurpLoan", "totalPagibigDeds", "disallowance", "landbankSalaryLoan", "earistCreditCoop", "feu"];

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
                  <TableCell>Total GSIS Deductions</TableCell>
                  <TableCell>Total Pag-ibig Deductions</TableCell>

                  <TableCell>PhilHealth</TableCell>
                  <TableCell>Total Other Deductions</TableCell>
                  <TableCell>Total Deductions</TableCell>
                  <TableCell>1st Pay</TableCell>
                  <TableCell>2nd Pay</TableCell>
                  <TableCell>RT Ins.</TableCell>
                  <TableCell>EC</TableCell>

                  <TableCell>PhilHealth</TableCell>
                  <TableCell>PAGIBIG</TableCell>
                  <TableCell>Personal Life/ Ret Ins.</TableCell>
                  <TableCell>GSIS Salary Loan</TableCell>
                  <TableCell>GSIS Policy Loan</TableCell>
                  <TableCell>GFAL</TableCell>
                  <TableCell>CPL</TableCell>
                  <TableCell>MPL</TableCell>
                  <TableCell>MPL LITE</TableCell>
                  <TableCell>Emergency Loan</TableCell>

                  <TableCell>Pag-ibig Fund Contribution</TableCell>
                  <TableCell>Pag-ibig 2</TableCell>
                  <TableCell>Multi-Purpose Loan</TableCell>
                  <TableCell>TOTAL PAGIBIG DEDS</TableCell>
                  <TableCell> PhilHealth</TableCell>
                  <TableCell> Disallowance</TableCell>
                  <TableCell>LandBank Salary Loan</TableCell>
                  <TableCell> Earist Credit COOP.</TableCell>
                  <TableCell> FEU</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell> {/* Added Actions column */}

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
                      <TableCell>{row.nbc594 || "N/A"}</TableCell>
                      <TableCell>{row.increment}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell>{row.abs}</TableCell>
                      <TableCell>{row.h}</TableCell>
                      <TableCell>{row.m}</TableCell>
                      <TableCell>{row.s}</TableCell>
                      <TableCell>{row.netSalary}</TableCell>
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>

                      <TableCell>{row.philhealth}</TableCell>
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell>{row.pay1st}</TableCell>
                      <TableCell>{row.pay2nd}</TableCell>
                      <TableCell>{row.rtIns}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      <TableCell>{row.philhealth}</TableCell>
                      <TableCell>{row.pagibig}</TableCell>
                      <TableCell>{row.personalLifeRetIns}</TableCell>
                      <TableCell>{row.gsisSalaryLoan}</TableCell>
                      <TableCell>{row.gsisPolicyLoan}</TableCell>
                      <TableCell>{row.gfal}</TableCell>
                      <TableCell>{row.cpl}</TableCell>
                      <TableCell>{row.mpl}</TableCell>
                      <TableCell>{row.mplLite}</TableCell>
                      <TableCell>{row.emergencyLoan}</TableCell>
                      <TableCell>{row.pagibigFundCont}</TableCell>
                      <TableCell>{row.pagibig2}</TableCell>
                      <TableCell>{row.multiPurpLoan}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.philhealth}</TableCell>
                      <TableCell>{row.disallowance}</TableCell>
                      <TableCell>{row.landbankSalaryLoan}</TableCell>
                      <TableCell>{row.earistCreditCoop}</TableCell>
                      <TableCell>{row.feu}</TableCell>
                      <TableCell style={{ color: row.status === "Finalized" ? 'green' : 'black' }}>
  {row.status || "Unprocessed"}
</TableCell>


                      <TableCell>
                        <Button onClick={() => handleEdit(row.id)} variant="contained" color="primary" startIcon={<EditIcon />}
                                                style={{
                                                  backgroundColor: '#6D2323',
                                                  color: '#FEF9E1',
                                                  textTransform: 'none',
                                                  width: '100px'
                                                }}>
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(row.id)} variant="contained"  startIcon={<DeleteIcon />}
                                                style={{
                                                  backgroundColor: '#000000',
                                                  color: '#ffffff',
                                                  textTransform: 'none',
                                                  width: '100px',
                                                  marginTop:'5px'
                        
                                                }}>
                          Delete
                        </Button>
                      </TableCell>
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
                      <Button
            variant="contained"
            color="success"
            onClick={handleSubmitPayroll}
            sx={{
              backgroundColor: '#6D2323',
              color: '#ffffff',
              textTransform: 'none',
              height: '56px',
              width: '200px',
              marginTop: 2,
            }}
          >
            Submit Payroll
          </Button>

      <Modal open={openModal} onClose={handleCancel}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 800,
          bgcolor: 'background.paper', p: 4, borderRadius: 2,
          maxHeight: '90vh', overflowY: 'auto'
        }}>
          {editRow && (
            <>
              <Typography variant="h5" mb={3}>Edit Payroll Record</Typography>

              {/* Employee Info */}
              <Typography variant="h6" gutterBottom>Employee Information</Typography>
              <Grid container spacing={2}>
                {employeeFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ""}
                      onChange={handleModalChange}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Salary Info */}
              <Typography variant="h6" mt={4} gutterBottom>Salary Information</Typography>
              <Grid container spacing={2}>
                {salaryFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ""}
                      onChange={handleModalChange}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Deductions */}
              <Typography variant="h6" mt={4} gutterBottom>Deductions</Typography>
              <Grid container spacing={2}>
                {deductionFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ""}
                      onChange={handleModalChange}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Other Info */}
              <Typography variant="h6" mt={4} gutterBottom>Other Payments / Info</Typography>
              <Grid container spacing={2}>
                {otherFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ""}
                      onChange={handleModalChange}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" mt={4} gutterBottom>Remittance Field / Info</Typography>
              <Grid container spacing={2}>
                {otherFields2.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ""}
                      onChange={handleModalChange}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Save / Cancel */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button variant="contained" 
                onClick={handleSave}
                startIcon={<SaveIcon />}
                                        style={{ textTransform: 'none',
                                          width: '100px',
                                          backgroundColor: '#6D2323',
                                          color: '#FEF9E1'
                                         }}
                >
                  Save
                </Button>
                <Button variant="outlined" 
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                                        style={{ 
                                          textTransform: 'none',
                                          width: '100px',
                                          backgroundColor: '#000000',
                                          color: '#ffffff'
                                         }}
                >Cancel</Button>
              </Box>
            </>
          )}
        </Box>
        
      </Modal>
    </Container>
  );
};

export default PayrollProcess;
