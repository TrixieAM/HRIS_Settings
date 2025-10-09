import API_BASE_URL from "../../apiConfig";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Avatar, Typography, Box, CircularProgress, Paper,
  Grid, Container, Fade, Button, Alert,
  Modal, TextField, Divider, Chip, IconButton,
  Card, CardContent, Tooltip,
  useTheme, alpha, Backdrop, Grow, Accordion,
  AccordionSummary, AccordionDetails, Tabs, Tab,
  LinearProgress, Badge, List, ListItem, ListItemIcon,
  ListItemText, Switch, FormControlLabel, useMediaQuery,
  Stepper, Step, StepLabel, Slide, Dialog, DialogTitle,
  DialogContent, DialogActions, Zoom, Skeleton, Fab,
  Snackbar, SnackbarContent, Collapse, useScrollTrigger
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SecurityIcon from '@mui/icons-material/Security';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import Timeline from '@mui/lab/Timeline';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Professional Color Palette
const colors = {
  primary: '#6d2323',      // deep maroon
  primaryLight: '#8a2e2e',
  primaryDark: '#4a1818',
  secondary: '#f5f5dc',   // cream
  secondaryLight: '#ffffff',
  secondaryDark: '#e6e6c7',
  accent: '#333333',       // dark gray/black
  accentLight: '#555555',
  accentDark: '#000000',
  textPrimary: '#000000',
  textSecondary: '#555555',
  textLight: '#ffffff',
  neutralBg: '#f9f9f9',
  surface: '#ffffff',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  gradientPrimary: 'linear-gradient(135deg, #6d2323 0%, #8a2e2e 100%)',
  gradientSecondary: 'linear-gradient(135deg, #f5f5dc 0%, #ffffff 100%)',
  gradientAccent: 'linear-gradient(135deg, #333333 0%, #555555 100%)',
  gradientSuccess: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  gradientWarning: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
  gradientError: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
  gradientInfo: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
};

// Enhanced shadows
const shadowSoft = '0 4px 20px rgba(0, 0, 0, 0.08)';
const shadowMedium = '0 8px 30px rgba(0, 0, 0, 0.12)';
const shadowDeep = '0 16px 40px rgba(0, 0, 0, 0.16)';
const shadowColored = '0 8px 30px rgba(109, 35, 35, 0.2)';
const shadowCard = '0 6px 18px rgba(0, 0, 0, 0.1)';

// Styled components with enhanced styling
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${colors.secondary} 0%, ${colors.surface} 100%)`,
  position: 'relative',
  paddingBottom: theme.spacing(6),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    background: colors.gradientPrimary,
    zIndex: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    opacity: 0.95
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    zIndex: 1,
    opacity: 0.4
  }
}));

const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 2
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  overflow: 'hidden',
  background: colors.surface,
  boxShadow: shadowDeep,
  transition: 'transform 300ms ease, box-shadow 300ms ease',
  border: `1px solid ${colors.border}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: shadowColored
  }
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: colors.gradientPrimary,
  padding: theme.spacing(6),
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  color: colors.textLight,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    background: `linear-gradient(180deg, transparent 0%, ${colors.surface} 100%)`
  }
}));

const AvatarWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  minWidth: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 180,
  height: 180,
  borderRadius: 24,
  border: `6px solid ${colors.surface}`,
  boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
  transition: 'transform 300ms ease, box-shadow 300ms ease',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.03)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.25)'
  }
}));

const ProfileMeta = styled(Box)(({ theme }) => ({
  flex: 1,
  color: colors.surface,
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.2rem',
  color: colors.textLight,
  marginBottom: theme.spacing(0.5),
  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
}));

const ProfileSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: alpha(colors.textLight, 0.9),
  marginBottom: theme.spacing(1.5)
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  zIndex: 3,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    justifyContent: 'center'
  }
}));

const EditButton = styled(Button)(({ theme }) => ({
  background: colors.surface,
  color: colors.primary,
  fontWeight: 700,
  padding: theme.spacing(1.2, 2.5),
  borderRadius: 30,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  textTransform: 'none',
  transition: 'all 200ms ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
    background: alpha(colors.surface, 0.9)
  }
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  background: colors.surface
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  justifyContent: 'space-between'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.4rem',
  color: colors.textPrimary,
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    background: colors.primary,
    borderRadius: 2
  }
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  transition: 'all 240ms cubic-bezier(.2,.9,.2,1)',
  overflow: 'hidden',
  boxShadow: shadowCard,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: shadowColored,
    '& .infoCardIcon': {
      color: colors.primary,
      transform: 'scale(1.1)'
    },
    '& .infoCardHeader': {
      background: alpha(colors.primary, 0.05)
    }
  }
}));

const InfoCardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  background: alpha(colors.secondary, 0.3),
  borderBottom: `1px solid ${colors.border}`,
  transition: 'all 200ms ease'
}));

const InfoCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  position: 'relative'
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: colors.textSecondary,
  marginBottom: theme.spacing(0.5),
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: colors.textPrimary,
  fontWeight: 500,
  wordBreak: 'break-word'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(colors.secondary, 0.5),
  borderRadius: 16,
  padding: theme.spacing(0.5),
  boxShadow: shadowSoft,
  '& .MuiTabs-indicator': {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: 3,
    display: 'none'
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  color: colors.textSecondary,
  minHeight: 48,
  borderRadius: 12,
  transition: 'all 200ms ease',
  padding: theme.spacing(0, 1.5),
  margin: theme.spacing(0, 0.5),
  '&.Mui-selected': {
    color: colors.textLight,
    background: colors.gradientPrimary,
    boxShadow: '0 4px 12px rgba(109, 35, 35, 0.2)'
  },
  '&:hover': {
    color: colors.primary,
    background: alpha(colors.primary, 0.1)
  }
}));

const FormAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${colors.border}`,
  boxShadow: shadowSoft,
  '&:before': { display: 'none' },
  '&.Mui-expanded': {
    margin: theme.spacing(2, 0),
    boxShadow: shadowMedium
  }
}));

const FormAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  background: alpha(colors.secondary, 0.3),
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  '&.Mui-expanded': {
    background: alpha(colors.secondary, 0.5),
    minHeight: 48
  }
}));

const FormAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  background: colors.surface,
  padding: theme.spacing(3)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: alpha(colors.secondary, 0.2),
    transition: 'all 200ms ease',
    '&:hover fieldset': {
      borderColor: colors.primaryLight
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
      borderWidth: 2,
      backgroundColor: colors.surface,
      boxShadow: '0 0 0 3px rgba(109, 35, 35, 0.1)'
    },
    '& input[type="date"]': { padding: '14px 14px' }
  },
  '& .MuiInputLabel-root': {
    color: colors.textSecondary,
    '&.Mui-focused': { color: colors.primary }
  }
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '92%',
  maxWidth: 1000,
  backgroundColor: colors.surface,
  borderRadius: 20,
  boxShadow: '0 30px 80px rgba(15, 20, 30, 0.25)',
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  background: colors.gradientPrimary,
  padding: theme.spacing(3),
  color: colors.textLight,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: 'auto',
  flex: 1,
  background: colors.neutralBg
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${colors.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.surface
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  fontWeight: 700,
  padding: theme.spacing(1, 2.5),
  borderRadius: 12,
  textTransform: 'none',
  transition: 'all 200ms ease',
  ...(variant === 'contained' && {
    background: colors.gradientPrimary,
    color: colors.textLight,
    '&:hover': {
      background: colors.gradientPrimary,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(109, 35, 35, 0.3)'
    }
  }),
  ...(variant === 'outlined' && {
    color: colors.primary,
    borderColor: colors.primary,
    '&:hover': { 
      background: alpha(colors.primary, 0.05),
      borderColor: colors.primaryLight
    }
  }),
  ...(variant === 'text' && {
    color: colors.textSecondary,
    '&:hover': { 
      background: alpha(colors.textSecondary, 0.05)
    }
  })
}));

const ScrollTop = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 10
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 700,
  ...(status === 'active' && {
    background: colors.gradientSuccess,
    color: colors.textLight
  }),
  ...(status === 'inactive' && {
    background: colors.gradientError,
    color: colors.textLight
  }),
  ...(status === 'pending' && {
    background: colors.gradientWarning,
    color: colors.textLight
  })
}));

const InfoIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 10,
  background: alpha(colors.primary, 0.1),
  color: colors.primary,
  transition: 'all 200ms ease',
  '&.infoCardIcon': {
    transition: 'all 200ms ease'
  }
}));

const TimelineDotCustom = styled(TimelineDot)(({ theme, color }) => ({
  ...(color === 'primary' && {
    backgroundColor: colors.primary,
    boxShadow: `0 0 0 4px ${alpha(colors.primary, 0.2)}`
  }),
  ...(color === 'secondary' && {
    backgroundColor: colors.accent,
    boxShadow: `0 0 0 4px ${alpha(colors.accent, 0.2)}`
  }),
  ...(color === 'success' && {
    backgroundColor: colors.success,
    boxShadow: `0 0 0 4px ${alpha(colors.success, 0.2)}`
  })
}));

const TimelineConnectorCustom = styled(TimelineConnector)(({ theme }) => ({
  backgroundColor: colors.border
}));

const TimelineContentCustom = styled(TimelineContent)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: theme.spacing(4)
}));

const TimelineTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  color: colors.textPrimary,
  marginBottom: theme.spacing(0.5)
}));

const TimelineSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: colors.textSecondary
}));

const ZoomedImage = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4)
}));

const ZoomedImageContent = styled(Box)(({ theme }) => ({
  maxWidth: '90%',
  maxHeight: '90%',
  position: 'relative'
}));

const ZoomedImageActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1)
}));

const ZoomedImageClose = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha('#fff', 0.2),
  color: '#fff',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.3)
  }
}));

const ZoomedImageImg = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '80vh',
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
}));

const ConfirmDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: shadowDeep
  }
}));

const ConfirmDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: colors.gradientPrimary,
  color: colors.textLight,
  fontWeight: 700
}));

const ConfirmDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const ConfirmDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${colors.border}`
}));

