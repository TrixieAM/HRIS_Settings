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
  School as SchoolIcon,
  Search as SearchIcon,
} from '@mui/icons-material';


const GraduateTable = () => {
  const [graduateData, setGraduateData] = useState([]);
  const [form, setForm] = useState({
    person_id: '',
    graduateNameOfSchool: '',
    graduateDegree: '',
    graduatePeriodFrom: '',
    graduatePeriodTo: '',
    graduateHighestAttained: '',
    graduateYearGraduated: '',
    graduateScholarshipAcademicHonorsReceived: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');


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
        graduateNameOfSchool: '',
        graduateDegree: '',
        graduatePeriodFrom: '',
        graduatePeriodTo: '',
        graduateHighestAttained: '',
        graduateYearGraduated: '',
        graduateScholarshipAcademicHonorsReceived: '',
      });
      fetchGraduateData();
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };


  const handleEdit = (row) => {
    setEditData(row);
    setEditingId(row.id);
  };


  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/GraduateRoute/graduate-table/${editingId}`, editData);
      setEditingId(null);
      fetchGraduateData();
    } catch (err) {
      console.error('Update failed:', err);
    }
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
    <Container style={{ backgroundColor: '#FEF9E1', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#6D2323',
        color: 'white',
        padding: '20px',
        borderRadius: '8px 8px 0 0'
      }}>
        <Box display="flex" alignItems="center">
          <SchoolIcon sx={{ fontSize: '3rem', marginRight: 2 }} />
          <div>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Graduate Studies Information
            </Typography>
            <Typography variant="body2">
              Insert Your Graduate Studies Information
            </Typography>
          </div>
        </Box>
      </div>


      {/* Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '0 0 8px 8px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}>
        {Object.entries(form).map(([key, value], index) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={value}
            onChange={handleChange}
            style={{
              width: '300px',
              marginRight: '10px',
              marginBottom: '20px',
              marginLeft: index % 1 === 0 ? '50px' : '10px'
            }}
          />
        ))}


        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={editingId ? <SaveIcon /> : <AddIcon />}
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            width: '940px',
            marginTop: '20px',
            marginLeft: '80px'
          }}
        >
          {editingId ? 'Update' : 'Add'}
        </Button>
      </div>


      {/* Table + Search */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box display="flex" alignItems="center">
            <SchoolIcon sx={{ color: '#6D2323', fontSize: '2.5rem', mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000' }}>
              Graduate Records
            </Typography>
          </Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Employee No. or School"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#6D2323', mr: 1 }} />
            }}
          />
        </Box>


        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
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
            {graduateData.filter((row) => {
              const search = searchTerm.toLowerCase();
              return (
                row.person_id?.toString().includes(search) ||
                row.graduateNameOfSchool?.toLowerCase().includes(search)
              );
            }).length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="h6" color="error">No matching records found.</Typography>
                </TableCell>
              </TableRow>
            ) : graduateData
              .filter((row) => {
                const search = searchTerm.toLowerCase();
                return (
                  row.person_id?.toString().includes(search) ||
                  row.graduateNameOfSchool?.toLowerCase().includes(search)
                );
              })
              .map((row) => (
                <TableRow key={row.id}>
                  {editingId === row.id ? (
                    <>
                      <TableCell>{row.person_id}</TableCell>
                      <TableCell><TextField value={editData.graduateNameOfSchool} onChange={(e) => setEditData({ ...editData, graduateNameOfSchool: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduateDegree} onChange={(e) => setEditData({ ...editData, graduateDegree: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduatePeriodFrom} onChange={(e) => setEditData({ ...editData, graduatePeriodFrom: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduatePeriodTo} onChange={(e) => setEditData({ ...editData, graduatePeriodTo: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduateHighestAttained} onChange={(e) => setEditData({ ...editData, graduateHighestAttained: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduateYearGraduated} onChange={(e) => setEditData({ ...editData, graduateYearGraduated: e.target.value })} /></TableCell>
                      <TableCell><TextField value={editData.graduateScholarshipAcademicHonorsReceived} onChange={(e) => setEditData({ ...editData, graduateScholarshipAcademicHonorsReceived: e.target.value })} /></TableCell>
                      <TableCell>
                        <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', mb: 1, mr: 1 }} startIcon={<SaveIcon />}>Update</Button>
                        <Button onClick={() => setEditingId(null)} variant="contained" sx={{ backgroundColor: 'black', color: '#fff' }} startIcon={<CancelIcon />}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.person_id}</TableCell>
                      <TableCell>{row.graduateNameOfSchool}</TableCell>
                      <TableCell>{row.graduateDegree}</TableCell>
                      <TableCell>{row.graduatePeriodFrom}</TableCell>
                      <TableCell>{row.graduatePeriodTo}</TableCell>
                      <TableCell>{row.graduateHighestAttained}</TableCell>
                      <TableCell>{row.graduateYearGraduated}</TableCell>
                      <TableCell>{row.graduateScholarshipAcademicHonorsReceived}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button onClick={() => handleEdit(row)} variant="contained" sx={{ backgroundColor: '#6D2323', color: '#FEF9E1' }} startIcon={<EditIcon />}>Edit</Button>
                          <Button onClick={() => handleDelete(row.id)} variant="contained" sx={{ backgroundColor: 'black', color: '#fff' }} startIcon={<DeleteIcon />}>Delete</Button>
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};


export default GraduateTable;



