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
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  PointOfSale as PointOfSaleIcon,
  Category as CategoryIcon,
  CurrencyExchange as CurrencyExchangeIcon,
  Store as StoreIcon,
  AddBusiness as AddBusinessIcon,
  Announcement as AnnouncementIcon,
  Summarize as SummarizeIcon,
  Portrait as PortraitIcon,
  ContactPage as ContactPageIcon,
  AddHomeWork as AddHomeWorkIcon,
  TableView as TableViewIcon,
  RequestQuote as RequestQuoteIcon,

} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const drawerWidth = 270;
const collapsedWidth = 60;

const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const role = getUserRole();
    setUsername(storedUser || '');
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/';
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
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
    width: 230, 
    height: '100vh', 
    transition: 'all 0.3s ease',  
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
        <img
          src="/earist-logo-1.png"
          alt="earist-logo"
          style={{ height: 32 }}
        />
        <Typography variant="h6" noWrap>
          HRIS
        </Typography>
      </Box>
    )}
    <IconButton onClick={handleToggleDrawer} size="small">
      {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  </Toolbar>

  <List>
  {userRole !== 'staff' && (
        <>
        <List component="div" disablePadding sx={{ pl: 2.5}}>
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
                <Avatar alt={username} sx={{ width: 32, height: 32, marginLeft: -1, color: 'black' }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Poppins', marginLeft: '9px', color: 'black'}}>
                    {userRole}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} size="small" sx={{ ml: 10, color: 'black' }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </List>  
        </>
      )}

      <Divider sx={{ marginTop: '7px', marginBottom: '7px'}}/>
   
      <ListItem 
  button 
  component={Link} 
  to='/home' 
  sx={{
    color: selectedItem === 'home' ? 'white' : 'inherit',
    bgcolor: selectedItem === 'home' ? '#A31D1D' : 'inherit',
    '&:hover': {
      bgcolor: '#f0f0f0',
      color: 'black',
      borderTopRightRadius: '15px',
      borderBottomRightRadius: '15px',
    },
    borderTopRightRadius: selectedItem === 'home' ? '15px' : 0,
    borderBottomRightRadius: selectedItem === 'home' ? '15px' : 0,
  }}
  onClick={() => handleItemClick('home')}
>
<ListItemIcon sx={{ color: selectedItem === 'home' ? 'white' : 'inherit',
                    '&:hover': { color: 'black' }
                   }}>
    <House sx={{ fontSize: 29, marginLeft: '-6%' }} />
  </ListItemIcon>
  <ListItemText 
    primary="Home" 
    sx={{ marginLeft: '-10px' }} 
  />
</ListItem>




        {userRole !== 'staff' && (
          <>
            <ListItem
              button
              onClick={handleClick}
              sx={{ color: 'black', cursor: 'pointer',  borderTopRightRadius: selectedItem === 'home' ? '15px' : 0,
                borderBottomRightRadius: selectedItem === 'home' ? '15px' : 0, }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboards" sx={{marginLeft: '-10px'}} />
              <ListItemIcon sx={{ marginLeft: '10rem', color: 'black' }}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            </ListItem>


            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem
                  button 
                  component={Link} 
                  to= '/personalinfo' 
                  sx={{
                    color: selectedItem === 'personalinfo' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'personalinfo' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'personalinfo' ? '15px' : 0,
                  }}

                  onClick={() => handleItemClick('personalinfo')} 
                >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'personalinfo' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <PortraitIcon />
                  </ListItemIcon>
                  <ListItemText primary="Personal Information" sx={{marginLeft: '-10px'}}/>
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
                  to= '/other-information' 
                  sx={{
                    color: selectedItem === 'other-information' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'other-information' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
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
                    <ContactPageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Other Information" sx={{marginLeft: '-10px'}}/>
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
                    <AddHomeWorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Work Experience" sx={{marginLeft: '-10px'}}/>
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
                    <Streetview />
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
                  to= '/voluntarywork' 
                  sx={{
                    color: selectedItem === 'voluntarywork' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'voluntarywork' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
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
                  to= '/eligibility' 
                  sx={{
                    color: selectedItem === 'eligibility' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'eligibility' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
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
              </List>
            </Collapse>
          </> 
        )}


        <ListItem
          button
          onClick={handleClickAttendance}
          sx={{ color: 'black', cursor: 'pointer',  }}
        >
          <ListItemIcon>
            <TableViewIcon />
          </ListItemIcon>
          <ListItemText primary="Records" sx={{marginLeft: '-10px'}}/>
          <ListItemIcon sx={{ marginLeft: '10rem', color:'black' }}>
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>


        {userRole !== 'staff' && (
          <>
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
              <ListItem 
                  button 
                  component={Link} 
                  to= '/view_attendance' 
                  sx={{
                    color: selectedItem === 'view_attendance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'view_attendance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'view_attendance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('view_attendance')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'view_attendance' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="View Attendance" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                 <ListItem 
                  button 
                  component={Link} 
                  to= '/search_attendance' 
                  sx={{
                    color: selectedItem === 'search_attendance' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'search_attendance' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'search_attendance' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('search_attendance')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'search_attendance' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Search Attendance" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}

        <Collapse in={open2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 5.4 }}>
             <ListItem 
                  button 
                  component={Link} 
                  to= '/daily_time_record' 
                  sx={{
                    color: selectedItem === 'daily_time_record' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'daily_time_record' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'daily_time_record' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('daily_time_record')} 
                  >
              <ListItemIcon sx={{ marginRight: '-1rem',
                 color: selectedItem === 'daily_time_record' ? 'white' : 'inherit',
                 '&:hover': { color: 'white' }
               }}>
                <BadgeRounded />
              </ListItemIcon>
              <ListItemText primary="Daily Time Record" sx={{marginLeft: '-10px'}}/>
            </ListItem>
          </List>
        </Collapse>


        {userRole !== 'staff' && (
          <>
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
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
                  <ListItemText primary="Daily Faculty Time Record" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                 <ListItem 
                  button 
                  component={Link} 
                  to= '/attendance_form' 
                  sx={{
                    color: selectedItem === 'attendance_form' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_form' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_form' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_form')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'attendance_form' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Form"sx={{marginLeft: '-10px'}} />
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
              <ListItem 
                  button 
                  component={Link} 
                  to= '/attendance_module' 
                  sx={{
                    color: selectedItem === 'attendance_module' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'attendance_module' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Non-teaching Staff" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>
            
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                <ListItem 
                  button 
                  component={Link} 
                  to= '/attendance_module_faculty' 
                  sx={{
                    color: selectedItem === 'attendance_module_faculty' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module_faculty' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module_faculty' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module_faculty')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'attendance_module_faculty' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Faculty (30hrs)" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                 <ListItem 
                  button 
                  component={Link} 
                  to= '/attendance_module_faculty_40hrs' 
                  sx={{
                    color: selectedItem === 'attendance_module_faculty_40hrs' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_module_faculty_40hrs' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_module_faculty_40hrs' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_module_faculty_40hrs')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'attendance_module_faculty_40hrs' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Module Faculty (Designated)" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
              <ListItem 
                  button 
                  component={Link} 
                  to= '/attendance_summary' 
                  sx={{
                    color: selectedItem === 'attendance_summary' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'attendance_summary' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'attendance_summary' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('attendance_summary')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'attendance_summary' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Attendance Summary" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>

            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 5.4 }}>
                 <ListItem 
                  button 
                  component={Link} 
                  to= '/official_time' 
                  sx={{
                    color: selectedItem === 'official_time' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'official_time' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'official_time' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('official_time')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'official_time' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <BadgeRounded />
                  </ListItemIcon>
                  <ListItemText primary="Official Time Form" sx={{marginLeft: '-10px'}}/>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}

      {userRole !== 'staff' && (
          <>
        
        <ListItem
              button
              onClick={handleClickPDSFiles}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <ListItemIcon>
                <DashboardIcon />
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
                <RequestQuoteIcon />
              </ListItemIcon>
              <ListItemText primary="Payroll Management" sx={{ marginLeft: '-10px' }} />
              <ListItemIcon sx={{ marginLeft: '10rem',
                
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
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Payroll" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/payroll-edit' 
                  sx={{
                    color: selectedItem === 'payroll-edit' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'payroll-edit' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'payroll-edit' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'payroll-edit' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('payroll-edit')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                     color: selectedItem === 'payroll-edit' ? 'white' : 'inherit',
                     '&:hover': { color: 'white' }
                   }}>
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Payroll Edit" sx={{ marginLeft: '-10px' }} />
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
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remittances" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
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
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="PhilHealth" sx={{ marginLeft: '-10px' }} />
                </ListItem>


                <ListItem
                  button
                  component={Link}
                  to= '/plantillia-table'
                  sx={{
                    color: selectedItem === 'plantillia-table' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'plantillia-table' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'plantillia-table' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'plantillia-table' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('plantillia-table')}
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'plantillia-table' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Plantillia" sx={{ marginLeft: '-10px' }} />
                </ListItem>


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
                  to= '/employee-salary-grade'
                  sx={{
                    color: selectedItem === 'employee-salary-grade' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'employee-salary-grade' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'employee-salary-grade' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'employee-salary-grade' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('employee-salary-grade')}
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'employee-salary-grade' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <PointOfSaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employee Salary Grade" sx={{ marginLeft: '-10px' }} />
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
                    <CurrencyExchangeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Salary Grade Table" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/salary-grade-status' 
                  sx={{
                    color: selectedItem === 'salary-grade-status' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'salary-grade-status' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'salary-grade-status' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'salary-grade-status' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('salary-grade-status')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'salary-grade-status' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <CurrencyExchangeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Salary Grade Status" sx={{ marginLeft: '-10px' }} />
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
                    <StoreIcon />
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
                    <AddBusinessIcon />
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
                    <SummarizeIcon />
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
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leave Assignment" sx={{ marginLeft: '-10px' }} />
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to= '/holiday-suspension' 
                  sx={{
                    color: selectedItem === 'holiday-suspension' ? 'white' : 'inherit',
                    bgcolor: selectedItem === 'holiday-suspension' ? '#A31D1D' : 'inherit',
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      color: 'black',
                      borderTopRightRadius: '15px',
                      borderBottomRightRadius: '15px',
                    },
                    borderTopRightRadius: selectedItem === 'holiday-suspension' ? '15px' : 0,
                    borderBottomRightRadius: selectedItem === 'holiday-suspension' ? '15px' : 0,
                  }}
                  onClick={() => handleItemClick('holiday-suspension')} 
                  >
                  <ListItemIcon sx={{ marginRight: '-1rem',
                    color: selectedItem === 'holiday-suspension' ? 'white' : 'inherit',
                    '&:hover': { color: 'white' }
                   }}>
                    <AnnouncementIcon />
                  </ListItemIcon>
                  <ListItemText primary="Holiday and Suspension" sx={{ marginLeft: '-10px' }} />
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Forms" sx={{ marginLeft: '-10px' }} />
              <ListItemIcon sx={{ marginLeft: '10rem' }}>
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