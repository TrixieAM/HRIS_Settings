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
  Divider,
  Paper,
  Modal,
  Slide
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';


const fieldRefs = {}; // Global object to track refs for each field
















const sectionHeaderStyle = {
  background: 'linear-gradient(to right, #8B1E1E, #A32F2F)',
  color: 'white',
  fontWeight: 'bold',
  padding: '16px',
  borderRadius: '10px 10px 0 0',
};








const sectionContainerStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  marginBottom: '40px',
};








const fieldStyle = {
  borderRadius: '10px',
  backgroundColor: 'white',
};








const PersonTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
const [filteredData, setFilteredData] = useState([]);
const [isEditModalOpen, setEditModalOpen] = useState(false);
const newRecordRef = useRef(null);












  const [data, setData] = useState([]);
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
  const [editPerson, setEditPerson] = useState(null);


  const [errorMessage, setErrorMessage] = useState('');
  const [errorFields, setErrorFields] = useState([false]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);




  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // success | error | info | warning
  });


 
  const showSnackbar = (message, severity = 'success') => {
  setSnackbar({ open: true, message, severity });
};












const fetchItems = async () => {
  try {
    const response = await axios.get('http://localhost:5000/personalinfo/person_table');
    setData(response.data);
    setFilteredData(response.data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};




useEffect(() => {
  fetchItems();
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




  useEffect(() => {
    if (modalOpen) {
      const timer = setTimeout(() => {
        setModalOpen(false);
      }, 3000); // 3 seconds
 
      return () => clearTimeout(timer);
    }
  }, [modalOpen]);


 
 


 








  const addItem = async () => {
    const requiredFields = [
      'firstName', 'lastName', 'birthDate', 'sex', 'nameExtension', 'civilStatus', 'citizenship',  
      'residential_houseBlockLotNum', 'residential_streetName', 'residential_subdivisionOrVillage', 'residential_barangayName',
      'residential_cityOrMunicipality', 'residential_provinceName', 'residential_zipcode',
      'permanent_houseBlockLotNum', 'permanent_streetName', 'permanent_subdivisionOrVillage', 'permanent_barangay',
      'heightCm', 'weightKg', 'bloodType', 'sssNum', 'tinNum', 'agencyEmployeeNum', 'pagibigNum', 'philhealthNum',


    ];
    const missing = requiredFields.filter(field => !newPerson[field]?.trim());
 
    if (missing.length > 0) {
      const fieldList = missing.map(f =>
        f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
      ).join(', ');
 
      setErrorFields(missing); // Step 1: show red borders
 
      // Step 2: scroll to first missing field
      const firstMissingField = missing[0];
      const fieldElement = fieldRefs[firstMissingField];
      if (fieldElement?.scrollIntoView) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.focus();
      }
 
      // Step 3: Delay the modal animation slightly
      setTimeout(() => {
        setErrorMessage(`You need to fill up: ${fieldList}`);
        setModalOpen(true);
        setSlideIn(true);
      }, 50); // allow error fields to render first
 
      // Step 4: Auto-close modal, but DO NOT reset red borders
      setTimeout(() => {
        setSlideIn(false);
        setTimeout(() => setModalOpen(false), 300); // wait for Slide to exit
        setErrorMessage('');
        // DO NOT reset errorFields here — let user fix them manually
      }, 2000);
 
      return;
    }
 
    try {
      await axios.post('http://localhost:5000/personalinfo/person_table', newPerson);
 
      setNewPerson(Object.fromEntries(Object.keys(newPerson).map(k => [k, ''])));
      fetchItems();
 
      setTimeout(() => {
        if (newRecordRef.current) {
          newRecordRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (error) {
      console.error('Add person failed:', error.response?.data || error.message);
      setErrorMessage('Failed to add person. Check console for error.');
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 5000);
    }
  };
 
 
 
 
  const updateItem = async () => {
    if (!editPerson || !editPerson.id) {
      alert("Missing person ID for update.");
      return;
    }
 
    const requiredFields = ['firstName', 'lastName', 'birthDate', 'sex'];
    const missing = requiredFields.filter(field => !editPerson[field]?.trim());
 
    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(', ')}`);
      return;
    }
 
    try {
      await axios.put(`http://localhost:5000/personalinfo/person_table/${editPerson.id}`, editPerson);
      setEditPerson(null);
      fetchItems();
      showSnackbar('Person updated successfully!', 'success'); // Snackbar
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Update failed. Check console for error details.");
    }
  };
 








  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/personalinfo/person_table/${id}`);
    fetchItems();
  };








  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditPerson((prev) => ({ ...prev, [name]: value }));
    } else  {
      setNewPerson((prev) => ({ ...prev, [name]: value }));
    }
  };




 




 




  const renderSection = (groupedFields) => (
    <Box sx={sectionContainerStyle}>
      {groupedFields.map((group, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(90deg, #6D2323, #8B0000)',
              color: '#fff',
              px: 3,
              py: 2,
              borderRadius: '10px',
              mb: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {group.title}
            </Typography>
            {group.subtitle && (
              <Typography variant="body2" sx={{ color: '#FFE' }}>
                {group.subtitle}
              </Typography>
            )}
          </Box>
 
          <Grid container spacing={2} sx={{ padding: '16px' }}>
            {group.fields.map((field, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <TextField
                  fullWidth
                  inputRef={(el) => {
                    if (el) fieldRefs[field] = el;
                  }}
                  error={errorFields.includes(field)}
                  sx={fieldStyle}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  name={field}
                  value={newPerson[field]}
                  onChange={handleInputChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );














 
  return (
   
    <Container sx={{ backgroundColor: '#FEF9E1', padding: '32px', borderRadius: '15px', alignContent:'center', marginTop: '-20px' }}>


  {/* MODAL BEFORE ADDING // RECHECKING ALL INFOS BEFORE ADDING */}


        <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Confirm New Person Details</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {Object.entries(newPerson).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2">
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</strong> {value || '—'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmModalOpen(false)} color="secondary" variant="outlined" style={{ backgroundColor: '#000000', color: 'white' }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setConfirmModalOpen(false);
              addItem(); // Call the original function
              showSnackbar('Person successfully added!', 'success');
            }} color="primary" variant="contained" style={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}>
              Confirm & Add
            </Button>
          </DialogActions>
        </Dialog>


        {/* MODAL END */}




       




 
      {renderSection([
        {
          title: 'Personal Information',
          subtitle: 'Basic details about yourself',
          fields: [
            'firstName', 'middleName', 'lastName', 'nameExtension', 'birthDate', 'placeOfBirth',
            'sex', 'civilStatus', 'citizenship', 'heightCm', 'weightKg', 'bloodType',
            'mobileNum', 'telephone', 'emailAddress',
          ],
        },
        {
          title: 'Government ID Information',
          fields: [
            'gsisNum', 'pagibigNum', 'philhealthNum', 'sssNum', 'tinNum', 'agencyEmployeeNum',
          ],
        },
        {
          title: 'Spouse Information',
          fields: [
            'spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'spouseNameExtension',
            'spouseOccupation', 'spouseEmployerBusinessName', 'spouseBusinessAddress', 'spouseTelephone',
          ],
        },
        {
          title: 'Address Information',
          subtitle: 'Input your Permanent Address',
          fields: [
            'permanent_houseBlockLotNum', 'permanent_streetName', 'permanent_subdivisionOrVillage', 'permanent_barangay',
            'permanent_cityOrMunicipality', 'permanent_provinceName', 'permanent_zipcode',  
          ]
        },
        {
            subtitle: 'Input your Residential Address',
            fields: ['residential_houseBlockLotNum', 'residential_streetName',
            'residential_subdivisionOrVillage', 'residential_barangayName', 'residential_cityOrMunicipality', 'residential_provinceName', 'residential_zipcode',
          ],
        },
        {
          title: "Parents' Information",
          fields: [
            'fatherFirstName', 'fatherMiddleName', 'fatherLastName', 'fatherNameExtension',
            'motherMaidenFirstName', 'motherMaidenMiddleName', 'motherMaidenLastName',
          ],
        },
        {
          title: 'Elementary Education',
          fields: [
            'elementaryNameOfSchool', 'elementaryDegree', 'elementaryPeriodFrom', 'elementaryPeriodTo',
            'elementaryHighestAttained', 'elementaryYearGraduated', 'elementaryScholarshipAcademicHonorsReceived',
          ],
        },
        {
          title: 'Secondary Education',
          fields: [
            'secondaryNameOfSchool', 'secondaryDegree', 'secondaryPeriodFrom', 'secondaryPeriodTo',
            'secondaryHighestAttained', 'secondaryYearGraduated', 'secondaryScholarshipAcademicHonorsReceived',
          ],
        },
      ])}
 
      <Box sx={{ marginTop: 3, marginBottom: 3 }}>
        <Button
          onClick={() => setConfirmModalOpen(true)}
          variant="contained"
          sx={{
            backgroundColor: '#6D2323',
            color: '#FEF9E1',
            width: '100%',
            fontSize: '16px',
            padding: '12px',
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#541818' },
          }}
        >
          <AddIcon sx={{ mr: 1 }} /> Add Person
        </Button>
      </Box>  




      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Slide direction="down" in={slideIn} mountOnEnter>
          <Box sx={{
            position: 'absolute',
            top: '35%',
            left: '40%',
            transform: 'translateX(-50%)',
            bgcolor: '#fff5f5',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            border: '2px solid #d32f2f',
            minWidth: 300,
            maxWidth: 400,
            textAlign: 'center',
          }}>
            <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2 }}>
              ⚠ Missing Required Fields
            </Typography>
            <Typography variant="body1">{errorMessage}</Typography>
          </Box>
        </Slide>
      </Modal>
















<br />
<br />
<br />
            {/* List All Persons */}
            <Box sx={{ marginBottom: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" backgroundColor="#6D2323 " padding={2} borderRadius={1} marginBottom={2}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, fontSize: 50, color: 'white' }} />
                <Typography variant="h5" sx={{ margin: 0, color: '#ffffff', fontWeight: 'bold' }}>
                  Personal Information Records
                </Typography>
              </Box>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: '#6D2323', marginRight:1 }} />
                  ),
                }}
              />
            </Box>




            {filteredData.length === 0 ? (
              <Typography variant="h6" sx={{ color: '#8B0000', textAlign: 'center', marginTop: 2 }}>
                No matching records found.
              </Typography>
                ) : (
                filteredData.map((person, index) => (
                <   Box key={person.id}
                    ref={index === filteredData.length - 1 ? newRecordRef : null}
                    sx={{ marginBottom: 3, padding: 3, border: '1px solid #400000 ', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
           
                        {/* Display Person ID to the Left of the Name */}
                        <Grid container alignItems="center">
                        <Grid item>
                                <Typography variant="h5" color="textSecondary" sx={{ marginRight: 1, marginBottom: '10px', color: '#800000' }}>
                                    {person.id}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" gutterBottom>
                                    | {person.firstName} {person.lastName}
                                </Typography>
                            </Grid>
                        </Grid>
































                        {/* Personal Information Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Personal Information</h3></Typography>
                            <Grid container spacing={2}>
                                {['firstName', 'middleName', 'lastName', 'nameExtension', 'birthDate', 'placeOfBirth', 'sex', 'civilStatus', 'citizenship', 'heightCm', 'weightKg', 'bloodType', 'mobileNum', 'telephone', 'emailAddress'].map((field) => (
                                    <Grid item xs={3} key={field}>
                                        <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                        {editPerson && editPerson.id === person.id ? (
                                            <TextField
                                                fullWidth
                                                name={field}
                                                value={editPerson[field]}
                                                onChange={(e) => handleInputChange(e, true)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1">{person[field]}</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
































                        <Divider sx={{ marginY: 3 }} />
































                        {/* Goverment ID Information Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Goverment ID Information</h3></Typography>
                            <Grid container spacing={2}>
                                {['gsisNum', 'pagibigNum', 'philhealthNum', 'sssNum', 'tinNum', 'agencyEmployeeNum'].map((field) => (
                                    <Grid item xs={3} key={field}>
                                        <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                        {editPerson && editPerson.id === person.id ? (
                                            <TextField
                                                fullWidth
                                                name={field}
                                                value={editPerson[field]}
                                                onChange={(e) => handleInputChange(e, true)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1">{person[field]}</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
































                        <Divider sx={{ marginY: 3 }} />
































                        {/* Spouse Information Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Spouse Information</h3></Typography>
                            <Grid container spacing={2}>
                                {['spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'spouseNameExtension', 'spouseOccupation', 'spouseEmployerBusinessName', 'spouseBusinessAddress', 'spouseTelephone'].map((field) => (
                                    <Grid item xs={3} key={field}>
                                        <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                        {editPerson && editPerson.id === person.id ? (
                                            <TextField
                                                fullWidth
                                                name={field}
                                                value={editPerson[field]}
                                                onChange={(e) => handleInputChange(e, true)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1">{person[field]}</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
































                        <Divider sx={{ marginY: 3 }} />
































                        {/* Address Information Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Address Information</h3></Typography>
                            <Grid container spacing={2}>
                                {['permanent_houseBlockLotNum', 'permanent_streetName', 'permanent_subdivisionOrVillage', 'permanent_barangay', 'permanent_cityOrMunicipality', 'permanent_provinceName', 'permanent_zipcode', 'residential_houseBlockLotNum', 'residential_streetName', 'residential_subdivisionOrVillage', 'residential_barangayName', 'residential_cityOrMunicipality', 'residential_provinceName', 'residential_zipcode'].map((field) => (
                                    <Grid item xs={3} key={field}>
                                        <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                        {editPerson && editPerson.id === person.id ? (
                                            <TextField
                                                fullWidth
                                                name={field}
                                                value={editPerson[field]}
                                                onChange={(e) => handleInputChange(e, true)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1">{person[field]}</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
































                        <Divider sx={{ marginY: 3 }} />
































                        {/* Parents Information Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Parent's Information</h3></Typography>
                            <Grid container spacing={2}>
                                {['fatherFirstName', 'fatherMiddleName', 'fatherLastName', 'fatherNameExtension', 'motherMaidenFirstName', 'motherMaidenMiddleName', 'motherMaidenLastName'].map((field) => (
                                    <Grid item xs={3} key={field}>
                                        <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                        {editPerson && editPerson.id === person.id ? (
                                            <TextField
                                                fullWidth
                                                name={field}
                                                value={editPerson[field]}
                                                onChange={(e) => handleInputChange(e, true)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1">{person[field]}</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
































                        <Divider sx={{ marginY: 3 }} />
































                          {/* Educational Information Section */}
                          <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1"><h3>Educational Information</h3></Typography>
                           
                            {/* Elementary Educational Information */}
                            <Box sx={{ marginBottom: 3 }}>
                                <Typography variant="subtitle2"><h4>Elementary Education</h4></Typography>
                                <Grid container spacing={2}>
                                    {['elementaryNameOfSchool', 'elementaryDegree', 'elementaryPeriodFrom', 'elementaryPeriodTo', 'elementaryHighestAttained', 'elementaryYearGraduated', 'elementaryScholarshipAcademicHonorsReceived'].map((field) => (
                                        <Grid item xs={3} key={field}>
                                            <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                            {editPerson && editPerson.id === person.id ? (
                                                <TextField
                                                    fullWidth
                                                    name={field}
                                                    value={editPerson[field]}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="body1">{person[field]}</Typography>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
































                            {/* Secondary Educational Information */}
                            <Box sx={{ marginBottom: 3 }}>
                                <Typography variant="subtitle2"><h4>Secondary Education</h4></Typography>
                                <Grid container spacing={2}>
                                    {['secondaryNameOfSchool', 'secondaryDegree', 'secondaryPeriodFrom', 'secondaryPeriodTo', 'secondaryHighestAttained', 'secondaryYearGraduated', 'secondaryScholarshipAcademicHonorsReceived'].map((field) => (
                                        <Grid item xs={3} key={field}>
                                            <Typography variant="body2" color="textSecondary">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                            {editPerson && editPerson.id === person.id ? (
                                                <TextField
                                                    fullWidth
                                                    name={field}
                                                    value={editPerson[field]}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="body1">{person[field]}</Typography>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>




                        <Snackbar
                          open={snackbar.open}
                          autoHideDuration={3000}
                          onClose={() => setSnackbar({ ...snackbar, open: false })}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            icon={false}
                            sx={{
                              width: '100%',
                              backgroundColor: '#ffffff',
                              color: '#6D2323',
                              fontWeight: 'bold',
                              boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                              borderRadius: '8px',
                              fontSize: '14px',
                            }}
                            variant="filled"
                          >
                            {snackbar.message}
                          </Alert>
                        </Snackbar>


































































                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {editPerson && editPerson.id === person.id ? (
                            <>
                              <Button
                                onClick={updateItem}
                                variant="contained"
                                style={{
                                  backgroundColor: '#6D2323',
                                  color: '#FEF9E1',
                                  width: '100px',
                                  height: '40px',
                                  marginBottom: '5px',
                                }}
                                startIcon={<SaveIcon />}
                              >
                                Update
                              </Button>
                              <Button
                                onClick={() => setEditPerson(null)}
                                variant="contained"
                                color="secondary"
                                style={{
                                  backgroundColor: 'black',
                                  color: 'white',
                                  width: '100px',
                                  height: '40px',
                                  marginBottom: '5px',
                                  marginLeft: '10px',
                                }}
                                startIcon={<CancelIcon />}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => {
                                  setEditPerson(person);
                                  setEditModalOpen(true);
                                }}
                                variant="contained"
                                style={{
                                  backgroundColor: '#6D2323',
                                  color: '#FEF9E1',
                                  width: '100px',
                                  height: '40px',
                                  marginBottom: '5px',
                                }}
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>


                              <Button
                                onClick={() => {
                                  deleteItem(person.id);
                                  showSnackbar('Person deleted successfully!', 'info');
                                }}
                                variant="contained"
                                color="secondary"
                                style={{
                                  backgroundColor: 'black',
                                  color: 'white',
                                  width: '100px',
                                  height: '40px',
                                  marginBottom: '5px',
                                  marginLeft: '10px',
                                }}
                                startIcon={<DeleteIcon />}
                              >
                                Delete
                              </Button>
                          </>
                        )}
                      </Box>


                    </Box>
                ))
              )}
            </Box>
            <Dialog
  open={isEditModalOpen}
  onClose={() => setEditModalOpen(false)}
  maxWidth="lg"
  fullWidth
>
  <DialogTitle>Edit Person</DialogTitle>
  <DialogContent dividers>
    {editPerson && (
      <>
        <Typography variant="h6" gutterBottom>Personal Information</Typography>
        <Grid container spacing={2} mb={3}>
          {['firstName', 'middleName', 'lastName', 'nameExtension', 'birthDate', 'placeOfBirth', 'sex', 'civilStatus', 'citizenship', 'heightCm', 'weightKg', 'bloodType', 'mobileNum', 'telephone', 'emailAddress'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>




        <Typography variant="h6" gutterBottom>Government ID Information</Typography>
        <Grid container spacing={2} mb={3}>
          {['gsisNum', 'pagibigNum', 'philhealthNum', 'sssNum', 'tinNum', 'agencyEmployeeNum'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>




        <Typography variant="h6" gutterBottom>Spouse Information</Typography>
        <Grid container spacing={2} mb={3}>
          {['spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'spouseNameExtension', 'spouseOccupation', 'spouseEmployerBusinessName', 'spouseBusinessAddress', 'spouseTelephone'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>




        <Typography variant="h6" gutterBottom>Address Information</Typography>
        <Grid container spacing={2} mb={3}>
          {['permanent_houseBlockLotNum', 'permanent_streetName', 'permanent_subdivisionOrVillage', 'permanent_barangay', 'permanent_cityOrMunicipality', 'permanent_provinceName', 'permanent_zipcode', 'residential_houseBlockLotNum', 'residential_streetName', 'residential_subdivisionOrVillage', 'residential_barangayName', 'residential_cityOrMunicipality', 'residential_provinceName', 'residential_zipcode'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>




        <Typography variant="h6" gutterBottom>Parent's Information</Typography>
        <Grid container spacing={2} mb={3}>
          {['fatherFirstName', 'fatherMiddleName', 'fatherLastName', 'fatherNameExtension', 'motherMaidenFirstName', 'motherMaidenMiddleName', 'motherMaidenLastName'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>




        <Typography variant="h6" gutterBottom>Educational Background</Typography>
        <Grid container spacing={2} mb={1}>
          {['elementaryNameOfSchool', 'elementaryDegree', 'elementaryPeriodFrom', 'elementaryPeriodTo', 'elementaryHighestAttained', 'elementaryYearGraduated', 'elementaryScholarshipAcademicHonorsReceived'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {['secondaryNameOfSchool', 'secondaryDegree', 'secondaryPeriodFrom', 'secondaryPeriodTo', 'secondaryHighestAttained', 'secondaryYearGraduated', 'secondaryScholarshipAcademicHonorsReceived'].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={editPerson[field] || ''}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Grid>
          ))}
        </Grid>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        updateItem();
        setEditModalOpen(false);
      }}
      variant="contained"
      style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100px', height: '40px',  }}
      startIcon={<SaveIcon />}
    >
      Save
    </Button>
    <Button
      onClick={() => {
        setEditModalOpen(false);
        setEditPerson(null);
       
      }}
      variant="outlined"
      style={{ width: '100px', height: '40px', marginLeft: '10px' , backgroundColor: 'black', color: 'white' }}
      startIcon={<CancelIcon />}
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>








        </Container>
    );
};



export default PersonTable;

