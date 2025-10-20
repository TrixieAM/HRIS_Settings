import API_BASE_URL from '../../apiConfig';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Summarize,
  SummarizeOutlined,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Styled Modal Component
const StyledModal = ({ open, onClose, title, message, type = 'info', onConfirm, showCancel = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 60, color: '#FF9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 60, color: '#f44336' }} />;
      default:
        return <InfoIcon sx={{ fontSize: 60, color: '#2196F3' }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: '3px solid #6D2323',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#FEF9E1',
            '&:hover': {
              backgroundColor: 'rgba(254, 249, 225, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: '#FEF9E1',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>{getIcon()}</Box>
        <Typography
          sx={{
            color: '#6D2323',
            fontSize: '16px',
            whiteSpace: 'pre-line',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: '#FEF9E1',
          padding: '16px 24px',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {showCancel && (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: '#6D2323',
              color: '#6D2323',
              fontWeight: 'bold',
              minWidth: '120px',
              '&:hover': {
                borderColor: '#6D2323',
                backgroundColor: 'rgba(109, 35, 35, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onConfirm || onClose}
          variant="contained"
          sx={{
            backgroundColor: '#6D2323',
            color: '#FEF9E1',
            fontWeight: 'bold',
            minWidth: '120px',
            '&:hover': {
              backgroundColor: '#8B2E2E',
            },
          }}
        >
          {showCancel ? 'Confirm' : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const OverallAttendance = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingJO, setIsSubmittingJO] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false,
  });

  const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
    setModal({
      open: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log(
      'Token from localStorage:',
      token ? 'Token exists' : 'No token found'
    );
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token starts with:', token.substring(0, 20) + '...');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    const storedEmployeeNumber = localStorage.getItem('employeeNumber');
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');

    if (storedEmployeeNumber) setEmployeeNumber(storedEmployeeNumber);
    if (storedStartDate) setStartDate(storedStartDate);
    if (storedEndDate) setEndDate(storedEndDate);
  }, []);

  const fetchAttendanceData = async () => {
    console.log('Sending request with params: ', {
      personID: employeeNumber,
      startDate,
      endDate,
    });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/attendance/api/overall_attendance_record`,
        {
          params: {
            personID: employeeNumber,
            startDate,
            endDate,
          },
          ...getAuthHeaders(),
        }
      );

      if (response.status === 200) {
        setAttendanceData(response.data.data);
      } else {
        console.error('Error: ', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showModal('Data Retrieval Error', 'Unable to retrieve attendance records. Please try again.', 'error');
    }
  };

  const updateRecord = async () => {
    if (!editRecord || !editRecord.totalRenderedTimeMorning) return;

    try {
      await axios.put(
        `${API_BASE_URL}/attendance/api/overall_attendance_record/${editRecord.id}`,
        editRecord,
        getAuthHeaders()
      );
      
      showModal('Update Successful', 'Record updated successfully.', 'success', () => {
        fetchAttendanceData();
        window.location.reload();
        closeModal();
      });
    } catch (error) {
      console.error('Error updating record:', error);
      showModal('Update Failed', 'Unable to update record.', 'error');
    }

    setEditRecord(null);
  };

  const deleteRecord = async (id, personID) => {
    showModal(
      'Confirm Deletion',
      `Delete attendance record for Employee ${personID}?`,
      'warning',
      async () => {
        try {
          await axios.delete(
            `${API_BASE_URL}/attendance/api/overall_attendance_record/${id}/${personID}`,
            getAuthHeaders()
          );
          fetchAttendanceData();
          showModal('Deleted Successfully', 'Record removed from system.', 'success');
        } catch (error) {
          console.error('Delete failed:', error);
          const status = error.response?.status;
          const message =
            error.response?.data?.message || error.response?.data?.error || 'Error';
          
          if (status === 404) {
            showModal('Not Found', 'Record not found or already deleted.', 'error');
          } else if (status === 401 || status === 403) {
            showModal('Session Expired', 'Please log in again.', 'error');
          } else {
            showModal('Deletion Failed', `${message}`, 'error');
          }
        }
      },
      true
    );
  };

  const submitToPayroll = async () => {
    if (isSubmitting) return;

    if (!attendanceData || attendanceData.length === 0) {
      showModal('No Data', 'No attendance records available.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredRecords = [];
      const invalidRecords = [];

      for (const record of attendanceData) {
        const employeeNumber = record.personID || record.employeeNumber;
        const employmentCategory = await fetchEmploymentCategory(employeeNumber);

        if (employmentCategory === null) {
          invalidRecords.push({
            employeeNumber,
            reason: 'Employment category not found in system',
          });
          continue;
        }

        if (employmentCategory === 1) {
          filteredRecords.push(record);
        } else if (employmentCategory === 0) {
          invalidRecords.push({
            employeeNumber,
            reason: 'Job Order (JO)',
          });
        }
      }

      if (invalidRecords.length > 0) {
        const invalidList = invalidRecords
          .map((r) => `${r.employeeNumber}: ${r.reason}`)
          .join('\n');

        if (filteredRecords.length === 0) {
          showModal(
            'Submission Blocked',
            `Employee(s) not eligible for Regular payroll:\n\n${invalidList}\n\nContact HR Department to update employment category.`,
            'warning'
          );
          setIsSubmitting(false);
          return;
        }

        showModal(
          'Confirm Submission',
          `${filteredRecords.length} eligible record(s)\n${invalidRecords.length} excluded\n\nProceed with submission?`,
          'warning',
          async () => {
            closeModal();
            await continuePayrollSubmission(filteredRecords);
          },
          true
        );
        return;
      }

      await continuePayrollSubmission(filteredRecords);
    } catch (error) {
      console.error('Error submitting to payroll:', error);
      handleSubmissionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const continuePayrollSubmission = async (filteredRecords) => {
    try {
      const payload = filteredRecords.map((record) => ({
        employeeNumber: record.personID,
        startDate: record.startDate,
        endDate: record.endDate,
        overallRenderedOfficialTimeTardiness: record.overallRenderedOfficialTimeTardiness,
        department: record.code,
      }));

      const missingFields = payload.filter(
        (record) => !record.employeeNumber || !record.startDate || !record.endDate
      );

      if (missingFields.length > 0) {
        showModal(
          'Validation Error',
          'Required fields missing. Check Employee Number, Start Date, and End Date.',
          'error'
        );
        return;
      }

      for (const payloadRecord of payload) {
        const { employeeNumber, startDate, endDate } = payloadRecord;

        try {
          const response = await axios.get(
            `${API_BASE_URL}/PayrollRoute/payroll-with-remittance`,
            {
              ...getAuthHeaders(),
              params: { employeeNumber, startDate, endDate },
            }
          );

          if (response.data.exists) {
            showModal(
              'Duplicate Entry',
              `Payroll entry exists for Employee ${employeeNumber} (${startDate} to ${endDate}).`,
              'warning'
            );
            return;
          }
        } catch (duplicateCheckError) {
          console.error('Error checking for duplicates:', duplicateCheckError);
          showModal('Validation Error', 'Unable to verify existing records.', 'error');
          return;
        }
      }

      const submitResponse = await axios.post(
        `${API_BASE_URL}/PayrollRoute/add-rendered-time`,
        payload,
        getAuthHeaders()
      );

      if (submitResponse.status === 200 || submitResponse.status === 201) {
        showModal(
          'Submission Successful',
          `${payload.length} Regular payroll record(s) submitted successfully.`,
          'success',
          () => {
            closeModal();
            navigate('/payroll-table');
          }
        );
      } else {
        throw new Error(`Unexpected response status: ${submitResponse.status}`);
      }
    } catch (error) {
      handleSubmissionError(error);
    }
  };

  const handleSubmissionError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Server error occurred';

      if (status === 409) {
        showModal('Duplicate Entry', 'Record already exists in payroll.', 'warning');
      } else if (status === 400) {
        showModal('Invalid Data', message, 'error');
      } else {
        showModal('Server Error', `Error ${status}: ${message}`, 'error');
      }
    } else if (error.request) {
      showModal('Network Error', 'Connection failed. Check internet connection.', 'error');
    } else {
      showModal('Submission Error', 'An unexpected error occurred.', 'error');
    }
  };

  const submitPayrollJO = async () => {
    if (isSubmittingJO) return;

    if (!attendanceData || attendanceData.length === 0) {
      showModal('No Data', 'No attendance records available.', 'warning');
      return;
    }

    setIsSubmittingJO(true);

    try {
      const filteredRecords = [];
      const invalidRecords = [];

      for (const record of attendanceData) {
        const employeeNumber = record.personID || record.employeeNumber;
        const employmentCategory = await fetchEmploymentCategory(employeeNumber);

        if (employmentCategory === null) {
          invalidRecords.push({
            employeeNumber,
            reason: 'Employment category not found in system',
          });
          continue;
        }

        if (employmentCategory === 0) {
          filteredRecords.push(record);
        } else if (employmentCategory === 1) {
          invalidRecords.push({
            employeeNumber,
            reason: 'Employment category is Regular',
          });
        }
      }

      if (invalidRecords.length > 0) {
        const invalidList = invalidRecords
          .map((r) => `• Employee ${r.employeeNumber}: ${r.reason}`)
          .join('\n');

        if (filteredRecords.length === 0) {
          showModal(
            'Submission Blocked',
            `Employees not eligible for JO payroll:\n\n${invalidList}\n\nContact HR to update employment status.`,
            'warning'
          );
          setIsSubmittingJO(false);
          return;
        }

        showModal(
          'Confirm Submission',
          `${filteredRecords.length} eligible record(s)\n${invalidRecords.length} excluded\n\nProceed with submission?`,
          'warning',
          async () => {
            closeModal();
            await continuePayrollJOSubmission(filteredRecords);
          },
          true
        );
        return;
      }

      await continuePayrollJOSubmission(filteredRecords);
    } catch (error) {
      console.error('Error submitting Payroll JO:', error);
      handlePayrollJOError(error);
    } finally {
      setIsSubmittingJO(false);
    }
  };

  const continuePayrollJOSubmission = async (filteredRecords) => {
    try {
      const duplicateRecords = [];
      
      for (const record of filteredRecords) {
        const employeeNumber = record.personID || record.employeeNumber;
        const { startDate, endDate } = record;

        try {
          const checkResponse = await axios.get(
            `${API_BASE_URL}/PayrollJORoutes/payroll-jo`,
            {
              ...getAuthHeaders(),
              params: { employeeNumber, startDate, endDate },
            }
          );

          if (checkResponse.data && checkResponse.data.length > 0) {
            duplicateRecords.push({
              employeeNumber,
              startDate,
              endDate,
            });
          }
        } catch (checkError) {
          if (checkError.response?.status === 404) {
            continue;
          }
          console.warn(`Could not check duplicate for ${employeeNumber}:`, checkError);
        }
      }

      if (duplicateRecords.length > 0) {
        const duplicateList = duplicateRecords
          .map((r) => `• Employee ${r.employeeNumber} (${r.startDate} to ${r.endDate})`)
          .join('\n');

        showModal(
          'Duplicate Entries',
          `Records already exist:\n\n${duplicateList}`,
          'warning'
        );
        return;
      }

      let successCount = 0;
      let failedRecords = [];

      for (const record of filteredRecords) {
        try {
          let rhHours = 0;
          if (record.overallRenderedOfficialTime) {
            const parts = record.overallRenderedOfficialTime.split(':');
            rhHours = parseInt(parts[0], 10) || 0;
          }

          let h = 0, m = 0, s = 0;
          if (record.overallRenderedOfficialTimeTardiness) {
            const tParts = record.overallRenderedOfficialTimeTardiness.split(':');
            h = parseInt(tParts[0], 10) || 0;
            m = parseInt(tParts[1], 10) || 0;
            s = parseInt(tParts[2], 10) || 0;
          }

          const payload = {
            employeeNumber: record.employeeNumber || record.personID,
            startDate: record.startDate,
            endDate: record.endDate,
            h,
            m,
            s,
            rh: rhHours,
            department: record.code,
          };

          console.log('Submitting JO payload:', payload);

          await axios.post(
            `${API_BASE_URL}/PayrollJORoutes/payroll-jo`,
            payload,
            getAuthHeaders()
          );

          successCount++;
        } catch (recordError) {
          console.error(`Failed to submit record for ${record.personID}:`, recordError);

          const errorMsg =
            recordError.response?.data?.message ||
            recordError.response?.data?.error ||
            'Unknown error';

          failedRecords.push({
            employeeNumber: record.personID || record.employeeNumber,
            error: errorMsg,
          });
        }
      }

      if (failedRecords.length > 0) {
        const failedList = failedRecords
          .map((r) => `• Employee ${r.employeeNumber}: ${r.error}`)
          .join('\n');

        if (successCount > 0) {
          showModal(
            'Partial Success',
            `Submitted: ${successCount}\nFailed: ${failedRecords.length}\n\n${failedList}`,
            'warning'
          );
        } else {
          showModal(
            'Submission Failed',
            `All submissions failed:\n\n${failedList}`,
            'error'
          );
        }
      } else {
        showModal(
          'Submission Successful',
          `${successCount} JO payroll record(s) submitted successfully.`,
          'success',
          () => {
            closeModal();
            navigate('/payroll-jo');
          }
        );
      }
    } catch (error) {
      handlePayrollJOError(error);
    }
  };

  const handlePayrollJOError = (error) => {
    let errorMessage = 'Payroll JO submission failed.';

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Server error occurred';

      if (status === 409) {
        errorMessage = `Duplicate entry: ${message}`;
      } else if (status === 400) {
        errorMessage = `Invalid data: ${message}`;
      } else {
        errorMessage = `Error ${status}: ${message}`;
      }
    } else if (error.request) {
      errorMessage = 'Connection failed. Check internet connection.';
    }

    showModal('Submission Error', errorMessage, 'error');
  };

  const fetchEmploymentCategory = async (employeeNumber) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmploymentCategoryRoutes/employment-category/${employeeNumber}`,
        getAuthHeaders()
      );
      return response.data.employmentCategory;
    } catch (error) {
      console.error('Error fetching employment category:', error);
      return null;
    }
  };

  return (
    <Container sx={{ mt: 2, backgroundColor: '#FEF9E1', pb: 4 }} maxWidth={false}>
      <StyledModal
        open={modal.open}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
      />

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
        <div style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
          <SummarizeOutlined
            sx={{
              fontSize: '3rem',
              marginRight: '16px',
              marginTop: '5px',
              marginLeft: '5px',
            }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
              Overall Attendance Report
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Generate and review summary of overall attendance records
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
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Employee Number"
            variant="outlined"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            sx={{ width: 250 }}
            required
          />

          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
            required
          />

          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
            required
          />

          <Button
            variant="contained"
            onClick={fetchAttendanceData}
            sx={{
              backgroundColor: '#6D2323',
              color: '#FEF9E1',
              height: 56,
              flexGrow: 1,
            }}
          >
            Fetch Attendance Records
          </Button>
        </Box>

        <Paper sx={{ marginTop: 3, overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}><b>ID</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Department</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Employee Number</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Start Date</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>End Date</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Morning Hours</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Morning Tardiness</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Afternoon Hours</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Afternoon Tardiness</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Honorarium</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Honorarium Tardiness</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Service Credit</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Service Credit Tardiness</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Overtime</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Overtime Tardiness</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Overall Official Rendered Time</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Overall Official Tardiness Time</b></TableCell>
                <TableCell style={{ textAlign: 'center' }}><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: 'center' }}>{record.id}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{record.code}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.personID} onChange={(e) => setEditRecord({ ...editRecord, personID: e.target.value })} />
                    ) : (
                      record.personID
                    )}
                  </TableCell>
                  <TableCell>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.startDate} onChange={(e) => setEditRecord({ ...editRecord, startDate: e.target.value })} />
                    ) : (
                      record.startDate
                    )}
                  </TableCell>
                  <TableCell>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.endDate} onChange={(e) => setEditRecord({ ...editRecord, endDate: e.target.value })} />
                    ) : (
                      record.endDate
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedTimeMorning} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeMorning: e.target.value })} />
                    ) : (
                      record.totalRenderedTimeMorning
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedTimeMorningTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalTardAM: e.target.value })} />
                    ) : (
                      record.totalRenderedTimeMorningTardiness
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedTimeAfternoon} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeAfternoon: e.target.value })} />
                    ) : (
                      record.totalRenderedTimeAfternoon
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedTimeAfternoonTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeAfternoonTardiness: e.target.value })} />
                    ) : (
                      record.totalRenderedTimeAfternoonTardiness
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedHonorarium} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedHonorarium: e.target.value })} />
                    ) : (
                      record.totalRenderedHonorarium
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedHonorariumTardiness} onChange={(e) => setEditRecord({ ...editRecord, TotalTatotalRenderedHonorariumTardinessrdHR: e.target.value })} />
                    ) : (
                      record.totalRenderedHonorariumTardiness
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedServiceCredit} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedServiceCredit: e.target.value })} />
                    ) : (
                      record.totalRenderedServiceCredit
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedServiceCreditTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedServiceCreditTardiness: e.target.value })} />
                    ) : (
                      record.totalRenderedServiceCreditTardiness
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedOvertime} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedOvertime: e.target.value })} />
                    ) : (
                      record.totalRenderedOvertime
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.totalRenderedOvertimeTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedOvertimeTardiness: e.target.value })} />
                    ) : (
                      record.totalRenderedOvertimeTardiness
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.overallRenderedOfficialTime} onChange={(e) => setEditRecord({ ...editRecord, overallRenderedOfficialTime: e.target.value })} />
                    ) : (
                      record.overallRenderedOfficialTime
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {editRecord && editRecord.id === record.id ? (
                      <TextField value={editRecord.overallRenderedOfficialTimeTardiness} onChange={(e) => setEditRecord({ ...editRecord, overallRenderedOfficialTimeTardiness: e.target.value })} />
                    ) : (
                      record.overallRenderedOfficialTimeTardiness
                    )}
                  </TableCell>
                  <TableCell>
                    {editRecord && editRecord.id === record.id ? (
                      <>
                        <Button onClick={updateRecord} variant="contained" style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px', width: '100%' }} startIcon={<SaveIcon />}>
                          Save
                        </Button>
                        <Button onClick={() => setEditRecord(null)} variant="contained" style={{ backgroundColor: 'black', color: 'white', width: '100%' }} startIcon={<CancelIcon />}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => { setEditRecord(record); }} variant="contained" style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100%', marginBottom: '5px' }} startIcon={<EditIcon />}>
                          Edit
                        </Button>
                        <Button onClick={() => deleteRecord(record.id, record.personID)} variant="contained" style={{ backgroundColor: 'black', color: 'white', width: '100%' }} startIcon={<DeleteIcon />}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {attendanceData.length === 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
            No records found for the given criteria.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          sx={{
            flex: 1,
            backgroundColor: isSubmitting ? '#6d2323' : '#6D2323',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: isSubmitting ? '#fef9e1' : '#fef9e1',
              border: '1px solid #6d2323',
              color: '#6d2323',
            },
          }}
          onClick={submitToPayroll}
          disabled={isSubmitting || attendanceData.length === 0}
        >
          {isSubmitting ? 'Submitting to Payroll...' : 'Submit Payroll Regular'}
        </Button>

        <Button
          variant="contained"
          sx={{
            flex: 1,
            backgroundColor: isSubmittingJO ? '#6d2323' : '#6D2323',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: isSubmittingJO ? '#fef9e1' : '#fef9e1',
              border: '1px solid #6d2323',
              color: '#6d2323',
            },
          }}
          onClick={submitPayrollJO}
          disabled={isSubmittingJO || attendanceData.length === 0}
        >
          {isSubmittingJO ? 'Submitting to Payroll JO...' : 'Submit Payroll JO'}
        </Button>
      </Box>
    </Container>
  );
};

export default OverallAttendance;