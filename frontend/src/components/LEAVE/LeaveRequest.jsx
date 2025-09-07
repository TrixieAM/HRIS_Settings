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

  const statusOptions = [
    { value: '0', label: 'Pending', color: '#ff9800' },
    { value: '1', label: 'Approved by Manager', color: '#2196f3' },
    { value: '2', label: 'Approved by HR', color: '#4caf50' },
    { value: '3', label: 'Denied by Manager/HR', color: '#f44336' }
  ];

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_request');
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/\//g, '-');
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const payload = {
        ...newLeaveRequest,
        leave_date: formatDate(newLeaveRequest.leave_date)
      };
      
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== '')
      );

      await axios.post('http://localhost:5000/leaveRoute/leave_request', cleanPayload);
      
      // Also create a leave assignment
      await axios.post('http://localhost:5000/leaveRoute/leave_assignment', {
        leave_code: cleanPayload.leave_code,
        employeeNumber: cleanPayload.employeeNumber
      });

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
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editLeaveRequest,
        leave_date: formatDate(editLeaveRequest.leave_date)
      };

      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== '')
      );

      await axios.put(`http://localhost:5000/leaveRoute/leave_request/${editLeaveRequest.id}`, cleanPayload);
      setEditLeaveRequest(null);
      setOriginalLeaveRequest(null);
      setIsEditing(false);
      fetchLeaveRequests();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (id) => {
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

  return (
    <Container sx={{ mt: 0 }}>
      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding leave request record..." />
      
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
                  Employee Number
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
                  Leave Type
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
                        ({type.leave_code})-{type.leave_description}  - {type.leave_hours} hours
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Leave Date
                </Typography>
                <TextField
                  type="date"
                  value={newLeaveRequest.leave_date}
                  onChange={(e) => handleChange('leave_date', e.target.value)}
                  fullWidth
                  required
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
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
              Add
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
            p: 2,
            borderRadius: "8px 8px 0 0",
            display: "flex",
            alignItems: "center",
            pb: "15px",
            border: '1px solid #6d2323',
            borderBottom: 'none'
          }}
        >
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
              Search Records using Employee Number
            </Typography>

            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
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
                  maxWidth: "800px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#6D2323",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6D2323",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6D2323",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "#6D2323", marginRight: 1 }} />
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Records as Boxes */}
          <Grid container spacing={2}>
            {leaveRequests
              .filter((leaveRequest) => {
                const employeeNumber = leaveRequest.employeeNumber?.toString().toLowerCase() || "";
                const search = searchTerm.toLowerCase();
                return employeeNumber.includes(search);
              })
              .map((leaveRequest) => {
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
                        height: "180px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <Box
                        onClick={() => handleOpenModal(leaveRequest)}
                        sx={{
                          border: "1px solid #6d2323",
                          borderRadius: 2,
                          p: 2,
                          cursor: "pointer",
                          transition: "0.2s",
                          "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
                          height: "180px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        {/* Top Row */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "black", mb: 1 }}
                            >
                              Employee Number:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "#6d2323" }}
                            >
                              {leaveRequest.employeeNumber}
                            </Typography>
                          </Box>

                          {/* Leave Type Chip on the right side */}
                          <Chip
                            label={` ${leaveTypeInfo.leave_code}`}
                            sx={{
                            backgroundColor: "transparent", // no background
                              color: "#6d2323",
                              px: 2,
                              fontWeight: "bold",
                              fontSize: '16px',
                              mb: 2,
                              mr: -3
                            }}
                          />
                        </Box>

                        {/* Bottom Section */}
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#000000", display: "block", mb: 1 }}
                          >
                            Date: {leaveRequest.leave_date 
                              ? new Date(leaveRequest.leave_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not specified"}
                          </Typography>

                          <Chip
                            label={statusInfo.label}
                            size="small"
                            sx={{
                              backgroundColor: statusInfo.color,
                              color: "#fff",
                              fontWeight: "bold"
                            }}
                          />
                        </Box>
                      </Box>

                    </Box>
                  </Grid>
                );
              })}
            {leaveRequests.filter((leaveRequest) => {
              const employeeNumber = leaveRequest.employeeNumber?.toString().toLowerCase() || "";
              const search = searchTerm.toLowerCase();
              return employeeNumber.includes(search);
            }).length === 0 && (
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
                        Employee Number
                      </Typography>
                      <TextField
                        value={editLeaveRequest.employeeNumber || ''}
                        onChange={(e) =>
                          setEditLeaveRequest({ ...editLeaveRequest, employeeNumber: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                        Leave Type
                      </Typography>
                      <FormControl fullWidth disabled={!isEditing}>
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
                              {type.leave_description} ({type.leave_code}) - {type.leave_hours} hours
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Leave Date
                      </Typography>
                      <TextField
                        type="date"
                        value={editLeaveRequest.leave_date || ''}
                        onChange={(e) =>
                          setEditLeaveRequest({ ...editLeaveRequest, leave_date: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
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
                          value={editLeaveRequest.status || ''}
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
                            backgroundColor: 'black'
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
                            backgroundColor: 'black'
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