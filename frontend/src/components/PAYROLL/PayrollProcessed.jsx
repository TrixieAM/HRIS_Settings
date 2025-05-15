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
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';


import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";


const PayrollProcessed = () => {
  const [finalizedData, setFinalizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPasskey, setOpenPasskey] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [passkeyInput, setPasskeyInput] = useState("");
 




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


 


  const handleDelete = async (rowId) => {
    try {
      await axios.delete(`http://localhost:5000/api/finalized-payroll/${rowId}`);
      setFinalizedData(prev => prev.filter(item => item.id !== rowId));
    } catch (error) {
      console.error('Error deleting payroll data:', error);
    }
  };


  const initiateDelete = (row) => {
  setSelectedRow(row);
  setOpenConfirm(true);
};


const handleConfirm = () => {
  setOpenConfirm(false);
  setOpenPasskey(true);
};


const handlePasskeySubmit = async () => {
  const HARDCODED_PASSKEY = "20134507";

  if (passkeyInput !== HARDCODED_PASSKEY) {
    alert("Incorrect Passkey.");
    setOpenPasskey(false);
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/finalized-payroll/${selectedRow.id}`, {
      data: {
        employeeNumber: selectedRow.employeeNumber,
        name: selectedRow.name,
      },
    });
    setFinalizedData(prev => prev.filter(item => item.id !== selectedRow.id));
    alert("Record deleted and status updated.");
  } catch (error) {
    console.error("Error deleting record:", error);
    alert("An error occurred.");
  } finally {
    setOpenPasskey(false);
    setPasskeyInput("");
    setSelectedRow(null);
  }
};


 


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
              Payroll Dashboard | Processed
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Viewing all processed payroll records
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


        <Box sx={{ display: 'flex', gap: 2, }}>
        <Paper elevation={4} sx={{ borderRadius: 2, width: '925px', p: 3, mb: 3 }}>
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
                  <TableCell>Rate NBC 584</TableCell>
                  <TableCell>NBC 594</TableCell>
                  <TableCell>Rate NBC 594</TableCell>
                  <TableCell>NBC DIFF'L 597</TableCell>
                  <TableCell>Increment</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell><b>ABS</b></TableCell>
                  <TableCell>H</TableCell>
                  <TableCell>M</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell><b>Total GSIS Deductions</b></TableCell>
                  <TableCell><b>Total Pag-ibig Deductions</b></TableCell>
                  <TableCell>PhilHealth</TableCell>
                  <TableCell> <b>Total Other Deductions</b></TableCell>
                  <TableCell><b>Total Deductions</b></TableCell>
                  <TableCell>1st Pay</TableCell>
                  <TableCell>2nd Pay</TableCell>
                  <TableCell>No.</TableCell>
                  <TableCell>RT Ins.</TableCell>
                  <TableCell>EC</TableCell>
                  <TableCell>PhilHealth</TableCell>
                  <TableCell>Pag-Ibig</TableCell>
                  <TableCell style={{color: 'red', fontWeight: 'bold'}}>Pay1st Compute </TableCell>
                  <TableCell style={{color: 'red', fontWeight: 'bold'}}>Pay2nd Compute </TableCell>
                  <br />








                  <TableCell style={{ borderLeft: '2px solid black' }}></TableCell>
               




                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell>Personal Life Ret Ins</TableCell>
                  <TableCell>GSIS Salary Loan</TableCell>
                  <TableCell>GSIS Policy Loan</TableCell>
                  <TableCell>gsisArrears</TableCell>
                  <TableCell>CPL</TableCell>
                  <TableCell>MPL</TableCell>
                  <TableCell> EAL</TableCell>
                  <TableCell>MPL LITE</TableCell>
                  <TableCell>Emergency Loan (ELA)</TableCell>
                  <TableCell>Total GSIS Deductions</TableCell>
                  <TableCell>Pag-ibig Fund Contribution</TableCell>
                  <TableCell>Pag-ibig 2</TableCell>
                  <TableCell>Multi-Purpose Loan</TableCell>
                  <TableCell>Total Pag-Ibig Deduction</TableCell>
                  <TableCell> PhilHealth</TableCell>
                  <TableCell> liquidatingCash</TableCell>
                  <TableCell>LandBank Salary Loan</TableCell>
                  <TableCell> Earist Credit COOP.</TableCell>
                  <TableCell> FEU</TableCell>
                  <TableCell> Total Other Deductions</TableCell>
                  <TableCell> Total Deductions</TableCell>
                  <TableCell>Date Submitted</TableCell>
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
                      <TableCell>{row.rateNbc584}</TableCell>
                      <TableCell>{row.nbc594}</TableCell>
                      <TableCell>{row.rateNbc594 || '0' }</TableCell>
                      <TableCell>{row.nbcDiffl597 || '0' }</TableCell>
                      <TableCell>{row.increment}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell>{row.abs}</TableCell>
                      <TableCell>{row.h}</TableCell>
                      <TableCell>{row.m}</TableCell>
                      <TableCell>{row.netSalary} </TableCell>    
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell sx={{color: 'red', fontWeight:'bold'}}>{row.pay1st} </TableCell>
                      <TableCell sx={{color:'red', fontWeight:'bold'}}>{row.pay2nd }</TableCell>
                   
                      <TableCell>{index + 1}</TableCell>






                      <TableCell>{row.rtIns}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>


                      <TableCell>{row.pagibigFundCont}</TableCell>
                      <TableCell>{row.pay1stCompute}</TableCell>
                      <TableCell>{row.pay2ndCompute}</TableCell>
                      <br />


                      <TableCell style={{ borderLeft: '2px solid black' }}></TableCell>








                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.personalLifeRetIns}</TableCell>
                      <TableCell>{row.gsisSalaryLoan}</TableCell>
                      <TableCell>{row.gsisPolicyLoan}</TableCell>
                      <TableCell>{row.gsisArrears}</TableCell>
                      <TableCell>{row.cpl}</TableCell>
                      <TableCell>{row.mpl}</TableCell>
                      <TableCell>{row.eal}</TableCell>
                      <TableCell>{row.mplLite}</TableCell>
                      <TableCell>{row.emergencyLoan}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.pagibigFundCont}</TableCell>
                      <TableCell>{row.pagibig2}</TableCell>
                      <TableCell>{row.multiPurpLoan}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.liquidatingCash}</TableCell>
                      <TableCell>{row.landbankSalaryLoan}</TableCell>
                      <TableCell>{row.earistCreditCoop}</TableCell>
                      <TableCell>{row.feu}</TableCell>              
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
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


        <Paper elevation={4} sx={{ borderRadius: 2, width: '135px', mb: 10  }}>
  <TableContainer component={Box} sx={{ Height: 110, mt: 6 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell  style={{alignItems: 'center', marginTop: '10px', paddingBottom: '40px', paddingLeft: '45px'}}><b>Action</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {finalizedData.length > 0 ? (
          finalizedData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Button
                  onClick={() => initiateDelete(row)}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  sx={{
                    bgcolor: '#000000',
                    borderColor: '#D3D3D3',
                    color: '#ffffff',
                    '&:hover': {
                      borderColor: '#D3D3D3',
                      bgcolor: '#333333',
                    },
                    
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell align="center">No records to display.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Paper>


</Box>


       


      )}


      {/* Confirm Deletion Dialog */}
<Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
  <DialogTitle>Delete this record?</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this record?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirm(false)} style={{color: 'black'}}>Cancel</Button>
    <Button onClick={handleConfirm} style={{backgroundColor: '#6D2323'}} variant="contained" color="error">Delete</Button>
  </DialogActions>
</Dialog>


{/* Passkey Prompt Dialog */}
<Dialog open={openPasskey} onClose={() => setOpenPasskey(false)}>
  <DialogTitle>Passkey</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Enter a Passkey"
      type="password"
      fullWidth
      value={passkeyInput}
      onChange={(e) => setPasskeyInput(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenPasskey(false)}  sx={{ color: '#000000' }}>Cancel</Button>
    <Button onClick={handlePasskeySubmit} variant="contained" color="primary" sx={{ bgcolor: '#6D2323' }}>
      Submit
    </Button>
  </DialogActions>
</Dialog>



    </Container>
  );
};


export default PayrollProcessed;



