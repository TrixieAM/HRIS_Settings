import API_BASE_URL from "../../apiConfig";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Avatar, Typography, Box, CircularProgress, Paper,
  Grid, Container, Button,
  Modal, TextField, Chip, IconButton,
  Card, CardContent, Tooltip,
  useTheme, alpha, Backdrop,
  Tabs, Tab,
  useMediaQuery,
  Fab,
  Snackbar, SnackbarContent, useScrollTrigger,
  Menu, MenuItem, ListItemIcon,
  ListItemText,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ExitToApp } from "@mui/icons-material";

// HR Professional Color Palette
const colors = {
  primary: '#6d2323',
  primaryLight: '#8a2e2e',
  primaryDark: '#4a1818',
  secondary: '#f5f5dc',
  textPrimary: '#000000',
  textSecondary: '#555555',
  textLight: '#ffffff',
  background: '#fafafa',
  surface: '#ffffff',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  gradientPrimary: 'linear-gradient(135deg, #6d2323 0%, #8a2e2e 100%)',
};

const shadows = {
  light: '0 2px 8px rgba(0,0,0,0.08)',
  medium: '0 4px 16px rgba(0,0,0,0.12)',
  heavy: '0 8px 24px rgba(0,0,0,0.16)',
  colored: '0 4px 16px rgba(109, 35, 35, 0.2)'
};

const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1400px',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  minHeight: '100vh',
  backgroundColor: colors.background,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: colors.gradientPrimary,
    zIndex: 0,
    borderBottomLeftRadius: '50% 20%',
    borderBottomRightRadius: '50% 20%',
  }
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: shadows.medium,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: colors.surface,
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(4)
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '8px',
    background: colors.gradientPrimary
  }
}));

const ProfileAvatarContainer = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(4),
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    marginRight: 0,
    marginBottom: theme.spacing(3)
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(24),
  height: theme.spacing(24),
  border: `4px solid ${colors.surface}`,
  boxShadow: shadows.medium,
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: shadows.colored
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  color: colors.textPrimary,
  marginBottom: theme.spacing(0.5),
  transition: 'color 0.3s ease',
  '&:hover': {
    color: colors.primary
  }
}));

const ProfileSubtitle = styled(Typography)(({ theme }) => ({
  color: colors.textSecondary,
  marginBottom: theme.spacing(2),
  fontSize: '1.1rem'
}));

const ProfileActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    flexWrap: 'wrap'
  }
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: shadows.light,
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: shadows.medium,
    transform: 'translateY(-4px)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '6px',
    height: '100%',
    background: colors.gradientPrimary,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover::before': {
    opacity: 1
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: colors.textPrimary,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -theme.spacing(1),
    left: 0,
    width: '60px',
    height: '3px',
    background: colors.gradientPrimary,
    borderRadius: theme.spacing(1)
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2.5),
  alignItems: 'flex-start',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.05)
  }
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: colors.textSecondary,
  minWidth: '160px',
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: colors.textPrimary,
  flex: 1,
  fontWeight: 500,
  fontSize: '1rem'
}));

const TabContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative'
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minWidth: 'auto',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    color: colors.textLight,
    backgroundColor: colors.primary
  },
  '&:not(.Mui-selected)': {
    color: colors.textSecondary,
    '&:hover': {
      backgroundColor: alpha(colors.primary, 0.1),
      color: colors.primary
    }
  }
}));

const CustomTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: alpha(colors.secondary, 0.7),
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5),
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  marginBottom: theme.spacing(4)
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.2, 2.5),
  transition: 'all 0.3s ease',
  boxShadow: shadows.light,
  ...(variant === 'contained' && {
    background: colors.gradientPrimary,
    color: colors.textLight,
    '&:hover': {
      background: colors.primaryDark,
      transform: 'translateY(-2px)',
      boxShadow: shadows.medium
    }
  }),
  ...(variant === 'outlined' && {
    color: colors.primary,
    borderColor: colors.primary,
    borderWidth: '2px',
    '&:hover': {
      backgroundColor: alpha(colors.primary, 0.1),
      borderColor: colors.primaryDark,
      transform: 'translateY(-2px)'
    }
  })
}));

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '900px',
  backgroundColor: colors.surface,
  borderRadius: theme.spacing(3),
  boxShadow: shadows.heavy,
  padding: 0,
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  background: colors.gradientPrimary,
  padding: theme.spacing(3, 4),
  color: colors.textLight,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem'
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  flex: 1
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: colors.border,
    },
    '&:hover fieldset': {
      borderColor: colors.primaryLight,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
      borderWidth: '2px'
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: colors.primary
    }
  }
}));

const ViewToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 500,
  '&.Mui-selected': {
    backgroundColor: colors.primary,
    color: colors.textLight,
    '&:hover': {
      backgroundColor: colors.primaryDark
    }
  }
}));

const ImagePreviewModal = styled(Modal)(({ theme }) => ({
  '& .MuiModal-backdrop': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none'
}));

const ImagePreviewContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100%',
  maxHeight: '80vh'
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '80vh',
  borderRadius: theme.spacing(2),
  boxShadow: shadows.heavy,
  objectFit: 'contain'
}));

const ImagePreviewActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: alpha(colors.surface, 0.9),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(0.5)
}));

const ImagePreviewButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: colors.surface,
  color: colors.textPrimary,
  '&:hover': {
    backgroundColor: colors.primary,
    color: colors.textLight
  }
}));

const EditModalPictureSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: alpha(colors.secondary, 0.3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center'
  }
}));

const EditModalAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  border: `3px solid ${colors.surface}`,
  boxShadow: shadows.medium,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const EditModalPictureInfo = styled(Box)(({ theme }) => ({
  flex: 1
}));

const EditModalPictureActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  minHeight: '600px'
}));

const ViewWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.3s ease, visibility 0.3s ease',
  '&.active': {
    opacity: 1,
    visibility: 'visible'
  }
}));

const Notification = styled(SnackbarContent)(({ theme, variant }) => ({
  backgroundColor: variant === 'success' ? colors.success : 
                  variant === 'error' ? colors.error : 
                  variant === 'warning' ? colors.warning : colors.info,
  color: colors.textLight,
  fontWeight: 500,
  borderRadius: theme.spacing(2),
  boxShadow: shadows.medium
}));

const FloatingButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  background: colors.gradientPrimary,
  color: colors.textLight,
  boxShadow: shadows.medium,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: shadows.colored
  }
}));

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [person, setPerson] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [editImageZoomOpen, setEditImageZoomOpen] = useState(false);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const employeeNumber = localStorage.getItem('employeeNumber');
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        setPerson(match);

        if (match) {
          setProfilePicture(match.profile_picture);
          const formattedData = { ...match };
          if (match.birthDate) {
            const date = new Date(match.birthDate);
            if (!isNaN(date.getTime())) {
              formattedData.birthDate = date.toISOString().split('T')[0];
            }
          }
          setFormData(formattedData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setUploadStatus({ message: 'Failed to load profile data', type: 'error' });
        setNotificationOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [employeeNumber]);

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  
  const handleEditClose = () => setEditOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/personalinfo/person_table/by-employee/${employeeNumber}`, formData);
      setPerson(formData);
      setEditOpen(false);
      setUploadStatus({ message: 'Profile updated successfully!', type: 'success' });
      setNotificationOpen(true);
    } catch (err) {
      console.error("Update failed:", err);
      setUploadStatus({ message: 'Failed to update profile', type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeNumber) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({ message: 'Please upload a valid image file (JPEG, PNG, GIF)', type: 'error' });
      setNotificationOpen(true);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus({ message: 'File size must be less than 5MB', type: 'error' });
      setNotificationOpen(true);
      return;
    }

    const fd = new FormData();
    fd.append('profile', file);

    try {
      setUploadStatus({ message: 'Uploading...', type: 'info' });
      setNotificationOpen(true);

      const res = await axios.post(
        `${API_BASE_URL}/upload-profile-picture/${employeeNumber}`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      const newPicturePath = res.data.filePath;
      setProfilePicture(newPicturePath);

      if (person) {
        setPerson(prev => ({ ...prev, profile_picture: newPicturePath }));
      }

      setUploadStatus({ message: 'Profile picture updated successfully!', type: 'success' });
      setNotificationOpen(true);

    } catch (err) {
      console.error('Image upload failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setUploadStatus({ message: errorMessage, type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handleRemovePicture = () => {
    if (!person?.id) return;

    try {
      axios.delete(`${API_BASE_URL}/personalinfo/remove-profile-picture/${person.id}`);
      setProfilePicture(null);
      setPerson(prev => ({ ...prev, profile_picture: null }));
      setUploadStatus({ message: 'Profile picture removed successfully!', type: 'success' });
      setNotificationOpen(true);
    } catch (err) {
      console.error('Remove picture failed:', err);
      setUploadStatus({ message: 'Failed to remove picture.', type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageZoom = () => {
    setImageZoomOpen(true);
  };

  const handleImageZoomClose = () => {
    setImageZoomOpen(false);
  };

  const handleEditImageZoom = () => {
    setEditImageZoomOpen(true);
  };

  const handleEditImageZoomClose = () => {
    setEditImageZoomOpen(false);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };


  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const scrollToTop = () => {
    profileRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = [
    { key: 0, label: 'Personal', icon: <PersonIcon /> },
    { key: 1, label: 'Gov. IDs', icon: <BadgeIcon /> },
    { key: 2, label: 'Addresses', icon: <HomeIcon /> },
    { key: 3, label: 'Contact', icon: <CallIcon /> },
    { key: 4, label: 'Family', icon: <GroupIcon /> },
    { key: 5, label: 'Education', icon: <SchoolIcon /> },
  ];

  const formFields = {
    0: [
      { label: "First Name", name: "firstName", icon: <PersonIcon fontSize="small" /> },
      { label: "Middle Name", name: "middleName", icon: <PersonIcon fontSize="small" /> },
      { label: "Last Name", name: "lastName", icon: <PersonIcon fontSize="small" /> },
      { label: "Name Extension", name: "nameExtension", icon: <PersonIcon fontSize="small" /> },
      { label: "Date of Birth", name: "birthDate", type: "date", icon: <CakeIcon fontSize="small" /> },
      { label: "Place of Birth", name: "placeOfBirth", icon: <LocationOnIcon fontSize="small" /> }
    ],
    1: [
      { label: "GSIS Number", name: "gsisNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "Pag-IBIG Number", name: "pagibigNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "PhilHealth Number", name: "philhealthNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "SSS Number", name: "sssNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "TIN Number", name: "tinNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "Agency Employee Number", name: "agencyEmployeeNum", disabled: true, icon: <BadgeIcon fontSize="small" /> }
    ],
    2: [
      { label: "House & Lot Number", name: "permanent_houseBlockLotNum", icon: <HomeIcon fontSize="small" /> },
      { label: "Street", name: "permanent_streetName", icon: <HomeIcon fontSize="small" /> },
      { label: "Subdivision", name: "permanent_subdivisionOrVillage", icon: <HomeIcon fontSize="small" /> },
      { label: "Barangay", name: "permanent_barangay", icon: <HomeIcon fontSize="small" /> },
      { label: "City/Municipality", name: "permanent_cityOrMunicipality", icon: <HomeIcon fontSize="small" /> },
      { label: "Province", name: "permanent_provinceName", icon: <HomeIcon fontSize="small" /> },
      { label: "Zip Code", name: "permanent_zipcode", icon: <HomeIcon fontSize="small" /> }
    ],
    3: [
      { label: "Telephone", name: "telephone", icon: <CallIcon fontSize="small" /> },
      { label: "Mobile", name: "mobileNum", icon: <PhoneIcon fontSize="small" /> },
      { label: "Email", name: "emailAddress", icon: <EmailIcon fontSize="small" /> }
    ],
    4: [
      { label: "Spouse First Name", name: "spouseFirstName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Middle Name", name: "spouseMiddleName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Last Name", name: "spouseLastName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Occupation", name: "spouseOccupation", icon: <WorkIcon fontSize="small" /> }
    ],
    5: [
      { label: "Elementary School", name: "elementaryNameOfSchool", icon: <SchoolIcon fontSize="small" /> },
      { label: "Elementary Degree", name: "elementaryDegree", icon: <SchoolIcon fontSize="small" /> },
      { label: "Secondary School", name: "secondaryNameOfSchool", icon: <SchoolIcon fontSize="small" /> },
      { label: "Secondary Degree", name: "secondaryDegree", icon: <SchoolIcon fontSize="small" /> }
    ]
  };

  if (loading) {
    return (
      <ProfileContainer ref={profileRef}>
        <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
          <Box textAlign="center">
            <CircularProgress size={64} thickness={4} sx={{ color: colors.primary, mb: 3 }} />
            <Typography variant="h6" color={colors.textPrimary} fontWeight={600}>Loading Profile...</Typography>
            <Typography variant="body2" color={colors.textSecondary} mt={1}>Fetching data securely — this may take a moment.</Typography>
          </Box>
        </Box>
      </ProfileContainer>
    );
  }

  const renderTabContentGrid = (tabIndex) => {
    const fields = formFields[tabIndex] || [];
    
    return (
      <Grid container spacing={3}>
        {fields.map((field, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: shadows.medium
                }
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  {field.icon}
                  <Typography variant="subtitle2" color={colors.textSecondary} ml={1}>
                    {field.label}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {person?.[field.name] || '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTabContentList = (tabIndex) => {
    const fields = formFields[tabIndex] || [];
    
    return (
      <Box>
        {fields.map((field, idx) => (
          <InfoItem key={idx}>
            <InfoLabel variant="body2">
              {field.icon}
              {field.label}:
            </InfoLabel>
            <InfoValue variant="body1">
              {person?.[field.name] || '—'}
            </InfoValue>
          </InfoItem>
        ))}
      </Box>
    );
  };

  const renderFormFields = () => {
    const fields = formFields[tabValue] || [];
    
    return (
      <Grid container spacing={3}>
        {fields.map((field, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <FormField
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleFormChange}
              variant="outlined"
              disabled={field.disabled}
              type={field.type || 'text'}
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <ProfileContainer ref={profileRef}>
      <ProfileHeader>
        <ProfileAvatarContainer>
          <ProfileAvatar
            src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
            alt="Profile Picture"
            onClick={handleImageZoom}
          >
            {!profilePicture && <PersonIcon sx={{ fontSize: 80 }} />}
          </ProfileAvatar>
        </ProfileAvatarContainer>

        <ProfileInfo>
          <ProfileName>
            {person ? `${person.firstName} ${person.middleName} ${person.lastName} ${person.nameExtension || ''}`.trim() : 'Employee Profile'}
          </ProfileName>
          <ProfileSubtitle>
            Employee No.: <b>{person?.agencyEmployeeNum || '—'}</b>
          </ProfileSubtitle>
        </ProfileInfo>

        <ProfileActions>
          <Tooltip title="Refresh profile">
            <IconButton 
              onClick={handleRefresh}
              sx={{
                backgroundColor: alpha(colors.primary, 0.1),
                color: colors.primary,
                '&:hover': {
                  backgroundColor: alpha(colors.primary, 0.2)
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <ActionButton
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditOpen}
          >
            Edit Profile
          </ActionButton>
        </ProfileActions>
      </ProfileHeader>

      <SectionPaper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SectionTitle>
            <PersonIcon />
            Employee Details
          </SectionTitle>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" color={colors.textSecondary} mr={2}>
              View Mode:
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ViewToggleButton value="grid" aria-label="grid view">
                <GridViewIcon />
              </ViewToggleButton>
              <ViewToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ViewToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <TabContainer>
          <CustomTabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            {tabs.map((tab) => (
              <CustomTab
                key={tab.key}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </CustomTabs>
        </TabContainer>

        <ContentContainer>
          <ViewWrapper className={viewMode === 'grid' ? 'active' : ''}>
            {renderTabContentGrid(tabValue)}
          </ViewWrapper>
          <ViewWrapper className={viewMode === 'list' ? 'active' : ''}>
            {renderTabContentList(tabValue)}
          </ViewWrapper>
        </ContentContainer>
      </SectionPaper>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Backdrop open={editOpen} onClick={handleEditClose}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Edit Profile</ModalTitle>
              <IconButton onClick={handleEditClose} sx={{ color: colors.textLight }}>
                <CloseIcon />
              </IconButton>
            </ModalHeader>

            <EditModalPictureSection>
              <EditModalAvatar
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture"
                onClick={handleEditImageZoom}
              >
                {!profilePicture && <PersonIcon sx={{ fontSize: 60 }} />}
              </EditModalAvatar>
              <EditModalPictureInfo>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary, mb: 1 }}>
                  Profile Picture
                </Typography>
                <Typography variant="body2" color={colors.textSecondary} sx={{ mb: 2 }}>
                  Click on the image to preview. Upload a professional headshot (max 5MB, JPEG/PNG)
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip 
                    icon={<PhotoSizeSelectActualIcon fontSize="small" />}
                    label="High Quality" 
                    size="small" 
                    sx={{ 
                      backgroundColor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      fontWeight: 600
                    }} 
                  />
                  <Chip 
                    icon={<CropOriginalIcon fontSize="small" />}
                    label="Recommended: 400x400px" 
                    size="small" 
                    sx={{ 
                      backgroundColor: alpha(colors.secondary, 0.5),
                      color: colors.textSecondary,
                      fontWeight: 600
                    }} 
                  />
                </Box>
              </EditModalPictureInfo>
              <EditModalPictureActions>
                <input
                  accept="image/*"
                  id="profile-picture-upload-modal"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handlePictureChange}
                />
                <label htmlFor="profile-picture-upload-modal">
                  <ActionButton
                    component="span"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Photo
                  </ActionButton>
                </label>
                <ActionButton
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemovePicture}
                  fullWidth
                >
                  Remove Photo
                </ActionButton>
              </EditModalPictureActions>
            </EditModalPictureSection>

            <ModalBody>
              <Box sx={{ mb: 3 }}>
                <CustomTabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {tabs.map((tab) => (
                    <CustomTab
                      key={tab.key}
                      label={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                    />
                  ))}
                </CustomTabs>
              </Box>

              {renderFormFields()}

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <ActionButton
                  variant="outlined"
                  onClick={handleEditClose}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                >
                  Save Changes
                </ActionButton>
              </Box>
            </ModalBody>
          </ModalContainer>
        </Backdrop>
      </Modal>

      <ImagePreviewModal
        open={imageZoomOpen}
        onClose={handleImageZoomClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Backdrop open={imageZoomOpen} onClick={handleImageZoomClose}>
          <ImagePreviewContainer onClick={(e) => e.stopPropagation()}>
            <ImagePreviewContent>
              <PreviewImage
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture Preview"
              />
              <ImagePreviewActions>
                <ImagePreviewButton
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : '';
                    link.download = 'profile-picture.jpg';
                    link.click();
                  }}
                  title="Download"
                >
                  <DownloadIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Profile Picture',
                        url: profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : ''
                      });
                    }
                  }}
                  title="Share"
                >
                  <ShareIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={handleImageZoomClose}
                  title="Close"
                >
                  <CloseIcon />
                </ImagePreviewButton>
              </ImagePreviewActions>
            </ImagePreviewContent>
          </ImagePreviewContainer>
        </Backdrop>
      </ImagePreviewModal>

      <ImagePreviewModal
        open={editImageZoomOpen}
        onClose={handleEditImageZoomClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Backdrop open={editImageZoomOpen} onClick={handleEditImageZoomClose}>
          <ImagePreviewContainer onClick={(e) => e.stopPropagation()}>
            <ImagePreviewContent>
              <PreviewImage
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture Preview"
              />
              <ImagePreviewActions>
                <ImagePreviewButton
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : '';
                    link.download = 'profile-picture.jpg';
                    link.click();
                  }}
                  title="Download"
                >
                  <DownloadIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Profile Picture',
                        url: profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : ''
                      });
                    }
                  }}
                  title="Share"
                >
                  <ShareIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={handleEditImageZoomClose}
                  title="Close"
                >
                  <CloseIcon />
                </ImagePreviewButton>
              </ImagePreviewActions>
            </ImagePreviewContent>
          </ImagePreviewContainer>
        </Backdrop>
      </ImagePreviewModal>

      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Notification
          variant={uploadStatus.type}
          message={uploadStatus.message}
          action={
            <IconButton size="small" color="inherit" onClick={handleNotificationClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>

      {trigger && (
        <FloatingButton onClick={scrollToTop} aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </FloatingButton>
      )}
    </ProfileContainer>
  );
};

export default Profile;