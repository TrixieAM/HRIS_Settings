import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Link,
  Box,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import earistLogo from "../assets/earistLogo.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    username: "",
    email: "",
    role: "administrator",
    password: "",
  });
  const [errMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (
      !formData.employeeNumber ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setErrorMessage("Please fill all asked credentials");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setErrorMessage("Invalid Credentials");
      }
    } catch (error) {
      console.error("Registration Error", error);
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "56vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "68%",
          borderRadius: 2,
          textAlign: "center",
          marginLeft: "-40%"
          
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
          <b>Create an Account</b>
        </Typography>

        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            name="employeeNumber"
            label="Employee Number"
            fullWidth
            sx={{ mb: 2 }}
            onChange={handleChanges}
          />
          <TextField
            name="username"
            label="Username"
            fullWidth
            sx={{ mb: 2 }}
            onChange={handleChanges}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            autoComplete="email"
            onChange={handleChanges}
          />
          <TextField
            name="role"
            select
            label="Role"
            value={formData.role}
            onChange={handleChanges}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="administrator">Admin</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
          </TextField>
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            autoComplete="new-password"
            onChange={handleChanges}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D" }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link href="/" underline="hover">
            <b>Login</b>
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
