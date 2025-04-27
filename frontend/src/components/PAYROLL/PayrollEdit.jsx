import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, Typography, Container, Alert, Box, TextField, Button, Modal, Grid
} from "@mui/material";

const PayrollEdit = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payroll-with-remittance");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching payroll:", err);
      setError("Failed to fetch payroll data.");
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/payroll/${id}`);
        fetchPayrollData();
      } catch (err) {
        console.error("Error deleting payroll:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/payroll/${editRow.id}`, editRow);
      setOpenModal(false);
      fetchPayrollData();
    } catch (err) {
      console.error("Error updating payroll:", err);
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
  };

  const employeeFields = ["employeeNumber", "department", "startDate", "endDate", "name"];
  const salaryFields = ["rateNbc188", "grossSalary", "abs", "h", "m", "s", "netSalary"];
  const deductionFields = [
    "withholdingTax", "personalLifeRetIns", "totalGsisDeds",
    "totalPagibigDeds", "philhealth", "totalOtherDeds", "totalDeductions"
  ];
  const otherFields = ["pay1st", "pay2nd", "rtIns", "ec"];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Payroll Management</Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell>{row.netSalary}</TableCell>
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.dateCreated}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleEdit(row)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Payroll Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Edit Modal */}
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

              {/* Save / Cancel */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button variant="contained" onClick={handleSave}>Save</Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default PayrollEdit;
