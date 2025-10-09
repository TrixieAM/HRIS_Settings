import API_BASE_URL from '../../apiConfig';
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
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import ReorderIcon from '@mui/icons-material/Reorder';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';
import AccessDenied from '../AccessDenied';
import { useNavigate } from "react-router-dom";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState({
    childrenFirstName: '',
    childrenMiddleName: '',
    childrenLastName: '',
    childrenNameExtension: '',
    dateOfBirth: '',
    person_id: ''
  });
  const [editChild, setEditChild] = useState(null);
  const [originalChild, setOriginalChild] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [errors, setErrors] = useState({});
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  //ACCESSING
  // Page access control states
  const [hasAccess, setHasAccess] = useState(null);
  const navigate = useNavigate();
  // Page access control - Add this useEffect
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    // Change this pageId to match the ID you assign to this page in your page management
    const pageId = 3; // You'll need to set this to the appropriate page ID for ViewAttendanceRecord
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
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/childrenRoute/children-table`);
      setChildren(result.data);
    } catch (error) {
      console.error('Error fetching children:', error);
      showSnackbar('Failed to fetch children records. Please try again.', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['childrenFirstName', 'childrenLastName', 'dateOfBirth', 'person_id'];
    
    requiredFields.forEach(field => {
      if (!newChild[field] || newChild[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/childrenRoute/children-table`, newChild);
      setNewChild({
        childrenFirstName: '',
        childrenMiddleName: '',
        childrenLastName: '',
        childrenNameExtension: '',
        dateOfBirth: '',
        person_id: ''
      });
      setErrors({}); // Clear errors
      setTimeout(() => {     
        setLoading(false);  
        setSuccessAction("adding");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      }, 300);  
      fetchChildren();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);
      showSnackbar('Failed to add child record. Please try again.', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/childrenRoute/children-table/${editChild.id}`, editChild);
      setEditChild(null);
      setOriginalChild(null);
      setIsEditing(false);
      fetchChildren();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
      showSnackbar('Failed to update child record. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/childrenRoute/children-table/${id}`);
      setEditChild(null);
      setOriginalChild(null);
      setIsEditing(false);
      fetchChildren();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
      showSnackbar('Failed to delete child record. Please try again.', 'error');
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditChild({ ...editChild, [field]: value });
    } else {
      setNewChild({ ...newChild, [field]: value });
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleOpenModal = (child) => {
    setEditChild({ ...child });
    setOriginalChild({ ...child });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditChild({ ...originalChild });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setEditChild(null);
    setOriginalChild(null);
    setIsEditing(false);
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

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
        message="You do not have permission to access Children Information. Contact your administrator to request access."
        returnPath="/admin-home"
        returnButtonText="Return to Home"
      />
    );
  }
  //ACCESSING END2

  return (
    <Container sx={{ mt: 0, }}>
      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding child record..." />
      
      {/* Success Overlay */}
      <SuccessfullOverlay open={successOpen} action={successAction} />
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        {/* Outer wrapper for header + content */}
        <Box sx={{ width: "75%", maxWidth: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#6D2323",
              color: "#ffffff",
              p: 2,
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "center",
              pb: '15px'
            }}
          >
            <ChildFriendlyIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Children Information
              </Typography>
              <Typography variant="body2">
                Insert Your Children Information
              </Typography>
            </Box>
          </Box>

          {/* Content/Form */}
          <Container
            sx={{
              backgroundColor: "#fff",
              p: 3,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #6d2323",
              width: "100%",
            }}
          >
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  First Name <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  value={newChild.childrenFirstName}
                  onChange={(e) => handleChange("childrenFirstName", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  error={!!errors.childrenFirstName}
                  helperText={errors.childrenFirstName || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.childrenFirstName ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.childrenFirstName ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.childrenFirstName ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Middle Name
                </Typography>
                <TextField
                  value={newChild.childrenMiddleName}
                  onChange={(e) => handleChange("childrenMiddleName", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Last Name <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  value={newChild.childrenLastName}
                  onChange={(e) => handleChange("childrenLastName", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  error={!!errors.childrenLastName}
                  helperText={errors.childrenLastName || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.childrenLastName ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.childrenLastName ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.childrenLastName ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Name Extension */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Name Extension
                </Typography>
                <TextField
                  value={newChild.childrenNameExtension}
                  onChange={(e) => handleChange("childrenNameExtension", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date of Birth <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  value={newChild.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.dateOfBirth ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.dateOfBirth ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.dateOfBirth ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Employee Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Employee Number <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  value={newChild.person_id}
                  onChange={(e) => handleChange("person_id", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  error={!!errors.person_id}
                  helperText={errors.person_id || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.person_id ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.person_id ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.person_id ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Add Button */}
            <Button
              onClick={handleAdd}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
                width: "100%",
                backgroundColor: "#6D2323",
                color: "#FEF9E1",
                "&:hover": { backgroundColor: "#5a1d1d" },
              }}
            >
              Add
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Outer wrapper for header + content */}
      <Box sx={{ width: "75%", maxWidth: "100%", margin: "20px auto" }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            color: "#6d2323",
            p: 2,
            borderRadius: "8px 8px 0 0",
            display: "flex",
            alignItems: "center",
            pb: "15px",
            border: '1px solid #6d2323',
            borderBottom: 'none'
          }}
        >
          <ReorderIcon sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }} />
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Children Records
            </Typography>
            <Typography variant="body2">
              View and manage children information
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Container
          sx={{
            backgroundColor: "#fff",
            p: 3,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #6d2323",
            width: "100%",
          }}
        >
          {/* Search Section */}
          <Box sx={{ mb: 3, width: "100%" }}>
            {/* Subtitle */}
            <Typography
              variant="subtitle2"
              sx={{ color: "#6D2323", mb: 1 }}
            >
              Search Records using Employee Number or Name
            </Typography>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Person ID or Child Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  width: "100%",
                  maxWidth: "800px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#6D2323",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6D2323",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6D2323",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "#6D2323", marginRight: 1 }} />
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Records as Boxes */}
          <Grid container spacing={2}>
            {children
              .filter((child) => {
                const fullName = `${child.childrenFirstName} ${child.childrenMiddleName} ${child.childrenLastName}`.toLowerCase();
                const personId = child.person_id?.toString() || "";
                const search = searchTerm.toLowerCase();
                return personId.includes(search) || fullName.includes(search);
              })
              .map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child.id}>
                  <Box
                    onClick={() => handleOpenModal(child)}
                    sx={{
                      border: "1px solid #6d2323",
                      borderRadius: 2,
                      p: 2,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
                      height: "80%",
                    }}
                  >
                    {/* Employee Number */}
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "black", mb: 1 }}
                    >
                      Employee Number:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#6d2323", mb: 1 }}
                    >
                      {child.person_id}
                    </Typography>

                    {/* Child Name and Age Pills */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={`${child.childrenFirstName} ${child.childrenLastName}`}
                        sx={{
                          backgroundColor: "#6d2323",
                          color: "#fff",
                          borderRadius: "50px",
                          px: 2,
                          fontWeight: "bold",
                          maxWidth: "100%",
                        }}
                      />
                      {child.dateOfBirth && (
                        <Chip
                          label={`Age: ${getAge(child.dateOfBirth)}`}
                          size="small"
                          sx={{
                            backgroundColor: "#ffffff",
                            color: "#6d2323",
                            border: "1px solid #6d2323",
                            borderRadius: "50px",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            {children.filter((child) => {
              const fullName = `${child.childrenFirstName} ${child.childrenMiddleName} ${child.childrenLastName}`.toLowerCase();
              const personId = child.person_id?.toString() || "";
              const search = searchTerm.toLowerCase();
              return personId.includes(search) || fullName.includes(search);
            }).length === 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", color: "#6D2323", fontWeight: "bold", mt: 2 }}
                >
                  No Records Found
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>

        <Modal
          open={!!editChild}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #6d2323",
              borderRadius: 2,
              width: "75%",
              maxWidth: "900px",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {editChild && (
              <>
                {/* Modal Header */}
                <Box
                  sx={{
                    backgroundColor: "#6D2323",
                    color: "#ffffff",
                    p: 2,
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">
                    {isEditing ? "Edit Child Information" : "Child Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'row', gap: 3 }}>
                  {/* Table Section */}
                  <Table sx={{ flex: 1 }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              value={editChild.childrenFirstName}
                              onChange={(e) => handleChange("childrenFirstName", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.childrenFirstName
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Middle Name</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              value={editChild.childrenMiddleName}
                              onChange={(e) => handleChange("childrenMiddleName", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.childrenMiddleName
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              value={editChild.childrenLastName}
                              onChange={(e) => handleChange("childrenLastName", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.childrenLastName
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name Extension</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              value={editChild.childrenNameExtension}
                              onChange={(e) => handleChange("childrenNameExtension", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.childrenNameExtension
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              type="date"
                              value={editChild.dateOfBirth?.split('T')[0] || ''}
                              onChange={(e) => handleChange("dateOfBirth", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.dateOfBirth?.split('T')[0]
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Employee Number</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              value={editChild.person_id}
                              onChange={(e) => handleChange("person_id", e.target.value, true)}
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: "#6D2323",
                                  },
                                },
                              }}
                            />
                          ) : (
                            editChild.person_id
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Buttons Section */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                      {!isEditing ? (
                        // View mode buttons
                        <>
                          <Button
                            onClick={() => handleDelete(editChild.id)}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            sx={{
                              color: "#ffffff",
                              backgroundColor: 'black'
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={handleStartEdit}
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ backgroundColor: "#6D2323", color: "#FEF9E1" }}
                          >
                            Edit
                          </Button>
                        </>
                      ) : (
                        // Edit mode buttons
                        <>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            sx={{
                              color: "#ffffff",
                              backgroundColor: 'black'
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUpdate}
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{ backgroundColor: "#6D2323", color: "#FEF9E1" }}
                          >
                            Save
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Children;