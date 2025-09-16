// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IconButton,
  Modal,
  Tooltip,
  Container,
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Badge,
} from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  AccessTime,
  AccountBalance,
  Description,
  Download,
  KeyboardArrowDown,
  Person,
  ContactPage,
  Receipt
} from '@mui/icons-material';

const API_BASE = 'http://localhost:5000'; // adjust as needed
const ACCENT = '#8B2635';

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [username, setUsername] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  // payroll
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const navigate = useNavigate();

  // date parts
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // update live clock/date (if you want time)
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) return {};
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return {
        role: decoded.role,
        employeeNumber: decoded.employeeNumber,
        username: decoded.username,
      };
    } catch (err) {
      console.error('Error decoding token:', err);
      return {};
    }
  };

  // read token once on mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo.username) setUsername(userInfo.username);
    if (userInfo.employeeNumber) setEmployeeNumber(userInfo.employeeNumber);
  }, []);

  // fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/announcements`);
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);

  // auto slide when there are announcements
  useEffect(() => {
    if (announcements.length === 0) return;
    const t = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(t);
  }, [announcements]);

  const handlePrevSlide = () => {
    if (announcements.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };
  const handleNextSlide = () => {
    if (announcements.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleOpenModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnnouncement(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // fetch profile picture from person_table
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await axios.get(`${API_BASE}/personalinfo/person_table`);
        const list = Array.isArray(res.data) ? res.data : [];
        const match = list.find((p) => String(p.agencyEmployeeNum) === String(employeeNumber));
        if (match && match.profile_picture) setProfilePicture(match.profile_picture);
      } catch (err) {
        console.error('Error loading profile picture:', err);
      }
    };

    if (employeeNumber) fetchProfilePicture();
  }, [employeeNumber]);

  // fetch payroll for the user
  useEffect(() => {
    const fetchPayrollData = async () => {
      if (!employeeNumber) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/finalized-payroll`);
        const list = Array.isArray(res.data) ? res.data : [];
        const userPayroll = list.find((p) =>
          String(p.employeeNumber) === String(employeeNumber) ||
          String(p.agencyEmployeeNum) === String(employeeNumber)
        );
        setPayrollData(userPayroll || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payroll:', err);
        setError('Failed to fetch payroll data');
        setLoading(false);
      }
    };
    fetchPayrollData();
  }, [employeeNumber]);

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === '' || value === '0') return '₱0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '₱0.00';
    return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // calendar generation (Monday start)
  const generateCalendar = () => {
    const days = [];
    const totalCells = 42;
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    const remaining = totalCells - days.length;
    for (let i = 0; i < remaining; i++) days.push(null);
    return days;
  };
  const calendarDays = generateCalendar();

  // mock leave data (replace with API data if you have)
  const leaveData = [
    { employeeName: 'John Doe', employeeNumber: '#00000000', leaveType: 'Annual Leave', startDate: '14-06-2025', endDate: '15-07-2025', status: 'Pending' },
    { employeeName: 'Anna Smith', employeeNumber: '#00000000', leaveType: 'Sick Leave', startDate: '21-02-2025', endDate: '22-02-2025', status: 'Approved' },
    { employeeName: 'Juan Dela Cruz', employeeNumber: '#00000000', leaveType: 'Casual Leave', startDate: '31-12-2024', endDate: '02-01-2025', status: 'Declined' },
  ];

  return (
      <Box sx={{ p: 1, pl: 10, mt: -5 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Main Content */}
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* Top Row: Welcome / Payslip / Leave Balance */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {/* Welcome Card */}
            <Box sx={{
              backgroundColor: '#fff',
              border: `1px solid ${ACCENT}`,
              borderRadius: 2,
              p: 2,
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ color: '#000', fontWeight: 'bold' }}>
                  Welcome Back, {username || 'Name'}!
                </Typography>
                <Typography sx={{ color: ACCENT, fontSize: '.875rem', fontWeight: 500 }}>
                  {formattedDate}
                </Typography>
              </Box>

              <Link to="/attendance-user-state" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    { label: 'TIME IN', value: '00:00:00 AM', primary: false }, // true = red / false = gray
                    { label: 'BREAKTIME IN', value: '00:00:00 AM', primary: false },
                    { label: 'BREAKTIME OUT', value: '00:00:00 AM', primary: false },
                    { label: 'TIME OUT', value: '00:00:00 AM', primary: false },
                  ].map((item, idx) => (
                    <Box key={idx} sx={{
                      backgroundColor: item.primary ? ACCENT : '#EDEDED',
                      color: item.primary ? '#fff' : '#333',
                      p: 1.5,
                      borderRadius: 1,
                      textAlign: 'center',
                      flex: 1,
                      minHeight: 70,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography fontSize={11} fontWeight="bold" sx={{ mb: 0.5 }}>{item.label}</Typography>
                      <Typography fontSize={13} fontWeight="bold">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Link>
            </Box>

            {/* Payslip */}
            <Box sx={{
              backgroundColor: '#fff',
              color: '#6d2323',
              border: `1px solid ${ACCENT}`,
              borderRadius: 2,
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography sx={{ fontSize: '12px', opacity: 0.9, mb: 0.5 }}>Pay Period: May 15-31, 2025</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '20px', mb: 2 }}>Payslip</Typography>
              </Box>

              <Link to="/payslip" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ backgroundColor: 'rgba(213, 158, 158, 0.34)', borderRadius: 1, p: 1.5, flex: 1, textAlign: 'center' }}>
                    <AccountBalance sx={{ fontSize: '2rem', mb: 0.5, color: '#6d2323' }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6d2323', mb: 0.5 }}>1st Pay</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d2323' }}>{payrollData ? formatCurrency(payrollData.pay1st) : '₱386.00'}</Typography>
                  </Box>
                  <Box sx={{ backgroundColor: 'rgba(213, 158, 158, 0.34)', borderRadius: 1, p: 1.5, flex: 1, textAlign: 'center' }}>
                    <AccountBalance sx={{ fontSize: '2rem', mb: 0.5, color: '#6d2323' }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6d2323', mb: 0.5 }}>2nd Pay</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d2323' }}>{payrollData ? formatCurrency(payrollData.pay2nd) : '₱268.00'}</Typography>
                  </Box>
                </Box>
              </Link>
            </Box>

            {/* Leave Balance */}
            <Box sx={{
              backgroundColor: '#fff',
              color: '#6d2323',
              border: `1px solid ${ACCENT}`,
              borderRadius: 2,
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography sx={{ fontSize: '12px', opacity: 0.9, mb: 0.5 }}>As of May 15, 2025</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '20px', mb: 2 }}>Leave Balance</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ backgroundColor: 'rgba(213, 158, 158, 0.34)', borderRadius: 1, p: 2, width: '100%', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#6d2323', mr: 1 }}>All Leaves</Typography>
                    <KeyboardArrowDown sx={{ fontSize: '1.5rem', color: '#6d2323' }} />
                  </Box>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6d2323' }}>386</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

       {/* Middle Section - Announcement Slideshow */}
        <Grid container spacing={2}>
     {/* slideshow */}
          <Grid item xs={12} md={8}>
            <Box
                sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #8B2635",
                height: "400px",
                mb: -3,
                cursor: "pointer",
                }}
                onClick={() => {
                const announcement = announcements[currentSlide];
                if (announcement) {
                    setSelectedAnnouncement(announcement);
                    setOpenModal(true);
                }
                }}
            >
                {announcements.length > 0 && (
                <>
                    {/* Previous button */}
                    <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrevSlide();
                    }}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 15,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        zIndex: 2,
                    }}
                    >
                    <ArrowBackIosNewIcon />
                    </IconButton>

                    {/* Slide image */}
                    <Box
                    component="img"
                    src={
                        announcements[currentSlide]?.image
                        ? `http://localhost:5000${announcements[currentSlide].image}`
                        : "/api/placeholder/800/400"
                    }
                    alt={announcements[currentSlide]?.title || "Announcement"}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    />

                    {/* Inner shadow overlay */}
                    <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                        "radial-gradient(circle at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)",
                    }}
                    />

                    {/* Next button */}
                    <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNextSlide();
                    }}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: 15,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        zIndex: 2,
                    }}
                    >
                    <ArrowForwardIosIcon />
                    </IconButton>

                    {/* Caption box */}
                    <Box
                    sx={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)",
                    }}
                    >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                        color: "white",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                        }}
                    >
                        {announcements[currentSlide]?.title}
                    </Typography>
                    <Typography
                        fontSize="small"
                        sx={{
                        color: "white",
                        textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                    >
                        {new Date(announcements[currentSlide]?.date).toDateString()}
                    </Typography>
                    </Box>
                </>
                )}
            </Box>

            {/* Modal for full announcement details */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="announcement-modal"
                aria-describedby="announcement-details"
            >
                <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflow: "auto",
                }}
                >
                {selectedAnnouncement && (
                    <>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {selectedAnnouncement.title}
                    </Typography>
                    {selectedAnnouncement.image && (
                        <Box
                        component="img"
                        src={`http://localhost:5000${selectedAnnouncement.image}`}
                        alt={selectedAnnouncement.title}
                        sx={{
                            width: "100%",
                            height: "auto",
                            maxHeight: 300,
                            objectFit: "cover",
                            borderRadius: 1,
                            mb: 2,
                        }}
                        />
                    )}
                    <Typography variant="body1" paragraph>
                        {selectedAnnouncement.about}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Posted on: {new Date(selectedAnnouncement.date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                        variant="contained"
                        onClick={handleCloseModal}
                        sx={{
                            mt: 2,
                            backgroundColor: "#700000",
                            "&:hover": { backgroundColor: "#500000" },
                        }}
                        >
                        Close
                        </Button>
                    </Box>
                    </>
                )}
                </Box>
            </Modal>
            </Grid>


          {/* Right side: Calendar + Announcements */}
          <Grid item xs={12} md={4}>
            {/* Calendar */}
            <Box
              sx={{
                border: "1px solid #6d2323",
                borderRadius: 2,
                mb: 2,
                overflow: "hidden",
              }}
            >
              <Box sx={{ backgroundColor: "#6d2323", p: 1.5, textAlign: "center" }}>
                <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                  May {year}
                </Typography>
              </Box>
              <Box sx={{ p: 1, backgroundColor: "white" }}>
                <Grid container spacing={0}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <Grid item xs={12 / 7} key={day}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          color: "#8B2635",
                        }}
                      >
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={0}>
                  {calendarDays.map((day, index) => (
                    <Grid item xs={12 / 7} key={index}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 0.5,
                          fontSize: "0.8rem",
                          color: day ? "#333" : "transparent",
                        }}
                      >
                        {day || ""}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Announcements list */}
               <Box
                            sx={{
                                border: "1px solid #8B2635",
                                borderRadius: 2,
                                overflow: "hidden",
                                height: "153px",
                            }}
                            >
                            <Box sx={{ backgroundColor: "#fff", p: 1.5, textAlign: "center" }}>
                                <Typography sx={{ color: "#8B2635", fontWeight: "bolder", fontSize: "16px" }}>
                                Announcements
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.5, backgroundColor: "white", height: "calc(100% - 60px)", overflowY: "auto" }}>
                                {announcements.map((a, i) => (
                                <Box 
                                    key={i} 
                                    sx={{ 
                                    mb: 2, 
                                    p: 1.5, 
                                    border: "1px solid #8B2635", 
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#f9f9f9" }
                                    }}
                                    onClick={() => {
                                    setSelectedAnnouncement(a);
                                    setOpenModal(true);
                                    }}
                                >
                                    <Typography
                                    fontSize="0.85rem"
                                    fontWeight="bold"
                                    sx={{ color: "#8B2635", mb: 0.5 }}
                                    >
                                    📢 {a.title}
                                    </Typography>
                                    <Typography fontSize="0.75rem" sx={{ color: "#666", mb: 0.5 }}>
                                    {new Date(a.date).toDateString()}
                                    </Typography>
                                    <Typography fontSize="0.7rem" sx={{ color: "#888" }}>
                                    {a.about && a.about.length > 80 ? `${a.about.substring(0, 80)}...` : a.about}
                                    </Typography>
                                </Box>
                                ))}
                                {announcements.length === 0 && (
                                <Typography sx={{ textAlign: "center", color: "#666", mt: 4 }}>
                                    No announcements available
                                </Typography>
                                )}
                            </Box>
                            </Box>
          </Grid>
        </Grid>
        </Box>

       {/* Right Sidebar */}
