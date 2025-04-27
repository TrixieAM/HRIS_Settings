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
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const FinalizePayroll = () => {
  const [finalizedData, setFinalizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinalizedPayroll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finalized-payroll");
        setFinalizedData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching finalized payroll:", err);
        setError("An error occurred while fetching the finalized payroll.");
        setLoading(false);
      }
    };

    fetchFinalizedPayroll();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{ backgroundColor: "rgb(109, 35, 35)", color: "#fff", p: 3, borderRadius: 3, mb: 3 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <BusinessCenterIcon fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Finalized Payroll
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Viewing all finalized payroll records
            </Typography>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Total Deductions</TableCell>
                  <TableCell>Pay 1st</TableCell>
                  <TableCell>Pay 2nd</TableCell>
                  <TableCell>Date Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {finalizedData.length > 0 ? (
                  finalizedData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.employeeNumber}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell>{row.netSalary}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell>{row.pay1st}</TableCell>
                      <TableCell>{row.pay2nd}</TableCell>
                      <TableCell>{new Date(row.dateCreated).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      No finalized payroll records available.
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

export default FinalizePayroll;
