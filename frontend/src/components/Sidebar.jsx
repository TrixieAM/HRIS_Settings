import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ListSubheader,
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
  Info,
  TransferWithinAStation,
  NewReleases,
  Lock,
  LockOpen
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
import logo from '../assets/logo.PNG';


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
  onDrawerStateChange,
  systemSettings,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const { role: decodedRole, employeeNumber, username } = getUserInfo();

    setUsername(storedUser || username || '');
    setEmployeeNumber(employeeNumber || '');
    setUserRole(decodedRole || '');

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/personalinfo/person_table`
        );
        const person = response.data.find(
          (p) => p.agencyEmployeeNum === employeeNumber
        );
        if (person) {
          if (person.profile_picture) {
            setProfilePicture(`${API_BASE_URL}${person.profile_picture}`);
          }
          const fullNameFromPerson = `${person.firstName || ''} ${
            person.middleName || ''
          } ${person.lastName || ''} ${person.nameExtension || ''}`.trim();
          if (fullNameFromPerson) {
            setFullName(fullNameFromPerson);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (employeeNumber) {
      fetchProfileData();
    }
  }, [employeeNumber, location.pathname]);

  const currentPath = location.pathname;
  useEffect(() => {
  if (currentPath === '/home' || currentPath === '/admin-home') {
    setSelectedItem('home');
  } else if (currentPath === '/attendance-user-state') {
    setSelectedItem('attendance-user-state');
  } else if (currentPath === '/daily_time_record') {
    setSelectedItem('daily_time_record');
  } else if (currentPath === '/payslip') {
    setSelectedItem('payslip');
  } else if (currentPath === '/pds1') {
    setSelectedItem('pds1');
  } else if (currentPath === '/pds2') {
    setSelectedItem('pds2');
  } else if (currentPath === '/pds3') {
    setSelectedItem('pds3');
  } else if (currentPath === '/pds4') {
    setSelectedItem('pds4');
  } else if (
    currentPath === '/registration' ||
    currentPath === '/bulk-register'
  ) {
    setSelectedItem('bulk-register');
  } else if (currentPath === '/personalinfo') {
    setSelectedItem('personalinfo');
  } else if (currentPath === '/children') {
    setSelectedItem('children');
  } else if (currentPath === '/college') {
    setSelectedItem('college');
  } else if (currentPath === '/graduate') {
    setSelectedItem('graduate');
  } else if (currentPath === '/vocational') {
    setSelectedItem('vocational');
  } else if (currentPath === '/learningdev') {
    setSelectedItem('learningdev');
  } else if (currentPath === '/eligibility') {
    setSelectedItem('eligibility');
  } else if (currentPath === '/voluntarywork') {
    setSelectedItem('voluntarywork');
  } else if (currentPath === '/workexperience') {
    setSelectedItem('workexperience');
  } else if (currentPath === '/other-information') {
    setSelectedItem('other-information');
  } else if (currentPath === '/view_attendance') {
    setSelectedItem('view_attendance');
  } else if (currentPath === '/attendance_form') {
    setSelectedItem('attendance_form');
  } else if (currentPath === '/search_attendance') {
    setSelectedItem('search_attendance');
  } else if (currentPath === '/daily_time_record_faculty') {
    setSelectedItem('daily_time_record_faculty');
  } else if (currentPath === '/attendance_module') {
    setSelectedItem('attendance_module');
  } else if (currentPath === '/attendance_module_faculty') {
    setSelectedItem('attendance_module_faculty');
  } else if (currentPath === '/attendance_module_faculty_40hrs') {
    setSelectedItem('attendance_module_faculty_40hrs');
  } else if (currentPath === '/attendance_summary') {
    setSelectedItem('attendance_summary');
  } else if (currentPath === '/official_time') {
    setSelectedItem('official_time');
  } else if (currentPath === '/payroll-table') {
    setSelectedItem('payroll-table');
  } else if (currentPath === '/payroll-jo') {
    setSelectedItem('payroll-jo');
  } else if (currentPath === '/payroll-processed') {
    setSelectedItem('payroll-processed');
  } else if (currentPath === '/payroll-released') {
    setSelectedItem('payroll-released');
  } else if (currentPath === '/distribution-payslip') {
    setSelectedItem('distribution-payslip');
  } else if (currentPath === '/overall-payslip') {
    setSelectedItem('overall-payslip');
  } else if (currentPath === '/remittance-table') {
    setSelectedItem('remittance-table');
  } else if (currentPath === '/item-table') {
    setSelectedItem('item-table');
  } else if (currentPath === '/salary-grade') {
    setSelectedItem('salary-grade');
  } else if (currentPath === '/department-table') {
    setSelectedItem('department-table');
  } else if (currentPath === '/department-assignment') {
    setSelectedItem('department-assignment');
  } else if (currentPath === '/leave-table') {
    setSelectedItem('leave-table');
  } else if (currentPath === '/leave-assignment') {
    setSelectedItem('leave-assignment');
  } else if (currentPath === '/leave-request') {
    setSelectedItem('leave-request');
  } else if (currentPath === '/assessment-clearance') {
    setSelectedItem('assessment-clearance');
  } else if (currentPath === '/clearance') {
    setSelectedItem('clearance');
  } else if (currentPath === '/faculty-clearance') {
    setSelectedItem('faculty-clearance');
  } else if (currentPath === '/hrms-request-forms') {
    setSelectedItem('hrms-request-forms');
  } else if (currentPath === '/individual-faculty-loading') {
    setSelectedItem('individual-faculty-loading');
  } else if (currentPath === '/in-service-training') {
    setSelectedItem('in-service-training');
  } else if (currentPath === '/leave-card') {
    setSelectedItem('leave-card');
  } else if (currentPath === '/locator-slip') {
    setSelectedItem('locator-slip');
  } else if (currentPath === '/permission-to-teach') {
    setSelectedItem('permission-to-teach');
  } else if (currentPath === '/request-for-id') {
    setSelectedItem('request-for-id');
  } else if (currentPath === '/saln-front') {
    setSelectedItem('saln-front');
  } else if (currentPath === '/scholarship-agreement') {
    setSelectedItem('scholarship-agreement');
  } else if (currentPath === '/subject') {
    setSelectedItem('subject');
  } else if (currentPath === '/profile') {
    setSelectedItem(null);
  } else {
    setSelectedItem(null);
  }
}, [currentPath]);


   const handleDrawerStateChange = (isOpen) => {
    if (!isLocked) { 
      setDrawerOpen(isOpen);
      if (onDrawerStateChange) {
        onDrawerStateChange(isOpen, isLocked);
      }
    }
  };

  const handleToggleLock = (e) => {
    e.stopPropagation();
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    
    if (newLockedState) {
      setDrawerOpen(true);
      if (onDrawerStateChange) {
        onDrawerStateChange(true, true);
      }
    } else {
      if (onDrawerStateChange) {
        onDrawerStateChange(drawerOpen, false);
      }
    }
  };

   const handleSidebarClick = (e) => {
    e.stopPropagation(); 
    setIsLocked(!isLocked);
    const newState = !isLocked || drawerOpen;
    setDrawerOpen(newState);
    if (onDrawerStateChange) {
      onDrawerStateChange(newState);
    }
  };

  const handleLogout = () => {
    setLogoutOpen(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.clear();
      window.location.href = '/'; // login
    }, 1500);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

 const handleItemClick = (item) => {
  setSelectedItem(item);

  const informationManagementItems = [
    'personalinfo', 'children', 'college', 'graduate', 'vocational',
    'learningdev', 'eligibility', 'voluntarywork', 'workexperience', 'other-information'
  ];
  
  const attendanceManagementItems = [
    'view_attendance', 'attendance_form', 'search_attendance', 'daily_time_record_faculty',
    'attendance_module', 'attendance_module_faculty', 'attendance_module_faculty_40hrs',
    'attendance_summary', 'official_time'
  ];
  
  const payrollManagementItems = [
    'payroll-table', 'payroll-processed', 'payroll-released', 'distribution-payslip',
    'overall-payslip', 'remittance-table', 'item-table', 'salary-grade',
    'department-table', 'department-assignment', 'leave-table', 'leave-assignment', 'leave-request'
  ];
  
  const formsItems = [
    'assessment-clearance', 'clearance', 'faculty-clearance', 'hrms-request-forms',
    'individual-faculty-loading', 'in-service-training', 'leave-card', 'locator-slip',
    'permission-to-teach', 'request-for-id', 'saln-front', 'scholarship-agreement', 'subject'
  ];
  
  const pdsItems = ['pds1', 'pds2', 'pds3', 'pds4'];

  if (informationManagementItems.includes(item) && !open) {
    handleClick();
  }
  if (attendanceManagementItems.includes(item) && !open2) {
    handleClickAttendance();
  }
  if (payrollManagementItems.includes(item) && !open3) {
    handleClickPayroll();
  }
  if (formsItems.includes(item) && !open4) {
    handleClickForms();
  }
  if (pdsItems.includes(item) && !open5) {
    handleClickPDSFiles();
  }

  if (item === 'home') {
    if (userRole === 'staff') {
      navigate('/home');
    } else {
      navigate('/admin-home');
    }
  } else if (item === '#') {
    navigate('/');
  }
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
              pt: 2.5,
              backgroundColor: systemSettings?.primaryColor || '#894444ff', 
              overflow: 'hidden'
            },
          }}
        >
        <Box
            onMouseEnter={() => !isLocked && handleDrawerStateChange(true)}
            onMouseLeave={() => !isLocked && handleDrawerStateChange(false)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: dynamicDrawerWidth, 
              minWidth: 270, 
              height: '100vh',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-thumb': { bgcolor: systemSettings?.hoverColor || '#6d2323', borderRadius: 2 },
            }}>
            
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2, 
              minHeight: '48px !important',
              width: dynamicDrawerWidth,
              overflow: 'hidden',
            }}
          >
            {drawerOpen && <Box display="flex" alignItems="center" gap={1}></Box>}
          </Toolbar>  


          <List>
            {userRole !== '' && (
              <>
              <List component="div" disablePadding sx={{ pl: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginRight: 2.5,
                  }}
                >
                  {/* Avatar | Username */}
                  <Tooltip title="Go to Profile">
                    <Box
                     onClick={() => {
                        setSelectedItem(null);
                        navigate("/profile");
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        alt={fullName || username}
                        src={profilePicture}
                        sx={{
                          width: 35,
                          height: 35,
                          marginLeft: -1,
                          color: "#ffffff",
                          bgcolor: "#000000",
                          border: "2px solid " + (systemSettings?.hoverColor || '#6d2323'),
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            marginLeft: "9px",
                            color: systemSettings?.textColor || "#FFFFFF",
                          }}
                        >
                          {fullName || username}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            marginLeft: "9px",
                            color: systemSettings?.textColor || "#FFFFFF",
                          }}
                        >
                          {employeeNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>

                  {/* Lock/Unlock Button */}
                  <Tooltip
                    title={
                      isLocked
                        ? "Click to auto-close sidebar"
                        : "Click to keep sidebar open"
                    }
                  >
                    <IconButton
                      onClick={handleToggleLock}
                      size="small"
                      sx={{
                        color: isLocked ? (systemSettings?.accentColor || "#FEF9E1") : (systemSettings?.textColor || "#FFFFFF"),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {isLocked ? (
                        <Lock fontSize="small" />
                      ) : (
                        <LockOpen fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Logout Dialog */}
                <Dialog
                  open={logoutOpen}
                  fullScreen
                  PaperProps={{
                    sx: { backgroundColor: "transparent", boxShadow: "none" },
                  }}
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0,0,0,0.7)",
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
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background:
                            i % 2 === 0
                              ? "rgba(163,29,29,0.8)"
                              : "rgba(163,29,29,0.8)",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transformOrigin: "-60px 0px",
                          animation: `orbit${i} ${3 + i}s linear infinite`,
                          boxShadow:
                            "0 0 15px rgba(163,29,29,0.5), 0 0 8px rgba(163,29,29,0.8)",
                        }}
                      />
                    ))}

                    <Box sx={{ position: "relative", width: 120, height: 120 }}>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle at 30% 30%, #6d2323, #700000)",
                          boxShadow:
                            "0 0 40px rgba(163,29,29,0.7), 0 0 80px rgba(163,29,29,0.5)",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation:
                            "floatSphere 2s ease-in-out infinite alternate",
                        }}
                      >
                        <Box
                          component="img"
                          src={logo}
                          alt="Logo"
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            boxShadow:
                              "0 0 20px rgba(163,29,29,0.7), 0 0 10px #6d2323",
                            animation: "heartbeat 1s infinite",
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 3,
                        fontWeight: "bold",
                        color: "#FFF8E1",
                        textShadow: "0 0 10px #FEF9E1",
                        animation: "pulse 1.5s infinite",
                      }}
                    >
                      Signing out...
                    </Typography>

                    <Box
                      component="style"
                      children={`
                        @keyframes heartbeat {
                          0%,100% { transform: scale(1); }
                          25%,75% { transform: scale(1.15); }
                          50% { transform: scale(1.05); }
                        }
                        @keyframes pulse {
                          0% { opacity: 1; }
                          50% { opacity: 0.6; }
                          100% { opacity: 1; }
                        }
                        @keyframes floatSphere {
                          0% { transform: translate(-50%, -50%) translateY(0); }
                          50% { transform: translate(-50%, -50%) translateY(-15px); }
                          100% { transform: translate(-50%, -50%) translateY(0); }
                        }
                        @keyframes orbit0 { 0% { transform: rotate(0deg) translateX(60px); } 100% { transform: rotate(360deg) translateX(60px); } }
                        @keyframes orbit1 { 0% { transform: rotate(90deg) translateX(60px); } 100% { transform: rotate(450deg) translateX(60px); } }
                        @keyframes orbit2 { 0% { transform: rotate(180deg) translateX(60px); } 100% { transform: rotate(540deg) translateX(60px); } }
                        @keyframes orbit3 { 0% { transform: rotate(270deg) translateX(60px); } 100% { transform: rotate(630deg) translateX(60px); } }
                      `}
                    />
                  </Box>
                </Dialog>
              </List>

              </>
            )}

            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    bgcolor: "transparent",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    color: systemSettings?.textColor || "#FFFFFF",
                    fontFamily: "Poppins, sans-serif",
                    textTransform: "uppercase",
                    mb: -1
                  }}
                >
                  General
                </ListSubheader>
              }
            > </List>

            {/* HOME */}
            <ListItem
              button
              selected={selectedItem === 'home'}
              onClick={() => handleItemClick('home')}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedItem === 'home' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                color: selectedItem === 'home' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                '& .MuiListItemIcon-root': {
                  color: selectedItem === 'home' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },
                '& .MuiListItemText-primary': {
                  color: selectedItem === 'home' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },

                '&:hover': {
                  bgcolor: systemSettings?.hoverColor || '#6D2323',
                  color: systemSettings?.textColor || '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                  '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                },

                borderTopRightRadius: selectedItem === 'home' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'home' ? '15px' : 0,
              }}
            >
              <ListItemIcon>
                <House sx={{ fontSize: 29, marginLeft: '-6%' }} />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ marginLeft: '-10px' }} />
            </ListItem>



            {/* ATTENDANCE */}
            <ListItem
              button
              component={Link}
              to="/attendance-user-state"
              onClick={() => handleItemClick('attendance-user-state')}
              sx={{
                bgcolor: selectedItem === 'attendance-user-state' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                color: selectedItem === 'attendance-user-state' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                '& .MuiListItemIcon-root': {
                  color: selectedItem === 'attendance-user-state' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },
                '& .MuiListItemText-primary': {
                  color: selectedItem === 'attendance-user-state' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },

                '&:hover': {
                  bgcolor: systemSettings?.hoverColor || '#6D2323',
                  color: systemSettings?.textColor || '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                  '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                },

                borderTopRightRadius: selectedItem === 'attendance-user-state' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'attendance-user-state' ? '15px' : 0,
              }}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Attendance" sx={{ marginLeft: '-10px' }} />
            </ListItem>


            {/* DAILY TIME RECORD */}
            <ListItem
              button
              component={Link}
              to="/daily_time_record"
              onClick={() => handleItemClick('daily_time_record')}
              sx={{
                bgcolor: selectedItem === 'daily_time_record' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                color: selectedItem === 'daily_time_record' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                '& .MuiListItemIcon-root': {
                  color: selectedItem === 'daily_time_record' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },
                '& .MuiListItemText-primary': {
                  color: selectedItem === 'daily_time_record' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },

                '&:hover': {
                  bgcolor: systemSettings?.hoverColor || '#6D2323',
                  color: systemSettings?.textColor || '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                  '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                },

                borderTopRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
              }}
            >
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary="Daily Time Record" sx={{ marginLeft: '-10px' }} />
            </ListItem>


            {/* PAYSLIP */}
            <ListItem
              button
              component={Link}
              to="/payslip"
              onClick={() => handleItemClick('payslip')}
              sx={{
                bgcolor: selectedItem === 'payslip' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                color: selectedItem === 'payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                '& .MuiListItemIcon-root': {
                  color: selectedItem === 'payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },
                '& .MuiListItemText-primary': {
                  color: selectedItem === 'payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },

                '&:hover': {
                  bgcolor: systemSettings?.hoverColor || '#6D2323',
                  color: systemSettings?.textColor || '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                  '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                },

                borderTopRightRadius: selectedItem === 'payslip' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'payslip' ? '15px' : 0,
              }}
            >
              <ListItemIcon>
                <Receipt />
              </ListItemIcon>
              <ListItemText primary="Payslip" sx={{ marginLeft: '-10px' }} />
            </ListItem>


            {userRole !== '' && (
              <>
                {/* <ListItem 
                    button 
                    component={Link} 
                    to= '/leave-request-user' 
                    sx={{
                      color: selectedItem === 'leave-request-user' ? '#000000' : 'inherit',
                      bgcolor: selectedItem === 'leave-request-user' ? '#FEF9E1' : 'inherit',
                      '&:hover': {
                        bgcolor: '#6D2323',
                        color: '#FFFFFF',
                        borderTopRightRadius: '15px',
                        borderBottomRightRadius: '15px',
                        '& .MuiListItemIcon-root': {
                          color: '#FFFFFF',
                        }
                      },
                      borderTopRightRadius: selectedItem === 'leave-request-user' ? '15px' : 0,
                      borderBottomRightRadius: selectedItem === 'leave-request-user' ? '15px' : 0,
                    }}
                    onClick={() => handleItemClick('leave-request-user')} 
                    >
                    <ListItemIcon sx={{ marginRight: '-1rem',
                      color: selectedItem === 'leave-request-user' ? '#000000' : 'inherit',
                      '&:hover': { color: '#000000' }
                    }}>
                      <TransferWithinAStation />
                    </ListItemIcon>
                    <ListItemText primary="Leave Request" sx={{ marginLeft: '5px'}} />
                  </ListItem> */}

                <ListItem
                  button
                  onClick={handleClickPDSFiles}
                  sx={{ 
                    color: systemSettings?.textColor || '#FFFFFF', 
                    cursor: 'pointer' 
                  }}
                >
                  <ListItemIcon>
                    <ContactPageIcon sx={{ color: systemSettings?.textColor || '#FFFFFF' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="PDS Files"
                    sx={{ marginLeft: '-10px' }}
                  />
                  <ListItemIcon sx={{ marginLeft: '10rem', color: systemSettings?.textColor || '#FFFFFF' }}>
                    {open5 ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItem>

              <Collapse in={open5} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 5.4 }}>
                    
                    {/* PDS1 */}
                    <ListItem
                      button
                      component={Link}
                      to="/pds1"
                      onClick={() => handleItemClick('pds1')}
                      sx={{
                        bgcolor: selectedItem === 'pds1' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'pds1' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'pds1' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'pds1' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'pds1' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'pds1' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <FileCopy />
                      </ListItemIcon>
                      <ListItemText primary="PDS1" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* PDS2 */}
                    <ListItem
                      button
                      component={Link}
                      to="/pds2"
                      onClick={() => handleItemClick('pds2')}
                      sx={{
                        bgcolor: selectedItem === 'pds2' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'pds2' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'pds2' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'pds2' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'pds2' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'pds2' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <FileCopy />
                      </ListItemIcon>
                      <ListItemText primary="PDS2" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* PDS3 */}
                    <ListItem
                      button
                      component={Link}
                      to="/pds3"
                      onClick={() => handleItemClick('pds3')}
                      sx={{
                        bgcolor: selectedItem === 'pds3' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'pds3' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'pds3' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'pds3' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'pds3' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'pds3' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <FileCopy />
                      </ListItemIcon>
                      <ListItemText primary="PDS3" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* PDS4 */}
                    <ListItem
                      button
                      component={Link}
                      to="/pds4"
                      onClick={() => handleItemClick('pds4')}
                      sx={{
                        bgcolor: selectedItem === 'pds4' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'pds4' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'pds4' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'pds4' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'pds4' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'pds4' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <FileCopy />
                      </ListItemIcon>
                      <ListItemText primary="PDS4" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                  </List>
                </Collapse>
              </>
            )}

            <>
            {userRole !== 'staff' && (
              <List
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{
                    bgcolor: "transparent",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    color: systemSettings?.textColor || "white",
                    fontFamily: "Poppins, sans-serif",
                    textTransform: "uppercase",
                    mt: -1,
                    mb: -1.5
                    }}
                  >
                  Admin Management
                  </ListSubheader>
                }>  
              </List>
            )}
            </>

            {userRole !== 'staff' && (
            <ListItem
              button
              component={Link}
              to="/registration"
              onClick={() => handleItemClick('bulk-register')}
              sx={{
                bgcolor: selectedItem === 'bulk-register' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                color: selectedItem === 'bulk-register' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                '& .MuiListItemIcon-root': {
                  color: selectedItem === 'bulk-register' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },
                '& .MuiListItemText-primary': {
                  color: selectedItem === 'bulk-register' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                },

                '&:hover': {
                  bgcolor: systemSettings?.hoverColor || '#6D2323',
                  color: systemSettings?.textColor || '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                  '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                },

                borderTopRightRadius: selectedItem === 'bulk-register' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'bulk-register' ? '15px' : 0,
              }}
            >
              <ListItemIcon>
                <AppRegistration sx={{ fontSize: 29, marginLeft: '-6%' }} />
              </ListItemIcon>
              <ListItemText primary="Registration" sx={{ marginLeft: '-10px' }} />
            </ListItem>

            )}

            {/* Rest of the sidebar items continue... */}
            {userRole !== 'staff' && (
              <>
                <ListItem
                  button
                  onClick={() => {
                    handleItemClick('Dashboards');
                    handleClick();
                  }}
                  sx={{
                    color: systemSettings?.textColor || '#FFFFFF',
                    cursor: 'pointer',
                    borderTopRightRadius:
                      selectedItem === 'Dashboards' ? '15px' : 0,
                    borderBottomRightRadius:
                      selectedItem === 'Dashboards' ? '15px' : 0,
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: systemSettings?.textColor || '#FFFFFF' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Information Management"
                    sx={{ marginLeft: '-10px' }}
                  />
                  <ListItemIcon sx={{ marginLeft: '10rem', color: systemSettings?.textColor || '#FFFFFF' }}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 5.4 }}>
                    {/* PERSONAL INFO */}
                    <ListItem
                      button
                      component={Link}
                      to="/personalinfo"
                      onClick={() => handleItemClick('personalinfo')}
                      sx={{
                        bgcolor: selectedItem === 'personalinfo' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'personalinfo' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'personalinfo' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'personalinfo' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <PortraitIcon />
                      </ListItemIcon>
                      <ListItemText primary="Personal Information" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* CHILDREN */}
                    <ListItem
                      button
                      component={Link}
                      to="/children"
                      onClick={() => handleItemClick('children')}
                      sx={{
                        bgcolor: selectedItem === 'children' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'children' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'children' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'children' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'children' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'children' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <ChildFriendlyRounded />
                      </ListItemIcon>
                      <ListItemText primary="Children Information" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* COLLEGE */}
                    <ListItem
                      button
                      component={Link}
                      to="/college"
                      onClick={() => handleItemClick('college')}
                      sx={{
                        bgcolor: selectedItem === 'college' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'college' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'college' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'college' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'college' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'college' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <School />
                      </ListItemIcon>
                      <ListItemText primary="College Information" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* GRADUATE */}
                    <ListItem
                      button
                      component={Link}
                      to="/graduate"
                      onClick={() => handleItemClick('graduate')}
                      sx={{
                        bgcolor: selectedItem === 'graduate' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'graduate' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'graduate' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'graduate' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'graduate' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'graduate' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <School />
                      </ListItemIcon>
                      <ListItemText primary="Graduate Studies" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* VOCATIONAL */}
                    <ListItem
                      button
                      component={Link}
                      to="/vocational"
                      onClick={() => handleItemClick('vocational')}
                      sx={{
                        bgcolor: selectedItem === 'vocational' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'vocational' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'vocational' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'vocational' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'vocational' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'vocational' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <School />
                      </ListItemIcon>
                      <ListItemText primary="Vocational Studies" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                  {/* LEARNING & DEVELOPMENT */}
                    <ListItem
                      button
                      component={Link}
                      to="/learningdev"
                      onClick={() => handleItemClick('learningdev')}
                      sx={{
                        bgcolor: selectedItem === 'learningdev' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'learningdev' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'learningdev' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'learningdev' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'learningdev' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'learningdev' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <PsychologyIcon />
                      </ListItemIcon>
                      <ListItemText primary="Learning and Development" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* ELIGIBILITY */}
                    <ListItem
                      button
                      component={Link}
                      to="/eligibility"
                      onClick={() => handleItemClick('eligibility')}
                      sx={{
                        bgcolor: selectedItem === 'eligibility' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'eligibility' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'eligibility' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'eligibility' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'eligibility' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'eligibility' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <BadgeRounded />
                      </ListItemIcon>
                      <ListItemText primary="Eligibility" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* VOLUNTARY WORK */}
                    <ListItem
                      button
                      component={Link}
                      to="/voluntarywork"
                      onClick={() => handleItemClick('voluntarywork')}
                      sx={{
                        bgcolor: selectedItem === 'voluntarywork' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'voluntarywork' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'voluntarywork' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'voluntarywork' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'voluntarywork' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'voluntarywork' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <SportsKabaddi />
                      </ListItemIcon>
                      <ListItemText primary="Voluntary Work" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* WORK EXPERIENCE */}
                    <ListItem
                      button
                      component={Link}
                      to="/workexperience"
                      onClick={() => handleItemClick('workexperience')}
                      sx={{
                        bgcolor: selectedItem === 'workexperience' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'workexperience' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'workexperience' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'workexperience' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'workexperience' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'workexperience' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <Streetview />
                      </ListItemIcon>
                      <ListItemText primary="Work Experience" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* OTHER INFORMATION */}
                    <ListItem
                      button
                      component={Link}
                      to="/other-information"
                      onClick={() => handleItemClick('other-information')}
                      sx={{
                        bgcolor: selectedItem === 'other-information' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'other-information' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'other-information' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'other-information' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'other-information' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'other-information' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <Info />
                      </ListItemIcon>
                      <ListItemText primary="Other Information" sx={{ marginLeft: '-10px' }} />
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
                  sx={{
                    color: systemSettings?.textColor || '#FFFFFF',
                    cursor: 'pointer',
                    borderTopRightRadius: selectedItem === 'Records' ? '15px' : 0,
                    borderBottomRightRadius:
                      selectedItem === 'Records' ? '15px' : 0,
                  }}
                >
                  <ListItemIcon>
                    <AccessTimeIcon sx={{ color: systemSettings?.textColor || '#FFFFFF' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Attendance Management"
                    sx={{ marginLeft: '-10px' }}
                  />
                  <ListItemIcon sx={{ marginLeft: '10rem', color: systemSettings?.textColor || '#FFFFFF' }}>
                    {open2 ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItem>

                <Collapse in={open2} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 5.4 }}>
                  {/* DEVICE RECORD */}
                    <ListItem
                      button
                      component={Link}
                      to="/view_attendance"
                      onClick={() => handleItemClick('view_attendance')}
                      sx={{
                        bgcolor: selectedItem === 'view_attendance' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'view_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'view_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'view_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <DevicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="Device Record" sx={{ marginLeft: '-10px' }} />
                    </ListItem>


                    {/* ATTENDANCE STATE */}
                    <ListItem
                      button
                      component={Link}
                      to="/attendance_form"
                      onClick={() => handleItemClick('attendance_form')}
                      sx={{
                        bgcolor: selectedItem === 'attendance_form' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'attendance_form' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'attendance_form' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'attendance_form' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <EventNote />
                      </ListItemIcon>
                      <ListItemText primary="Attendance State" sx={{ marginLeft: '-10px' }} />
                    </ListItem>


                    {/* ATTENDANCE MODIFICATION */}
                    <ListItem
                      button
                      component={Link}
                      to="/search_attendance"
                      onClick={() => handleItemClick('search_attendance')}
                      sx={{
                        bgcolor: selectedItem === 'search_attendance' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'search_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'search_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'search_attendance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <EditCalendar />
                      </ListItemIcon>
                      <ListItemText primary="Attendance Modification" sx={{ marginLeft: '-10px' }} />
                    </ListItem>


                    {/* OVERALL DAILY TIME RECORD */}
                    <ListItem
                      button
                      component={Link}
                      to="/daily_time_record_faculty"
                      onClick={() => handleItemClick('daily_time_record_faculty')}
                      sx={{
                        bgcolor: selectedItem === 'daily_time_record_faculty' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        color: selectedItem === 'daily_time_record_faculty' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),

                        '& .MuiListItemIcon-root': {
                          color: selectedItem === 'daily_time_record_faculty' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },
                        '& .MuiListItemText-primary': {
                          color: selectedItem === 'daily_time_record_faculty' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        },

                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                          '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
                        },

                        borderTopRightRadius: selectedItem === 'daily_time_record_faculty' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'daily_time_record_faculty' ? '15px' : 0,
                      }}
                    >
                      <ListItemIcon sx={{ marginRight: '-1rem' }}>
                        <BadgeRounded />
                      </ListItemIcon>
                      <ListItemText primary="Overall Daily Time Record" sx={{ marginLeft: '-10px' }} />
                    </ListItem>


                  {/* Attendance Module (Non-teaching) */}
                    <ListItem
                      button
                      component={Link}
                      to="/attendance_module"
                      sx={{
                        color: selectedItem === 'attendance_module' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'attendance_module' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('attendance_module')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'attendance_module' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <WorkHistory />
                      </ListItemIcon>
                      <ListItemText primary="Attendance Module Faculty (Non-teaching)" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* Attendance Module Faculty (30hrs) */}
                    <ListItem
                      button
                      component={Link}
                      to="/attendance_module_faculty"
                      sx={{
                        color: selectedItem === 'attendance_module_faculty' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'attendance_module_faculty' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('attendance_module_faculty')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'attendance_module_faculty' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <WorkHistory />
                      </ListItemIcon>
                      <ListItemText primary="Attendance Module Faculty (30hrs)" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* Attendance Module Faculty (Designated) */}
                    <ListItem
                      button
                      component={Link}
                      to="/attendance_module_faculty_40hrs"
                      sx={{
                        color: selectedItem === 'attendance_module_faculty_40hrs' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'attendance_module_faculty_40hrs' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('attendance_module_faculty_40hrs')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'attendance_module_faculty_40hrs' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <WorkHistory />
                      </ListItemIcon>
                      <ListItemText primary="Attendance Module Faculty (Designated)" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* Attendance Overall Summary */}
                    <ListItem
                      button
                      component={Link}
                      to="/attendance_summary"
                      sx={{
                        color: selectedItem === 'attendance_summary' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'attendance_summary' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('attendance_summary')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'attendance_summary' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <FolderSpecial />
                      </ListItemIcon>
                      <ListItemText primary="Attendance Overall Summary" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* Official Time Form */}
                    <ListItem
                      button
                      component={Link}
                      to="/official_time"
                      sx={{
                        color: selectedItem === 'official_time' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'official_time' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('official_time')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'official_time' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
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
                  sx={{ 
                    color: systemSettings?.textColor || '#FFFFFF', 
                    cursor: 'pointer' 
                  }}
                >
                  <ListItemIcon>
                    <AccountBalanceIcon sx={{ color: systemSettings?.textColor || '#FFFFFF' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payroll Management"
                    sx={{ marginLeft: '-10px' }}
                  />
                  <ListItemIcon sx={{ marginLeft: '10rem', color: systemSettings?.textColor || '#FFFFFF' }}>
                    {open3 ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItem>

                <Collapse in={open3} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 5.4 }}>
                  <ListItem
                      button
                      component={Link}
                      to="/payroll-table"
                      sx={{
                        color: selectedItem === 'payroll-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'payroll-table' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'payroll-table' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'payroll-table' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('payroll-table')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'payroll-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <EditNoteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payroll REG | Processing" sx={{ marginLeft: '-10px' }} />
                    </ListItem>



                  <ListItem
                      button
                      component={Link}
                      to="/payroll-jo"
                      sx={{
                        color: selectedItem === 'payroll-jo' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'payroll-jo' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'payroll-jo' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'payroll-jo' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('payroll-jo')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'payroll-jo' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <EditNoteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payroll JO | Processing" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/payroll-processed"
                      sx={{
                        color: selectedItem === 'payroll-processed' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'payroll-processed' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'payroll-processed' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'payroll-processed' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('payroll-processed')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'payroll-processed' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <PaymentsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payroll | Processed" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/payroll-released"
                      sx={{
                        color: selectedItem === 'payroll-released' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'payroll-released' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'payroll-released' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'payroll-released' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('payroll-released')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'payroll-released' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <NewReleases />
                      </ListItemIcon>
                      <ListItemText primary="Payroll | Release" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/distribution-payslip"
                      sx={{
                        color: selectedItem === 'distribution-payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'distribution-payslip' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'distribution-payslip' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'distribution-payslip' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('distribution-payslip')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'distribution-payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <ReceiptLong />
                      </ListItemIcon>
                      <ListItemText primary="Payslip Distribution" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/overall-payslip"
                      sx={{
                        color: selectedItem === 'overall-payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'overall-payslip' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'overall-payslip' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'overall-payslip' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('overall-payslip')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'overall-payslip' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <RequestQuote />
                      </ListItemIcon>
                      <ListItemText primary="Payslip Records" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/remittance-table"
                      sx={{
                        color: selectedItem === 'remittance-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'remittance-table' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'remittance-table' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'remittance-table' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('remittance-table')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'remittance-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <AccountBalanceIcon />
                      </ListItemIcon>
                      <ListItemText primary="Remittances" sx={{ marginLeft: '-10px' }} />
                    </ListItem>


                    {/* <ListItem 
                    button 
                    component={Link} 
                    to= '/philhealth-table' 
                    sx={{
                      color: selectedItem === 'philhealth-table' ? '#000000' : 'inherit',
                      bgcolor: selectedItem === 'philhealth-table' ? '#FEF9E1' : 'inherit',
                      '&:hover': {
                        bgcolor: '#6D2323',
                        color: '#FFFFFF',
                        borderTopRightRadius: '15px',
                        borderBottomRightRadius: '15px',
                        '& .MuiListItemIcon-root': {
                          color: '#FFFFFF',
                        }
                      },
                      borderTopRightRadius: selectedItem === 'philhealth-table' ? '15px' : 0,
                      borderBottomRightRadius: selectedItem === 'philhealth-table' ? '15px' : 0,
                    }}
                    onClick={() => handleItemClick('philhealth-table')} 
                    >
                    <ListItemIcon sx={{ marginRight: '-1rem',
                      color: selectedItem === 'philhealth-table' ? '#000000' : 'inherit',
                      '&:hover': { color: '#000000' }
                    }}>
                      <LocalHospitalIcon />
                    </ListItemIcon>
                    <ListItemText primary="PhilHealth" sx={{ marginLeft: '-10px' }} />
                  </ListItem> */}

                    <ListItem
                      button
                      component={Link}
                      to="/item-table"
                      sx={{
                        color: selectedItem === 'item-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'item-table' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'item-table' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'item-table' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('item-table')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'item-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <CategoryIcon />
                      </ListItemIcon>
                      <ListItemText primary="Item Table" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/salary-grade"
                      sx={{
                        color: selectedItem === 'salary-grade' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'salary-grade' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'salary-grade' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'salary-grade' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('salary-grade')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'salary-grade' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <MonetizationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Salary Grade | Tranche" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/department-table"
                      sx={{
                        color: selectedItem === 'department-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'department-table' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'department-table' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'department-table' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('department-table')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'department-table' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary="Department" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/department-assignment"
                      sx={{
                        color: selectedItem === 'department-assignment' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'department-assignment' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'department-assignment' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'department-assignment' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('department-assignment')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'department-assignment' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <BusinessCenterIcon />
                      </ListItemIcon>
                      <ListItemText primary="Department Assignment" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    {/* <ListItem
                      button
                      component={Link}
                      to="/leave-table"
                      sx={{
                        color: selectedItem === 'leave-table' ? '#000000' : '#FFFFFF',
                        bgcolor: selectedItem === 'leave-table' ? '#FEF9E1' : 'inherit',
                        '&:hover': {
                          bgcolor: '#6D2323',
                          color: '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'leave-table' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'leave-table' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('leave-table')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'leave-table' ? '#000000' : '#FFFFFF',
                          '&:hover': { color: '#000000' },
                        }}
                      >
                        <EventNoteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Leave" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/leave-assignment"
                      sx={{
                        color: selectedItem === 'leave-assignment' ? '#000000' : '#FFFFFF',
                        bgcolor: selectedItem === 'leave-assignment' ? '#FEF9E1' : 'inherit',
                        '&:hover': {
                          bgcolor: '#6D2323',
                          color: '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'leave-assignment' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'leave-assignment' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('leave-assignment')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'leave-assignment' ? '#000000' : '#FFFFFF',
                          '&:hover': { color: '#000000' },
                        }}
                      >
                        <AssignmentIndIcon />
                      </ListItemIcon>
                      <ListItemText primary="Leave Assignment" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                  <ListItem
                    button
                    component={Link}
                    to="/leave-request"
                    sx={{
                      color: selectedItem === 'leave-request' ? '#000000' : '#FFFFFF',
                      bgcolor: selectedItem === 'leave-request' ? '#FEF9E1' : 'inherit',
                      '&:hover': {
                        bgcolor: '#6D2323',
                        color: '#FFFFFF',
                        borderTopRightRadius: '15px',
                        borderBottomRightRadius: '15px',
                        '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                      },
                      borderTopRightRadius: selectedItem === 'leave-request' ? '15px' : 0,
                      borderBottomRightRadius: selectedItem === 'leave-request' ? '15px' : 0,
                    }}
                    onClick={() => handleItemClick('leave-request')}
                  >
                    <ListItemIcon
                      sx={{
                        marginRight: '-1rem',
                        color: selectedItem === 'leave-request' ? '#000000' : '#FFFFFF',
                        '&:hover': { color: '#FFFFFF' },
                      }}
                    >
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Leave Management"
                      sx={{ marginLeft: '-10px' }}
                    />
                  </ListItem> */}

                  </List>
                </Collapse>
              </>
            )}

            {userRole !== 'staff' && (
              <>
                <ListItem
                  button
                  onClick={handleClickForms}
                  sx={{ 
                    color: systemSettings?.textColor || '#FFFFFF', 
                    cursor: 'pointer' 
                  }}
                >
                  <ListItemIcon>
                    <AssignmentIcon sx={{ color: systemSettings?.textColor || '#FFFFFF' }} />
                  </ListItemIcon>
                  <ListItemText primary="Forms" sx={{ marginLeft: '-10px' }} />
                  <ListItemIcon sx={{ marginLeft: '10rem', color: systemSettings?.textColor || '#FFFFFF' }}>
                    {open4 ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItem>

                <Collapse in={open4} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 5.4 }}>
                    <ListItem
                      button
                      component={Link}
                      to="/assessment-clearance"
                      sx={{
                        color: selectedItem === 'assessment-clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'assessment-clearance' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'assessment-clearance' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'assessment-clearance' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('assessment-clearance')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'assessment-clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Assessment Clearance" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/clearance"
                      sx={{
                        color: selectedItem === 'clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'clearance' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'clearance' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'clearance' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('clearance')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Clearance" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/faculty-clearance"
                      sx={{
                        color: selectedItem === 'faculty-clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'faculty-clearance' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'faculty-clearance' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'faculty-clearance' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('faculty-clearance')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'faculty-clearance' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Faculty Clearance" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/hrms-request-forms"
                      sx={{
                        color: selectedItem === 'hrms-request-forms' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'hrms-request-forms' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
                        },
                        borderTopRightRadius: selectedItem === 'hrms-request-forms' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'hrms-request-forms' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('hrms-request-forms')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'hrms-request-forms' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="HRMS Request Form" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                  <ListItem
                      button
                      component={Link}
                      to="/individual-faculty-loading"
                      sx={{
                        color:
                          selectedItem === 'individual-faculty-loading'
                            ? '#000000'
                            : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor:
                          selectedItem === 'individual-faculty-loading'
                            ? (systemSettings?.accentColor || '#FEF9E1')
                            : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius:
                          selectedItem === 'individual-faculty-loading'
                            ? '15px'
                            : 0,
                        borderBottomRightRadius:
                          selectedItem === 'individual-faculty-loading'
                            ? '15px'
                            : 0,
                      }}
                      onClick={() =>
                        handleItemClick('individual-faculty-loading')
                      }
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color:
                            selectedItem === 'individual-faculty-loading'
                              ? '#000000'
                              : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Individual Faculty Loading"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/in-service-training"
                      sx={{
                        color:
                          selectedItem === 'in-service-training'
                            ? '#000000'
                            : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor:
                          selectedItem === 'in-service-training'
                            ? (systemSettings?.accentColor || '#FEF9E1')
                            : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius:
                          selectedItem === 'in-service-training' ? '15px' : 0,
                        borderBottomRightRadius:
                          selectedItem === 'in-service-training' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('in-service-training')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color:
                            selectedItem === 'in-service-training'
                              ? '#000000'
                              : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="In Service Training"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/leave-card"
                      sx={{
                        color:
                          selectedItem === 'leave-card'
                            ? '#000000'
                            : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor:
                          selectedItem === 'leave-card' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius:
                          selectedItem === 'leave-card' ? '15px' : 0,
                        borderBottomRightRadius:
                          selectedItem === 'leave-card' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('leave-card')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color:
                            selectedItem === 'leave-card'
                              ? '#000000'
                              : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Employee's Leave Card"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/locator-slip"
                      sx={{
                        color:
                          selectedItem === 'locator-slip'
                            ? '#000000'
                            : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor:
                          selectedItem === 'locator-slip' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius:
                          selectedItem === 'locator-slip' ? '15px' : 0,
                        borderBottomRightRadius:
                          selectedItem === 'locator-slip' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('locator-slip')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color:
                            selectedItem === 'locator-slip'
                              ? '#000000'
                              : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Locator's Slip"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/permission-to-teach"
                      sx={{
                        color:
                          selectedItem === 'permission-to-teach'
                            ? '#000000'
                            : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor:
                          selectedItem === 'permission-to-teach'
                            ? (systemSettings?.accentColor || '#FEF9E1')
                            : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius:
                          selectedItem === 'permission-to-teach' ? '15px' : 0,
                        borderBottomRightRadius:
                          selectedItem === 'permission-to-teach' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('permission-to-teach')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color:
                            selectedItem === 'permission-to-teach'
                              ? '#000000'
                              : (systemSettings?.textColor || '#FFFFFF'),
                          '&:hover': { color: systemSettings?.textColor || '#FFFFFF' },
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Permission To Teach"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>

                  <ListItem
                      button
                      component={Link}
                      to="/request-for-id"
                      sx={{
                        color: selectedItem === 'request-for-id' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'request-for-id' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'request-for-id' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'request-for-id' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('request-for-id')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'request-for-id' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Request For ID" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/saln-front"
                      sx={{
                        color: selectedItem === 'saln-front' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'saln-front' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'saln-front' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'saln-front' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('saln-front')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'saln-front' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="S.A.L.N" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/scholarship-agreement"
                      sx={{
                        color: selectedItem === 'scholarship-agreement' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'scholarship-agreement' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'scholarship-agreement' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'scholarship-agreement' ? '15px' : 0,
                      }}
                      onClick={() => handleItemClick('scholarship-agreement')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'scholarship-agreement' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Scholarship Agreement" sx={{ marginLeft: '-10px' }} />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to="/subject"
                      sx={{
                        color: selectedItem === 'subject' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        bgcolor: selectedItem === 'subject' ? (systemSettings?.accentColor || '#FEF9E1') : 'inherit',
                        '&:hover': {
                          bgcolor: systemSettings?.hoverColor || '#6D2323',
                          color: systemSettings?.textColor || '#FFFFFF',
                          borderTopRightRadius: '15px',
                          borderBottomRightRadius: '15px',
                          '& .MuiListItemIcon-root': {
                            color: systemSettings?.textColor || '#FFFFFF',
                          },
                        },
                        borderTopRightRadius: selectedItem === 'subject' ? '15px' : 0,
                        borderBottomRightRadius: selectedItem === 'subject' ? '15px' : 0,
                        marginBottom: '40px',
                      }}
                      onClick={() => handleItemClick('subject')}
                    >
                      <ListItemIcon
                        sx={{
                          marginRight: '-1rem',
                          color: selectedItem === 'subject' ? '#000000' : (systemSettings?.textColor || '#FFFFFF'),
                        }}
                      >
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Subject Still to be Taken"
                        sx={{ marginLeft: '-10px' }}
                      />
                    </ListItem>
                  </List>

                  
                </Collapse>
              </>
            )}
            
          </List>
        </Box>
      </Box>

      <ListItem
        button
        onClick={handleLogout}
        sx={{
          cursor: 'pointer',
          bgcolor: 'inherit',
          color: systemSettings?.textColor || '#FFFFFF',
          flexShrink: 0,
          zIndex: 1201,
          mb: 7,

          '& .MuiListItemIcon-root': {
            color: systemSettings?.textColor || '#FFFFFF',
          },
          '& .MuiListItemText-primary': {
            color: systemSettings?.textColor || '#FFFFFF',
          },

          '&:hover': {
            bgcolor: systemSettings?.hoverColor || '#6D2323',
            color: systemSettings?.textColor || '#FFFFFF',
            '& .MuiListItemIcon-root': { color: systemSettings?.textColor || '#FFFFFF' },
            '& .MuiListItemText-primary': { color: systemSettings?.textColor || '#FFFFFF' },
          },
        }}
      >
        <ListItemIcon>
          <LogoutIcon sx={{ fontSize: 29, marginLeft: '-6%' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Sign Out" 
          sx={{ 
            marginLeft: '-10px',
            opacity: drawerOpen ? 1 : 0,
            transition: 'opacity 0.3s',
            whiteSpace: 'nowrap',
          }} 
        />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;