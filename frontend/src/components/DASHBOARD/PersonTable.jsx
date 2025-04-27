import React, { useEffect, useState } from 'react';
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
} from '@mui/icons-material';


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


  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/personalinfo/person_table');
    setData(response.data);
  };


  const addItem = async () => {
    try {
      await axios.post('http://localhost:5000/personalinfo/person_table', newPerson);
      setNewPerson(Object.fromEntries(Object.keys(newPerson).map(k => [k, ''])));
      fetchItems();
    } catch (error) {
      console.error('Add person failed:', error.response?.data || error.message);
      alert('Failed to add person. Check console for error.');
    }
  };
 
  const updateItem = async () => {
    if (!editPerson || Object.values(editPerson).some((value) => value === '')) return;
    await axios.put(`http://localhost:5000/personalinfo/person_table/${editPerson.id}`, editPerson);
    setEditPerson(null);
    fetchItems();
  };


  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/personalinfo/person_table/${id}`);
    fetchItems();
  };


  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditPerson((prev) => ({ ...prev, [name]: value }));
    } else {
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
    <Container sx={{ backgroundColor: '#FEF9E1', padding: '32px', borderRadius: '15px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Person Dashboard
      </Typography>
 
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






            {/* List All Persons */}
            <Box sx={{ marginBottom: 3 }}>
                {data.map((person) => (
                <   Box key={person.id} sx={{ marginBottom: 3, padding: 3, border: '1px solid #400000 ', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
           
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
                                    <Button onClick={() => setEditPerson(person)}
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: '#6D2323',
                                        color: '#FEF9E1',
                                        width: '100px',
                                        height: '40px',
                                        marginBottom: '5px',
                                    }}
                                     startIcon={<EditIcon />}>Edit</Button>
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
                ))}
            </Box>
        </Container>
    );
};








export default PersonTable;





















