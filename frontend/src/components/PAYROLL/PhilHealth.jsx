import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';


const PhilHealthTable = () => {
  const [philhealthData, setPhilhealthData] = useState([]);
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [PhilHealthContribution, setPhilHealthContribution] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    axios.get('http://localhost:5000/api/philhealth')
      .then((response) => {
        setPhilhealthData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the PhilHealth contributions.');
        setLoading(false);
      });
  }, []);


  const handleSubmit = () => {
    const newContribution = { employeeNumber, PhilHealthContribution: parseFloat(PhilHealthContribution) };


    if (editId) {
      axios.put(`http://localhost:5000/api/philhealth/${editId}`, newContribution)
        .then(() => {
          setPhilhealthData(philhealthData.map((item) => (item.id === editId ? { ...item, ...newContribution } : item)));
          resetForm();
        })
        .catch((error) => console.error('Error updating contribution:', error));
    } else {
      axios.post('http://localhost:5000/api/philhealth', newContribution)
        .then(() => {
          setPhilhealthData([...philhealthData, newContribution]);
          resetForm();
        })
        .catch((error) => console.error('Error adding contribution:', error));
    }
  };


  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/philhealth/${id}`)
      .then(() => {
        setPhilhealthData(philhealthData.filter((item) => item.id !== id));
      })
      .catch((error) => console.error('Error deleting contribution:', error));
  };


  const handleEdit = (id) => {
    const contribution = philhealthData.find((item) => item.id === id);
    setEmployeeNumber(contribution.employeeNumber);
    setPhilHealthContribution(contribution.PhilHealthContribution);
    setEditId(id);
  };


  const resetForm = () => {
    setEmployeeNumber('');
    setPhilHealthContribution('');
    setEditId(null);
  };


  // Filter the records based on the search query
  const filteredData = philhealthData.filter((entry) =>
    entry.employeeNumber.includes(searchQuery)
  );


  return (
    <Container maxWidth="xl" sx={{  }}>
      <Paper
        elevation={6}
        sx={{ backgroundColor: 'rgb(109, 35, 35)', color: '#fff', p: 3, borderRadius: 3, borderEndEndRadius: '0', borderEndStartRadius: '0' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <WorkIcon fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              PhilHealth Contributions
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Manage employee PhilHealth contributions
            </Typography>
          </Box>
        </Box>
      </Paper>


      <Box mt={4} sx={{ backgroundColor: '#fff', p: 3, boxShadow: 3, marginBottom: '15px', marginTop: '0px' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {editId ? 'Edit Contribution' : 'Add New Contribution'}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <input
            type="text"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            placeholder="Employee Number"
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <input
            type="text"
            value={PhilHealthContribution}
            onChange={(e) => setPhilHealthContribution(e.target.value)}
            placeholder="PhilHealth Contribution"
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6D2323', // Maroon for primary button
              '&:hover': {
                backgroundColor: '#B22222', // Lighter Maroon on hover
              },
              padding: '10px',
              fontSize: '16px',
            }}
            onClick={handleSubmit}
          >
            {editId ? 'Update Contribution' : 'Add Contribution'}
          </Button>
        </Box>
      </Box>


      {/* Search Section */}
       <TextField
        size="small"
        variant="outlined"
        placeholder="Search by Employee Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ backgroundColor: 'white', borderRadius: 1, marginLeft: '870px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#6D2323', marginRight: 1 }} />
            </InputAdornment>
          ),
        }}
      />


      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>PhilHealth Contribution</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.employeeNumber}</TableCell>
                      <TableCell>{parseFloat(entry.PhilHealthContribution).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: '#6D2323', // Maroon
                            '&:hover': {
                              backgroundColor: '#B22222', // Lighter Maroon (for hover)
                            },
                            marginRight: '8px',
                          }}
                          onClick={() => handleEdit(entry.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            bgcolor: '#000000',
                            borderColor: '#D3D3D3',
                            color: '#ffffff',
                            '&:hover': {
                              borderColor: '#D3D3D3',
                            },
                          }}
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: 'red' }}>
                      No PhilHealth contributions available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};


export default PhilHealthTable;
 

