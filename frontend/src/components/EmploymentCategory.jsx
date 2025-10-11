import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const EmploymentCategoryManagement = () => {
  const [employmentCategories, setEmploymentCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editRecord, setEditRecord] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({
    employeeNumber: '',
    employmentCategory: 0,
  });
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    fetchEmploymentCategories();
  }, []);

  // Fetch all employment categories
  const fetchEmploymentCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category`,
        getAuthHeaders()
      );
      setEmploymentCategories(response.data);
    } catch (error) {
      console.error('Error fetching employment categories:', error);
      alert('Failed to fetch employment categories.');
    } finally {
      setLoading(false);
    }
  };

  // Search employment categories
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchEmploymentCategories();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/search/${searchTerm}`,
        getAuthHeaders()
      );
      setEmploymentCategories(response.data);
    } catch (error) {
      console.error('Error searching employment categories:', error);
      alert('Failed to search employment categories.');
    } finally {
      setLoading(false);
    }
  };

  // Create new employment category
  const handleCreate = async () => {
    if (!newRecord.employeeNumber) {
      alert('Employee number is required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category`,
        newRecord,
        getAuthHeaders()
      );
      alert('Employment category created successfully!');
      setOpenAddDialog(false);
      setNewRecord({ employeeNumber: '', employmentCategory: 0 });
      fetchEmploymentCategories();
    } catch (error) {
      console.error('Error creating employment category:', error);
      const errorMsg =
        error.response?.data?.error || 'Failed to create employment category.';
      alert(errorMsg);
    }
  };

  // Update employment category
  const handleUpdate = async () => {
    if (!editRecord || !editRecord.employeeNumber) {
      alert('Employee number is required.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/${editRecord.id}`,
        {
          employeeNumber: editRecord.employeeNumber,
          employmentCategory: editRecord.employmentCategory,
        },
        getAuthHeaders()
      );
      alert('Employment category updated successfully!');
      setEditRecord(null);
      fetchEmploymentCategories();
    } catch (error) {
      console.error('Error updating employment category:', error);
      const errorMsg =
        error.response?.data?.error || 'Failed to update employment category.';
      alert(errorMsg);
    }
  };

  // Delete employment category
  const handleDelete = async (id, employeeNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the employment category for employee ${employeeNumber}?`
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/${id}`,
        getAuthHeaders()
      );
      alert('Employment category deleted successfully!');
      fetchEmploymentCategories();
    } catch (error) {
      console.error('Error deleting employment category:', error);
      alert('Failed to delete employment category.');
    }
  };

  return (
    <Container
      sx={{ mt: 2, backgroundColor: '#FEF9E1', pb: 4 }}
      maxWidth={false}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#6D2323',
          color: '#ffffff',
          padding: '20px',
          width: '96.7%',
          borderRadius: '8px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}
        >
          <CategoryIcon
            sx={{
              fontSize: '3rem',
              marginRight: '16px',
              marginTop: '5px',
              marginLeft: '5px',
            }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
              Employment Category Management
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Manage employee employment categories (Job Order / Regular)
            </p>
          </div>
        </div>
      </div>

      <Box
        sx={{
          backgroundColor: '#ffffff',
          p: 3,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          mb: 3,
        }}
      >
        {/* Search and Add Button */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search by Employee Number or Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: '#6D2323',
              color: '#FEF9E1',
              height: 56,
            }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={{
              backgroundColor: '#6D2323',
              color: '#FEF9E1',
              height: 56,
            }}
            startIcon={<AddIcon />}
          >
            Add New
          </Button>
        </Box>

        {/* Table */}
        <Paper sx={{ marginTop: 3, overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Removed ID TableCell */}
                <TableCell style={{ textAlign: 'center' }}>
                  <b>Employee Number</b>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <b>Employee Name</b>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <b>Employment Category</b>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employmentCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                    No employment categories found.
                  </TableCell>
                </TableRow>
              ) : (
                employmentCategories.map((record) => (
                  <TableRow key={record.id}>
                    {/* Removed ID TableCell */}
                    <TableCell style={{ textAlign: 'center' }}>
                      {editRecord && editRecord.id === record.id ? (
                        <TextField
                          value={editRecord.employeeNumber}
                          onChange={(e) =>
                            setEditRecord({
                              ...editRecord,
                              employeeNumber: e.target.value,
                            })
                          }
                          size="small"
                        />
                      ) : (
                        record.employeeNumber
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {record.employeeName || 'N/A'}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {editRecord && editRecord.id === record.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editRecord.employmentCategory}
                            onChange={(e) =>
                              setEditRecord({
                                ...editRecord,
                                employmentCategory: e.target.value,
                              })
                            }
                          >
                            <MenuItem value={0}>Job Order</MenuItem>
                            <MenuItem value={1}>Regular</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={record.categoryLabel}
                          color={
                            record.employmentCategory === 0
                              ? 'warning'
                              : 'success'
                          }
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {editRecord && editRecord.id === record.id ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            onClick={handleUpdate}
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#6D2323',
                              color: '#FEF9E1',
                            }}
                            startIcon={<SaveIcon />}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditRecord(null)}
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: 'black',
                              color: 'white',
                            }}
                            startIcon={<CancelIcon />}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            onClick={() => setEditRecord(record)}
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#6D2323',
                              color: '#FEF9E1',
                            }}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() =>
                              handleDelete(record.id, record.employeeNumber)
                            }
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: 'black',
                              color: 'white',
                            }}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Add New Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}>
          Add New Employment Category
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Employee Number"
            variant="outlined"
            value={newRecord.employeeNumber}
            onChange={(e) =>
              setNewRecord({ ...newRecord, employeeNumber: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <FormControl fullWidth>
            <InputLabel>Employment Category</InputLabel>
            <Select
              value={newRecord.employmentCategory}
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  employmentCategory: e.target.value,
                })
              }
              label="Employment Category"
            >
              <MenuItem value={0}>Job Order</MenuItem>
              <MenuItem value={1}>Regular</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenAddDialog(false);
              setNewRecord({ employeeNumber: '', employmentCategory: 0 });
            }}
            sx={{ color: '#6D2323' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              backgroundColor: '#6D2323',
              color: '#FEF9E1',
            }}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmploymentCategoryManagement;
