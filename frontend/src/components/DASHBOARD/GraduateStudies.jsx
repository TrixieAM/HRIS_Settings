import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
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


const GraduateTable = () => {
  const [graduateData, setGraduateData] = useState([]);
  const [form, setForm] = useState({
    person_id: '',
    SchoolName: '',
    Degree: '',
    graduatePeriodFrom: '',
    graduatePeriodTo: '',
    HighestAttained: '',
    YearGraduated: '',
    ScholarshipAcademicHonorsReceived: ''
  });
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    fetchGraduateData();
  }, []);


  const fetchGraduateData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/GraduateRoute/graduate-table");
      setGraduateData(res.data);
    } catch (err) {
      console.error('Error fetching graduate data:', err);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/GraduateRoute/graduate-table/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/GraduateRoute/graduate-table', form);
      }
      setForm({
        person_id: '',
        SchoolName: '',
        Degree: '',
        graduatePeriodFrom: '',
        graduatePeriodTo: '',
        HighestAttained: '',
        YearGraduated: '',
        ScholarshipAcademicHonorsReceived: ''
      });
      fetchGraduateData();
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };


  const handleEdit = (grad) => {
    setForm(grad);
    setEditingId(grad.id);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/GraduateRoute/graduate-table/${id}`);
      fetchGraduateData();
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };


 


  return (
    <Container>
      <Paper elevation={3} style={{ padding: 10, marginTop: 10 }}>
      <div
    style={{
      backgroundColor: '#6D2323',
      color: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
      <SchoolIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />

        <div>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
            Graduate Studies Information
          </h4>
          <p style={{ margin: 0, fontSize: '85%' }}>
            Insert Your Graduate Studies Information
          </p>
        </div>
      </div>
  </div>
        <Divider style={{ marginBottom: 20 }} />
        <Grid container spacing={2}>
          {Object.keys(form).map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color={editingId ? 'success' : 'primary'}
              onClick={handleSubmit}
              startIcon={editingId ? <SaveIcon /> : <AddIcon />}
              sx={{
                mt: 3,
                width: '100%',
                backgroundColor: '#6D2323',
                color: '#FEF9E1',
                '&:hover': { backgroundColor: '#5a1d1d' },
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </Button>
            {editingId && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    person_id: '',
                    SchoolName: '',
                    Degree: '',
                    graduatePeriodFrom: '',
                    graduatePeriodTo: '',
                    HighestAttained: '',
                    YearGraduated: '',
                    ScholarshipAcademicHonorsReceived: ''
                  });
                }}
                startIcon={<CancelIcon />}
                sx={{
                    mt: 1,
                    width: '100%',
                    backgroundColor: 'black',
                    color: '#FEF9E1',
                    '&:hover': { backgroundColor: 'black' },
                  }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>


      <Paper elevation={3} style={{ marginTop: 30 }}>

        <Typography
        variant="h5"
        sx={{
            backgroundColor: '#6D2323',
            color: '#FFFFFF',
            p: 3,
            borderRadius: 2,
            mb: 3,
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            letterSpacing: 1,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
        }}
        >
        <SchoolIcon sx={{ fontSize: '2rem', marginRight: '12px' }} />
        Graduate Records
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Person ID</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Graduated</TableCell>
              <TableCell>Scholarship</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {graduateData.map((grad) => (
              <TableRow key={grad.id}>
                <TableCell>{grad.person_id}</TableCell>
                <TableCell>{grad.SchoolName}</TableCell>
                <TableCell>{grad.Degree}</TableCell>
                <TableCell>{grad.graduatePeriodFrom}</TableCell>
                <TableCell>{grad.graduatePeriodTo}</TableCell>
                <TableCell>{grad.HighestAttained}</TableCell>
                <TableCell>{grad.YearGraduated}</TableCell>
                <TableCell>{grad.ScholarshipAcademicHonorsReceived}</TableCell>
                <TableCell>
                <Button
                    onClick={() => handleEdit(grad)}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: 100, mr: 1, mb: 1 }}
                    >
                    Edit
                    </Button>
                    <Button
                    onClick={() => handleDelete(grad.id)}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    sx={{ backgroundColor: 'black', color: 'white', width: 100, mb: 1 }}
                    >
                    Delete
                    </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};


export default GraduateTable;



