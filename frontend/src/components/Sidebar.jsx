
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Box,
  Divider,
  Dialog,
  DialogContent,
  CircularProgress,
  
} from '@mui/material';
import {
  House,
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  ExpandMore,
  ExpandLess,
  ChildFriendlyRounded,
  BadgeRounded,
  School,
  Streetview,
  Psychology as PsychologyIcon,
  SportsKabaddi,
  FileCopy,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  Summarize as SummarizeIcon,
  Portrait as PortraitIcon,
  ContactPage as ContactPageIcon,
  Payment as PaymentsIcon,
  EditNote as EditNoteIcon,
  AccountBalance as AccountBalanceIcon,
  LocalHospital as LocalHospitalIcon,
  TableChart as TableChartIcon,
  PeopleAlt as PeopleAltIcon,
  MonetizationOn as MonetizationOnIcon,
  Business as BusinessIcon,
  BusinessCenter as BusinessCenterIcon,
  EventNote as EventNoteIcon,
  AssignmentInd as AssignmentIndIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Devices as DevicesIcon,
  Person as PersonAddIcon,
  AppRegistration,
  EditCalendar,
  RequestQuote,
  AddBusiness,
  ReceiptLong,
  Receipt,
  Info
} from '@mui/icons-material';
import { 
  AccessAlarm, 
  CalendarToday, 
  CheckCircle,  
  EventNote, 
  FolderSpecial, 
  Search,
  WorkHistory,
} from '@mui/icons-material';

import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/logo.PNG";


const drawerWidth = 270;
const collapsedWidth = 60;

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


const Sidebar = ({
  open,
  handleClick,
  open2,
  handleClickAttendance,
  open3,
  handleClickPayroll,
  open4,
  handleClickForms,
  open5,
  handleClickPDSFiles,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const { role: decodedRole, employeeNumber, username } = getUserInfo();

    setUsername(storedUser || '');
    setEmployeeNumber(employeeNumber || '');
    setUsername(username || '');
    setUserRole(decodedRole || '');

    // Fetch profile picture
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const person = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        if (person && person.profile_picture) {
          setProfilePicture(`${API_BASE_URL}${person.profile_picture}`);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    if (employeeNumber) {
      fetchProfilePicture();
    }
  }, [employeeNumber]);

  const handleLogout = () => {
    setLogoutOpen(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.clear();
      window.location.href = "/"; // redirect to login
    }, 1500);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);

    if (item === 'home') {
      if (userRole === 'staff') {
        navigate('/home');
      } else {
        navigate('/admin-home');
      }
    } else if (item === '#') {
      navigate('/');}
  };

  const dynamicDrawerWidth = drawerOpen ? drawerWidth : collapsedWidth;


  return (
      <Drawer
        className="no-print"
        variant="permanent"
        sx={{
          width: dynamicDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: dynamicDrawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 10,
            zIndex: 1200,
          },
        }}
      >
       {/* Sidebar */}
<Box
  onMouseEnter={() => setDrawerOpen(true)} 
  onMouseLeave={() => setDrawerOpen(false)} 
  sx={{
    display: 'flex',
    flexDirection: 'column',
    width: 269, 
    height: '100vh', 
    transition: 'all 0.9s ease', 
    overflowY: "auto",
    "&::-webkit-scrollbar": { width: 8 },
    "&::-webkit-scrollbar-thumb": { bgcolor: "#6d2323", borderRadius: 2 }, 
   
    
    
  }}
