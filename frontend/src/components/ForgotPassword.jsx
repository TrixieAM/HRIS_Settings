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
import earistLogo from "../assets/earistLogo.jpg";

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
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "68%",
          borderRadius: 2,
          textAlign: "center",
          marginLeft: "-40%",
          marginTop: "-115%"
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              backgroundColor: "#A31D1D",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              paddingY: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginX: "-32px",
              marginTop: "-32px",
            }}
          >
            <img
              src={earistLogo}
              alt="E.A.R.I.S.T Logo"
              style={{
                height: 90,
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "4px",
              }}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          <b>Reset Password</b>
        </Typography>

        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            onChange={handleChanges}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 3 }}
            autoComplete="email"
            onChange={handleChanges}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D" }}
          >
            Send Reset Link
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Remember your password?{" "}
          <Link href="/" underline="hover">
            <b>Login</b>
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
