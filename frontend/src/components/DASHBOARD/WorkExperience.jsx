import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@mui/material';

import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';

const WorkExperience = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [newWorkExperience, setNewWorkExperience] = useState({
    workDateFrom: '',
    workDateTo: '',
    workPositionTitle: '',
    workCompany: '',
    workMonthlySalary: '',
    SalaryJobOrPayGrade: '',
    StatusOfAppointment: '',
    isGovtService: '',
    person_id: '',
  });
  const [editingWorkExperienceId, setEditingWorkExperienceId] = useState(null);
  const [editWorkExperienceData, setEditWorkExperienceData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const result = await axios.get('http://localhost:5000/WorkExperienceRoute/work-experience-table');
      setWorkExperiences(result.data);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
    }
  };

  const updateWorkExperience = async () => {
    try {
      await axios.put(
        `http://localhost:5000/WorkExperienceRoute/work-experience-table/${editingWorkExperienceId}`,
        editWorkExperienceData
      );
      setEditingWorkExperienceId(null);
      fetchWorkExperiences();
    } catch (error) {
      console.error('Failed to update work experience:', error);
    }
  };

  const deleteWorkExperience = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/WorkExperienceRoute/work-experience-table/${id}`);
      fetchWorkExperiences();
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  const filteredWorkExperiences = workExperiences.filter((exp) =>
    exp.person_id.toString().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Maroon Header */}

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
        <WorkHistoryIcon sx={{ fontSize: '40px', marginRight: '10px' }} />
      <div>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
            Work Experience
          </h4>
          <p style={{ margin: 0, fontSize: '85%' }}>
            Insert Your Work Experience
          </p>
        </div>
      </div>
      
        </div>
      {/* Form and Table Container */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
        {/* Add New Work Experience */}
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {[
              { label: 'From (YYYY/MM/DD)', key: 'workDateFrom' },
              { label: 'To (YYYY/MM/DD)', key: 'workDateTo' },
              { label: 'Position Title', key: 'workPositionTitle' },
              { label: 'Company', key: 'workCompany' },
              { label: 'Monthly Salary', key: 'workMonthlySalary' },
              { label: 'Salary Job/Pay Grade', key: 'SalaryJobOrPayGrade' },
              { label: 'Status of Appointment', key: 'StatusOfAppointment' },
              { label: 'Person ID', key: 'person_id' },
            ].map(({ label, key }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <TextField
                  label={label}
                  fullWidth
                  value={newWorkExperience[key]}
                  onChange={(e) => setNewWorkExperience({ ...newWorkExperience, [key]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: '#6D2323',
              color: '#FEF9E1',
              '&:hover': { backgroundColor: '#5a1c1c' },
              width: '100%',
            }}
            startIcon={<AddIcon />}
            onClick={async () => {
              await axios.post('http://localhost:5000/WorkExperienceRoute/work-experience-table', newWorkExperience);
              fetchWorkExperiences();
              setNewWorkExperience({
                workDateFrom: '',
                workDateTo: '',
                workPositionTitle: '',
                workCompany: '',
                workMonthlySalary: '',
                SalaryJobOrPayGrade: '',
                StatusOfAppointment: '',
                isGovtService: '',
                person_id: '',
              });
            }}
          >
            Add Work Experience
          </Button>
        </Box>
        </Paper>
        <Paper elevation={3} sx={{ mt: 10, p: 3, borderRadius: 2 }}>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    padding={2}
    borderRadius={1}
    marginBottom={2}
  >
    <Box display="flex" alignItems="center">
      <WorkOutlineIcon sx={{ color: '#6D2323', marginRight: 2, fontSize: '30px' }} />
      <Typography variant="h5" sx={{ margin: 0, color: '#000000', fontWeight: 'bold' }}>
        Work Experience Records
      </Typography>
    </Box>

    <TextField
      variant="outlined"
      placeholder="Search by Person ID"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ backgroundColor: 'white', borderRadius: 1 }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: '#6D2323', marginRight: 1 }} />,
      }}
    />
  </Box>

  <Table>
    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
      <TableRow>
        {[
          'ID',
          'From',
          'To',
          'Position Title',
          'Company',
          'Monthly Salary',
          'Salary Job/Pay Grade',
          'Status of Appointment',
          'Person ID',
          'Actions',
        ].map((header) => (
          <TableCell key={header}>
            <strong>{header}</strong>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredWorkExperiences.length === 0 ? (
        <TableRow>
          <TableCell colSpan={10} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
            <Typography variant="h6">No matching records found.</Typography>
          </TableCell>
        </TableRow>
      ) : (
        filteredWorkExperiences.map((exp) => (
<TableRow key={exp.id}>
  <TableCell>{exp.id}</TableCell>
  <TableCell>{exp.workDateFrom}</TableCell>
  <TableCell>{exp.workDateTo}</TableCell>
  <TableCell>{exp.workPositionTitle}</TableCell>
  <TableCell>{exp.workCompany}</TableCell>
  <TableCell>{exp.workMonthlySalary}</TableCell>
  <TableCell>{exp.SalaryJobOrPayGrade}</TableCell>
  <TableCell>{exp.StatusOfAppointment}</TableCell>
  <TableCell>{exp.person_id}</TableCell>
  <TableCell>
    <Button
      onClick={() => {
        setEditWorkExperienceData(exp); // Set data for editing in modal
        setEditingWorkExperienceId(exp.id); // Set the ID of the work experience being edited
        setIsEditModalOpen(true); // Open the modal
      }}
      variant="contained"
      sx={{
        backgroundColor: '#6D2323',
        width: '100px',
        color: '#FEF9E1',
        mr: 1,
        mb: 1,
        '&:hover': { backgroundColor: '#5A1E1E' },
      }}
      startIcon={<EditIcon />}
    >
      Edit
    </Button>

    <Button
      onClick={() => deleteWorkExperience(exp.id)}
      variant="contained"
      sx={{
        backgroundColor: 'black',
        color: 'white',
        mb: 1,
        '&:hover': { backgroundColor: '#333' },
      }}
      startIcon={<DeleteIcon />}
    >
      Delete
    </Button>
  </TableCell>
</TableRow>

        ))
      )}
    </TableBody>
  </Table>
</Paper>

<Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6" mb={2}>Edit Work Experience</Typography>

    <Grid container spacing={2}>
      {[
        { label: 'From', key: 'workDateFrom' },
        { label: 'To', key: 'workDateTo' },
        { label: 'Position Title', key: 'workPositionTitle' },
        { label: 'Company', key: 'workCompany' },
        { label: 'Monthly Salary', key: 'workMonthlySalary' },
        { label: 'Salary Job/Pay Grade', key: 'SalaryJobOrPayGrade' },
        { label: 'Status of Appointment', key: 'StatusOfAppointment' },
        { label: 'Person ID', key: 'person_id' },
      ].map(({ label, key }) => (
        <Grid item xs={12} sm={6} key={key}>
          <TextField
            fullWidth
            label={label}
            value={editWorkExperienceData[key] || ''}
            onChange={(e) =>
              setEditWorkExperienceData({ ...editWorkExperienceData, [key]: e.target.value })
            }
          />
        </Grid>
      ))}
    </Grid>

    <Box mt={3} display="flex" justifyContent="flex-end">
      <Button
        onClick={() => {
          updateWorkExperience();
          setIsEditModalOpen(false);
        }}
        variant="contained"
        sx={{ mr: 2, backgroundColor: '#6D2323', color: '#FEF9E1', width: '100px' }}
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
      <Button
        onClick={() => setIsEditModalOpen(false)}
        variant="contained"
        sx={{ backgroundColor: '#000000', color: 'white', width: '100px' }}
        startIcon={<CancelIcon />}
      >
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>


    </Container>
  );
};

export default WorkExperience;