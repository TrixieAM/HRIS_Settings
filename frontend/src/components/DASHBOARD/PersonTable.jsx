import API_BASE_URL from '../../apiConfig';
import React, { useEffect, useState, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import {
  Button,
  Box,
  TextField,
  Container,
  Grid,
  Typography,
  Chip,
  Modal,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close,
  Person as PersonIcon,
  Search as SearchIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Reorder,
} from '@mui/icons-material';
import LoadingOverlay from '../LoadingOverlay';
import SuccessfullOverlay from '../SuccessfulOverlay';

const PersonTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: '',
    birthDate: '',
    placeOfBirth: '',
    sex: '',
    civilStatus: '',
    citizenship: '',
    heightCm: '',
    weightKg: '',
    bloodType: '',
    gsisNum: '',
    pagibigNum: '',
    philhealthNum: '',
    sssNum: '',
    tinNum: '',
    agencyEmployeeNum: '',
    permanent_houseBlockLotNum: '',
    permanent_streetName: '',
    permanent_subdivisionOrVillage: '',
    permanent_barangayName: '',
    permanent_cityOrMunicipality: '',
    permanent_provinceName: '',
    permanent_zipcode: '',
    residential_houseBlockLotNum: '',
    residential_streetName: '',
    residential_subdivisionOrVillage: '',
    residential_barangayName: '',
    residential_cityOrMunicipality: '',
    residential_provinceName: '',
    residential_zipcode: '',
    telephone: '',
    mobileNum: '',
    emailAddress: '',
    spouseFirstName: '',
    spouseMiddleName: '',
    spouseLastName: '',
    spouseNameExtension: '',
    spouseOccupation: '',
    spouseEmployerBusinessName: '',
    spouseBusinessAddress: '',
    spouseTelephone: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    fatherNameExtension: '',
    motherMaidenFirstName: '',
    motherMaidenMiddleName: '',
    motherMaidenLastName: '',
    elementaryNameOfSchool: '',
    elementaryDegree: '',
    elementaryPeriodFrom: '',
    elementaryPeriodTo: '',
    elementaryHighestAttained: '',
    elementaryYearGraduated: '',
    elementaryScholarshipAcademicHonorsReceived: '',
    secondaryNameOfSchool: '',
    secondaryDegree: '',
    secondaryPeriodFrom: '',
    secondaryPeriodTo: '',
    secondaryHighestAttained: '',
    secondaryYearGraduated: '',
    secondaryScholarshipAcademicHonorsReceived: '',
  });

  // Modal state for viewing/editing
  const [editPerson, setEditPerson] = useState(null);
  const [originalPerson, setOriginalPerson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = data.filter(person =>
      person.firstName?.toLowerCase().includes(query) ||
      person.lastName?.toLowerCase().includes(query) ||
      person.agencyEmployeeNum?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchPersons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/personalinfo/person_table`, newPerson);
      setNewPerson(Object.fromEntries(Object.keys(newPerson).map(k => [k, ''])));
      setActiveStep(0); // Reset to first step
      setTimeout(() => {     
      setLoading(false);  
      setSuccessAction("adding");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }, 300);  
      fetchPersons();
    } catch (error) {
      console.error('Error adding person:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/personalinfo/person_table/${editPerson.id}`, editPerson);
      setEditPerson(null);
      setOriginalPerson(null);
      setIsEditing(false);
      fetchPersons();
      setSuccessAction("edit");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/personalinfo/person_table/${id}`);
      setEditPerson(null);
      setOriginalPerson(null);
      setIsEditing(false);
      fetchPersons();
      setSuccessAction("delete");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditPerson({ ...editPerson, [field]: value });
    } else {
      setNewPerson({ ...newPerson, [field]: value });
    }
  };

  const handleOpenModal = (person) => {
    setEditPerson({ ...person });
    setOriginalPerson({ ...person });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditPerson({ ...originalPerson });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setEditPerson(null);
    setOriginalPerson(null);
    setIsEditing(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Personal Information',
      subtitle: 'Basic details about yourself',
      fields: [
        'firstName', 'middleName', 'lastName', 'nameExtension', 'birthDate', 'placeOfBirth',
        'sex', 'civilStatus', 'citizenship', 'heightCm', 'weightKg', 'bloodType',
        'mobileNum', 'telephone', 'emailAddress',
      ]
    },
    {
      label: 'Government ID Information',
    subtitle: 'Your government identification numbers',
    fields: [
      'gsisNum', 'pagibigNum', 'philhealthNum', 'sssNum', 'tinNum', 'agencyEmployeeNum',
    ],
    disabledFields: ['agencyEmployeeNum'] // <-- added here
    },
    {
      label: 'Address Information',
      subtitle: 'Your permanent and residential addresses',
      fields: [
        'permanent_houseBlockLotNum', 'permanent_streetName', 'permanent_subdivisionOrVillage', 
        'permanent_barangayName', 'permanent_cityOrMunicipality', 'permanent_provinceName', 'permanent_zipcode',
        'residential_houseBlockLotNum', 'residential_streetName', 'residential_subdivisionOrVillage', 
        'residential_barangayName', 'residential_cityOrMunicipality', 'residential_provinceName', 'residential_zipcode',
      ]
    },
    {
      label: 'Spouse Information',
      subtitle: 'Information about your spouse',
      fields: [
        'spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'spouseNameExtension',
        'spouseOccupation', 'spouseEmployerBusinessName', 'spouseBusinessAddress', 'spouseTelephone',
      ]
    },
    {
      label: "Parents' Information",
      subtitle: 'Information about your parents',
      fields: [
        'fatherFirstName', 'fatherMiddleName', 'fatherLastName', 'fatherNameExtension',
        'motherMaidenFirstName', 'motherMaidenMiddleName', 'motherMaidenLastName',
      ]
    },
    {
      label: 'Educational Background',
      subtitle: 'Your elementary and secondary education',
      fields: [
        'elementaryNameOfSchool', 'elementaryDegree', 'elementaryPeriodFrom', 'elementaryPeriodTo',
        'elementaryHighestAttained', 'elementaryYearGraduated', 'elementaryScholarshipAcademicHonorsReceived',
        'secondaryNameOfSchool', 'secondaryDegree', 'secondaryPeriodFrom', 'secondaryPeriodTo',
        'secondaryHighestAttained', 'secondaryYearGraduated', 'secondaryScholarshipAcademicHonorsReceived',
      ]
    }
  ];

  const renderStepContent = (step) => (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {step.fields.map((field) => (
        <Grid item xs={12} sm={6} key={field}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </Typography>
          <TextField
            value={newPerson[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            fullWidth
          />
        </Grid>
      ))}
    </Grid>
  );

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 300.25 };

  return (
    <Container sx={{ mt: 0 }}>
      {/* Loading Overlay */}
      <LoadingOverlay open={loading} message="Adding person record..." />
      
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
            <PersonIcon
              sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Personal Information
              </Typography>
              <Typography variant="body2">
                Add Your Personal Information
              </Typography>
            </Box>
          </Box>

          {/* Content/Form with Stepper */}
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
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {step.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {step.subtitle}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {renderStepContent(step)}
                    <Box sx={{ mb: 2, mt: 3 }}>
                      <div>
                        {index === steps.length - 1 ? (
                          <Button
                            variant="contained"
                            onClick={handleAdd}
                            startIcon={<AddIcon />}
                            sx={{
                              mr: 1,
                              backgroundColor: "#6D2323",
                              color: "#FEF9E1",
                              "&:hover": { backgroundColor: "#a31d1d" },
                              width: '80%'
                            }}
                          >
                            Add Person
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                              mr: 1,
                              backgroundColor: "#6D2323",
                              color: "#FEF9E1",
                              "&:hover": { backgroundColor: "#a31d1d" },
                            }}
                            endIcon={<NextIcon />}
                          >
                            Next
                          </Button>
                        )}
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mr: 1, 
                              border: "1px solid #6d2323",
                              color: "#6d2323",
                              }}
                          startIcon={<PrevIcon />}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Container>
        </Box>
      </Box>

      {/* Records Section */}
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
          <Reorder sx={{ fontSize: "3rem", mr: 2, mt: "5px", ml: "5px" }} />
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Personal Information Records
            </Typography>
            <Typography variant="body2">
              View and manage personal information
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
              Search Records using Employee Number or Name
            </Typography>

            <Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Employee Number or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredData.map((person) => (
              <Grid item xs={12} sm={6} md={4} key={person.id}>
                <Box
                  onClick={() => handleOpenModal(person)}
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
                    {person.agencyEmployeeNum}
                  </Typography>

                  <Chip
                    label={`${person.firstName} ${person.lastName}`}
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
            {filteredData.length === 0 && (
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

        {/* Edit Modal */}
        <Modal
          open={!!editPerson}
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
              width: "90%",
              maxWidth: "1200px",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {editPerson && (
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
                    {isEditing ? "Edit Personal Information" : "Personal Information"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
                    <Close />
                  </IconButton>
                </Box>

            {/* Modal Content */}
            <Box sx={{ p: 3 }}>
              {steps.map((step, stepIndex) => (
                <Box key={stepIndex} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#6D2323", fontWeight: "bold" }}>
                    {step.label}
                  </Typography>
                  <Grid container spacing={3}>
                    {step.fields.map((field) => {
                      const isFieldDisabled = field === 'agencyEmployeeNum';

                      return (
                        <Grid item xs={12} sm={6} md={4} key={field}>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                          <TextField
                            value={editPerson[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value, true)}
                            fullWidth
                            disabled={isFieldDisabled || !isEditing}
                            sx={{
                              ...(isFieldDisabled
                                ? {
                                    backgroundColor: '#f5f5f5', 
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      color: '#9e9e9e',
                                      WebkitTextFillColor: '#9e9e9e'
                                    },
                                    '& .MuiInputLabel-root.Mui-disabled': {
                                      color: '#757575'
                                    }
                                  }
                                : {})
                            }}
                            helperText={isFieldDisabled ? "Cannot be changed unless deleted" : ""}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              ))}

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
                          onClick={() => handleDelete(editPerson.id)}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PersonTable;