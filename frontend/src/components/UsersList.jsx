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
  Divider,
} from "@mui/material";
import {
  People,
  Search,
  PersonAdd,
  GroupAdd,
  Email,
  Badge,
  Person,
  Visibility,
  Refresh,
  AccountCircle,
  Business,
  Security,
  Close,
  Pages,
} from "@mui/icons-material";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Page Access Management States
  const [pageAccessDialog, setPageAccessDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageAccess, setPageAccess] = useState({});
  const [pageAccessLoading, setPageAccessLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Something went wrong while fetching users");
    } finally {
      setLoading(false);
    }
  };


  

  // Page Access Management Functions
const handlePageAccessClick = async (user) => {
  setSelectedUser(user);
  setPageAccessLoading(true);
  setPageAccessDialog(true);

  try {
    // Fetch all pages
    const pagesResponse = await fetch(`${API_BASE_URL}/pages`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (pagesResponse.ok) {
      let pagesData = await pagesResponse.json();

      // Sort pages by ID (ascending)
      pagesData = pagesData.sort((a, b) => a.id - b.id);

      // Set pages (replace instead of append)
      setPages(pagesData);

      // Fetch user's page access
      const accessResponse = await fetch(
        `${API_BASE_URL}/page_access/${user.employeeNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (accessResponse.ok) {
        const accessData = await accessResponse.json();
        const accessMap = accessData.reduce((acc, curr) => {
          acc[curr.page_id] = String(curr.page_privilege) === "1";
          return acc;
        }, {});
        setPageAccess(accessMap);
      }
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
          const existingRecord = existingAccess.find(
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
              const errorData = await createResponse.json();
              console.error("Error creating page access:", errorData);
              setError(
                `Failed to create page access: ${errorData.error || "Unknown error"}`
              );
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
              const errorData = await updateResponse.json();
              console.error("Error updating page access:", errorData);
              setError(
                `Failed to update page access: ${errorData.error || "Unknown error"}`
              );
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
          const errorData = await updateResponse.json();
          console.error("Error updating page access:", errorData);
          setError(
            `Failed to update page access: ${errorData.error || "Unknown error"}`
          );
          return;
        }
      }

      setPageAccess((prevAccess) => ({
        ...prevAccess,
        [pageId]: newAccess,
      }));

      console.log(
        `Successfully ${newAccess ? "granted" : "revoked"} access to page ${pageId} for user ${selectedUser.employeeNumber}`
      );
    } catch (err) {
      console.error("Error updating page access:", err);
      setError("Network error occurred while updating page access");
    }
  };

  const closePageAccessDialog = () => {
    setPageAccessDialog(false);
    setSelectedUser(null);
    setPages([]);
    setPageAccess({});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeNumber.toString().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, users]);

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

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "superadmin":
        return { bgcolor: "#000000", color: "white" };
      case "administrator":
        return { bgcolor: "#353434ff", color: "white" };
      case "staff":
        return { bgcolor: "#8a4747", color: "white" };
      default:
        return { bgcolor: "#a67171", color: "white" };
    }
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
        minHeight: "90vh",
        backgroundColor: "#f9f4f0",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          border: "2px solid #e0c4c4",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          <People sx={{ fontSize: 40, color: "#6d2323", mr: 1 }} />
          <Typography variant="h4" sx={{ color: "#6d2323", fontWeight: "bold" }}>
            Registered Users
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ bgcolor: "#f5e6e6", border: "1px solid #e0c4c4" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <AccountCircle sx={{ fontSize: 40, color: "#6d2323", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#6d2323", fontWeight: "bold" }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#8a4747" }}>
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ bgcolor: "#ece2e6", border: "1px solid #e0c4c4" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Business sx={{ fontSize: 40, color: "#6d2323", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#6d2323", fontWeight: "bold" }}>
                  {users.filter((u) => u.role === "administrator").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6d2323" }}>
                  Administrators
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ bgcolor: "#f0e6e9", border: "1px solid #e0c4c4" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Person sx={{ fontSize: 40, color: "#8a4747", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#8a4747", fontWeight: "bold" }}>
                  {users.filter((u) => u.role === "staff").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#8a4747" }}>
                  Staff Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ bgcolor: "#e8dfe2", border: "1px solid #e0c4c4" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Person sx={{ fontSize: 40, color: "#5a1e1e", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#5a1e1e", fontWeight: "bold" }}>
                  {users.filter((u) => u.role === "superadmin").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#5a1e1e" }}>
                  Superadmins
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ bgcolor: "#f2edeb", border: "1px solid #e0c4c4" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Visibility sx={{ fontSize: 40, color: "#a67171", mb: 1 }} />
                <Typography variant="h5" sx={{ color: "#a67171", fontWeight: "bold" }}>
                  {filteredUsers.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#a67171" }}>
                  Filtered Results
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by name, email, employee number, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: "300px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#8a4747" },
                "&.Mui-focused fieldset": { borderColor: "#6d2323" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6d2323" }} />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh Users">
            <IconButton
              onClick={fetchUsers}
              sx={{
                bgcolor: "#6d2323",
                color: "white",
                "&:hover": { bgcolor: "#5a1e1e" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate("/registration")}
            sx={{
              bgcolor: "#6d2323",
              "&:hover": { bgcolor: "#5a1e1e" },
            }}
          >
            Single Registration
          </Button>
          <Button
            variant="contained"
            startIcon={<GroupAdd />}
            onClick={() => navigate("/bulk-register")}
            sx={{
              bgcolor: "#000000",
              "&:hover": { bgcolor: "#353434ff" },
            }}
          >
            Bulk Registration
          </Button>
          <Button
            variant="contained"
            startIcon={<Pages />}
            onClick={() => navigate("/pages-list")}
            sx={{
              bgcolor: "#6d2323",
              "&:hover": { bgcolor: "#5a1e1e" },
            }}
          >
            Pages Library
          </Button>

          {/* Summary Text */}
        {!loading && filteredUsers.length > 0 && (
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#8a4747" }}>
              {searchTerm 
                ? `Showing ${filteredUsers.length} of ${users.length} users matching "${searchTerm}"`
                : `Total: ${users.length} registered users`
              }
            </Typography>
          </Box>
        )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "#f5e6e6",
              color: "#5a1e1e",
              border: "1px solid #e0c4c4",
              "& .MuiAlert-icon": { color: "#5a1e1e" },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress sx={{ color: "#6d2323" }} />
          </Box>
        )}

        {/* Users Table */}
        {!loading && (
          <>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#6d2323" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <Badge sx={{ mr: 1 }} />
                      Employee #
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <Person sx={{ mr: 1 }} />
                      Full Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <Email sx={{ mr: 1 }} />
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <Business sx={{ mr: 1 }} />
                      Role
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                      <Security sx={{ mr: 1 }} />
                      User Access
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow
                        key={user.employeeNumber}
                        sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" }, "&:hover": { bgcolor: "#f5f5f5" } }}
                      >
                        <TableCell sx={{ fontWeight: "bold", color: "#6d2323" }}>
                          {user.employeeNumber}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                              {user.fullName || "N/A"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#8a4747" }}>
                              {user.nameExtension && `(${user.nameExtension})`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role.toUpperCase()} size="small" sx={getRoleColor(user.role)} />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Tooltip title="Manage Page Access">
                            <Button
                              onClick={() => handlePageAccessClick(user)}
                              startIcon={<Security />}
                              sx={{
                                color: "#fff",
                                bgcolor: "#6d2323",
                                "&:hover": { bgcolor: "#f5e6e6", color: "#6d2323", transform: "scale(1.1)" },
                                p: 1.5,
                                borderRadius: 1,
                                transition: "all 0.2s ease",
                                textTransform: "none", // keeps text as normal
                              }}
                            >
                              Manage
                            </Button>

                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="h6" sx={{ color: "#6d2323" }}>
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
                    color: "#6d2323",
                    fontWeight: "bold",
                  },
                  "& .MuiTablePagination-select": {
                    color: "#6d2323",
                  },
                  "& .MuiIconButton-root": {
                    color: "#6d2323",
                  },
                }}
              />
            )}
          </>
        )}

        {/* Page Access Management Dialog */}
        <Dialog 
          open={pageAccessDialog} 
          onClose={closePageAccessDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle 
            sx={{ 
              bgcolor: "#6d2323", 
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", fontWeight: 'bold' }}>
              <Security sx={{ mr: 1 }} />
              Users Page Access Management
            </Box>
            <IconButton
              onClick={closePageAccessDialog}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {selectedUser && (
              <>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    backgroundColor: "#f5e6e6",
                    color: "#6d2323",
                    border: "1px solid #e0c4c4",
                    "& .MuiAlert-icon": { color: "#6d2323" }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Managing Access for: {selectedUser.fullName}
                  </Typography>
                  <Typography variant="body2">
                    Employee ID: <strong>{selectedUser.employeeNumber}</strong> | 
                    Role/Access Level: <strong>{selectedUser.role}</strong> | 
                    Email: <strong>{selectedUser.email}</strong>
                  </Typography>
                </Alert>

                {pageAccessLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "#6d2323" }} />
                  </Box>
                ) : (
                  <>
                    {pages.length > 0 ? (
                      <Paper elevation={1} sx={{ border: "1px solid #e0c4c4" }}>
                        <List>
                          {pages.map((page, index) => (
                            <React.Fragment key={page.id}>
                              <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                  primary={
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#6d2323" }}>
                                      {page.page_name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="body2" sx={{ color: "#8a4747" }}>
                                      Page ID: {page.id}
                                    </Typography>
                                  }
                                />
                                <Switch
                                  checked={!!pageAccess[page.id]}
                                  onChange={() => handleTogglePageAccess(page.id, !!pageAccess[page.id])}
                                  sx={{
                                    '& .MuiSwitch-switchBase': {
                                      color: pageAccess[page.id] ? '#6d2323' : '#ccc',
                                    },
                                    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                                      backgroundColor: pageAccess[page.id] ? '#6d2323' : '#ccc',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#6d2323',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#6d2323',
                                    },
                                  }}
                                />
                              </ListItem>
                              {index < pages.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      </Paper>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: "center", py: 3, color: "#8a4747" }}>
                        No pages found in the system.
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, bgcolor: "#fafafa" }}>
            <Button 
              onClick={closePageAccessDialog} 
              variant="contained"
              startIcon={<Close />}
              sx={{ 
                bgcolor: "#8a4747", 
                "&:hover": { bgcolor: "#6d2323" } 
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UsersList;