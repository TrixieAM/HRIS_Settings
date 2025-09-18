import API_BASE_URL from "../apiConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import earistLogo from "../assets/earistLogo.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    employeeNumber: "",
    password: "",
  });
  const [errMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, employeeNumber, password } = formData;

    if (!username || !employeeNumber || !password) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/"); // Navigate to login after successful registration
      } else {
        setErrorMessage("Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Registration Error", err);
      setErrorMessage("Something went wrong.");
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
        {/* Logo and header */}
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
            src={earistLogo}
            alt="E.A.R.I.S.T Logo"
            style={{
              height: 80,
              borderRadius: "50%",
              backgroundColor: "white",
              padding: 4,
            }}
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          <b>Create an Account</b>
        </Typography>

        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            name="username"
            label="Name"
            fullWidth
            sx={{ mb: 2, mt: 4 }}
            onChange={handleChanges}
            required
          />
          <TextField
            name="employeeNumber"
            label="Employee Number"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            onChange={handleChanges}
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            autoComplete="new-password"
            onChange={handleChanges}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 4 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: "black",
              fontSize: "13px",
              textTransform: "none",
              padding: 0,
              minWidth: 0,
            }}
          >
            <b>Login</b>
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
