import API_BASE_URL from "../../apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Fade,
  Alert,
  LinearProgress,
  alpha,
} from "@mui/material";
import {
  Search,
  Person,
  CalendarToday,
  Today,
  ArrowBackIos,
  ArrowForwardIos,
  Clear,
  SaveAs,
  Refresh,
  Download,
  Info,
  Edit,
} from "@mui/icons-material";

const AttendanceSearch = () => {
  const [personID, setPersonID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Color scheme
  const primaryColor = '#6d2323';
  const creamColor = '#FEF9E1';
  const blackColor = '#000000';
  const whiteColor = '#FFFFFF';

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${year}-${month}-${day}`;

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

  const fetchRecords = async (showLoading = true) => {
    if (!personID || !startDate || !endDate) return;
    
    if (showLoading) setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/api/view-attendance`,
        {
          personID,
          startDate,
          endDate,
        },
        getAuthHeaders()
      );
      setRecords(response.data);
    } catch (err) {
      console.error("Axios error:", err.response ? err.response.data : err);
      setError("Failed to fetch attendance records. Please try again.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const saveAll = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const response = await axios.put(
        `${API_BASE_URL}/attendance/api/view-attendance`,
        { records },
        getAuthHeaders()
      );
      setSuccess(response.data.message || "Records saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleMonthClick = (monthIndex) => {
    const year = new Date().getFullYear();
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));
    const formattedStart = start.toISOString().substring(0, 10);
    const formattedEnd = end.toISOString().substring(0, 10);
    setStartDate(formattedStart);
    setEndDate(formattedEnd);
  };

  const handleClearFilters = () => {
    setPersonID("");
    setStartDate("");
    setEndDate("");
    setRecords([]);
    setError("");
    setSuccess("");
  };

  // Auto-fetch when dates change (for quick select buttons)
  useEffect(() => {
    if (personID && startDate && endDate) {
      fetchRecords(false); // Silent fetch without loading indicator
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ 
      bgcolor: creamColor, 
      minHeight: '100vh', 
      py: 3,
      width: '100%',
      overflow: 'hidden'
    }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', margin: '0 auto', px: 3 }}>
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
                    <Edit sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Attendance Management
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Review and manage attendance records
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Refresh">
                    <IconButton 
                      onClick={() => fetchRecords(true)}
                      disabled={!personID || !startDate || !endDate}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        color: whiteColor,
                        '&:disabled': { 
                          bgcolor: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.3)'
                        }
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
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {/* Controls */}
        <Fade in timeout={700}>
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Employee Number"
                      value={personID}
                      onChange={(e) => setPersonID(e.target.value)}
                      required
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
                      sx={{ minWidth: '250px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
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
                      sx={{ minWidth: '250px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
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
                      sx={{ minWidth: '250px' }}
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
                    Quick Search:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Today />}
                      disabled={!personID}
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
                      disabled={!personID}
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const year = yesterday.getFullYear();
                        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
                        const day = String(yesterday.getDate()).padStart(2, '0');
                        const yesterdayFormatted = `${year}-${month}-${day}`;
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
                      disabled={!personID}
                      onClick={() => {
                        const lastWeek = new Date();
                        lastWeek.setDate(lastWeek.getDate() - 7);
                        const year = lastWeek.getFullYear();
                        const month = String(lastWeek.getMonth() + 1).padStart(2, '0');
                        const day = String(lastWeek.getDate()).padStart(2, '0');
                        const lastWeekFormatted = `${year}-${month}-${day}`;
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
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, bgcolor: alpha(primaryColor, 0.1), '& .MuiLinearProgress-bar': { bgcolor: primaryColor } }} />}

        {error && (
          <Fade in timeout={300}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          </Fade>
        )}

        {success && (
          <Fade in timeout={300}>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Fade>
        )}

        {/* Results */}
        {records.length > 0 && (
          <Fade in={!loading} timeout={500}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3, width: '100%' }}>
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
                    Editable Attendance Records
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Employee #{personID}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Badge 
                    badgeContent={records.length} 
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

              <TableContainer sx={{ borderRadius: 3, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 1000 }}>
                  <TableHead sx={{ bgcolor: alpha(primaryColor, 0.1) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 120 }}>Employee Number</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 100 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 100 }}>Day</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 150 }}>Time IN</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 150 }}>Breaktime IN</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 150 }}>Breaktime OUT</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: blackColor, minWidth: 150 }}>Time OUT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          '&:nth-of-type(even)': { bgcolor: alpha(creamColor, 0.3) },
                          '&:hover': { bgcolor: alpha(primaryColor, 0.05) },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500, color: blackColor }}>{record.personID}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: blackColor }}>{record.date}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: blackColor }}>{record.Day}</TableCell>
                        <TableCell>
                          <TextField
                            value={record.timeIN || ""}
                            onChange={(e) => handleInputChange(index, "timeIN", e.target.value)}
                            size="small"
                            sx={{
                              width: '140px',
                              '& .MuiOutlinedInput-root': {
                                bgcolor: whiteColor,
                                '&:hover': {
                                  bgcolor: alpha(creamColor, 0.5)
                                },
                                '&.Mui-focused': {
                                  bgcolor: whiteColor
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={record.breaktimeIN || ""}
                            onChange={(e) => handleInputChange(index, "breaktimeIN", e.target.value)}
                            size="small"
                            sx={{
                              width: '140px',
                              '& .MuiOutlinedInput-root': {
                                bgcolor: whiteColor,
                                '&:hover': {
                                  bgcolor: alpha(creamColor, 0.5)
                                },
                                '&.Mui-focused': {
                                  bgcolor: whiteColor
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={record.breaktimeOUT || ""}
                            onChange={(e) => handleInputChange(index, "breaktimeOUT", e.target.value)}
                            size="small"
                            sx={{
                              width: '140px',
                              '& .MuiOutlinedInput-root': {
                                bgcolor: whiteColor,
                                '&:hover': {
                                  bgcolor: alpha(creamColor, 0.5)
                                },
                                '&.Mui-focused': {
                                  bgcolor: whiteColor
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={record.timeOUT || ""}
                            onChange={(e) => handleInputChange(index, "timeOUT", e.target.value)}
                            size="small"
                            sx={{
                              width: '140px',
                              '& .MuiOutlinedInput-root': {
                                bgcolor: whiteColor,
                                '&:hover': {
                                  bgcolor: alpha(creamColor, 0.5)
                                },
                                '&.Mui-focused': {
                                  bgcolor: whiteColor
                                }
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Fade>
        )}

        {/* Save Button */}
        {records.length > 0 && (
          <Fade in timeout={900}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SaveAs />}
                  onClick={saveAll}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    bgcolor: primaryColor,
                    color: whiteColor,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(primaryColor, 0.8),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(109, 35, 35, 0.3)'
                    },
                    '&:disabled': {
                      bgcolor: alpha(primaryColor, 0.5),
                      color: whiteColor
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Save All Changes
                </Button>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default AttendanceSearch;