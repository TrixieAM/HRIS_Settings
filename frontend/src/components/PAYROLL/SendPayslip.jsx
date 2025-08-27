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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sendingPayslips, setSendingPayslips] = useState(false);
  const payslipRef = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/SendPayslipRoute/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError('An error occurred while fetching users.');
        setLoading(false);
      });
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.employeeNumber &&
        user.employeeNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      setSelectedUsers(filteredUsers.filter(user => user.name && user.employeeNumber));
    } else {
      setSelectedUsers([]);
    }
  };

  // Check if user is selected
  const isUserSelected = (user) => {
    return selectedUsers.some(u => u.employeeNumber === user.employeeNumber);
  };

  // Send individual payslip
  const handleSendPayslip = async (user) => {
    try {
      setSelectedEmployee(user);

      setTimeout(async () => {
        if (payslipRef.current) {
          const canvas = await html2canvas(payslipRef.current);
          const pdf = new jsPDF("p", "mm", "a4");
          const imgData = canvas.toDataURL("image/png");
          const pdfWidth = 210;
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

          const pdfBlob = pdf.output("blob");
          const formData = new FormData();
          formData.append("pdf", pdfBlob, `${user.name}_payslip.pdf`);
          formData.append("name", user.name);
          formData.append("employeeNumber", user.employeeNumber);

          await axios.post(
            "http://localhost:5000/SendPayslipRoute/send-payslip",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          alert("Payslip sent successfully!");
        }
      }, 200);
    } catch (error) {
      console.error("Error sending payslip:", error);
      alert("Error sending payslip. Please try again.");
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
        setSelectedEmployee(user);

        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render

        if (payslipRef.current) {
          const canvas = await html2canvas(payslipRef.current);
          const pdf = new jsPDF("p", "mm", "a4");
          const imgData = canvas.toDataURL("image/png");
          const pdfWidth = 210;
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

          const pdfBlob = pdf.output("blob");
          const formData = new FormData();
          formData.append("pdf", pdfBlob, `${user.name}_payslip.pdf`);
          formData.append("name", user.name);
          formData.append("employeeNumber", user.employeeNumber);

          await axios.post(
            "http://localhost:5000/SendPayslipRoute/send-payslip",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          successCount++;
        }
      } catch (error) {
        console.error(`Error sending payslip for ${user.name}:`, error);
        failCount++;
      }
    }

    setSendingPayslips(false);
    alert(`Payslips sent: ${successCount} successful, ${failCount} failed`);
    
    // Clear selections
    setSelectedUsers([]);
    setSelectAll(false);
  };

  return (
    <Container maxWidth="xl" sx={{}}>
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

      <Box mt={4} sx={{ backgroundColor: '#fff', p: 3, boxShadow: 3, marginBottom: '15px', marginTop: '0px' }}>
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
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search by Name or Employee Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ backgroundColor: 'white', borderRadius: 1, marginLeft: '870px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#6D2323', marginRight: 1 }} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.employeeNumber || user.id || Math.random()}>
                      <TableCell>
                        <Checkbox
                          checked={isUserSelected(user)}
                          onChange={(e) => handleUserSelection(user, e.target.checked)}
                          disabled={!user.name || !user.employeeNumber}
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
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#6D2323',
                            '&:hover': {
                              backgroundColor: '#B22222',
                            },
                            marginRight: '8px',
                          }}
                          onClick={() => handleSendPayslip(user)}
                          disabled={!user.name || !user.employeeNumber || sendingPayslips}
                        >
                          Send
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'red' }}>
                      No users available.
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