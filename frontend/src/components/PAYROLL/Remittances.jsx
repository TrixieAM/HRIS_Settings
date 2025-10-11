import API_BASE_URL from '../../apiConfig';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Modal,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
  Paid,
  Search as SearchIcon,
  Payment as ReorderIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';


import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';


// Auth header helper
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


// Employee Autocomplete Component
const EmployeeAutocomplete = ({
  value,
  onChange,
  placeholder = 'Search employee...',
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  selectedEmployee,
  onEmployeeSelect,
  dropdownDisabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);


  // Initialize with existing value
  useEffect(() => {
    if (value && !selectedEmployee) {
      fetchEmployeeById(value);
    }
  }, [value]);


  // Set query based on selected employee
  useEffect(() => {
    if (selectedEmployee) {
      setQuery(selectedEmployee.name || '');
    } else if (!value) {
      setQuery('');
    }
  }, [selectedEmployee, value]);


  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fetchEmployees = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Remittance/employees/search?q=${encodeURIComponent(
          searchQuery
        )}`,
        getAuthHeaders()
      );
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchAllEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Remittance/employees/search`,
        getAuthHeaders()
      );
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchEmployeeById = async (employeeNumber) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Remittance/employees/${employeeNumber}`,
        getAuthHeaders()
      );
      const employee = response.data;
      onEmployeeSelect(employee);
      setQuery(employee.name || '');
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
    }
  };


  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setShowDropdown(true);


    // Clear selected employee if input doesn't match
    if (selectedEmployee && inputValue !== selectedEmployee.name) {
      onEmployeeSelect(null);
      onChange('');
    }


    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }


    debounceRef.current = setTimeout(() => {
      if (inputValue.trim().length >= 2) {
        fetchEmployees(inputValue);
      } else if (inputValue.trim().length === 0) {
        fetchAllEmployees();
      } else {
        setEmployees([]);
      }
    }, 300);
  };


  const handleEmployeeSelect = (employee) => {
    onEmployeeSelect(employee);
    setQuery(employee.name);
    setShowDropdown(false);
    onChange(employee.employeeNumber);
  };


  const handleInputFocus = () => {
    setShowDropdown(true);
    if (employees.length === 0 && !isLoading) {
      if (query.length >= 2) {
        fetchEmployees(query);
      } else {
        fetchAllEmployees();
      }
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };


  const handleDropdownClick = () => {
    if (!showDropdown) {
      setShowDropdown(true);
      if (employees.length === 0 && !isLoading) {
        fetchAllEmployees();
      }
    } else {
      setShowDropdown(false);
    }
  };


  return (
    <Box sx={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <TextField
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={error}
        helperText={helperText}
        fullWidth
        autoComplete="off"
        InputProps={{
          startAdornment: <PersonIcon sx={{ color: '#6D2323', mr: 1 }} />,
          endAdornment: (
            <IconButton
              onClick={dropdownDisabled ? undefined : handleDropdownClick}
              size="small"
              disabled={dropdownDisabled}
              sx={{ color: '#6D2323' }}
            >
              {showDropdown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#6D2323',
            },
            '&:hover fieldset': {
              borderColor: '#6D2323',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6D2323',
            },
          },
        }}
      />


      {showDropdown && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 1,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Loading...
              </Typography>
            </Box>
          ) : employees.length > 0 ? (
            <List dense>
              {employees.map((employee) => (
                <ListItem
                  key={employee.employeeNumber}
                  button
                  onClick={() => handleEmployeeSelect(employee)}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    primary={employee.name}
                    secondary={`#${employee.employeeNumber}`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    secondaryTypographyProps={{ color: '#666' }}
                  />
                </ListItem>
              ))}
            </List>
          ) : query.length >= 2 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                No employees found matching "{query}"
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                {employees.length === 0
                  ? 'No employees available'
                  : 'Type to search or scroll to browse'}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};


