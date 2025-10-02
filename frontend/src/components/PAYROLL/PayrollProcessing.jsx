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
  Grid, // Added Grid import
  Checkbox,
  CircularProgress,
} from '@mui/material';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfulOverlay from '../SuccessfulOverlay';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExitToApp,
  Payment,
  BusinessCenter,
} from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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

const PayrollProcess = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null); // Added missing state for editRow
  const [isPayrollProcessed, setIsPayrollProcessed] = useState(false);
  const [finalizedPayroll, setFinalizedPayroll] = useState([]);
  const [duplicateEmployeeNumbers, setDuplicateEmployeeNumbers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Month options for filtering
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

  // Year options for filtering
  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ];

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

  const canSubmit = selectedRows.length > 0;

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
      Math.min(rowsPerPage, filteredData.length) * rowHeight +
      headerHeight +
      paginationHeight;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
  };

  // Test authentication function
  const testAuth = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/PayrollRoute/test-auth`,
        getAuthHeaders()
      );
      console.log('Auth test successful:', res.data);
    } catch (error) {
      console.error('Auth test failed:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchFinalizedPayroll = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/PayrollRoute/finalized-payroll`,
          getAuthHeaders()
        );
        setFinalizedPayroll(res.data);
      } catch (err) {
        console.error('Error fetching finalized payroll data:', err);
      }
    };

    fetchFinalizedPayroll();
  }, []);

  const isAlreadyFinalized = filteredData.some((fd) =>
    finalizedPayroll.some(
      (fp) =>
        fp.employeeNumber === fd.employeeNumber &&
        fp.startDate === fd.startDate &&
        fp.endDate === fd.endDate
    )
  );

  const fetchPayrollData = async (searchTerm = '') => {
    try {
      setIsSearching(true);
      const url = searchTerm
        ? `${API_BASE_URL}/PayrollRoute/payroll/search?searchTerm=${searchTerm}`
        : `${API_BASE_URL}/PayrollRoute/payroll-with-remittance`;

      const res = await axios.get(url, getAuthHeaders());
      console.log(res.data);

      // ✅ Track duplicates
      const seen = new Set();
      const duplicates = new Set();

      res.data.forEach((item) => {
        if (seen.has(item.employeeNumber)) {
          duplicates.add(item.employeeNumber);
        } else {
          seen.add(item.employeeNumber);
        }
      });

      // ✅ Normalize data
      const allData = res.data.map((item) => ({
        ...item,
        status:
          item.status === 'Processed' || item.status === 1
            ? 'Processed'
            : 'Unprocessed',
      }));

      setDuplicateEmployeeNumbers([...duplicates]);
      setFilteredData(allData);
      setData(allData);

      // ✅ Check if all processed/unprocessed
      const allProcessed = allData.every(
        (item) => item.status === 'Processed' || item.status === 1
      );

      const allUnprocessed = allData.every(
        (item) => item.status === 'Unprocessed' || item.status === 0
      );

      setIsPayrollProcessed(allProcessed);
    } catch (err) {
      console.error('Error fetching payroll data:', err);
      setError('An error occurred while fetching the payroll data.');
    } finally {
      setIsSearching(false);
    }
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

    // Test authentication first
    testAuth();

    fetchPayrollData();
    fetchDepartments();
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    applyFilters(selectedDept, searchTerm, selectedStatus, selectedMonth, selectedYear);
  };

  const handleStatusChange = (event) => {
    const selectedStatusValue = event.target.value;
    setSelectedStatus(selectedStatusValue);
    applyFilters(selectedDepartment, searchTerm, selectedStatusValue, selectedMonth, selectedYear);
  };

  const handleMonthChange = (event) => {
    const selectedMonthValue = event.target.value;
    setSelectedMonth(selectedMonthValue);
    applyFilters(selectedDepartment, searchTerm, selectedStatus, selectedMonthValue, selectedYear);
  };

  const handleYearChange = (event) => {
    const selectedYearValue = event.target.value;
    setSelectedYear(selectedYearValue);
    applyFilters(selectedDepartment, searchTerm, selectedStatus, selectedMonth, selectedYearValue);
  };

  // HANDLE SEARCH IN DEPARTMENT AND SEARCH BUTTON

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // If search term is empty, immediately reload all data
    if (!term.trim()) {
      fetchPayrollData();
      applyFilters(selectedDepartment, '', selectedStatus, selectedMonth, selectedYear);
      return;
    }

    // Set a new timeout for debounced search (500ms delay)
    const newTimeout = setTimeout(() => {
      console.log('Performing debounced search for:', term);
      fetchPayrollData(term);
    }, 500); // 500ms delay - adjust this value if needed

    setSearchTimeout(newTimeout);
  };

  const applyFilters = (department, search, status, month, year) => {
    let filtered = [...data];

    // Apply department filter
    if (department && department !== '') {
      filtered = filtered.filter((record) => record.department === department);
    }

    // Apply status filter
    if (status && status !== '') {
      filtered = filtered.filter((record) => record.status === status);
    }

    // Apply month filter based on startDate
    if (month && month !== '') {
      filtered = filtered.filter((record) => {
        if (record.startDate) {
          const recordDate = new Date(record.startDate);
          const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
          return recordMonth === month;
        }
        return false;
      });
    }

    // Apply year filter based on startDate
    if (year && year !== '') {
      filtered = filtered.filter((record) => {
        if (record.startDate) {
          const recordDate = new Date(record.startDate);
          const recordYear = recordDate.getFullYear().toString();
          return recordYear === year;
        }
        return false;
      });
    }

    setFilteredData(filtered);
  };

  const handleSubmitPayroll = async () => {
    try {
      const updatedData = filteredData.map((item) => {
        const h = item.h || 0; // Default to 0 if h is not available
        const m = item.m || 0; // Default to 0 if m is not available

        const grossSalary = item.increment
          ? (parseFloat(item.rateNbc594) || 0) +
            (parseFloat(item.nbcDiffl597) || 0) +
            (parseFloat(item.increment) || 0)
          : (parseFloat(item.rateNbc594) || 0) +
            (parseFloat(item.nbcDiffl597) || 0);

        const abs =
          grossSalary * 0.0055555525544423 * h +
          grossSalary * 0.0000925948584897 * m;

        const PhilHealthContribution =
          Math.floor(((grossSalary * 0.05) / 2) * 100) / 100;

        const personalLifeRetIns = grossSalary * 0.09;

        const netSalary = grossSalary - abs;

        const totalGsisDeds =
          (parseFloat(personalLifeRetIns) || 0) +
          (parseFloat(item.gsisSalaryLoan) || 0) +
          (parseFloat(item.gsisPolicyLoan) || 0) +
          (parseFloat(item.gsisArrears) || 0) +
          (parseFloat(item.cpl) || 0) +
          (parseFloat(item.mpl) || 0) +
          (parseFloat(item.eal) || 0) +
          (parseFloat(item.mplLite) || 0) +
          (parseFloat(item.emergencyLoan) || 0);

        const totalPagibigDeds =
          (parseFloat(item.pagibigFundCont) || 0) +
          (parseFloat(item.pagibig2) || 0) +
          (parseFloat(item.multiPurpLoan) || 0);

        const totalOtherDeds =
          (parseFloat(item.liquidatingCash) || 0) +
          (parseFloat(item.landbankSalaryLoan) || 0) +
          (parseFloat(item.earistCreditCoop) || 0) +
          (parseFloat(item.feu) || 0);

        const totalDeductions =
          (parseFloat(item.withholdingTax) || 0) +
          (parseFloat(PhilHealthContribution) || 0) +
          (parseFloat(totalGsisDeds) || 0) +
          (parseFloat(totalPagibigDeds) || 0) +
          (parseFloat(totalOtherDeds) || 0);

        const pay1stCompute = netSalary - totalDeductions;
        const pay2ndCompute = (netSalary - totalDeductions) / 2;

        const pay1st = pay2ndCompute;
        const pay2nd =
          (parseFloat(pay1stCompute) || 0) -
          parseFloat((parseFloat(pay1st) || 0).toFixed(0));

        const rtIns = grossSalary * 0.12;

        return {
          ...item,
          totalGsisDeds: totalGsisDeds.toFixed(2),
          totalPagibigDeds: totalPagibigDeds.toFixed(2),
          totalOtherDeds: totalOtherDeds.toFixed(2),
          grossSalary,
          abs: abs.toFixed(2),
          netSalary: netSalary.toFixed(2),
          totalDeductions: totalDeductions.toFixed(2),
          PhilHealthContribution: PhilHealthContribution.toFixed(2),
          personalLifeRetIns: personalLifeRetIns.toFixed(2),
          pay1stCompute: pay1stCompute.toFixed(2),
          pay2ndCompute: pay2ndCompute.toFixed(2),
          pay1st: pay1st.toFixed(0),
          pay2nd: pay2nd.toFixed(2),
          rtIns: rtIns.toFixed(2),
          status: 'Processed',
        };
      });

      // Filter only selected AND not already finalized rows
      const rowsToSubmit = updatedData.filter(
        (item) =>
          selectedRows.includes(item.employeeNumber) &&
          !finalizedPayroll.some(
            (fp) =>
              fp.employeeNumber === item.employeeNumber &&
              fp.startDate === item.startDate &&
              fp.endDate === item.endDate
          )
      );

      // Ensure all required fields are present and have correct data types
      const processedRowsToSubmit = rowsToSubmit.map((item) => ({
        ...item,
        // Ensure numeric fields are properly formatted
        grossSalary: parseFloat(item.grossSalary) || 0,
        abs: parseFloat(item.abs) || 0,
        h: parseInt(item.h) || 0,
        m: parseInt(item.m) || 0,
        s: parseInt(item.s) || 0,
        netSalary: parseFloat(item.netSalary) || 0,
        withholdingTax: parseFloat(item.withholdingTax) || 0,
        personalLifeRetIns: parseFloat(item.personalLifeRetIns) || 0,
        totalGsisDeds: parseFloat(item.totalGsisDeds) || 0,
        totalPagibigDeds: parseFloat(item.totalPagibigDeds) || 0,
        totalOtherDeds: parseFloat(item.totalOtherDeds) || 0,
        totalDeductions: parseFloat(item.totalDeductions) || 0,
        pay1st: parseFloat(item.pay1st) || 0,
        pay2nd: parseFloat(item.pay2nd) || 0,
        pay1stCompute: parseFloat(item.pay1stCompute) || 0,
        pay2ndCompute: parseFloat(item.pay2ndCompute) || 0,
        rtIns: parseFloat(item.rtIns) || 0,
        ec: parseFloat(item.ec) || 0,
        // Ensure all other numeric fields are properly formatted
        rateNbc584: parseFloat(item.rateNbc584) || 0,
        nbc594: parseFloat(item.nbc594) || 0,
        rateNbc594: parseFloat(item.rateNbc594) || 0,
        nbcDiffl597: parseFloat(item.nbcDiffl597) || 0,
        increment: parseFloat(item.increment) || 0,
        gsisSalaryLoan: parseFloat(item.gsisSalaryLoan) || 0,
        gsisPolicyLoan: parseFloat(item.gsisPolicyLoan) || 0,
        gsisArrears: parseFloat(item.gsisArrears) || 0,
        cpl: parseFloat(item.cpl) || 0,
        mpl: parseFloat(item.mpl) || 0,
        eal: parseFloat(item.eal) || 0,
        mplLite: parseFloat(item.mplLite) || 0,
        emergencyLoan: parseFloat(item.emergencyLoan) || 0,
        pagibigFundCont: parseFloat(item.pagibigFundCont) || 0,
        pagibig2: parseFloat(item.pagibig2) || 0,
        multiPurpLoan: parseFloat(item.multiPurpLoan) || 0,
        liquidatingCash: parseFloat(item.liquidatingCash) || 0,
        landbankSalaryLoan: parseFloat(item.landbankSalaryLoan) || 0,
        earistCreditCoop: parseFloat(item.earistCreditCoop) || 0,
        feu: parseFloat(item.feu) || 0,
        PhilHealthContribution: parseFloat(item.PhilHealthContribution) || 0,
      }));

      console.log('Submitting payroll data:', processedRowsToSubmit);

      // Check if we have any data to submit
      if (processedRowsToSubmit.length === 0) {
        setLoading(false);
        alert('No payroll records selected for submission.');
        return;
      }

      //  Update main payroll database (payroll-with-remittance)
      const updateErrors = [];
      for (const item of processedRowsToSubmit) {
        try {
          await axios.put(
            `${API_BASE_URL}/PayrollRoute/payroll-with-remittance/${item.employeeNumber}`,
            item,
            getAuthHeaders()
          );
        } catch (error) {
          console.error(
            `Error updating payroll for ${item.employeeNumber}:`,
            error
          );
          updateErrors.push(
            `${item.employeeNumber}: ${
              error.response?.data?.error || error.message
            }`
          );
        }
      }

      if (updateErrors.length > 0) {
        console.warn('Some payroll updates failed:', updateErrors);
        // Continue with finalized payroll submission even if some updates failed
      }

      //  Update finalized payroll database (finalized-payroll)
      console.log('Submitting to finalized payroll with audit logging...');
      const finalizedResponse = await axios.post(
        `${API_BASE_URL}/PayrollRoute/finalized-payroll`,
        processedRowsToSubmit,
        getAuthHeaders()
      );
      console.log('Finalized payroll response:', finalizedResponse.data);

      //  Update UI state with new data
      const updatedFilteredData = filteredData.map((row) => {
        const match = processedRowsToSubmit.find(
          (item) => item.employeeNumber === row.employeeNumber
        );
        return match ? { ...row, status: 'Processed' } : row;
      });

      setFilteredData(updatedFilteredData);
      setData(updatedFilteredData);
      setIsPayrollProcessed(true);

      // Refresh finalizedPayroll from backend
      const res = await axios.get(
        `${API_BASE_URL}/PayrollRoute/finalized-payroll`,
        getAuthHeaders()
      );
      setFinalizedPayroll(res.data);
    } catch (error) {
      console.error('Error submitting payroll:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'An error occurred while submitting payroll data.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (rowId, employeeNumber) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/PayrollRoute/payroll-with-remittance/${rowId}/${employeeNumber}`,
        getAuthHeaders()
      );
      const newData = filteredData.filter((item) => item.id !== rowId);
      setFilteredData(newData);

      // Recalculate duplicates
      const seen = {};
      const updatedDuplicates = new Set();

      newData.forEach((item) => {
        if (seen[item.employeeNumber]) {
          updatedDuplicates.add(item.employeeNumber);
        } else {
          seen[item.employeeNumber] = true;
        }
      });

      setDuplicateEmployeeNumbers([...updatedDuplicates]);
    } catch (error) {
      console.error('Error deleting payroll data:', error);
    }
  };

  // Handle modal open and close

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setOpenModal(false);
    setEditRow(null); // Clear the modal data on cancel
  };

  const handleEdit = (rowId) => {
    const row = computedRows.find((item) => item.id === rowId);
    setEditRow(row);
    setOpenModal(true);
  };

  // THIS IS FOR THE MODAL AND IT RECALCULATES THE VALUE DATA
  const handleSave = async () => {
    setLoading(true);
    try {
      const h = editRow.h || 0;
      const m = editRow.m || 0;

      const grossSalary = editRow.increment
        ? (parseFloat(editRow.rateNbc594) || 0) +
          (parseFloat(editRow.nbcDiffl597) || 0) +
          (parseFloat(editRow.increment) || 0)
        : (parseFloat(editRow.rateNbc594) || 0) +
          (parseFloat(editRow.nbcDiffl597) || 0);

      const abs =
        grossSalary * 0.0055555525544423 * h +
        grossSalary * 0.0000925948584897 * m;
      const PhilHealthContribution =
        Math.floor(((grossSalary * 0.05) / 2) * 100) / 100;
      const personalLifeRetIns = grossSalary * 0.09;
      const netSalary = grossSalary - abs;

      const totalGsisDeds =
        (parseFloat(personalLifeRetIns) || 0) +
        (parseFloat(editRow.gsisSalaryLoan) || 0) +
        (parseFloat(editRow.gsisPolicyLoan) || 0) +
        (parseFloat(editRow.gsisArrears) || 0) +
        (parseFloat(editRow.cpl) || 0) +
        (parseFloat(editRow.mpl) || 0) +
        (parseFloat(editRow.eal) || 0) +
        (parseFloat(editRow.mplLite) || 0) +
        (parseFloat(editRow.emergencyLoan) || 0);

      const totalPagibigDeds =
        (parseFloat(editRow.pagibigFundCont) || 0) +
        (parseFloat(editRow.pagibig2) || 0) +
        (parseFloat(editRow.multiPurpLoan) || 0);

      const totalOtherDeds =
        (parseFloat(editRow.liquidatingCash) || 0) +
        (parseFloat(editRow.landbankSalaryLoan) || 0) +
        (parseFloat(editRow.earistCreditCoop) || 0) +
        (parseFloat(editRow.feu) || 0);

      const totalDeductions =
        (parseFloat(editRow.withholdingTax) || 0) +
        (parseFloat(PhilHealthContribution) || 0) +
        (parseFloat(totalGsisDeds) || 0) +
        (parseFloat(totalPagibigDeds) || 0) +
        (parseFloat(totalOtherDeds) || 0);

      const pay1stCompute = netSalary - totalDeductions;
      const pay2ndCompute = pay1stCompute / 2;

      const pay1st = pay2ndCompute;
      const pay2nd =
        pay1stCompute - parseFloat((parseFloat(pay1st) || 0).toFixed(0));

      const rtIns = grossSalary * 0.12;

      const updatedRow = {
        ...editRow,
        h,
        m,
        grossSalary,
        abs,
        PhilHealthContribution,
        personalLifeRetIns,
        netSalary,
        totalGsisDeds,
        totalPagibigDeds,
        totalOtherDeds,
        totalDeductions,
        pay1st,
        pay2nd,
        rtIns,
      };

      const response = await axios.put(
        `${API_BASE_URL}/PayrollRoute/payroll-with-remittance/${editRow.employeeNumber}`,
        updatedRow,
        getAuthHeaders()
      );

      console.log('Payroll record updated successfully:', response.data);
      setOpenModal(false);

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.employeeNumber === updatedRow.employeeNumber
            ? { ...item, ...updatedRow }
            : item
        )
      );

      // Show loading for 2-3 seconds, then success overlay
      setTimeout(() => {
        setLoading(false);
        setSuccessAction('edit');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2500);
      }, 2500);
    } catch (error) {
      console.error('Error updating payroll:', error);
      setLoading(false);
      setError('Failed to update payroll data.');
    }
  };

  const employeeFields = [
    'employeeNumber',
    'name',
    'position',
    'department',
    'startDate',
    'endDate',
  ];
  const salaryRateandAdjustments = [
    'rateNbc584',
    'nbc594',
    'rateNbc594',
    'nbcDiffl597',
    'increment',
  ];
  const SalaryComputation = ['abs', 'h', 'm'];
  const MandatoryDeductions = [
    'withholdingTax',
    'totalGsisDeds',
    'totalPagibigDeds',
    'PhilHealthContribution',
    'totalOtherDeds',
    'totalDeductions',
  ];
  const PayrollDisbursement = ['pay1st', 'pay2nd', 'ec'];

  const GsisDeductions = [
    'personalLifeRetIns',
    'gsisSalaryLoan',
    'gsisPolicyLoan',
    'gsisArrears',
    'mpl',
    'eal',
    'cpl',
    'mplLite',
    'emergencyLoan',
  ];

  const PagIbigDeductions = ['pagibigFundCont', 'multiPurpLoan', 'pagibig2'];

  const totalOtherDeductions = [
    'liquidatingCash',
    'earistCreditCoop',
    'feu',
    'landbankSalaryLoan',
  ];

  // COMPUTATION:

  const computedRows = filteredData.map((item) => {
    const h = item.h || 0; // Default to 0 if h is not available
    const m = item.m || 0; // Default to 0 if m is not availabl

    const grossSalary = item.increment
      ? (parseFloat(item.rateNbc594) || 0) +
        (parseFloat(item.nbcDiffl597) || 0) +
        (parseFloat(item.increment) || 0)
      : (parseFloat(item.rateNbc594) || 0) +
        (parseFloat(item.nbcDiffl597) || 0);

    const abs =
      grossSalary * 0.0055555525544423 * h +
      grossSalary * 0.0000925948584897 * m;
    const PhilHealthContribution =
      Math.floor(((grossSalary * 0.05) / 2) * 100) / 100;
    const personalLifeRetIns = grossSalary * 0.09;

    const netSalary = grossSalary - abs;

    const totalGsisDeds =
      (parseFloat(personalLifeRetIns) || 0) +
      (parseFloat(item.gsisSalaryLoan) || 0) +
      (parseFloat(item.gsisPolicyLoan) || 0) +
      (parseFloat(item.gsisArrears) || 0) +
      (parseFloat(item.cpl) || 0) +
      (parseFloat(item.mpl) || 0) +
      (parseFloat(item.eal) || 0) +
      (parseFloat(item.mplLite) || 0) +
      (parseFloat(item.emergencyLoan) || 0);

    const totalPagibigDeds =
      (parseFloat(item.pagibigFundCont) || 0) +
      (parseFloat(item.pagibig2) || 0) +
      (parseFloat(item.multiPurpLoan) || 0);

    const totalOtherDeds =
      (parseFloat(item.liquidatingCash) || 0) +
      (parseFloat(item.landbankSalaryLoan) || 0) +
      (parseFloat(item.earistCreditCoop) || 0) +
      (parseFloat(item.feu) || 0);

    const totalDeductions =
      (parseFloat(item.withholdingTax) || 0) +
      (parseFloat(PhilHealthContribution) || 0) +
      (parseFloat(totalGsisDeds) || 0) +
      (parseFloat(totalPagibigDeds) || 0) +
      (parseFloat(totalOtherDeds) || 0);

    const pay1stCompute = netSalary - totalDeductions;
    const pay2ndCompute = (netSalary - totalDeductions) / 2;

    const pay1st = pay2ndCompute;
    const pay2nd =
      (parseFloat(pay1stCompute) || 0) -
      parseFloat((parseFloat(pay1st) || 0).toFixed(0));

    const rtIns = grossSalary * 0.12;

    return {
      ...item,
      h,
      m,
      totalGsisDeds: totalGsisDeds.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalPagibigDeds: totalPagibigDeds.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalOtherDeds: totalOtherDeds.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      grossSalary: grossSalary.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      abs: abs.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      netSalary: netSalary.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalDeductions: totalDeductions.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      PhilHealthContribution: PhilHealthContribution.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      personalLifeRetIns: personalLifeRetIns.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      pay1stCompute: pay1stCompute.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      pay2ndCompute: pay2ndCompute.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      pay1st: pay1st.toLocaleString('en-US', {
        maximumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      pay2nd: pay2nd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      rtIns: rtIns.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  });

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
              Payroll | Processing
            </Typography>
            <Typography
              variant="body2"
              color="rgba(255,255,255,0.7)"
              fontFamily="'Poppins', sans-serif"
            >
              Manage employee records and calculates accurately
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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

          <FormControl
            variant="outlined"
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
            placeholder={isSearching ? 'Searching...' : 'Search Name'}
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isSearching}
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
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {duplicateEmployeeNumbers.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Duplicate employee number(s) found:{' '}
              {duplicateEmployeeNumbers.join(', ')}. These rows are highlighted
              in red.
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 2,
                border: '3px solid #6d2323',
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
                    height: '5px',
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedRows.length > 0 &&
                            selectedRows.length <
                              computedRows.filter(
                                (row) =>
                                  !finalizedPayroll.some(
                                    (fp) =>
                                      fp.employeeNumber ===
                                        row.employeeNumber &&
                                      fp.startDate === row.startDate &&
                                      fp.endDate === row.endDate
                                  )
                              ).length
                          }
                          checked={
                            selectedRows.length ===
                            computedRows.filter(
                              (row) =>
                                !finalizedPayroll.some(
                                  (fp) =>
                                    fp.employeeNumber === row.employeeNumber &&
                                    fp.startDate === row.startDate &&
                                    fp.endDate === row.endDate
                                )
                            ).length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(
                                computedRows
                                  .filter(
                                    (row) =>
                                      !finalizedPayroll.some(
                                        (fp) =>
                                          fp.employeeNumber ===
                                            row.employeeNumber &&
                                          fp.startDate === row.startDate &&
                                          fp.endDate === row.endDate
                                      )
                                  )
                                  .map((row) => row.employeeNumber)
                              );
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </TableCell>

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
                      <ExcelTableCell header>
                        <b>ABS</b>
                      </ExcelTableCell>
                      <ExcelTableCell header>H</ExcelTableCell>
                      <ExcelTableCell header>M</ExcelTableCell>
                      <ExcelTableCell header>Net Salary</ExcelTableCell>
                      <ExcelTableCell header>Withholding Tax</ExcelTableCell>
                      <ExcelTableCell header>
                        <b>Total GSIS Deductions</b>
                      </ExcelTableCell>
                      <ExcelTableCell header>
                        <b>Total Pag-ibig Deductions</b>
                      </ExcelTableCell>
                      <ExcelTableCell header>PhilHealth</ExcelTableCell>
                      <ExcelTableCell header>
                        {' '}
                        <b>Total Other Deductions</b>
                      </ExcelTableCell>
                      <ExcelTableCell header>
                        <b>Total Deductions</b>
                      </ExcelTableCell>
                      <ExcelTableCell header>1st Pay</ExcelTableCell>
                      <ExcelTableCell header>2nd Pay</ExcelTableCell>
                      <ExcelTableCell header>No.</ExcelTableCell>
                      <ExcelTableCell header>RT Ins.</ExcelTableCell>
                      <ExcelTableCell header>EC</ExcelTableCell>
                      <ExcelTableCell header>PhilHealth</ExcelTableCell>
                      <ExcelTableCell header>Pag-Ibig</ExcelTableCell>
                      <ExcelTableCell
                        header
                        style={{ borderLeft: '2px solid black' }}
                      >
                        Pay1st Compute
                      </ExcelTableCell>
                      <ExcelTableCell header>Pay2nd Compute</ExcelTableCell>
                      <ExcelTableCell
                        header
                        style={{ borderLeft: '2px solid black' }}
                      >
                        No.
                      </ExcelTableCell>
                      <ExcelTableCell header>Name</ExcelTableCell>
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
                      <ExcelTableCell>
                        Pag-ibig Fund Contribution
                      </ExcelTableCell>
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
                      <ExcelTableCell header>Status</ExcelTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredData.length > 0 ? (
                      computedRows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const isFinalized = finalizedPayroll.some(
                            (fp) =>
                              fp.employeeNumber === row.employeeNumber &&
                              fp.startDate === row.startDate &&
                              fp.endDate === row.endDate
                          );

                          return (
                            <TableRow
                              key={`${row.employeeNumber}-${row.dateCreated}`}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#F5F5F5 !important',
                                },
                              }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedRows.includes(
                                    row.employeeNumber
                                  )}
                                  onChange={() => {
                                    if (
                                      selectedRows.includes(row.employeeNumber)
                                    ) {
                                      setSelectedRows((prev) =>
                                        prev.filter(
                                          (id) => id !== row.employeeNumber
                                        )
                                      );
                                    } else {
                                      setSelectedRows((prev) => [
                                        ...prev,
                                        row.employeeNumber,
                                      ]);
                                    }
                                  }}
                                  disabled={isFinalized}
                                />
                              </TableCell>

                              <ExcelTableCell>
                                {page * rowsPerPage + index + 1}
                              </ExcelTableCell>
                              <ExcelTableCell>{row.department}</ExcelTableCell>
                              <ExcelTableCell>
                                {row.employeeNumber}
                              </ExcelTableCell>
                              <ExcelTableCell>{row.startDate}</ExcelTableCell>
                              <ExcelTableCell>{row.endDate}</ExcelTableCell>
                              <ExcelTableCell>{row.name}</ExcelTableCell>
                              <ExcelTableCell>{row.position}</ExcelTableCell>
                              <ExcelTableCell>
                                {row.rateNbc584
                                  ? Number(row.rateNbc584).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.nbc594
                                  ? Number(row.nbc594).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.rateNbc594
                                  ? Number(row.rateNbc594).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.nbcDiffl597
                                  ? Number(row.nbcDiffl597).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.increment
                                  ? Number(row.increment).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>{row.grossSalary}</ExcelTableCell>
                              <ExcelTableCell>
                                <b>{row.abs}</b>
                              </ExcelTableCell>
                              <ExcelTableCell>{row.h}</ExcelTableCell>
                              <ExcelTableCell>{row.m}</ExcelTableCell>
                              <ExcelTableCell>{row.netSalary}</ExcelTableCell>
                              <ExcelTableCell>
                                {row.withholdingTax}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalGsisDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalPagibigDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.PhilHealthContribution}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalOtherDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalDeductions}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{ color: 'red', fontWeight: 'bold' }}
                              >
                                {row.pay1st}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{ color: 'red', fontWeight: 'bold' }}
                              >
                                {row.pay2nd}
                              </ExcelTableCell>
                              <ExcelTableCell>{index + 1}</ExcelTableCell>
                              <ExcelTableCell>{row.rtIns}</ExcelTableCell>
                              <ExcelTableCell>{row.ec}</ExcelTableCell>
                              <ExcelTableCell>
                                {row.PhilHealthContribution}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.pagibigFundCont}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{
                                  borderLeft: '2px solid black',
                                  color: 'red',
                                  fontWeight: 'bold',
                                }}
                              >
                                {row.pay1stCompute}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{ color: 'red', fontWeight: 'bold' }}
                              >
                                {row.pay2ndCompute}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{ borderLeft: '2px solid black' }}
                              >
                                {index + 1}
                              </ExcelTableCell>
                              <ExcelTableCell>{row.name}</ExcelTableCell>
                              <ExcelTableCell>{row.position}</ExcelTableCell>
                              <ExcelTableCell>
                                {row.withholdingTax
                                  ? Number(row.withholdingTax).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.personalLifeRetIns}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.gsisSalaryLoan
                                  ? Number(row.gsisSalaryLoan).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.gsisPolicyLoan
                                  ? Number(row.gsisPolicyLoan).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.gsisArrears
                                  ? Number(row.gsisArrears).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.cpl
                                  ? Number(row.cpl).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.mpl
                                  ? Number(row.mpl).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.eal
                                  ? Number(row.eal).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.mplLite
                                  ? Number(row.mplLite).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.emergencyLoan
                                  ? Number(row.emergencyLoan).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalGsisDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.pagibigFundCont
                                  ? Number(row.pagibigFundCont).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.pagibig2
                                  ? Number(row.pagibig2).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.multiPurpLoan
                                  ? Number(row.multiPurpLoan).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalPagibigDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.PhilHealthContribution}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.liquidatingCash
                                  ? Number(row.liquidatingCash).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.landbankSalaryLoan
                                  ? Number(
                                      row.landbankSalaryLoan
                                    ).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.earistCreditCoop
                                  ? Number(row.earistCreditCoop).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.feu
                                  ? Number(row.feu).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : ''}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalOtherDeds}
                              </ExcelTableCell>
                              <ExcelTableCell>
                                {row.totalDeductions}
                              </ExcelTableCell>
                              <ExcelTableCell
                                sx={{
                                  fontWeight: 'bold',
                                  color:
                                    row.status === 'Processed'
                                      ? 'green'
                                      : 'red',
                                }}
                              >
                                {row.status}
                              </ExcelTableCell>
                            </TableRow>
                          );
                        })
                    ) : (
                      <TableRow>
                        <ExcelTableCell colSpan={13} align="center">
                          No payroll records available.
                        </ExcelTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E0E0E0',
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#6d2323' }}>
                    Total Records: {filteredData.length}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#6d2323' }}>
                    Selected: {selectedRows.length}
                  </Typography>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  sx={{
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                      {
                        my: 'auto',
                      },
                  }}
                />
              </Box>
            </Paper>

            <Paper
              elevation={4}
              sx={{
                borderRadius: 2,
                width: '120px',
                height: getTableHeight(),
                display: 'flex',
                flexDirection: 'column',
                border: '3px solid #6d2323',
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderBottom: '2px solid black',
                  pb: '20px',
                  bgcolor: '#ffffff',
                  height: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mt: '15px', fontSize: '0.75rem' }}
                >
                  Actions
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  borderTop: '1px solid #E0E0E0',
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
                }}
              >
                {computedRows.length > 0 ? (
                  computedRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isFinalized = finalizedPayroll.some(
                        (fp) =>
                          fp.employeeNumber === row.employeeNumber &&
                          fp.startDate === row.startDate &&
                          fp.endDate === row.endDate
                      );

                      return (
                        <Box
                          key={`${row.employeeNumber}-${row.dateCreated}`}
                          sx={{
                            height: '42px', // Match table row height exactly
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid #E0E0E0',
                            borderRight: '1px solid #E0E0E0',
                            borderLeft: '1px solid #E0E0E0',
                            margin: 0,
                            padding: 0,
                            '&:nth-of-type(odd)': {
                              backgroundColor: '#FAFAFA',
                            },
                            '&:hover': {
                              backgroundColor: '#F5F5F5',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                            }}
                          >
                            <Button
                              onClick={() => handleEdit(row.id)}
                              variant="contained"
                              disabled={isFinalized}
                              sx={{
                                bgcolor: isFinalized ? '#D3D3D3' : '#6d2323',
                                color: isFinalized ? '#A9A9A9' : '#ffffff',
                                minWidth: '30px',
                                width: '32px',
                                height: '32px',
                                padding: 0,
                                opacity: isFinalized ? 0.6 : 1,
                                pointerEvents: isFinalized ? 'none' : 'auto',
                                '&:hover': {
                                  bgcolor: isFinalized ? '#D3D3D3' : '#A31D1D',
                                },
                              }}
                              title="Edit Record"
                            >
                              <EditIcon fontSize="small" />
                            </Button>

                            <Button
                              onClick={() =>
                                handleDelete(row.id, row.employeeNumber)
                              }
                              variant="contained"
                              disabled={isFinalized}
                              sx={{
                                bgcolor: isFinalized ? '#D3D3D3' : '#d32f2f',
                                color: isFinalized ? '#A9A9A9' : '#ffffff',
                                minWidth: '32px',
                                width: '32px',
                                height: '32px',
                                padding: 0,
                                opacity: isFinalized ? 0.6 : 1,
                                pointerEvents: isFinalized ? 'none' : 'auto',
                                '&:hover': {
                                  bgcolor: isFinalized ? '#D3D3D3' : '#b71c1c',
                                },
                              }}
                              title="Delete Record"
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Box>
                        </Box>
                      );
                    })
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>No records</Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

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
          onClick={() => setShowConfirmation(true)}
          disabled={!canSubmit}
          size="medium"
          sx={{
            backgroundColor: '#6d2323',
            color: canSubmit ? '#ffffff' : '#0c0b0bff',
            textTransform: 'none',
            opacity: canSubmit ? 1 : 0.6,
            pointerEvents: canSubmit ? 'auto' : 'none',
            '&:hover': {
              backgroundColor: '#a31d1d',
            },
          }}
          startIcon={<ExitToApp />}
        >
          Export Payroll Records
        </Button>

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
      </div>

      <Modal open={openModal} onClose={handleCancel}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {editRow && (
            <>
              <Typography variant="h5" mb={3}>
                Edit Payroll Record
              </Typography>

              {/* Employee Info */}
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
              <Grid container spacing={2}>
                {employeeFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    {field === 'department' ? (
                      // Department field with dropdown
                      <FormControl fullWidth>
                        <InputLabel id="department-label">
                          Department
                        </InputLabel>
                        <Select
                          labelId="department-label"
                          id="department-select"
                          name={field}
                          value={editRow[field] || ''}
                          onChange={handleModalChange}
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
                    ) : (
                      // Other fields with text input
                      <TextField
                        fullWidth
                        label={field}
                        name={field}
                        value={editRow[field] || ''}
                        onChange={handleModalChange}
                        InputLabelProps={{
                          style: { fontSize: '15px' }, // Make the label bigger
                        }}
                        InputProps={{
                          style: { fontSize: '15px' }, // Make the input text bigger
                        }}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>

              {/* MODAL EDIT*/}
              {/* Salary Info */}
              <Typography variant="h6" mt={4} gutterBottom>
                Salary Rate and Adjustments
              </Typography>
              <Grid container spacing={2}>
                {salaryRateandAdjustments.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      disabled={field === 'rateNbc594'}
                      InputProps={{
                        style:
                          field === 'rateNbc594'
                            ? {
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: '15px',
                              }
                            : undefined,
                      }}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Deductions */}
              <Typography variant="h6" mt={5} gutterBottom>
                Absent Deductions
              </Typography>
              <Grid container spacing={2}>
                {SalaryComputation.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" mt={4} gutterBottom>
                Payroll Disbursement
              </Typography>
              <Grid container spacing={2}>
                {PayrollDisbursement.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" mt={4} gutterBottom>
                GSIS Deductions
              </Typography>
              <Grid container spacing={2}>
                {GsisDeductions.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" mt={4} gutterBottom>
                PAGIBIG Deductions
              </Typography>
              <Grid container spacing={2}>
                {PagIbigDeductions.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" mt={4} gutterBottom>
                Total Other Deductions
              </Typography>
              <Grid container spacing={2}>
                {totalOtherDeductions.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Other Info */}
              <Box mt={4} mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Total Contributions & Deductions
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {MandatoryDeductions.map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      name={field}
                      value={editRow[field] || ''}
                      onChange={handleModalChange}
                      InputLabelProps={{
                        style: { fontSize: '15px' }, // Make the label bigger
                      }}
                      InputProps={{
                        style: { fontSize: '15px' }, // Make the input text bigger
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Save / Cancel */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  style={{
                    textTransform: 'none',
                    width: '100px',
                    backgroundColor: '#6D2323',
                    color: '#FEF9E1',
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  style={{
                    textTransform: 'none',
                    width: '100px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            width: 400,
          }}
        >
          <Typography variant="body2" mb={2}>
            Please confirm that all the data provided are accurate before
            proceeding. Are you sure you want to submit the payroll records?
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              style={{ color: 'black' }}
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#6D2323', width: '120px' }}
              color="success"
              onClick={async () => {
                setIsSubmitting(true);
                setShowConfirmation(false);

                // Start loading overlay
                setLoading(true);

                try {
                  await handleSubmitPayroll(); // This is your real submit function

                  // Show loading for 2-3 seconds, then success overlay, then navigate
                  setTimeout(() => {
                    setLoading(false);
                    setSuccessAction('export');
                    setSuccessOpen(true);

                    // Navigate to payroll-processed after success overlay
                    setTimeout(() => {
                      setSuccessOpen(false);
                      window.location.href = '/payroll-processed';
                    }, 2500);
                  }, 2500);
                } catch (error) {
                  console.error('Error exporting payroll:', error);
                  setLoading(false);
                  alert('Failed to export payroll records. Please try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Loading and Success Overlays */}
      <LoadingOverlay open={loading} message="Processing..." />
      <SuccessfulOverlay
        open={successOpen}
        action={successAction}
        onClose={() => setSuccessOpen(false)}
      />
    </Container>
  );
};

export default PayrollProcess;
