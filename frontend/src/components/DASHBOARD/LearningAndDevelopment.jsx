import API_BASE_URL from '../../apiConfig';
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

import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SearchIcon from '@mui/icons-material/Search';
import ReorderIcon from '@mui/icons-material/Reorder';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';

const LearningAndDevelopment = () => {
  const [data, setData] = useState([]);
  const [newLearning, setNewLearning] = useState({
    titleOfProgram: '',
    dateFrom: '',
    dateTo: '',
    numberOfHours: '',
    typeOfLearningDevelopment: '',
    conductedSponsored: '',
    person_id: '',
  });
  const [editLearning, setEditLearning] = useState(null);
  const [originalLearning, setOriginalLearning] = useState(null); // Store original data for cancel
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  

  useEffect(() => {
    fetchLearning();
  }, []);

  const fetchLearning = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/learning_and_development_table`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post(`/learning_and_development_table`, newLearning);
      setNewLearning({
        titleOfProgram: '',
        dateFrom: '',
        dateTo: '',
        numberOfHours: '',
        typeOfLearningDevelopment: '',
        conductedSponsored: '',
        person_id: '',
      });
     setTimeout(() => {     
      setLoading(false);  
      setSuccessAction("adding");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }, 300);  
      fetchLearning();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/learning_and_development_table/${editLearning.id}`, editLearning);
      setEditLearning(null);
      setOriginalLearning(null);
      setIsEditing(false);
      fetchLearning();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/learning_and_development_table/${id}`);
      setEditLearning(null);
      setOriginalLearning(null);
      setIsEditing(false);
      fetchLearning();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditLearning({ ...editLearning, [field]: value });
    } else {
      setNewLearning({ ...newLearning, [field]: value });
    }
  };

  // Handle opening the modal (view mode initially)
  const handleOpenModal = (learning) => {
    setEditLearning({ ...learning });
    setOriginalLearning({ ...learning });
    setIsEditing(false);
  };

  // Handle entering edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditLearning({ ...originalLearning });
    setIsEditing(false);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setEditLearning(null);
    setOriginalLearning(null);
    setIsEditing(false);
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  return (
    <Container sx={{ mt: 0, }}>

      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding learning record..."  />
      
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
            <LightbulbIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Learning and Development Information
              </Typography>
              <Typography variant="body2">
                Insert Your Learning and Development Information
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
              {/* Title of Program */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Title of Program
                </Typography>
                <TextField
                  value={newLearning.titleOfProgram}
                  onChange={(e) => handleChange("titleOfProgram", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Date From */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date From
                </Typography>
                <TextField
                  type="date"
                  value={newLearning.dateFrom}
                  onChange={(e) => handleChange("dateFrom", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Date To */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Date To
                </Typography>
                <TextField
                  type="date"
                  value={newLearning.dateTo}
                  onChange={(e) => handleChange("dateTo", e.target.value)}
                  fullWidth
                  style={inputStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Number of Hours */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Number of Hours
                </Typography>
                <TextField
                  value={newLearning.numberOfHours}
                  onChange={(e) => handleChange("numberOfHours", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Type of Learning Development */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Type of Learning Development
                </Typography>
                <TextField
                  value={newLearning.typeOfLearningDevelopment}
                  onChange={(e) => handleChange("typeOfLearningDevelopment", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Conducted/Sponsored */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Conducted/Sponsored
                </Typography>
                <TextField
                  value={newLearning.conductedSponsored}
                  onChange={(e) => handleChange("conductedSponsored", e.target.value)}
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
                  value={newLearning.person_id}
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
              Program Records
            </Typography>
            <Typography variant="body2">
              View and manage learning and development programs
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
              Search Records using Employee Number
            </Typography>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Person ID or Program Title"
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
              .filter((learning) => {
                const programTitle = learning.titleOfProgram?.toLowerCase() || "";
                const personId = learning.person_id?.toString() || "";
                const search = searchTerm.toLowerCase();
                return personId.includes(search) || programTitle.includes(search);
              })
              .map((learning) => (
                <Grid item xs={12} sm={6} md={4} key={learning.id}>
                  <Box
                    onClick={() => handleOpenModal(learning)}
                    sx={{
                      border: "1px solid #6d2323",
                      borderRadius: 2,
                      p: 2,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
                      height: "80%",
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
                      sx={{ fontWeight: "bold", color: "#6d2323", mb: 1 }}
                    >
                      {learning.person_id}
                    </Typography>

                    {/* Program Title Pill */}
                    <Chip
                      label={learning.titleOfProgram}
                      sx={{
                        backgroundColor: "#6d2323",
                        color: "#fff",
                        borderRadius: "50px",
                        px: 2,
                        fontWeight: "bold",
                        maxWidth: "100%",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            {data.filter((learning) => {
              const programTitle = learning.titleOfProgram?.toLowerCase() || "";
              const personId = learning.person_id?.toString() || "";
              const search = searchTerm.toLowerCase();
              return personId.includes(search) || programTitle.includes(search);
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
          open={!!editLearning}
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
            {editLearning && (
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
                    {isEditing ? "Edit Learning & Development Information" : "Learning & Development Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content (Form Style) */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Title of Program */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Title of Program
                      </Typography>
                      <TextField
                        value={editLearning.titleOfProgram}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, titleOfProgram: e.target.value })
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

                    {/* Date From */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date From
                      </Typography>
                      <TextField
                        type="date"
                        value={editLearning.dateFrom}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, dateFrom: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
                        sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                  color: "#000000"
                                }
                              }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Date To */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Date To
                      </Typography>
                      <TextField
                        type="date"
                        value={editLearning.dateTo}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, dateTo: e.target.value })
                        }
                        fullWidth
                        disabled={!isEditing}
                        sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                  color: "#000000"
                                }
                              }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Number of Hours */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Number of Hours
                      </Typography>
                      <TextField
                        value={editLearning.numberOfHours}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, numberOfHours: e.target.value })
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

                    {/* Type of Learning Development */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Type of Learning Development
                      </Typography>
                      <TextField
                        value={editLearning.typeOfLearningDevelopment}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, typeOfLearningDevelopment: e.target.value })
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

                    {/* Conducted/Sponsored */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Conducted/Sponsored
                      </Typography>
                      <TextField
                        value={editLearning.conductedSponsored}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, conductedSponsored: e.target.value })
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
                        value={editLearning.person_id}
                        onChange={(e) =>
                          setEditLearning({ ...editLearning, person_id: e.target.value })
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
                          onClick={() => handleDelete(editLearning.id)}
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

export default LearningAndDevelopment;