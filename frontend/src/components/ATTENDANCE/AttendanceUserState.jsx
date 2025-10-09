import API_BASE_URL from '../../apiConfig';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Grid,
  InputAdornment,
  Badge,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Zoom,
  alpha,
} from '@mui/material';
import {
  EventNote,
  CalendarToday,
  Person,
  AccessTime,
  CheckCircle,
  Cancel,
  Info,
  Refresh,
  Download,
  MoreVert,
  Today,
  ArrowBackIos,
  ArrowForwardIos,
  FilterAlt,
  Clear,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';

const AttendanceUserState = () => {
  const loggedInEmployeeNumber = localStorage.getItem('employeeNumber') || '';
  const today = new Date();
  const formattedToday = today.toISOString().substring(0, 10);

  const [personID, setPersonID] = useState(loggedInEmployeeNumber);
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);
  const [records, setRecords] = useState([]);
  const [submittedID, setSubmittedID] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Color scheme
  const primaryColor = '#6d2323';
  const creamColor = '#FEF9E1';
  const blackColor = '#000000';
  const whiteColor = '#FFFFFF';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleMonthClick = (monthIndex) => {
    const year = new Date().getFullYear();
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));
    setStartDate(start.toISOString().substring(0, 10));
    setEndDate(end.toISOString().substring(0, 10));
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMoreClick = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleClearFilters = () => {
    setStartDate(formattedToday);
    setEndDate(formattedToday);
  };

  const fetchRecords = async () => {
    if (!personID || !startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/api/attendance`,
        { personID, startDate, endDate },
        getAuthHeaders()
      );
      setRecords(response.data);
      setSubmittedID(personID);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [personID, startDate, endDate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAttendanceIcon = (state) => {
    switch(state) {
      case 1: return <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />;
      case 2: return <AccessTime sx={{ fontSize: 16, color: '#ff9800' }} />;
      case 3: return <AccessTime sx={{ fontSize: 16, color: '#ff9800' }} />;
      case 4: return <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />;
      default: return <Cancel sx={{ fontSize: 16, color: '#f44336' }} />;
    }
  };

  const getAttendanceColor = (state) => {
    switch(state) {
      case 1: return '#4caf50';
      case 2: return '#ff9800';
      case 3: return '#ff9800';
      case 4: return '#4caf50';
      default: return '#f44336';
    }
  };

  const getAttendanceLabel = (state) => {
    switch(state) {
      case 1: return 'Time IN';
      case 2: return 'Break IN';
      case 3: return 'Break OUT';
      case 4: return 'Time OUT';
      default: return 'Uncategorized';
    }
  };

  const filteredRecords = records
    .sort((a, b) => {
      const dateA = new Date(a.Date + ' ' + a.Time);
      const dateB = new Date(b.Date + ' ' + b.Time);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const filterOpen = Boolean(filterAnchorEl);
  const moreOpen = Boolean(moreAnchorEl);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      bgcolor: creamColor, 
      minHeight: '100vh', 
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                color: whiteColor,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 3, width: 56, height: 56 }}>
                    <EventNote sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Attendance Records
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      View and manage attendance history
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Refresh">
                    <IconButton 
                      onClick={fetchRecords}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        color: whiteColor
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        color: whiteColor
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton 
                      onClick={handleMoreClick}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        color: whiteColor
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={moreAnchorEl}
                    open={moreOpen}
                    onClose={handleMoreClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        '& .MuiMenuItem-root': {
                          '&:hover': {
                            bgcolor: alpha(primaryColor, 0.08)
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem onClick={handleMoreClose}>
                      <ListItemIcon>
                        <Download fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Export as CSV</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleMoreClose}>
                      <ListItemIcon>
                        <FilterAlt fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Advanced Filters</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {/* Controls */}
        <Fade in timeout={700}>
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={personID}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: alpha(creamColor, 0.5),
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: alpha(creamColor, 0.5),
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: alpha(creamColor, 0.5),
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Month Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: blackColor }}>
                  Select Month:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant="contained"
                      size="small"
                      onClick={() => handleMonthClick(index)}
                      sx={{
                        bgcolor: primaryColor,
                        color: whiteColor,
                        minWidth: 70,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: alpha(primaryColor, 0.8),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(109, 35, 35, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {month}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Quick Select */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: blackColor }}>
                  Quick Select:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Today />}
                    onClick={() => {
                      setStartDate(formattedToday);
                      setEndDate(formattedToday);
                    }}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: primaryColor,
                      color: primaryColor,
                      '&:hover': {
                        borderColor: primaryColor,
                        bgcolor: alpha(primaryColor, 0.04)
                      }
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIos />}
                    onClick={() => {
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);
                      const yesterdayFormatted = yesterday.toISOString().substring(0, 10);
                      setStartDate(yesterdayFormatted);
                      setEndDate(yesterdayFormatted);
                    }}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: primaryColor,
                      color: primaryColor,
                      '&:hover': {
                        borderColor: primaryColor,
                        bgcolor: alpha(primaryColor, 0.04)
                      }
                    }}
                  >
                    Yesterday
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowForwardIos />}
                    onClick={() => {
                      const lastWeek = new Date(today);
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      const lastWeekFormatted = lastWeek.toISOString().substring(0, 10);
                      setStartDate(lastWeekFormatted);
                      setEndDate(formattedToday);
                    }}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: primaryColor,
                      color: primaryColor,
                      '&:hover': {
                        borderColor: primaryColor,
                        bgcolor: alpha(primaryColor, 0.04)
                      }
                    }}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    sx={{ 
                      borderRadius: 2,
                      color: primaryColor,
                      '&:hover': {
                        bgcolor: alpha(primaryColor, 0.04)
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, bgcolor: alpha(primaryColor, 0.1), '& .MuiLinearProgress-bar': { bgcolor: primaryColor } }} />}

        {error && (
          <Fade in timeout={300}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Results */}
        {submittedID && (
          <Fade in={!loading} timeout={500}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ 
                p: 3, 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`, 
                color: whiteColor,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    Employee Number
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {submittedID}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Badge 
                    badgeContent={filteredRecords.length} 
                    color="secondary"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: 24, minWidth: 24 } }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Records Found
                    </Typography>
                  </Badge>
                  <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5 }}>
                    {startDate} to {endDate}
                  </Typography>
                </Box>
              </Box>

              <TableContainer sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha(primaryColor, 0.1) }}>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          color: blackColor,
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { bgcolor: alpha(primaryColor, 0.05) }
                        }}
                        onClick={handleSort}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          Date
                          {sortOrder === 'asc' ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Info sx={{ fontSize: 64, color: alpha(primaryColor, 0.3), mb: 2 }} />
                            <Typography variant="h6" color={alpha(blackColor, 0.6)} gutterBottom>
                              No records found
                            </Typography>
                            <Typography variant="body2" color={alpha(blackColor, 0.4)}>
                              Try adjusting your date range
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record, idx) => (
                        <React.Fragment key={idx}>
                          <TableRow 
                            sx={{ 
                              '&:nth-of-type(even)': { bgcolor: alpha(creamColor, 0.3) },
                              '&:hover': { bgcolor: alpha(primaryColor, 0.05) },
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleRowExpand(idx)}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: blackColor }}>
                                {new Date(record.Date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: blackColor }}>
                                {record.Time}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getAttendanceIcon(record.AttendanceState)}
                                label={getAttendanceLabel(record.AttendanceState)}
                                size="small"
                                sx={{
                                  bgcolor: alpha(getAttendanceColor(record.AttendanceState), 0.1),
                                  color: getAttendanceColor(record.AttendanceState),
                                  fontWeight: 600,
                                  '& .MuiChip-icon': {
                                    color: getAttendanceColor(record.AttendanceState)
                                  }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                          {expandedRow === idx && (
                            <TableRow>
                              <TableCell colSpan={3} sx={{ p: 0, bgcolor: alpha(creamColor, 0.5) }}>
                                <Box sx={{ p: 3 }}>
                                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: blackColor }}>
                                    Record Details
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body2" color="text.secondary">
                                        Employee ID
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500, color: blackColor }}>
                                        {record.PersonID}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body2" color="text.secondary">
                                        Date
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500, color: blackColor }}>
                                        {record.Date}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body2" color="text.secondary">
                                        Time
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500, color: blackColor }}>
                                        {record.Time}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body2" color="text.secondary">
                                        Status
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500, color: blackColor }}>
                                        {getAttendanceLabel(record.AttendanceState)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Fade>
        )}

        {/* Scroll to Top Button */}
        <Zoom in={showScrollTop}>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              bgcolor: primaryColor,
              color: whiteColor,
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.8)
              }
            }}
            onClick={scrollToTop}
          >
            <KeyboardArrowUp />
          </Fab>
        </Zoom>
      </Container>
    </Box>
  );
};

export default AttendanceUserState;