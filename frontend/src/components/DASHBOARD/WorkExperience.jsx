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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
} from "@mui/icons-material";

import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import SearchIcon from '@mui/icons-material/Search';
import ReorderIcon from '@mui/icons-material/Reorder';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfullOverlay';

const WorkExperience = () => {
  const [data, setData] = useState([]);
  const [newWorkExperience, setNewWorkExperience] = useState({
    workDateFrom: '',
    workDateTo: '',
    workPositionTitle: '',
    workCompany: '',
    workMonthlySalary: '',
    SalaryJobOrPayGrade: '',
    StatusOfAppointment: '',
    isGovtService: '',
    person_id: '',
  });
  const [editWorkExperience, setEditWorkExperience] = useState(null);
  const [originalWorkExperience, setOriginalWorkExperience] = useState(null); // Store original data for cancel
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const res = await axios.get('http://localhost:5000/WorkExperienceRoute/work-experience-table');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/WorkExperienceRoute/work-experience-table', newWorkExperience);
      setNewWorkExperience({
        workDateFrom: '',
        workDateTo: '',
        workPositionTitle: '',
        workCompany: '',
        workMonthlySalary: '',
        SalaryJobOrPayGrade: '',
        StatusOfAppointment: '',
        isGovtService: '',
        person_id: '',
      });
     setTimeout(() => {     
      setLoading(false);  
      setSuccessAction("adding");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }, 300);  
      fetchWorkExperiences();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/WorkExperienceRoute/work-experience-table/${editWorkExperience.id}`, editWorkExperience);
      setEditWorkExperience(null);
      setOriginalWorkExperience(null);
      setIsEditing(false);
      fetchWorkExperiences();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/WorkExperienceRoute/work-experience-table/${id}`);
      setEditWorkExperience(null);
      setOriginalWorkExperience(null);
      setIsEditing(false);
      fetchWorkExperiences();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditWorkExperience({ ...editWorkExperience, [field]: value });
    } else {
      setNewWorkExperience({ ...newWorkExperience, [field]: value });
    }
  };

  // Handle opening the modal (view mode initially)
  const handleOpenModal = (workExp) => {
    setEditWorkExperience({ ...workExp });
    setOriginalWorkExperience({ ...workExp });
    setIsEditing(false);
  };

  // Handle entering edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditWorkExperience({ ...originalWorkExperience });
    setIsEditing(false);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setEditWorkExperience(null);
    setOriginalWorkExperience(null);
    setIsEditing(false);
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  return (
    <Container sx={{ mt: 0, }}>

      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding work experience record..."  />
      
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
            <WorkHistoryIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Work Experience Information
              </Typography>
              <Typography variant="body2">
                Insert Your Work Experience Information
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
              {/* Date From */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date From
                </Typography>
                <TextField
                  value={newWorkExperience.workDateFrom}
                  onChange={(e) => handleChange("workDateFrom", e.target.value)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Date To */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date To
                </Typography>
                <TextField
                  value={newWorkExperience.workDateTo}
                  onChange={(e) => handleChange("workDateTo", e.target.value)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Position Title */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Position Title
                </Typography>
                <TextField
                  value={newWorkExperience.workPositionTitle}
                  onChange={(e) => handleChange("workPositionTitle", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Company */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Company
                </Typography>
                <TextField
                  value={newWorkExperience.workCompany}
                  onChange={(e) => handleChange("workCompany", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Monthly Salary */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Monthly Salary
                </Typography>
                <TextField
                  value={newWorkExperience.workMonthlySalary}
                  onChange={(e) => handleChange("workMonthlySalary", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Salary Job/Pay Grade */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Salary Job/Pay Grade
                </Typography>
                <TextField
                  value={newWorkExperience.SalaryJobOrPayGrade}
                  onChange={(e) => handleChange("SalaryJobOrPayGrade", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Status of Appointment */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Status of Appointment
                </Typography>
                <TextField
                  value={newWorkExperience.StatusOfAppointment}
                  onChange={(e) => handleChange("StatusOfAppointment", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Employee Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Employee Number
                </Typography>
                <TextField
                  value={newWorkExperience.person_id}
                  onChange={(e) => handleChange("person_id", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
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
              Work Experience Records
            </Typography>
            <Typography variant="body2">
              View and manage work experience information
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
            {/* Subtitle */}
            <Typography
              variant="subtitle2"
              sx={{ color: "#6D2323", mb: 1 }}
            >
              Search Records using Employee Number or Company Name
            </Typography>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Person ID or Company Name"
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
            {data
              .filter((workExp) => {
                const companyName = workExp.workCompany?.toLowerCase() || "";
                const positionTitle = workExp.workPositionTitle?.toLowerCase() || "";
                const personId = workExp.person_id?.toString() || "";
                const search = searchTerm.toLowerCase();
                return personId.includes(search) || companyName.includes(search) || positionTitle.includes(search);
              })
              .map((workExp) => (
                <Grid item xs={12} sm={6} md={4} key={workExp.id}>
                  <Box
                    onClick={() => handleOpenModal(workExp)}
                    sx={{
                      border: "1px solid #6d2323",
                      borderRadius: 2,
                      p: 2,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
                      height: "auto",
                      minHeight: "120px",
                    }}
                  >
                    {/* Employee Number */}
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "black", mb: 1 }}
                    >
                      Employee Number:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#6d2323", mb: 2 }}
                    >
                      {workExp.person_id}
                    </Typography>

                    {/* Company Name Pill */}
                    <Chip
                      label={workExp.workCompany}
                      sx={{
                        backgroundColor: "#6d2323",
                        color: "#fff",
                        borderRadius: "50px",
                        px: 2,
                        fontWeight: "bold",
                        maxWidth: "100%",
                        mb: 1,
                      }}
                    />

                    {/* Position Title */}
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontSize: "0.9rem" }}
                    >
                      {workExp.workPositionTitle}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            {data.filter((workExp) => {
              const companyName = workExp.workCompany?.toLowerCase() || "";
              const positionTitle = workExp.workPositionTitle?.toLowerCase() || "";
              const personId = workExp.person_id?.toString() || "";
              const search = searchTerm.toLowerCase();
              return personId.includes(search) || companyName.includes(search) || positionTitle.includes(search);
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

        <Modal
          open={!!editWorkExperience}
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
              maxWidth: "900px",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {editWorkExperience && (
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
                    {isEditing ? "Edit Work Experience Information" : "Work Experience Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content (Form Style) */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Date From */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date From
                      </Typography>
                      <TextField
                        value={editWorkExperience.workDateFrom}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, workDateFrom: e.target.value })
                        }
                        type="date"
                        InputLabelProps={{ shrink: true }}
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

                    {/* Date To */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date To
                      </Typography>
                      <TextField
                        value={editWorkExperience.workDateTo}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, workDateTo: e.target.value })
                        }
                        type="date"
                        InputLabelProps={{ shrink: true }}
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

                    {/* Position Title */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Position Title
                      </Typography>
                      <TextField
                        value={editWorkExperience.workPositionTitle}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, workPositionTitle: e.target.value })
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

                    {/* Company */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Company
                      </Typography>
                      <TextField
                        value={editWorkExperience.workCompany}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, workCompany: e.target.value })
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

                    {/* Monthly Salary */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Monthly Salary
                      </Typography>
                      <TextField
                        value={editWorkExperience.workMonthlySalary}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, workMonthlySalary: e.target.value })
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

                    {/* Salary Job/Pay Grade */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Salary Job/Pay Grade
                      </Typography>
                      <TextField
                        value={editWorkExperience.SalaryJobOrPayGrade}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, SalaryJobOrPayGrade: e.target.value })
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

                    {/* Status of Appointment */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Status of Appointment
                      </Typography>
                      <TextField
                        value={editWorkExperience.StatusOfAppointment}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, StatusOfAppointment: e.target.value })
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

                    {/* Employee Number */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Employee Number
                      </Typography>
                      <TextField
                        value={editWorkExperience.person_id}
                        onChange={(e) =>
                          setEditWorkExperience({ ...editWorkExperience, person_id: e.target.value })
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
                      // View mode buttons
                      <>
                        <Button
                          onClick={() => handleDelete(editWorkExperience.id)}
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
                      // Edit mode buttons
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

export default WorkExperience;