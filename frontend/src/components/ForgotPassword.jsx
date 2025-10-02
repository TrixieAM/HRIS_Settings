import API_BASE_URL from "../apiConfig";
import React, { useState } from "react";
import {
  Alert,
  TextField,
  Button,
  Container,
  Box,
  Paper,
  Typography,
  Modal,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  LockResetOutlined,
  VerifiedUserOutlined,
  CheckCircleOutline,
  ErrorOutline,
  ArrowBack,
  Visibility,
  VisibilityOff,
  VpnKeyOutlined,
  MarkEmailReadOutlined,
} from "@mui/icons-material";
import logo from "../assets/logo.PNG";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Email, 1: Code, 2: Password
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const steps = ['Enter Email', 'Verify Code', 'New Password'];

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errMessage) setErrorMessage("");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep(1);
        setShowVerificationModal(true);
      } else {
        setErrorMessage(data.error || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrorMessage("Something went wrong. Please try again.");
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
      const response = await fetch(`${API_BASE_URL}/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep(2);
      } else {
        setErrorMessage(data.error || "Invalid verification code.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrorMessage("Something went wrong. Please try again.");
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
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.href = "/";
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmitEmail}>
            <Typography sx={{ mb: 3, color: "#666", fontSize: "14px", textAlign: "center" }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </Typography>
            
            <TextField
              type="email"
              name="email"
              label="Email Address"
              fullWidth
              value={formData.email}
              onChange={handleChanges}
              sx={{ 
                mb: 3,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "#6d2323" }} />
                  </InputAdornment>
                ),
              }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<MarkEmailReadOutlined />}
              sx={{ 
                bgcolor: "#6d2323", 
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#5a1e1e",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(109, 35, 35, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyCode}>
            <Typography sx={{ mb: 3, color: "#666", fontSize: "14px", textAlign: "center" }}>
              Enter the 6-digit verification code sent to <strong>{formData.email}</strong>
            </Typography>
            
            <TextField
              type="text"
              name="verificationCode"
              label="Verification Code"
              fullWidth
              value={formData.verificationCode}
              onChange={handleChanges}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '18px', letterSpacing: '8px' } }}
              sx={{ 
                mb: 3,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlined sx={{ color: "#6d2323" }} />
                  </InputAdornment>
                ),
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
                  color: "#6d2323",
                  borderColor: "#6d2323",
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#5a1e1e",
                    backgroundColor: "rgba(109, 35, 35, 0.04)",
                  },
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
                  bgcolor: "#6d2323", 
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#5a1e1e",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(109, 35, 35, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword}>
            <Typography sx={{ mb: 3, color: "#666", fontSize: "14px", textAlign: "center" }}>
              Create a new password for your account.
            </Typography>
            
            <TextField
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              label="New Password"
              fullWidth
              value={formData.newPassword}
              onChange={handleChanges}
              sx={{ 
                mb: 2,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#6d2323" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              label="Confirm New Password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChanges}
              sx={{ 
                mb: 2,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#6d2323" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={passwordConfirmed}
                  onChange={(e) => setPasswordConfirmed(e.target.checked)}
                  sx={{
                    color: "#6d2323",
                    '&.Mui-checked': {
                      color: "#6d2323",
                    },
                  }}
                />
              }
              label="I confirm that I want to change my password"
              sx={{ mb: 3, textAlign: "left" }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outlined"
                fullWidth
                startIcon={<ArrowBack />}
                sx={{
                  color: "#6d2323",
                  borderColor: "#6d2323",
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#5a1e1e",
                    backgroundColor: "rgba(109, 35, 35, 0.04)",
                  },
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !passwordConfirmed}
                startIcon={<LockResetOutlined />}
                sx={{ 
                  bgcolor: "#6d2323", 
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#5a1e1e",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(109, 35, 35, 0.3)",
                  },
                  transition: "all 0.3s ease",
                  "&:disabled": {
                    bgcolor: "#cccccc",
                  },
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

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "90%",
        backgroundColor: "#fff8e1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          textAlign: "center",
          border: "2px solid #f5e6e6",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            backgroundColor: "#A31D1D",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            py: 2,
            display: "flex",
            justifyContent: "center",
            mb: 2,
            mx: -4,
            mt: -4,
          }}
        >
          <img
            src={logo}
            alt="E.A.R.I.S.T Logo"
            style={{
              height: 80,
              borderRadius: "50%",
              backgroundColor: "white",
              padding: 4,
            }}
          />
        </Box>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1, mt: 3 }}>
          <Typography variant="h5" sx={{ color: "#6d2323", fontWeight: "bold" }}>
            {currentStep === 0 && "Reset Your Password"}
            {currentStep === 1 && "Enter Verification Code"}
            {currentStep === 2 && "Create New Password"}
          </Typography>
        </Box>

        {/* Step Indicator */}
        <Stepper activeStep={currentStep} sx={{ mb: 3, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': {
                      color: '#6d2323',
                    },
                    '&.Mui-completed': {
                      color: '#6d2323',
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Message */}
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

        {/* Step Content */}
        {renderStepContent()}

        {/* Back to login link */}
        <Box sx={{ mt: 3, fontSize: "14px" }}>
          Remember your password?{" "}
          <Link
            href="/"
            sx={{
              color: "#6d2323",
              fontWeight: "bold",
              textDecoration: "none",
              "&:hover": {
                color: "#5a1e1e",
                textDecoration: "underline",
              },
            }}
          >
            Login
          </Link>
        </Box>
      </Paper>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={() => {}}
        aria-labelledby="success-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          border: "2px solid #f5e6e6",
        }}>
          <CheckCircleOutline sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
            Password Updated Successfully!
          </Typography>
          <Typography sx={{ color: "#666", mb: 3, lineHeight: 1.5 }}>
            Your password has been successfully updated. You can now login with your new password.
          </Typography>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            fullWidth
            startIcon={<LockOutlined />}
            sx={{ 
              bgcolor: "#6d2323",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#5a1e1e",
              },
            }}
          >
            Continue to Login
          </Button>
        </Box>
      </Modal>

      {/* Verification Code Sent Modal */}
      <Modal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        aria-labelledby="verification-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          border: "2px solid #f5e6e6",
        }}>
          <MarkEmailReadOutlined sx={{ fontSize: 80, color: "#6d2323", mb: 2 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
            Verification Code Sent
          </Typography>
          <Typography sx={{ color: "#666", mb: 3, lineHeight: 1.5 }}>
            A verification code has been sent to <strong>{formData.email}</strong>.  
            Please check your inbox and enter the code to proceed.
          </Typography>
          <Button
            onClick={() => setShowVerificationModal(false)}
            variant="contained"
            fullWidth
            startIcon={<CheckCircleOutline />}
            sx={{ 
              bgcolor: "#6d2323",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#5a1e1e",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(109, 35, 35, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Okay
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default ForgotPassword;