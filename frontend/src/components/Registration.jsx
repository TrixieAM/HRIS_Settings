import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@mui/material";
import {
  PersonOutline,
  EmailOutlined,
  BadgeOutlined,
  LockOutlined,
  PersonAddAlt1,
  GroupAdd,
  CheckCircleOutline,
  ErrorOutline,
  WarningAmber,
  Settings,
  CheckCircle
} from "@mui/icons-material";
import AccessDenied from "./AccessDenied";


const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    nameExtension: "",
    email: "",
    employeeNumber: "",
    password: "",
  });

  const [errMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [showSetupModal, setShowSetupModal] = useState(false);

  const navigate = useNavigate();

  //ACCESSING
  // Page access control states
  const [hasAccess, setHasAccess] = useState(null);

  // Page access control
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    const pageId = 16; // PAGE ID
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

  // Check if setup modal should be shown - shows every time on page visit
  useEffect(() => {
    if (hasAccess === true) {
      setShowSetupModal(true);
    }
  }, [hasAccess]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidName = (name) => {
    if (!name || name.trim().length === 0) return false;
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) return false;
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) return false;
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, employeeNumber, password } = formData;

    // Required field validation
    if (!firstName || !lastName || !employeeNumber || !password || !email) {
      setErrorMessage("Please fill all required fields (First Name, Last Name, Email, Employee Number, Password).");
      setSuccessMessage("");
      return;
    }

    // Name validation
    if (!isValidName(firstName)) {
      setErrorMessage("Please enter a valid first name (2-50 characters, letters only).");
      setSuccessMessage("");
      return;
    }

    if (!isValidName(lastName)) {
      setErrorMessage("Please enter a valid last name (2-50 characters, letters only).");
      setSuccessMessage("");
      return;
    }

    // Middle name validation (optional)
    if (formData.middleName && !isValidName(formData.middleName)) {
      setErrorMessage("Please enter a valid middle name (2-50 characters, letters only).");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("User registered successfully!");
        setErrorMessage("");
        setFormData({ 
          firstName: "", 
          middleName: "", 
          lastName: "", 
          nameExtension: "", 
          email: "", 
          employeeNumber: "", 
          password: "" 
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Registration failed. Try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Registration Error", err);
      setErrorMessage("Something went wrong.");
      setSuccessMessage("");
    }
  };

  const handleSetupLater = () => {
    setShowSetupModal(false);
  };

  const handleGoToSetup = () => {
    setShowSetupModal(false);
    // Navigate to setup page - adjust the route as needed
    navigate("/setup-dashboard"); // Change this to your actual setup route
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
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        minHeight: "90%",
        backgroundColor: "#fff8e1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Setup Reminder Modal */}
      <Dialog
        open={showSetupModal}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "2px solid #f5e6e6",
          }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          color: "#6d2323",
          fontWeight: "bold",
          fontSize: "1.5rem"
        }}>
          <WarningAmber sx={{ fontSize: 32, color: "#000000" }} />
          Initial Setup Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#333", fontSize: "1rem", mb: 2 }}>
            Before registering users, please ensure the following tables are set up:
          </DialogContentText>
          <Box sx={{ pl: 2, mb: 2 }}>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#555" }}>
              <CheckCircleOutline sx={{ fontSize: 20, color: "#6d2323" }} />
              <strong>Remittances</strong> - Configure employee remittance
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#555" }}>
              <CheckCircleOutline sx={{ fontSize: 20, color: "#6d2323" }} />
              <strong>Department Assignment</strong> - Department designations
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "#555" }}>
              <CheckCircleOutline sx={{ fontSize: 20, color: "#6d2323" }} />
              <strong>Item Table</strong> - Setting up Plantilla
            </Typography>
          </Box>
          <DialogContentText sx={{ color: "#666", fontSize: "0.95rem", fontStyle: "italic" }}>
            These tables are essential for Payroll Management Records.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleSetupLater}
            variant="outlined"
            startIcon={<CheckCircle />}
            sx={{
              color: "#6d2323",
              borderColor: "#6d2323",
              "&:hover": {
                borderColor: "#5a1e1e",
                backgroundColor: "rgba(109, 35, 35, 0.04)",
              },
            }}
          >
            Already Updated
          </Button>
          <Button
            onClick={handleGoToSetup}
            variant="contained"
            startIcon={<Settings />}
            sx={{
              bgcolor: "#6d2323",
              "&:hover": {
                bgcolor: "#5a1e1e",
              },
            }}
          >
            Set Up Now
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 2,
          textAlign: "center",
          border: "2px solid #f5e6e6",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <PersonAddAlt1 sx={{ fontSize: 40, color: "#6d2323", mr: 1 }} />
          <Typography variant="h4" sx={{ color: "#6d2323", fontWeight: "bold" }}>
            Single Registration
          </Typography>
        </Box>

        <Typography gutterBottom sx={{ mt: 1, mb: 3, color: "#8a4747" }}>
          <b>Register users one at a time</b>
        </Typography>

        {errMessage && (
          <Alert 
            icon={<ErrorOutline fontSize="inherit" />}
            sx={{ 
              mb: 2,
              backgroundColor: "#6d2323",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white"
              }
            }} 
            severity="error"
          >
            {errMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert 
            icon={<CheckCircleOutline fontSize="inherit" />}
            sx={{ 
              mb: 2,
              backgroundColor: "#dcf8e3ff",
              color: "#41644a",
              border: "1px solid #41644a",
              "& .MuiAlert-icon": {
                color: "#41644a"
              }
            }} 
            severity="success"
          >
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                value={formData.firstName}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#6d2323" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="middleName"
                label="Middle Name"
                type="text"
                fullWidth
                value={formData.middleName}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#8a4747" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={formData.lastName}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#6d2323" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nameExtension"
                label="Name Extension (Jr., Sr., III)"
                type="text"
                fullWidth
                value={formData.nameExtension}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                placeholder="Jr., Sr., III, etc."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#8a4747" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "#6d2323" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="employeeNumber"
                label="Employee Number"
                type="number"
                fullWidth
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
                value={formData.employeeNumber}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ color: "#6d2323" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChanges}
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#6d2323" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#8a4747",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6d2323",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#6d2323",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<PersonAddAlt1 />}
            sx={{ 
              bgcolor: "#6d2323", 
              mt: 3,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#5a1e1e",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(109, 35, 35, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Register User
          </Button>
        </form>

        <Button
          type="button"
          variant="contained"
          fullWidth
          startIcon={<GroupAdd />}
          sx={{ 
            bgcolor: "#000", 
            mt: 2,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#353434ff",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(138, 71, 71, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/bulk-register")}
        >
          Bulk Registration
        </Button>
      </Paper>
    </Container>
  );
};

export default Registration;