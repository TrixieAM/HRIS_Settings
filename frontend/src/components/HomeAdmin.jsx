import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container, Box, Grid, Dialog, Typography, Avatar, Button, IconButton, Tooltip, Modal, Badge, Paper, Card, CardContent, LinearProgress, Chip, Fade, Grow, Skeleton, Menu, MenuItem, Divider, List, ListItem, ListItemText, ListItemIcon, Checkbox, Tab, Tabs, TextField, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import {
  Notifications as NotificationsIcon, ArrowDropDown as ArrowDropDownIcon, AccessTime, Receipt, ContactPage, UploadFile, Person, GroupAdd, TransferWithinAStation, Group, Pages, ReceiptLong, AcUnit, TrendingUp, TrendingDown, ArrowForward, PlayArrow, Pause, MoreVert,
  AccountCircle, Settings, HelpOutline, PrivacyTip, Logout, Event, Schedule, Lock, Star, Upgrade, Add, Close, Money, Work, Assessment, Timeline, Delete, Edit, Build,
  PersonAdd
} from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentIcon from "@mui/icons-material/Payment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { 
  WorkHistory as WorkHistoryIcon,
  ReceiptLong as ReceiptLongIcon,
  HourglassBottom as HourglassBottomIcon,  
  History
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend, LineChart, Line, Area, AreaChart, RadialBarChart, RadialBar,
} from "recharts";
import logo from "../assets/logo.PNG";
import SuccessfulOverlay from "./SuccessfulOverlay";


// Color palette from Settings component
const primaryGradient = "linear-gradient(135deg, #800020, #A52A2A)";
const primaryHoverGradient = "linear-gradient(135deg, #A52A2A, #800020)";
const darkText = "#4B0000";
const mediumText = "#800020";
const cardBackground = "rgba(255,248,231,0.85)";
const cardBorder = "rgba(128,0,32,0.15)";
const cardShadow = "0 15px 40px rgba(128,0,32,0.2)";

// Configuration - Removed leave-related cards
const STAT_CARDS = [
  {
    label: "Total Employees",
    valueKey: "employees",
    defaultValue: 0,
    textValue: "Total Employees",
    icon: <PeopleIcon />,
    gradient: primaryGradient,
    shadow: cardShadow,
    trend: "+5%",
    trendUp: true,
  },
  {
    label: "Present Today",
    valueKey: "todayAttendance",
    defaultValue: 0,
    textValue: "Today's Attendance",
    icon: <EventAvailableIcon />,
    gradient: primaryHoverGradient,
    shadow: cardShadow,
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Pending Payroll",
    valueKey: "pendingPayroll",
    defaultValue: 0,
    textValue: "Payroll Processing",
    icon: <PendingActionsIcon />,
    gradient: "linear-gradient(135deg, #800020, #A52A2A)",
    shadow: cardShadow,
    trend: "-8%",
    trendUp: false,
  },
  {
    label: "Processed Payroll",
    valueKey: "processedPayroll",
    defaultValue: 0,
    textValue: "Payroll Processed",
    icon: <WorkHistoryIcon />,
    gradient: "linear-gradient(135deg, #6A0DAD, #8A2BE2)",
    shadow: cardShadow,
    trend: "+6%",
    trendUp: true,
  },
  {
    label: "Released Payslips",
    valueKey: "payslipCount",
    defaultValue: 0,
    textValue: "Payslip Released",
    icon: <ReceiptLongIcon />,
    gradient: "linear-gradient(135deg, #FF7F50, #FF6347)",
    shadow: cardShadow,
    trend: "+2%",
    trendUp: true,
  },
];

const QUICK_ACTIONS = [
  { label: "Users", link: "/users-list", icon: <Group />, gradient: primaryGradient },
  { label: "Payroll", link: "/payroll-table", icon: <PaymentsIcon />, gradient: primaryHoverGradient },
  { label: "Leaves", link: "/leave-request", icon: <TransferWithinAStation />, gradient: "linear-gradient(135deg, #800020, #A52A2A)" },
  { label: "DTRs", link: "/daily_time_record_faculty", icon: <AccessTimeIcon />, gradient: "linear-gradient(135deg, #A52A2A, #800020)" },
  { label: "Announcements", link: "/announcement", icon: <CampaignIcon />, gradient: "linear-gradient(135deg, #800020, #A52A2A)" },
  { label: "Holidays", link: "/holiday", icon: <AcUnit />, gradient: "linear-gradient(135deg, #A52A2A, #800020)" },
  { label: "Audit Logs", link: "/audit-logs", icon: <History />, gradient: "linear-gradient(135deg, #A52A2A, #800020)" },
  { label: "Registration", link: "/registration", icon: <PersonAdd />, gradient: "linear-gradient(135deg, #A52A2A, #800020)" },
  { label: "Payslip", link: "/distribution-payslip", icon: <PersonAdd />, gradient: "linear-gradient(135deg, #A52A2A, #800020)" },
];


const COLORS = ['#800020', '#A52A2A', '#8B0000', '#660000', '#4B0000'];

// Custom hooks
const useAuth = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const getUserInfo = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return { role: decoded.role, employeeNumber: decoded.employeeNumber, username: decoded.username };
    } catch (err) {
      return {};
    }
  }, []);

  useEffect(() => {
    const u = getUserInfo();
    if (u.username) setUsername(u.username);
    if (u.employeeNumber) setEmployeeNumber(u.employeeNumber);
  }, [getUserInfo]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const list = Array.isArray(res.data) ? res.data : [];
        const match = list.find((p) => String(p.agencyEmployeeNum) === String(employeeNumber));
        if (match) {
          if (match.profile_picture) setProfilePicture(match.profile_picture);
          const fullNameFromPerson = `${match.firstName || ''} ${match.middleName || ''} ${match.lastName || ''} ${match.nameExtension || ''}`.trim();
          if (fullNameFromPerson) setFullName(fullNameFromPerson);
        }
      } catch (err) {
        console.error('Error loading profile picture:', err);
      }
    };
    if (employeeNumber) fetchProfilePicture();
  }, [employeeNumber]);

  return { username, fullName, employeeNumber, profilePicture };
};

// REPLACE the existing useDashboardData hook in AdminHome.jsx with this complete version

