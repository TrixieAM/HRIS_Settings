import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Maroon Header */}
      <Paper
        elevation={3}
        style={{
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '10px 20px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5" align="left" style={{ fontWeight: 'bold' }}>
          Work Experience Dashboard
        </Typography>
      </Paper>

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

        {/* Work Experience Table */}
        <Box mt={5}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#6D2323' }}>
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
                  <TableCell key={header} sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {workExperiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{exp.id}</TableCell>
                  {editingWorkExperienceId === exp.id ? (
                    <>
                      {[
                        'workDateFrom',
                        'workDateTo',
                        'workPositionTitle',
                        'workCompany',
                        'workMonthlySalary',
                        'SalaryJobOrPayGrade',
                        'StatusOfAppointment',
                        'person_id',
                      ].map((field) => (
                        <TableCell key={field}>
                          <TextField
                            fullWidth
                            type={field.includes('Date') ? 'date' : 'text'}
                            value={editWorkExperienceData[field] || ''}
                            onChange={(e) =>
                              setEditWorkExperienceData({ ...editWorkExperienceData, [field]: e.target.value })
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          onClick={updateWorkExperience}
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', mr: 1 }}
                          startIcon={<SaveIcon />}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingWorkExperienceId(null)}
                          variant="outlined"
                          size="small"
                          sx={{ color: 'black', borderColor: 'black' }}
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
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
                            setEditWorkExperienceData(exp);
                            setEditingWorkExperienceId(exp.id);
                          }}
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', mr: 1 }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteWorkExperience(exp.id)}
                          variant="outlined"
                          size="small"
                          sx={{ color: 'black', borderColor: 'black' }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default WorkExperience;
