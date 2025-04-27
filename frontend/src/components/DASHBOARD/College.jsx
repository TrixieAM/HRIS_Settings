import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const College = () => {
  const [data, setData] = useState([]);
  const [newCollege, setNewCollege] = useState({
    collegeNameOfSchool: '',
    collegeDegree: '',
    collegePeriodFrom: '',
    collegePeriodTo: '',
    collegeHighestAttained: '',
    collegeYearGraduated: '',
    collegeScholarshipAcademicHonorsReceived: '',
    person_id: '',
  });
  const [editCollege, setEditCollege] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/college/college-table');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5000/college/college-table', newCollege);
      setNewCollege({
        collegeNameOfSchool: '',
        collegeDegree: '',
        collegePeriodFrom: '',
        collegePeriodTo: '',
        collegeHighestAttained: '',
        collegeYearGraduated: '',
        collegeScholarshipAcademicHonorsReceived: '',
        person_id: '',
      });
      fetchColleges();
    } catch (err) {
      console.error('Error adding data:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/college/college-table/${editCollege.id}`, editCollege);
      setEditCollege(null);
      fetchColleges();
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/college/college-table/${id}`);
      fetchColleges();
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const handleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditCollege({ ...editCollege, [field]: value });
    } else {
      setNewCollege({ ...newCollege, [field]: value });
    }
  };

  const inputStyle = { marginRight: 10, marginBottom: 10, width: 324.25 };

  return (
    <Container sx={{ mt: 4 }}>
      <Container
        sx={{
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
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
          }}
        >
          College Dashboard
        </Typography>
       

        <TextField label="College Name" value={newCollege.collegeNameOfSchool} onChange={(e) => handleChange('collegeNameOfSchool', e.target.value)} style={inputStyle} />
        <TextField label="Degree" value={newCollege.collegeDegree} onChange={(e) => handleChange('collegeDegree', e.target.value)} style={inputStyle} />
        <TextField label="Period From" value={newCollege.collegePeriodFrom} onChange={(e) => handleChange('collegePeriodFrom', e.target.value)} style={inputStyle} />
        <TextField label="Period To" value={newCollege.collegePeriodTo} onChange={(e) => handleChange('collegePeriodTo', e.target.value)} style={inputStyle} />
        <TextField label="Highest Attained" value={newCollege.collegeHighestAttained} onChange={(e) => handleChange('collegeHighestAttained', e.target.value)} style={inputStyle} />
        <TextField label="Year Graduated" value={newCollege.collegeYearGraduated} onChange={(e) => handleChange('collegeYearGraduated', e.target.value)} style={inputStyle} />
        <TextField label="Honors Received" value={newCollege.collegeScholarshipAcademicHonorsReceived} onChange={(e) => handleChange('collegeScholarshipAcademicHonorsReceived', e.target.value)} style={inputStyle} />
        <TextField label="Person ID" value={newCollege.person_id} onChange={(e) => handleChange('person_id', e.target.value)} style={inputStyle} />
        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            mt: 3,
            width: '100%',
            backgroundColor: '#6D2323',
            color: '#FEF9E1',
            '&:hover': { backgroundColor: '#5a1d1d' },
          }}
        >
          Add
        </Button>
      </Container>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>College Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Degree</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Period From</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Period To</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Highest Attained</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Year Graduated</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Honors Received</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Person ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((college) => (
            <TableRow key={college.id}>
              <TableCell>{college.id}</TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegeNameOfSchool} onChange={(e) => handleChange('collegeNameOfSchool', e.target.value, true)} />
                ) : (
                  college.collegeNameOfSchool
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegeDegree} onChange={(e) => handleChange('collegeDegree', e.target.value, true)} />
                ) : (
                  college.collegeDegree
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegePeriodFrom} onChange={(e) => handleChange('collegePeriodFrom', e.target.value, true)} />
                ) : (
                  college.collegePeriodFrom
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegePeriodTo} onChange={(e) => handleChange('collegePeriodTo', e.target.value, true)} />
                ) : (
                  college.collegePeriodTo
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegeHighestAttained} onChange={(e) => handleChange('collegeHighestAttained', e.target.value, true)} />
                ) : (
                  college.collegeHighestAttained
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegeYearGraduated} onChange={(e) => handleChange('collegeYearGraduated', e.target.value, true)} />
                ) : (
                  college.collegeYearGraduated
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.collegeScholarshipAcademicHonorsReceived} onChange={(e) => handleChange('collegeScholarshipAcademicHonorsReceived', e.target.value, true)} />
                ) : (
                  college.collegeScholarshipAcademicHonorsReceived
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField value={editCollege.person_id} onChange={(e) => handleChange('person_id', e.target.value, true)} />
                ) : (
                  college.person_id
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <>
                    <Button onClick={handleUpdate} variant="contained" startIcon={<SaveIcon />} sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: 100, mr: 1, mb: 1 }}>
                      Update
                    </Button>
                    <Button onClick={() => setEditCollege(null)} variant="outlined" startIcon={<CancelIcon />} sx={{ backgroundColor: 'black', color: 'white', width: 100, mb: 1 }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditCollege(college)} variant="outlined" startIcon={<EditIcon />} sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: 100, mr: 1, mb: 1 }}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(college.id)} variant="outlined" startIcon={<DeleteIcon />} sx={{ backgroundColor: 'black', color: 'white', width: 100, mb: 1 }}>
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default College;
