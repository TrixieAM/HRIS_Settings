import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Settings,
  Paid,
  Domain,
  Label,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';

const SetupDashboard = () => {
  const navigate = useNavigate();
  const [setupStatus, setSetupStatus] = useState({
    remittances: { count: 0, status: 'loading', progress: 0 },
    departments: { count: 0, status: 'loading', progress: 0 },
    items: { count: 0, status: 'loading', progress: 0 },
  });
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const checkSetupStatus = async () => {
    try {
      // Set loading state
      setSetupStatus({
        remittances: { count: 0, status: 'loading', progress: 0 },
        departments: { count: 0, status: 'loading', progress: 0 },
        items: { count: 0, status: 'loading', progress: 0 },
      });

      // Fetch all three tables concurrently
      const [remittancesRes, departmentsRes, itemsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/Remittance/employee-remittance`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/department-assignment`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/item-table`, getAuthHeaders()),
      ]);

      // Gather unique employeeNumbers across all tables
      const UsersList = Array.from(
        new Set([
          ...remittancesRes.data.map(r => r.employeeNumber),
          ...departmentsRes.data.map(d => d.employeeNumber),
          ...itemsRes.data.map(i => i.employeeNumber),
        ])
      );

      const total = UsersList.length;
      setTotalEmployees(total); // store total employees

      // Count how many employees have records in each table
      let remittanceCount = 0;
      let departmentsCount = 0;
      let itemsCount = 0;

      UsersList.forEach(empNum => {
        if (remittancesRes.data.find(r => r.employeeNumber === empNum)) remittanceCount++;
        if (departmentsRes.data.find(d => d.employeeNumber === empNum)) departmentsCount++;
        if (itemsRes.data.find(i => i.employeeNumber === empNum)) itemsCount++;
      });

      // Calculate progress per table
      const remittanceProgress = total ? (remittanceCount / total) * 100 : 0;
      const departmentsProgress = total ? (departmentsCount / total) * 100 : 0;
      const itemsProgress = total ? (itemsCount / total) * 100 : 0;

      setSetupStatus({
        remittances: {
          count: remittanceCount,
          status: remittanceProgress === 100 ? 'complete' : remittanceProgress > 0 ? 'partial' : 'empty',
          progress: remittanceProgress,
        },
        departments: {
          count: departmentsCount,
          status: departmentsProgress === 100 ? 'complete' : departmentsProgress > 0 ? 'partial' : 'empty',
          progress: departmentsProgress,
        },
        items: {
          count: itemsCount,
          status: itemsProgress === 100 ? 'complete' : itemsProgress > 0 ? 'partial' : 'empty',
          progress: itemsProgress,
        },
      });

      // Overall progress: average of the three tables
      setOverallProgress(Math.round((remittanceProgress + departmentsProgress + itemsProgress) / 3));
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupStatus({
        remittances: { count: 0, status: 'error', progress: 0 },
        departments: { count: 0, status: 'error', progress: 0 },
        items: { count: 0, status: 'error', progress: 0 },
      });
      setOverallProgress(0);
      setTotalEmployees(0);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />;
      case 'partial':
        return <Warning sx={{ fontSize: 40, color: '#ffb300' }} />;
      case 'empty':
        return <Warning sx={{ fontSize: 40, color: '#ff9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      default:
        return <Settings sx={{ fontSize: 40, color: '#6d2323' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return '#4caf50';
      case 'partial':
        return '#ffb300';
      case 'empty':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#6d2323';
    }
  };

  const getStatusText = (status, count, total) => {
    switch (status) {
      case 'complete':
        return `All ${count} employees configured`;
      case 'partial':
        return `${count} of ${total} employees configured`;
      case 'empty':
        return 'No employees configured yet';
      case 'error':
        return 'Error loading data';
      default:
        return 'Checking...';
    }
  };

  const tables = [
    {
      id: 'remittances',
      title: 'Employee Remittances',
      description: 'Configure employee deductions and remittance settings',
      icon: <Paid sx={{ fontSize: 48, color: '#6d2323' }} />,
      route: '/employee-remittance',
      ...setupStatus.remittances,
    },
    {
      id: 'departments',
      title: 'Department Assignment',
      description: 'Set up departments and assign employees',
      icon: <Domain sx={{ fontSize: 48, color: '#6d2323' }} />,
      route: '/department-assignment',
      ...setupStatus.departments,
    },
    {
      id: 'items',
      title: 'Item Table',
      description: 'Define item configurations and salary grades',
      icon: <Label sx={{ fontSize: 48, color: '#6d2323' }} />,
      route: '/item-table',
      ...setupStatus.items,
    },
  ];

  const isSetupComplete = overallProgress === 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
     {/* Header */}
<Box sx={{ mb: 4 }}>
  <Typography variant="h4" sx={{ color: '#6d2323', fontWeight: 'bold', mb: 1 }}>
    System Setup Dashboard
  </Typography>
  <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
    Configure essential tables for all employees before registering users
  </Typography>

  {/* Total Employees Highlight */}
  <Typography
    variant="h5"
    sx={{
      color: '#6d2323',
      fontWeight: 'bold',
      mb: 3,
      backgroundColor: '#fff0e0',
      display: 'inline-block',
      px: 2,
      py: 1,
      borderRadius: 1,
    }}
  >
    Total Employees: {totalEmployees}
  </Typography>


        {/* Overall Progress */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            border: '2px solid #6d2323',
            borderRadius: 2,
            backgroundColor: isSetupComplete ? '#f1f8f4' : '#fff8f0',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isSetupComplete ? (
                <CheckCircle sx={{ fontSize: 32, color: '#4caf50' }} />
              ) : (
                <Warning sx={{ fontSize: 32, color: '#ff9800' }} />
              )}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {isSetupComplete ? 'Setup Complete!' : 'Setup In Progress'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {Math.round(overallProgress)}% of employees fully configured
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={checkSetupStatus}
              sx={{
                borderColor: '#6d2323',
                color: '#6d2323',
                '&:hover': {
                  borderColor: '#5a1e1e',
                  backgroundColor: 'rgba(109, 35, 35, 0.04)',
                },
              }}
            >
              Refresh Status
            </Button>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isSetupComplete ? '#4caf50' : '#ff9800',
              },
            }}
          />
        </Paper>
      </Box>

      {/* Alert for incomplete setup */}
      {!isSetupComplete && (
        <Alert severity="warning" sx={{ mb: 4 }} icon={<Warning fontSize="inherit" />}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Action Required</AlertTitle>
          Please configure all three tables for all employees before proceeding with user registration. Click on each card to set up the respective table.
        </Alert>
      )}

      {/* Table Cards */}
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} md={4} key={table.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${getStatusColor(table.status)}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                <Box sx={{ mb: 2 }}>{table.icon}</Box>
                <Box sx={{ mb: 2 }}>{getStatusIcon(table.status)}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#6d2323' }}>
                  {table.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: 40 }}>
                  {table.description}
                </Typography>
                <Chip
                  label={getStatusText(table.status, table.count, totalEmployees)}
                  sx={{
                    backgroundColor: getStatusColor(table.status),
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                />
                <LinearProgress
                  variant="determinate"
                  value={table.progress}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    mt: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { backgroundColor: getStatusColor(table.status) },
                  }}
                />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(table.route)}
                  sx={{
                    backgroundColor: '#6d2323',
                    '&:hover': { backgroundColor: '#5a1e1e' },
                  }}
                >
                  {table.status === 'complete' ? 'View & Edit' : 'Set Up Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {isSetupComplete && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/registration')}
            sx={{ backgroundColor: '#4caf50', px: 4, py: 1.5, '&:hover': { backgroundColor: '#45a049' } }}
          >
            Proceed to User Registration
          </Button>
        )}
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/registration')}
          sx={{
            borderColor: '#6d2323',
            color: '#6d2323',
            px: 4,
            py: 1.5,
            '&:hover': { borderColor: '#5a1e1e', backgroundColor: 'rgba(109, 35, 35, 0.04)' },
          }}
        >
          Registration
        </Button>
      </Box>
    </Container>
  );
};

export default SetupDashboard;
