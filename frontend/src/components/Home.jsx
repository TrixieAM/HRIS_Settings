import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Container, Box, Grid, Typography, Avatar, Button, IconButton, Stack, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PaymentsIcon from '@mui/icons-material/Payment';
import DTRImage from '../assets/DTR.png';  
import PDSImage from '../assets/PDS.png';  
import LABORImage from '../assets/laborday.jpg';  

const Home = () => {
 const [currentDate, setCurrentDate] = useState(new Date());
const [username, setUsername] = useState('');
const [employeeNumber, setEmployeeNumber] = useState('');

const monthName = currentDate.toLocaleString('default', { month: 'long' });
const year = currentDate.getFullYear();
const month = currentDate.getMonth(); // 0-based
const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0
const daysInMonth = new Date(year, month + 1, 0).getDate();

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



  
  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'inherit', minHeight: '100vh' }}>
      
      {/* Top Profile Row */}
      <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#700000",
        color: "#fff",
        borderRadius: 2,
        p: 1,
        gap: 1,
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}
    >
      
      {/* Profile Info */}
      <Link to="/personalinfo" style={{ textDecoration: 'none' }}>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          color: "#700000",
          p: 1.5,
          borderRadius: 1,
          cursor: 'pointer'
          
        }}
      >
        <Avatar alt={username} sx={{ width: 50, height: 50, marginLeft: 1, color: '#700000', bgcolor: '#f0f0f0', cursor: 'pointer' }} />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                marginLeft: '10px',
                color: 'black',
                cursor: 'pointer'
              }}
            >
              {username || 'Loading...'}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                marginLeft: '10px',
                color: 'black',
                pr: 8
              }}
            >
              {employeeNumber || 'Loading...'}
            </Typography>
        </Box> 
      </Box>
    </Link>


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
        {/* Date */}
        <Box>
      <Typography fontSize={12}>Date:</Typography>
      <Typography fontWeight="bold">{formattedDate}</Typography>
    </Box>

        {/* Time Tracking */}
        <Box sx={{ display: "flex", gap: 1, color: '#FFFFFF' }}>
          {[
            { label: "TIME IN", value: "00:00:00 AM" },
            { label: "BREAKTIME IN", value: "00:00:00 AM" },
            { label: "BREAKTIME OUT", value: "00:00:00 PM" },
            { label: "TIME OUT", value: "00:00:00 PM" },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#880808",
                p: 1,
                borderRadius: 1,
                textAlign: "center",
                minWidth: 100,
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

      {/* Salary */}
            <Link to="/payslip" style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          backgroundColor: "#fff",
          color: "#700000",
          p: 1,
          borderRadius: 1,
          alignItems: "center",
        }}
      >
        <PaymentsIcon sx={{ fontSize: 48 }} />
        <Box>
          <Box
            sx={{
              backgroundColor: "#700000",
              color: "#fff",
              px: 1,
              borderRadius: 1,
            }}
          >
            <Typography fontSize={12}>NET SALARY: ₱00,000</Typography>
          </Box>
          <Typography fontSize={12}>PAY (1<sup>st</sup>): ₱00,000</Typography>
          <Typography fontSize={12}>PAY (2<sup>nd</sup>): ₱00,000</Typography>
        </Box>
      </Box>
    </Link>

      {/* Notification */}
      <Box sx={{ position: "relative" }}>
        <Badge badgeContent={1} color="error">
          <NotificationsIcon fontSize="large" />
        </Badge>
        <ArrowDropDownIcon fontSize="large"/>
      </Box>
    </Box>

       
    

      {/* Middle Grid */}
      <Grid container spacing={2} sx={{marginLeft: '1px'}}>
 <Stack spacing={2} sx={{ marginTop: '15px', cursor: 'pointer' }}>
  {/* DTR Card */}
  <Link to="/daily_time_record" style={{ textDecoration: 'none' }}>
    <Box sx={{ border: '2px solid #700000', borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
      <Box sx={{ height: 100, overflow: 'hidden' }}>
        <Box
          component="img"
          src={DTRImage}
          alt="DTR"
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            objectPosition: "top",
            filter: "blur(1px)"
          }}
        />
      </Box>
      <Box sx={{ backgroundColor: "#700000", p: 1 }}>
        <Typography sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
          Daily Time Record (DTR)
        </Typography>
      </Box>
    </Box>
  </Link>

  {/* PDS Card */}
  <Link to="/pds1" style={{ textDecoration: 'none' }}>
    <Box sx={{ border: '2px solid #700000', borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
      <Box sx={{ height: 100, overflow: 'hidden' }}>
        <Box
          component="img"
          src={PDSImage}
          alt="PDS"
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            objectPosition: "top",
            filter: "blur(1px)"
          }}
        />
      </Box>
      <Box sx={{ backgroundColor: "#700000", p: 1 }}>
        <Typography sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
          Personal Data Sheet (PDS)
        </Typography>
      </Box>
    </Box>
  </Link>
