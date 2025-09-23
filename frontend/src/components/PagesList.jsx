import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Pages,
  Security,
  Group,
  Description,
  Warning,
  CheckCircle,
  Error,
  Home,
  Person,
} from "@mui/icons-material";
import AccessDenied from "./AccessDenied";

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [pageDescription, setPageDescription] = useState('');
  const [pageGroup, setPageGroup] = useState('');
  const [pageName, setPageName] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletePageId, setDeletePageId] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  
  //ACCESSING
  // Page access control states
  const [hasAccess, setHasAccess] = useState(null);


  // Page access control - Add this useEffect
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    // Change this pageId to match the ID you assign to this page in your page management
    const pageId = 1; // You'll need to set this to the appropriate page ID for ViewAttendanceRecord

    if (!userId) {
      setHasAccess(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/page_access/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const accessData = await response.json();
          const hasPageAccess = accessData.some(access => 
            access.page_id === pageId && String(access.page_privilege) === '1'
          );
          setHasAccess(hasPageAccess);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  // ACCESSING END


  useEffect(() => {
    if (hasAccess) {
      fetchPages();
    }
  }, [hasAccess]);

const fetchPages = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/pages`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched pages:', data);

      // Sort pages by ID ascending
      const sortedPages = data.sort((a, b) => a.id - b.id);

      setPages(sortedPages);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'Failed to fetch pages');
    }
  } catch (error) {
    console.error('Error fetching pages:', error);
    setErrorMessage('Error fetching pages');
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate required fields
    if (!pageName.trim() || !pageDescription.trim() || !pageGroup.trim()) {
      setErrorMessage('Page name, description, and group are required');
      setLoading(false);
      return;
    }

    const pageData = { 
      page_name: pageName.trim(),
      page_description: pageDescription.trim(), 
      page_url: pageUrl.trim() || null,
      page_group: pageGroup.trim() 
    };

    console.log('Submitting page data:', pageData);

    try {
      const url = currentPageId 
        ? `${API_BASE_URL}/pages/${currentPageId}` 
        : `${API_BASE_URL}/pages`;
      
      const method = currentPageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (response.ok) {
        setSuccessMessage(currentPageId ? 'Page updated successfully!' : 'Page created successfully!');
        await fetchPages(); // Refresh the list
        if (currentPageId) {
          // Close modal for edit
          setEditDialog(false);
        }
        resetForm();
      } else {
        setErrorMessage(responseData.error || `Failed to ${currentPageId ? 'update' : 'create'} page`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setErrorMessage('Network error occurred while saving page');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPageId(null);
    setPageName('');
    setPageDescription('');
    setPageUrl('');
    setPageGroup('');
  };

  const cancelEdit = () => {
    resetForm();
    setEditDialog(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEdit = (page) => {
    console.log('Editing page:', page);
    setCurrentPageId(page.id);
    setPageName(page.page_name || '');
    setPageDescription(page.page_description || '');
    setPageUrl(page.page_url || '');
    setPageGroup(page.page_group || '');
    setEditDialog(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeleteConfirm = (id) => {
    setDeletePageId(id);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${deletePageId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSuccessMessage('Page deleted successfully!');
        await fetchPages();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      setErrorMessage('Error deleting page');
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setDeletePageId(null);
    }
  };

  const getGroupColor = (group) => {
    switch (group?.toLowerCase()) {
      case 'superadmin':
        return { bgcolor: '#5a1e1e', color: 'white' }; // Darker burgundy
      case 'administrator':
        return { bgcolor: '#6d2323', color: 'white' }; // Main burgundy
      case 'staff':
        return { bgcolor: '#8a4747', color: 'white' }; // Lighter burgundy
      default:
        return { bgcolor: '#a67171', color: 'white' }; // Muted burgundy
    }
  };

  // ACCESSING 2
  // Loading state
  if (hasAccess === null) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress sx={{ color: "#6d2323", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#6d2323" }}>
            Loading access information...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Access denied state - Now using the reusable component
  if (!hasAccess) {
    return (
      <AccessDenied 
        title="Access Denied"
        message="You do not have permission to access View Attendance Records. Contact your administrator to request access."
        returnPath="/admin-home"
        returnButtonText="Return to Home"
      />
    );
  }
  //ACCESSING END2

  return (
    <Container maxWidth="xl" sx={{ py: 3, backgroundColor: "#f9f4f0", minHeight: "90vh" }}>
      <Paper elevation={4} sx={{ 
        p: 4, 
        border: "2px solid #e0c4c4",
        background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
      }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          <Pages sx={{ fontSize: 40, color: "#6d2323", mr: 1 }} />
          <Typography variant="h4" sx={{ color: "#6d2323", fontWeight: "bold" }}>
            Page Management
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            sx={{ mb: 3, backgroundColor: "#f3f5f0", color: "#5a1e1e", border: "1px solid #c4d6b0" }}
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert 
            severity="error" 
            icon={<Error />}
            sx={{ mb: 3, backgroundColor: "#f5e6e6", color: "#5a1e1e", border: "1px solid #e0c4c4" }}
            onClose={() => setErrorMessage('')}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Form Section - Only for Adding New Pages */}
        <Card elevation={2} sx={{ mb: 4, border: "1px solid #e0c4c4" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#6d2323", mb: 3, fontWeight: "bold" }}>
              <Add sx={{ mr: 1, verticalAlign: "middle" }} />
              Add New Page
            </Typography>

            <form onSubmit={currentPageId ? () => {} : handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page Name"
                    value={currentPageId ? '' : pageName}
                    onChange={(e) => !currentPageId && setPageName(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="e.g., dashboard, users, reports"
                    disabled={!!currentPageId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page Group"
                    value={currentPageId ? '' : pageDescription}
                    onChange={(e) => !currentPageId && setPageDescription(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="e.g., Main Dashboard, User Management"
                    disabled={!!currentPageId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page URL"
                    value={currentPageId ? '' : pageUrl}
                    onChange={(e) => !currentPageId && setPageUrl(e.target.value)}
                    placeholder="e.g., /dashboard, /users"
                    disabled={!!currentPageId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Access Group"
                    value={currentPageId ? '' : pageGroup}
                    onChange={(e) => !currentPageId && setPageGroup(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="superadmin, administrator, staff"
                    disabled={!!currentPageId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>
              </Grid>

              {!currentPageId && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={resetForm}
                    startIcon={<Cancel />}
                    sx={{ 
                      borderColor: "#8a4747", 
                      color: "#8a4747",
                      "&:hover": { borderColor: "#6d2323", bgcolor: "#f5f5f5" } 
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{ 
                      bgcolor: "#6d2323", 
                      "&:hover": { bgcolor: "#5a1e1e" },
                      "&:disabled": { bgcolor: "#ccc" }
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Page'}
                  </Button>
                </Box>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Pages List */}
        <Card elevation={2} sx={{ border: "1px solid #e0c4c4" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#6d2323", mb: 3, fontWeight: "bold" }}>
              <Pages sx={{ mr: 1, verticalAlign: "middle" }} />
              Pages List ({pages.length})
              <Button
                          variant="contained"
                          startIcon={<Group/>}
                          onClick={() => navigate("/users-list")}
                          sx={{
                            ml: 117,
                            bgcolor: "#6d2323",
                            "&:hover": { bgcolor: "#5a1e1e" },
                          }}
                        >
                          User Access
                        </Button>
            </Typography>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: "#6d2323" }} />
              </Box>
            )}

            {!loading && (
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#6d2323" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        <Description sx={{ mr: 1, verticalAlign: "middle" }} />
                        Page Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Page Group</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>URL</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        <Group sx={{ mr: 1, verticalAlign: "middle" }} />
                        Access Group
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pages.length > 0 ? (
                      pages.map((page) => (
                        <TableRow 
                          key={page.id}
                          sx={{ 
                            "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          
                          <TableCell sx={{ fontWeight: "bold", color: "#6d2323" }}>{page.id}</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>{page.page_name}</TableCell>
                          <TableCell>{page.page_description}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#8a4747" }}>
                              {page.page_url || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={page.page_group?.toUpperCase() || ''}
                              size="small"
                              sx={getGroupColor(page.page_group)}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Tooltip title="Edit Page">
                              <Button
                                onClick={() => handleEdit(page)}
                                startIcon={<Edit />}
                                sx={{
                                  color: "#6d2323",
                                  mr: 1,
                                  border: '1px solid #6d2323',
                                  fontWeight: 'bold',
                                  textTransform: 'none',
                                  "&:hover": {
                                    bgcolor: "#6d2323",
                                    transform: "scale(1.05)",
                                    borderColor: "#6d2323",
                                    color: "#ffffff"
                                  }
                                }}
                              >
                                Edit
                              </Button>
                            </Tooltip>

                            <Tooltip title="Delete Page">
                              <Button
                                onClick={() => handleDeleteConfirm(page.id)}
                                startIcon={<Delete />}
                                sx={{
                                  color: "#000000",
                                  border: '1px solid #000000',
                                  fontWeight: 'bold',
                                  textTransform: 'none',
                                  "&:hover": {
                                    bgcolor: "#000000",
                                    transform: "scale(1.05)",
                                    borderColor: "#8a4747",
                                    color: "#ffffff",
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          </TableCell>

                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="h6" sx={{ color: "#999" }}>
                            No pages found
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#8a4747", mt: 1 }}>
                            Create your first page using the form above
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Edit Page Modal Dialog */}
        <Dialog open={editDialog} onClose={cancelEdit} fullWidth>
          <DialogTitle sx={{ color: "#6d2323", bgcolor: "#f5e6e6", fontWeight: 'bold' }}>
            <Edit sx={{ mr: 1, verticalAlign: "middle" }} />
            Edit Page
          </DialogTitle>
          <DialogContent sx={{ pt: 2}}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page Name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="e.g., dashboard, users, reports"
                    sx={{
                      mt: 5,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page Group"
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="e.g., Main Dashboard, User Management"
                    sx={{
                      mt: 5,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Page URL"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="e.g., /dashboard, /users"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Access Group"
                    value={pageGroup}
                    onChange={(e) => setPageGroup(e.target.value)}
                    InputLabelProps={{ required: false }}
                    placeholder="superadmin, administrator, staff"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#8a4747" },
                        "&.Mui-focused fieldset": { borderColor: "#6d2323" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6d2323" },
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#fafafa" }}>
            <Button
              onClick={cancelEdit}
              startIcon={<Cancel />}
              sx={{ 
                color: "#8a4747",
                "&:hover": { bgcolor: "#f5f5f5" } 
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              sx={{ 
                bgcolor: "#6d2323", 
                "&:hover": { bgcolor: "#5a1e1e" },
                "&:disabled": { bgcolor: "#ccc" }
              }}
            >
              {loading ? 'Updating...' : 'Update Page'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle sx={{ color: "#6d2323" }}>
            <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this page? This action cannot be undone and will also remove all associated user access permissions.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)} sx={{ color: "#8a4747" }}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="contained"
              sx={{ bgcolor: "#8a4747", "&:hover": { bgcolor: "#6d2323" } }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PagesList;