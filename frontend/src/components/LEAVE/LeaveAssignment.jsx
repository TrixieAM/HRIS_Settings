import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Search, EventNote,
  Reorder as ReorderIcon
} from '@mui/icons-material';

const LeaveAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    leave_code: '',
    employeeNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const filteredAssignments = assignments.filter((item) =>
    item.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.leave_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAssignments();
    fetchLeaveTypes();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_assignment');
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_table');
      setLeaveTypes(res.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const isDuplicateAssignment = (employeeNumber, leaveCode, excludeId = null) => {
    return assignments.some(assignment => 
      assignment.employeeNumber === employeeNumber && 
      assignment.leave_code === leaveCode &&
      assignment.id !== excludeId
    );
  };

  const addAssignment = async () => {
    try {
      setError('');
      
      // Check for duplicate assignment
      if (isDuplicateAssignment(newAssignment.employeeNumber, newAssignment.leave_code)) {
        setError('This employee already has this leave type assigned');
        return;
      }

      await axios.post('http://localhost:5000/leaveRoute/leave_assignment', newAssignment);
      fetchAssignments();
      setNewAssignment({ leave_code: '', employeeNumber: '' });
    } catch (error) {
      console.error('Error adding data:', error);
      setError('Failed to add leave assignment');
    }
  };

  const updateAssignment = async () => {
    try {
      setError('');

      // Check for duplicate assignment
      if (isDuplicateAssignment(editData.employeeNumber, editData.leave_code, editingId)) {
        setError('This employee already has this leave type assigned');
        return;
      }

      // Get the original assignment
      const originalAssignment = assignments.find(a => a.id === editingId);
      if (!originalAssignment) return;

      // Update the assignment
      await axios.put(`http://localhost:5000/leaveRoute/leave_assignment/${editingId}`, editData);

      // Update related leave requests
      const leaveRequests = await axios.get('http://localhost:5000/leaveRoute/leave_request');
      const relatedRequests = leaveRequests.data.filter(
        request => request.employeeNumber === originalAssignment.employeeNumber && 
                  request.leave_code === originalAssignment.leave_code
      );

      // Update each related request
      for (const request of relatedRequests) {
        await axios.put(`http://localhost:5000/leaveRoute/leave_request/${request.id}`, {
          ...request,
          employeeNumber: editData.employeeNumber,
          leave_code: editData.leave_code
        });
      }

      setOpenEditModal(false);
      setEditingId(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update leave assignment');
    }
  };

  const deleteAssignment = async (id) => {
    try {
      // First, get the assignment details
      const assignment = assignments.find(a => a.id === id);
      if (!assignment) return;

      // Delete the assignment
      await axios.delete(`http://localhost:5000/leaveRoute/leave_assignment/${id}`);

      // Delete related leave requests
      const leaveRequests = await axios.get('http://localhost:5000/leaveRoute/leave_request');
      const relatedRequests = leaveRequests.data.filter(
        request => request.employeeNumber === assignment.employeeNumber && 
                  request.leave_code === assignment.leave_code
      );

      // Delete each related request
      for (const request of relatedRequests) {
        await axios.delete(`http://localhost:5000/leaveRoute/leave_request/${request.id}`);
      }

      fetchAssignments();
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Failed to delete leave assignment');
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
          <EventNote sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
              Leave Assignment
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Manage Employee Leave Assignments
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Employee Number"
            value={newAssignment.employeeNumber}
            onChange={(e) => setNewAssignment({ ...newAssignment, employeeNumber: e.target.value })}
            style={inputStyle}
            required
          />

          <FormControl sx={{ minWidth: 324.25, mb: 2 }} required>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={newAssignment.leave_code}
              label="Leave Type"
              onChange={(e) => setNewAssignment({ ...newAssignment, leave_code: e.target.value })}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type.id} value={type.leave_code}>
                  {type.leave_description} ({type.leave_code}) - {type.leave_hours} hours
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          onClick={addAssignment}
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <ReorderIcon sx={{ color: '#6D2323', fontSize: '2rem', marginRight: 1 }} />
            <Typography variant="h5" sx={{ color: '#000', fontWeight: 'bold' }}>
              Leave Assignments
            </Typography>
          </Box>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Employee Number or Leave Code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1, width: '300px' }}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: '#6D2323', marginRight: 1 }} />
              ),
            }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Employee Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
                  <Typography variant="h6">
                    No matching records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map(item => {
                const leaveType = leaveTypes.find(type => type.leave_code === item.leave_code);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.employeeNumber}</TableCell>
                    <TableCell>
                      {leaveType ? `${leaveType.leave_description} (${leaveType.leave_code})` : item.leave_code}
                    </TableCell>
                    <TableCell>{leaveType?.leave_hours || 'N/A'}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => { setEditData(item); setEditingId(item.id); setOpenEditModal(true); }} 
                        variant="outlined" 
                        startIcon={<EditIcon />} 
                        sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: 100, mr: 1, mb: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => deleteAssignment(item.id)} 
                        variant="outlined" 
                        startIcon={<DeleteIcon />} 
                        sx={{ backgroundColor: 'black', color: 'white', width: 100, mb: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Leave Assignment</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="Employee Number"
              value={editData.employeeNumber || ''}
              onChange={(e) => setEditData({ ...editData, employeeNumber: e.target.value })}
              style={inputStyle}
              required
            />

            <FormControl sx={{ minWidth: 324.25, mb: 2 }} required>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={editData.leave_code || ''}
                label="Leave Type"
                onChange={(e) => setEditData({ ...editData, leave_code: e.target.value })}
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type.id} value={type.leave_code}>
                    {type.leave_description} ({type.leave_code}) - {type.leave_hours} hours
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={updateAssignment} 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: 100, mr: 1 }}
          >
            Update
          </Button>
          <Button 
            onClick={() => setOpenEditModal(false)} 
            variant="outlined" 
            startIcon={<CancelIcon />}
            sx={{ backgroundColor: 'black', color: 'white', width: 100 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeaveAssignment; 