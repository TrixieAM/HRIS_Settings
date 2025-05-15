import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';



const OtherInformation = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInformation, setNewInformation] = useState({
    specialSkills: '',
    nonAcademicDistinctions: '',
    membershipInAssociation: '',
    person_id: ''
  });
  const [editInformation, setEditInformation] = useState(null);

  useEffect(() => {
    fetchInformation();
  }, []);

  const fetchInformation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/OtherInfo/other-information');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching Other Information:', error);
    }
  };

  const addInformation = async () => {
    try {
      await axios.post('http://localhost:5000/OtherInfo/other-information', newInformation);
      setNewInformation({
        specialSkills: '',
        nonAcademicDistinctions: '',
        membershipInAssociation: '',
        person_id: ''
      });
      fetchInformation();
    } catch (error) {
      console.error('Error adding Other Information:', error);
    }
  };

  const updateInformation = async () => {
    if (!editInformation) return;
    try {
      await axios.put(`http://localhost:5000/OtherInfo/other-information/${editInformation.id}`, editInformation);
      setEditInformation(null);
      fetchInformation();
    } catch (error) {
      console.error('Error updating Other Information:', error);
    }
  };

  const deleteInformation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/OtherInfo/other-information/${id}`);
      fetchInformation();
    } catch (error) {
      console.error('Error deleting Other Information:', error);
    }
  };

  const filteredData = data.filter((info) => {
    const search = searchTerm.toLowerCase();
    return (
      info.specialSkills.toLowerCase().includes(search) ||
      info.nonAcademicDistinctions.toLowerCase().includes(search) ||
      info.membershipInAssociation.toLowerCase().includes(search) ||
      info.person_id.toString().includes(search)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 0 }}>
      {/* Form Box with Header */}
              <div
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
          }}
          
        >
      <div style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
      <InfoIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />
      <div>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
            Other Information
          </h4>
          <p style={{ margin: 0, fontSize: '85%' }}>
            Insert Your Other Information
          </p>
        </div>
      </div>
      
        </div>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>


        <Grid container spacing={2}>
          {Object.entries(newInformation).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={value}
                onChange={(e) => setNewInformation({ ...newInformation, [key]: e.target.value })}
                type={key.includes('Date') ? 'date' : 'text'}
                InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                fullWidth
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              onClick={addInformation}
              variant="contained"
              sx={{
                backgroundColor: '#6D2323',
                color: '#FEF9E1',
                '&:hover': {
                  backgroundColor: '#5A1E1E',
                },
                width: '100%',
              }}
              startIcon={<EditIcon />}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Box */}
      <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={2}
          borderRadius={1}
          marginBottom={2}
        >
        <Box display="flex" alignItems="center">
        <InfoIcon  sx={{ color: '#6D2323', marginRight: 2, fontSize:'30px', }} />
      
          <Typography variant="h5" sx={{ margin: 0, color: '#000000', fontWeight: 'bold' }}  >
            Information Records
          </Typography>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search by Employee Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           sx={{ backgroundColor: 'white', borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: '#6D2323', marginRight: 1 }} />
                ),
              }}
        />
        </Box>

        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Special Skills</strong></TableCell>
              <TableCell><strong>Non-Academic Distinctions</strong></TableCell>
              <TableCell><strong>Membership in Association</strong></TableCell>
              <TableCell><strong>Employee Number</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
                  <Typography variant="h6">
                    No matching records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((info) => (
                <TableRow key={info.id}>
                  <TableCell>{info.id}</TableCell>
                  {Object.keys(info).slice(1, -1).map((key) => (
                    <TableCell key={key}>
                      {editInformation && editInformation.id === info.id ? (
                        <TextField
                          value={editInformation[key]}
                          onChange={(e) =>
                            setEditInformation({ ...editInformation, [key]: e.target.value })
                          }
                          fullWidth
                        />
                      ) : (
                        info[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editInformation && editInformation.id === info.id ? (
                      <>
                        <Button
                          onClick={updateInformation}
                          variant="contained"
                          sx={{
                            backgroundColor: '#6D2323',
                            color: '#FEF9E1',
                            mr: 1,
                            mb: 1,
                            '&:hover': {
                              backgroundColor: '#5A1E1E',
                            },
                          }}
                          startIcon={<SaveIcon />}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => setEditInformation(null)}
                          variant="contained"
                          sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            mb: 1,
                            '&:hover': {
                              backgroundColor: '#333',
                            },
                          }}
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setEditInformation(info)}
                          variant="contained"
                          sx={{
                            backgroundColor: '#6D2323',
                            color: '#FEF9E1',
                            mr: 1,
                            mb: 1,
                            '&:hover': {
                              backgroundColor: '#5A1E1E',
                            },
                          }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteInformation(info.id)}
                          variant="contained"
                          sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            mb: 1,
                            '&:hover': {
                              backgroundColor: '#333',
                            },
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default OtherInformation;