<Box
  sx={{
    width: 320,
    backgroundColor: "#ffffff",
    border: "1px solid #8B2635",
    borderRadius: 2,
    p: 1.5,
    height: "fit-content",
    position: "sticky",
    top: 20,
    cursor: "pointer", // shows pointer on hover
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } // optional hover effect
  }}
  onClick={() => {
    // action when sidebar is clicked
    navigate("/profile"); // example: navigate to profile page
  }}
>
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 2, gap: 1 }}>
      <Tooltip title="Notifications">
        <IconButton size="small" sx={{ color: "black" }} onClick={(e) => { e.stopPropagation(); setNotifModalOpen(true); }}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="More Options">
        <IconButton size="small" sx={{ color: "black" }} onClick={(e) => e.stopPropagation()}>
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>

    <Avatar
      alt={username}
      src={profilePicture ? `http://localhost:5000${profilePicture}` : undefined}
      sx={{
        width: 80,
        height: 80,
        border: "3px solid #8B2635",
        mb: 1,
      }}
    />
    <Typography variant="h6" fontWeight="bold" sx={{ color: "black", textAlign: "center" }}>
      {username || "Admin Name"}
    </Typography>
    <Typography variant="body2" sx={{ color: "#666", textAlign: "center" }}>
      {employeeNumber || "#00000000"}
    </Typography>
  </Box>

          {/* Quick Links */}
          <Box sx={{ border: '1px solid #8B2635', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Box
              sx={{
                backgroundColor: '#6d2323',
                p: 1,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                USER PANEL
              </Typography>
            </Box>

            {/* Grid of Cards */}
            <Grid container spacing={0} sx={{ p: 1 }}>
               {/* DTR */}
               <Grid item xs={3}>
                 <Link to="/daily_time_record" style={{ textDecoration: "none" }}>
                   <Box
                     sx={{
                       m: 0.5,
                       p: 1,
                       backgroundColor: "#6d2323",
                       color: "#fff",
                       borderRadius: 1,
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       justifyContent: "center",
                       minHeight: 50,
                       textAlign: "center",
                       transition: "all 0.3s ease",
                       border: "1px solid transparent", // <-- keep border space
                       "&:hover": {
                         backgroundColor: "#fff",
                         color: "#6d2323",
                         borderColor: "#6d2323", // <-- change color only
                       }
                     }}
                   >
                     <AccessTime sx={{ fontSize: 30 }} />
                     <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold" }}>DTR</Typography>
                   </Box>
         
                 </Link>
               </Grid>
         
               {/* PDS */}
               <Grid item xs={3}>
                 <Link to="/pds1" style={{ textDecoration: "none" }}>
                   <Box
                    sx={{
                       m: 0.5,
                       p: 1,
                       backgroundColor: "#6d2323",
                       color: "#fff",
                       borderRadius: 1,
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       justifyContent: "center",
                       minHeight: 50,
                       textAlign: "center",
                       transition: "all 0.3s ease",
                       border: "1px solid transparent", // <-- keep border space
                       "&:hover": {
                         backgroundColor: "#fff",
                         color: "#6d2323",
                         borderColor: "#6d2323", // <-- change color only
                       }
                     }}
                   >
                     <ContactPage sx={{ fontSize: 30 }} />
                     <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold" }}>PDS</Typography>
                   </Box>
                 </Link>
               </Grid>
         
               {/* Payslip */}
               <Grid item xs={3}>
                 <Link to="/payslip" style={{ textDecoration: "none" }}>
                   <Box
                   sx={{
                       m: 0.5,
                       p: 1,
                       backgroundColor: "#6d2323",
                       color: "#fff",
                       borderRadius: 1,
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       justifyContent: "center",
                       minHeight: 50,
                       textAlign: "center",
                       transition: "all 0.3s ease",
                       border: "1px solid transparent", // <-- keep border space
                       "&:hover": {
                         backgroundColor: "#fff",
                         color: "#6d2323",
                         borderColor: "#6d2323", // <-- change color only
                       }
                     }}
                   >
                     <Receipt sx={{ fontSize: 30 }} />
                     <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold" }}>Payslip</Typography>
                   </Box>
                 </Link>
               </Grid>
         
               {/* Request Leave */}
               {/* <Grid item xs={3}>
                 <Link to="/leave-request" style={{ textDecoration: "none" }}>
                   <Box
                     sx={{
                       m: 0.5,
                       p: 1,
                       backgroundColor: "#6d2323",
                       color: "#fff",
                       borderRadius: 1,
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       justifyContent: "center",
                       minHeight: 50,
                       textAlign: "center",
                       transition: "all 0.3s ease",
                       "&:hover": {
                         backgroundColor: "#fff",
                         color: "#6d2323",
                         border: "1px solid #6d2323"
                       }
                     }}
                   >
                     <Description sx={{ fontSize: 20 }} />
                     <Typography sx={{ fontSize: "0.64rem", fontWeight: "bold" }}>
                       Leave Request
                     </Typography>
                   </Box>
                 </Link>
               </Grid> */}
         
               {/* Attendance */}
               <Grid item xs={3}>
                 <Link to="/attendance-user-state" style={{ textDecoration: "none" }}>
                   <Box
                    sx={{
                       m: 0.5,
                       p: 1,
                       backgroundColor: "#6d2323",
                       color: "#fff",
                       borderRadius: 1,
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       justifyContent: "center",
                       minHeight: 50,
                       textAlign: "center",
                       transition: "all 0.3s ease",
                       border: "1px solid transparent", // <-- keep border space
                       "&:hover": {
                         backgroundColor: "#fff",
                         color: "#6d2323",
                         borderColor: "#6d2323", // <-- change color only
                       }
                     }}
                   >
                     <Person sx={{ fontSize: 30 }} />
                     <Typography sx={{ fontSize: "0.64rem", fontWeight: "bold" }}>
                       Attendance
                     </Typography>
                   </Box>
                 </Link>
               </Grid>
             </Grid>
          </Box>


          {/* Recent Activity */}
          <Box sx={{ border: `1px solid ${ACCENT}`, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ backgroundColor: '#6d2323', p: 1.5, textAlign: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>RECENT ACTIVITY</Typography>
            </Box>

            <Box sx={{ p: 1.5, backgroundColor: 'white', maxHeight: 180, overflowY: 'auto' }}>
              <Box sx={{ mb: 1.5, p: 1.5, backgroundColor: '#f8f8f8', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography fontSize="0.8rem" fontWeight="bold" sx={{ color: ACCENT }}>Leave Request Submitted</Typography>
                <Typography fontSize="0.7rem" sx={{ color: '#666' }}>Annual Leave - June 14-15, 2025</Typography>
              </Box>

              <Box sx={{ mb: 1.5, p: 1.5, backgroundColor: '#f8f8f8', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography fontSize="0.8rem" fontWeight="bold" sx={{ color: ACCENT }}>Payslip Generated</Typography>
                <Typography fontSize="0.7rem" sx={{ color: '#666' }}>May 2025 - Available for download</Typography>
              </Box>

              <Box sx={{ mb: 1.5, p: 1.5, backgroundColor: '#f8f8f8', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography fontSize="0.8rem" fontWeight="bold" sx={{ color: ACCENT }}>Profile Updated</Typography>
                <Typography fontSize="0.7rem" sx={{ color: '#666' }}>Personal information updated successfully</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Announcement Modal */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="announcement-modal" aria-describedby="announcement-details">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '80%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {selectedAnnouncement && (
            <>
              <Typography variant="h5" component="h2" gutterBottom>{selectedAnnouncement.title}</Typography>
              {selectedAnnouncement.image && (
                <Box component="img" src={`${API_BASE}${selectedAnnouncement.image}`} alt={selectedAnnouncement.title}
                  sx={{ width: '100%', height: 'auto', maxHeight: 300, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
              )}
              <Typography variant="body1" paragraph>{selectedAnnouncement.about || selectedAnnouncement.description}</Typography>
              <Typography variant="caption" color="text.secondary">Posted on: {selectedAnnouncement.date ? new Date(selectedAnnouncement.date).toLocaleDateString() : ''}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2, backgroundColor: ACCENT, '&:hover': { backgroundColor: '#6d1e29' } }}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Notifications Modal */}
      <Modal open={notifModalOpen} onClose={() => setNotifModalOpen(false)} aria-labelledby="notification-modal" aria-describedby="notifications-list">
        <Box sx={{
          position: 'absolute',
          top: '120px',
          right: '20px',
          width: '320px',
          bgcolor: '#fff',
          boxShadow: 24,
          borderRadius: 2,
          p: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1500,
          border: `2px solid ${ACCENT}`,
          '@media (max-width: 600px)': { width: '90vw', right: '5%' }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: ACCENT }}>Notifications</Typography>

          {announcements.length > 0 ? announcements.slice(0, 10).map((item, idx) => (
            <Box key={idx} sx={{
              mb: 1.5, p: 1.5, borderRadius: 2, backgroundColor: '#f8f8f8', border: `1px solid ${ACCENT}`, cursor: 'pointer',
              transition: '0.15s', '&:hover': { backgroundColor: '#f0f0f0' }
            }} onClick={() => { setSelectedAnnouncement(item); setNotifModalOpen(false); setOpenModal(true); }}>
              <Typography fontWeight="bold" fontSize="0.9rem" sx={{ color: ACCENT }}>{item.title}</Typography>
              <Typography fontSize="0.75rem" sx={{ color: '#666' }}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Typography>
            </Box>
          )) : (<Typography fontSize="0.85rem">No notifications at the moment.</Typography>)}
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
