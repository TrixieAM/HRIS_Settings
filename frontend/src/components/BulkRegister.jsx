import API_BASE_URL from "../apiConfig";
import React, { useState } from "react";
import { Container, Paper, Typography, Button, Alert, Box } from "@mui/material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const BulkRegister = () => {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState([]);
  const [errors, setErrors] = useState([]);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  // Handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Add hidden/default values for each user
      const processedUsers = worksheet.map((user) => ({
        ...user,
        role: "staff",               // backend-hidden value
        employmentCategory: "0", 
        access_level: "user"         // backend-hidden value
      }));

      setUsers(processedUsers);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle register via backend
  const handleRegister = async () => {
    if (users.length === 0) {
      setErrMessage("Please upload an Excel file first.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/excel-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.successful || []);
        setErrors(result.errors || []);
        setErrMessage("");
      } else {
        setErrMessage(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error uploading Excel:", err);
      setErrMessage("Something went wrong while uploading.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "70vh",
        backgroundColor: "#fff8e1",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          <b>Bulk Users Registration</b>
        </Typography>

        <Typography gutterBottom sx={{ mt: 1, mb: 5 }}>
          <b>Register several users.</b>
        </Typography>

        {errMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errMessage}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ marginBottom: "16px" }}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ bgcolor: "#A31D1D", mt: 2 }}
          fullWidth
          onClick={handleRegister}
        >
          Upload & Register
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "black", mt: 2 }}
          onClick={() => navigate("/registration")}
        >
          ⮜ User Registration
        </Button>

        {/* Display Results */}
        {success.length > 0 && (
          <Alert severity="success" sx={{ mt: 3, textAlign: "left" }}>
            <b>Successful Registrations:</b>
            <ul>
              {success.map((user, index) => (
                <li key={index}>
                  {user.employeeNumber} - {user.username}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {errors.length > 0 && (
          <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
            <b>Errors:</b>
            <ul>
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BulkRegister;
