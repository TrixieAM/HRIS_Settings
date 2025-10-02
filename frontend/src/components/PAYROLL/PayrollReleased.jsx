import API_BASE_URL from '../../apiConfig';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Chip,
} from '@mui/material';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfulOverlay from '../SuccessfulOverlay';
import {
  Email,
  Payment,
  Save as SaveIcon,
  Visibility,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import { Checkbox } from '@mui/material';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

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
      ...props.sx,
    }}
  >
    {children}
  </TableCell>
);

const PayrollReleased = () => {
  const [releasedData, setReleasedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReleasedData, setFilteredReleasedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [releasedIdSet, setReleasedIdSet] = useState(new Set());
  // Normalize date string to YYYY-MM-DD
  const normalizeDateString = (dateInput) => {
    try {
      if (!dateInput) return '';
      const d = new Date(dateInput);
      if (Number.isNaN(d.getTime())) return String(dateInput);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (_) {
      return String(dateInput);
    }
  };

  const getRecordKey = (record) => {
    const emp = record?.employeeNumber ?? '';
    const start = normalizeDateString(record?.startDate);
    const end = normalizeDateString(record?.endDate);
    return `${emp}-${start}-${end}`;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log(
      'Token from localStorage:',
      token ? 'Token exists' : 'No token found'
    );
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token starts with:', token.substring(0, 20) + '...');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    applyFilters(selectedDepartment, searchTerm, newDate);
  };

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

    const contentHeight =
      Math.min(rowsPerPage, filteredReleasedData.length) * rowHeight +
      headerHeight +
      paginationHeight;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/department-table`,
          getAuthHeaders()
        );
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchReleasedPayroll = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/PayrollReleasedRoute/released-payroll`,
          getAuthHeaders()
        );
        const data = Array.isArray(res.data) ? res.data : [];
        setReleasedData(data);
        setFilteredReleasedData(data);
        // Also populate the key set for cross-page disable logic parity
        const keys = new Set();
        data.forEach((record) => keys.add(getRecordKey(record)));
        setReleasedIdSet(keys);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching released payroll:', err);
        setError('An error occurred while fetching the released payroll.');
        setLoading(false);
      }
    };
    fetchReleasedPayroll();
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    applyFilters(selectedDept, searchTerm, selectedDate);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(selectedDepartment, term, selectedDate);
  };

  const applyFilters = (department, search, filterDate) => {
    let filtered = [...releasedData];

    if (department) {
      filtered = filtered.filter((record) => record.department === department);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          (record.name || '').toLowerCase().includes(lowerSearch) ||
          (record.employeeNumber || '')
            .toString()
            .toLowerCase()
            .includes(lowerSearch)
      );
    }

    // Filter by date - check if the selected date falls within the payroll period
    if (filterDate) {
      filtered = filtered.filter((record) => {
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);
        const selectedDate = new Date(filterDate);

        // Set time to start/end of day to ensure proper comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        selectedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        // Check if the selected date falls within the payroll period
        return selectedDate >= startDate && selectedDate <= endDate;
      });
    }

    setFilteredReleasedData(filtered);
    setPage(0);
  };

  const handleSaveToExcel = () => {
    // Create worksheet data
    const ws_data = [
      // Header row (58 columns)
      [
        'No.',
        'Department',
        'Employee Number',
        'Start Date',
        'End Date',
        'Name',
        'Position',
        'Rate NBC 584',
        'NBC 594',
        'Rate NBC 594',
        "NBC DIFF'L 597",
        'Increment',
        'Gross Salary',
        'ABS',
        'H',
        'M',
        'Net Salary',
        'Withholding Tax',
        'Total GSIS Deductions',
        'Total Pag-ibig Deductions',
        'PhilHealth',
        'Total Other Deductions',
        'Total Deductions',
        '1st Pay',
        '2nd Pay',
        'No.',
        'RT Ins.',
        'EC',
        'PhilHealth',
        'Pag-Ibig',
        'Pay1st Compute',
        'Pay2nd Compute',
        'No.',
        'Name',
        'Position',
        'Withholding Tax',
        'Personal Life Ret Ins',
        'GSIS Salary Loan',
        'GSIS Policy Loan',
        'gsisArrears',
        'CPL',
        'MPL',
        'EAL',
        'MPL LITE',
        'Emergency Loan (ELA)',
        'Total GSIS Deductions',
        'Pag-ibig Fund Contribution',
        'Pag-ibig 2',
        'Multi-Purpose Loan',
        'Total Pag-Ibig Deduction',
        'PhilHealth',
        'liquidatingCash',
        'LandBank Salary Loan',
        'Earist Credit COOP.',
        'FEU',
        'Total Other Deductions',
        'Total Deductions',
        'Date Submitted',
      ],
      // Empty row after header
      Array(58).fill(''),
    ];

    // Add data rows with empty rows in between
    filteredReleasedData.forEach((row, index) => {
      // Helper function to convert string to number
      const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return value;
        // Format with thousand separators but keep as number for Excel
        return num.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      // Add data row with numeric values
      ws_data.push([
        // 1-25: basic and totals
        index + 1,
        row.department || '',
        row.employeeNumber || '',
        row.startDate || '',
        row.endDate || '',
        row.name || '',
        row.position || '',
        toNumber(row.rateNbc584),
        toNumber(row.nbc594),
        toNumber(row.rateNbc594),
        toNumber(row.nbcDiffl597),
        toNumber(row.increment),
        toNumber(row.grossSalary),
        toNumber(row.abs),
        toNumber(row.h),
        toNumber(row.m),
        toNumber(row.netSalary),
        toNumber(row.withholdingTax),
        toNumber(row.totalGsisDeds),
        toNumber(row.totalPagibigDeds),
        toNumber(row.PhilHealthContribution ?? row.philHealth),
        toNumber(row.totalOtherDeds),
        toNumber(row.totalDeductions),
        toNumber(row.pay1st),
        toNumber(row.pay2nd),
        // 26-32: contribution breakdown and computes (if available)
        index + 1,
        toNumber(row.rtIns),
        toNumber(row.ec),
        toNumber(row.PhilHealthContribution ?? row.philHealth),
        toNumber(row.pagibigContribution ?? row.pagIbig),
        toNumber(row.pay1stCompute),
        toNumber(row.pay2ndCompute),
        // 33-58: detailed deductions section
        index + 1,
        row.name || '',
        row.position || '',
        toNumber(row.withholdingTax),
        toNumber(row.personalLifeRetIns),
        toNumber(row.gsisSalaryLoan),
        toNumber(row.gsisPolicyLoan),
        toNumber(row.gsisArrears ?? row.gsisarrears),
        toNumber(row.cpl),
        toNumber(row.mpl),
        toNumber(row.eal),
        toNumber(row.mplLite),
        toNumber(row.emergencyLoanEla ?? row.emergencyLoan),
        toNumber(row.totalGsisDeds),
        toNumber(row.pagibigFundContribution),
        toNumber(row.pagibig2),
        toNumber(row.multiPurposeLoan),
        toNumber(row.totalPagibigDeds),
        toNumber(row.PhilHealthContribution ?? row.philHealth),
        toNumber(row.liquidatingCash),
        toNumber(row.landbankSalaryLoan),
        toNumber(row.earistCreditCoop),
        toNumber(row.feu),
        toNumber(row.totalOtherDeds),
        toNumber(row.totalDeductions),
        row.dateSubmitted
          ? new Date(row.dateSubmitted).toLocaleDateString()
          : row.dateReleased
          ? new Date(row.dateReleased).toLocaleDateString()
          : '',
      ]);

      // Add empty row after each data row
      ws_data.push(Array(58).fill(''));
    });

    // Create workbook and add the worksheet
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Released Payroll Data');

    // Auto-size columns
    const max_width = 20;
    const colWidths = ws_data[0].map((_, i) => {
      return {
        wch: Math.min(
          max_width,
          Math.max(...ws_data.map((row) => row[i]?.toString().length || 0))
        ),
      };
    });
    ws['!cols'] = colWidths;

    const generateFilename = () => {
      if (filteredReleasedData.length === 0) {
        return 'PayrollReleased.xlsx';
      }

      // Get the first record's dates to determine the payroll period
      const firstRecord = filteredReleasedData[0];
      const startDate = new Date(firstRecord.startDate);
      const endDate = new Date(firstRecord.endDate);

      // Get month names
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const startMonth = monthNames[startDate.getMonth()];
      const endMonth = monthNames[endDate.getMonth()];
      const year = startDate.getFullYear();

      // If start and end are in the same month
      if (startDate.getMonth() === endDate.getMonth()) {
        return `PayrollReleased_${startMonth}_${year}.xlsx`;
      } else {
        // If spanning across months
        return `PayrollReleased_${startMonth}_${endMonth}_${year}.xlsx`;
      }
    };

    const filename = generateFilename();

    // Save with the generated filename
    XLSX.writeFile(wb, `${filename}`);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 2 }}>
      <Paper
        elevation={6}
        sx={{
          backgroundColor: '#6D2323',
          color: '#fff',
          p: 3,
          borderRadius: 3,
          borderEndEndRadius: '0',
          borderEndStartRadius: '0',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Payment fontSize="large" />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              fontFamily="'Poppins', sans-serif"
            >
              Payroll | Release
            </Typography>
            <Typography
              variant="body2"
              color="rgba(255,255,255,0.7)"
              fontFamily="'Poppins', sans-serif"
            >
              Viewing all release payroll records
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          backgroundColor: 'white',
          border: '2px solid #6D2323',
          p: 1,
          mt: 0,
          mb: 2,
        }}
      >
        <TextField
          type="date"
          label="Search by Date"
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            minWidth: 200,
            bgcolor: '#fff',
            border: '1px solid #6d2323',
            borderRadius: 0,
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl
          variant="outlined"
          sx={{
            minWidth: 200,
            bgcolor: '#fff',
            border: '1px solid #6d2323',
            borderRadius: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
            },
          }}
        >
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
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
          placeholder="Search Name"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            flex: 1,
            bgcolor: '#fff',
            border: '1px solid #6d2323',
            borderRadius: 0,
            ml: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          <Box>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 2,
                border: '3px solid #6d2323',
                width: '100%',
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
                },
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
                      <ExcelTableCell header>Gross Salary</ExcelTableCell>
                      <ExcelTableCell header>Net Salary</ExcelTableCell>
                      <ExcelTableCell header>1st Pay</ExcelTableCell>
                      <ExcelTableCell header>2nd Pay</ExcelTableCell>
                      <ExcelTableCell header>Date Released</ExcelTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredReleasedData.length > 0 ? (
                      filteredReleasedData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#F5F5F5 !important',
                              },
                            }}
                          >
                            <ExcelTableCell>
                              {page * rowsPerPage + index + 1}
                            </ExcelTableCell>
                            <ExcelTableCell>{row.department}</ExcelTableCell>
                            <ExcelTableCell>
                              {row.employeeNumber}
                            </ExcelTableCell>
                            <ExcelTableCell>
                              {row.startDate ? row.startDate.split('T')[0] : ''}
                            </ExcelTableCell>
                            <ExcelTableCell>
                              {row.endDate ? row.endDate.split('T')[0] : ''}
                            </ExcelTableCell>
                            <ExcelTableCell>{row.name}</ExcelTableCell>
                            <ExcelTableCell>{row.position}</ExcelTableCell>
                            <ExcelTableCell>
                              {row.grossSalary
                                ? Number(row.grossSalary).toLocaleString(
                                    'en-US',
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )
                                : ''}
                            </ExcelTableCell>
                            <ExcelTableCell>
                              {row.netSalary
                                ? Number(row.netSalary).toLocaleString(
                                    'en-US',
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )
                                : ''}
                            </ExcelTableCell>
                            <ExcelTableCell
                              sx={{ color: 'red', fontWeight: 'bold' }}
                            >
                              {row.pay1st
                                ? Number(row.pay1st).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : ''}{' '}
                            </ExcelTableCell>
                            <ExcelTableCell
                              sx={{ color: 'red', fontWeight: 'bold' }}
                            >
                              {row.pay2nd
                                ? Number(row.pay2nd).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : ''}
                            </ExcelTableCell>
                            <ExcelTableCell>
                              {row.dateReleased
                                ? new Date(
                                    row.dateReleased
                                  ).toLocaleDateString()
                                : ''}
                            </ExcelTableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <ExcelTableCell colSpan={13} align="center">
                          No released payroll records available.
                        </ExcelTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredReleasedData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{
                  borderTop: '1px solid #E0E0E0',
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                    {
                      my: 'auto',
                    },
                }}
              />
            </Paper>
          </Box>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '16px',
              gap: '12px',
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => (window.location.href = '/payroll-processed')}
              size="medium"
              sx={{
                backgroundColor: '#6d2323',
                color: '#ffffff',
                textTransform: 'none',

                '&:hover': {
                  backgroundColor: '#a31d1d',
                },
              }}
              startIcon={<BusinessCenterIcon />}
            >
              View Processed Payroll
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveToExcel}
              size="medium"
              sx={{
                bgcolor: '#6D2323',
                textTransform: 'none',
                color: 'WHITE',
                '&:hover': {
                  bgcolor: '#fef9e1',
                  color: '#6d2323',
                },
              }}
            >
              Save to Excel
            </Button>

            <Button
              onClick={() => (window.location.href = '/distribution-payslip')}
              variant="contained"
              size="medium"
              startIcon={<Email />}
              sx={{
                bgcolor: '#6D2323',
                textTransform: 'none',
                color: 'white',
                '&:hover': {
                  bgcolor: '#fef9e1',
                  color: '#6d2323',
                },
              }}
            >
              Send Payslips
            </Button>
          </div>
        </Box>
      )}

      {/* Loading and Success Overlays */}
      <LoadingOverlay open={overlayLoading} message="Processing..." />
      <SuccessfulOverlay
        open={successOpen}
        action={successAction}
        onClose={() => setSuccessOpen(false)}
      />
    </Container>
  );
};

export default PayrollReleased;