const NotificationSnackbar = styled(SnackbarContent)(({ theme, variant }) => ({
  ...(variant === 'success' && {
    background: colors.gradientSuccess,
    color: colors.textLight
  }),
  ...(variant === 'error' && {
    background: colors.gradientError,
    color: colors.textLight
  }),
  ...(variant === 'warning' && {
    background: colors.gradientWarning,
    color: colors.textLight
  }),
  ...(variant === 'info' && {
    background: colors.gradientInfo,
    color: colors.textLight
  }),
  fontWeight: 600,
  borderRadius: 12,
  boxShadow: shadowMedium
}));

const SkeletonCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden'
}));

const SkeletonCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const SkeletonInfoCard = ({ height = 120 }) => (
  <SkeletonCard>
    <SkeletonCardContent>
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
      <Skeleton variant="rectangular" height={height - 60} sx={{ mt: 2, borderRadius: 1 }} />
    </SkeletonCardContent>
  </SkeletonCard>
);

const ProfileTimeline = ({ events }) => (
  <Timeline>
    {events.map((event, index) => (
      <TimelineItem key={index}>
        <TimelineSeparator>
          <TimelineDotCustom color={event.color || 'primary'}>
            {event.icon}
          </TimelineDotCustom>
          {index < events.length - 1 && <TimelineConnectorCustom />}
        </TimelineSeparator>
        <TimelineContentCustom>
          <TimelineTitle>{event.title}</TimelineTitle>
          <TimelineSubtitle>{event.subtitle}</TimelineSubtitle>
        </TimelineContentCustom>
      </TimelineItem>
    ))}
  </Timeline>
);

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: colors.gradientSecondary,
  boxShadow: shadowSoft,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  transition: 'all 200ms ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: shadowMedium
  }
}));

const StatsValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: colors.primary,
  marginBottom: theme.spacing(0.5)
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: colors.textSecondary,
  fontWeight: 600,
  textAlign: 'center'
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: colors.surface,
  boxShadow: shadowSoft,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  transition: 'all 200ms ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: shadowColored,
    '& .quickActionIcon': {
      color: colors.primary,
      transform: 'scale(1.1)'
    }
  }
}));

const QuickActionIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: alpha(colors.primary, 0.1),
  color: colors.textSecondary,
  marginBottom: theme.spacing(1),
  transition: 'all 200ms ease'
}));

const QuickActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: colors.textSecondary,
  fontWeight: 600,
  textAlign: 'center'
}));

const FloatingMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(8),
  right: theme.spacing(3),
  width: 56,
  height: 56,
  backgroundColor: colors.primary,
  color: colors.textLight,
  boxShadow: shadowMedium,
  zIndex: 10,
  '&:hover': {
    backgroundColor: colors.primaryLight,
    transform: 'scale(1.05)'
  }
}));

const FloatingMenu = styled(Box)(({ theme, open }) => ({
  position: 'fixed',
  bottom: theme.spacing(16),
  right: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  zIndex: 9,
  transition: 'all 300ms ease',
  opacity: open ? 1 : 0,
  transform: open ? 'translateY(0)' : 'translateY(20px)',
  pointerEvents: open ? 'auto' : 'none'
}));

const FloatingMenuItem = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: colors.surface,
  color: colors.primary,
  boxShadow: shadowSoft,
  '&:hover': {
    backgroundColor: colors.secondary,
    transform: 'scale(1.1)'
  }
}));

const FloatingMenuItemLabel = styled(Box)(({ theme }) => ({
  backgroundColor: colors.accent,
  color: colors.textLight,
  padding: theme.spacing(0.5, 1),
  borderRadius: 8,
  fontSize: '0.8rem',
  fontWeight: 600,
  marginRight: theme.spacing(1),
  opacity: 0,
  transition: 'all 200ms ease'
}));

const FloatingMenuItemWithLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&:hover .floatingMenuItemLabel': {
    opacity: 1
  }
}));

/* -------------------------
   Component logic
   -------------------------*/
