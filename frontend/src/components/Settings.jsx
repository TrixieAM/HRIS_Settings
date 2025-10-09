import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  ArrowBack,
  VerifiedUserOutlined,
  LockResetOutlined,
  CheckCircleOutline,
  ErrorOutline,
  MarkEmailReadOutlined,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailOutlined,
  Security as SecurityOutlined,
  Notifications as NotificationsOutlined,
  History as HistoryOutlined,
  PrivacyTip as PrivacyTipOutlined,
} from "@mui/icons-material";
import LoadingOverlay from "./LoadingOverlay";
import logo from "../assets/logo.PNG";
import bg from "../assets/EaristBG.PNG";

const Settings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    currentPassword: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [person, setPerson] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const steps = ["Request Code", "Verify Code", "New Password"];

  const primaryGradient = "linear-gradient(135deg, #800020, #A52A2A)";
  const primaryHoverGradient = "linear-gradient(135deg, #A52A2A, #800020)";
  const darkText = "#4B0000";
  const mediumText = "#800020";

  const employeeNumber = localStorage.getItem('employeeNumber');

  // Get user email from token and fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setErrorMessage("Session expired. Please login again.");
      setTimeout(() => (window.location.href = "/"), 2000);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(decoded.email);
    } catch (e) {
      console.error("Error decoding token:", e);
      setErrorMessage("Invalid session. Please login again.");
      setTimeout(() => (window.location.href = "/"), 2000);
    }

    // Fetch person data
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        setPerson(match);
        if (match) {
          setProfilePicture(match.profile_picture);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    if (employeeNumber) {
      fetchPersonData();
    }
  }, [employeeNumber]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errMessage) setErrorMessage("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateEmail = async () => {
  if (!newEmail || !confirmEmail) {
    setErrorMessage("Please fill in all fields.");
    return;
  }
  if (newEmail !== confirmEmail) {
    setErrorMessage("Emails do not match!");
    return;
  }

  setLoading(true);
  setErrorMessage("");

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const res = await axios.post(
      `${API_BASE_URL}/update-email`,
      { email: newEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      setUserEmail(newEmail);
      setNewEmail("");
      setConfirmEmail("");
      alert("Email updated successfully!");
    } else {
      setErrorMessage("Failed to update email.");
    }
  } catch (err) {
    console.error(err);
    setErrorMessage("Connection error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // Step 1: Send verification code (with current password check)
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setErrorMessage("User email not found. Please login again.");
      return;
    }
    if (!formData.currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const verifyRes = await fetch(`${API_BASE_URL}/verify-current-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email: userEmail,
          currentPassword: formData.currentPassword
        }),
      });

      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok) {
        setErrorMessage(verifyData.error || "Current password is incorrect.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/send-password-change-code`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentStep(1);
        setShowVerificationModal(true);
      } else {
        console.error("Backend error response:", data);
        setErrorMessage(data.error || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!formData.verificationCode) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/verify-password-change-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: formData.verificationCode }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentStep(2);
      } else {
        setErrorMessage(data.error || "Invalid verification code.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (!passwordConfirmed) {
      setErrorMessage("Please confirm that you want to change your password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/complete-password-change`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.error || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setLogoutOpen(true);
    
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestCode}>
            <Typography sx={{ mb: 3, color: mediumText, fontSize: "14px", textAlign: "center" }}>
              For security purposes, please enter your current password and we'll send a verification code to: <strong>{userEmail}</strong>
            </Typography>
            
            <TextField
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChanges}
              fullWidth
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(128,0,32,0.1)",
                  "& fieldset": { borderColor: mediumText },
                  "&.Mui-focused fieldset": { borderColor: mediumText },
                },
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: mediumText }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<MarkEmailReadOutlined />}
              sx={{
                py: 1.8,
                fontSize: "1rem",
                fontWeight: "bold",
                background: primaryGradient,
                "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                transition: "transform 0.2s ease-in-out",
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyCode}>
            <Typography sx={{ mb: 3, color: mediumText, fontSize: "14px", textAlign: "center" }}>
              Enter the 6-digit verification code sent to <strong>{userEmail}</strong>
            </Typography>
            <TextField
              type="text"
              name="verificationCode"
              placeholder="• • • • • •"
              fullWidth
              value={formData.verificationCode}
              onChange={handleChanges}
              inputProps={{
                maxLength: 6,
                style: { textAlign: "center", fontSize: "2rem", letterSpacing: "1rem" },
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor: mediumText },
                  "&.Mui-focused fieldset": { borderColor: mediumText },
                },
              }}
              required
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => setCurrentStep(0)}
                variant="outlined"
                fullWidth
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.8,
                  color: mediumText,
                  borderColor: mediumText,
                  fontWeight: "bold",
                  "&:hover": { borderColor: mediumText, backgroundColor: "rgba(128,0,32,0.1)" },
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<VerifiedUserOutlined />}
                sx={{
                  py: 1.8,
                  fontWeight: "bold",
                  background: primaryGradient,
                  "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box
            component="form"
            onSubmit={handleResetPassword}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography sx={{ mb: 3, color: mediumText, fontSize: "14px", textAlign: "center" }}>
              Create a new password for your account.
            </Typography>

            <TextField
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChanges}
              sx={{
                mb: 2,
                width: "100%",
                maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(128,0,32,0.1)",
                  "& fieldset": { borderColor: mediumText },
                  "&.Mui-focused fieldset": { borderColor: mediumText },
                },
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: mediumText }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChanges}
              sx={{
                mb: 2,
                width: "100%",
                maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(128,0,32,0.1)",
                  "& fieldset": { borderColor: mediumText },
                  "&.Mui-focused fieldset": { borderColor: mediumText },
                },
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: mediumText }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={passwordConfirmed}
                  onChange={(e) => setPasswordConfirmed(e.target.checked)}
                  sx={{ color: mediumText, "&.Mui-checked": { color: mediumText } }}
                />
              }
              label="I confirm that I want to change my password"
              sx={{ mb: 3, textAlign: "center" }}
            />

            <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 400 }}>
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outlined"
                fullWidth
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.8,
                  color: mediumText,
                  borderColor: mediumText,
                  fontWeight: "bold",
                  "&:hover": { borderColor: mediumText, backgroundColor: "rgba(128,0,32,0.1)" },
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!passwordConfirmed || loading}
                startIcon={<LockResetOutlined />}
                sx={{
                  py: 1.8,
                  fontWeight: "bold",
                  background: primaryGradient,
                  "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                  transition: "transform 0.2s ease-in-out",
                  "&:disabled": { bgcolor: "#cccccc" },
                }}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const InfoField = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", fontWeight: 600, display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: darkText, fontSize: "13px" }}>
        {value || "..."}
      </Typography>
    </Box>
  );

  return (
    <>
      {/* Backgrounds */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "zoomPulse 20s ease-in-out infinite",
          "@keyframes zoomPulse": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          animation: "subtlePulse 8s ease-in-out infinite",
          "@keyframes subtlePulse": { "0%, 100%": { opacity: 0.75 }, "50%": { opacity: 0.7 } },
        }}
      />

      {/* Main Container */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          py: 10,
        }}
      >
        <LoadingOverlay open={loading} message="Processing..." />
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          <Grid container spacing={3}>
            {/* Profile Sidebar */}
            {person && (
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={24}
                  sx={{
                    padding: 3,
                    borderRadius: 4,
                    background: "rgba(255,248,231,0.85)",
                    backdropFilter: "blur(15px)",
                    boxShadow: "0 15px 40px rgba(128,0,32,0.2)",
                    border: "1px solid rgba(128,0,32,0.15)",
                    maxHeight: "89vh",
                     overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#6d2323",
                      borderRadius: "10px",
                      border: "2px solid #f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#a31d1d",
                    },
                  }}
                >
                  {/* Profile Picture */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "0 auto",
                        border: `3px solid ${mediumText}`,
                        boxShadow: "0 4px 12px rgba(109, 35, 35, 0.2)",
                      }}
                    >
                      {!profilePicture && <PersonIcon sx={{ fontSize: 50, color: mediumText }} />}
                    </Avatar>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: darkText }}>
                      {person.firstName} {person.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: mediumText }}>
                      EmployeeNum: <b>{person.agencyEmployeeNum}</b>
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Personal Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: mediumText, mb: 2, display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} /> Personal Information
                    </Typography>
                    <InfoField label="Full Name" value={`${person.firstName} ${person.middleName || ''} ${person.lastName} ${person.nameExtension || ''}`.trim()} />
                    <InfoField label="Date of Birth" value={person.birthDate} />
                    <InfoField label="Sex" value={person.sex} />
                    <InfoField label="Civil Status" value={person.civilStatus} />
                    <InfoField label="Citizenship" value={person.citizenship} />
                    <InfoField label="Blood Type" value={person.bloodType} />
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Government Identification */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: mediumText, mb: 2, display: "flex", alignItems: "center" }}>
                      <BadgeIcon sx={{ fontSize: 18, mr: 0.5 }} /> Government IDs
                    </Typography>
                    <InfoField label="GSIS Number" value={person.gsisNum} />
                    <InfoField label="Pag-IBIG Number" value={person.pagibigNum} />
                    <InfoField label="PhilHealth Number" value={person.philhealthNum} />
                    <InfoField label="SSS Number" value={person.sssNum} />
                    <InfoField label="TIN Number" value={person.tinNum} />
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Change Password Form */}
            <Grid item xs={12} md={person ? 7 : 12}>
              <Paper
                elevation={24}
                sx={{
                  padding: { xs: 3, md: 4 },
                  width: "100%",
                  borderRadius: 4,
                  textAlign: "center",
                  background: "rgba(255,248,231,0.85)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 15px 40px rgba(128,0,32,0.2)",
                  border: "1px solid rgba(128,0,32,0.15)",
                  transition: "transform 0.6s ease, box-shadow 0.6s ease",
                  "&:hover": { transform: "scale(1.03)", boxShadow: "0 25px 50px rgba(128,0,32,0.35)" },
                }}
              >
                <Box sx={{ width: 100, height: 100, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
                <Typography variant="h5" sx={{ color: darkText, fontWeight: "bold", mb: 1 }}>
                  {currentStep === 0 && "Change Your Password"}
                  {currentStep === 1 && "Enter Verification Code"}
                  {currentStep === 2 && "Create New Password"}
                </Typography>
                <Stepper activeStep={currentStep} sx={{ mb: 3, mt: 2 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconProps={{
                          sx: { "&.Mui-active": { color: mediumText }, "&.Mui-completed": { color: mediumText } },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {errMessage && <Alert icon={<ErrorOutline fontSize="inherit" />} sx={{ mb: 2 }} severity="error">{errMessage}</Alert>}
                {renderStepContent()}

                {/* Verification Modal */}
                {showVerificationModal && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      zIndex: 20,
                    }}
                  >
                    <Box
                      sx={{
                        width: "90%",
                        maxWidth: 500,
                        bgcolor: "rgba(255,248,231,0.95)",
                        borderRadius: 4,
                        p: 4,
                        textAlign: "center",
                        boxShadow: "0 20px 50px rgba(128,0,32,0.3)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <MarkEmailReadOutlined sx={{ fontSize: 80, color: mediumText, mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: darkText }}>
                        Verification Code Sent
                      </Typography>
                      <Typography sx={{ color: mediumText, mb: 3, lineHeight: 1.5 }}>
                        A verification code has been sent to <strong>{userEmail}</strong>. Please check your inbox and enter the code to proceed.
                      </Typography>
                      <Button
                        onClick={() => setShowVerificationModal(false)}
                        variant="contained"
                        fullWidth
                        sx={{
                          py: 1.8,
                          fontSize: "1rem",
                          fontWeight: "bold",
                          background: primaryGradient,
                          "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                          transition: "transform 0.2s ease-in-out",
                        }}
                      >
                        Okay
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      zIndex: 20,
                    }}
                  >
                    <Box
                      sx={{
                        width: "90%",
                        maxWidth: 500,
                        bgcolor: "rgba(255,248,231,0.95)",
                        borderRadius: 4,
                        p: 4,
                        textAlign: "center",
                        boxShadow: "0 20px 50px rgba(128,0,32,0.3)",
                        backdropFilter: "blur(10px)",
                      }}
                    >A
                      <CheckCircleOutline sx={{ fontSize: 80, color: "#6d2323", mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: darkText }}>
                        Password Changed Successfully!
                      </Typography>
                      <Typography sx={{ color: mediumText, mb: 3, lineHeight: 1.5 }}>
                        Your password has been successfully updated. You will be logged out shortly for security purposes.
                      </Typography>
                      <Button
                        onClick={handleSuccessClose}
                        variant="contained"
                        fullWidth
                        startIcon={<LockOutlined />}
                        sx={{
                          py: 1.8,
                          fontSize: "1rem",
                          fontWeight: "bold",
                          background: primaryGradient,
                          "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                          transition: "transform 0.2s ease-in-out",
                        }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
              {/* EMAIL SETTINGS FORM BELOW CHANGE PASSWORD */}
              <Paper
                elevation={24}
                 sx={{
                  padding: { xs: 3, md: 4 },
                  width: "100%",
                  mt: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  background: "rgba(255,248,231,0.85)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 15px 40px rgba(128,0,32,0.2)",
                  border: "1px solid rgba(128,0,32,0.15)",
                  transition: "transform 0.6s ease, box-shadow 0.6s ease",
                  "&:hover": { transform: "scale(1.03)", boxShadow: "0 25px 50px rgba(128,0,32,0.35)" },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: darkText }}>
                  Email Settings
                </Typography>

                <TextField
                  fullWidth
                  label="Current Email"
                  value={userEmail}
                  disabled
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: mediumText }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Confirm New Email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  sx={{ mb: 3 }}
                  required
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.8,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    background: primaryGradient,
                    "&:hover": { background: primaryHoverGradient, transform: "scale(1.05)" },
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onClick={handleUpdateEmail}
                >
                  Update Email
                </Button>
              </Paper>

            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* Logout Animation Dialog */}
      {logoutOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: i % 2 === 0 ? "rgba(163,29,29,0.8)" : "rgba(255,248,225,0.8)",
                position: "absolute",
                top: "50%",
                left: "50%",
                transformOrigin: "-60px 0px",
                animation: `orbit${i} ${3 + i}s linear infinite`,
                boxShadow: "0 0 15px rgba(163,29,29,0.5), 0 0 8px rgba(255,248,225,0.5)",
              }}
            />
          ))}

          <Box
            sx={{
              position: "relative",
              width: 120,
              height: 120,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, #A31D1D, #700000)",
                boxShadow: "0 0 40px rgba(163,29,29,0.7), 0 0 80px rgba(163,29,29,0.5)",
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
              <LockResetOutlined
                sx={{
                  fontSize: 60,
                  color: "#FFF8E1",
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
              textShadow: "0 0 10px #A31D1D",
              animation: "pulse 1.5s infinite",
            }}
          >
            Logging out...
          </Typography>

          <style>{`
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
          `}</style>
        </Box>
      )}
    </>
  );
};

export default Settings;