import React, { useState } from "react";
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
} from "@mui/material";
import logo from "../assets/earistLogo.jpg";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Reset link sent to your email.");
        navigate("/");
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "70vh",
        marginLeft: "-20%",
        backgroundColor: "#fff8e1",
      }}
    >
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
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          <b>Reset Your Password</b>
        </Typography>

        {/* Error Message */}
        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 3, mt: 5 }}
            autoComplete="email"
            onChange={handleChanges}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 3 }}
          >
            Send Reset Link
          </Button>
        </form>

        {/* Back to login link */}
        <Typography variant="body2" sx={{ mt: 2, fontSize: "13px" }}>
          Remember your password?{" "}
          <Link
            href="/"
            underline="hover"
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
