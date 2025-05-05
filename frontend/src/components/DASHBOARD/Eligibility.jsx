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
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SearchIcon from '@mui/icons-material/Search';
import { Grading } from '@mui/icons-material';

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
  const [searchTerm, setSearchTerm] = useState('');

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
  <FactCheckIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />

  <div>
    <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
      Eligibility Information
    </h4>
    <p style={{ margin: 0, fontSize: '85%' }}>
      Insert Your Eligibility Information
    </p>
  </div>
</div>

  </div>

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={2}
          borderRadius={1}
          marginBottom={2}
        >
          <Box display="flex" alignItems="center">
          <Grading sx={{ color: '#6D2323', marginRight: 2, fontSize:'3rem', }} />
        
            <Typography variant="h5" sx={{ margin: 0, color: '#000000', fontWeight: 'bold' }}  >
              
              Eligibility Records
            </Typography>
          </Box>
        
        
          <TextField
            size="small"
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
          <TableHead>
            <TableRow>
              <TableCell style={{  fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Eligibility Name</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Date of Exam</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Place of Exam</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>License Number</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date of Validity</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Person ID</TableCell>
              <TableCell style={{  fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {data
    .filter((eligibility) => {
      const search = searchTerm.toLowerCase();
      const combinedFields = `${eligibility.eligibilityName || ''} ${eligibility.eligibilityRating || ''} ${eligibility.person_id || ''}`.toLowerCase();
      return combinedFields.includes(search);
    }).length === 0 ? (
    <TableRow>
      <TableCell colSpan={Object.keys(data[0] || {}).length + 1} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
        <Typography variant="h6">No matching records found.</Typography>
      </TableCell>
    </TableRow>
  ) : (
    data
      .filter((eligibility) => {
        const search = searchTerm.toLowerCase();
        const combinedFields = `${eligibility.eligibilityName || ''} ${eligibility.eligibilityRating || ''} ${eligibility.person_id || ''}`.toLowerCase();
        return combinedFields.includes(search);
      })
      .map((eligibility) => (
        <TableRow key={eligibility.id}>
          <TableCell>{eligibility.id}</TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.eligibilityName}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    eligibilityName: e.target.value,
                  })
                }
                fullWidth
              />
            ) : (
              eligibility.eligibilityName
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.eligibilityRating}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    eligibilityRating: e.target.value,
                  })
                }
                type="text"
                fullWidth
              />
            ) : (
              eligibility.eligibilityRating
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.eligibilityDateOfExam}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    eligibilityDateOfExam: e.target.value,
                  })
                }
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            ) : (
              eligibility.eligibilityDateOfExam
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.eligibilityPlaceOfExam}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    eligibilityPlaceOfExam: e.target.value,
                  })
                }
                fullWidth
              />
            ) : (
              eligibility.eligibilityPlaceOfExam
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.licenseNumber}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    licenseNumber: e.target.value,
                  })
                }
                fullWidth
              />
            ) : (
              eligibility.licenseNumber
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.DateOfValidity}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    DateOfValidity: e.target.value,
                  })
                }
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            ) : (
              eligibility.DateOfValidity
            )}
          </TableCell>
          <TableCell>
            {editEligibility && editEligibility.id === eligibility.id ? (
              <TextField
                value={editEligibility.person_id}
                onChange={(e) =>
                  setEditEligibility({
                    ...editEligibility,
                    person_id: e.target.value,
                  })
                }
                type="number"
                fullWidth
              />
            ) : (
              eligibility.person_id
            )}
          </TableCell>
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
      ))
  )}
</TableBody>


        </Table>
      </Paper>
    </Container>
  );
};

export default Eligibility;