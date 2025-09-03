import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Link,
  Paper,
  Typography,
} from "@mui/material";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    employeeNumber: "",
    password: "",
  });

  const [errMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, employeeNumber, password } = formData;

    if (!username || !employeeNumber || !password || !email) {
      setErrorMessage("Please fill all required fields.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("User registered successfully!");
        setErrorMessage("");
        setFormData({ username: "",  email: "", employeeNumber: "", password: "" });
      } else {
        setErrorMessage("Registration failed. Try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Registration Error", err);
      setErrorMessage("Something went wrong.");
      setSuccessMessage("");
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
        <Typography variant="h4" gutterBottom sx={{ mt: 5 }}>
          <b>User Registration</b>
        </Typography>

        <Typography gutterBottom sx={{ mt: 1 }}>
          <b>Register users one at a time.</b>
        </Typography>

        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert sx={{ mb: 2 }} severity="success">
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            name="username"
            label="Name"
            fullWidth
            sx={{ mb: 2, mt: 4 }}
            value={formData.username}
            onChange={handleChanges}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.email}
            onChange={handleChanges}
          />
          <TextField
            name="employeeNumber"
            label="Employee Number"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.employeeNumber}
            onChange={handleChanges}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 1 }}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChanges}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 2 }}
          >
            Register
          </Button>
        </form>

        <Button
          type="button"
          variant="contained"
          fullWidth
          sx={{ bgcolor: "black", mt: 1 }}
        >
          <Link
            href="/bulk-register"
            underline="none"
            sx={{
              color: "white",
            }}
          >
            ⮞ Bulk Registration
          </Link>
        </Button>
      </Paper>
    </Container>
  );
};

export default Registration;
