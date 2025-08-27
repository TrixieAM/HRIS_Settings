import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Search, EventNote,
  Reorder as ReorderIcon
} from '@mui/icons-material';

const LeaveTable = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState({
    leave_description: '',
    leave_code: '',
    leave_hours: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaveTypes = leaveTypes.filter((item) =>
    item.leave_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.leave_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/leaveRoute/leave_table');
      setLeaveTypes(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addLeaveType = async () => {
    try {
      await axios.post('http://localhost:5000/leaveRoute/leave_table', newLeaveType);
      fetchLeaveTypes();
      setNewLeaveType({ leave_description: '', leave_code: '', leave_hours: '' });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const updateLeaveType = async () => {
    try {
      await axios.put(`http://localhost:5000/leaveRoute/leave_table/${editingId}`, editData);
      setOpenEditModal(false);
      setEditingId(null);
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteLeaveType = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/leaveRoute/leave_table/${id}`);
      fetchLeaveTypes();
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
              Leave Types
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Manage Leave Types and Hours
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
          {Object.keys(newLeaveType).map((key) => (
            <TextField
              key={key}
              label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={newLeaveType[key]}
              onChange={(e) => setNewLeaveType({ ...newLeaveType, [key]: e.target.value })}
              style={inputStyle}
            />
          ))}
        </Box>

        <Button
          onClick={addLeaveType}
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
          marginBottom: '20px'
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
              Leave Types
            </Typography>
          </Box>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Description or Code"
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
              {Object.keys(newLeaveType).map(key => (
                <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
                  <Typography variant="h6">
                    No matching records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaveTypes.map(item => (
                <TableRow key={item.id}>
                  {Object.keys(newLeaveType).map(key => (
                    <TableCell key={key}>{item[key]}</TableCell>
                  ))}
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
                      onClick={() => deleteLeaveType(item.id)} 
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
        <DialogTitle>Edit Leave Type</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 2 }}>
            {Object.keys(newLeaveType).map(key => (
              <TextField
                key={key}
                label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={editData[key] || ''}
                onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                style={inputStyle}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={updateLeaveType} 
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

export default LeaveTable; 