const useDashboardData = () => {
  const [stats, setStats] = useState({
    employees: 0,
    turnoverRate: 32,
    happinessRate: 78,
    teamKPI: 84.45,
    todayAttendance: 0,
    pendingPayroll: 0,
    processedPayroll: 0,
    payslipCount: 0
  });
  
  // Overview Tab Data
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]);
  const [departmentAttendanceData, setDepartmentAttendanceData] = useState([]);
  const [payrollStatusData, setPayrollStatusData] = useState([
    { status: "Processed", value: 0, fill: '#800020' },
    { status: "Pending", value: 0, fill: '#A52A2A' },
    { status: "Failed", value: 0, fill: '#f44336' },
  ]);
  
  // Analytics Tab Data - Keep existing dummy data as fallback
  const [monthlyAttendanceTrend, setMonthlyAttendanceTrend] = useState([
    { month: "Jan", attendance: 94.2, leaves: 8.5, overtime: 12.3 },
    { month: "Feb", attendance: 93.8, leaves: 9.2, overtime: 11.8 },
    { month: "Mar", attendance: 95.1, leaves: 7.8, overtime: 13.5 },
    { month: "Apr", attendance: 94.7, leaves: 8.9, overtime: 12.1 },
    { month: "May", attendance: 93.5, leaves: 10.2, overtime: 10.8 },
    { month: "Jun", attendance: 94.0, leaves: 9.1, overtime: 11.5 },
  ]);
  
  const [payrollTrendData, setPayrollTrendData] = useState([
    { month: "Jan", grossPay: 2450000, netPay: 1980000, deductions: 470000 },
    { month: "Feb", grossPay: 2480000, netPay: 2005000, deductions: 475000 },
    { month: "Mar", grossPay: 2520000, netPay: 2030000, deductions: 490000 },
    { month: "Apr", grossPay: 2490000, netPay: 2010000, deductions: 480000 },
    { month: "May", grossPay: 2550000, netPay: 2050000, deductions: 500000 },
    { month: "Jun", grossPay: 2580000, netPay: 2075000, deductions: 505000 },
  ]);
  
  const [attendanceChartData, setAttendanceChartData] = useState([
    { name: "Present", value: 0, fill: '#800020' },
    { name: "Absent", value: 0, fill: '#A52A2A' },
    { name: "Late", value: 0, fill: '#8B0000' },
  ]);
  
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        console.log(' Starting data fetch...');

        // ===== 1. Fetch Dashboard Stats =====
        try {
          console.log('📊 Fetching dashboard stats...');
          const dashboardStatsRes = await axios.get(`${API_BASE_URL}/api/dashboard/stats`, { headers });
          const dashStats = dashboardStatsRes.data;
          
          console.log('✅ Dashboard stats received:', dashStats);
          
          setStats(prev => ({
            ...prev,
            employees: dashStats.totalEmployees || 0,
            todayAttendance: dashStats.presentToday || 0,
          }));

          // Calculate attendance chart data from stats
          const totalEmp = dashStats.totalEmployees || 0;
          const presentToday = dashStats.presentToday || 0;
          const absentToday = totalEmp - presentToday;
          
          setAttendanceChartData([
            { name: "Present", value: presentToday, fill: '#800020' },
            { name: "Absent", value: absentToday, fill: '#A52A2A' },
            { name: "Late", value: 0, fill: '#8B0000' },
          ]);

          console.log('📈 Attendance chart data updated:', { present: presentToday, absent: absentToday });

        } catch (err) {
          console.error(" Failed to fetch dashboard stats:", err?.message);
        }

        // ===== 2. Fetch Weekly Attendance Overview =====
        try {
          console.log('📅 Fetching weekly attendance...');
          const weeklyAttendanceRes = await axios.get(
            `${API_BASE_URL}/api/dashboard/attendance-overview?days=5`, 
            { headers }
          );
          const weeklyData = weeklyAttendanceRes.data;
          
          console.log('✅ Weekly attendance received:', weeklyData);
          
          // Transform to match chart format
          const transformedWeekly = weeklyData.map(item => ({
            day: item.day,
            present: item.present,
            absent: 0,
            late: 0
          }));
          
          setWeeklyAttendanceData(transformedWeekly);
          console.log('Weekly chart updated with', transformedWeekly.length, 'days');

        } catch (err) {
          console.error(" Failed to fetch weekly attendance:", err?.message);
          // Keep empty array as fallback
          setWeeklyAttendanceData([]);
        }

        // ===== 3. Fetch Department Distribution =====
        try {
          console.log('Fetching department distribution...');
          const deptDistRes = await axios.get(
            `${API_BASE_URL}/api/dashboard/department-distribution`, 
            { headers }
          );
          const deptData = deptDistRes.data;
          
          console.log(' Department data received:', deptData);
          
          // Transform for horizontal bar chart
          const transformedDept = deptData.map(item => ({
            department: item.department,
            present: item.employeeCount,
            absent: 0,
            rate: item.employeeCount > 0 ? 100 : 0
          }));
          
          setDepartmentAttendanceData(transformedDept);
          console.log('Department chart updated with', transformedDept.length, 'departments');

        } catch (err) {
          console.error("Failed to fetch department distribution:", err?.message);
          setDepartmentAttendanceData([]);
        }

        // ===== 5. Fetch Payroll Summary =====
        try {
          console.log('Fetching payroll summary...');
          const payrollSummaryRes = await axios.get(
            `${API_BASE_URL}/api/dashboard/payroll-summary`, 
            { headers }
          );
          const payrollSummary = payrollSummaryRes.data;
          
          console.log('Payroll summary received:', payrollSummary);
          
          setStats(prev => ({
            ...prev,
            pendingPayroll: payrollSummary.pending || 0,
            processedPayroll: payrollSummary.processed || 0,
          }));

          // Update payroll status pie chart
          setPayrollStatusData([
            { status: "Processed", value: payrollSummary.processed || 0, fill: '#800020' },
            { status: "Pending", value: payrollSummary.pending || 0, fill: '#A52A2A' },
            { status: "Failed", value: 0, fill: '#f44336' },
          ]);
          
          console.log('💰 Payroll charts updated');

        } catch (err) {
          console.error("❌ Failed to fetch payroll summary:", err?.message);
        }

        // ===== 6. Fetch Monthly Attendance Trend =====
        try {
          console.log('Fetching monthly attendance trend...');
          const monthlyAttendanceRes = await axios.get(
            `${API_BASE_URL}/api/dashboard/monthly-attendance`, 
            { headers }
          );
          const monthlyData = monthlyAttendanceRes.data;
          
          console.log(' Monthly attendance received:', monthlyData.length, 'days');
          
          // Group by weeks for the analytics chart
          const weeklyAverages = [];
          let weekData = [];
          
          monthlyData.forEach((day, index) => {
            weekData.push(day.present);
            
            // Every 7 days or at the end
            if ((index + 1) % 7 === 0 || index === monthlyData.length - 1) {
              const avg = weekData.reduce((a, b) => a + b, 0) / weekData.length;
              weeklyAverages.push({
                week: `Week ${weeklyAverages.length + 1}`,
                attendance: avg.toFixed(1),
                leaves: 0,
                overtime: 0
              });
              weekData = [];
            }
          });
          
          if (weeklyAverages.length > 0) {
            setMonthlyAttendanceTrend(weeklyAverages);
            console.log('Monthly trend updated with', weeklyAverages.length, 'weeks');
          }

        } catch (err) {
          console.error("Failed to fetch monthly attendance:", err?.message);
        }

        // ===== 7. Fetch Finalized Payroll Count =====
        try {
          console.log(' Fetching payslip count...');
          const finalizedPayrollRes = await axios.get(
            `${API_BASE_URL}/PayrollRoute/finalized-payroll`, 
            { headers }
          );
          const payslipCount = Array.isArray(finalizedPayrollRes.data) 
            ? finalizedPayrollRes.data.length 
            : 0;
          
          setStats(prev => ({ ...prev, payslipCount }));
          console.log(' Payslip count:', payslipCount);

        } catch (err) {
          console.error(" Failed to fetch payslip count:", err?.message);
          // Set to 0 if fetch fails to prevent errors
          setStats(prev => ({ ...prev, payslipCount: 0 }));
        }

        // ===== 8. Fetch Announcements =====
        try {
          console.log(' Fetching announcements...');
          const annRes = await axios.get(`${API_BASE_URL}/api/announcements`, { headers });
          const announcementData = Array.isArray(annRes.data) ? annRes.data : [];
          setAnnouncements(announcementData);
          console.log('Announcements loaded:', announcementData.length);

        } catch (err) {
          console.error(" Failed to fetch announcements:", err?.message);
          setAnnouncements([]);
        }

        // ===== 9. Fetch Holidays =====
        try {
          console.log(' Fetching holidays...');
          const res = await axios.get(`${API_BASE_URL}/holiday`, { headers });
          if (Array.isArray(res.data)) {
            const transformedHolidays = res.data.map(item => {
              const d = new Date(item.date);
              const normalizedDate = !isNaN(d) 
                ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` 
                : item.date;
              return { 
                date: normalizedDate, 
                name: item.description, 
                status: item.status 
              };
            });
            setHolidays(transformedHolidays);
            console.log(' Holidays loaded:', transformedHolidays.length);
          }
        } catch (err) {
          console.error(" Error fetching holidays:", err);
        }

        console.log(' All data fetch completed!');

      } catch (err) {
        console.error(" Critical error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Auto-refresh every 5 minutes
    console.log(' Setting up auto-refresh (5 minutes)');
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => {
      console.log(' Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, []);

  return { 
    stats, 
    weeklyAttendanceData, 
    departmentAttendanceData, 
    payrollStatusData,
    monthlyAttendanceTrend,
    payrollTrendData,
    attendanceChartData, 
    announcements, 
    holidays, 
    loading 
  };
};

const useCarousel = (items, autoPlay = true, interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (items.length === 0 || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, isPlaying, interval]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((s) => (s - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((s) => (s + 1) % items.length);
  }, [items.length]);

  const handleSlideSelect = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    currentSlide,
    isPlaying,
    handlePrevSlide,
    handleNextSlide,
    handleSlideSelect,
    togglePlayPause
  };
};

const useTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

// Components
const StatCard = ({ card, index, stats, loading, hoveredCard, setHoveredCard }) => (
  <Grow in timeout={500 + index * 100}>
    <Card 
      onMouseEnter={() => setHoveredCard(index)} 
      onMouseLeave={() => setHoveredCard(null)} 
      sx={{ 
        background: hoveredCard === index ? card.gradient : cardBackground, 
        backdropFilter: 'blur(15px)', 
        border: hoveredCard === index ? 'none' : `1px solid ${cardBorder}`, 
        borderRadius: 4, 
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
        transform: hoveredCard === index ? 'translateY(-12px) scale(1.02)' : 'translateY(0)', 
        boxShadow: hoveredCard === index ? card.shadow : '0 4px 12px rgba(0,0,0,0.1)', 
        position: 'relative', 
        overflow: 'hidden', 
        '&::before': { 
          content: '""', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: hoveredCard === index ? 'none' : card.gradient, 
          opacity: 0.1, 
          transition: 'opacity 0.5s'
        }, 
        '&::after': { 
          content: '""', 
          position: 'absolute', 
          top: -50, 
          right: -50, 
          width: 150, 
          height: 150, 
          background: 'radial-gradient(circle, rgba(254,249,225,0.2) 0%, transparent 70%)', 
          borderRadius: '50%', 
          transform: hoveredCard === index ? 'scale(2)' : 'scale(0)', 
          transition: 'transform 0.6s ease-out' 
        } 
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            borderRadius: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: hoveredCard === index ? 'rgba(254, 249, 225, 0.2)' : 'rgba(128, 0, 32, 0.1)', 
            backdropFilter: 'blur(10px)', 
            color: hoveredCard === index ? '#ffffff' : mediumText, 
            transition: 'all 0.5s', 
            transform: hoveredCard === index ? 'rotate(360deg) scale(1.1)' : 'rotate(0) scale(1)', 
            boxShadow: hoveredCard === index ? '0 8px 24px rgba(0,0,0,0.2)' : 'none' 
          }}>
            {React.cloneElement(card.icon, { sx: { fontSize: 36 } })}
          </Box>
          <Chip 
            icon={card.trendUp ? <TrendingUp /> : <TrendingDown />} 
            label={card.trend} 
            size="small" 
            sx={{ 
              bgcolor: hoveredCard === index ? 'rgba(254,249,225,0.15)' : 'rgba(128, 0, 32, 0.1)', 
              backdropFilter: 'blur(10px)', 
              color: hoveredCard === index ? '#ffffff' : mediumText, 
              fontWeight: 700, 
              border: hoveredCard === index ? '1px solid rgba(254,249,225,0.2)' : `1px solid ${cardBorder}`, 
              '& .MuiChip-icon': { color: hoveredCard === index ? '#ffffff' : mediumText } 
            }} 
          />
        </Box>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800, 
            mb: 0.5, 
            color: hoveredCard === index ? '#ffffff' : darkText, 
            textShadow: hoveredCard === index ? '0 2px 10px rgba(0,0,0,0.3)' : 'none' 
          }}
        >
          {loading ? <Skeleton variant="text" width={80} sx={{ bgcolor: 'rgba(128, 0, 32, 0.1)' }} /> : 
           (stats[card.valueKey] !== undefined ? stats[card.valueKey] : card.defaultValue)}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 0.5, 
            color: hoveredCard === index ? 'rgba(254,249,225,0.9)' : mediumText, 
            textShadow: hoveredCard === index ? '0 1px 5px rgba(0,0,0,0.3)' : 'none' 
          }}
        >
          {card.textValue}
        </Typography>
        <Typography sx={{ color: hoveredCard === index ? 'rgba(254,249,225,0.9)' : '#666666', fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
          {card.label}
        </Typography>
        <Typography sx={{ color: hoveredCard === index ? 'rgba(254,249,225,0.6)' : '#999999', fontSize: '0.85rem' }}>
          {card.subtitle}
        </Typography>
        {loading && <LinearProgress sx={{ mt: 2, borderRadius: 1, height: 4, bgcolor: 'rgba(128, 0, 32, 0.1)', '& .MuiLinearProgress-bar': { bgcolor: hoveredCard === index ? '#ffffff' : mediumText, borderRadius: 1 } }} />}
      </CardContent>
    </Card>
  </Grow>
);

// Compact version of stat cards
const CompactStatCard = ({ card, index, stats, loading, hoveredCard, setHoveredCard }) => (
  <Grow in timeout={300 + index * 50}>
    <Card 
      onMouseEnter={() => setHoveredCard(index)} 
      onMouseLeave={() => setHoveredCard(null)} 
      sx={{ 
        height: 120,
        background: cardBackground, 
        border: `2px solid ${hoveredCard === index ? mediumText : cardBorder}`, 
        borderRadius: 4, 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        transform: hoveredCard === index ? 'translateY(-4px) scale(1.02)' : 'translateY(0)', 
        boxShadow: hoveredCard === index ? cardShadow : '0 2px 8px rgba(0,0,0,0.08)', 
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ 
            width: 40, 
            height: 30, 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: `${mediumText}10`, 
            color: mediumText, 
            transition: 'all 0.3s', 
            transform: hoveredCard === index ? 'rotate(360deg) scale(1.1)' : 'rotate(0) scale(1)', 
          }}>
            {React.cloneElement(card.icon, { sx: { fontSize: 24 } })}
          </Box>
          <Chip 
            icon={card.trendUp ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />} 
            label={card.trend} 
            size="small" 
            sx={{ 
              bgcolor: card.trendUp ? `${mediumText}10` : '#f4433610',
              color: card.trendUp ? mediumText : '#f44336',
              fontWeight: 600, 
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-icon': { color: 'inherit' } 
            }} 
          />
        </Box>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: darkText, 
              lineHeight: 1
            }}
          >
            {loading ? <Skeleton variant="text" width={60} height={32} /> : 
             (stats[card.valueKey] !== undefined ? stats[card.valueKey] : card.defaultValue)}
          </Typography>
          <Typography sx={{ color: mediumText, fontSize: '0.75rem', fontWeight: 500 }}>
            {card.textValue}
          </Typography>
          <Typography sx={{ color: '#666666', fontSize: '0.7rem', fontWeight: 500 }}>
            {card.label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grow>
);

const AnnouncementCarousel = ({ announcements, currentSlide, isPlaying, handlePrevSlide, handleNextSlide, handleSlideSelect, togglePlayPause, handleOpenModal }) => (
  <Fade in timeout={600}>
    <Card sx={{ 
      background: cardBackground, 
      backdropFilter: 'blur(15px)', 
      border: `1px solid ${cardBorder}`, 
      borderRadius: 4, 
      mb: 3, 
      overflow: 'hidden', 
      boxShadow: cardShadow, 
      position: 'relative' 
    }}>
      <Box sx={{ position: 'relative', height: 550 }}>
        {announcements.length > 0 ? (
          <>
            <Box 
              component="img" 
              src={announcements[currentSlide]?.image ? `${API_BASE_URL}${announcements[currentSlide].image}` : "/api/placeholder/800/400"} 
              alt={announcements[currentSlide]?.title || "Announcement"} 
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                transition: 'transform 0.7s ease', 
                transform: 'scale(1)' 
              }} 
            />
            <Box sx={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 70%)' 
            }} />
            <IconButton 
              onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }} 
              sx={{ 
                position: 'absolute', 
                left: 24, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                bgcolor: 'rgba(128, 0, 32, 0.3)', 
                backdropFilter: 'blur(10px)', 
                border: `1px solid ${cardBorder}`, 
                '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.5)', transform: 'translateY(-50%) scale(1.1)' }, 
                color: '#ffffff', 
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)', 
                transition: 'all 0.3s' 
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); handleNextSlide(); }} 
              sx={{ 
                position: 'absolute', 
                right: 24, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                bgcolor: 'rgba(128, 0, 32, 0.3)', 
                backdropFilter: 'blur(10px)', 
                border: `1px solid ${cardBorder}`, 
                '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.5)', transform: 'translateY(-50%) scale(1.1)' }, 
                color: '#ffffff', 
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)', 
                transition: 'all 0.3s' 
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} 
              sx={{ 
                position: 'absolute', 
                top: 24, 
                right: 24, 
                bgcolor: 'rgba(128, 0, 32, 0.3)', 
                backdropFilter: 'blur(10px)', 
                border: `1px solid ${cardBorder}`, 
                '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.5)', transform: 'scale(1.1)' }, 
                color: '#ffffff', 
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)', 
                transition: 'all 0.3s' 
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Box 
              onClick={() => handleOpenModal(announcements[currentSlide])} 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                p: 4, 
                color: '#ffffff', 
                cursor: 'pointer', 
                transition: 'transform 0.3s', 
                '&:hover': { transform: 'translateY(-4px)' } 
              }}
            >
              <Chip 
                label="ANNOUNCEMENT" 
                size="small" 
                sx={{ 
                  mb: 2, 
                  bgcolor: 'rgba(128, 0, 32, 0.5)', 
                  backdropFilter: 'blur(10px)', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  fontSize: '0.7rem', 
                  border: '1px solid rgba(254, 249, 225, 0.3)' 
                }} 
              />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 1, 
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)', 
                  lineHeight: 1.2 
                }}
              >
                {announcements[currentSlide]?.title}
              </Typography>
              <Typography 
                sx={{ 
                  opacity: 0.95, 
                  fontSize: '1rem', 
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 18 }} />
                {new Date(announcements[currentSlide]?.date).toDateString()}
              </Typography>
            </Box>
            <Box sx={{ 
              position: 'absolute', 
              bottom: 24, 
              right: 24, 
              display: 'flex', 
              gap: 1.5, 
              alignItems: 'center' 
            }}>
              {announcements.map((_, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    width: currentSlide === idx ? 32 : 10, 
                    height: 10, 
                    borderRadius: 5, 
                    bgcolor: currentSlide === idx ? '#ffffff' : 'rgba(254,249,225,0.4)', 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                    cursor: 'pointer', 
                    border: '1px solid rgba(254,249,225,0.3)', 
                    '&:hover': { 
                      bgcolor: 'rgba(254,249,225,0.7)', 
                      transform: 'scale(1.2)' 
                    } 
                  }} 
                  onClick={(e) => { e.stopPropagation(); handleSlideSelect(idx); }} 
                />
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            flexDirection: 'column', 
            gap: 2 
          }}>
            <CampaignIcon sx={{ fontSize: 80, color: 'rgba(128, 0, 32, 0.3)' }} />
            <Typography variant="h5" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              No announcements available
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  </Fade>
);

const CompactChart = ({ title, children, height = 200 }) => (
  <Card sx={{ 
    background: cardBackground, 
    backdropFilter: 'blur(15px)', 
    border: `1px solid ${cardBorder}`, 
    borderRadius: 4, 
    height: height + 80, 
    boxShadow: cardShadow, 
    transition: 'all 0.3s', 
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 50px rgba(128,0,32,0.3)' } 
  }}>
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: darkText, fontSize: '0.95rem' }}>
        {title}
      </Typography>
      <Box sx={{ height }}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

const CompactCalendar = ({ calendarDate, setCalendarDate, holidays }) => {
  const month = calendarDate.getMonth();
  const year = calendarDate.getFullYear();

  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < adjustedFirst; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length < 35) days.push(null);
    return days;
  };

  const calendarDays = useMemo(() => generateCalendar(month, year), [month, year]);

  return (
    <Card sx={{ 
      background: cardBackground, 
      backdropFilter: 'blur(15px)', 
      border: `1px solid ${cardBorder}`, 
      borderRadius: 4, 
      boxShadow: cardShadow,
      height: 260
    }}>
      <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setCalendarDate(new Date(year, month - 1, 1))} 
            sx={{ color: mediumText, p: 0.5 }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: '0.8rem', 
            color: darkText 
          }}>
            {new Date(year, month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setCalendarDate(new Date(year, month + 1, 1))} 
            sx={{ color: mediumText, p: 0.5 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
        <Grid container spacing={0.3} sx={{ mb: 0.3 }}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography sx={{ 
                textAlign: 'center', 
                fontWeight: 600, 
                fontSize: '0.55rem', 
                color: '#666666' 
              }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0.3} sx={{ flex: 1 }}>
          {calendarDays.map((day, index) => {
            const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const holidayData = holidays.find(h => h.date === currentDate && h.status === "Active");
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            return (
              <Grid item xs={12 / 7} key={index}>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 0.3, 
                  fontSize: '0.65rem', 
                  borderRadius: 0.5, 
                  color: holidayData ? '#ffffff' : day ? darkText : 'transparent', 
                  background: holidayData ? primaryGradient : isToday ? '#f5f5f5' : 'transparent', 
                  fontWeight: holidayData || isToday ? 600 : 400, 
                  cursor: 'pointer', 
                  transition: 'all 0.2s', 
                  '&:hover': { 
                    background: holidayData ? primaryHoverGradient : '#e0e0e0', 
                    transform: 'scale(1.1)' 
                  } 
                }}>
                  {day || ""}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      action: "Processed payroll for June 2024",
      time: "2 minutes ago",
      icon: <PaymentsIcon />,
      color: mediumText
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated employee records",
      time: "15 minutes ago",
      icon: <Person />,
      color: "#2196f3"
    },
    {
      id: 3,
      user: "Robert Johnson",
      action: "Generated monthly attendance report",
      time: "1 hour ago",
      icon: <Assessment />,
      color: "#ff9800"
    },
    {
      id: 4,
      user: "Emily Davis",
      action: "New announcement posted: Company Holiday Schedule",
      time: "2 hours ago",
      icon: <CampaignIcon />,
      color: "#9c27b0"
    },
    {
      id: 5,
      user: "System",
      action: "Database backup completed successfully",
      time: "3 hours ago",
      icon: <CheckCircleIcon />,
      color: "#4caf50"
    }
  ];

  return (
    <Card sx={{ 
      background: cardBackground, 
      backdropFilter: 'blur(15px)', 
      border: `1px solid ${cardBorder}`, 
      borderRadius: 4, 
      boxShadow: cardShadow,
      height: 320
    }}>
      <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: darkText, fontSize: '0.85rem' }}>
          Recent Activity
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {activities.map((activity, index) => (
            <Grow in timeout={300 + index * 50} key={activity.id}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 1, 
                mb: 1.5,
                p: 0.5,
                borderRadius: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(128, 0, 32, 0.05)',
                  transform: 'translateX(2px)'
                }
              }}>
                <Box sx={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: `${activity.color}10`, 
                  color: activity.color,
                  flexShrink: 0
                }}>
                  {React.cloneElement(activity.icon, { sx: { fontSize: 16 } })}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: darkText,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {activity.action}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.6rem', 
                    color: '#666666',
                    mt: 0.25
                  }}>
                    {activity.user} • {activity.time}
                  </Typography>
                </Box>
              </Box>
            </Grow>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "medium" });
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch tasks on load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/tasks`).then((res) => setTasks(res.data));
  }, []);

  const handleToggle = async (id) => {
    await axios.put(`${API_BASE_URL}/tasks/${id}/toggle`);
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    const res = await axios.post(`${API_BASE_URL}/tasks`, newTask);
    setTasks([res.data, ...tasks]);
    setNewTask({ title: "", priority: "medium" });
    setAddTaskOpen(false);
    setShowSuccess(true); 
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to get display label for priority
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case "high": return "Urgent";
      case "medium": return "Soon";
      case "low": return "Later";
      default: return priority;
    }
  };

  return (
    <>
      <Card
        sx={{
          background: cardBackground,
          backdropFilter: "blur(15px)",
          border: `1px solid ${cardBorder}`,
          borderRadius: 4,
          mb: 2,
          boxShadow: cardShadow,
          height: 270, // Fixed height
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showSuccess && <SuccessfulOverlay message="Task added successfully!" />}
        <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText, fontSize: "0.95rem" }}>
              Tasks
            </Typography>
            <IconButton
              size="small"
              onClick={() => setAddTaskOpen(true)}
              sx={{
                bgcolor: mediumText,
                color: "#ffffff",
                "&:hover": { bgcolor: primaryHoverGradient },
                width: 28,
                height: 28,
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          {/* Scrollable Task list */}
          <Box sx={{ 
            flex: 1, 
            overflowY: "auto", 
            overflowX: "hidden",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(128, 0, 32, 0.1)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(128, 0, 32, 0.3)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(128, 0, 32, 0.5)",
              },
            },
          }}>
            <List dense sx={{ p: 0 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{ p: 0, mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    size="small"
                    sx={{
                      color: mediumText,
                      "&.Mui-checked": { color: mediumText },
                    }}
                  />
                  <ListItemText
                    primary={task.title}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.85rem",
                        color: task.completed ? "#999999" : darkText,
                        textDecoration: task.completed ? "line-through" : "none",
                      },
                    }}
                  />
                  <Chip
                    label={getPriorityLabel(task.priority)}
                    size="small"
                    sx={{
                      fontSize: "0.65rem",
                      height: 20,
                      bgcolor:
                        task.priority === "high"
                          ? "#f4433610"
                          : task.priority === "medium"
                          ? "#ff980010"
                          : "#4caf5010",
                      color:
                        task.priority === "high"
                          ? "#f44336"
                          : task.priority === "medium"
                          ? "#ff9800"
                          : "#4caf50",
                      mr: 1,
                    }}
                  />
                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(task.id)}
                    sx={{ color: "#6d2323" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: cardBackground,
            backdropFilter: "blur(12px)",
            border: `1px solid ${cardBorder}`,
            boxShadow: cardShadow,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: "1rem",
            fontWeight: 600,
            color: darkText,
          }}
        >
          Add New Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <Typography variant="body2" sx={{ mb: 1, color: "#666666", fontWeight: 500 }}>
            Priority
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["low", "medium", "high"].map((priority) => (
              <Button
                key={priority}
                variant={newTask.priority === priority ? "contained" : "outlined"}
                size="small"
                onClick={() => setNewTask({ ...newTask, priority })}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: 2,
                  borderColor:
                    priority === "high"
                      ? "#f44336"
                      : priority === "medium"
                      ? "#ff9800"
                      : "#4caf50",
                  color:
                    priority === "high"
                      ? "#f44336"
                      : priority === "medium"
                      ? "#ff9800"
                      : "#4caf50",
                  ...(newTask.priority === priority && {
                    bgcolor:
                      priority === "high"
                        ? "#f44336"
                        : priority === "medium"
                        ? "#ff9800"
                        : "#4caf50",
                    color: "#ffffff",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }),
                }}
              >
                {getPriorityLabel(priority)} {/* Use the function to get display label */}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setAddTaskOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              color: "#FFFFFF",
              bgcolor: '#000000'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTask}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: mediumText,
              textTransform: "none",
              "&:hover": { bgcolor: primaryHoverGradient },
            }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const QuickActions = () => (
  <Card sx={{ 
    background: cardBackground, 
    backdropFilter: 'blur(15px)', 
    border: `1px solid ${cardBorder}`, 
    borderRadius: 4, 
    boxShadow: cardShadow,
    height: 260
  }}>
    <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: darkText, fontSize: '0.85rem' }}>
       Admin Panel
      </Typography>
      <Grid container spacing={1}>
        {QUICK_ACTIONS.map((item, i) => (
          <Grid item xs={4} key={i}>
            <Grow in timeout={400 + i * 50}>
              <Link to={item.link} style={{ textDecoration: "none" }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1.5, 
                  background: `${mediumText}05`, 
                  border: `1px solid ${cardBorder}`, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  transition: 'all 0.3s', 
                  cursor: 'pointer',
                  height: 43,
                  '&:hover': { 
                    background: `${mediumText}10`, 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 4px 12px ${mediumText}20` 
                  } 
                }}>
                  <Box sx={{ color: mediumText }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Typography sx={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 600, 
                    color: darkText, 
                    textAlign: 'center' 
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const UpgradeCard = () => (
  <Card sx={{ 
    background: primaryGradient, 
    borderRadius: 4, 
    p: 2, 
    mt: 2, 
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
      <Lock sx={{ fontSize: 120 }} />
    </Box>
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '0.95rem' }}>
        HR Analytics Pro
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', opacity: 0.9 }}>
        Unlock advanced payroll analytics and reporting
      </Typography>
      <Button 
        variant="contained" 
        size="small"
        endIcon={<Upgrade />}
        sx={{ 
          background: '#ffffff', 
          color: mediumText, 
          fontWeight: 600,
          fontSize: '0.75rem',
          px: 2,
          py: 0.5,
          '&:hover': { 
            background: '#f5f5f5', 
            transform: 'translateY(-1px)' 
          } 
        }}
      >
        Upgrade Now
      </Button>
    </Box>
  </Card>
);

const LogoutDialog = ({ open }) => (
  <Dialog
    open={open}
    fullScreen
    PaperProps={{
      sx: { backgroundColor: "transparent", boxShadow: "none" },
    }}
    BackdropProps={{
      sx: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
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
            background: i % 2 === 0 ? "rgba(128,0,32,0.8)" : "rgba(255,248,225,0.8)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "-60px 0px",
            animation: `orbit${i} ${3 + i}s linear infinite`,
            boxShadow: "0 0 15px rgba(128,0,32,0.5), 0 0 8px rgba(255,248,225,0.5)",
          }}
        />
      ))}

      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #A52A2A, #800020)",
            boxShadow: "0 0 40px rgba(128,0,32,0.7), 0 0 80px rgba(128,0,32,0.5)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "floatSphere 2s ease-in-out infinite alternate",
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
              boxShadow: "0 0 20px rgba(128,0,32,0.7), 0 0 10px #FFF8E1",
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
          textShadow: "0 0 10px #800020",
          animation: "pulse 1.5s infinite",
        }}
      >
        Signing out...
      </Typography>

      <Box component="style" children={`
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
      `}/>
    </Box>
  </Dialog>
);

// Main component
const AdminHome = () => {
  const { username, fullName, employeeNumber, profilePicture } = useAuth();
  const { 
    stats, 
    weeklyAttendanceData, 
    departmentAttendanceData, 
    payrollStatusData,
    monthlyAttendanceTrend,
    payrollTrendData,
    attendanceChartData, 
    announcements, 
    holidays, 
    loading 
  } = useDashboardData();
  const { currentSlide, isPlaying, handlePrevSlide, handleNextSlide, handleSlideSelect, togglePlayPause } = useCarousel(announcements);
  const currentTime = useTime();
  
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [chartView, setChartView] = useState('pie');
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleOpenModal = (announcement) => { 
    setSelectedAnnouncement(announcement); 
    setOpenModal(true); 
  };
  
  const handleCloseModal = () => { 
    setOpenModal(false); 
    setSelectedAnnouncement(null); 
  };

  const handleLogout = () => {
    setLogoutOpen(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }, 500); 
  };

  const radialAttendanceData = attendanceChartData.map((item, idx) => ({ 
    ...item, 
    fill: COLORS[idx % COLORS.length] 
  }));

  return (
    <Box sx={{ 
      background: '#6d2323', 
      minHeight: '100vh', 
      py: 2, 
      borderRadius: '14px',
      mt: -2
    }}>
      <Container maxWidth="xl" sx={{ px: 2, pt: 2 }}>
        {/* Header */}
        <Grow in timeout={300}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              background: cardBackground,
              backdropFilter: 'blur(15px)',
              borderRadius: 4,
              p: 2,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: darkText,
                  fontWeight: 700,
                }}
              >
                Hello, {fullName || username}!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666666',
                  mt: 0.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                <span style={{ marginLeft: '8px' }}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'rgba(128, 0, 32, 0.1)',
                    '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.2)' },
                    color: mediumText,
                  }}
                  onClick={() => window.location.reload()}
                >
                  <AutorenewIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'rgba(128, 0, 32, 0.1)',
                    '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.2)' },
                    color: mediumText,
                  }}
                  onClick={() => setNotifModalOpen(true)}
                >
                  <Badge badgeContent={announcements.length} color="error" max={9}>
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '50%',
                    padding: '2px',
                    background: primaryGradient,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  },
                }}
              >
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    alt={username}
                    src={profilePicture ? `${API_BASE_URL}${profilePicture}` : undefined}
                    sx={{ width: 36, height: 36 }}
                  />
                </IconButton>
              </Box>
              
              <Menu 
                anchorEl={anchorEl} 
                open={openMenu} 
                onClose={handleMenuClose} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
                PaperProps={{ 
                  sx: { 
                    borderRadius: 2, 
                    minWidth: 180, 
                    backgroundColor: '#FEF9E1',
                    border: `1px solid ${cardBorder}`,
                    boxShadow: cardShadow,
                    '& .MuiMenuItem-root': { 
                      fontSize: '0.875rem',
                      '&:hover': { 
                        background: 'rgba(128, 0, 32, 0.1)' 
                      }, 
                    }, 
                  }, 
                }} 
              > 
                <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                  <AccountCircle sx={{ mr: 1, fontSize: 20 }} /> Profile
                </MenuItem> 
                <MenuItem onClick={() => { handleMenuClose(); navigate("/settings"); }}>
                  <Settings sx={{ mr: 1, fontSize: 20 }} /> Settings
                </MenuItem> 
                <MenuItem onClick={() => { handleMenuClose(); navigate("/faqs"); }}>
                  <HelpOutline sx={{ mr: 1, fontSize: 20 }} /> FAQs
                </MenuItem> 
                <MenuItem onClick={() => { handleMenuClose(); navigate("/privacy-policy"); }}>
                  <PrivacyTip sx={{ mr: 1, fontSize: 20 }} /> Privacy Policy
                </MenuItem> 
                <Divider sx={{ borderColor: cardBorder }} /> 
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                  <Logout sx={{ mr: 1, fontSize: 20 }} /> Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Grow>

        {/* Stats Cards - Now only 5 cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: 1,
            pb: 3
          }}
        >
          {STAT_CARDS.map((card, index) => (
            <Box
              key={card.label}
              sx={{
                flex: "1 1 0",
                maxWidth: "19%", // Adjusted for 5 cards
                minWidth: "140px", // Slightly wider for better spacing
              }}
            >
              <CompactStatCard
                card={card}
                index={index}
                stats={stats}
                loading={loading}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            </Box>
          ))}
        </Box>

        {/* Slideshow, Calendar, Quick Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={7}>
            <AnnouncementCarousel 
              announcements={announcements}
              currentSlide={currentSlide}
              isPlaying={isPlaying}
              handlePrevSlide={handlePrevSlide}
              handleNextSlide={handleNextSlide}
              handleSlideSelect={handleSlideSelect}
              togglePlayPause={togglePlayPause}
              handleOpenModal={handleOpenModal}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            {/* Calendar and Quick Actions*/}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <CompactCalendar 
                  calendarDate={calendarDate} 
                  setCalendarDate={setCalendarDate} 
                  holidays={holidays} 
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActions />
              </Grid>
            </Grid>
            <TaskList />
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)} 
              sx={{ 
                mb: 2,
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)', // Unselected tabs color
                  '&.Mui-selected': {
                    color: '#FFFFFF', // Selected tab text color
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFFFFF', // Indicator color
                }
              }}
            >
              <Tab label="Overview" sx={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' }} />
              <Tab label="Analytics" sx={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' }} />
            </Tabs>

            
            {tabValue === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CompactChart title="Weekly Attendance" height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyAttendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <RechartTooltip />
                        <Bar dataKey="present" fill={mediumText} />
                        <Bar dataKey="absent" fill={COLORS[1]} />
                        <Bar dataKey="late" fill={COLORS[2]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CompactChart>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CompactChart title="Department Attendance Rate" height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentAttendanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" stroke="#666" fontSize={12} />
                        <YAxis dataKey="department" type="category" stroke="#666" fontSize={12} width={60} />
                        <RechartTooltip />
                        <Bar dataKey="rate" fill={mediumText} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CompactChart>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CompactChart title="Payroll Status" height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={payrollStatusData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {payrollStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CompactChart>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CompactChart title="Today's Attendance Summary" height={200}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          <circle
                            cx="70"
                            cy="70"
                            r="60"
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="12"
                          />
                          <circle
                            cx="70"
                            cy="70"
                            r="60"
                            fill="none"
                            stroke={mediumText}
                            strokeWidth="12"
                            strokeDasharray={`${2 * Math.PI * 60 * 0.877} ${2 * Math.PI * 60}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 70 70)"
                          />
                        </svg>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: mediumText, lineHeight: 1 }}>
                            87.7
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            % Present
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CompactChart>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CompactChart title="Monthly Attendance Trend" height={250}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyAttendanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <RechartTooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke={mediumText} 
                          strokeWidth={2}
                          dot={{ fill: mediumText, r: 4 }}
                          name="Attendance %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="leaves" 
                          stroke={COLORS[1]} 
                          strokeWidth={2}
                          dot={{ fill: COLORS[1], r: 4 }}
                          name="Leaves %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="overtime" 
                          stroke={COLORS[2]} 
                          strokeWidth={2}
                          dot={{ fill: COLORS[2], r: 4 }}
                          name="Overtime %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CompactChart>
                </Grid>

                <Grid item xs={12}>
                  <CompactChart title="Payroll Trend (₱)" height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={payrollTrendData}>
                        <defs>
                          <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={mediumText} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={mediumText} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <RechartTooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="grossPay" 
                          stroke={mediumText} 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorGross)"
                          name="Gross Pay"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="netPay" 
                          stroke="#4caf50" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorNet)"
                          name="Net Pay"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CompactChart>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Fade in={openModal}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '90%', 
            maxWidth: 800, 
            bgcolor: cardBackground, 
            backdropFilter: 'blur(40px)', 
            border: `1px solid ${cardBorder}`, 
            boxShadow: '0 24px 64px rgba(128,0,32,0.5)', 
            borderRadius: 4, 
            overflow: 'hidden', 
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            {selectedAnnouncement && (
              <>
                <Box sx={{ position: 'relative' }}>
                  {selectedAnnouncement.image && (
                    <Box 
                      component="img" 
                      src={`${API_BASE_URL}${selectedAnnouncement.image}`} 
                      alt={selectedAnnouncement.title} 
                      sx={{ width: '100%', height: 350, objectFit: 'cover' }} 
                    />
                  )}
                  <Box sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(128,0,32,0.7) 100%)' 
                  }} />
                  <IconButton 
                    onClick={handleCloseModal} 
                    sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      right: 20, 
                      bgcolor: 'rgba(128, 0, 32, 0.3)', 
                      backdropFilter: 'blur(10px)', 
                      border: `1px solid ${cardBorder}`, 
                      color: '#ffffff', 
                      '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.5)', transform: 'rotate(90deg)' }, 
                      transition: 'all 0.3s' 
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ p: 4, overflowY: 'auto' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 2, 
                      color: darkText, 
                      textShadow: '0 2px 10px rgba(128,0,32,0.3)' 
                    }}
                  >
                    {selectedAnnouncement.title}
                  </Typography>
                  <Chip 
                    icon={<AccessTimeIcon style={{color: mediumText}}/>} 
                    label={new Date(selectedAnnouncement.date).toLocaleDateString()} 
                    sx={{ 
                      mb: 3, 
                      bgcolor: 'rgba(128, 0, 32, 0.3)', 
                      backdropFilter: 'blur(10px)', 
                      color: mediumText, 
                      border: `1px solid ${cardBorder}` 
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: mediumText, 
                      lineHeight: 1.8, 
                      fontSize: '1.05rem' 
                    }}
                  >
                    {selectedAnnouncement.about}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      <Modal open={notifModalOpen} onClose={() => setNotifModalOpen(false)}>
        <Fade in={notifModalOpen}>
          <Box sx={{ 
            position: 'absolute', 
            top: 100, 
            right: 24, 
            width: 420, 
            maxWidth: '90vw', 
            bgcolor: cardBackground, 
            backdropFilter: 'blur(40px)', 
            border: `1px solid ${cardBorder}`, 
            boxShadow: '0 24px 64px rgba(128,0,32,0.5)', 
            borderRadius: 4, 
            overflow: 'hidden', 
            maxHeight: 'calc(100vh - 140px)' 
          }}>
            <Box sx={{ 
              p: 3, 
              borderBottom: `1px solid ${cardBorder}`, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(165, 42, 42, 0.05) 100%)' 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: darkText }}>
                Notifications
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setNotifModalOpen(false)} 
                sx={{ 
                  color: mediumText,
                  '&:hover': { bgcolor: 'rgba(128, 0, 32, 0.1)', transform: 'rotate(90deg)' }, 
                  transition: 'all 0.3s' 
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', p: 2 }}>
              {announcements.slice(0, 8).map((item, idx) => (
                <Grow in timeout={300 + idx * 50} key={idx}>
                  <Box 
                    sx={{ 
                      mb: 2, 
                      p: 2.5, 
                      borderRadius: 3, 
                      background: 'rgba(128, 0, 32, 0.05)', 
                      border: `1px solid ${cardBorder}`, 
                      cursor: 'pointer', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                      position: 'relative', 
                      overflow: 'hidden', 
                      '&::before': { 
                        content: '""', 
                        position: 'absolute', 
                        left: 0, 
                        top: 0, 
                        bottom: 0, 
                        width: 4, 
                        background: primaryGradient, 
                        transform: 'scaleY(0)', 
                        transition: 'transform 0.3s' 
                      }, 
                      '&:hover': { 
                        background: 'rgba(128, 0, 32, 0.1)', 
                        transform: 'translateX(8px)', 
                        boxShadow: '0 8px 24px rgba(128,0,32,0.2)' 
                      }, 
                      '&:hover::before': { transform: 'scaleY(1)' } 
                    }} 
                    onClick={() => { 
                      setSelectedAnnouncement(item); 
                      setNotifModalOpen(false); 
                      setOpenModal(true); 
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        background: primaryGradient, 
                        mt: 0.5, 
                        flexShrink: 0, 
                        boxShadow: '0 0 12px rgba(128,0,32,0.6)', 
                        animation: 'pulse 2s infinite', 
                        '@keyframes pulse': { 
                          '0%, 100%': { opacity: 1 }, 
                          '50%': { opacity: 0.5 } 
                        } 
                      }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ 
                          fontWeight: 700, 
                          fontSize: '1rem', 
                          color: darkText, 
                          mb: 0.5, 
                          lineHeight: 1.4 
                        }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ 
                          fontSize: '0.8rem', 
                          color: '#666666', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5 
                        }}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {item.date ? new Date(item.date).toLocaleDateString() : ""}
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ 
                        color: '#999999', 
                        fontSize: 20, 
                        transition: 'transform 0.3s' 
                      }} />
                    </Box>
                  </Box>
                </Grow>
              ))}
              {announcements.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <NotificationsIcon sx={{ fontSize: 80, color: 'rgba(128, 0, 32, 0.2)', mb: 2 }} />
                  <Typography sx={{ color: '#666666', fontSize: '1rem' }}>
                    No notifications at the moment
                  </Typography>
                  <Typography sx={{ color: '#999999', fontSize: '0.85rem', mt: 1 }}>
                    You're all caught up!
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      <LogoutDialog open={logoutOpen} />
    </Box>
  );
};

export default AdminHome;