</Stack>


   {/* Dynamic Calendar */}
<Grid item xs={12} md={4.3}>
  <Box
    sx={{
      border: '2px solid #700000',
      borderRadius: 2,
      p: 0,
      backgroundColor: '#fff',
      height: '289px',
      width: '50vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}
  >
    {/* Month Header with Red BG */}
    <Box sx={{ backgroundColor: '#700000', py: 2 }}>
      <Typography
        textAlign="center"
        fontWeight="bold"
        color="white"
        fontSize="1rem"
      >
        {monthName} {year}
      </Typography>
    </Box>

    {/* Calendar Table */}
    <Box component="table" sx={{ width: '100%', textAlign: 'center', flexGrow: 1 }}>
      <thead>
        <tr style={{ backgroundColor: '#700000', color: 'white' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <th key={d} style={{ padding: 6, fontSize: '0.75rem' }}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(6)].map((_, row) => (
          <tr key={row}>
            {Array.from({ length: 7 }).map((_, col) => {
              const offset = (firstDay === 0 ? 6 : firstDay - 1); // Adjust so Monday starts the week
              const date = row * 7 + col - offset + 1;
              const adjustedMonth = month + 1;
              const formattedDate = `${String(adjustedMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
              const isToday = date === currentDate.getDate();
              const isHoliday = philippineHolidays.includes(formattedDate);

              return (
                <td
                  key={col}
                  style={{
                    backgroundColor: isToday ? '#ffcccb' : '',
                    fontWeight: isToday || isHoliday ? 'bold' : '',
                    color: isHoliday ? '#b00000' : 'inherit',
                  }}
                >
                  {date > 0 && date <= daysInMonth ? date : ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Box>
  </Box>
</Grid>


        {/* Labor Day */}
      <Grid item xs={12} md={3}>
        <Box
          sx={{
            border: '2px solid #700000',
            borderRadius: 2,
            overflow: 'hidden',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            p: 1,
            position: 'relative',
            height: '273px',
            width: '63vh',       // added height here to match calendar
            display: 'flex',       // make it flex column to align text nicely
            flexDirection: 'column',
            justifyContent: 'flex-start', // aligns content top to bottom
          }}
        >
          {/* Previous Button */}
          <Box
            component="button"
            onClick={() => console.log('Previous clicked')}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 20,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              lineHeight: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.6)',
              },
            }}
            aria-label="Previous"
          >
            ‹
          </Box>

          {/* Image */}
          <Box
            component="img"
            src={LABORImage}
            alt="News Carousel"
            sx={{
              border: '2px solid #700000',
              borderRadius: 1,
              width: '99%',
              height: '200px',
              objectFit: 'cover',
              marginBottom: 1,
            }}
          />

          {/* Next Button */}
          <Box
            component="button"
            onClick={() => console.log('Next clicked')}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 25,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              lineHeight: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.6)',
              },
            }}
            aria-label="Next"
          >
            ›
          </Box>

          <Typography fontWeight="bold" fontSize="x-large" sx={{ mt: 1 }}>
            Labor Day
          </Typography>
          <Typography fontSize="small">
            May 1, 2025
          </Typography>
        </Box>
      </Grid>
    </Grid>

   {/* Bottom Grid */}
<Grid container spacing={1} sx={{ mt: 1 }}>
  {/* Leave Tracker */}
  <Grid item xs={12} md={6.4}>
    <Box sx={{ width: '73.5vh', backgroundColor: '#700000', color: 'white', p: 1.5, borderRadius: 2 }}>
      <Typography fontWeight="bold" fontSize="1.2rem">Leave Tracker</Typography>
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

  {/* Announcements */}
  <Grid item xs={12} md={2}>
    <Box sx={{ width: '59.2vh', ml: '10px', backgroundColor: '#700000', color: 'white', p: 3, borderRadius: 2, mb: 3 }}>
      <Typography fontWeight="bold" fontSize="1.2rem">Announcements</Typography>

      <Box sx={{ backgroundColor: 'white', color: 'black', borderRadius: 1, p: 2, mt: 2 }}>
        <Typography fontWeight="bold">• Labor Day</Typography>
        <Typography fontSize="small">
          May 1, 2025 – In accordance with Proclamation No. 727, it is a Regular Holiday. No classes and office transactions.
        </Typography>
        <Button variant="outlined" size="small" sx={{ mt: 1 }}>See more</Button>
      </Box>

      <Box sx={{ backgroundColor: 'white', color: 'black', borderRadius: 1, p: 2, mt: 2 }}>
        <Typography fontWeight="bold">• Special Holiday</Typography>
        <Typography fontSize="small">
          May 12, 2025 – As per Proclamation No. 878, all classes and office work at EARIST are suspended.
        </Typography>
        <Button variant="outlined" size="small" sx={{ mt: 1 }}>See more</Button>
      </Box>
    </Box>
  </Grid>
</Grid>

    </Container>
  );
};

export default Home;
