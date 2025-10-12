import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Modal,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Drawer,
  Fab,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Snackbar,
  Alert,
  Fade,
  Backdrop,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
  Category as CategoryIcon,
  Search as SearchIcon,
  Reorder as ReorderIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import LoadingOverlay from './LoadingOverlay';
import SuccessfullOverlay from './SuccessfulOverlay';

const EmploymentCategoryManagement = () => {
  const [employmentCategories, setEmploymentCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editRecord, setEditRecord] = useState(null);
  const [originalRecord, setOriginalRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRecord, setNewRecord] = useState({
    employeeNumber: '',
    employmentCategory: 0,
  });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    fetchEmploymentCategories();
  }, []);

  // Fetch all employment categories
  const fetchEmploymentCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category`,
        getAuthHeaders()
      );
      setEmploymentCategories(response.data);
    } catch (error) {
      console.error('Error fetching employment categories:', error);
      showErrorModal('Failed to fetch employment categories.');
    } finally {
      setLoading(false);
    }
  };

  // Create new employment category
  const handleCreate = async () => {
    if (!newRecord.employeeNumber) {
      showErrorModal('Employee number is required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category`,
        newRecord,
        getAuthHeaders()
      );
      setNewRecord({ employeeNumber: '', employmentCategory: 0 });
      setTimeout(() => {
        setLoading(false);
        setSuccessAction('adding');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      }, 300);
      fetchEmploymentCategories();
    } catch (error) {
      console.error('Error creating employment category:', error);
      const errorMsg =
        error.response?.data?.error || 'Failed to create employment category.';
      showErrorModal(errorMsg);
      setLoading(false);
    }
  };

  // Update employment category
  const handleUpdate = async () => {
    if (!editRecord || !editRecord.employeeNumber) {
      showErrorModal('Employee number is required.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/${editRecord.id}`,
        {
          employeeNumber: editRecord.employeeNumber,
          employmentCategory: editRecord.employmentCategory,
        },
        getAuthHeaders()
      );
      setEditRecord(null);
      setOriginalRecord(null);
      setIsEditing(false);
      fetchEmploymentCategories();
      setSuccessAction('edit');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error updating employment category:', error);
      const errorMsg =
        error.response?.data?.error || 'Failed to update employment category.';
      showErrorModal(errorMsg);
    }
  };

  // Delete employment category
  const handleDelete = async (id, employeeNumber) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/${id}`,
        getAuthHeaders()
      );
      setEditRecord(null);
      setOriginalRecord(null);
      setIsEditing(false);
      fetchEmploymentCategories();
      setSuccessAction('delete');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error deleting employment category:', error);
      showErrorModal('Failed to delete employment category.');
    }
  };

  const handleChange = (field, value) => {
    setNewRecord({ ...newRecord, [field]: value });
  };

  const handleOpenModal = (record) => {
    setEditRecord({ ...record });
    setOriginalRecord({ ...record });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditRecord({ ...originalRecord });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setEditRecord(null);
    setOriginalRecord(null);
    setIsEditing(false);
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleViewModeChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fef9e1', minHeight: '100vh', py: 3 }}>
      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Loading..." />

      {/* Success Overlay */}
      <SuccessfullOverlay open={successOpen} action={successAction} />

      {/* Header */}
      <Box
        sx={{
          bgcolor: '#6d2323',
          color: '#fef9e1',
          py: 3,
          px: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            bgcolor: 'rgba(254, 249, 225, 0.1)',
            borderRadius: '50%',
            transform: 'translate(100px, -150px)',
          }}
        />
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1, borderEndStartRadius: 0, color: 'white' }}>
            <CategoryIcon sx={{ fontSize: '3rem', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Employment Category Management
              </Typography>
              <Typography variant="subtitle1">
                Manage employee employment categories
              </Typography>
            </Box>
          </Box>
          
        </Container>
      </Box>
              <Card
          sx={{
            mb: 4,
            boxShadow: '0 4px 20px rgba(109, 35, 35, 0.15)',
            border: '1px solid #6d2323',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3, bgcolor: '#ffffff' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee Number"
                  value={newRecord.employeeNumber}
                  onChange={(e) => handleChange('employeeNumber', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#6d2323',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6d2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6d2323',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: '#6d2323' }}>Employment Category</InputLabel>
                  <Select
                    value={newRecord.employmentCategory}
                    onChange={(e) => handleChange('employmentCategory', e.target.value)}
                    label="Employment Category"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6d2323',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6d2323',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6d2323',
                      },
                    }}
                  >
                    <MenuItem value={0}>Job Order</MenuItem>
                    <MenuItem value={1}>Regular</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                backgroundColor: '#6d2323',
                color: '#fef9e1',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(109, 35, 35, 0.3)',
                '&:hover': { 
                  backgroundColor: '#5a1d1d',
                  boxShadow: '0 6px 12px rgba(109, 35, 35, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Employment Category
            </Button>
          </CardContent>
        </Card>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Add New Record Section */}


        {/* Records Section */}
        <Card
          sx={{
            boxShadow: '0 4px 20px rgba(109, 35, 35, 0.15)',
            border: '1px solid #6d2323',
            overflow: 'hidden',

          }}
        >
          <Box
            sx={{
              bgcolor: '#6d2323',
              color: '#ffffff',
              py: 3,
              px: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReorderIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Employment Category Records</Typography>
            </Box>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            >
              <ToggleButton value="grid" aria-label="grid view" sx={{ color: '#fef9e1' }}>
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view" sx={{ color: '#fef9e1' }}>
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <CardContent sx={{ p: 3, bgcolor: '#ffffff' }}>
            {/* Search Section */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Employee Number or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#6d2323', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#6d2323',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6d2323',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6d2323',
                    },
                  },
                }}
              />
            </Box>

            {/* Records Display */}
            {employmentCategories.filter((record) => {
              const employeeNumber = record.employeeNumber?.toString() || '';
              const employeeName = record.employeeName?.toLowerCase() || '';
              const search = searchTerm.toLowerCase();
              return employeeNumber.includes(search) || employeeName.includes(search);
            }).length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                }}
              >
                <SearchIcon sx={{ fontSize: 64, color: '#6d2323', mb: 2 }} />
                <Typography variant="h6" color="#6d2323">
                  No Records Found
                </Typography>
              </Box>
            ) : viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {employmentCategories
                  .filter((record) => {
                    const employeeNumber = record.employeeNumber?.toString() || '';
                    const employeeName = record.employeeName?.toLowerCase() || '';
                    const search = searchTerm.toLowerCase();
                    return employeeNumber.includes(search) || employeeName.includes(search);
                  })
                  .map((record) => (
                    <Grid item xs={12} sm={6} md={4} key={record.id}>
                      <Card
                        onClick={() => handleOpenModal(record)}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #6d2323',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(109, 35, 35, 0.2)',
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PersonIcon sx={{ color: '#6d2323', mr: 1 }} />
                            <Typography variant="h6" color="#6d2323">
                              {record.employeeNumber}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {record.employeeName || 'N/A'}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Chip
                              label={record.categoryLabel}
                              sx={{
                                backgroundColor: record.employmentCategory === 0 ? '#ed6c02' : '#2e7d32',
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <List>
                {employmentCategories
                  .filter((record) => {
                    const employeeNumber = record.employeeNumber?.toString() || '';
                    const employeeName = record.employeeName?.toLowerCase() || '';
                    const search = searchTerm.toLowerCase();
                    return employeeNumber.includes(search) || employeeName.includes(search);
                  })
                  .map((record, index) => (
                    <React.Fragment key={record.id}>
                      <ListItem
                        onClick={() => handleOpenModal(record)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #6d2323',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            bgcolor: 'rgba(109, 35, 35, 0.05)',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon sx={{ color: '#6d2323' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={record.employeeNumber}
                          secondary={record.employeeName || 'N/A'}
                          primaryTypographyProps={{ color: '#6d2323', fontWeight: 'bold' }}
                        />
                        <Chip
                          label={record.categoryLabel}
                          sx={{
                            backgroundColor: record.employmentCategory === 0 ? '#ed6c02' : '#2e7d32',
                            color: '#fff',
                            fontWeight: 'bold',
                          }}
                        />
                      </ListItem>
                      {index < employmentCategories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Edit Modal */}
      <Modal
        open={!!editRecord}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={!!editRecord}>
          <Box
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #6d2323',
              borderRadius: 2,
              width: isMobile ? '90%' : '70%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(109, 35, 35, 0.3)',
            }}
          >
            {editRecord && (
              <>
                <Box
                  sx={{
                    bgcolor: '#6d2323',
                    color: '#fef9e1',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6">
                    {isEditing ? 'Edit Employment Category' : 'Employment Category Details'}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: '#fef9e1' }}>
                    <Close />
                  </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Employee Number"
                        value={editRecord.employeeNumber}
                        onChange={(e) =>
                          setEditRecord({
                            ...editRecord,
                            employeeNumber: e.target.value,
                          })
                        }
                        fullWidth
                        disabled={!isEditing}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#6d2323',
                            },
                            '&:hover fieldset': {
                              borderColor: '#6d2323',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6d2323',
                            },
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#000000',
                            color: '#000000',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Employee Name"
                        value={editRecord.employeeName || 'N/A'}
                        fullWidth
                        disabled
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#6d2323',
                            },
                            '&:hover fieldset': {
                              borderColor: '#6d2323',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6d2323',
                            },
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#000000',
                            color: '#000000',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {isEditing ? (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel sx={{ color: '#6d2323' }}>Employment Category</InputLabel>
                          <Select
                            value={editRecord.employmentCategory}
                            onChange={(e) =>
                              setEditRecord({
                                ...editRecord,
                                employmentCategory: e.target.value,
                              })
                            }
                            label="Employment Category"
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6d2323',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6d2323',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6d2323',
                              },
                            }}
                          >
                            <MenuItem value={0}>Job Order</MenuItem>
                            <MenuItem value={1}>Regular</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WorkIcon sx={{ color: '#6d2323', mr: 1 }} />
                          <Typography variant="body1">
                            Category: {editRecord.categoryLabel}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    {!isEditing ? (
                      <>
                        <Button
                          onClick={() => handleDelete(editRecord.id, editRecord.employeeNumber)}
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          sx={{
                            color: '#ffffff',
                            backgroundColor: 'black',
                            '&:hover': {
                              backgroundColor: '#333333',
                            },
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={handleStartEdit}
                          variant="contained"
                          startIcon={<EditIcon />}
                          sx={{
                            backgroundColor: '#6d2323',
                            color: '#fef9e1',
                            '&:hover': {
                              backgroundColor: '#5a1d1d',
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          sx={{
                            color: '#ffffff',
                            backgroundColor: 'black',
                            '&:hover': {
                              backgroundColor: '#333333',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdate}
                          variant="contained"
                          startIcon={<SaveIcon />}
                          sx={{
                            backgroundColor: '#6d2323',
                            color: '#fef9e1',
                            '&:hover': {
                              backgroundColor: '#5a1d1d',
                            },
                          }}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Error Modal */}
      <Modal
        open={errorModalOpen}
        onClose={handleCloseErrorModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={errorModalOpen}>
          <Box
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #6d2323',
              borderRadius: 2,
              width: isMobile ? '90%' : '40%',
              maxWidth: '500px',
              boxShadow: '0 10px 30px rgba(109, 35, 35, 0.3)',
            }}
          >
            <Box
              sx={{
                bgcolor: '#6d2323',
                color: '#fef9e1',
                py: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Error</Typography>
              </Box>
              <IconButton onClick={handleCloseErrorModal} sx={{ color: '#fef9e1' }}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {errorMessage}
              </Typography>
              <Button
                onClick={handleCloseErrorModal}
                variant="contained"
                sx={{
                  backgroundColor: '#6d2323',
                  color: '#fef9e1',
                  '&:hover': {
                    backgroundColor: '#5a1d1d',
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={toggleDrawer(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: '#6d2323',
            color: '#fef9e1',
            '&:hover': {
              backgroundColor: '#5a1d1d',
            },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Mobile Drawer for Adding New Record */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: '#ffffff',
          },
        }}
      >
        <Box sx={{ p: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="#6d2323">
              Add New Employment Category
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <Close />
            </IconButton>
          </Box>
          <TextField
            label="Employee Number"
            value={newRecord.employeeNumber}
            onChange={(e) => handleChange('employeeNumber', e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6d2323',
                },
                '&:hover fieldset': {
                  borderColor: '#6d2323',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6d2323',
                },
              },
            }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#6d2323' }}>Employment Category</InputLabel>
            <Select
              value={newRecord.employmentCategory}
              onChange={(e) => handleChange('employmentCategory', e.target.value)}
              label="Employment Category"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6d2323',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6d2323',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6d2323',
                },
              }}
            >
              <MenuItem value={0}>Job Order</MenuItem>
              <MenuItem value={1}>Regular</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleCreate}
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              py: 1.5,
              backgroundColor: '#6d2323',
              color: '#fef9e1',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#5a1d1d',
              },
            }}
          >
            Add Employment Category
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default EmploymentCategoryManagement;