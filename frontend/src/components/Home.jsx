import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconButton, Modal, Tooltip, Card, CardContent } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';


import { Container, Box, Grid, Typography, Avatar, Button, Stack, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AccessTime, AccountBalance, Campaign, Description, Download, KeyboardArrowDown, Person } from '@mui/icons-material';


const Home = () => {
 const [currentDate, setCurrentDate] = useState(new Date());
const [username, setUsername] = useState('');
const [employeeNumber, setEmployeeNumber] = useState('');
const [announcements, setAnnouncements] = useState([]);
const [currentSlide, setCurrentSlide] = useState(0);
const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
const [openModal, setOpenModal] = useState(false);
const [profilePicture, setProfilePicture] = useState(null);
const navigate = useNavigate();


const monthName = currentDate.toLocaleString('default', { month: 'long' });
const year = currentDate.getFullYear();
const month = currentDate.getMonth(); // 0-based
const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0
const daysInMonth = new Date(year, month + 1, 0).getDate();


//bago 'to (hanna)


const [notifModalOpen, setNotifModalOpen] = useState(false);




useEffect(() => {
  const interval = setInterval(() => {
    setCurrentDate(new Date());
  }, 1000);


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
  } catch (error) {
    console.error('Error decoding token:', error);
    return {};
  }
};


useEffect(() => {
  const userInfo = getUserInfo();
  if (userInfo.username && userInfo.employeeNumber) {
    setUsername(userInfo.username);
    setEmployeeNumber(userInfo.employeeNumber);
  }
}, []);


useEffect(() => {
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };


  fetchAnnouncements();
}, []);


// Auto-slide effect
useEffect(() => {
  if (announcements.length > 0) {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }
}, [announcements]);


const handlePrevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
};


const handleNextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % announcements.length);
};


 const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });




// Sample Philippine holidays (MM-DD format)
const philippineHolidays = [
  '01-01', // New Year's Day
  '04-09', // Araw ng Kagitingan
  '05-01', // Labor Day
  '06-12', // Independence Day
  '08-21', // Ninoy Aquino Day
  '08-26', // National Heroes Day (variable)
  '11-01', // All Saints' Day
  '11-30', // Bonifacio Day
  '12-25', // Christmas Day
  '12-30'  // Rizal Day
];


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


