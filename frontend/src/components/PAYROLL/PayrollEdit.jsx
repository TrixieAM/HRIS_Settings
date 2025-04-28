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
                  <TableCell>Date Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {finalizedData.length > 0 ? (
                  finalizedData.map((row, index) => (
                    <TableRow key={row.id}>
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
                      
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell>{row.pay1st}</TableCell>
                      <TableCell>{row.pay2nd}</TableCell>
                      <TableCell>{row.rtIns}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>
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
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.disallowance}</TableCell>
                      <TableCell>{row.landbankSalaryLoan}</TableCell>
                      <TableCell>{row.earistCreditCoop}</TableCell>
                      <TableCell>{row.feu}</TableCell>
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
