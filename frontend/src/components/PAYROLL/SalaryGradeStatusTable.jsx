import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Container,
  Typography,
} from '@mui/material';

const SalaryGradeStatusTable = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    effectivityDate: '',
    step_number: '',
    status: '1',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const response = await axios.get('http://localhost:5000/api/salary-grade-status');
    setRecords(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ effectivityDate: '', step_number: '', status: '1' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.effectivityDate || !form.step_number) {
      alert('All fields are required');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/salary-grade-status/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/salary-grade-status', form);
      }
      fetchRecords();
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/salary-grade-status/${id}`);
    fetchRecords();
  };

  return (
    <Container>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        Salary Grade Status Management
      </Typography>

      {/* Form */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <Box display="flex" flexWrap="wrap" gap={2} marginBottom={2}>
          <TextField
            name="effectivityDate"
            label="Effectivity Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.effectivityDate}
            onChange={handleChange}
            sx={{ width: '30%' }}
          />
          <TextField
            name="step_number"
            label="Step Number"
            value={form.step_number}
            onChange={handleChange}
            sx={{ width: '30%' }}
          />
          <Select
            name="status"
            value={form.status}
            onChange={handleChange}
            sx={{ width: '30%' }}
          >
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </Select>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#6D2323',
              '&:hover': { backgroundColor: '#9C2A2A' },
              height: '55px',
            }}
          >
            {editingId ? 'Update' : 'Add'}
          </Button>
          {editingId && (
            <Button
              onClick={resetForm}
              variant="contained"
              color="error"
              sx={{ height: '55px' }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: '#6D2323' }}>
              {['ID', 'Effectivity Date', 'Step Number', 'Status', 'Actions'].map((header) => (
                <TableCell key={header} style={{ color: '#000000', fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.effectivityDate}</TableCell>
                <TableCell>{record.step_number}</TableCell>
                <TableCell>{record.status === '1' ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(record)}
                    variant="contained"
                    sx={{
                      backgroundColor: '#6D2323',
                      color: '#FEF9E1',
                      '&:hover': { backgroundColor: '#9C2A2A' },
                      marginRight: '8px',
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(record.id)}
                    variant="contained"
                    sx={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#333333' },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SalaryGradeStatusTable;