useEffect(() => {
  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get('http://localhost:5000/personalinfo/person_table');
      const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
      if (match && match.profile_picture) {
        setProfilePicture(match.profile_picture);
      }
    } catch (err) {
      console.error('Error loading profile picture:', err);
    }
  };


  if (employeeNumber) {
    fetchProfilePicture();
  }
}, [employeeNumber]);


 
  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'inherit', minHeight: '110vh', display: 'flex', ml: 2, mt: -5 }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, mr: '520px' }}>
        {/* Top Profile Row */}


        {/*BOX FOR THE THREE COLUMN*/}
        <Box
          sx={{
            minHeight: '200px', // set a fixed or minHeight
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >


        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            border: '1px solid',         // <-- Add this
            borderColor: '#6d2323',
            color: "#fff",
            borderRadius: 2,
            p: 1,
            pt: 2,
            width: '520px',
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: "15px",
            position: "relative"
          }}
        >
          {/* Welcome Back! on the left, Date on the right */}
          <Typography variant="h6" sx={{ color: '#6d2323', ml: 1 }}>
            Welcome Back, <span style={{ fontWeight: 'bolder' }}>{username || 'User'}</span>.
          </Typography>
          <Typography sx={{ color: '#700000', fontSize: '.75rem', fontWeight: 500, mr: 1 }}>
            {formattedDate}
          </Typography>
          {/* Remove Date from here */}
          {/* Date and Time */}
          <Link to="/attendance_form" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                backgroundColor: "#fff",
                color: "#700000",
                p: 1.5,
                borderRadius: 1,
              }}
            >


             
             


              {/* Time Tracking */}
              <Box sx={{ display: "flex", gap: 1, color: '#6d2323' }}>
                {[
                  { label: "TIME IN", value: "00:00:00 AM" },
                  { label: "BREAKTIME IN", value: "00:00:00 AM" },
                  { label: "BREAKTIME OUT", value: "00:00:00 PM" },
                  { label: "TIME OUT", value: "00:00:00 PM" },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: '1px solid #6d2323',
                      p: 1,
                      borderRadius: 1,
                      textAlign: "center",
                      minWidth: 100,
                      minHeight: 75
                    }}
                  >
                    <Typography fontSize={12} fontWeight="bold">
                      {item.label}
                    </Typography>
                    <Typography fontSize={12}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Link>


         


         
        </Box>


          {/*BOX FOR THE PAYSLIP*/}


          <Box
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid",
                    borderColor: "#6d2323",
                    borderRadius: 2,
                    p: 2,
                    marginBottom: '14px',
                    flexWrap: "wrap",
                    minWidth:'250px'


                   
                  }}
                >
                  


                  <Typography sx={{ color: "#6d2323", fontWeight: "bold", mb: 3.5, fontSize: '20px' }}>
                    Payslip
                  </Typography>
                  <Link to="/payslip" style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                   
                    <Box
                      sx={{
                        backgroundColor: "#ffffff",
                        border: "1px solid",
                        borderColor: "#6d2323",
                        borderRadius: 2,
                        p: 2,
                        flex: 1,
                       
                      }}
                    >
                      {/* Inner Box 1 Content */}
                     
                      <AccountBalance sx={{ fontSize: '2rem', color: '#6d2323', mr: 1 }} />
                      <Typography sx={{ color: '#6d2323', fontWeight: 'bold' }}>
                        1st Pay
                      </Typography>
                       
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "#ffffff",
                        border: "1px solid",
                        borderColor: "#6d2323",
                        borderRadius: 2,
                        p: 2,
                        flex: 1,
                       
                      }}
                    >
                      {/* Inner Box 2 Content */}
                      <AccountBalance sx={{ fontSize: '2rem', color: '#6d2323', mr: 1 }} />
                      <Typography sx={{ color: '#6d2323', fontWeight: 'bold' }}>
                        2nd Pay
                      </Typography>
                    </Box>
                   
                  </Box>
                  </Link>
                 
            </Box>


        {/*BOX FOR THE LEAVE*/}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid",
            borderColor: "#6d2323",
            borderRadius: 2,
            p: 2,
            flex: 1,
            marginBottom: '14px',
            minHeight: '140px',
            minWidth: '180px'
            
          }}
        >
           <Typography sx={{ color: "#6d2323", fontWeight: "bold", mb: 3.5, fontSize: '20px' }}>
             Leave
           </Typography>
            <Box
            sx={{
              display: 'flex',
              alignItems: 'center',             // vertical centering
              justifyContent: 'space-between',  // text on the left, icon on the right
              backgroundColor: '#ffffff',
              border: '1px solid #6d2323',
              borderRadius: 2,
              p: 2,
             
              width: '70px'
            }}
          >
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '30px',
            color: '#6d2323',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          <Typography sx={{ color: '#6d2323', fontWeight: 'bold', fontSize: '19px', }}>
            All Leave
          </Typography>
          <KeyboardArrowDown
            sx={{
              fontSize: '2rem',
              color: '#6d2323',
              marginLeft: '2px' // Add some spacing between text and icon
            }}
          />
        </Box>




 
      </Box>


        </Box>




        </Box>


       


       
       


        {/* Middle Grid */}
        <Grid container spacing={2} sx={{marginLeft: '1px'}}>
          {/* Announcement Slideshow */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                border: '1px solid #700000',
                borderRadius: 2,
                overflow: 'hidden',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                p: 3,
                position: 'relative',
                minHeight: '450px',
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
               
                ml: -2,
                mt: -2
              }}
            >
              {announcements.length > 0 && (
                <>
                  {/* Previous Button */}
                  <IconButton
                    onClick={handlePrevSlide}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 10,
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      },
                      zIndex: 2,
                     
                    }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>


                  {/* Image */}
                  <Box
                    component="img"
                    src={`http://localhost:5000${announcements[currentSlide].image}`}
                    alt={announcements[currentSlide].title}
                    sx={{
                      border: '2px solid #700000',
                      borderRadius: 1,
                      width: '99%',
                      height: '450px',
                      objectFit: 'cover',
                      marginBottom: 1,
                    }}
                  />


                  {/* Next Button */}
                  <IconButton
                    onClick={handleNextSlide}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 10,
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      },
                      zIndex: 2,
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>


                  <Typography fontWeight="bold" fontSize="x-large" sx={{ mt: 1 }}>
                    {announcements[currentSlide].title}
                  </Typography>
                  <Typography fontSize="small">
                    {new Date(announcements[currentSlide].date).toLocaleDateString()}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
           {/* Announcements */}
          <Grid item xs={12} md={2}>
            <Box sx={{ minWidth: '300px', height: '550px',backgroundColor: '#ffffff', color: '#6d2323', p: 1.5 , borderRadius: 2, border: '1px solid #6d2323', mt: -2,      overflowY: 'auto' // <-- Vertical scroll only
}}>
              <Typography fontWeight="bolder" fontSize="1.3rem" textAlign="center">Announcements</Typography>


              {announcements.map((announcement) => (
                <Box key={announcement.id} sx={{ backgroundColor: '#ffffff', color: 'black', borderRadius: 1, p: 3, mt: 2, border: '2px solid #6d2323'}}>
                  <Typography fontWeight="bold">• {announcement.title}</Typography>
                  <Typography fontSize="small" sx={{ mb: 1.5 }}>
                    {announcement.about.split('.')[0]}.
                  </Typography>
                 <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    borderColor: '#700000',
                    color: '#700000',
                    '&:hover': {
                      borderColor: '#6d2323',
                      color: '#6d2323',
                    },
                  }}
                  onClick={() => handleOpenModal(announcement)}
                >
                  See More
                </Button>


                </Box>
              ))}


              {/* Modal for full announcement details */}
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="announcement-modal"
                aria-describedby="announcement-details"
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
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
                      <Typography variant="h5" component="h2" gutterBottom>
                        {selectedAnnouncement.title}
                      </Typography>
                      <Box
                        component="img"
                        src={`http://localhost:5000${selectedAnnouncement.image}`}
                        alt={selectedAnnouncement.title}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 300,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 2
                        }}
                      />
                      <Typography variant="body1" paragraph>
                        {selectedAnnouncement.about}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posted on: {new Date(selectedAnnouncement.date).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          onClick={handleCloseModal}
                          sx={{
                            mt: 2,
                            backgroundColor: '#700000',
                            '&:hover': {
                              backgroundColor: '#500000'
                            }
                          }}
                        >
                          Close
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Modal>
            </Box>
          </Grid>


         
        </Grid>


        {/* Bottom Grid */}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {/* Leave Tracker */}
          <Grid item xs={12} md={6.4}>
            <Box sx={{ width: '65rem', backgroundColor: '#ffffff', color: '#6d2323', p: 1.5, borderRadius: 2, border: '1px solid #6d2323',  }}>
              <Typography fontWeight="bolder" fontSize="1.5rem">Leave Tracker</Typography>
              <Typography fontSize="small" mb={2}>Check leave status and availability</Typography>


              <Grid container spacing={1}>
                {/* Table Section */}
                <Grid item xs={12} md={7}>
                  <Box sx={{ backgroundColor: 'white', color: 'black', borderRadius: 1, overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ backgroundColor: '#f2f2f2' }}>
                        <tr style={{ fontSize: 'medium'}}>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Leave Type</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Start Date</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>End Date</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ fontSize: 'small'}}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>Annual Leave</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>14-06-2025</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>15-07-2025</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', color: 'orange' }}>Pending</td>
                        </tr>
                        <tr style={{ fontSize: 'small'}}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>Sick Leave</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>21-02-2025</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>22-02-2025</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', color: 'green' }}>Approved</td>
                        </tr>
                        <tr style={{ fontSize: 'small'}}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>Casual Leave</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>31-12-2024</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>02-01-2025</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', color: 'red' }}>Declined</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Grid>


                {/* Leaves Section */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: 1.5, color: 'black' }}>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>Leaves</Typography>


                    <Box
                      sx={{
                        backgroundColor: '#fff5f5',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 1,
                        height: '42px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: 'black',
                        mb: '8px',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, width: '100%' }}>
                        <Typography fontWeight="bold">25 DAYS</Typography>
                        <Typography fontSize="0.75rem" sx={{ mt: 0.5, textAlign: 'center' }}>Available Leaves</Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#700000',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '2px 5px',
                            minWidth: 'unset',
                            mr: '10px'
                          }}
                        >
                          Request
                        </Button>
                      </Box>
                    </Box>


                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                      {[
                        { type: 'Annual', count: 10 },
                        { type: 'Casual', count: 3 },
                        { type: 'Sick', count: 7 },
                        { type: 'Vacation', count: 5 },
                        { type: 'Holiday', count: 5 },
                        { type: 'Study', count: 5 },
                      ].map((leave, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            backgroundColor: '#fff5f5',
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            p: 1,
                            height: '45px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black'
                          }}
                        >
                          <Typography fontSize="1rem" fontWeight="bold">{leave.count}</Typography>
                          <Typography fontSize="0.75rem">{leave.type}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>


         
        </Grid>
      </Box>


      {/* Sidebar */}
      <Box
        sx={{
          width: '300px',
          backgroundColor: '#ffffff',
          color: '#fff',
          border: '2px solid #700000',
          borderRadius: '5px',
          p: 2.5,
          position: 'fixed',
          right: 0,
          bottom: -40,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          zIndex: 1000,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#700000',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#500000',
          }
        }}
      >
        {/* Header - Profile Info */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          pt: 2,
          position: 'sticky',
          top: 30,
          backgroundColor: '#ffffff',
          zIndex: 1
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            position: 'absolute',
            top: 40,
            right: -20,
            gap: 1
          }}>


            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: 'black' }} onClick={() => setNotifModalOpen(true)}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>


            </Tooltip>
            <Tooltip title="More Options">
              <IconButton size="small" sx={{ color: 'black' }}>
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>


          </Box>


          <Tooltip title="Go to Profile">
            <Box
              onClick={() => navigate('/profile')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <Avatar
                alt={username}
                src={profilePicture ? `http://localhost:5000${profilePicture}` : undefined}
                sx={{
                  width: 120,
                  height: 120,
                  color: '#000000',
                  bgcolor: '#ffffff',
                  border: '2px solid #700000',
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'black',
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}>
                {username || 'Loading...'}
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'black',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  borderBottom: '2px solid #700000',
                  pb: 1,
                  width: '80%',
                  mx: 'auto'
                }}
              >
                {employeeNumber || 'Loading...'}
              </Typography>
            </Box>
          </Tooltip>
        </Box>


        {/* Divider */}
        <Box sx={{ borderBottom: '2px solid #700000', mb: 3 }} />


       