>
  <Toolbar
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 2,
      

      
    }}
  >
    {drawerOpen && (
      <Box display="flex" alignItems="center" gap={1}>
      </Box>
    )}
    <IconButton onClick={handleToggleDrawer} size="small">
      {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  </Toolbar>

  <List>
  {userRole !== 'administrator' && (
        <>
        <List component="div" disablePadding sx={{ pl: 2.5,}}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
            <Tooltip title="Go to Profile">
              <Box
                onClick={() => navigate('/profile')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  
                  

                }}
              >
               <Avatar 
                alt={username} 
                src={profilePicture}
                sx={{ 
                  width: 35, 
                  height: 35, 
                  marginLeft: -1, 
                  color: '#000000', 
                  bgcolor: '#ffffff',
                  // border: '2px solid #6d2323'
                }} 
              />

                <Box>
                  <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    marginLeft: '9px',
                    color: 'black'
                  }}>
                    {username}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      marginLeft: '9px',
                      color: 'black'
                    }}
                  >
                    {employeeNumber}
                  </Typography>

                </Box>
              </Box>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{ ml: 5.5, color: "black" }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>

           <Dialog
              open={logoutOpen}
              fullScreen
              PaperProps={{
                sx: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(4px)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                  }}
                >
                  <CircularProgress
                    size={120}
                    thickness={4}
                    sx={{ color: "#6D2323" }}
                  />

                  {/* Beating logo */}
                  <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 60,
                      height: 60,
                      transform: "translate(-50%, -50%)",
                      animation: "beat 1s infinite",
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: "bold", color: "#6D2323" }}
                >
                  Logging out...
                </Typography>
              </Box>
              <Box
                component="style"
                children={`
                  @keyframes beat {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                  }
                `}
              />
            </Dialog>
          </Box>
        </Box>
      </List>  
        </>
      )}

