import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';


import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";


// Custom styled TableCell for Excel-like appearance
const ExcelTableCell = ({ children, header, ...props }) => (
  <TableCell
    {...props}
    sx={{
      border: '1px solid #E0E0E0',
      padding: '8px',
      backgroundColor: header ? '#F5F5F5' : 'inherit',
      fontWeight: header ? 'bold' : 'normal',
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: header ? '#F5F5F5' : '#F8F8F8',
      },
      ...props.sx
    }}
  >
    {children}
  </TableCell>
);


const PayrollProcessed = () => {
  const [finalizedData, setFinalizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPasskey, setOpenPasskey] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFinalizedData, setFilteredFinalizedData] = useState([]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getTableHeight = () => {
    const rowHeight = 53;
    const headerHeight = 56;
    const paginationHeight = 52;
    const minHeight = 300;
    const maxHeight = 600;
   
    const contentHeight = (Math.min(rowsPerPage, filteredFinalizedData.length) * rowHeight) + headerHeight + paginationHeight;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
  };


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/department-table');
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };


    fetchDepartments();
  }, []);


  useEffect(() => {
    const fetchFinalizedPayroll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finalized-payroll");
        setFinalizedData(res.data);
        setFilteredFinalizedData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching finalized payroll:", err);
        setError("An error occurred while fetching the finalized payroll.");
        setLoading(false);
      }
    };


    fetchFinalizedPayroll();
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
    let filtered = [...finalizedData];


    if (department) {
      filtered = filtered.filter((record) => record.department === department);
    }


    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((record) =>
        (record.name || '').toLowerCase().includes(lowerSearch) ||
        (record.employeeNumber || '').toString().toLowerCase().includes(lowerSearch)
      );
    }


    setFilteredFinalizedData(filtered);
    setPage(0);
  };


  const handleDelete = async (rowId) => {
    try {
      // First update UI immediately
      setFinalizedData(prev => prev.filter(item => item.id !== rowId));
      setFilteredFinalizedData(prev => prev.filter(item => item.id !== rowId));
     
      // Then make API call
      await axios.delete(`http://localhost:5000/api/finalized-payroll/${rowId}`);
     
      // Show success message
      alert('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting payroll data:', error);
      // If API call fails, revert the UI changes
      const res = await axios.get("http://localhost:5000/api/finalized-payroll");
      setFinalizedData(res.data);
      setFilteredFinalizedData(prev => {
        // Reapply current filters
        let filtered = res.data;
        if (selectedDepartment) {
          filtered = filtered.filter((record) => record.department === selectedDepartment);
        }
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          filtered = filtered.filter((record) =>
            (record.name || '').toLowerCase().includes(lowerSearch) ||
            (record.employeeNumber || '').toString().toLowerCase().includes(lowerSearch)
          );
        }
        return filtered;
      });
      alert('Failed to delete record. Please try again.');
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
      // First update UI immediately
      setFinalizedData(prev => prev.filter(item => item.id !== selectedRow.id));
      setFilteredFinalizedData(prev => prev.filter(item => item.id !== selectedRow.id));
     
      // Then make API call
      await axios.delete(`http://localhost:5000/api/finalized-payroll/${selectedRow.id}`, {
        data: {
          employeeNumber: selectedRow.employeeNumber,
          name: selectedRow.name,
        },
      });
     
      alert("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      // If API call fails, revert the UI changes
      const res = await axios.get("http://localhost:5000/api/finalized-payroll");
      setFinalizedData(res.data);
      setFilteredFinalizedData(prev => {
        // Reapply current filters
        let filtered = res.data;
        if (selectedDepartment) {
          filtered = filtered.filter((record) => record.department === selectedDepartment);
        }
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          filtered = filtered.filter((record) =>
            (record.name || '').toLowerCase().includes(lowerSearch) ||
            (record.employeeNumber || '').toString().toLowerCase().includes(lowerSearch)
          );
        }
        return filtered;
      });
      alert("Failed to delete record. Please try again.");
    } finally {
      setOpenPasskey(false);
      setPasskeyInput("");
      setSelectedRow(null);
    }
  };


  const handleSaveToExcel = () => {
    // Create worksheet data
    const ws_data = [
      // Header row
      [
        "No.",
        "Name",
        "Position",
        "Rate NBC 584",
        "NBC 594",
        "Rate NBC 594",
        "NBC DIFF'L 597",
        "Increment",
        "Gross Salary",
        "ABS",
        "H",
        "M",
        "Net Salary",
        "Withholding Tax",
        "Total GSIS Deductions",
        "Total Pag-ibig Deductions",
        "PhilHealth",
        "Total Other Deductions",
        "Total Deductions",
        "1st Pay",
        "2nd Pay",
        "No.",
        "RT Ins.",
        "EC",
        "PhilHealth",
        "Pag-Ibig",
        "Pay1st Compute",
        "Pay2nd Compute",
        "",
        "No.",
        "Name",
        "Position",
        "Withholding Tax",
        "Personal Life Ret Ins",
        "GSIS Salary Loan",
        "GSIS Policy Loan",
        "gsisArrears",
        "CPL",
        "MPL",
        "EAL",
        "MPL LITE",
        "Emergency Loan (ELA)",
        "Total GSIS Deductions",
        "Pag-ibig Fund Contribution",
        "Pag-ibig 2",
        "Multi-Purpose Loan",
        "Total Pag-Ibig Deduction",
        "PhilHealth",
        "liquidatingCash",
        "LandBank Salary Loan",
        "Earist Credit COOP.",
        "FEU",
        "Total Other Deductions",
        "Total Deductions"
      ],
      // Empty row after header
      Array(57).fill("")
    ];


    // Add data rows with empty rows in between
    filteredFinalizedData.forEach((row, index) => {
      // Add data row
      ws_data.push([
        index + 1,
        row.name,
        row.position,
        row.rateNbc584,
        row.nbc594,
        row.rateNbc594,
        row.nbcDiffl597,
        row.increment,
        row.grossSalary,
        row.abs,
        row.h,
        row.m,
        row.netSalary,
        row.withholdingTax,
        row.totalGsisDeds,
        row.totalPagibigDeds,
        row.PhilHealthContribution,
        row.totalOtherDeds,
        row.totalDeductions,
        row.pay1st,
        row.pay2nd,
        index + 1,
        row.rtIns,
        row.ec,
        row.PhilHealthContribution,
        row.pagibigFundCont,
        row.pay1stCompute,
        row.pay2ndCompute,
        "",
        index + 1,
        row.name,
        row.position,
        row.withholdingTax,
        row.personalLifeRetIns,
        row.gsisSalaryLoan,
        row.gsisPolicyLoan,
        row.gsisArrears,
        row.cpl,
        row.mpl,
        row.eal,
        row.mplLite,
        row.emergencyLoan,
        row.totalGsisDeds,
        row.pagibigFundCont,
        row.pagibig2,
        row.multiPurpLoan,
        row.totalPagibigDeds,
        row.PhilHealthContribution,
        row.liquidatingCash,
        row.landbankSalaryLoan,
        row.earistCreditCoop,
        row.feu,
        row.totalOtherDeds,
        row.totalDeductions
      ]);
     
      // Add empty row after each data row
      ws_data.push(Array(57).fill(""));
    });


    // Create workbook and add the worksheet
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");


    // Auto-size columns
    const max_width = 20;
    const colWidths = ws_data[0].map((_, i) => {
      return { wch: Math.min(max_width, Math.max(...ws_data.map(row => row[i]?.toString().length || 0))) };
    });
    ws['!cols'] = colWidths;


    // Save to the exact directory
    XLSX.writeFile(wb, "frontend/public/PayrollProcessed.xlsx");
  };


  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 2 }}>
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


          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveToExcel}
              sx={{
                bgcolor: '#ffffff',
                color: 'rgb(109, 35, 35)',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
              }}
            >
              Save to Excel
            </Button>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, backgroundColor: '#fff', borderRadius: 1 }}
            >
              <InputLabel id="department-label">
                <b>Department</b>
              </InputLabel>
              <Select
                labelId="department-label"
                id="department-select"
                value={selectedDepartment}
                label="Department"
                onChange={handleDepartmentChange}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">
                  <em>All Departments</em>
                </MenuItem>
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
              sx={{ minWidth: 250, backgroundColor: '#fff', borderRadius: 1 }}
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


      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 2,
              flex: 1,
              minWidth: '800px',
              maxWidth: '1600px',
              pb: 0,
              height: getTableHeight(),
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTableContainer-root': {
                flex: 1,
                '&::-webkit-scrollbar': {
                  width: '10px',
                  height: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '5px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '5px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }
            }}
          >
            <TableContainer component={Box}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <ExcelTableCell header>No.</ExcelTableCell>
                    <ExcelTableCell header>Department</ExcelTableCell>
                    <ExcelTableCell header>Employee Number</ExcelTableCell>
                    <ExcelTableCell header>Start Date</ExcelTableCell>
                    <ExcelTableCell header>End Date</ExcelTableCell>
                    <ExcelTableCell header>Name</ExcelTableCell>
                    <ExcelTableCell header>Position</ExcelTableCell>
                    <ExcelTableCell header>Rate NBC 584</ExcelTableCell>
                    <ExcelTableCell header>NBC 594</ExcelTableCell>
                    <ExcelTableCell header>Rate NBC 594</ExcelTableCell>
                    <ExcelTableCell header>NBC DIFF'L 597</ExcelTableCell>
                    <ExcelTableCell header>Increment</ExcelTableCell>
                    <ExcelTableCell header>Gross Salary</ExcelTableCell>
                    <ExcelTableCell header><b>ABS</b></ExcelTableCell>
                    <ExcelTableCell header>H</ExcelTableCell>
                    <ExcelTableCell header>M</ExcelTableCell>
                    <ExcelTableCell header>Net Salary</ExcelTableCell>
                    <ExcelTableCell header>Withholding Tax</ExcelTableCell>
                    <ExcelTableCell header><b>Total GSIS Deductions</b></ExcelTableCell>
                    <ExcelTableCell header><b>Total Pag-ibig Deductions</b></ExcelTableCell>
                    <ExcelTableCell header>PhilHealth</ExcelTableCell>
                    <ExcelTableCell header> <b>Total Other Deductions</b></ExcelTableCell>
                    <ExcelTableCell header><b>Total Deductions</b></ExcelTableCell>
                    <ExcelTableCell header>1st Pay</ExcelTableCell>
                    <ExcelTableCell header>2nd Pay</ExcelTableCell>
                    <ExcelTableCell header>No.</ExcelTableCell>
                    <ExcelTableCell header>RT Ins.</ExcelTableCell>
                    <ExcelTableCell header>EC</ExcelTableCell>
                    <ExcelTableCell header>PhilHealth</ExcelTableCell>
                    <ExcelTableCell header>Pag-Ibig</ExcelTableCell>
                    <ExcelTableCell style={{color: 'red', fontWeight: 'bold'}}>Pay1st Compute </ExcelTableCell>
                    <ExcelTableCell style={{color: 'red', fontWeight: 'bold'}}>Pay2nd Compute </ExcelTableCell>
                    <ExcelTableCell style={{ borderLeft: '2px solid black' }}></ExcelTableCell>
                    <ExcelTableCell>No.</ExcelTableCell>
                    <ExcelTableCell>Name</ExcelTableCell>
                    <ExcelTableCell>Position</ExcelTableCell>
                    <ExcelTableCell>Withholding Tax</ExcelTableCell>
                    <ExcelTableCell>Personal Life Ret Ins</ExcelTableCell>
                    <ExcelTableCell>GSIS Salary Loan</ExcelTableCell>
                    <ExcelTableCell>GSIS Policy Loan</ExcelTableCell>
                    <ExcelTableCell>gsisArrears</ExcelTableCell>
                    <ExcelTableCell>CPL</ExcelTableCell>
                    <ExcelTableCell>MPL</ExcelTableCell>
                    <ExcelTableCell> EAL</ExcelTableCell>
                    <ExcelTableCell>MPL LITE</ExcelTableCell>
                    <ExcelTableCell>Emergency Loan (ELA)</ExcelTableCell>
                    <ExcelTableCell>Total GSIS Deductions</ExcelTableCell>
                    <ExcelTableCell>Pag-ibig Fund Contribution</ExcelTableCell>
                    <ExcelTableCell>Pag-ibig 2</ExcelTableCell>
                    <ExcelTableCell>Multi-Purpose Loan</ExcelTableCell>
                    <ExcelTableCell>Total Pag-Ibig Deduction</ExcelTableCell>
                    <ExcelTableCell> PhilHealth</ExcelTableCell>
                    <ExcelTableCell> liquidatingCash</ExcelTableCell>
                    <ExcelTableCell>LandBank Salary Loan</ExcelTableCell>
                    <ExcelTableCell> Earist Credit COOP.</ExcelTableCell>
                    <ExcelTableCell> FEU</ExcelTableCell>
                    <ExcelTableCell> Total Other Deductions</ExcelTableCell>
                    <ExcelTableCell> Total Deductions</ExcelTableCell>
                    <ExcelTableCell>Date Submitted</ExcelTableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {filteredFinalizedData.length > 0 ? (
                    filteredFinalizedData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#F5F5F5 !important',
                            },
                          }}
                        >
                          <ExcelTableCell>{(page * rowsPerPage) + index + 1}</ExcelTableCell>
                          <ExcelTableCell>{row.department}</ExcelTableCell>
                          <ExcelTableCell>{row.employeeNumber}</ExcelTableCell>
                          <ExcelTableCell>{row.startDate}</ExcelTableCell>
                          <ExcelTableCell>{row.endDate}</ExcelTableCell>
                          <ExcelTableCell>{row.name}</ExcelTableCell>
                          <ExcelTableCell>{row.position}</ExcelTableCell>
                          <ExcelTableCell>{row.rateNbc584}</ExcelTableCell>
                          <ExcelTableCell>{row.nbc594}</ExcelTableCell>
                          <ExcelTableCell>{row.rateNbc594  }</ExcelTableCell>
                          <ExcelTableCell>{row.nbcDiffl597  }</ExcelTableCell>
                          <ExcelTableCell>{row.increment}</ExcelTableCell>
                          <ExcelTableCell>{row.grossSalary}</ExcelTableCell>
                          <ExcelTableCell>{row.abs}</ExcelTableCell>
                          <ExcelTableCell>{row.h}</ExcelTableCell>
                          <ExcelTableCell>{row.m}</ExcelTableCell>
                          <ExcelTableCell>{row.netSalary} </ExcelTableCell>    
                          <ExcelTableCell>{row.withholdingTax}</ExcelTableCell>
                          <ExcelTableCell>{row.totalGsisDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.totalPagibigDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.PhilHealthContribution}</ExcelTableCell>
                          <ExcelTableCell>{row.totalOtherDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.totalDeductions}</ExcelTableCell>
                          <ExcelTableCell sx={{color: 'red', fontWeight:'bold'}}>{row.pay1st} </ExcelTableCell>
                          <ExcelTableCell sx={{color:'red', fontWeight:'bold'}}>{row.pay2nd }</ExcelTableCell>
                          <ExcelTableCell>{index + 1}</ExcelTableCell>
                          <ExcelTableCell>{row.rtIns}</ExcelTableCell>
                          <ExcelTableCell>{row.ec}</ExcelTableCell>
                          <ExcelTableCell>{row.PhilHealthContribution}</ExcelTableCell>
                          <ExcelTableCell>{row.pagibigFundCont}</ExcelTableCell>
                          <ExcelTableCell>{row.pay1stCompute}</ExcelTableCell>
                          <ExcelTableCell>{row.pay2ndCompute}</ExcelTableCell>
                          <ExcelTableCell style={{ borderLeft: '2px solid black' }}></ExcelTableCell>
                          <ExcelTableCell>{index + 1}</ExcelTableCell>
                          <ExcelTableCell>{row.name}</ExcelTableCell>
                          <ExcelTableCell>{row.position}</ExcelTableCell>
                          <ExcelTableCell>{row.withholdingTax}</ExcelTableCell>
                          <ExcelTableCell>{row.personalLifeRetIns}</ExcelTableCell>
                          <ExcelTableCell>{row.gsisSalaryLoan}</ExcelTableCell>
                          <ExcelTableCell>{row.gsisPolicyLoan}</ExcelTableCell>
                          <ExcelTableCell>{row.gsisArrears}</ExcelTableCell>
                          <ExcelTableCell>{row.cpl}</ExcelTableCell>
                          <ExcelTableCell>{row.mpl}</ExcelTableCell>
                          <ExcelTableCell>{row.eal}</ExcelTableCell>
                          <ExcelTableCell>{row.mplLite}</ExcelTableCell>
                          <ExcelTableCell>{row.emergencyLoan}</ExcelTableCell>
                          <ExcelTableCell>{row.totalGsisDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.pagibigFundCont}</ExcelTableCell>
                          <ExcelTableCell>{row.pagibig2}</ExcelTableCell>
                          <ExcelTableCell>{row.multiPurpLoan}</ExcelTableCell>
                          <ExcelTableCell>{row.totalPagibigDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.PhilHealthContribution}</ExcelTableCell>
                          <ExcelTableCell>{row.liquidatingCash}</ExcelTableCell>
                          <ExcelTableCell>{row.landbankSalaryLoan}</ExcelTableCell>
                          <ExcelTableCell>{row.earistCreditCoop}</ExcelTableCell>
                          <ExcelTableCell>{row.feu}</ExcelTableCell>              
                          <ExcelTableCell>{row.totalOtherDeds}</ExcelTableCell>
                          <ExcelTableCell>{row.totalDeductions}</ExcelTableCell>
                          <ExcelTableCell>{new Date(row.dateCreated).toLocaleString()}</ExcelTableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <ExcelTableCell colSpan={13} align="center">
                        No finalized payroll records available.
                      </ExcelTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>


            <TablePagination
              component="div"
              count={filteredFinalizedData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                borderTop: '1px solid #E0E0E0',
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  my: 'auto',
                },
              }}
            />
          </Paper>


          <Paper
            elevation={4}
            sx={{
              borderRadius: 2,
              width: '100px',
              height: getTableHeight(),
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{
              p: 2,
              borderBottom: '1px solid #E0E0E0',
              bgcolor: '#F5F5F5',
              height: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Action
              </Typography>
            </Box>


            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '10px',
                height: '10px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '5px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '5px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}>
              {filteredFinalizedData.length > 0 ? (
                filteredFinalizedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <Box
                      key={row.id}
                      sx={{
                        height: '53px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid #E0E0E0',
                        '&:nth-of-type(odd)': {
                          backgroundColor: '#FAFAFA',
                        },
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        }
                      }}
                    >
                      <Button
                        onClick={() => initiateDelete(row)}
                        variant="contained"
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{
                          bgcolor: '#000000',
                          minWidth: '10px',
                         
                          px: 1,
                          '&:hover': {
                            bgcolor: '#333333',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  No records
                </Box>
              )}
            </Box>


            <Box sx={{ height: '52px', borderTop: '1px solid #E0E0E0' }} />
          </Paper>
        </Box>
      )}


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