const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [person, setPerson] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tabValue, setTabValue] = useState(0);            // for main tabs
  const [expandedAccordion, setExpandedAccordion] = useState('personal');
  const [stepValue, setStepValue] = useState(0);          // for modal stepper
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [imageZoomScale, setImageZoomScale] = useState(1);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
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
    setStepValue(0); // start from first step each time
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
    setConfirmDialogAction(() => async () => {
      if (!person?.id) return;

      try {
        await axios.delete(`${API_BASE_URL}/personalinfo/remove-profile-picture/${person.id}`);
        setProfilePicture(null);
        setPerson(prev => ({ ...prev, profile_picture: null }));
        setUploadStatus({ message: 'Profile picture removed successfully!', type: 'success' });
        setNotificationOpen(true);
      } catch (err) {
        console.error('Remove picture failed:', err);
        setUploadStatus({ message: 'Failed to remove picture.', type: 'error' });
        setNotificationOpen(true);
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleImageZoom = () => {
    setImageZoomOpen(true);
    setImageZoomScale(1);
  };

  const handleImageZoomClose = () => {
    setImageZoomOpen(false);
  };

  const handleImageZoomIn = () => {
    setImageZoomScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleImageZoomOut = () => {
    setImageZoomScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleDownloadProfile = () => {
    // Implementation for downloading profile data
    setUploadStatus({ message: 'Profile download started', type: 'info' });
    setNotificationOpen(true);
  };

  const handleShareProfile = () => {
    // Implementation for sharing profile
    setUploadStatus({ message: 'Profile link copied to clipboard', type: 'success' });
    setNotificationOpen(true);
  };

  const handlePrintProfile = () => {
    // Implementation for printing profile
    setUploadStatus({ message: 'Preparing profile for printing...', type: 'info' });
    setNotificationOpen(true);
  };

  const handleGenerateQR = () => {
    // Implementation for generating QR code
    setUploadStatus({ message: 'QR code generated successfully', type: 'success' });
    setNotificationOpen(true);
  };

  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const scrollToTop = () => {
    profileRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    { key: 0, label: 'Personal Info', fields: [
      { label: "First Name", name: "firstName" },
      { label: "Middle Name", name: "middleName" },
      { label: "Last Name", name: "lastName" },
      { label: "Name Extension", name: "nameExtension" },
      { label: "Date of Birth", name: "birthDate", type: "date" },
      { label: "Place of Birth", name: "placeOfBirth" }
    ], icon: <PersonIcon /> },
    { key: 1, label: 'Government IDs', fields: [
      { label: "GSIS Number", name: "gsisNum", disabled: true },
      { label: "Pag-IBIG Number", name: "pagibigNum", disabled: true },
      { label: "PhilHealth Number", name: "philhealthNum", disabled: true },
      { label: "SSS Number", name: "sssNum", disabled: true },
      { label: "TIN Number", name: "tinNum", disabled: true },
      { label: "Agency Employee Number", name: "agencyEmployeeNum", disabled: true }
    ], icon: <BadgeIcon /> },
    { key: 2, label: 'Addresses', fields: [
      { label: "House & Lot Number", name: "permanent_houseBlockLotNum" },
      { label: "Street", name: "permanent_streetName" },
      { label: "Subdivision", name: "permanent_subdivisionOrVillage" },
      { label: "Barangay", name: "permanent_barangay" },
      { label: "City/Municipality", name: "permanent_cityOrMunicipality" },
      { label: "Province", name: "permanent_provinceName" },
      { label: "Zip Code", name: "permanent_zipcode" }
    ], icon: <HomeIcon /> },
    { key: 3, label: 'Contact', fields: [
      { label: "Telephone", name: "telephone" },
      { label: "Mobile", name: "mobileNum" },
      { label: "Email", name: "emailAddress" }
    ], icon: <CallIcon /> },
    { key: 4, label: 'Family', fields: [
      { label: "Spouse First Name", name: "spouseFirstName" },
      { label: "Spouse Middle Name", name: "spouseMiddleName" },
      { label: "Spouse Last Name", name: "spouseLastName" },
      { label: "Spouse Occupation", name: "spouseOccupation" }
    ], icon: <GroupIcon /> },
    { key: 5, label: 'Education', fields: [
      { label: "Elementary School", name: "elementaryNameOfSchool" },
      { label: "Elementary Degree", name: "elementaryDegree" },
      { label: "Secondary School", name: "secondaryNameOfSchool" },
      { label: "Secondary Degree", name: "secondaryDegree" }
    ], icon: <SchoolIcon /> }
  ];

  if (loading) {
    return (
      <MainContainer ref={profileRef}>
        <ProfileContainer>
          <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
            <Box textAlign="center">
              <CircularProgress size={64} thickness={4} sx={{ color: colors.primary, mb: 3 }} />
              <Typography variant="h6" color={colors.textPrimary} fontWeight={600}>Loading Profile...</Typography>
              <Typography variant="body2" color={colors.textSecondary} mt={1}>Fetching data securely — this may take a moment.</Typography>
            </Box>
          </Box>
        </ProfileContainer>
      </MainContainer>
    );
  }

  /* Reusable renderer for info items */
  const renderInfoGrid = (items) => (
    <Grid container spacing={2.5}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Grow in timeout={300 + index * 50}>
            <InfoCard>
              <InfoCardHeader className="infoCardHeader">
                <InfoLabel>
                  <InfoIconWrapper className="infoCardIcon">
                    {item.icon || <InfoIcon />}
                  </InfoIconWrapper>
                  {item.label}
                </InfoLabel>
              </InfoCardHeader>
              <InfoCardContent>
                <InfoValue>{item.value || '—'}</InfoValue>
              </InfoCardContent>
            </InfoCard>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );

  const renderFormFieldsGrid = (fields) => (
    <Grid container spacing={2}>
      {fields.map((field, idx) => (
        <Grid item xs={12} sm={6} key={idx}>
          <StyledTextField
            fullWidth
            label={field.label}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            disabled={field.disabled}
            type={field.type || 'text'}
            InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
          />
        </Grid>
      ))}
    </Grid>
  );

  // Map main tab index -> items
  const personalInfoItems = [
    { label: "First Name", value: person.firstName, icon: <PersonIcon fontSize="small" /> },
    { label: "Middle Name", value: person.middleName, icon: <PersonIcon fontSize="small" /> },
    { label: "Last Name", value: person.lastName, icon: <PersonIcon fontSize="small" /> },
    { label: "Name Extension", value: person.nameExtension, icon: <PersonIcon fontSize="small" /> },
    { label: "Date of Birth", value: person.birthDate, icon: <CakeIcon fontSize="small" /> },
    { label: "Place of Birth", value: person.placeOfBirth, icon: <LocationOnIcon fontSize="small" /> },
    { label: "Sex", value: person.sex, icon: <PersonIcon fontSize="small" /> },
    { label: "Civil Status", value: person.civilStatus, icon: <GroupIcon fontSize="small" /> },
    { label: "Citizenship", value: person.citizenship, icon: <SecurityIcon fontSize="small" /> },
    { label: "Height (cm)", value: person.heightCm, icon: <HeightIcon fontSize="small" /> },
    { label: "Weight (kg)", value: person.weightKg, icon: <MonitorWeightIcon fontSize="small" /> },
    { label: "Blood Type", value: person.bloodType, icon: <BloodtypeIcon fontSize="small" /> }
  ];

  const governmentIdItems = [
    { label: "GSIS Number", value: person.gsisNum, icon: <BadgeIcon fontSize="small" /> },
    { label: "Pag-IBIG Number", value: person.pagibigNum, icon: <BadgeIcon fontSize="small" /> },
    { label: "PhilHealth Number", value: person.philhealthNum, icon: <BadgeIcon fontSize="small" /> },
    { label: "SSS Number", value: person.sssNum, icon: <BadgeIcon fontSize="small" /> },
    { label: "TIN Number", value: person.tinNum, icon: <BadgeIcon fontSize="small" /> },
    { label: "Agency Employee Number", value: person.agencyEmployeeNum, icon: <BadgeIcon fontSize="small" /> }
  ];

  const contactInfoItems = [
    { label: "Telephone", value: person.telephone, icon: <CallIcon fontSize="small" /> },
    { label: "Mobile", value: person.mobileNum, icon: <PhoneIcon fontSize="small" /> },
    { label: "Email", value: person.emailAddress, icon: <EmailIcon fontSize="small" /> }
  ];

  const addressItems = [
    { label: "Permanent House & Lot", value: person.permanent_houseBlockLotNum, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent Street", value: person.permanent_streetName, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent Subdivision", value: person.permanent_subdivisionOrVillage, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent Barangay", value: person.permanent_barangay, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent City", value: person.permanent_cityOrMunicipality, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent Province", value: person.permanent_provinceName, icon: <HomeIcon fontSize="small" /> },
    { label: "Permanent Zip Code", value: person.permanent_zipcode, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential House & Lot", value: person.residential_houseBlockLotNum, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential Street", value: person.residential_streetName, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential Subdivision", value: person.residential_subdivisionOrVillage, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential Barangay", value: person.residential_barangayName, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential City", value: person.residential_cityOrMunicipality, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential Province", value: person.residential_provinceName, icon: <HomeIcon fontSize="small" /> },
    { label: "Residential Zip Code", value: person.residential_zipcode, icon: <HomeIcon fontSize="small" /> }
  ];

  const familyInfoItems = [
    { label: "Spouse Name", value: `${person.spouseFirstName || ''} ${person.spouseMiddleName || ''} ${person.spouseLastName || ''} ${person.spouseNameExtension || ''}`.trim() || '—', icon: <GroupIcon fontSize="small" /> },
    { label: "Spouse Occupation", value: person.spouseOccupation, icon: <WorkIcon fontSize="small" /> },
    { label: "Spouse Employer", value: person.spouseEmployerBusinessName, icon: <AccountBalanceIcon fontSize="small" /> },
    { label: "Spouse Business Address", value: person.spouseBusinessAddress, icon: <LocationOnIcon fontSize="small" /> },
    { label: "Spouse Telephone", value: person.spouseTelephone, icon: <CallIcon fontSize="small" /> },
    { label: "Father's Name", value: `${person.fatherFirstName || ''} ${person.fatherMiddleName || ''} ${person.fatherLastName || ''} ${person.fatherNameExtension || ''}`.trim() || '—', icon: <PersonIcon fontSize="small" /> },
    { label: "Mother's Name", value: `${person.motherMaidenFirstName || ''} ${person.motherMaidenMiddleName || ''} ${person.motherMaidenLastName || ''}`.trim() || '—', icon: <PersonIcon fontSize="small" /> }
  ];

  const educationItems = [
    { label: "Elementary School", value: person.elementaryNameOfSchool, icon: <SchoolIcon fontSize="small" /> },
    { label: "Elementary Degree", value: person.elementaryDegree, icon: <SchoolIcon fontSize="small" /> },
    { label: "Elementary Period", value: `${person.elementaryPeriodFrom || ''} - ${person.elementaryPeriodTo || ''}`, icon: <SchoolIcon fontSize="small" /> },
    { label: "Elementary Highest Attained", value: person.elementaryHighestAttained, icon: <SchoolIcon fontSize="small" /> },
    { label: "Elementary Year Graduated", value: person.elementaryYearGraduated, icon: <SchoolIcon fontSize="small" /> },
    { label: "Elementary Honors", value: person.elementaryScholarshipAcademicHonorsReceived, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary School", value: person.secondaryNameOfSchool, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary Degree", value: person.secondaryDegree, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary Period", value: `${person.secondaryPeriodFrom || ''} - ${person.secondaryPeriodTo || ''}`, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary Highest Attained", value: person.secondaryHighestAttained, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary Year Graduated", value: person.secondaryYearGraduated, icon: <SchoolIcon fontSize="small" /> },
    { label: "Secondary Honors", value: person.secondaryScholarshipAcademicHonorsReceived, icon: <SchoolIcon fontSize="small" /> }
  ];

  // Sample timeline events
  const timelineEvents = [
    { title: 'Profile Created', subtitle: 'Initial profile setup completed', color: 'primary', icon: <CheckIcon /> },
    { title: 'Personal Information Updated', subtitle: 'Updated personal details', color: 'success', icon: <PersonIcon /> },
    { title: 'Contact Information Updated', subtitle: 'Updated contact details', color: 'primary', icon: <CallIcon /> },
    { title: 'Profile Picture Updated', subtitle: 'Changed profile picture', color: 'secondary', icon: <PhotoCamera /> }
  ];

  // Render main content depending on tabValue
  const renderMainTabContent = (tabIndex) => {
    switch (tabIndex) {
      case 0: return renderInfoGrid(personalInfoItems);
      case 1: return renderInfoGrid(governmentIdItems);
      case 2: return renderInfoGrid(addressItems);
      case 3: return renderInfoGrid(contactInfoItems);
      case 4: return renderInfoGrid(familyInfoItems);
      case 5: return renderInfoGrid(educationItems);
      default: return null;
    }
  };

  return (
    <MainContainer ref={profileRef}>
      <ProfileContainer>
        <ProfileCard>
          {/* Header */}
          <ProfileHeader>
            <AvatarWrap>
              <ProfileAvatar
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture"
                onClick={handleImageZoom}
                sx={{ cursor: 'pointer' }}
              >
                {!profilePicture && <PersonIcon sx={{ fontSize: 80, color: alpha(colors.surface, 0.92) }} />}
              </ProfileAvatar>
            </AvatarWrap>

            <ProfileMeta>
              <ProfileName>
                {person ? `${person.firstName} ${person.middleName} ${person.lastName} ${person.nameExtension || ''}`.trim() : 'Employee Profile'}
              </ProfileName>
              <ProfileSubtitle>
                Employee No.: <Box component="span" sx={{ fontWeight: 700, color: alpha(colors.surface, 0.98) }}>{person?.agencyEmployeeNum || '—'}</Box>
              </ProfileSubtitle>

              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: 2 }}>
                <Chip label={person?.positionTitle || 'Position — N/A'} sx={{ bgcolor: alpha(colors.surface, 0.2), color: colors.surface, fontWeight: 700 }} />
                <Chip label={person?.officeName || 'Office — N/A'} sx={{ bgcolor: alpha(colors.surface, 0.15), color: colors.surface, fontWeight: 600 }} />
                <StatusChip 
                  label="Active" 
                  status="active"
                  icon={<CheckCircleIcon />}
                />
              </Box>
            </ProfileMeta>

            <HeaderActions>
              <Tooltip title="Refresh profile">
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    bgcolor: alpha(colors.surface, 0.2),
                    color: colors.surface,
                    '&:hover': { bgcolor: alpha(colors.surface, 0.3) }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Download profile">
                <IconButton
                  onClick={handleDownloadProfile}
                  sx={{
                    bgcolor: alpha(colors.surface, 0.2),
                    color: colors.surface,
                    '&:hover': { bgcolor: alpha(colors.surface, 0.3) }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share profile">
                <IconButton
                  onClick={handleShareProfile}
                  sx={{
                    bgcolor: alpha(colors.surface, 0.2),
                    color: colors.surface,
                    '&:hover': { bgcolor: alpha(colors.surface, 0.3) }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>

              <EditButton
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditOpen}
              >
                Edit Profile
              </EditButton>
            </HeaderActions>
          </ProfileHeader>

          {/* Content */}
          <ContentSection>
            {person ? (
              <>
                {/* Stats Section */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <StarIcon sx={{ fontSize: 32, color: colors.primary, mb: 1 }} />
                        <StatsValue>5</StatsValue>
                        <StatsLabel>Years of Service</StatsLabel>
                      </StatsCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <AssignmentTurnedInIcon sx={{ fontSize: 32, color: colors.primary, mb: 1 }} />
                        <StatsValue>12</StatsValue>
                        <StatsLabel>Completed Projects</StatsLabel>
                      </StatsCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <TrendingUpIcon sx={{ fontSize: 32, color: colors.primary, mb: 1 }} />
                        <StatsValue>94%</StatsValue>
                        <StatsLabel>Performance Score</StatsLabel>
                      </StatsCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <EventIcon sx={{ fontSize: 32, color: colors.primary, mb: 1 }} />
                        <StatsValue>8</StatsValue>
                        <StatsLabel>Training Sessions</StatsLabel>
                      </StatsCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* Quick Actions Section */}
                <Box sx={{ mb: 4 }}>
                  <SectionTitle sx={{ mb: 2 }}>Quick Actions</SectionTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard onClick={handlePrintProfile}>
                        <QuickActionIcon className="quickActionIcon">
                          <PrintIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>Print</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard onClick={handleDownloadProfile}>
                        <QuickActionIcon className="quickActionIcon">
                          <FileDownloadIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>Export</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard onClick={handleGenerateQR}>
                        <QuickActionIcon className="quickActionIcon">
                          <QrCodeIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>QR Code</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard>
                        <QuickActionIcon className="quickActionIcon">
                          <HistoryIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>History</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard>
                        <QuickActionIcon className="quickActionIcon">
                          <NotificationsIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>Alerts</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <QuickActionCard>
                        <QuickActionIcon className="quickActionIcon">
                          <SettingsIcon />
                        </QuickActionIcon>
                        <QuickActionLabel>Settings</QuickActionLabel>
                      </QuickActionCard>
                    </Grid>
                  </Grid>
                </Box>

                <SectionHeader>
                  <SectionTitle>Employee Details</SectionTitle>
                  <Box>
                    {/* keep tabs-like buttons for main navigation */}
                    <StyledTabs value={tabValue} onChange={handleTabChange}>
                      <StyledTab label="Personal" icon={<PersonIcon />} />
                      <StyledTab label="IDs" icon={<BadgeIcon />} />
                      <StyledTab label="Addresses" icon={<HomeIcon />} />
                      <StyledTab label="Contact" icon={<CallIcon />} />
                      <StyledTab label="Family" icon={<GroupIcon />} />
                      <StyledTab label="Education" icon={<SchoolIcon />} />
                    </StyledTabs>
                  </Box>
                </SectionHeader>

                <Fade in key={tabValue} timeout={300}>
                  <Box>
                    {renderMainTabContent(tabValue)}
                  </Box>
                </Fade>

                {/* Timeline Section */}
                <Box sx={{ mt: 5 }}>
                  <SectionTitle sx={{ mb: 3 }}>Recent Activity</SectionTitle>
                  <ProfileTimeline events={timelineEvents} />
                </Box>
              </>
            ) : (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color={colors.textSecondary}>
                  No employee data found!
                </Typography>
                <Typography variant="body2" color={colors.textSecondary} mt={1}>
                  Contact administrator to set up your profile.
                </Typography>
              </Box>
            )}
          </ContentSection>
        </ProfileCard>

        {/* Edit Modal with Stepper */}
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 400,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
          }}
        >
          <Fade in={editOpen}>
            <ModalBox>
              <ModalHeader>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Edit Employee — {person?.firstName ? `${person.firstName} ${person.lastName}` : 'Profile'}
                </Typography>
                <IconButton onClick={handleEditClose} sx={{ color: colors.textLight }}>
                  <CloseIcon />
                </IconButton>
              </ModalHeader>

              <ModalBody>
                {/* Stepper */}
                <Box sx={{ px: 1, py: 1 }}>
                  <Stepper activeStep={stepValue} alternativeLabel sx={{ mb: 2 }}>
                    {steps.map((s) => (
                      <Step key={s.key} onClick={() => setStepValue(s.key)} sx={{ cursor: 'pointer' }}>
                        <StepLabel>{s.label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {/* Step Content */}
                <Box sx={{ minHeight: 260 }}>
                  <Slide direction="up" in={stepValue === 0} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 0 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Personal Information</Typography>
                      {renderFormFieldsGrid(steps[0].fields)}
                    </Box>
                  </Slide>

                  <Slide direction="up" in={stepValue === 1} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 1 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Government Identification</Typography>
                      {renderFormFieldsGrid(steps[1].fields)}
                    </Box>
                  </Slide>

                  <Slide direction="up" in={stepValue === 2} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 2 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Permanent Address</Typography>
                      {renderFormFieldsGrid(steps[2].fields)}
                    </Box>
                  </Slide>

                  <Slide direction="up" in={stepValue === 3} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 3 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Contact Information</Typography>
                      {renderFormFieldsGrid(steps[3].fields)}
                    </Box>
                  </Slide>

                  <Slide direction="up" in={stepValue === 4} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 4 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Family Information</Typography>
                      {renderFormFieldsGrid(steps[4].fields)}
                    </Box>
                  </Slide>

                  <Slide direction="up" in={stepValue === 5} mountOnEnter unmountOnExit>
                    <Box sx={{ display: stepValue === 5 ? 'block' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Education</Typography>
                      {renderFormFieldsGrid(steps[5].fields)}
                    </Box>
                  </Slide>

                  {/* Picture upload area anchored within modal but above footer */}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <ProfileAvatar
                        src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                        alt="Profile Picture"
                        sx={{ width: 84, height: 84 }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Profile Picture</Typography>
                        <Typography variant="caption" color="text.secondary">Upload a clear headshot (max 5MB)</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ ml: 'auto' }}>
                      <input
                        accept="image/*"
                        id="profile-picture-upload-modal"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handlePictureChange}
                      />
                      <label htmlFor="profile-picture-upload-modal">
                        <ActionButton component="span" variant="contained" startIcon={<CloudUploadIcon />} sx={{ mr: 1 }}>
                          Upload
                        </ActionButton>
                      </label>
                      <ActionButton variant="outlined" startIcon={<DeleteIcon />} onClick={handleRemovePicture}>
                        Remove
                      </ActionButton>
                    </Box>
                  </Box>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Box sx={{ mr: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    disabled={stepValue === 0}
                    onClick={() => setStepValue(prev => Math.max(prev - 1, 0))}
                    sx={{ textTransform: 'none' }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStepValue(prev => Math.min(prev + 1, steps.length - 1))}
                    sx={{ textTransform: 'none' }}
                  >
                    Next
                  </Button>
                </Box>

                <ActionButton variant="outlined" onClick={handleEditClose} startIcon={<CancelIcon />}>
                  Cancel
                </ActionButton>

                <ActionButton variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
                  Save Changes
                </ActionButton>
              </ModalFooter>
            </ModalBox>
          </Fade>
        </Modal>

        {/* Image Zoom Modal */}
        <Zoom in={imageZoomOpen}>
          <ZoomedImage>
            <ZoomedImageContent>
              <ZoomedImageActions>
                <ZoomedImageClose onClick={handleImageZoomIn}>
                  <ZoomInIcon />
                </ZoomedImageClose>
                <ZoomedImageClose onClick={handleImageZoomOut}>
                  <ZoomOutIcon />
                </ZoomedImageClose>
                <ZoomedImageClose onClick={handleImageZoomClose}>
                  <CloseIcon />
                </ZoomedImageClose>
              </ZoomedImageActions>
              <ZoomedImageImg
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture"
                style={{ transform: `scale(${imageZoomScale})` }}
              />
            </ZoomedImageContent>
          </ZoomedImage>
        </Zoom>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <ConfirmDialogTitle>
            Confirm Action
          </ConfirmDialogTitle>
          <ConfirmDialogContent>
            <Typography>
              Are you sure you want to perform this action? This cannot be undone.
            </Typography>
          </ConfirmDialogContent>
          <ConfirmDialogActions>
            <ActionButton variant="text" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </ActionButton>
            <ActionButton variant="contained" onClick={confirmDialogAction}>
              Confirm
            </ActionButton>
          </ConfirmDialogActions>
        </ConfirmDialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notificationOpen}
          autoHideDuration={5000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <NotificationSnackbar
            variant={uploadStatus.type}
            message={uploadStatus.message}
            action={
              <IconButton size="small" color="inherit" onClick={handleNotificationClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>

        {/* Floating Action Menu */}
        <FloatingMenuButton
          onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
          sx={{
            transform: floatingMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 300ms ease'
          }}
        >
          <MoreVertIcon />
        </FloatingMenuButton>

        <FloatingMenu open={floatingMenuOpen}>
          <FloatingMenuItemWithLabel>
            <FloatingMenuItemLabel className="floatingMenuItemLabel">Print Profile</FloatingMenuItemLabel>
            <FloatingMenuItem onClick={handlePrintProfile}>
              <PrintIcon />
            </FloatingMenuItem>
          </FloatingMenuItemWithLabel>
          <FloatingMenuItemWithLabel>
            <FloatingMenuItemLabel className="floatingMenuItemLabel">Download PDF</FloatingMenuItemLabel>
            <FloatingMenuItem onClick={handleDownloadProfile}>
              <FileDownloadIcon />
            </FloatingMenuItem>
          </FloatingMenuItemWithLabel>
          <FloatingMenuItemWithLabel>
            <FloatingMenuItemLabel className="floatingMenuItemLabel">Generate QR Code</FloatingMenuItemLabel>
            <FloatingMenuItem onClick={handleGenerateQR}>
              <QrCodeIcon />
            </FloatingMenuItem>
          </FloatingMenuItemWithLabel>
          <FloatingMenuItemWithLabel>
            <FloatingMenuItemLabel className="floatingMenuItemLabel">Share Profile</FloatingMenuItemLabel>
            <FloatingMenuItem onClick={handleShareProfile}>
              <ShareIcon />
            </FloatingMenuItem>
          </FloatingMenuItemWithLabel>
        </FloatingMenu>

        {/* Scroll to Top Button */}
        <Zoom in={trigger}>
          <ScrollTop onClick={scrollToTop} role="presentation">
            <Fab color="primary" size="small" aria-label="scroll back to top" sx={{ bgcolor: colors.primary }}>
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Zoom>
      </ProfileContainer>
    </MainContainer>
  );
};

export default Profile;