const EmployeeRemittance = () => {
  const [data, setData] = useState([]);
  const [newRemittance, setNewRemittance] = useState({
    employeeNumber: '',
    liquidatingCash: '',
    gsisSalaryLoan: '',
    gsisPolicyLoan: '',
    gsisArrears: '',
    cpl: '',
    mpl: '',
    mplLite: '',
    emergencyLoan: '',
    nbc594: '',
    increment: '',
    sss: '',
    pagibig: '',
    pagibigFundCont: '',
    pagibig2: '',
    multiPurpLoan: '',
    landbankSalaryLoan: '',
    earistCreditCoop: '',
    feu: '',
  });
  const [editRemittance, setEditRemittance] = useState(null);
  const [originalRemittance, setOriginalRemittance] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchRemittances();
  }, []);


  const fetchRemittances = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/Remittance/employee-remittance`,
        getAuthHeaders()
      );
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };


  const resetForm = () => {
    setNewRemittance({
      employeeNumber: '',
      liquidatingCash: '',
      gsisSalaryLoan: '',
      gsisPolicyLoan: '',
      gsisArrears: '',
      cpl: '',
      mpl: '',
      mplLite: '',
      emergencyLoan: '',
      nbc594: '',
      increment: '',
      sss: '',
      pagibig: '',
      pagibigFundCont: '',
      pagibig2: '',
      multiPurpLoan: '',
      landbankSalaryLoan: '',
      earistCreditCoop: '',
      feu: '',
    });
    setSelectedEmployee(null);
    setError('');
  };


  const handleAdd = async () => {
    if (!newRemittance.employeeNumber) {
      setError('Please select an employee');
      return;
    }


    setLoading(true);
    setError('');


    try {
      // Filter out empty fields and convert to numbers
      const filteredRemittance = Object.fromEntries(
        Object.entries(newRemittance).filter(([key, value]) => {
          if (key === 'employeeNumber') return value !== '';
          return value !== '';
        })
      );


      // Convert numeric fields
      Object.keys(filteredRemittance).forEach((key) => {
        if (key !== 'employeeNumber' && filteredRemittance[key] !== '') {
          filteredRemittance[key] = parseFloat(filteredRemittance[key]) || 0;
        }
      });


      await axios.post(
        `${API_BASE_URL}/Remittance/employee-remittance`,
        filteredRemittance,
        getAuthHeaders()
      );


      setTimeout(() => {
        setLoading(false);
        setSuccessAction('adding');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      }, 300);


      resetForm();
      fetchRemittances();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);


      if (err.response?.status === 409) {
        // Handle duplicate employee error specifically
        setError(
          'Employee data already exists. This employee already has a remittance record.'
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error adding remittance record');
      }
    }
  };


  const handleUpdate = async () => {
    if (!editRemittance.employeeNumber) {
      setError('Please select an employee');
      return;
    }


    try {
      // Convert numeric fields
      const updateData = { ...editRemittance };
      Object.keys(updateData).forEach((key) => {
        if (
          key !== 'employeeNumber' &&
          key !== 'id' &&
          key !== 'name' &&
          key !== 'created_at'
        ) {
          updateData[key] = parseFloat(updateData[key]) || 0;
        }
      });


      await axios.put(
        `${API_BASE_URL}/Remittance/employee-remittance/${editRemittance.id}`,
        updateData,
        getAuthHeaders()
      );
      setEditRemittance(null);
      setOriginalRemittance(null);
      setSelectedEditEmployee(null);
      setIsEditing(false);
      setError('');
      fetchRemittances();
      setSuccessAction('edit');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error updating remittance record');
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/Remittance/employee-remittance/${id}`,
        getAuthHeaders()
      );
      setEditRemittance(null);
      setOriginalRemittance(null);
      setSelectedEditEmployee(null);
      setIsEditing(false);
      setError('');
      fetchRemittances();
      setSuccessAction('delete');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error deleting remittance record');
      }
    }
  };


  const handleChange = (field, value) => {
    setNewRemittance({ ...newRemittance, [field]: value });
  };


  const handleEmployeeChange = (employeeNumber) => {
    setNewRemittance({ ...newRemittance, employeeNumber });
    setError('');
  };


  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };


  const handleEditEmployeeChange = (employeeNumber) => {
    setEditRemittance({ ...editRemittance, employeeNumber });
    setError('');
  };


  const handleEditEmployeeSelect = (employee) => {
    setSelectedEditEmployee(employee);
  };


  const handleOpenModal = (remittance) => {
    setEditRemittance({ ...remittance });
    setOriginalRemittance({ ...remittance });
    setSelectedEditEmployee({
      name: remittance.name,
      employeeNumber: remittance.employeeNumber,
    });
    setIsEditing(false);
    setError('');
  };


  const handleStartEdit = () => {
    setIsEditing(true);
  };


  const handleCancelEdit = () => {
    setEditRemittance({ ...originalRemittance });
    setSelectedEditEmployee({
      name: originalRemittance.name,
      employeeNumber: originalRemittance.employeeNumber,
    });
    setIsEditing(false);
    setError('');
  };


  const handleCloseModal = () => {
    setEditRemittance(null);
    setOriginalRemittance(null);
    setSelectedEditEmployee(null);
    setIsEditing(false);
    setError('');
  };


  const fieldLabels = {
    liquidatingCash: 'Liquidating Cash',
    gsisSalaryLoan: 'GSIS Salary Loan',
    gsisPolicyLoan: 'GSIS Policy Loan',
    gsisArrears: 'GSIS Arrears',
    cpl: 'CPL',
    mpl: 'MPL',
    mplLite: 'MPL Lite',
    emergencyLoan: 'Emergency Loan',
    nbc594: 'NBC 594',
    increment: 'Increment',
    sss: 'SSS',
    pagibig: 'Pag-IBIG',
    pagibigFundCont: 'Pag-IBIG Fund Cont.',
    pagibig2: 'Pag-IBIG 2',
    multiPurpLoan: 'Multi-Purpose Loan',
    landbankSalaryLoan: 'Landbank Salary Loan',
    earistCreditCoop: 'EARIST Credit Coop',
    feu: 'FEU',
  };


  return (
    <Container sx={{ mt: 0 }}>
      {/* Loading Overlay */}
      <LoadingOverlay
        open={loading}
        message="Processing remittance record..."
      />


      {/* Success Overlay */}
      <SuccessfullOverlay open={successOpen} action={successAction} />


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        {/* Outer wrapper for header + content */}
        <Box sx={{ width: '75%', maxWidth: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              backgroundColor: '#6D2323',
              color: '#ffffff',
              p: 2,
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              pb: '15px',
            }}
          >
            <Paid sx={{ fontSize: '3rem', mr: 2, mt: '5px', ml: '5px' }} />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Employee Remittance
              </Typography>
              <Typography variant="body2">
                Insert Employee Other Deductions
              </Typography>
            </Box>
          </Box>


          {/* Content/Form */}
          <Container
            sx={{
              backgroundColor: '#fff',
              p: 3,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #6d2323',
              width: '100%',
            }}
          >
            <Grid container spacing={3}>
              {/* Employee Selection */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  Select Employee
                </Typography>
                <EmployeeAutocomplete
                  value={newRemittance.employeeNumber}
                  onChange={handleEmployeeChange}
                  selectedEmployee={selectedEmployee}
                  onEmployeeSelect={handleEmployeeSelect}
                  placeholder="Search and select employee..."
                  required
                  error={!newRemittance.employeeNumber && error}
                />
              </Grid>


              {/* Selected Employee Display */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  Selected Employee
                </Typography>
                {selectedEmployee ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #6D2323',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      gap: 1.5,
                      height: '25px',
                    }}
                  >
                    <PersonIcon sx={{ color: '#6D2323', fontSize: '24px' }} />
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: '#6D2323',
                          fontSize: '14px',
                          lineHeight: 1.2,
                        }}
                      >
                        {selectedEmployee.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#666',
                          fontSize: '12px',
                          lineHeight: 1.2,
                        }}
                      >
                        ID: {selectedEmployee.employeeNumber}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      height: '25px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                        fontStyle: 'italic',
                        fontSize: '14px',
                      }}
                    >
                      No employee selected
                    </Typography>
                  </Box>
                )}
              </Grid>


              {/* Other Fields */}
              {Object.keys(fieldLabels).map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {fieldLabels[field]}
                  </Typography>
                  <TextField
                    type="number"
                    value={newRemittance[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    fullWidth
                    inputProps={{ step: '0.01', min: '0' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#6D2323',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6D2323',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6D2323',
                        },
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>


            {/* Add Button */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}


            <Button
              onClick={handleAdd}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!newRemittance.employeeNumber}
              sx={{
                mt: 2,
                width: '100%',
                backgroundColor: '#6D2323',
                color: '#FEF9E1',
                '&:hover': { backgroundColor: '#5a1d1d' },
                '&:disabled': { backgroundColor: '#ccc' },
              }}
            >
              Add Remittance Record
            </Button>
          </Container>
        </Box>
      </Box>


      {/* Records Section */}
      <Box sx={{ width: '75%', maxWidth: '100%', margin: '20px auto' }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#ffffff',
            color: '#6d2323',
            p: 2,
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            pb: '15px',
            border: '1px solid #6d2323',
            borderBottom: 'none',
          }}
        >
          <ReorderIcon sx={{ fontSize: '3rem', mr: 2, mt: '5px', ml: '5px' }} />
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Remittance Records
            </Typography>
            <Typography variant="body2">
              View and manage remittance information
            </Typography>
          </Box>
        </Box>


        {/* Content */}
        <Container
          sx={{
            backgroundColor: '#fff',
            p: 3,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #6d2323',
            width: '100%',
          }}
        >
          {/* Search Section */}
          <Box sx={{ mb: 3, width: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#6D2323', mb: 1 }}>
              Search Records using Employee Number or Name
            </Typography>


            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              width="100%"
            >
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Employee Number or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  width: '100%',
                  maxWidth: '800px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#6D2323',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6D2323',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6D2323',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: '#6D2323', marginRight: 1 }} />
                  ),
                }}
              />
            </Box>
          </Box>


          {/* Records as Boxes */}
          <Grid container spacing={2}>
            {data
              .filter((remittance) => {
                const name = remittance.name?.toLowerCase() || '';
                const employeeNumber =
                  remittance.employeeNumber?.toString() || '';
                const search = searchTerm.toLowerCase();
                return employeeNumber.includes(search) || name.includes(search);
              })
              .map((remittance) => (
                <Grid item xs={12} sm={6} md={4} key={remittance.id}>
                  <Box
                    onClick={() => handleOpenModal(remittance)}
                    sx={{
                      border: '1px solid #6d2323',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                      transition: '0.2s',
                      '&:hover': { boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' },
                      height: '80%',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}
                    >
                      Employee Number:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: '#6d2323', mb: 1 }}
                    >
                      {remittance.employeeNumber}
                    </Typography>


                    <Chip
                      label={remittance.name || 'No Name'}
                      sx={{
                        backgroundColor: '#6d2323',
                        color: '#fff',
                        borderRadius: '50px',
                        px: 2,
                        fontWeight: 'bold',
                        maxWidth: '100%',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            {data.filter((remittance) => {
              const name = remittance.name?.toLowerCase() || '';
              const employeeNumber =
                remittance.employeeNumber?.toString() || '';
              const search = searchTerm.toLowerCase();
              return employeeNumber.includes(search) || name.includes(search);
            }).length === 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    color: '#6D2323',
                    fontWeight: 'bold',
                    mt: 2,
                  }}
                >
                  No Records Found
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>


        {/* Modal */}
        <Modal
          open={!!editRemittance}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #6d2323',
              borderRadius: 2,
              width: '75%',
              maxWidth: '900px',
              maxHeight: '85vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {editRemittance && (
              <>
                {/* Modal Header */}
                <Box
                  sx={{
                    backgroundColor: '#6D2323',
                    color: '#ffffff',
                    p: 2,
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="h6">
                    {isEditing
                      ? 'Edit Remittance Information'
                      : 'Remittance Information'}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: '#fff' }}>
                    <Close />
                  </IconButton>
                </Box>


                {/* Modal Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Employee Selection in Modal */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        Employee
                      </Typography>
                      <EmployeeAutocomplete
                        value={editRemittance?.employeeNumber || ''}
                        onChange={
                          isEditing ? handleEditEmployeeChange : () => {}
                        } // Only allow changes in edit mode
                        selectedEmployee={selectedEditEmployee}
                        onEmployeeSelect={
                          isEditing ? handleEditEmployeeSelect : () => {}
                        } // Only allow selection in edit mode
                        placeholder="Search and select employee..."
                        required
                        disabled
                        dropdownDisabled
                        error={
                          editRemittance &&
                          !editRemittance.employeeNumber &&
                          error
                        }
                      />
                      {!isEditing && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666',
                            fontStyle: 'italic',
                            display: 'block',
                            mt: 0.5,
                          }}
                        >
                          Contact administrator for assistance.
                        </Typography>
                      )}
                    </Grid>


                    {/* Selected Employee Display in Modal */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        Selected Employee
                      </Typography>
                      {selectedEditEmployee ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #6D2323',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            gap: 1.5,
                            height: '25px',
                          }}
                        >
                          <PersonIcon
                            sx={{ color: '#6D2323', fontSize: '24px' }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'bold',
                                color: '#6D2323',
                                fontSize: '14px',
                                lineHeight: 1.2,
                              }}
                            >
                              {selectedEditEmployee.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#666',
                                fontSize: '12px',
                                lineHeight: 1.2,
                              }}
                            >
                              ID: {selectedEditEmployee.employeeNumber}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            height: '56px',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#999',
                              fontStyle: 'italic',
                              fontSize: '14px',
                            }}
                          >
                            No employee selected
                          </Typography>
                        </Box>
                      )}
                    </Grid>


                    {/* Other Fields */}
                    {Object.keys(fieldLabels).map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          {fieldLabels[field]}
                        </Typography>
                        <TextField
                          type="number"
                          value={editRemittance[field] || ''}
                          onChange={(e) =>
                            setEditRemittance({
                              ...editRemittance,
                              [field]: e.target.value,
                            })
                          }
                          fullWidth
                          disabled={!isEditing}
                          inputProps={{ step: '0.01', min: '0' }}
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000',
                              color: '#000000',
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#6D2323',
                              },
                              '&:hover fieldset': {
                                borderColor: '#6D2323',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#6D2323',
                              },
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}


                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    {!isEditing ? (
                      <>
                        <Button
                          onClick={() => handleDelete(editRemittance.id)}
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          sx={{
                            color: '#ffffff',
                            backgroundColor: 'black',
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={handleStartEdit}
                          variant="contained"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}
                        >
                          Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          sx={{
                            color: '#ffffff',
                            backgroundColor: 'black',
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdate}
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={!editRemittance.employeeNumber}
                          sx={{
                            backgroundColor: '#6D2323',
                            color: '#FEF9E1',
                            '&:disabled': { backgroundColor: '#ccc' },
                          }}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};


export default EmployeeRemittance;



