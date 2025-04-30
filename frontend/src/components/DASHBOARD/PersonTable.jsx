import React, { useEffect, useState, useRef } from 'react';
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




 




  const addItem = async () => {


    const requiredFields = ['firstName', 'lastName', 'birthDate', 'sex'];
    const missing = requiredFields.filter(field => !newPerson[field]?.trim());
   
    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(', ')}`);
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
      alert('Failed to add person. Check console for error.');
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
                  sx={fieldStyle}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  name={field}
                  value={newPerson[field]}
                  onChange={(e) => handleInputChange(e)}
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
          onClick={addItem}
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






<br />
<br />
<br />
            {/* List All Persons */}
            <Box sx={{ marginBottom: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" backgroundColor="#E5D0AC " padding={2} borderRadius={1} marginBottom={2}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, fontSize: 50 }} />
                <Typography variant="h5" sx={{ margin: 0, color: '#6D2323', fontWeight: 'bold' }}>
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
































                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {editPerson && editPerson.id === person.id ? (
                                <>
                                    <Button onClick={updateItem} variant="contained"
                                    color="primary"
                                    style={{
                                        backgroundColor: '#6D2323',
                                        color: '#FEF9E1',
                                        width: '100px',
                                        height: '40px',
                                        marginBottom: '5px',
                                    }}
                                     startIcon={<SaveIcon />}>Update</Button>
                                <Button onClick={() => setEditPerson(null)}
                                variant="contained"
                                color="secondary"
                                style={{ backgroundColor: 'black',
                                    color: 'white',
                                    width: '100px',
                                    height: '40px',
                                    marginBottom: '5px',
                                    marginLeft: '10px',
                                }}
                                startIcon={<CancelIcon />}>
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


                        <Button onClick={() => deleteItem(person.id)}
                        variant="contained"
                        color="secondary"
                        style={{ backgroundColor: 'black',
                        color: 'white',
                        width: '100px',
                        height: '40px',
                        marginBottom: '5px',
                        marginLeft: '10px', }} startIcon={<DeleteIcon />}>Delete</Button>
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
      style={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}
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
      color="secondary"
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













































