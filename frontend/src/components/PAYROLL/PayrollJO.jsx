import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteForever from '@mui/icons-material/DeleteForever';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfulOverlay from '../SuccessfulOverlay';
import { Checkbox } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircleIcon from '@mui/icons-material/Circle';

const PayrollJO = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [payrollData, setPayrollData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [finalizedPayroll, setFinalizedPayroll] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [departments, setDepartments] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Month options
  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Year options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    fetchPayrollData();
    fetchFinalizedPayroll();
    fetchDepartments(); // Add this line
  }, []);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/PayrollJORoutes/payroll-jo`,
        getAuthHeaders()
      );

      let payroll = response.data;

      // Cache for official time (since it's the same for each employee)
      const officialTimeCache = {};

      const updatedPayroll = await Promise.all(
        payroll.map(async (row) => {
          try {
            // Fetch attendance records
            const attendanceRes = await axios.post(
              `${API_BASE_URL}/attendance/api/attendance-records`,
              {
                personID: row.employeeNumber,
                startDate: row.startDate,
                endDate: row.endDate,
              },
              getAuthHeaders()
            );

            const completeAttendance = attendanceRes.data.filter(
              (rec) => rec.timeIN && rec.timeOUT
            );

            const uniqueDays = [
              ...new Set(
                completeAttendance.map((rec) => {
                  const dateObj = new Date(rec.date);
                  return dateObj.getDate();
                })
              ),
            ].sort((a, b) => a - b);

            let renderedDays = '';
            if (uniqueDays.length > 0) {
              const monthName = new Date(row.startDate).toLocaleString(
                'en-US',
                {
                  month: 'short',
                }
              );
              renderedDays = `${monthName} ${uniqueDays.join(', ')}`;
            }

            // ✅ Fetch official time from cache or API (only once per employee)
            if (!officialTimeCache[row.employeeNumber]) {
              const officialTimeRes = await axios.get(
                `${API_BASE_URL}/PayrollJORoutes/official-time/${row.employeeNumber}`,
                getAuthHeaders()
              );
              officialTimeCache[row.employeeNumber] = officialTimeRes.data;
            }

            const { daysCovered, numberOfDays, timeRange } =
              officialTimeCache[row.employeeNumber];

            // Gross Amount computation
            const ratePerDay = row.ratePerDay || 0;
            const grossAmount = (ratePerDay / 8) * row.rh;

            return {
              ...row,
              renderedDays,
              grossAmount,
              days: daysCovered,
              numberOfDays: numberOfDays,
              officialTime: timeRange,
              status: row.status || 0, // Include status
            };
          } catch (err) {
            console.error('Error fetching data for', row.employeeNumber, err);
            return {
              ...row,
              renderedDays: '—',
              grossAmount: 0,
              days: '—',
              numberOfDays: 0,
              officialTime: '—',
              status: row.status || 0, // Include status here too
            };
          }
        })
      );

      setPayrollData(updatedPayroll);
      setFilteredData(updatedPayroll);
      setError('');
    } catch (err) {
      console.error('Error fetching payroll data:', err);
      setError('Failed to fetch payroll data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...payrollData];

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(
        (item) => item.department === selectedDepartment
      );
    }

    // Filter by status
    if (selectedStatus === 'Processed') {
      filtered = filtered.filter((item) => item.status === 1);
    } else if (selectedStatus === 'Unprocessed') {
      filtered = filtered.filter((item) => item.status === 0);
    }

    // Filter by month and year
    if (selectedMonth || selectedYear) {
      filtered = filtered.filter((item) => {
        if (!item.startDate) return false;
        const date = new Date(item.startDate);
        const itemMonth = String(date.getMonth() + 1).padStart(2, '0');
        const itemYear = date.getFullYear().toString();

        const monthMatch = !selectedMonth || itemMonth === selectedMonth;
        const yearMatch = !selectedYear || itemYear === selectedYear;

        return monthMatch && yearMatch;
      });
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((item) => {
        const name = item.name || '';
        const employeeNumber = item.employeeNumber || '';
        const department = item.department || '';
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employeeNumber.toString().includes(searchTerm) ||
          department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredData(filtered);
    setPage(0);
  }, [
    searchTerm,
    payrollData,
    selectedDepartment,
    selectedStatus,
    selectedMonth,
    selectedYear,
  ]);

  const handleExportToFinalized = async () => {
    if (selectedRows.length === 0) return;

    setProcessing(true);
    setLoadingOverlay(true);

    try {
      const selectedData = payrollData.filter((row) =>
        selectedRows.includes(row.id)
      );

      // This single request now handles both insert AND status update
      await axios.post(
        `${API_BASE_URL}/PayrollJORoutes/export-to-finalized`,
        selectedData.map((row) => ({
          employeeNumber: row.employeeNumber,
          department: row.department,
          startDate: row.startDate,
          endDate: row.endDate,
          name: row.name,
          position: row.position,
          grossAmount: row.grossAmount,
          h: row.h,
          m: row.m,
          s: row.s || 0,
          netSalary: computeNetAmount(
            row.grossAmount,
            row.ratePerDay,
            row.h,
            row.m,
            row.sssContribution
          ),
          sssContribution: row.sssContribution || 0,
          rh: row.rh || 0,
          abs: computeTotalDeduction(row.ratePerDay, row.h, row.m),
        })),
        getAuthHeaders()
      );

      setTimeout(() => {
        setLoadingOverlay(false);
        setSuccessAction('processing payroll');
        setSuccessOpen(true);

        fetchFinalizedPayroll();

        setTimeout(() => {
          setSuccessOpen(false);
          setSelectedRows([]);
          fetchPayrollData(); // Refresh to show updated status
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error('Error exporting payroll:', error);
      setLoadingOverlay(false);
      alert('Failed to process payroll. Please try again.');
    } finally {
      setProcessing(false);
      setOpenConfirm(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₱0.00';
    return `${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const computeHourDeduction = (ratePerDay, hours) => {
    if (!ratePerDay || !hours) return 0;
    const ratePerHour = ratePerDay / 8;
    return ratePerHour * hours;
  };

  // ✅ Compute deduction for minutes (based on rate per hour)
  const computeMinuteDeduction = (ratePerDay, minutes) => {
    if (!ratePerDay || !minutes) return 0;
    const ratePerMinute = ratePerDay / 8 / 60;
    return ratePerMinute * minutes;
  };

  const computeTotalDeduction = (ratePerDay, hours, minutes) => {
    const hourDeduction = computeHourDeduction(ratePerDay, hours);
    const minuteDeduction = computeMinuteDeduction(ratePerDay, minutes);
    return hourDeduction + minuteDeduction;
  };

  const computeNetAmount = (grossAmount, ratePerDay, hours, minutes, sss) => {
    const totalDeduction = computeTotalDeduction(ratePerDay, hours, minutes);
    const sssContribution = parseFloat(sss) || 0;
    const gross = parseFloat(grossAmount) || 0;

    return gross - totalDeduction - sssContribution;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteClick = (row) => {
    setRecordToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete || !recordToDelete.id) return;

    setIsProcessingDelete(true);

    try {
      await axios.delete(
        `${API_BASE_URL}/PayrollJORoutes/payroll-jo/${recordToDelete.id}`,
        getAuthHeaders()
      );
      fetchPayrollData();
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record. Please try again.');
    } finally {
      setIsProcessingDelete(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const handleOpenConfirm = () => {
    if (selectedRows.length === 0) return;
    setOpenConfirm(true);
  };

  const fetchFinalizedPayroll = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/PayrollRoute/finalized-payroll`,
        getAuthHeaders()
      );
      setFinalizedPayroll(res.data);
    } catch (err) {
      console.error('Error fetching finalized JO payroll:', err);
    }
  };

  const handleExportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert('No data to export.');
      return;
    }

    // Map the filtered data to clean Excel-friendly objects
    const excelData = filteredData.map((row, index) => ({
      'No.': index + 1,
      'Employee #': row.employeeNumber || '',
      Name: row.name || '',
      Designation: row.position || '',
      'Rate/Day': row.ratePerDay || 0,
      Department: row.department || '',
      'Days Covered': row.days || '',
      'No. of Days': row.numberOfDays || '',
      'Official Time': row.officialTime || '',
      Period: row.renderedDays || '',
      'No. of Days (Rendered)': row.rh ? Math.floor(row.rh / 8) : '',
      'No. of Hours (Rendered)': row.rh ? row.rh % 8 : '',
      'Gross Amount': row.grossAmount || 0,
      'Deduction (Hrs)': row.h || 0,
      'Deduction (Mins)': row.m || 0,
      'Total Deduction': computeTotalDeduction(row.ratePerDay, row.h, row.m),
      'SSS Contribution': row.sssContribution || 0,
      'Net Amount': computeNetAmount(
        row.grossAmount,
        row.ratePerDay,
        row.h,
        row.m,
        row.sssContribution
      ),
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Data');

    // Export file
    XLSX.writeFile(workbook, 'JobOrder_Payroll.xlsx');
  };

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

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(0);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsSearching(true);

    // Clear any existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    // Set new timeout
    window.searchTimeout = setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Paper
        sx={{
          bgcolor: '#6D2323',
          color: 'white',
          p: 3,
          borderRadius: '12px 12px 0 0',
          boxShadow: 3,
        }}
      >
        <LoadingOverlay
          open={isProcessingDelete}
          message="Deleting payroll record..." // Customize your message
        />
        <Box display="flex" alignItems="center" gap={2}>
          <svg
            width="40"
            height="40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Job Order Payroll
            </Typography>
            <Typography variant="body2" color="grey.200">
              View and manage employee job order payroll records
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          border: '2px solid #6D2323',
          p: 2,
          borderRadius: 1,
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <FormControl
            variant="outlined"
            size="small"
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

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 180,
              bgcolor: '#fff',
              border: '1px solid #6d2323',
              borderRadius: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="Processed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'green', fontSize: 16 }} />
                  Processed
                </Box>
              </MenuItem>
              <MenuItem value="Unprocessed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PendingIcon sx={{ color: 'orange', fontSize: 16 }} />
                  Unprocessed
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 120,
              bgcolor: '#fff',
              border: '1px solid #6d2323',
              borderRadius: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          >
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Month"
            >
              {monthOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 100,
              bgcolor: '#fff',
              border: '1px solid #6d2323',
              borderRadius: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          >
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Year"
            >
              {yearOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            size="small"
            placeholder={isSearching ? 'Searching...' : 'Search Name'}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              minWidth: 200,
              bgcolor: '#fff',
              border: '1px solid #6d2323',
              borderRadius: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isSearching ? (
                    <CircleIcon
                      sx={{
                        color: '#6d2323',
                        animation: 'pulse 1s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 },
                        },
                      }}
                    />
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          mt: 3,
          border: '4px solid #6D2323',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  rowSpan={2}
                  sx={{ bgcolor: 'white', borderRight: '1px solid #ddd' }}
                >
                  <Checkbox
                    indeterminate={(() => {
                      const currentPageRows = filteredData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      );
                      // Filter out already finalized rows AND processed rows
                      const selectableRows = currentPageRows.filter(
                        (row) =>
                          row.status !== 1 && // Exclude processed
                          !finalizedPayroll.some(
                            (fp) =>
                              fp.employeeNumber === row.employeeNumber &&
                              fp.startDate === row.startDate &&
                              fp.endDate === row.endDate
                          )
                      );
                      const selectedOnPage = selectedRows.filter((id) =>
                        selectableRows.some((row) => row.id === id)
                      );
                      return (
                        selectedOnPage.length > 0 &&
                        selectedOnPage.length < selectableRows.length
                      );
                    })()}
                    checked={(() => {
                      const currentPageRows = filteredData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      );
                      // Filter out already finalized rows AND processed rows
                      const selectableRows = currentPageRows.filter(
                        (row) =>
                          row.status !== 1 && // Exclude processed
                          !finalizedPayroll.some(
                            (fp) =>
                              fp.employeeNumber === row.employeeNumber &&
                              fp.startDate === row.startDate &&
                              fp.endDate === row.endDate
                          )
                      );
                      if (selectableRows.length === 0) return false;
                      return selectableRows.every((row) =>
                        selectedRows.includes(row.id)
                      );
                    })()}
                    onChange={(e) => {
                      const currentPageRows = filteredData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      );
                      // Filter out already finalized rows AND processed rows
                      const selectableRows = currentPageRows.filter(
                        (row) =>
                          row.status !== 1 && // Exclude processed
                          !finalizedPayroll.some(
                            (fp) =>
                              fp.employeeNumber === row.employeeNumber &&
                              fp.startDate === row.startDate &&
                              fp.endDate === row.endDate
                          )
                      );
                      const currentIds = selectableRows.map((row) => row.id);
                      if (e.target.checked) {
                        setSelectedRows((prev) => [
                          ...new Set([...prev, ...currentIds]),
                        ]);
                      } else {
                        setSelectedRows((prev) =>
                          prev.filter((id) => !currentIds.includes(id))
                        );
                      }
                    }}
                  />
                </TableCell>

                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  No.
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Employee #
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Designation
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Rate/Day
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Department
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Days Covered
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  No. Of Days
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    minWidth: 180, // Add this line
                    maxWidth: 300, // Add this line (optional)
                  }}
                >
                  Official Time
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'normal',
                    minWidth: 200, // 👈 ensures it has space
                    maxWidth: 350, // optional, prevents it from stretching too much
                  }}
                >
                  Period
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  No. of Days
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  No. of Hours
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Gross Amount
                </TableCell>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Deduction
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SSS
                </TableCell>

                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Net Amount
                </TableCell>

                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Hrs
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Mins
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Total Deduction
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={23} align="center" sx={{ py: 4 }}>
                    <CircularProgress sx={{ color: '#6D2323' }} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={row.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          disabled={finalizedPayroll.some(
                            (fp) =>
                              fp.employeeNumber === row.employeeNumber &&
                              fp.startDate === row.startDate &&
                              fp.endDate === row.endDate
                          )}
                          onChange={(e) => {
                            const isFinalized = finalizedPayroll.some(
                              (fp) =>
                                fp.employeeNumber === row.employeeNumber &&
                                fp.startDate === row.startDate &&
                                fp.endDate === row.endDate
                            );
                            if (isFinalized) return;
                            e.stopPropagation();
                            if (selectedRows.includes(row.id)) {
                              setSelectedRows((prev) =>
                                prev.filter((id) => id !== row.id)
                              );
                            } else {
                              setSelectedRows((prev) => [...prev, row.id]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.employeeNumber || '—'}</TableCell>
                      <TableCell>{row.name || '—'}</TableCell>
                      <TableCell>{row.position || '—'}</TableCell>
                      <TableCell>
                        {row.ratePerDay ? formatCurrency(row.ratePerDay) : '—'}
                      </TableCell>
                      <TableCell>{row.department || '—'}</TableCell>
                      <TableCell>{row.days || '—'}</TableCell>
                      <TableCell>{row.numberOfDays || '—'}</TableCell>
                      <TableCell>{row.officialTime || '—'}</TableCell>
                      <TableCell> {row.renderedDays || '—'}</TableCell>
                      <TableCell>
                        {row.rh ? Math.floor(parseFloat(row.rh) / 8) : '—'}
                      </TableCell>
                      <TableCell>
                        {row.rh ? parseFloat(row.rh) % 8 : '—'}
                      </TableCell>
                      <TableCell>
                        {row.grossAmount
                          ? formatCurrency(row.grossAmount)
                          : '—'}
                      </TableCell>
                      <TableCell>{row.h || 0}</TableCell>
                      <TableCell>{row.m || 0}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: '#6D2323',
                        }}
                      >
                        {formatCurrency(
                          computeTotalDeduction(row.ratePerDay, row.h, row.m)
                        )}
                      </TableCell>
                      <TableCell>
                        {row.sssContribution
                          ? formatCurrency(row.sssContribution)
                          : '—'}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 'bold', color: '#6D2323' }}>
                        {formatCurrency(
                          computeNetAmount(
                            row.grossAmount,
                            row.ratePerDay,
                            row.h,
                            row.m,
                            row.sssContribution
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        {row.status === 1 ? (
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              bgcolor: '#4caf50',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          >
                            Processed
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              bgcolor: '#ff9800',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          >
                            Unprocessed
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              sx={{ color: '#d32f2f' }}
                              onClick={() => handleDeleteClick(row)}
                              disabled={
                                row.status === 1 || // Disable if already processed
                                finalizedPayroll.some(
                                  (fp) =>
                                    fp.employeeNumber === row.employeeNumber &&
                                    fp.startDate === row.startDate &&
                                    fp.endDate === row.endDate
                                )
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={23} align="center" sx={{ py: 4 }}>
                    {searchTerm
                      ? 'No matching records found.'
                      : 'No payroll records available.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              color: '#6D2323',
              fontSize: '0.95rem',
            }}
          >
            Selected Records: {selectedRows.length}
          </Typography>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                {
                  margin: 0,
                },
              '.MuiTablePagination-toolbar': {
                padding: 0,
              },
            }}
          />
        </Box>
      </Paper>

      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Button
          variant="outlined"
          sx={{
            bgcolor: '#6d2323',
            color: '#ffffff',
            border: '1px solid transparent',
            px: 3,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#ffffff',
              color: '#6d2323',
              border: '1px solid #6d2323',
              '& .download-icon': {
                transform: 'translateY(-3px)', // Move up slightly
                transition: 'transform 0.3s ease-in-out',
              },
            },
          }}
          startIcon={<DownloadIcon className="download-icon" />}
          onClick={handleExportToExcel}
        >
          Save as Excel
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: '#6D2323',
            '&:hover': { bgcolor: '#a31d1d' },
            px: 3,
            py: 1,
          }}
          startIcon={<DownloadIcon />}
          onClick={handleOpenConfirm}
          disabled={
            processing ||
            selectedRows.length === 0 ||
            selectedRows.every((id) => {
              const row = payrollData.find((r) => r.id === id);
              return finalizedPayroll.some(
                (fp) =>
                  fp.employeeNumber === row?.employeeNumber &&
                  fp.startDate === row?.startDate &&
                  fp.endDate === row?.endDate
              );
            })
          }
        >
          Export to Payroll Processed
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#6D2323',
            fontWeight: 'bold',
          }}
        >
          <DeleteForever sx={{ color: '#6D2323', fontSize: 30 }} />
          Delete Record Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the payroll record for{' '}
            <strong>{recordToDelete?.name}</strong> (Employee #
            {recordToDelete?.employeeNumber})?
            <br />
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#666',
              '&:hover': {
                borderColor: '#444',
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={isProcessingDelete}
            variant="contained"
            sx={{
              bgcolor: '#6D2323',
              '&:hover': { bgcolor: '#a31d1d' },
            }}
            startIcon={
              isProcessingDelete ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteForever />
              )
            }
          >
            {isProcessingDelete ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          sx: { minWidth: '400px', borderRadius: '8px' },
        }}
      >
        <DialogTitle>Process Payroll Records</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to process <b>{selectedRows.length}</b>{' '}
            selected payroll record
            {selectedRows.length > 1 ? 's' : ''}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleExportToFinalized}
            sx={{ bgcolor: '#6D2323', '&:hover': { bgcolor: '#a31d1d' } }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {/* Loading Overlay */}
      <LoadingOverlay
        open={loadingOverlay}
        message="Processing payroll records..."
      />

      {/* Success Overlay */}
      <SuccessfulOverlay open={successOpen} action={successAction} />
    </Box>
  );
};

export default PayrollJO;
