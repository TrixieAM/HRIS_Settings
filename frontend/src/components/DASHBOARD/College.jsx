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
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import ReorderIcon from '@mui/icons-material/Reorder';

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
  const [searchTerm, setSearchTerm] = useState('');


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
      <SchoolIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />

        <div>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
            College Information
          </h4>
          <p style={{ margin: 0, fontSize: '85%' }}>
            Insert Your College Information
          </p>
        </div>
      </div>
      
        </div>
      <Container
        sx={{
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          mb: 4,
        }}
      >

       

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
      <div
      style={{
        marginTop: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header and Search */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >

        <Box display="flex" alignItems="center">
          <ReorderIcon sx={{ color: '#6D2323',  fontSize:'2rem', marginRight: 1}} />
        
        <Typography variant="h5" sx={{ color: '#000', fontWeight: 'bold' }}>
          College Records
        </Typography>
        </Box>

        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by Person ID or College Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: 'white', borderRadius: 1, width: '300px' }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: '#6D2323', marginRight: 1 }} />
            ),
          }}
        />
       
      </Box>

      {/* Table */}
      <Table>
        <TableHead sx={{ backgroundColor: '' }}>
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
  {data.filter((college) => {
    const collegeName = college.collegeNameOfSchool?.toLowerCase() || '';
    const personId = college.person_id?.toString() || '';
    const search = searchTerm.toLowerCase();
    return personId.includes(search) || collegeName.includes(search);
  }).length === 0 ? (
    <TableRow>
      <TableCell colSpan={10} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
        <Typography variant="h6">
          No matching records found.
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    data
      .filter((college) => {
        const collegeName = college.collegeNameOfSchool?.toLowerCase() || '';
        const personId = college.person_id?.toString() || '';
        const search = searchTerm.toLowerCase();
        return personId.includes(search) || collegeName.includes(search);
      })
      .map((college) => (
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
      ))
  )}
</TableBody>

      </Table>
    </div>
    </Container>
  );
};

export default College;