// frontend/components/LeaveRequest.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Search, EventNote,
  EventAvailable,
  Reorder as ReorderIcon
} from '@mui/icons-material';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeNumber: '', leave_code: '', leave_date: '', status: '0'
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Approved by Manager' },
    { value: '2', label: 'Approved by HR' },
    { value: '3', label: 'Denied by Manager/HR' }
  ];

  const filteredLeaveRequests = leaveRequests.filter((item) =>
    item.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_request');
      setLeaveRequests(res.data);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Convert from yyyy/MM/dd to yyyy-MM-dd
    return dateString.replace(/\//g, '-');
  };

  const addLeaveRequest = async () => {
    try {
      const payload = {
        ...newLeaveRequest,
        leave_date: formatDate(newLeaveRequest.leave_date)
      };
      
      // Remove empty values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== '')
      );

      await axios.post('http://localhost:5000/leaveRoute/leave_request', cleanPayload);
      
      // Also create a leave assignment
      await axios.post('http://localhost:5000/leaveRoute/leave_assignment', {
        leave_code: cleanPayload.leave_code,
        employeeNumber: cleanPayload.employeeNumber
      });

      fetchLeaveRequests();
      setNewLeaveRequest({ employeeNumber: '', leave_code: '', leave_date: '', status: '0' });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const updateLeaveRequest = async () => {
    try {
      const payload = {
        ...editData,
        leave_date: formatDate(editData.leave_date)
      };

      // Remove empty values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== '')
      );

      await axios.put(`http://localhost:5000/leaveRoute/leave_request/${editingId}`, cleanPayload);
      setOpenEditModal(false);
      setEditingId(null);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteLeaveRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/leaveRoute/leave_request/${id}`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error deleting data:', error);
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
              Employee Leave Request
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Manage Leave Request Records
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
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Employee Number"
            value={newLeaveRequest.employeeNumber}
            onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, employeeNumber: e.target.value })}
            style={inputStyle}
            required
          />

          <FormControl sx={{ minWidth: 324.25, mb: 2 }} required>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={newLeaveRequest.leave_code}
              label="Leave Type"
              onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, leave_code: e.target.value })}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type.id} value={type.leave_code}>
                  {type.leave_description} ({type.leave_code}) - {type.leave_hours} hours
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Leave Date"
            type="date"
            value={newLeaveRequest.leave_date}
            onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, leave_date: e.target.value })}
            style={inputStyle}
            InputLabelProps={{ shrink: true }}
            required
          />

          <FormControl sx={{ minWidth: 324.25, mb: 2 }} required>
            <InputLabel>Status</InputLabel>
            <Select
              value={newLeaveRequest.status}
              label="Status"
              onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, status: e.target.value })}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          onClick={addLeaveRequest}
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
              Leave Requests
            </Typography>
          </Box>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Employee Number"
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
              <TableCell sx={{ fontWeight: 'bold' }}>Leave Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
                  <Typography variant="h6">
                    No matching records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaveRequests.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.employeeNumber}</TableCell>
                  <TableCell>
                    {leaveTypes.find(type => type.leave_code === item.leave_code)?.leave_description || item.leave_code}
                  </TableCell>
                  <TableCell>{item.leave_date}</TableCell>
                  <TableCell>
                    {statusOptions.find(opt => opt.value === String(item.status))?.label || item.status}
                  </TableCell>

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
                      onClick={() => deleteLeaveRequest(item.id)} 
                      variant="outlined" 
                      startIcon={<DeleteIcon />} 
                      sx={{ backgroundColor: 'black', color: 'white', width: 100, mb: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
        <DialogTitle>Edit Leave Request</DialogTitle>
        <DialogContent>
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

            <TextField
              label="Leave Date"
              type="date"
              value={editData.leave_date || ''}
              onChange={(e) => setEditData({ ...editData, leave_date: e.target.value })}
              style={inputStyle}
              InputLabelProps={{ shrink: true }}
              required
            />

            <FormControl sx={{ minWidth: 324.25, mb: 2 }} required>
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status || '0'}
                label="Status"
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={updateLeaveRequest} 
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

export default LeaveRequest;