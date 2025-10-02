import API_BASE_URL from '../../apiConfig';
import React, { useState } from 'react';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';


import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Dialog, // ADD THIS
  DialogTitle, // ADD THIS
  DialogContent, // ADD THIS
  DialogActions, // ADD THIS
  IconButton,
} from '@mui/material';


import LoadingOverlay from '../LoadingOverlay';
import SuccessfulOverlay from '../SuccessfulOverlay';
import { Close } from '@mui/icons-material';


const OfficialTimeForm = () => {
  const [employeeID, setemployeeID] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);


  const [file, setFile] = useState(null);


  const [successOpen, setSuccessOpen] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewRecords, setPreviewRecords] = useState([]);


  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };


  const defaultRecords = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => ({
    employeeID,
    day,
    officialTimeIN: '00:00:00 AM',
    officialBreaktimeIN: '00:00:00 AM',
    officialBreaktimeOUT: '00:00:00 PM',
    officialTimeOUT: '00:00:00 PM',
    officialHonorariumTimeIN: '00:00:00 AM',
    officialHonorariumTimeOUT: '00:00:00 PM',
    officialServiceCreditTimeIN: '00:00:00 AM',
    officialServiceCreditTimeOUT: '00:00:00 AM',
    officialOverTimeIN: '00:00:00 AM',
    officialOverTimeOUT: '00:00:00 PM',
    breaktime: '',
  }));


  const handleSearch = () => {
    if (!employeeID) {
      setSuccessAction('Please enter an Employee ID.');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
      return;
    }


    setLoading(true);
    axios
      .get(`${API_BASE_URL}/officialtimetable/${employeeID}`, getAuthHeaders())
      .then((res) => {
        setLoading(false);
        if (res.data.length > 0) {
          setRecords(res.data);
          setFound(true);
        } else {
          setRecords(defaultRecords);
          setFound(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
        setSuccessAction('Error fetching records.');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      });
  };


  const handleChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeID) {
      setSuccessAction('Please enter a valid Employee ID.');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
      return;
    }


    setLoading(true);
    axios
      .post(
        `${API_BASE_URL}/officialtimetable`,
        {
          employeeID,
          records,
        },
        getAuthHeaders()
      )
      .then((res) => {
        setLoading(false);
        setSuccessAction(found ? 'Updated Successfully' : 'Saved Successfully');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      })
      .catch((err) => {
        console.error('Error saving data:', err);
        setLoading(false);
        setSuccessAction('Error saving records.');
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 2000);
      });
  };


  const PreviewModal = () => (
    <Dialog
      open={showPreviewModal}
      onClose={() => setShowPreviewModal(false)}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: '#6D2323',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Uploaded Records Preview
        </Typography>
        <IconButton
          onClick={() => setShowPreviewModal(false)}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: '500px', overflow: 'auto', boxShadow: 3 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  'Employee Number',
                  'Day',
                  'Time In',
                  'Break In',
                  'Break Out',
                  'Time Out',
                  'Honorarium Time In',
                  'Honorarium Time Out',
                  'Service Credit Time In',
                  'Service Credit Time Out',
                  'Over-Time In',
                  'Over-Time Out',
                ].map((header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      backgroundColor: '#6D2323',
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: '105px',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {previewRecords.map((record, index) => (
                <TableRow key={index} hover>
                  <TableCell>{record.employeeID}</TableCell>
                  <TableCell>{record.day}</TableCell>
                  <TableCell>{record.officialTimeIN}</TableCell>
                  <TableCell>{record.officialBreaktimeIN}</TableCell>
                  <TableCell>{record.officialBreaktimeOUT}</TableCell>
                  <TableCell>{record.officialTimeOUT}</TableCell>
                  <TableCell>{record.officialHonorariumTimeIN}</TableCell>
                  <TableCell>{record.officialHonorariumTimeOUT}</TableCell>
                  <TableCell>{record.officialServiceCreditTimeIN}</TableCell>
                  <TableCell>{record.officialServiceCreditTimeOUT}</TableCell>
                  <TableCell>{record.officialOverTimeIN}</TableCell>
                  <TableCell>{record.officialOverTimeOUT}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={() => setShowPreviewModal(false)}
          sx={{ bgcolor: '#6D2323', '&:hover': { bgcolor: '#8B2E2E' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );


  const handleUpload = async () => {
    if (!file) {
      setSuccessAction('Please select a file!');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
      return;
    }


    const formData = new FormData();
    formData.append('file', file);


    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-excel-faculty-official-time`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      setLoading(false);


      // Display the uploaded records in modal if they exist
      if (response.data.records && response.data.records.length > 0) {
        setPreviewRecords(response.data.records);
        setShowPreviewModal(true);
      }


      setSuccessAction(
        `${response.data.message} (Inserted: ${response.data.inserted}, Updated: ${response.data.updated})`
      );
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);


      // Clear file selection
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      setSuccessAction('Upload failed!');
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }
  };


  return (
    <Container
      sx={{
        paddingBottom: '70px',
        borderRadius: '10px',
        paddingTop: '20px',
        minWidth: '1200px', // Set a minimum width
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#6D2323',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          mb: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
          <SearchIcon
            sx={{
              fontSize: '3rem',
              marginRight: '16px',
              marginTop: '5px',
              marginLeft: '5px',
            }}
          />
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ margin: 0, marginBottom: '2px' }}
            >
              Official Time Schedule
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, fontSize: '85%' }}>
              Manage and update official time schedules for employees
            </Typography>
          </Box>
        </Box>
      </Box>


      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        mb={3}
        sx={{
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Left Section - Employee Search */}
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 1, color: '#6D2323' }}
          >
            Employee Number:
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              size="small"
              value={employeeID}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setemployeeID(value);
                }
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              sx={{
                minWidth: '250px',
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#6D2323',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6D2323',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: '#6D2323',
                '&:hover': {
                  bgcolor: '#8B2E2E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(109, 35, 35, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Search
            </Button>
          </Box>
        </Box>


        {/* Right Section - Upload File */}
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 1, color: '#6D2323', textAlign: 'right' }}
          >
            Upload Excel File:
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <input
              type="file"
              accept=".xlsx,.xls"
              id="upload-button"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />


            <label htmlFor="upload-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={
                  <CloudUploadIcon
                    sx={{
                      transition: 'transform 0.3s ease',
                    }}
                  />
                }
                sx={{
                  color: '#6D2323',
                  borderColor: '#6D2323',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    borderColor: '#6D2323',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(109, 35, 35, 0.2)',
                    '& .MuiSvgIcon-root': {
                      transform: 'translateY(-3px)',
                    },
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Choose File
              </Button>
            </label>


            {file && (
              <Box
                sx={{
                  bgcolor: '#f0f0f0',
                  px: 2,
                  py: 0.5,
                  borderRadius: '4px',
                  maxWidth: '200px',
                }}
              >
                <Typography variant="body2" noWrap>
                  {file.name}
                </Typography>
              </Box>
            )}


            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file}
              startIcon={
                <CloudUploadIcon
                  sx={{
                    transition: 'transform 0.3s ease',
                  }}
                />
              }
              sx={{
                bgcolor: '#6D2323',
                '&:hover': {
                  bgcolor: '#8B2E2E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(109, 35, 35, 0.3)',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateY(-3px)',
                  },
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Box>
      {records.length > 0 && (
        <form onSubmit={handleSubmit}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: '580px', overflow: 'auto', boxShadow: 3 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    'Employee Number',
                    'Day',
                    'Time In',
                    'Break In',
                    'Break Out',
                    'Time Out',
                    'Honorarium Time In',
                    'Honorarium Time Out',
                    'Service Credit Time In',
                    'Service Credit Time Out',
                    'Over-Time In',
                    'Over-Time Out',
                  ].map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        backgroundColor: '#6D2323',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '105px',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.employeeID}
                        InputProps={{ readOnly: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.day}
                        InputProps={{ readOnly: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialTimeIN}
                        onChange={(e) =>
                          handleChange(index, 'officialTimeIN', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialBreaktimeIN}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialBreaktimeIN',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialBreaktimeOUT}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialBreaktimeOUT',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialTimeOUT}
                        onChange={(e) =>
                          handleChange(index, 'officialTimeOUT', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialHonorariumTimeIN}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialHonorariumTimeIN',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialHonorariumTimeOUT}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialHonorariumTimeOUT',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialServiceCreditTimeIN}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialServiceCreditTimeIN',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialServiceCreditTimeOUT}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialServiceCreditTimeOUT',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialOverTimeIN}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialOverTimeIN',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record.officialOverTimeOUT}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'officialOverTimeOUT',
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, bgcolor: '#6D2323', float: 'right' }}
            startIcon={<SaveIcon />}
          >
            {found ? 'Update' : 'Save'}
          </Button>
        </form>
      )}
      <LoadingOverlay open={loading} message="Processing..." />
      <SuccessfulOverlay open={successOpen} action={successAction} />
      <PreviewModal />
    </Container>
  );
};


export default OfficialTimeForm;



