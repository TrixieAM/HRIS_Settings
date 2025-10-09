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
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
} from "@mui/icons-material";

import FactCheckIcon from '@mui/icons-material/FactCheck';
import SearchIcon from '@mui/icons-material/Search';
import ReorderIcon from '@mui/icons-material/Reorder';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';
import AccessDenied from '../AccessDenied';
import { useNavigate } from "react-router-dom";

const Eligibility = () => {
  const [data, setData] = useState([]);
  const [newEligibility, setNewEligibility] = useState({
    eligibilityName: '',
    eligibilityRating: '',
    eligibilityDateOfExam: '',
    eligibilityPlaceOfExam: '',
    licenseNumber: '',
    DateOfValidity: '',
    person_id: '',
  });
  const [editEligibility, setEditEligibility] = useState(null);
  const [originalEligibility, setOriginalEligibility] = useState(null); // Store original data for cancel
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
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
  // Page access control
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    const pageId = 8; // PAGE ID
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
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/eligibilityRoute/eligibility`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showSnackbar('Failed to fetch eligibility records. Please try again.', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['eligibilityName', 'person_id', 'DateOfValidity' ];
    
    requiredFields.forEach(field => {
      if (!newEligibility[field] || newEligibility[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    

    if (newEligibility.eligibilityDateOfExam && newEligibility.DateOfValidity) {
      if (new Date(newEligibility.eligibilityDateOfExam) > new Date(newEligibility.DateOfValidity)) {
        newErrors.DateOfValidity = 'Validity date must be after exam date';
      }
    }
    
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
      await axios.post(`${API_BASE_URL}/eligibilityRoute/eligibility`, newEligibility);
      setNewEligibility({
        eligibilityName: '',
        eligibilityRating: '',
        eligibilityDateOfExam: '',
        eligibilityPlaceOfExam: '',
        licenseNumber: '',
        DateOfValidity: '',
        person_id: '',
      });
      setErrors({}); // Clear errors
      setTimeout(() => {     
        setLoading(false);  
        setSuccessAction("adding");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      }, 300);  
      fetchEligibility();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);
      showSnackbar('Failed to add eligibility record. Please try again.', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/eligibilityRoute/eligibility/${editEligibility.id}`, editEligibility);
      setEditEligibility(null);
      setOriginalEligibility(null);
      setIsEditing(false);
      fetchEligibility();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
      showSnackbar('Failed to update eligibility record. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/eligibilityRoute/eligibility/${id}`);
      setEditEligibility(null);
      setOriginalEligibility(null);
      setIsEditing(false);
      fetchEligibility();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
      showSnackbar('Failed to delete eligibility record. Please try again.', 'error');
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditEligibility({ ...editEligibility, [field]: value });
    } else {
      setNewEligibility({ ...newEligibility, [field]: value });
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

  // Handle opening the modal (view mode initially)
  const handleOpenModal = (eligibility) => {
    setEditEligibility({ ...eligibility });
    setOriginalEligibility({ ...eligibility });
    setIsEditing(false);
  };

  // Handle entering edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditEligibility({ ...originalEligibility });
    setIsEditing(false);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setEditEligibility(null);
    setOriginalEligibility(null);
    setIsEditing(false);
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
        message="You do not have permission to access Eligibility Information. Contact your administrator to request access."
        returnPath="/admin-home"
        returnButtonText="Return to Home"
      />
    );
  }
  //ACCESSING END2

  return (
    <Container sx={{ mt: 0, }}>

      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding eligibility record..."  />
      
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
            <FactCheckIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Eligibility Information
              </Typography>
              <Typography variant="body2">
                Insert Your Eligibility Information
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
              {/* Eligibility Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Eligibility Name <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  value={newEligibility.eligibilityName}
                  onChange={(e) => handleChange("eligibilityName", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  error={!!errors.eligibilityName}
                  helperText={errors.eligibilityName || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.eligibilityName ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.eligibilityName ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.eligibilityName ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Rating */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Rating
                </Typography>
                <TextField
                  value={newEligibility.eligibilityRating}
                  onChange={(e) => handleChange("eligibilityRating", e.target.value)}
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

              {/* Date of Exam */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date of Exam
                </Typography>
                <TextField
                  type="date"
                  value={newEligibility.eligibilityDateOfExam}
                  onChange={(e) => handleChange("eligibilityDateOfExam", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.eligibilityDateOfExam}
                  helperText={errors.eligibilityDateOfExam || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.eligibilityDateOfExam ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.eligibilityDateOfExam ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.eligibilityDateOfExam ? 'red' : '#6D2323',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Place of Exam */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Place of Exam
                </Typography>
                <TextField
                  value={newEligibility.eligibilityPlaceOfExam}
                  onChange={(e) => handleChange("eligibilityPlaceOfExam", e.target.value)}
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

              {/* License Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  License Number
                </Typography>
                <TextField
                  value={newEligibility.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
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

              {/* Date of Validity */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date of Validity <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  value={newEligibility.DateOfValidity}
                  onChange={(e) => handleChange("DateOfValidity", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.DateOfValidity}
                  helperText={errors.DateOfValidity || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.DateOfValidity ? 'red' : '#6D2323',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.DateOfValidity ? 'red' : '#6D2323',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.DateOfValidity ? 'red' : '#6D2323',
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
                  value={newEligibility.person_id}
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
              Eligibility Records
            </Typography>
            <Typography variant="body2">
              View and manage eligibility information
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
              Search Records using Employee Number
            </Typography>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Person ID or Eligibility Name"
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
            {data
              .filter((eligibility) => {
                const eligibilityName = eligibility.eligibilityName?.toLowerCase() || "";
                const personId = eligibility.person_id?.toString() || "";
                const search = searchTerm.toLowerCase();
                return personId.includes(search) || eligibilityName.includes(search);
              })
              .map((eligibility) => (
                <Grid item xs={12} sm={6} md={4} key={eligibility.id}>
                  <Box
                    onClick={() => handleOpenModal(eligibility)}
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
                      {eligibility.person_id}
                    </Typography>

                    {/* Eligibility Name Pill */}
                    <Chip
                      label={eligibility.eligibilityName}
                      sx={{
                        backgroundColor: "#6d2323",
                        color: "#fff",
                        borderRadius: "50px",
                        px: 2,
                        fontWeight: "bold",
                        maxWidth: "100%",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            {data.filter((eligibility) => {
              const eligibilityName = eligibility.eligibilityName?.toLowerCase() || "";
              const personId = eligibility.person_id?.toString() || "";
              const search = searchTerm.toLowerCase();
              return personId.includes(search) || eligibilityName.includes(search);
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
          open={!!editEligibility}
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
            {editEligibility && (
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
                    {isEditing ? "Edit Eligibility Information" : "Eligibility Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content (Form Style) */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Eligibility Name */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Eligibility Name
                      </Typography>
                      <TextField
                        value={editEligibility.eligibilityName}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, eligibilityName: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                      />
                    </Grid>

                    {/* Rating */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Rating
                      </Typography>
                      <TextField
                        value={editEligibility.eligibilityRating}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, eligibilityRating: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                      />
                    </Grid>

                    {/* Date of Exam */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date of Exam
                      </Typography>
                      <TextField
                        type="date"
                        value={editEligibility.eligibilityDateOfExam}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, eligibilityDateOfExam: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Place of Exam */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Place of Exam
                      </Typography>
                      <TextField
                        value={editEligibility.eligibilityPlaceOfExam}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, eligibilityPlaceOfExam: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                      />
                    </Grid>

                    {/* License Number */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        License Number
                      </Typography>
                      <TextField
                        value={editEligibility.licenseNumber}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, licenseNumber: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                      />
                    </Grid>

                    {/* Date of Validity */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date of Validity
                      </Typography>
                      <TextField
                        type="date"
                        value={editEligibility.DateOfValidity}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, DateOfValidity: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Employee Number */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Employee Number
                      </Typography>
                      <TextField
                        value={editEligibility.person_id}
                        onChange={(e) =>
                          setEditEligibility({ ...editEligibility, person_id: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            color: "#000000"
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    {!isEditing ? (
                      // View mode buttons
                      <>
                        <Button
                          onClick={() => handleDelete(editEligibility.id)}
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

export default Eligibility;