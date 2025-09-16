import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Modal,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
  EventNote,
  Search as SearchIcon,
  EventAvailable as ReorderIcon,
} from "@mui/icons-material";

import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfullOverlay';
import LeaveDatePickerModal from './LeaveDatePicker';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeNumber: '',
    leave_code: '',
    leave_date: '',
    status: '0'
  });
  const [editLeaveRequest, setEditLeaveRequest] = useState(null);
  const [originalLeaveRequest, setOriginalLeaveRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');


  const statusOptions = [
    { value: '0', label: 'Pending', color: '#000000'  },
    { value: '1', label: 'Approved by Manager and Pending for HR', color: '#6d2323' },
    { value: '2', label: 'Approved by HR', color: '#a31d1d' },
    { value: '3', label: 'Denied by Manager/HR', color: '#000000' }
  ];



  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toggleDate = (dateStr) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leaveRoute/leave_request");
      setLeaveRequests(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_table');
      setLeaveTypes(res.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  
  // If it's already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  // Handle other date formats
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const handleAdd = async () => {
  // Validate required fields
  if (!newLeaveRequest.employeeNumber || !newLeaveRequest.leave_code || !newLeaveRequest.leave_date) {
    alert('Please fill in all required fields');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      employeeNumber: newLeaveRequest.employeeNumber,
      leave_code: newLeaveRequest.leave_code,
      leave_dates: [newLeaveRequest.leave_date], // Send date as-is (YYYY-MM-DD format)
      status: Number(newLeaveRequest.status)
    };

    console.log('Sending payload:', payload); // Debug log

    await axios.post("http://localhost:5000/leaveRoute/leave_request", payload);

    setNewLeaveRequest({
      employeeNumber: '',
      leave_code: '',
      leave_date: '',
      status: '0'
    });
    
    setTimeout(() => {
      setLoading(false);
      setSuccessAction("adding");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }, 300);
    
    fetchLeaveRequests();
  } catch (error) {
    console.error('Error adding data:', error);
    setLoading(false);
    
    if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert('An error occurred while adding the leave request');
    }
  }
};

const handleUpdate = async () => {
  // Validate required fields
  if (!editLeaveRequest.employeeNumber || !editLeaveRequest.leave_code || !editLeaveRequest.leave_date) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const payload = {
      employeeNumber: editLeaveRequest.employeeNumber,
      leave_code: editLeaveRequest.leave_code,
      leave_date: editLeaveRequest.leave_date, // Send date as-is (YYYY-MM-DD format)
      status: Number(editLeaveRequest.status)
    };

    console.log('Updating with payload:', payload); // Debug log

    await axios.put(`http://localhost:5000/leaveRoute/leave_request/${editLeaveRequest.id}`, payload);
    
    setEditLeaveRequest(null);
    setOriginalLeaveRequest(null);
    setIsEditing(false);
    fetchLeaveRequests();
    setSuccessAction("edit");
    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 2000);
  } catch (error) {
    console.error('Error updating data:', error);
    
    if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert('An error occurred while updating the leave request');
    }
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/leaveRoute/leave_request/${id}`);
      setEditLeaveRequest(null);
      setOriginalLeaveRequest(null);
      setIsEditing(false);
      fetchLeaveRequests();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error deleting data:', error);
      
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('An error occurred while deleting the leave request');
      }
    }
  };

  const handleChange = (field, value) => {
    setNewLeaveRequest({ ...newLeaveRequest, [field]: value });
  };

  const handleOpenModal = (leaveRequest) => {
    setEditLeaveRequest({ ...leaveRequest });
    setOriginalLeaveRequest({ ...leaveRequest });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditLeaveRequest({ ...originalLeaveRequest });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setEditLeaveRequest(null);
    setOriginalLeaveRequest(null);
    setIsEditing(false);
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  const fieldLabels = {
    employeeNumber: 'Employee Number',
    leave_code: 'Leave Type',
    leave_date: 'Leave Date',
    status: 'Status'
  };

  const getStatusInfo = (statusValue) => {
    return statusOptions.find(opt => opt.value === String(statusValue)) || statusOptions[0];
  };

  const getLeaveTypeInfo = (leaveCode) => {
    return leaveTypes.find(type => type.leave_code === leaveCode) || { leave_description: leaveCode };
  };

// ✅ Unified filter with robust date parsing
const filteredRequests = leaveRequests.filter((req) => {
const employeeName = req.employeeNumber?.toLowerCase() || "";
  const searchMatch = employeeName.includes(searchTerm.toLowerCase());

  // Support both leave_date and leave_dates[0]
  let rawDate = req.leave_date || (Array.isArray(req.leave_dates) ? req.leave_dates[0] : null);

  // Normalize date string (force YYYY-MM-DD)
  if (rawDate && typeof rawDate === "string" && rawDate.includes(",")) {
    rawDate = rawDate.split(",")[0]; // take first if comma-separated
  }

  let leaveDate = null;
  if (rawDate) {
    // Convert to standard YYYY-MM-DD format
    const parts = rawDate.split(/[-/]/); // handle "YYYY-MM-DD" or "DD/MM/YYYY"
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // Already YYYY-MM-DD
        leaveDate = new Date(rawDate);
      } else {
        // Convert DD/MM/YYYY → YYYY-MM-DD
        leaveDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
  }

  const yearMatch = yearFilter
    ? leaveDate && leaveDate.getFullYear().toString() === yearFilter
    : true;

  const monthMatch = monthFilter
    ? leaveDate &&
      String(leaveDate.getMonth() + 1).padStart(2, "0") === monthFilter
    : true;

  return searchMatch && yearMatch && monthMatch;
});


// ✅ Compute status counts
const statusCounts = {
  pending: leaveRequests.filter(req => String(req.status) === "0").length,
  approvedManager: leaveRequests.filter(req => String(req.status) === "1").length,
  approvedHR: leaveRequests.filter(req => String(req.status) === "2").length,
  denied: leaveRequests.filter(req => String(req.status) === "3").length,
};



// Clear filters handler
const handleClearFilters = () => {
  setSearchTerm("");
  setYearFilter("");
  setMonthFilter("");
};





  return (
    <Container sx={{ mt: 0 }}>
      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Processing leave request..." />
      
      {/* Success Overlay */}
      <SuccessfullOverlay open={successOpen} action={successAction} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        {/* Outer wrapper for header + content */}
        <Box sx={{ width: "75%", maxWidth: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#6D2323",
              color: "#ffffff",
              p: 2,
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "center",
              pb: '15px'
            }}
          >
            <EventNote
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Employee Leave Request
              </Typography>
              <Typography variant="body2">
                Manage Leave Request Records
              </Typography>
              
            </Box>
            
          </Box>

          {/* Content/Form */}
          <Container
            sx={{
              backgroundColor: "#fff",
              p: 3,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #6d2323",
              width: "100%",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Employee Number *
                </Typography>
                <TextField
                  value={newLeaveRequest.employeeNumber}
                  onChange={(e) => handleChange('employeeNumber', e.target.value)}
                  fullWidth
                  required
                  style={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Leave Type *
                </Typography>
                <FormControl fullWidth required style={inputStyle}>
                  <Select
                    value={newLeaveRequest.leave_code}
                    onChange={(e) => handleChange('leave_code', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Leave Type</em>
                    </MenuItem>
                    {leaveTypes.map((type) => (
                      <MenuItem key={type.id} value={type.leave_code}>
                        ({type.leave_code}) - {type.leave_description} - {type.leave_hours} hours
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Leave Date(s) *
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setDateModalOpen(true)}
                  sx={{ width: "75%", height: "56px", border: '1px solid #6d2323', color: '#000' }}
                >
                  {selectedDates.length > 0
                    ? `${selectedDates.length} date(s) selected`
                    : "Pick Leave Dates"}
                </Button>

                <LeaveDatePickerModal
                  open={dateModalOpen}
                  onClose={() => {
                    setNewLeaveRequest({ ...newLeaveRequest, leave_date: selectedDates.join(",") });
                    setDateModalOpen(false);
                  }}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Status
                </Typography>
                <FormControl fullWidth required style={inputStyle}>
                  <Select
                    value={newLeaveRequest.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Add Button */}
            <Button
              onClick={handleAdd}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
                width: "100%",
                backgroundColor: "#6D2323",
                color: "#FEF9E1",
                "&:hover": { backgroundColor: "#5a1d1d" },
              }}
            >
              Add Leave Request
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Outer wrapper for header + content */}
      <Box sx={{ width: "75%", maxWidth: "100%", margin: "20px auto" }}>
        {/* Header */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          color: "#6d2323",
          p: 3,
          borderRadius: "8px 8px 0 0",
          border: "1px solid #6d2323",
          borderBottom: "none",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <ReorderIcon sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }} />
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Leave Request Records
            </Typography>
            <Typography variant="body2">
              View and manage leave request information
            </Typography>
          </Box>
        </Box>

        {/* Status summary below header */}
        <Box
          sx={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap", // responsive, wraps if small screen
          }}
        >
          <Chip
            label={`Pending: ${statusCounts.pending}`}
            sx={{ border: "1px solid black", color: "#000000", fontWeight: "bold" }}
          />
          <Chip
            label={`Approved by Manager: ${statusCounts.approvedManager}`}
            sx={{ border: "1px solid #6d2323", color: "#6d2323", fontWeight: "bold" }}
          />
          <Chip
            label={`Approved by HR: ${statusCounts.approvedHR}`}
            sx={{ border: "solid 1px #a31d1d", color: "#a31d1d", fontWeight: "bold" }}
          />
          <Chip
            label={`Denied: ${statusCounts.denied}`}
            sx={{ border: "1px solid black", color: "#000000", fontWeight: "bold" }}
          />
        </Box>
      </Box>


        {/* Content */}
        <Container
          sx={{
            backgroundColor: "#fff",
            p: 3,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #6d2323",
            width: "100%",
          }}
        >
          {/* Search Section */}
            <Box sx={{ mb: 3, width: "100%" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6D2323", mb: 1 }}
              >
                Search Records
              </Typography>

              <Box display="flex" justifyContent="flex-start" alignItems="center" gap={2} width="100%">
                {/* Employee Number Search */}
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search by Employee Number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: "300px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#6D2323" },
                      "&:hover fieldset": { borderColor: "#6D2323" },
                      "&.Mui-focused fieldset": { borderColor: "#6D2323" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "#6D2323", marginRight: 1 }} />
                    ),
                  }}
                />



                {/* Clear Button */}
                <Button
                  onClick={handleClearFilters}
                  variant="outlined"
                  sx={{
                    borderColor: "#6D2323",
                    color: "#6D2323",
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#a31d1d",
                      color: "white",
                      borderColor: "#6D2323",
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>

            


            <Grid container spacing={2}>
              {filteredRequests.map((leaveRequest) => {
                const statusInfo = getStatusInfo(leaveRequest.status);
                const leaveTypeInfo = getLeaveTypeInfo(leaveRequest.leave_code);

                return (
              <Grid item xs={12} sm={6} md={4} key={leaveRequest.id}>
                      <Box
                        onClick={() => handleOpenModal(leaveRequest)}
                        sx={{
                          border: "1px solid #6d2323",
                          borderRadius: 2,
                          p: 2,
                          cursor: "pointer",
                          transition: "0.2s",
                          "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
                          height: "120px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        {/* Top Row */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: "black", mb: 1 }}>
                              Employee Number:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#6d2323" }}>
                              {leaveRequest.employeeNumber}
                            </Typography>
                          </Box>

                          {/* Leave Type Chip */}
                          <Chip
                            label={leaveTypeInfo.leave_code || leaveRequest.leave_code}
                            sx={{
                              backgroundColor: "transparent",
                              color: "#6d2323",
                              px: 2,
                              fontWeight: "bold",
                              fontSize: "16px",
                              mb: 2,
                              mr: -3
                            }}
                          />
                        </Box>

                        {/* Bottom Section */}
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#a31d1d", display: "block", mb: 1 }}
                          >
                            Date: {leaveRequest.leave_date
                              ? new Date(leaveRequest.leave_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })
                              : "Not specified"}
                          </Typography>

                          <Chip
                            label={statusInfo.label}
                            size="small"
                            sx={{
                              backgroundColor: statusInfo.color,
                              color: "#fff",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center"
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}

                  {/* No Records Found */}
                  {filteredRequests.length === 0 && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: "center", color: "#6D2323", fontWeight: "bold", mt: 2 }}
                      >
                        No Records Found
                      </Typography>
                    </Grid>
                  )}
                </Grid>


                  </Container>

                  {/* Modal */}
                  <Modal
                    open={!!editLeaveRequest}
                    onClose={handleCloseModal}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #6d2323",
                        borderRadius: 2,
                        width: "75%",
                        maxWidth: "700px",
                        maxHeight: "85vh",
                        overflowY: "auto",
                        position: "relative",
                      }}
                    >
                      {editLeaveRequest && (
                        <>
                          {/* Modal Header */}
                          <Box
                            sx={{
                              backgroundColor: "#6D2323",
                              color: "#ffffff",
                              p: 2,
                              borderRadius: "8px 8px 0 0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h6">
                              {isEditing ? "Edit Leave Request Information" : "Leave Request Information"}
                            </Typography>
                            <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                              <Close />
                            </IconButton>
                          </Box>

                          {/* Modal Content */}
                          <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                  Employee Number {isEditing && '*'}
                                </Typography>
                                <TextField
                                  value={editLeaveRequest.employeeNumber || ''}
                                  onChange={(e) =>
                                    setEditLeaveRequest({ ...editLeaveRequest, employeeNumber: e.target.value })
                                  }
                                  fullWidth
                                  disabled={!isEditing}
                                  required={isEditing}
                                  sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                      WebkitTextFillColor: "#000000",
                                      color: "#000000"
                                    }
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                  Leave Type {isEditing && '*'}
                                </Typography>
                                <FormControl fullWidth disabled={!isEditing} required={isEditing}>
                                  <Select
                                    value={editLeaveRequest.leave_code || ''}
                                    onChange={(e) =>
                                      setEditLeaveRequest({ ...editLeaveRequest, leave_code: e.target.value })
                                    }
                                    displayEmpty
                                    sx={{
                                      "& .MuiSelect-select.Mui-disabled": {
                                        WebkitTextFillColor: "#000000",
                                        color: "#000000"
                                      }
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Leave Type</em>
                                    </MenuItem>
                                    {leaveTypes.map((type) => (
                                      <MenuItem key={type.id} value={type.leave_code}>
                                        ({type.leave_code}) - {type.leave_description} - {type.leave_hours} hours
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                  Leave Date {isEditing && '*'}
                                </Typography>
                                <TextField
                                  type="date"
                                  value={editLeaveRequest.leave_date || ''}
                                  onChange={(e) =>
                                    setEditLeaveRequest({ ...editLeaveRequest, leave_date: e.target.value })
                                  }
                                  fullWidth
                                  disabled={!isEditing}
                                  required={isEditing}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                      WebkitTextFillColor: "#000000",
                                      color: "#000000"
                                    }
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                  Status
                                </Typography>
                                <FormControl fullWidth disabled={!isEditing}>
                                  <Select
                                    value={String(editLeaveRequest.status || '')}
                                    onChange={(e) =>
                                      setEditLeaveRequest({ ...editLeaveRequest, status: e.target.value })
                                    }
                                    displayEmpty
                                    renderValue={(selected) => {
                                      if (!selected) return "Select Status";
                                      const status = statusOptions.find(s => s.value === selected);
                                      return status ? status.label : selected;
                                    }}
                                    sx={{
                                      "& .MuiSelect-select.Mui-disabled": {
                                        WebkitTextFillColor: "#000000",
                                        color: "#000000"
                                      }
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Status</em>
                                    </MenuItem>
                                    {statusOptions.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 3,
                                gap: 2,
                              }}
                            >
                              {!isEditing ? (
                                <>
                                  <Button
                                    onClick={() => handleDelete(editLeaveRequest.id)}
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                      color: "#ffffff",
                                      backgroundColor: 'black',
                                      "&:hover": { backgroundColor: "#333333" }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    onClick={handleStartEdit}
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{ backgroundColor: "#6D2323", color: "#FEF9E1" }}
                                  >
                                    Edit
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={handleCancelEdit}
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    sx={{
                                      color: "#ffffff",
                                      backgroundColor: 'black',
                                      "&:hover": { backgroundColor: "#333333" }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleUpdate}
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    sx={{ backgroundColor: "#6D2323", color: "#FEF9E1" }}
                                  >
                                    Save
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Modal>
                </Box>
              </Container>
            );
          };

export default LeaveRequest;