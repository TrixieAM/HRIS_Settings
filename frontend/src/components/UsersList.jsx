import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Switch,
  Avatar,
  MenuItem,
  Divider,
  LinearProgress,
  Badge,
  Fab,
  Drawer,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  People,
  Search,
  PersonAdd,
  GroupAdd,
  Email,
  Badge as BadgeIcon,
  Person,
  Visibility,
  Refresh,
  AccountCircle,
  Business,
  Security,
  Close,
  Pages,
  Settings,
  FilterList,
  Lock,
  LockOpen,
  AdminPanelSettings,
  SupervisorAccount,
  Work,
  MoreVert,
  CheckCircle,
  Cancel,
  Info,
  AssignmentInd,
  ContactMail,
  AccessTime,
  Key,
  VerifiedUser,
  Star,
  TrendingUp,
  Shield,
  LockPerson,
  PersonPin
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  // Page Access Management States
  const [pageAccessDialog, setPageAccessDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageAccess, setPageAccess] = useState({});
  const [pageAccessLoading, setPageAccessLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [accessChangeInProgress, setAccessChangeInProgress] = useState({});
  
  // Additional UI States
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Color constants - limited to burgundy, black, white, and cream
  const colors = {
    primary: "#800020",      // Burgundy
    primaryDark: "#660018",  // Dark Burgundy
    secondary: "#9D2235",    // Light Burgundy
    cream: "#FFF8E7",        // Cream
    creamDark: "#FFF0E5",    // Dark Cream
    black: "#000000",        // Black
    white: "#FFFFFF"         // White
  };

  // ---- Enhanced fetchUsers with loading states ----
  const fetchUsers = async () => {
    setLoading(true);
    setRefreshing(true);
    setError("");

    try {
      const [usersResp, personsResp] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { method: "GET", headers: { "Content-Type": "application/json" } }),
        fetch(`${API_BASE_URL}/personalinfo/person_table`, { method: "GET", headers: { "Content-Type": "application/json" } }),
      ]);

      if (!usersResp.ok) {
        const err = await usersResp.json().catch(() => ({}));
        setError(err.error || "Failed to fetch users");
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const usersDataRaw = await usersResp.json();
      const personsDataRaw = await personsResp.json().catch(() => []);

      const usersArray = Array.isArray(usersDataRaw) ? usersDataRaw : (usersDataRaw.users || usersDataRaw.data || []);
      const personsArray = Array.isArray(personsDataRaw) ? personsDataRaw : (personsDataRaw.persons || personsDataRaw.data || []);

      const mergedUsers = (usersArray || []).map((user) => {
        const person = (personsArray || []).find(
          (p) => String(p.agencyEmployeeNum) === String(user.employeeNumber)
        );

        const fullName = person
          ? `${person.firstName || ""} ${person.middleName || ""} ${person.lastName || ""} ${person.nameExtension || ""}`.trim()
          : user.fullName || user.username || `${user.firstName || ""} ${user.lastName || ""}`.trim();

        const avatar = person?.profile_picture
          ? `${API_BASE_URL}${person.profile_picture}`
          : (user.avatar ? (String(user.avatar).startsWith("http") ? user.avatar : `${API_BASE_URL}${user.avatar}`) : null);

        return {
          ...user,
          fullName: fullName || "Username",
          avatar: avatar || null,
          // Store full person data for detailed view
          personData: person || {},
        };
      });

      setUsers(mergedUsers);
      setFilteredUsers(mergedUsers);
      
      if (refreshing) {
        setSuccessMessage("Users list refreshed successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Something went wrong while fetching users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch user's page access for the details drawer
  const fetchUserPageAccess = async (user) => {
    try {
      const accessResponse = await fetch(
        `${API_BASE_URL}/page_access/${user.employeeNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (accessResponse.ok) {
        const accessDataRaw = await accessResponse.json();
        const accessData = Array.isArray(accessDataRaw) ? accessDataRaw : (accessDataRaw.data || []);
        const accessMap = (accessData || []).reduce((acc, curr) => {
          acc[curr.page_id] = String(curr.page_privilege) === "1";
          return acc;
        }, {});
        
        // Get pages data
        const pagesResponse = await fetch(`${API_BASE_URL}/pages`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (pagesResponse.ok) {
          let pagesData = await pagesResponse.json();
          pagesData = Array.isArray(pagesData) ? pagesData : (pagesData.pages || pagesData.data || []);
          pagesData = (pagesData || []).sort((a, b) => (a.id || 0) - (b.id || 0));
          
          // Filter pages the user has access to
          const accessiblePages = pagesData.filter(page => accessMap[page.id] === true);
          
          // Update the selected user with page access info
          setSelectedUserForDetails(prev => ({
            ...prev,
            accessiblePages: accessiblePages,
            totalPages: pagesData.length,
            // Add access status for proper display
            hasAccess: accessiblePages.length > 0
          }));
          
          // Animate the progress bar
          const percentage = pagesData.length > 0 ? (accessiblePages.length / pagesData.length) * 100 : 0;
          let current = 0;
          const increment = percentage / 20;
          const timer = setInterval(() => {
            current += increment;
            if (current >= percentage) {
              current = percentage;
              clearInterval(timer);
            }
            setAnimatedValue(current);
          }, 50);
        }
      }
    } catch (err) {
      console.error("Error fetching user page access:", err);
    }
  };

  // Page Access Management Functions
  const handlePageAccessClick = async (user) => {
    setSelectedUser(user);
    setPageAccessLoading(true);
    setPageAccessDialog(true);

    try {
      const pagesResponse = await fetch(`${API_BASE_URL}/pages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (pagesResponse.ok) {
        let pagesData = await pagesResponse.json();
        pagesData = Array.isArray(pagesData) ? pagesData : (pagesData.pages || pagesData.data || []);
        pagesData = (pagesData || []).sort((a, b) => (a.id || 0) - (b.id || 0));
        setPages(pagesData);

        const accessResponse = await fetch(
          `${API_BASE_URL}/page_access/${user.employeeNumber}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (accessResponse.ok) {
          const accessDataRaw = await accessResponse.json();
          const accessData = Array.isArray(accessDataRaw) ? accessDataRaw : (accessDataRaw.data || []);
          const accessMap = (accessData || []).reduce((acc, curr) => {
            acc[curr.page_id] = String(curr.page_privilege) === "1";
            return acc;
          }, {});
          setPageAccess(accessMap);
        } else {
          setPageAccess({});
        }
      } else {
        setPages([]);
      }
    } catch (err) {
      console.error("Error fetching page access data:", err);
      setError("Failed to load page access data");
    } finally {
      setPageAccessLoading(false);
    }
  };

  const handleTogglePageAccess = async (pageId, currentAccess) => {
    const newAccess = !currentAccess;
    setAccessChangeInProgress(prev => ({ ...prev, [pageId]: true }));

    try {
      if (currentAccess === false) {
        const existingAccessResponse = await fetch(
          `${API_BASE_URL}/page_access/${selectedUser.employeeNumber}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (existingAccessResponse.ok) {
          const existingAccess = await existingAccessResponse.json();
          const existingRecord = (existingAccess || []).find(
            (access) => access.page_id === pageId
          );

          if (!existingRecord) {
            const createResponse = await fetch(`${API_BASE_URL}/page_access`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                employeeNumber: selectedUser.employeeNumber,
                page_id: pageId,
                page_privilege: newAccess ? "1" : "0",
              }),
            });

            if (!createResponse.ok) {
              const errorData = await createResponse.json().catch(() => ({}));
              setError(`Failed to create page access: ${errorData.error || "Unknown error"}`);
              setAccessChangeInProgress(prev => ({ ...prev, [pageId]: false }));
              return;
            }
          } else {
            const updateResponse = await fetch(
              `${API_BASE_URL}/page_access/${selectedUser.employeeNumber}/${pageId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  page_privilege: newAccess ? "1" : "0",
                }),
              }
            );

            if (!updateResponse.ok) {
              const errorData = await updateResponse.json().catch(() => ({}));
              setError(`Failed to update page access: ${errorData.error || "Unknown error"}`);
              setAccessChangeInProgress(prev => ({ ...prev, [pageId]: false }));
              return;
            }
          }
        }
      } else {
        const updateResponse = await fetch(
          `${API_BASE_URL}/page_access/${selectedUser.employeeNumber}/${pageId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page_privilege: newAccess ? "1" : "0",
            }),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({}));
          setError(`Failed to update page access: ${errorData.error || "Unknown error"}`);
          setAccessChangeInProgress(prev => ({ ...prev, [pageId]: false }));
          return;
        }
      }

      setPageAccess((prevAccess) => ({
        ...prevAccess,
        [pageId]: newAccess,
      }));
    } catch (err) {
      console.error("Error updating page access:", err);
      setError("Network error occurred while updating page access");
    } finally {
      setAccessChangeInProgress(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const closePageAccessDialog = () => {
    setPageAccessDialog(false);
    setSelectedUser(null);
    setPages([]);
    setPageAccess({});
  };

  const openUserDetails = (user) => {
    setSelectedUserForDetails(user);
    setDetailsDrawerOpen(true);
    setAnimatedValue(0);
    // Fetch page access when opening details
    fetchUserPageAccess(user);
  };

  const closeUserDetails = () => {
    setDetailsDrawerOpen(false);
    setSelectedUserForDetails(null);
    setActiveTab("info");
    setAnimatedValue(0);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.employeeNumber || "").includes(searchTerm) ||
        (user.role || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter ? (user.role || "").toLowerCase() === roleFilter.toLowerCase() : true;

      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, roleFilter, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role = "") => {
    switch ((role || "").toLowerCase()) {
      case "superadmin":
        return { bgcolor: colors.black, color: colors.black, icon: <SupervisorAccount /> };
      case "administrator":
        return { bgcolor: colors.primaryDark, color: colors.black, icon: <AdminPanelSettings /> };
      case "staff":
        return { bgcolor: colors.secondary, color: colors.black, icon: <Work /> };
      default:
        return { bgcolor: colors.primary, color: colors.black, icon: <Person /> };
    }
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getInitials = (nameOrUsername) => {
    if (!nameOrUsername) return "U";
    const parts = nameOrUsername.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          
          * {
            font-family: 'Poppins', sans-serif !important;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(128, 0, 32, 0.3); }
            50% { box-shadow: 0 0 30px rgba(128, 0, 32, 0.5); }
          }
          
          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
          
          .animate-slide-right {
            animation: slideRight 0.4s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
          
          .animate-bounce {
            animation: bounce 2s ease-in-out infinite;
          }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          
          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(128, 0, 32, 0.2);
          }
          
          .button-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .button-hover::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          
          .button-hover:hover::before {
            width: 300px;
            height: 300px;
          }
          
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(128, 0, 32, 0.3);
          }
          
          .row-hover {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .row-hover:hover {
            background-color: rgba(255, 240, 229, 0.8) !important;
            transform: scale(1.01);
          }
          
          .icon-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .icon-hover:hover {
            transform: rotate(15deg) scale(1.1);
          }
          
          .fab-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .fab-hover:hover {
            transform: scale(1.1) rotate(10deg);
          }

          .tab-active {
            border-bottom: 3px solid ${colors.primary};
            color: ${colors.primary};
            font-weight: 600;
          }

          .shimmer {
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }

          /* Custom switch styles to override blue color */
          .MuiSwitch-switchBase.Mui-checked {
            color: ${colors.primary} !important;
          }
          .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
            background-color: ${colors.primary} !important;
          }
          .MuiSwitch-track {
            background-color: #ccc !important;
          }

          /* Premium drawer header gradient animation */
          .drawer-header-gradient {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primaryDark} 100%);
            position: relative;
            overflow: hidden;
          }

          .drawer-header-gradient::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent);
            background-size: 30px 30px;
            animation: drawerPattern 20s linear infinite;
          }

          @keyframes drawerPattern {
            0% { background-position: 0 0; }
            100% { background-position: 60px 60px; }
          }

          /* Tab indicator animation */
          .tab-indicator {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .tab-indicator::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: ${colors.primary};
            transform: scaleX(0);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .tab-indicator.active::after {
            transform: scaleX(1);
          }

          /* Premium card hover effects */
          .premium-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 16px;
            overflow: hidden;
            position: relative;
          }

          .premium-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .premium-card:hover::before {
            opacity: 1;
          }

          .premium-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 20px 40px rgba(128, 0, 32, 0.15);
          }

          /* Info item hover effect */
          .info-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            padding: 12px;
            position: relative;
            overflow: hidden;
          }

          .info-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(128, 0, 32, 0.05), transparent);
            transition: left 0.5s ease;
          }

          .info-item:hover::before {
            left: 100%;
          }

          .info-item:hover {
            background-color: rgba(128, 0, 32, 0.05);
            transform: translateX(8px);
          }

          /* Page access item animation */
          .page-access-item {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .page-access-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(128, 0, 32, 0.1), transparent);
            transition: left 0.6s ease;
          }

          .page-access-item:hover::before {
            left: 100%;
          }

          .page-access-item:hover {
            transform: translateX(8px) scale(1.02);
            box-shadow: 0 8px 20px rgba(128, 0, 32, 0.1);
          }

          /* Premium progress bar */
          .premium-progress {
            position: relative;
            overflow: hidden;
            border-radius: 10px;
          }

          .premium-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: progressShimmer 2s infinite;
          }

          @keyframes progressShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          /* Floating elements */
          .floating-element {
            position: absolute;
            animation: float 4s ease-in-out infinite;
          }

          .floating-element:nth-child(1) {
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }

          .floating-element:nth-child(2) {
            top: 20%;
            right: 15%;
            animation-delay: 1s;
          }

          .floating-element:nth-child(3) {
            bottom: 20%;
            left: 20%;
            animation-delay: 2s;
          }

          /* Glass morphism effect */
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Premium button */
          .premium-button {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .premium-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
          }

          .premium-button:hover::before {
            left: 100%;
          }

          .premium-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(128, 0, 32, 0.3);
          }

          /* Interactive avatar */
          .interactive-avatar {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          .interactive-avatar:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 10px 25px rgba(128, 0, 32, 0.3);
          }

          /* Premium badge */
          .premium-badge {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: ${colors.white};
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            box-shadow: 0 4px 10px rgba(128, 0, 32, 0.3);
            animation: glow 2s ease-in-out infinite;
          }
        `}
      </style>
      
      <Container maxWidth="xl" style={{ padding: "40px 0", minHeight: "92vh", background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.creamDark} 100%)` }}>
        <Paper className="animate-slide-in" style={{ padding: "32px", borderRadius: "16px", border: `1px solid ${colors.primary}33`, background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.cream} 100%)`, boxShadow: "0 20px 50px rgba(128, 0, 32, 0.1)", position: "relative", overflow: "hidden" }}>
          
          {/* Decorative floating elements */}
          <div className="floating-element" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(128, 0, 32, 0.05) 100%)", zIndex: 0 }} />
          <div className="floating-element" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(128, 0, 32, 0.05) 100%)", zIndex: 0 }} />
          <div className="floating-element" style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(128, 0, 32, 0.05) 100%)", zIndex: 0 }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", gap: "16px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div className="animate-float" style={{ position: "relative" }}>
                <People className="icon-hover" style={{ fontSize: "48px", color: colors.primary }} />
                <div style={{ position: "absolute", top: "-5px", right: "-5px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: colors.primary, border: "2px solid white" }} />
              </div>
              <div>
                <Typography variant="h4" style={{ color: colors.primary, fontWeight: 800, letterSpacing: "0.5px", fontFamily: "'Poppins', sans-serif" }}>
                  Registered Users
                </Typography>
                <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                  Manage user accounts, roles, and page access
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate("/registration")}
                className="premium-button"
                style={{ 
                  color: colors.white, 
                  textTransform: "none", 
                  borderRadius: "12px", 
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Single Registration
              </Button>

              <Button
                variant="contained"
                startIcon={<GroupAdd />}
                onClick={() => navigate("/bulk-register")}
                className="button-hover"
                style={{ 
                  backgroundColor: colors.black, 
                  color: colors.white, 
                  textTransform: "none", 
                  borderRadius: "12px", 
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Bulk Registration
              </Button>

              <Button
                variant="outlined"
                startIcon={<Pages />}
                onClick={() => navigate("/pages-list")}
                className="button-hover"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  textTransform: "none", 
                  borderRadius: "12px", 
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Pages Library
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert 
              severity="success" 
              className="animate-slide-in"
              style={{ 
                marginBottom: "24px", 
                backgroundColor: "rgba(128, 0, 32, 0.1)", 
                color: colors.primary, 
                border: "1px solid rgba(128, 0, 32, 0.3)",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} style={{ marginBottom: "32px" }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card 
                className="premium-card"
                onMouseEnter={() => setHoveredCard('total')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: colors.white, 
                  border: `1px solid ${colors.primary}33`, 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden",
                  transform: hoveredCard === 'total' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === 'total' ? '0 20px 40px rgba(128, 0, 32, 0.15)' : '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }} />
                <CardContent style={{ textAlign: "center", padding: "24px", zIndex: 1 }}>
                  <AccountCircle 
                    className="icon-hover"
                    style={{ 
                      fontSize: hoveredCard === 'total' ? "52px" : "44px", 
                      color: colors.primary, 
                      marginBottom: "12px",
                      transition: "all 0.3s ease"
                    }} 
                  />
                  <Typography variant="h5" style={{ color: colors.primary, fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card 
                className="premium-card"
                onMouseEnter={() => setHoveredCard('admin')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: colors.white, 
                  border: `1px solid ${colors.primary}33`, 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden",
                  transform: hoveredCard === 'admin' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === 'admin' ? '0 20px 40px rgba(128, 0, 32, 0.15)' : '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.black} 100%)` }} />
                <CardContent style={{ textAlign: "center", padding: "24px", zIndex: 1 }}>
                  <Business 
                    className="icon-hover"
                    style={{ 
                      fontSize: hoveredCard === 'admin' ? "52px" : "44px", 
                      color: colors.primary, 
                      marginBottom: "12px",
                      transition: "all 0.3s ease"
                    }} 
                  />
                  <Typography variant="h5" style={{ color: colors.primary, fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                    {users.filter((u) => u.role === "administrator").length}
                  </Typography>
                  <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                    Administrators
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card 
                className="premium-card"
                onMouseEnter={() => setHoveredCard('staff')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: colors.white, 
                  border: `1px solid ${colors.primary}33`, 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden",
                  transform: hoveredCard === 'staff' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === 'staff' ? '0 20px 40px rgba(128, 0, 32, 0.15)' : '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: `linear-gradient(90deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }} />
                <CardContent style={{ textAlign: "center", padding: "24px", zIndex: 1 }}>
                  <Person 
                    className="icon-hover"
                    style={{ 
                      fontSize: hoveredCard === 'staff' ? "52px" : "44px", 
                      color: colors.primary, 
                      marginBottom: "12px",
                      transition: "all 0.3s ease"
                    }} 
                  />
                  <Typography variant="h5" style={{ color: colors.primary, fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                    {users.filter((u) => u.role === "staff").length}
                  </Typography>
                  <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                    Staff Members
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card 
                className="premium-card"
                onMouseEnter={() => setHoveredCard('super')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: colors.white, 
                  border: `1px solid ${colors.primary}33`, 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden",
                  transform: hoveredCard === 'super' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === 'super' ? '0 20px 40px rgba(128, 0, 32, 0.15)' : '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: "linear-gradient(90deg, #660018 0%, #800020 100%)" }} />
                <CardContent style={{ textAlign: "center", padding: "24px", zIndex: 1 }}>
                  <Person 
                    className="icon-hover"
                    style={{ 
                      fontSize: hoveredCard === 'super' ? "52px" : "44px", 
                      color: colors.primaryDark, 
                      marginBottom: "12px",
                      transition: "all 0.3s ease"
                    }} 
                  />
                  <Typography variant="h5" style={{ color: colors.primaryDark, fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                    {users.filter((u) => u.role === "superadmin").length}
                  </Typography>
                  <Typography variant="body2" style={{ color: colors.primaryDark, fontFamily: "'Poppins', sans-serif" }}>
                    Superadmins
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card 
                className="premium-card"
                onMouseEnter={() => setHoveredCard('filtered')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: colors.white, 
                  border: `1px solid ${colors.primary}33`, 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden",
                  transform: hoveredCard === 'filtered' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === 'filtered' ? '0 20px 40px rgba(128, 0, 32, 0.15)' : '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }} />
                <CardContent style={{ textAlign: "center", padding: "24px", zIndex: 1 }}>
                  <Visibility 
                    className="icon-hover"
                    style={{ 
                      fontSize: hoveredCard === 'filtered' ? "52px" : "44px", 
                      color: colors.primary, 
                      marginBottom: "12px",
                      transition: "all 0.3s ease"
                    }} 
                  />
                  <Typography variant="h5" style={{ color: colors.primary, fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                    {filteredUsers.length}
                  </Typography>
                  <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                    Filtered Results
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "16px" }}>
            <TextField
              label="Search Users"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: colors.primary }} />
                  </InputAdornment>
                ),
              }}
              style={{ flex: 1, backgroundColor: colors.white, borderRadius: "16px" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontFamily: "'Poppins', sans-serif"
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', sans-serif"
                }
              }}
            />

            <TextField
              select
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ minWidth: "240px", backgroundColor: colors.white, borderRadius: "16px" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontFamily: "'Poppins', sans-serif"
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', sans-serif"
                }
              }}
            >
              <MenuItem value="" style={{ fontFamily: "'Poppins', sans-serif" }}>All Roles</MenuItem>
              <MenuItem value="Superadmin" style={{ fontFamily: "'Poppins', sans-serif" }}>Superadmin</MenuItem>
              <MenuItem value="Administrator" style={{ fontFamily: "'Poppins', sans-serif" }}>Administrator</MenuItem>
              <MenuItem value="Staff" style={{ fontFamily: "'Poppins', sans-serif" }}>Staff</MenuItem>
            </TextField>

            <Tooltip title="Refresh Users">
              <IconButton
                onClick={fetchUsers}
                className={refreshing ? "icon-hover" : ""}
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.white, 
                  boxShadow: "0 8px 20px rgba(128, 0, 32, 0.15)",
                  animation: refreshing ? 'pulse 1s infinite' : 'none',
                  borderRadius: "12px"
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </div>

          {/* Summary */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div>
              {!loading && filteredUsers.length > 0 ? (
                <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                  {searchTerm
                    ? `Showing ${filteredUsers.length} of ${users.length} users matching "${searchTerm}"`
                    : `Total: ${users.length} registered users`}
                </Typography>
              ) : null}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              className="animate-slide-in"
              style={{ 
                marginBottom: "24px", 
                backgroundColor: "rgba(128, 0, 32, 0.1)", 
                color: colors.primary, 
                border: "1px solid rgba(128, 0, 32, 0.3)",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <LinearProgress style={{ height: "8px", borderRadius: "4px", backgroundColor: "rgba(128, 0, 32, 0.1)" }} />
            </div>
          )}

          {/* Users Table */}
          {!loading && (
            <>
              <TableContainer component={Paper} elevation={2} style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 30px rgba(128, 0, 32, 0.1)", border: `1px solid ${colors.primary}33` }}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: colors.primary }}>
                      <TableCell style={{ color: colors.white, fontWeight: "700", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif" }}>
                        <BadgeIcon style={{ marginRight: "8px" }} />
                        Employee #
                      </TableCell>
                      <TableCell style={{ color: colors.white, fontWeight: "700", fontFamily: "'Poppins', sans-serif" }}>
                        <Person style={{ marginRight: "8px" }} />
                        Full Name
                      </TableCell>
                      <TableCell style={{ color: colors.white, fontWeight: "700", fontFamily: "'Poppins', sans-serif" }}>
                        <Email style={{ marginRight: "8px" }} />
                        Email
                      </TableCell>
                      <TableCell style={{ color: colors.white, fontWeight: "700", fontFamily: "'Poppins', sans-serif" }}>
                        <Business style={{ marginRight: "8px" }} />
                        Role
                      </TableCell>
                      <TableCell style={{ color: colors.white, fontWeight: "700", textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
                        <Security style={{ marginRight: "8px" }} />
                        User Access
                      </TableCell>
                      <TableCell style={{ color: colors.white, fontWeight: "700", textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
                        <Settings style={{ marginRight: "8px" }} />
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow
                          key={user.employeeNumber}
                          className="row-hover"
                          onMouseEnter={() => setHoveredRow(user.employeeNumber)}
                          onMouseLeave={() => setHoveredRow(null)}
                          style={{
                            backgroundColor: paginatedUsers.indexOf(user) % 2 === 0 ? "rgba(255, 248, 231, 0.5)" : "transparent",
                          }}
                        >
                          <TableCell style={{ fontWeight: 700, color: colors.primary, width: "140px", fontFamily: "'Poppins', sans-serif" }}>
                            {user.employeeNumber}
                          </TableCell>

                          <TableCell style={{ minWidth: "240px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <Avatar
                                src={user.avatar || ""}
                                alt={user.fullName || user.username}
                                className="interactive-avatar"
                                style={{
                                  width: hoveredRow === user.employeeNumber ? "56px" : "48px",
                                  height: hoveredRow === user.employeeNumber ? "56px" : "48px",
                                  backgroundColor: colors.primary,
                                  color: colors.white,
                                  fontWeight: "700",
                                  fontSize: "1rem",
                                  boxShadow: hoveredRow === user.employeeNumber ? "0 10px 25px rgba(128, 0, 32, 0.3)" : "0 6px 18px rgba(128, 0, 32, 0.15)",
                                  border: "3px solid #fff",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {!user.avatar && getInitials(user.fullName || user.username)}
                              </Avatar>

                              <div>
                                <Typography variant="body1" style={{ fontWeight: 700, color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                                  {user.fullName || user.username || "N/A"}
                                </Typography>
                                <Typography variant="caption" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                                  {user.nameExtension && `(${user.nameExtension})`}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={(user.role || "").toUpperCase()}
                              size="small"
                              icon={getRoleColor(user.role).icon}
                              style={{
                                ...getRoleColor(user.role),
                                fontWeight: 700,
                                padding: "6px 14px",
                                transform: hoveredRow === user.employeeNumber ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.3s ease",
                                color: colors.black,
                                fontFamily: "'Poppins', sans-serif"
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Button
                              onClick={() => handlePageAccessClick(user)}
                              startIcon={<Security />}
                              className="premium-button"
                              style={{
                                color: colors.white,
                                padding: "8px 18px",
                                borderRadius: "14px",
                                textTransform: "none",
                                minWidth: "120px",
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif"
                              }}
                            >
                              Manage
                            </Button>
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => openUserDetails(user)}
                                className="icon-hover"
                                style={{ 
                                  color: colors.primary,
                                  transform: hoveredRow === user.employeeNumber ? "rotate(90deg)" : "rotate(0deg)",
                                  transition: "all 0.3s ease"
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: "center", padding: "48px" }}>
                          <Typography variant="h6" style={{ color: colors.primary, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                            {searchTerm ? "No users found matching your search" : "No users registered yet"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <TablePagination
                    component="div"
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        color: colors.primary,
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif"
                      },
                      "& .MuiTablePagination-select": {
                        color: colors.primary,
                        fontFamily: "'Poppins', sans-serif"
                      },
                      "& .MuiIconButton-root": {
                        color: colors.primary,
                      },
                      background: "transparent",
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Page Access Management Dialog */}
          <Dialog
            open={pageAccessDialog}
            onClose={closePageAccessDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(128, 0, 32, 0.25)",
                backgroundColor: colors.cream,
              },
            }}
          >
            <DialogTitle style={{
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: colors.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 28px",
              fontWeight: "bold",
              fontSize: "1.3rem",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontFamily: "'Poppins', sans-serif"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Security className="icon-hover" style={{ fontSize: "30px" }} />
                Users Page Access Management
              </div>

              <IconButton
                onClick={closePageAccessDialog}
                className="button-hover"
                style={{ color: colors.white, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent style={{ padding: "28px", backgroundColor: colors.cream }}>
              {selectedUser && (
                <>
                  <div style={{
                    marginBottom: "28px",
                    padding: "24px",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}33`,
                    background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.creamDark} 100%)`,
                    boxShadow: "0 6px 16px rgba(128, 0, 32, 0.1)",
                    transition: "all 0.3s ease"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                      <Avatar
                        src={selectedUser.avatar || ""}
                        alt={selectedUser.fullName}
                        className="interactive-avatar"
                        style={{
                          backgroundColor: colors.primary,
                          width: "64px",
                          height: "64px",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          border: "3px solid #fff",
                          boxShadow: "0 6px 12px rgba(128, 0, 32, 0.2)",
                        }}
                      >
                        {!selectedUser.avatar &&
                          (selectedUser.fullName
                            ? selectedUser.fullName.split(" ").map((n) => n[0]).join("")
                            : (selectedUser.username?.charAt(0).toUpperCase() || "U"))}
                      </Avatar>

                      <div>
                        <Typography variant="subtitle1" style={{ fontWeight: "bold", color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                          {selectedUser.fullName}
                        </Typography>
                        <Typography variant="body2" style={{ color: colors.primary, marginTop: "6px", fontFamily: "'Poppins', sans-serif" }}>
                          Employee Number: <strong>{selectedUser.employeeNumber}</strong> 
                          | Role: <strong>{selectedUser.role}</strong> 
                          | Email: <strong>{selectedUser.email}</strong>
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* All Pages Switch */}
                  {!pageAccessLoading && pages.length > 0 && (
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "20px",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                      <Typography style={{ fontWeight: "bold", color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                        All Pages:
                      </Typography>
                      <Switch
                        checked={Object.values(pageAccess).every((v) => v === true)}
                        onChange={(e) => {
                          const enableAll = e.target.checked;
                          pages.forEach((page) => {
                            if (pageAccess[page.id] !== enableAll)
                              handleTogglePageAccess(page.id, !enableAll);
                          });
                        }}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: colors.primary,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: colors.primary,
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: '#ccc',
                          },
                        }}
                      />
                      <Typography style={{ fontWeight: "bold", color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                        {Object.values(pageAccess).every((v) => v === true) ? "On" : "Off"}
                      </Typography>
                    </div>
                  )}

                  {/* Page List */}
                  {pageAccessLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                      <CircularProgress style={{ color: colors.primary }} />
                    </div>
                  ) : pages.length > 0 ? (
                    <Paper elevation={4} style={{ borderRadius: "12px", border: `1px solid ${colors.primary}33`, backgroundColor: colors.cream, maxHeight: "400px", overflow: "auto" }}>
                      <List>
                        {pages.map((page) => (
                          <ListItem 
                            key={page.id} 
                            style={{
                              padding: "18px",
                              borderRadius: "10px",
                              marginBottom: "6px",
                              transition: "all 0.3s ease",
                              backgroundColor: colors.white,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(255, 240, 229, 0.5)";
                              e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.white;
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" style={{ fontWeight: "bold", color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                                  {page.page_name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                                  Page ID: {page.id}
                                </Typography>
                              }
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {accessChangeInProgress[page.id] ? (
                                <CircularProgress size={24} style={{ color: colors.primary }} />
                              ) : (
                                <>
                                  {pageAccess[page.id] ? (
                                    <LockOpen className="icon-hover" style={{ color: colors.primary }} />
                                  ) : (
                                    <Lock className="icon-hover" style={{ color: colors.primary }} />
                                  )}
                                  <Switch
                                    checked={!!pageAccess[page.id]}
                                    onChange={() => handleTogglePageAccess(page.id, !!pageAccess[page.id])}
                                    sx={{
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: colors.primary,
                                      },
                                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: colors.primary,
                                      },
                                      '& .MuiSwitch-track': {
                                        backgroundColor: '#ccc',
                                      },
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ) : (
                    <Typography variant="body1" style={{ textAlign: "center", padding: "30px", color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                      No pages found in the system.
                    </Typography>
                  )}
                </>
              )}
            </DialogContent>

            <DialogActions style={{ padding: "28px", backgroundColor: colors.cream }}>
              <Button
                onClick={closePageAccessDialog}
                className="premium-button"
                style={{
                  color: colors.white,
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "10px 28px",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Enhanced Premium User Details Drawer */}
          <Drawer
            anchor="right"
            open={detailsDrawerOpen}
            onClose={closeUserDetails}
            PaperProps={{
              style: {
                width: isMobile ? "100%" : "520px",
                backgroundColor: colors.cream,
                borderLeft: `1px solid ${colors.primary}33`,
                boxShadow: "-10px 0 30px rgba(128, 0, 32, 0.15)",
              },
            }}
          >
            {selectedUserForDetails && (
              <div style={{ padding: 0, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Premium Header with enhanced animations */}
                <div className="drawer-header-gradient" style={{
                  padding: "40px 28px",
                  color: colors.white,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(128, 0, 32, 0.25)",
                }}>
                  {/* Floating decorative elements */}
                  <div className="floating-element" style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", top: "10%", right: "10%" }} />
                  <div className="floating-element" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", bottom: "20%", left: "15%" }} />
                  
                  <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <div style={{ position: "relative" }}>
                        <Avatar
                          src={selectedUserForDetails.avatar || ""}
                          alt={selectedUserForDetails.fullName}
                          className="interactive-avatar animate-glow"
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: colors.white,
                            color: colors.primary,
                            fontWeight: "bold",
                            fontSize: "2rem",
                            border: "4px solid rgba(255,255,255,0.8)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                          }}
                        >
                          {!selectedUserForDetails.avatar && getInitials(selectedUserForDetails.fullName)}
                        </Avatar>
                      </div>
                      <div>
                        <Typography variant="h5" style={{ fontWeight: "bold", marginBottom: "6px", textShadow: "0 2px 4px rgba(0,0,0,0.2)", fontFamily: "'Poppins', sans-serif" }}>
                          {selectedUserForDetails.fullName}
                        </Typography>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {getRoleColor(selectedUserForDetails.role).icon}
                          <Typography variant="body2" style={{ opacity: 0.9, fontFamily: "'Poppins', sans-serif" }}>
                            {selectedUserForDetails.role}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <IconButton 
                      onClick={closeUserDetails} 
                      className="button-hover"
                      style={{ 
                        color: colors.white,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div style={{ 
                  display: "flex", 
                  backgroundColor: colors.white, 
                  borderBottom: `1px solid ${colors.primary}20`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  position: "relative",
                  zIndex: 1
                }}>
                  <div
                    onClick={() => setActiveTab("info")}
                    className={`tab-indicator ${activeTab === "info" ? "active" : ""}`}
                    style={{
                      flex: 1,
                      padding: "20px 16px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      color: activeTab === "info" ? colors.primary : colors.primary,
                      fontWeight: activeTab === "info" ? 600 : 500,
                      position: "relative",
                      overflow: "hidden",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== "info") {
                        e.currentTarget.style.backgroundColor = "rgba(128, 0, 32, 0.05)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "info") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <Info style={{ marginRight: "10px", fontSize: "22px" }} />
                    Information
                  </div>
                  <div
                    onClick={() => setActiveTab("access")}
                    className={`tab-indicator ${activeTab === "access" ? "active" : ""}`}
                    style={{
                      flex: 1,
                      padding: "20px 16px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      color: activeTab === "access" ? colors.primary : colors.primary,
                      fontWeight: activeTab === "access" ? 600 : 500,
                      position: "relative",
                      overflow: "hidden",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== "access") {
                        e.currentTarget.style.backgroundColor = "rgba(128, 0, 32, 0.05)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "access") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <Key style={{ marginRight: "10px", fontSize: "22px" }} />
                    Page Access
                  </div>
                </div>

                {/* Enhanced Content Area */}
                <div style={{ 
                  flex: 1, 
                  overflow: "auto", 
                  padding: "28px",
                  background: `linear-gradient(to bottom, ${colors.cream} 0%, ${colors.white} 100%)`
                }}>
                  {activeTab === "info" && (
                    <div className="animate-slide-right">
                      {/* Premium Personal Information Card */}
                      <Card elevation={4} className="premium-card" style={{
                        marginBottom: "28px",
                        borderRadius: "16px",
                        border: `1px solid ${colors.primary}20`,
                        backgroundColor: colors.white,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(128, 0, 32, 0.1)",
                      }}>
                        <div style={{
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          padding: "18px 22px",
                          color: colors.white,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          boxShadow: "0 4px 12px rgba(128, 0, 32, 0.25)",
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          <AssignmentInd style={{ fontSize: "24px" }} />
                          Personal Information
                        </div>
                        <div style={{ padding: "24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <Person style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Full Name
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.fullName}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <BadgeIcon style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Employee Number
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.employeeNumber}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <ContactMail style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Email Address
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.email}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <Business style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Role
                                </Typography>
                                <Chip
                                  label={selectedUserForDetails.role}
                                  icon={getRoleColor(selectedUserForDetails.role).icon}
                                  style={{
                                    ...getRoleColor(selectedUserForDetails.role),
                                    fontWeight: 700,
                                    color: colors.black,
                                    fontFamily: "'Poppins', sans-serif"
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <AccessTime style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Last Login
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {formatDate(selectedUserForDetails.lastLogin)}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Premium Detailed Information Card */}
                      <Card elevation={4} className="premium-card" style={{
                        borderRadius: "16px",
                        border: `1px solid ${colors.primary}20`,
                        backgroundColor: colors.white,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(128, 0, 32, 0.1)",
                      }}>
                        <div style={{
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          padding: "18px 22px",
                          color: colors.white,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          boxShadow: "0 4px 12px rgba(128, 0, 32, 0.25)",
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          <VerifiedUser style={{ fontSize: "24px" }} />
                          Detailed Information
                        </div>
                        <div style={{ padding: "24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <Person style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  First Name
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.personData?.firstName || "N/A"}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <Person style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Middle Name
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.personData?.middleName || "N/A"}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <Person style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Last Name
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.personData?.lastName || "N/A"}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="info-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(128, 0, 32, 0.2)"
                              }}>
                                <BadgeIcon style={{ color: "white", fontSize: "24px" }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", marginBottom: "6px", fontFamily: "'Poppins', sans-serif" }}>
                                  Name Extension
                                </Typography>
                                <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                  {selectedUserForDetails.personData?.nameExtension || "N/A"}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === "access" && (
                    <div className="animate-slide-right">
                      {/* Premium Page Access Summary Card */}
                      <Card elevation={4} className="premium-card" style={{
                        marginBottom: "28px",
                        borderRadius: "16px",
                        border: `1px solid ${colors.primary}20`,
                        backgroundColor: colors.white,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(128, 0, 32, 0.1)",
                      }}>
                        <div style={{
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          padding: "18px 22px",
                          color: colors.white,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          boxShadow: "0 4px 12px rgba(128, 0, 32, 0.25)",
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          <TrendingUp style={{ fontSize: "24px" }} />
                          Page Access Summary
                        </div>
                        <div style={{ padding: "24px" }}>
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "24px", flexDirection: "column" }}>
                            <Typography variant="h2" style={{ color: colors.primary, fontWeight: "bold", marginBottom: "12px", fontFamily: "'Poppins', sans-serif" }}>
                              {selectedUserForDetails.accessiblePages?.length || 0}
                            </Typography>
                            <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                              of {selectedUserForDetails.totalPages || 0} pages accessible
                            </Typography>
                          </div>
                          
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            <div className="premium-progress" style={{
                              width: "240px",
                              height: "12px",
                              backgroundColor: "#e0e0e0",
                              borderRadius: "6px",
                              overflow: "hidden",
                              position: "relative"
                            }}>
                              <div style={{
                                width: `${animatedValue}%`,
                                height: "100%",
                                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
                                borderRadius: "6px",
                                boxShadow: "0 0 15px rgba(128, 0, 32, 0.5)",
                                transition: "width 1s ease-in-out"
                              }}></div>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: selectedUserForDetails.hasAccess ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` : `linear-gradient(135deg, #e0e0e0 0%, #cccccc 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 8px",
                                boxShadow: selectedUserForDetails.hasAccess ? "0 6px 16px rgba(128, 0, 32, 0.3)" : "0 6px 16px rgba(0, 0, 0, 0.1)"
                              }}>
                                <CheckCircle style={{ color: selectedUserForDetails.hasAccess ? "white" : "#999", fontSize: "30px" }} />
                              </div>
                              <Typography variant="body2" style={{ color: selectedUserForDetails.hasAccess ? colors.primary : "#999", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                Active
                              </Typography>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: !selectedUserForDetails.hasAccess ? `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.black} 100%)` : `linear-gradient(135deg, #e0e0e0 0%, #cccccc 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 8px",
                                boxShadow: !selectedUserForDetails.hasAccess ? "0 6px 16px rgba(0, 0, 0, 0.3)" : "0 6px 16px rgba(0, 0, 0, 0.1)"
                              }}>
                                <LockPerson style={{ color: !selectedUserForDetails.hasAccess ? "white" : "#999", fontSize: "30px" }} />
                              </div>
                              <Typography variant="body2" style={{ color: !selectedUserForDetails.hasAccess ? colors.primaryDark : "#999", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                Restricted
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Premium Accessible Pages Card */}
                      <Card elevation={4} className="premium-card" style={{
                        borderRadius: "16px",
                        border: `1px solid ${colors.primary}20`,
                        backgroundColor: colors.white,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(128, 0, 32, 0.1)",
                      }}>
                        <div style={{
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          padding: "18px 22px",
                          color: colors.white,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          boxShadow: "0 4px 12px rgba(128, 0, 32, 0.25)",
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          <Shield style={{ fontSize: "24px" }} />
                          Accessible Pages
                        </div>
                        <div style={{ padding: "24px" }}>
                          {selectedUserForDetails.accessiblePages && selectedUserForDetails.accessiblePages.length > 0 ? (
                            <div style={{ maxHeight: "350px", overflow: "auto" }}>
                              {selectedUserForDetails.accessiblePages.map((page, index) => (
                                <div key={page.id} className="page-access-item" style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "16px",
                                  padding: "16px",
                                  marginBottom: "12px",
                                  backgroundColor: index % 2 === 0 ? "rgba(128, 0, 32, 0.05)" : "rgba(157, 34, 53, 0.05)",
                                  borderRadius: "12px",
                                  border: `1px solid ${colors.primary}15`,
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  position: "relative",
                                  overflow: "hidden"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "rgba(128, 0, 32, 0.1)";
                                  e.currentTarget.style.transform = "translateX(8px) scale(1.02)";
                                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(128, 0, 32, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? "rgba(128, 0, 32, 0.05)" : "rgba(157, 34, 53, 0.05)";
                                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}>
                                  <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 16px rgba(128, 0, 32, 0.3)"
                                  }}>
                                    <CheckCircle style={{ color: "white", fontSize: "24px" }} />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                      {page.page_name}
                                    </Typography>
                                    <Typography variant="body2" style={{ color: colors.primary, fontSize: "0.9rem", fontFamily: "'Poppins', sans-serif" }}>
                                      ID: {page.id}
                                    </Typography>
                                  </div>
                                  <div className="animate-bounce">
                                    <Star style={{ color: colors.primary, fontSize: "20px" }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{
                              padding: "40px",
                              backgroundColor: "rgba(128, 0, 32, 0.05)",
                              borderRadius: "12px",
                              border: "1px solid rgba(128, 0, 32, 0.2)",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "16px"
                            }}>
                              <div style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(128, 0, 32, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                                <Cancel style={{ color: colors.primary, fontSize: "36px" }} />
                              </div>
                              <Typography variant="body1" style={{ color: colors.primary, fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                No page access granted
                              </Typography>
                              <Typography variant="body2" style={{ color: colors.primary, fontFamily: "'Poppins', sans-serif" }}>
                                This user doesn't have access to any pages yet
                              </Typography>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Premium Action Buttons */}
                <div style={{ 
                  padding: "28px", 
                  backgroundColor: colors.white, 
                  borderTop: `1px solid ${colors.primary}20`,
                  boxShadow: "0 -6px 20px rgba(0,0,0,0.08)"
                }}>
                  <Button
                    variant="contained"
                    startIcon={<Security />}
                    onClick={() => {
                      closeUserDetails();
                      handlePageAccessClick(selectedUserForDetails);
                    }}
                    className="premium-button"
                    style={{
                      color: colors.white,
                      textTransform: "none",
                      borderRadius: "14px",
                      width: "100%",
                      padding: "16px",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Manage Page Access
                  </Button>
                </div>
              </div>
            )}
          </Drawer>
        </Paper>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            className="fab-hover animate-bounce"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: colors.primary,
            }}
            onClick={() => setFilterMenuOpen(true)}
          >
            <FilterList />
          </Fab>
        )}

        {/* Mobile Filter Menu */}
        <Drawer
          anchor="bottom"
          open={filterMenuOpen}
          onClose={() => setFilterMenuOpen(false)}
          PaperProps={{
            style: {
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              backgroundColor: colors.cream,
              padding: "20px",
            },
          }}
        >
          <div style={{ padding: "20px" }}>
            <Typography variant="h6" style={{ color: colors.primary, fontWeight: "bold", marginBottom: "20px", fontFamily: "'Poppins', sans-serif" }}>
              Filter Users
            </Typography>
            <TextField
              label="Search Users"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              style={{ marginBottom: "20px" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: "'Poppins', sans-serif"
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', sans-serif"
                }
              }}
            />
            <TextField
              select
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              fullWidth
              style={{ marginBottom: "20px" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: "'Poppins', sans-serif"
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', sans-serif"
                }
              }}
            >
              <MenuItem value="" style={{ fontFamily: "'Poppins', sans-serif" }}>All Roles</MenuItem>
              <MenuItem value="Superadmin" style={{ fontFamily: "'Poppins', sans-serif" }}>Superadmin</MenuItem>
              <MenuItem value="Administrator" style={{ fontFamily: "'Poppins', sans-serif" }}>Administrator</MenuItem>
              <MenuItem value="Staff" style={{ fontFamily: "'Poppins', sans-serif" }}>Staff</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={() => setFilterMenuOpen(false)}
              fullWidth
              className="premium-button"
              style={{
                color: colors.white,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Drawer>
      </Container>
    </>
  );
};

export default UsersList;