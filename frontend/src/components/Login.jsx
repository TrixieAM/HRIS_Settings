import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Link,
  Box,
  Paper,
  Typography,
  Modal,
} from "@mui/material";
import logo from "../assets/logo.PNG";
import LoadingOverlay from "../components/LoadingOverlay";



const Login = () => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    password: "",
  });


  const [errMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // 2FA states
  const [show2FA, setShow2FA] = useState(false);
  const [pin, setPin] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [codeTimer, setCodeTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  
  // Lock timer countdown
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            setTwoFactorError("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);


  // Code expiration timer
  useEffect(() => {
    let interval;
    if (codeTimer > 0) {
      interval = setInterval(() => {
        setCodeTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeTimer]);


  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const send2FACode = async (email, empNumber) => {
    setResendLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send-2fa-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, employeeNumber: empNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Verification code sent to your email.");
        setCodeTimer(2 * 60); // 15 minutes
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setTwoFactorError(data.error || "Failed to send code.");
      }
    } catch (error) {
      console.error("Failed to send 2FA code:", error);
      setTwoFactorError("Failed to send verification code.");
    } finally {
      setResendLoading(false);
    }
  };


  const verify2FACode = async () => {
    if (!pin.trim()) {
      setTwoFactorError("Please enter the verification code");
      return;
    }
    if (isLocked) {
      setTwoFactorError(`Too many failed attempts. Wait ${formatTime(lockTimer)}.`);
      return;
    }


    setTwoFactorLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-2fa-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: pin }),
      });
      const data = await res.json();


      if (res.ok && data.verified) {
        // Complete the login after successful 2FA verification
        const loginRes = await fetch(`${API_BASE_URL}/complete-2fa-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });
        const loginData = await loginRes.json();


        if (loginRes.ok) {
          localStorage.setItem("token", loginData.token);
          const decoded = JSON.parse(atob(loginData.token.split(".")[1]));


          localStorage.setItem("employeeNumber", decoded.employeeNumber || loginData.employeeNumber || "");
          localStorage.setItem("role", decoded.role || loginData.role || "");


          const role = decoded.role || loginData.role;
          if (role === "superadmin" || role === "administrator") {
            navigate("/admin-home");
          } else if (role === "staff") {
            navigate("/home");
          } else {
            setTwoFactorError("Unauthorized role");
          }
        } else {
          setTwoFactorError("Login completion failed. Please try again.");
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTimer(60); // 1 minute lockout
          setTwoFactorError("Too many failed attempts. Account locked for 1 minute.");
        } else {
          setTwoFactorError("Invalid verification code. Please try again.");
        }
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      setTwoFactorError("Verification failed. Please try again.");
    } finally {
      setTwoFactorLoading(false);
    }
  };


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };


  const handleLogin = async (event) => {
    event.preventDefault();


    if (!formData.employeeNumber || !formData.password) {
      setErrorMessage("Please fill all asked credentials");
      return;
    }


    setLoading(true);
    setErrorMessage("");


    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      const data = await response.json();


      if (response.ok) {
        // If login is successful, proceed to 2FA
        setUserEmail(data.email);
        await send2FACode(data.email, formData.employeeNumber);
        setShow2FA(true);
      } else {
        setErrorMessage(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (

    
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "70vh",
        backgroundColor: "#fff8e1",
      }}
      
    >
          <LoadingOverlay open={loading || twoFactorLoading || resendLoading} message="Please wait..." />

      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {/* Logo */}
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
        <Typography variant="h6" gutterBottom sx={{ mt: 5}}>
          <b>Login to your Account</b>
        </Typography>


        {/* alert */}
        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}


        {/* Fields */}
        <form onSubmit={handleLogin}>
          <TextField
            name="employeeNumber"
            label="Employee Number"
            fullWidth
            sx={{ mb: 2, mt: 5 }}
            autoComplete="employeeNumber"
            onChange={handleChanges}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 1 }}
            autoComplete="current-password"
            onChange={handleChanges}
          />


          {/* Forgot password */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Link
              onClick={() => navigate("/forgot-password")}
              underline="hover"
              sx={{
                cursor: "pointer",
                color: "black",
                fontSize: "13px",
              }}
            >
              Forgot password?
            </Link>
          </Box>


          {/* Login button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 5 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>


      {/* 2FA Modal */}
      <Modal
        open={show2FA}
        onClose={() => setShow2FA(false)}
        aria-labelledby="2fa-modal-title"
        aria-describedby="2fa-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography id="2fa-modal-title" variant="h6" component="h2" mb={2}>
            Email Verification
          </Typography>
         
          <Typography id="2fa-modal-description" mb={2}>
            Verification code sent to <b>{userEmail}</b>
          </Typography>


          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
         
          {twoFactorError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {twoFactorError}
            </Alert>
          )}


          <TextField
            fullWidth
            placeholder="Enter 6-digit verification code"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '18px' } }}
          />


          {isLocked && (
            <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
              Account locked. Please wait {formatTime(lockTimer)}
            </Typography>
          )}


          {codeTimer > 0 && (
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Code expires in {formatTime(codeTimer)}
            </Typography>
          )}


          <Button
            onClick={verify2FACode}
            disabled={twoFactorLoading || isLocked}
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 2, mb: 1 }}
          >
            {twoFactorLoading ? "Verifying..." : "Verify Code"}
          </Button>


          <Button
            onClick={() => send2FACode(userEmail, formData.employeeNumber)}
            disabled={resendLoading || codeTimer > 0}
            variant="text"
            fullWidth
            sx={{ color: "#A31D1D" }}
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};


export default Login;



