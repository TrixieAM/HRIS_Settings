import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

const Eligibility = () => {
  const [data, setData] = useState([]);
  const [newEligibility, setNewEligibility] = useState({
    eligibilityName: '',
    eligibilityRating: '',
    eligibilityDateOfExam: '',
    eligibilityPlaceOfExam: '',
    licenseNumber: '',
    DateOfValidity: '',
    person_id: '',
  });
  const [editEligibility, setEditEligibility] = useState(null);

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/eligibilityRoute/eligibility'
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching eligibility:', error);
    }
  };

  const addEligibility = async () => {
    try {
      if (
        !newEligibility.eligibilityName ||
        !newEligibility.eligibilityRating ||
        !newEligibility.eligibilityDateOfExam ||
        !newEligibility.eligibilityPlaceOfExam ||
        !newEligibility.licenseNumber ||
        !newEligibility.DateOfValidity ||
        !newEligibility.person_id
      ) {
        alert('All field are required');
        return;
      } else {
        await axios.post(
          'http://localhost:5000/eligibilityRoute/eligibility',
          newEligibility
        );
      }
      setNewEligibility({
        eligibilityName: '',
        eligibilityRating: '',
        eligibilityDateOfExam: '',
        eligibilityPlaceOfExam: '',
        licenseNumber: '',
        DateOfValidity: '',
        person_id: '',
      });
      fetchEligibility();
    } catch (error) {
      console.error('Error adding eligibility:', error);
    }
  };

  const updateEligibility = async () => {
    if (!editEligibility) return;
    try {
      await axios.put(
        `http://localhost:5000/eligibilityRoute/eligibility/${editEligibility.id}`,
        editEligibility
      );
      setEditEligibility(null);
      fetchEligibility();
    } catch (error) {
      console.error('Error updating eligibility:', error);
    }
  };

  const deleteEligibility = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/eligibilityRoute/eligibility/${id}`
      );
      fetchEligibility();
    } catch (error) {
      console.error('Error deleting eligibility:', error);
    }
  };

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontWeight: 'bold',
          marginTop: '20px',
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '12px 16px',
          borderRadius: '8px',
        }}
      >
        Eligibility
      </Typography>

      {/* Add New Eligibility */}
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px' }}>
        <Grid container spacing={2}>
          {Object.keys(newEligibility).map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                value={newEligibility[key]}
                onChange={(e) =>
                  setNewEligibility({
                    ...newEligibility,
                    [key]: e.target.value,
                  })
                }
                type={key.includes('Date') ? 'date' : 'text'}
                InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                fullWidth
              />
            </Grid>
          ))}
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Box>
              <Button
                onClick={addEligibility}
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: '#6D2323',
                  color: '#FEF9E1',
                  width: '1130px',
                  marginTop: '35px',
                  marginLeft: '-5px',
                }}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Eligibility Table */}
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#6D2323' }}>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Eligibility Name</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Date of Exam</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Place of Exam</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>License Number</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Date of Validity</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Person ID</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((eligibility) => (
              <TableRow key={eligibility.id}>
                <TableCell>{eligibility.id}</TableCell>
                {Object.keys(eligibility)
                  .slice(1, -1)
                  .map((key) => (
                    <TableCell key={key}>
                      {editEligibility && editEligibility.id === eligibility.id ? (
                        <TextField
                          value={editEligibility[key]}
                          onChange={(e) =>
                            setEditEligibility({
                              ...editEligibility,
                              [key]: e.target.value,
                            })
                          }
                          type={key.includes('Date') ? 'date' : 'text'}
                          InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                          fullWidth
                        />
                      ) : (
                        eligibility[key]
                      )}
                    </TableCell>
                  ))}
                <TableCell>
                  {editEligibility && editEligibility.id === eligibility.id ? (
                    <>
                      <Button
                        onClick={updateEligibility}
                        variant="contained"
                        color="primary"
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
                        onClick={() => setEditEligibility(null)}
                        variant="outlined"
                        color="secondary"
                        style={{
                          backgroundColor: 'black',
                          color: 'white',
                          width: '100px',
                          height: '40px',
                          marginBottom: '5px',
                        }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditEligibility(eligibility)}
                        variant="contained"
                        color="primary"
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
                        onClick={() => deleteEligibility(eligibility.id)}
                        variant="contained"
                        style={{
                          backgroundColor: 'black',
                          color: 'white',
                          width: '100px',
                          height: '40px',
                          marginBottom: '5px',
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Eligibility;
