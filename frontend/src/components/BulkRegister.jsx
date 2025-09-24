import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Button, Alert, Box, Chip, CircularProgress } from "@mui/material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  GroupAdd,
  PersonAdd,
  CloudUpload,
  TableChart,
  CheckCircleOutline,
  ErrorOutline,
  InfoOutlined,
  Warning,
  FileUpload,
  People,
  ArrowBack,
} from "@mui/icons-material";
import AccessDenied from "./AccessDenied";

const BulkRegister = () => {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState([]);
  const [errors, setErrors] = useState([]);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

   //ACCESSING
  // Page access control states
  const [hasAccess, setHasAccess] = useState(null);
  // Page access control
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    const pageId = 17; // PAGE ID
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

  // Handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Validate required columns exist
        if (worksheet.length === 0) {
          setErrMessage("Excel file is empty.");
          return;
        }

        const firstRow = worksheet[0];
        const requiredFields = ['employeeNumber', 'firstName', 'lastName', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !(field in firstRow));
        
        if (missingFields.length > 0) {
          setErrMessage(`Missing required columns: ${missingFields.join(', ')}. Expected columns: employeeNumber, firstName, lastName, email, password, middleName (optional), nameExtension (optional)`);
          return;
        }

        // Process users with validation
        const processedUsers = worksheet.map((user, index) => {
          // Clean up the user data
          const processedUser = {
            firstName: user.firstName?.toString().trim() || "",
            middleName: user.middleName?.toString().trim() || null,
            lastName: user.lastName?.toString().trim() || "",
            nameExtension: user.nameExtension?.toString().trim() || null,
            email: user.email?.toString().trim() || "",
            employeeNumber: user.employeeNumber?.toString().trim() || "",
            password: user.password?.toString().trim() || "",
            role: "staff",
            employmentCategory: "0",
            access_level: "user"
          };

          return processedUser;
        });

        // Basic validation
        const validationErrors = [];
        processedUsers.forEach((user, index) => {
          if (!user.firstName || !user.lastName || !user.email || !user.employeeNumber || !user.password) {
            validationErrors.push(`Row ${index + 2}: Missing required fields`);
          }
          
          // Email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (user.email && !emailRegex.test(user.email)) {
            validationErrors.push(`Row ${index + 2}: Invalid email format`);
          }
        });

        if (validationErrors.length > 0) {
          setErrMessage(`Validation errors found:\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? '\n...and more' : ''}`);
          return;
        }

        setUsers(processedUsers);
        setErrMessage("");
        
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setErrMessage("Error parsing Excel file. Please check the file format.");
      }
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
      maxWidth="lg"
      sx={{
        display: "flex",
        minHeight: "70vh",
        backgroundColor: "#fff8e1",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        py: 3,
      }}
    >
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          width: "100%", 
          textAlign: "center",
          border: "2px solid #f5e6e6",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <GroupAdd sx={{ fontSize: 40, color: "#6d2323", mr: 1 }} />
          <Typography variant="h4" sx={{ color: "#6d2323", fontWeight: "bold" }}>
            Bulk Users Registration
          </Typography>
        </Box>

        <Typography gutterBottom sx={{ mt: 1, mb: 4, color: "#8a4747" }}>
          <b>Register multiple users using Excel file</b>
        </Typography>

        <Alert 
          icon={<InfoOutlined fontSize="inherit" />}
          severity="info" 
          sx={{ 
            mb: 3, 
            textAlign: "left",
            backgroundColor: "#f5e6e6", 
            color: "#6d2323", 
            border: "1px solid #e0c4c4", 
            "& .MuiAlert-icon": {
              color: "#6d2323"
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            <TableChart sx={{ mr: 1, verticalAlign: "middle" }} />
            Excel File Requirements:
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Required columns:</b>
              <Box sx={{ mt: 0.5 }}>
                {['employeeNumber', 'firstName', 'lastName', 'email', 'password'].map((field) => (
                  <Chip 
                    key={field} 
                    label={field} 
                    size="small" 
                    sx={{ 
                      m: 0.2, 
                      bgcolor: "#6d2323", 
                      color: "white",
                      fontSize: "0.75rem"
                    }} 
                  />
                ))}
              </Box>
            </Typography>
            <Typography variant="body2">
              <b>Optional columns:</b>
              <Box sx={{ mt: 0.5 }}>
                {['middleName', 'nameExtension'].map((field) => (
                  <Chip 
                    key={field} 
                    label={field} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      m: 0.2, 
                      borderColor: "#8a4747", 
                      color: "#8a4747",
                      fontSize: "0.75rem"
                    }} 
                  />
                ))}
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
              Make sure the first row contains these column headers exactly as shown.
            </Typography>
          </Box>
        </Alert>

        {errMessage && (
          <Alert 
            icon={<ErrorOutline fontSize="inherit" />}
            severity="error" 
            sx={{ 
              mb: 2, 
              textAlign: "left", 
              whiteSpace: "pre-line",
              backgroundColor: "#6d2323",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white"
              }
            }}
          >
            {errMessage}
          </Alert>
        )}

        <Box 
          sx={{ 
            mb: 3,
            p: 3,
            border: "2px dashed #e0c4c4",
            borderRadius: 2,
            backgroundColor: "#fdfcfc",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#8a4747",
              backgroundColor: "#f9f8f8",
            }
          }}
        >
          <FileUpload sx={{ fontSize: 48, color: "#8a4747", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#6d2323", mb: 2 }}>
            Choose Excel File
          </Typography>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ 
              padding: "8px",
              border: "1px solid #e0c4c4",
              borderRadius: "4px",
              backgroundColor: "white",
              color: "#6d2323",
              cursor: "pointer",
            }}
          />
        </Box>

        {users.length > 0 && (
          <Alert 
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success" 
            sx={{ 
              mb: 3,
              backgroundColor: "#f5e6e6",
              color: "#6d2323",
              border: "1px solid #e0c4c4",
              "& .MuiAlert-icon": {
                color: "#6d2323"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="body1">
                <b>{users.length} user(s)</b> loaded from Excel file and ready to register.
              </Typography>
            </Box>
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<CloudUpload />}
          sx={{ 
            bgcolor: "#6d2323", 
            mt: 2,
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
          onClick={handleRegister}
          disabled={users.length === 0}
        >
          Upload & Register Users
        </Button>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ArrowBack />}
          sx={{ 
            bgcolor: "#8a4747", 
            mt: 2,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#6d2323",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(138, 71, 71, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/registration")}
        >
          Back to User Registration
        </Button>

        {/* Display Results */}
        {success.length > 0 && (
          <Alert 
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success" 
            sx={{ 
              mt: 3, 
              textAlign: "left",
              backgroundColor: "#dcf8e3f6",
              color: "#41644",
              border: "1px solid #41644",
              "& .MuiAlert-icon": {
                color: "#41644"
              }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              <People sx={{ mr: 1, verticalAlign: "middle" }} />
              Successful Registrations ({success.length}):
            </Typography>
            <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {success.map((user, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    <Chip 
                      label={user.employeeNumber} 
                      size="small" 
                      sx={{ mr: 1, bgcolor: "#6d2323", color: "white" }} 
                    />
                    {user.name}
                  </li>
                ))}
              </ul>
            </Box>
          </Alert>
        )}

        {errors.length > 0 && (
          <Alert 
            icon={<Warning fontSize="inherit" />}
            severity="warning" 
            sx={{ 
              mt: 3, 
              textAlign: "left",
              backgroundColor: "#6d2323",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white"
              }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              <ErrorOutline sx={{ mr: 1, verticalAlign: "middle" }} />
              Registration Errors ({errors.length}):
            </Typography>
            <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {errors.slice(0, 10).map((err, index) => (
                  <li key={index} style={{ marginBottom: "4px", fontSize: "0.9rem" }}>
                    {err}
                  </li>
                ))}
                {errors.length > 10 && (
                  <li style={{ fontStyle: "italic", color: "#ffcccc" }}>
                    ...and {errors.length - 10} more errors
                  </li>
                )}
              </ul>
            </Box>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BulkRegister;