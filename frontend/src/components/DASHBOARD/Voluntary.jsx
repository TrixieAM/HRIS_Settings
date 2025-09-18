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

import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SearchIcon from '@mui/icons-material/Search';
import ReorderIcon from '@mui/icons-material/Reorder';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';

const VoluntaryWork = () => {
  const [data, setData] = useState([]);
  const [newVoluntary, setNewVoluntary] = useState({
    nameAndAddress: '',
    dateFrom: '',
    dateTo: '',
    numberOfHours: '',
    natureOfWork: '',
    person_id: '',
  });
  const [editVoluntary, setEditVoluntary] = useState(null);
  const [originalVoluntary, setOriginalVoluntary] = useState(null); // Store original data for cancel
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");

  useEffect(() => {
    fetchVoluntaryWork();
  }, []);

  const fetchVoluntaryWork = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/VoluntaryRoute/voluntary-work`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/VoluntaryRoute/voluntary-work`, newVoluntary);
      setNewVoluntary({
        nameAndAddress: '',
        dateFrom: '',
        dateTo: '',
        numberOfHours: '',
        natureOfWork: '',
        person_id: '',
      });
     setTimeout(() => {     
      setLoading(false);  
      setSuccessAction("adding");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }, 300);  
      fetchVoluntaryWork();
    } catch (err) {
      console.error('Error adding data:', err);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/VoluntaryRoute/voluntary-work/${editVoluntary.id}`, editVoluntary);
      setEditVoluntary(null);
      setOriginalVoluntary(null);
      setIsEditing(false);
      fetchVoluntaryWork();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/VoluntaryRoute/voluntary-work/${id}`);
      setEditVoluntary(null);
      setOriginalVoluntary(null);
      setIsEditing(false);
      fetchVoluntaryWork();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditVoluntary({ ...editVoluntary, [field]: value });
    } else {
      setNewVoluntary({ ...newVoluntary, [field]: value });
    }
  };

  // Handle opening the modal (view mode initially)
  const handleOpenModal = (voluntary) => {
    setEditVoluntary({ ...voluntary });
    setOriginalVoluntary({ ...voluntary });
    setIsEditing(false);
  };

  // Handle entering edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditVoluntary({ ...originalVoluntary });
    setIsEditing(false);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setEditVoluntary(null);
    setOriginalVoluntary(null);
    setIsEditing(false);
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  return (
    <Container sx={{ mt: 0, }}>

      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding voluntary work record..."  />
      
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
            <VolunteerActivismIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Voluntary Work Information
              </Typography>
              <Typography variant="body2">
                Insert Your Voluntary Work Information
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
              {/* Name and Address */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Name and Address
                </Typography>
                <TextField
                  value={newVoluntary.nameAndAddress}
                  onChange={(e) => handleChange("nameAndAddress", e.target.value)}
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
                  value={newVoluntary.dateFrom}
                  onChange={(e) => handleChange("dateFrom", e.target.value)}
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
                  value={newVoluntary.dateTo}
                  onChange={(e) => handleChange("dateTo", e.target.value)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Number of Hours */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Number of Hours
                </Typography>
                <TextField
                  value={newVoluntary.numberOfHours}
                  onChange={(e) => handleChange("numberOfHours", e.target.value)}
                  fullWidth
                  style={inputStyle}
                />
              </Grid>

              {/* Nature of Work */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Nature of Work
                </Typography>
                <TextField
                  value={newVoluntary.natureOfWork}
                  onChange={(e) => handleChange("natureOfWork", e.target.value)}
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
                  value={newVoluntary.person_id}
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
              Voluntary Work Records
            </Typography>
            <Typography variant="body2">
              View and manage voluntary work information
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
              Search Records using Employee Number or Organization Name
            </Typography>

            {/* Search Box */}
            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Person ID or Organization Name"
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
              .filter((voluntary) => {
                const orgName = voluntary.nameAndAddress?.toLowerCase() || "";
                const personId = voluntary.person_id?.toString() || "";
                const search = searchTerm.toLowerCase();
                return personId.includes(search) || orgName.includes(search);
              })
              .map((voluntary) => (
                <Grid item xs={12} sm={6} md={4} key={voluntary.id}>
                  <Box
                    onClick={() => handleOpenModal(voluntary)}
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
                      {voluntary.person_id}
                    </Typography>

                    {/* Organization Name Pill */}
                    <Chip
                      label={voluntary.nameAndAddress}
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
            {data.filter((voluntary) => {
              const orgName = voluntary.nameAndAddress?.toLowerCase() || "";
              const personId = voluntary.person_id?.toString() || "";
              const search = searchTerm.toLowerCase();
              return personId.includes(search) || orgName.includes(search);
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
          open={!!editVoluntary}
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
            {editVoluntary && (
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
                    {isEditing ? "Edit Voluntary Work Information" : "Voluntary Work Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content (Form Style) */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Name and Address */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Name and Address
                      </Typography>
                      <TextField
                        value={editVoluntary.nameAndAddress}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, nameAndAddress: e.target.value })
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
                        value={editVoluntary.dateFrom}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, dateFrom: e.target.value })
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
                        value={editVoluntary.dateTo}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, dateTo: e.target.value })
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

                    {/* Number of Hours */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Number of Hours
                      </Typography>
                      <TextField
                        value={editVoluntary.numberOfHours}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, numberOfHours: e.target.value })
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

                    {/* Nature of Work */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        Nature of Work
                      </Typography>
                      <TextField
                        value={editVoluntary.natureOfWork}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, natureOfWork: e.target.value })
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
                        value={editVoluntary.person_id}
                        onChange={(e) =>
                          setEditVoluntary({ ...editVoluntary, person_id: e.target.value })
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
                          onClick={() => handleDelete(editVoluntary.id)}
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

export default VoluntaryWork;