<Divider sx={{ marginTop: '15px', marginBottom: '10px', borderWidth: '1px', marginLeft: '15px' }} />
   
      <ListItem
        button
        selected={selectedItem === 'home'}
        onClick={() => handleItemClick('home')}
        sx={{
          cursor: 'pointer',
          color: selectedItem === 'home' ? 'white' : 'inherit',
          bgcolor: selectedItem === 'home' ? '#A31D1D' : 'inherit',
          '&:hover': {
            bgcolor: '#f0f0f0',
            color: 'black',
            borderTopRightRadius: '15px',
            borderBottomRightRadius: '15px',
            '& .MuiListItemIcon-root': {
              color: 'black',
            }
          },
          borderTopRightRadius: selectedItem === 'home' ? '15px' : 0,
          borderBottomRightRadius: selectedItem === 'home' ? '15px' : 0,
        }}
      >
        <ListItemIcon
          sx={{
            color: selectedItem === 'home' ? 'white' : 'inherit',
            '&:hover': { color: 'black' },
          }}
        >
          <House sx={{ fontSize: 29, marginLeft: '-6%' }} />
        </ListItemIcon>
        <ListItemText
          primary="Home"
          sx={{ marginLeft: '-10px' }}
        />
      </ListItem>



            <ListItem
                  button
                  component={Link}
                  to='/attendance-user-state'
                  sx={{
                    color: selectedItem === 'attendance-user-state' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance-user-state' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance-user-state' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance-user-state' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance-user-state')}>
                  <PortraitIcon sx={{ marginRight: '2rem', color: selectedItem === 'attendance-user-state' ?  'white' : 'inherit',
                    '&:hover': { color: 'black'} }}>
                    <CalendarToday />
                  </PortraitIcon>
                  <ListItemText primary="Attendance" sx={{ marginLeft: '-10px' }} />
                </ListItem>


    <ListItem
                  button
                  component={Link}
                  to='/daily_time_record'
                  sx={{
                    color: selectedItem === 'daily_time_record' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'daily_time_record' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('daily_time_record')}>
                  <ListItemIcon sx={{ marginRight: '-0.01rem', color: selectedItem === 'daily_time_record' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText primary="Daily Time Record" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                              
                <ListItem
                  button
                  component={Link}
                  to='/payslip'
                  sx={{
                    color: selectedItem === 'payslip' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'payslip' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'payslip' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'payslip' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('payslip')}>
                  <Receipt sx={{ marginRight: '2rem', color: selectedItem === 'payslip' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <CalendarToday />
                  </Receipt>
                  <ListItemText primary="Payslip" sx={{ marginLeft: '-10px' }} />
                </ListItem>


                {userRole !== 'administrator' && (
          <>

        <ListItem
              button
              onClick={handleClickPDSFiles}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <ListItemIcon>
              <ContactPageIcon  sx={{ color: 'black'}} />
              </ListItemIcon>
              <ListItemText primary="PDS Files" sx={{marginLeft: '-10px'}} />
              <ListItemIcon sx={{ marginLeft: '10rem', color: 'black' }}>
                {open5 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            </ListItem>

            <Collapse in={open5} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 5.4 }}>
          <ListItem 
                  button 
                  component={Link} 
                  to= '/pds1' 
                  sx={{
                    color: selectedItem === 'pds1' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'pds1' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'pds1' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'pds1' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('pds1')} 
                  >
            <ListItemIcon sx={{ marginRight: '-1rem',
               color: selectedItem === 'pds1' ? 'white' : 'inherit',
               '&:hover': { color: 'white' }
             }}>
              <FileCopy />
            </ListItemIcon>
            <ListItemText primary="PDS1" sx={{marginLeft: '-10px'}}/>
          </ListItem>
        </List>
        </Collapse>

        <Collapse in={open5} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 5.4 }}>
          <ListItem 
                  button 
                  component={Link} 
                  to= '/pds2' 
                  sx={{
                    color: selectedItem === 'pds2' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'pds2' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'pds2' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'pds2' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('pds2')} 
                  >
            <ListItemIcon sx={{ marginRight: '-1rem',
              color: selectedItem === 'pds2' ? 'white' : 'inherit',
              '&:hover': { color: 'white' }
             }}>
              <FileCopy />
            </ListItemIcon>
            <ListItemText primary="PDS2" sx={{marginLeft: '-10px'}}/>
          </ListItem>
        </List>
        </Collapse>
        
        <Collapse in={open5} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 5.4 }}>
          <ListItem 
                  button 
                  component={Link} 
                  to= '/pds3' 
                  sx={{
                    color: selectedItem === 'pds3' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'pds3' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'pds3' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'pds3' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('pds3')} 
                  >
            <ListItemIcon sx={{ marginRight: '-1rem',
               color: selectedItem === 'pds3' ? 'white' : 'inherit',
               '&:hover': { color: 'white' }
             }}>
              <FileCopy />
            </ListItemIcon>
            <ListItemText primary="PDS3" sx={{marginLeft: '-10px'}}/>
          </ListItem>
        </List>
        </Collapse>

        <Collapse in={open5} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 5.4 }}>
          <ListItem 
                  button 
                  component={Link} 
                  to= '/pds4' 
                  sx={{
                    color: selectedItem === 'pds4' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'pds4' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'pds4' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'pds4' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('pds4')} 
                  >
            <ListItemIcon sx={{ marginRight: '-1rem',
               color: selectedItem === 'pds4' ? 'white' : 'inherit',
               '&:hover': { color: 'white' }
             }}>
              <FileCopy />
            </ListItemIcon>
            <ListItemText primary="PDS4" sx={{marginLeft: '-10px'}}/>
          </ListItem>
        </List>
        </Collapse>
        </>
        )}

                <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderWidth: '1px', marginLeft: '15px' }} />
               

                

                {userRole !== 'staff' && (
                    <ListItem 
                      button 
                      component={Link} 
                      to='/registration' 
                      sx={{
                        color: selectedItem === 'bulk-register' ? 'white' : 'inherit',
                        bgcolor: selectedItem === 'bulk-register' ? '#A31D1D' : 'inherit',
                        '&:hover': {
                          bgcolor: '#f0f0f0',
                          color: 'black',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: 'black',
                          }
                        },
                        borderTopRightRadius: selectedItem === 'bulk-register' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'bulk-register' ? '15px' : 0,
                        
                      }}
                      onClick={() => handleItemClick('bulk-register')}
                    >
                    <ListItemIcon sx={{ color: selectedItem === 'bulk-register' ? 'white' : 'inherit',
                                        '&:hover': { color: 'black' }
                                      }}>
                        <AppRegistration sx={{ fontSize: 29, marginLeft: '-6%' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Registration" 
                        sx={{ marginLeft: '-10px' }} 
                      />
                    </ListItem>
                      )}


                {userRole !== 'staff' && (
                  <>
                    <ListItem
                      button
                      onClick={() => {
                        handleItemClick('Dashboards'); 
                        handleClick();                
                      }}
                      sx={{ color: 'black', cursor: 'pointer',  borderTopRightRadius: selectedItem === 'Dashboards' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'Dashboards' ? '15px' : 0, }}
                        
                    >
                      <ListItemIcon>
                        <DashboardIcon sx={{ color: 'black'}} />
                      </ListItemIcon>
                      <ListItemText primary="Information Management" sx={{marginLeft: '-10px', }} />
                      <ListItemIcon sx={{ marginLeft: '10rem', color: 'black',  }}>
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>
                    </ListItem>


                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 5.4 }}>
                    <ListItem
                        button
                        component={Link}
                        to="/personalinfo"
                        sx={{
                          color: selectedItem === 'personalinfo' ? 'white' : 'inherit',
                          bgcolor: selectedItem === 'personalinfo' ? '#A31D1D' : 'inherit',
                          '&:hover': {
                            bgcolor: '#f0f0f0',
                            color: 'black',
                            borderTopRightRadius: '15px',
                            borderBottomRightRadius: '15px',
                            '& .MuiListItemIcon-root': {
                              color: 'black',
                            },
                          },
                          borderTopRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                          borderBottomRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                        }}
                        onClick={() => handleItemClick('personalinfo')}
                      >
                        <ListItemIcon
                          sx={{
                            marginRight: '-1rem',
                            color: selectedItem === 'personalinfo' ? 'white' : 'inherit',
                            bgcolor: 'transparent',
                          }}
                        >
                          <PortraitIcon />
                        </ListItemIcon>
                        <ListItemText primary="Personal Information" sx={{ marginLeft: '-10px' }} />
                      </ListItem>


                <ListItem
                  button 
                  component={Link} 
                  to= '/children' 
                  sx={{
                    color: selectedItem === 'children' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'children' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                      color: 'black',
                    }

                    },
                    borderTopRightRadius: selectedItem === 'children' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'children' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('children')} 
                >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'children' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <ChildFriendlyRounded />
                  </ListItemIcon>
                  <ListItemText primary="Children Information" sx={{marginLeft: '-10px'}}/>
                </ListItem>


                <ListItem 
                  button 
                  component={Link} 
                  to= '/college' 
                  sx={{
                    color: selectedItem === 'college' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'college' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                      color: 'black',
                    }

                    },
                    borderTopRightRadius: selectedItem === 'college' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'college' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('college')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'college' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="College Information" sx={{marginLeft: '-10px'}} />
                </ListItem>


                <ListItem 
                  button 
                  component={Link} 
                  to= '/graduate' 
                  sx={{
                    color: selectedItem === 'graduate' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'graduate' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                      color: 'black',
                    }

                    },
                    borderTopRightRadius: selectedItem === 'graduate' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'graduate' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('graduate')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'graduate' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="Graduate Studies" sx={{marginLeft: '-10px'}} />
                </ListItem>


                <ListItem 
                  button 
                  component={Link} 
                  to= '/vocational' 
                  sx={{
                    color: selectedItem === 'vocational' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'vocational' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'vocational' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'vocational' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('vocational')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'vocational' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="Vocational" sx={{marginLeft: '-10px'}}/>
                </ListItem>


                <ListItem 
                  button 
                  component={Link} 
                  to= '/learningdev' 
                  sx={{
                    color: selectedItem === 'learningdev' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'learningdev' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'learningdev' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'learningdev' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('learningdev')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'learningdev' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <PsychologyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Learning and Development" sx={{marginLeft: '-10px'}}/>
                </ListItem>


                 <ListItem 
                  button 
                  component={Link} 
                  to= '/eligibility' 
                  sx={{
                    color: selectedItem === 'eligibility' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'eligibility' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'eligibility' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'eligibility' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('eligibility')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'eligibility' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Eligibility" sx={{marginLeft: '-10px'}}/>
                </ListItem>


                <ListItem 
                  button 
                  component={Link} 
                  to= '/voluntarywork' 
                  sx={{
                    color: selectedItem === 'voluntarywork' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'voluntarywork' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'voluntarywork' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'voluntarywork' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('voluntarywork')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'voluntarywork' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <SportsKabaddi />
                  </ListItemIcon>
                  <ListItemText primary="Voluntary Work" sx={{marginLeft: '-10px'}}/>
                </ListItem>

                
                <ListItem 
                  button 
                  component={Link} 
                  to= '/workexperience' 
                  sx={{
                    color: selectedItem === 'workexperience' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'workexperience' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'workexperience' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'workexperience' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('workexperience')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'work-experience' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <Streetview />
                  </ListItemIcon>
                  <ListItemText primary="Work Experience" sx={{marginLeft: '-10px'}}/>
                </ListItem> 

                 <ListItem 
                  button 
                  component={Link} 
                  to= '/other-information' 
                  sx={{
                    color: selectedItem === 'other-information' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'other-information' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'other-information' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'other-information' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('other-information')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'other-information' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <Info />
                  </ListItemIcon>
                  <ListItemText primary="Other Information" sx={{marginLeft: '-10px'}}/>
                </ListItem>

              </List>
            </Collapse>
          </> 
        )}

          {userRole !== 'staff' && (
        <>

        <ListItem
          button
          onClick={() => {
            handleClickAttendance('Records'); 
            handleClickAttendance();                
          }}
          sx={{ color: 'black', cursor: 'pointer',  borderTopRightRadius: selectedItem === 'Records' ? '15px' : 0,
            borderBottomRightRadius: selectedItem === 'Records' ? '15px' : 0, }}
            
        >
          <ListItemIcon>
            <AccessTimeIcon  sx={{ color: 'black'}}/>
          </ListItemIcon>
          <ListItemText primary="Attendance Management" sx={{marginLeft: '-10px'}}/>
          <ListItemIcon sx={{ marginLeft: '10rem', color:'black' }}>
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>


       
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
              <ListItem
                  button
                  component={Link}
                  to='/view_attendance'
                  sx={{
                    color: selectedItem === 'view_attendance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'view_attendance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('view_attendance')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'view_attendance' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <DevicesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Device Record" sx={{ marginLeft: '-10px' }} />
                </ListItem>


                <ListItem
                  button
                  component={Link}
                  to='/attendance_form'
                  sx={{
                    color: selectedItem === 'attendance_form' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_form' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_form')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'attendance_form' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <EventNote />
                  </ListItemIcon>
                  <ListItemText primary="Record State" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                

                <ListItem
                  button
                  component={Link}
                  to='/search_attendance'
                  sx={{
                    color: selectedItem === 'search_attendance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'search_attendance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('search_attendance')}>
                  <EditCalendar sx={{ marginRight: '1rem', color: selectedItem === 'search_attendance' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <Search />
                  </EditCalendar>
                  <ListItemText primary="Attendance Management" sx={{ marginLeft: '-10px' }} />
                </ListItem>


                 
              <ListItem 
                  button 
                  component={Link} 
                  to= '/daily_time_record_faculty' 
                  sx={{
                    color: selectedItem === 'daily_time_record_faculty' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'daily_time_record_faculty' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'daily_time_record_faculty' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'daily_time_record_faculty' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('daily_time_record_faculty')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'daily_time_record_faculty' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Overall Daily Time Record" sx={{marginLeft: '-10px'}}/>
                </ListItem>


            

                <ListItem
                  button
                  component={Link}
                  to='/attendance_module'
                  sx={{
                    color: selectedItem === 'attendance_module' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'attendance_module' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <WorkHistory />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Faculty (Non-teaching)" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>
            
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem
                  button
                  component={Link}
                  to='/attendance_module_faculty'
                  sx={{
                    color: selectedItem === 'attendance_module_faculty' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module_faculty' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module_faculty')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'attendance_module_faculty' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                  <WorkHistory />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Faculty (30hrs)" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem
                  button
                  component={Link}
                  to='/attendance_module_faculty_40hrs'
                  sx={{
                    color: selectedItem === 'attendance_module_faculty_40hrs' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module_faculty_40hrs' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module_faculty_40hrs')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'attendance_module_faculty_40hrs' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                  <WorkHistory />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Faculty (Designated)" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem
                  button
                  component={Link}
                  to='/attendance_summary'
                  sx={{
                    color: selectedItem === 'attendance_summary' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_summary' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_summary')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'attendance_summary' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <FolderSpecial />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Overall Summary" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem
                  button
                  component={Link}
                  to='/official_time'
                  sx={{
                    color: selectedItem === 'official_time' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'official_time' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('official_time')}>
                  <ListItemIcon sx={{ marginRight: '-1rem', color: selectedItem === 'official_time' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <AccessAlarm />
                  </ListItemIcon>
                  <ListItemText primary="Official Time Form" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}



        {userRole !== 'staff' && (
          <>
            <ListItem
              button
              onClick={handleClickPayroll}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <ListItemIcon>
                <AccountBalanceIcon  sx={{ color: 'black'}} />
              </ListItemIcon>
              <ListItemText primary="Payroll Management" sx={{ marginLeft: '-10px' }} />
              <ListItemIcon sx={{ marginLeft: '10rem', color: 'black'
                
               }}>
                {open3 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            </ListItem>

            <Collapse in={open3} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                 <ListItem 
                  button 
                  component={Link} 
                  to= '/payroll-table' 
                  sx={{
                    color: selectedItem === 'payroll-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'payroll-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'payroll-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'payroll-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('payroll-table')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'payroll-table' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                   <EditNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Payroll | Processing" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/payroll-processed' 
                  sx={{
                    color: selectedItem === 'payroll-processed' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'payroll-processed' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'payroll-processed' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'payroll-processed' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('payroll-processed')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'payroll-processed' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <PaymentsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Payroll | Processed" sx={{ marginLeft: '-10px' }} />
                </ListItem>
                
                <ListItem
                  button
                  component={Link}
                  to='/overall-payslip'
                  sx={{
                    color: selectedItem === 'overall-payslip' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'overall-payslip' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'overall-payslip' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'overall-payslip' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('overall-payslip')}>
                  <RequestQuote sx={{ marginRight: '1rem', color: selectedItem === 'overall-payslip' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <CalendarToday />
                  </RequestQuote>
                  <ListItemText primary="Payslip Records" sx={{ marginLeft: '-10px' }} />
                </ListItem>


                <ListItem
                  button
                  component={Link}
                  to='/distribution-payslip'
                  sx={{
                    color: selectedItem === 'distribution-payslip' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'distribution-payslip' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'distribution-payslip' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'distribution-payslip' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('distribution-payslip')}>
                  <ReceiptLong sx={{ marginRight: '1rem', color: selectedItem === 'distribution-payslip' ? 'white' : 'inherit', '&:hover': { color: 'white' } }}>
                    <CalendarToday />
                  </ReceiptLong>
                  <ListItemText primary="Payslip Distribution" sx={{ marginLeft: '-10px' }} />
                </ListItem>
                

                <ListItem
                  button
                  component={Link}
                  to= '/remittance-table'
                  sx={{
                    color: selectedItem === 'remittance-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'remittance-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'remittance-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'remittance-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('remittance-table')}
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'remittance-table' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remittances" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                {/* <ListItem 
                  button 
                  component={Link} 
                  to= '/philhealth-table' 
                  sx={{
                    color: selectedItem === 'philhealth-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'philhealth-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'philhealth-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'philhealth-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('philhealth-table')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'philhealth-table' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <LocalHospitalIcon />
                  </ListItemIcon>
                  <ListItemText primary="PhilHealth" sx={{ marginLeft: '-10px' }} />
                </ListItem> */}



                <ListItem 
                  button 
                  component={Link} 
                  to= '/item-table' 
                  sx={{
                    color: selectedItem === 'item-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'item-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'item-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'item-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('item-table')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'item-table' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }

                   }}>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Item Table" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/salary-grade' 
                  sx={{
                    color: selectedItem === 'salary-grade' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'salary-grade' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'salary-grade' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'salary-grade' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('salary-grade')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'salary-grade' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' } 
                  }}>
                    <MonetizationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Salary Grade | Tranche" sx={{ marginLeft: '-10px' }} />
                </ListItem>

               

                <ListItem 
                  button 
                  component={Link} 
                  to= '/department-table' 
                  sx={{
                    color: selectedItem === 'department-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'department-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'department-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'department-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('department-table')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'department-table' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Department" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/department-assignment' 
                  sx={{
                    color: selectedItem === 'department-assignment' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'department-assignment' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'department-assignment' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'department-assignment' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('department-assignment')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'department-assignment' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <BusinessCenterIcon />
                  </ListItemIcon>
                  <ListItemText primary="Department Assignment" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/leave-table' 
                  sx={{
                    color: selectedItem === 'leave-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'leave-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'leave-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'leave-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('leave-table')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'leave-table' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }

                   }}>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leave" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/leave-assignment' 
                  sx={{
                    color: selectedItem === 'leave-assignment' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'leave-assignment' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'leave-assignment' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'leave-assignment' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('leave-assignment')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'leave-assignment' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leave Assignment" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/leave-request' 
                  sx={{
                    color: selectedItem === 'leave-request' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'leave-request' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'leave-request' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'leave-request' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('leave-request')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'leave-request' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leave Request" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}



        {userRole !== 'staff' && (
          <>
            <ListItem
              button
              onClick={handleClickForms}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <ListItemIcon>
                <AssignmentIcon  sx={{ color: 'black'}} />
              </ListItemIcon>
              <ListItemText primary="Forms" sx={{ marginLeft: '-10px' }} />
              <ListItemIcon sx={{ marginLeft: '10rem', color: 'black' }}>
                {open4 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            </ListItem>

            <Collapse in={open4} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
              <ListItem 
                  button 
                  component={Link} 
                  to= '/assessment-clearance' 
                  sx={{
                    color: selectedItem === 'assessment-clearance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'assessment-clearance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'assessment-clearance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'assessment-clearance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('assessment-clearance')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'assessment-clearance' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assessment Clearance" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/clearance' 
                  sx={{
                    color: selectedItem === 'clearance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'clearance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'clearance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'clearance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('clearance')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'clearance' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Clearance" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/faculty-clearance' 
                  sx={{
                    color: selectedItem === 'faculty-clearance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'faculty-clearance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'faculty-clearance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'faculty-clearance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('faculty-clearance')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'faculty-clearance' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Faculty Clearance" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/hrms-request-forms' 
                  sx={{
                    color: selectedItem === 'hrms-request-forms' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'hrms-request-forms' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'hrms-request-forms' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'hrms-request-forms' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('hrms-request-forms')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'hrms-request-forms' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="HRMS Request Form" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/individual-faculty-loading' 
                  sx={{
                    color: selectedItem === 'individual-faculty-loading' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'individual-faculty-loading' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'individual-faculty-loading' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'individual-faculty-loading' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('individual-faculty-loading')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'individual-faculty-loading' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Individual Faculty Loading" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/in-service-training' 
                  sx={{
                    color: selectedItem === 'in-service-training' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'in-service-training' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'in-service-training' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'in-service-training' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('in-service-training')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'in-service-training' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="In Service Training" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/leave-card' 
                  sx={{
                    color: selectedItem === 'leave-card' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'leave-card' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'leave-card' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'leave-card' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('leave-card')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'leave-card' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }

                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employee's Leave Card" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/locator-slip' 
                  sx={{
                    color: selectedItem === 'locator-slip' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'locator-slip' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'locator-slip' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'locator-slip' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('locator-slip')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'locator-slip' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Locator's Slip" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/permission-to-teach' 
                  sx={{
                    color: selectedItem === 'permission-to-teach' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'permission-to-teach' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'permission-to-teach' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'permission-to-teach' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('permission-to-teach')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'permission-to-teach' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }

                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Permission To Teach" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/request-for-id' 
                  sx={{
                    color: selectedItem === 'request-for-id' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'request-for-id' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'request-for-id' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'request-for-id' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('request-for-id')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'request-for-id' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Request For ID" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/saln-front' 
                  sx={{
                    color: selectedItem === 'saln-front' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'saln-front' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'saln-front' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'saln-front' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('saln-front')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                  color: selectedItem === 'saln-front' ? 'white' : 'inherit',
                  '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="S.A.L.N" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/scholarship-agreement' 
                  sx={{
                    color: selectedItem === 'scholarship-agreement' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'scholarship-agreement' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'scholarship-agreement' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'scholarship-agreement' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('scholarship-agreement')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'scholarship-agreement' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Scholarship Agreement" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/subject' 
                  sx={{
                    color: selectedItem === 'subject' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'subject' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                      '& .MuiListItemIcon-root': {
                        color: 'black',
                      }
                    },
                    borderTopRightRadius: selectedItem === 'subject' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'subject' ? '15px' : 0,
                    marginBottom: '40px',
                  }}
                  onClick={() => handleItemClick('subject')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'subject' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Subject Still to be Taken" sx={{ marginLeft: '-10px' }} />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Box>
  </Drawer>
  );
};



export default Sidebar;