<Box
  sx={{
    border: '1px solid #6d2323',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 300, // Optional width control
   
  }}
>
  {/* Header */}
  <Box
    sx={{
      backgroundColor: '#6d2323',
      p: 1,
      textAlign: 'center',
    }}
  >
    <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
      QUICK LINKS
    </Typography>
  </Box>


  {/* Grid of Cards */}
  <Grid container spacing={0} sx={{ p: 1 }}>
    {/* DTR */}
    <Grid item xs={3}>
      <Link to="/daily_time_record" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            m: 0.5,
            p: 1,
            backgroundColor: '#6d2323',
            color: '#fff',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            textAlign: 'center',
          }}
        >
          <AccessTime sx={{ fontSize: 30 }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            View DTR
          </Typography>
        </Box>
      </Link>
    </Grid>


    {/* PDS */}
    <Grid item xs={3}>
      <Link to="/pds1" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            m: 0.5,
            p: 1,
            backgroundColor: '#6d2323',
            color: '#fff',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            textAlign: 'center',
          }}
        >
          <Person sx={{ fontSize: 30 }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            View PDS
          </Typography>
        </Box>
      </Link>
    </Grid>


    {/* Payslip */}
    <Grid item xs={3}>
      <Link to="/payslip" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            m: 0.5,
            p: 1,
            backgroundColor: '#6d2323',
            color: '#fff',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            textAlign: 'center',
          }}
        >
          <Download sx={{ fontSize: 30 }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            Download Payslip
          </Typography>
        </Box>
      </Link>
    </Grid>


    {/* Request Leave */}
    <Grid item xs={3}>
      <Link to="/leave-request" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            m: 0.5,
            p: 1,
            backgroundColor: '#6d2323',
            color: '#fff',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            textAlign: 'center',
          }}
        >
          <Description sx={{ fontSize: 30 }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            Request Leave
          </Typography>
        </Box>
      </Link>
    </Grid>
  </Grid>

</Box>

{/* Admin Panel */}
            <Card sx={{border: "1px solid #6d2323", borderRadius: 2, mt: 1.5}}>
              <Box
    sx={{
      backgroundColor: '#6d2323',
      p: 1,
      textAlign: 'center',
    }}
  >
    <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
      ADMIN PANEL
    </Typography>
  </Box>
              <CardContent>
                <Grid container spacing={1}>
                  {[
                    "Registration",
                    "Announcement",
                    "Leaves",
                    "Payroll",
                    "DTRs",
                    "Audit",
                  ].map((btn, i) => {
                    let link = null;

                    if (btn === "Registration") link = "/registration";
                    if (btn === "Announcement") link = "/announcement";
                    if (btn === "Leaves") link = "/leave-request";
                    if (btn === "Payroll") link = "/payroll-table";
                    if (btn === "DTRs") link = "/daily_time_record_faculty";
                    if (btn === "Audit") link = "/audit-logs";

                     return (
                      <Grid item xs={6} key={i}>
                        {link ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            to={link}
                            sx={{ borderColor: "#6a1b1a", color: "#6a1b1a" }}
                          >
                            {btn}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{ borderColor: "#6a1b1a", color: "#6a1b1a" }}
                          >
                            {btn}
                          </Button>
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>

<Box
  sx={{
    border: '1px solid #6d2323',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 300, // Optional width control
    mt: 1.5,
   
  }}
>


  
  {/* NOTIFICATIONS */}
  <Box
    sx={{
      backgroundColor: '#6d2323',
      p: 1,
      textAlign: 'center',
    }}
  >
    <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
      NOTIFICATIONS
    </Typography>
  </Box>
<Box
    onClick={() => window.location.href = '/home'} // ← change URL here
    sx={{
      border: '1px solid #6d2323',
      borderRadius: 1,
      m: 1,
      p: 1,
      cursor: 'pointer',
      backgroundColor: '#fff3f3',
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#fce8e8',
      }
    }}
  >
    <Typography sx={{ color: '#6d2323', fontWeight: 'bold', fontSize: '0.65rem' }}>
      📢 Important:  Set up your personal information. Click to read more.
    </Typography>
  </Box>
  </Box>
      </Box>








{/*MODAL TO PARA SA NOTIFICATIONS POP UP*/}
      <Modal
  open={notifModalOpen}
  onClose={() => setNotifModalOpen(false)}
  aria-labelledby="notification-modal"
  aria-describedby="notifications-list"
>
  <Box sx={{
    position: 'absolute',
    top: '120px',
    right: '20px',
    width: '290px',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: 2,
    p: 2,
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 1500,
    '@media (max-width: 600px)': {
      width: '90vw',
      right: '5%',
    },
  }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#6d2323' }}>
      Notifications
    </Typography>
   
    {announcements.slice(0, 5).map((item, idx) => (
      <Box
        key={idx}
        sx={{
          mb: 1.5,
          p: 1,
          borderRadius: 1,
          backgroundColor: '#fff3f3',
          border: '1px solid #6d2323',
          cursor: 'pointer',
          transition: '0.2s',
          '&:hover': {
            backgroundColor: '#fce8e8'
          }
        }}
        onClick={() => {
          setSelectedAnnouncement(item);
          setNotifModalOpen(false);
          setOpenModal(true);
        }}
      >
        <Typography fontWeight="bold" fontSize="0.9rem">{item.title}</Typography>
        <Typography fontSize="0.75rem">{new Date(item.date).toLocaleDateString()}</Typography>
      </Box>
    ))}
    {announcements.length === 0 && (
      <Typography fontSize="0.85rem">No notifications at the moment.</Typography>
    )}
  </Box>
</Modal>


    </Container>


   
  );
};


export default Home;



