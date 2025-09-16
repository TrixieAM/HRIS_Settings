import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Modal,
  IconButton,
  Button
} from "@mui/material";
import {
  AccountBalance as CreditsIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from 'axios';

const LeaveCredits = ({ personID }) => {
  const [leaveCredits, setLeaveCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const hoursToDays = (hours) => (hours / 8).toFixed(2); // keeps 2 decimal places


  const fetchLeaveCredits = async () => {
    if (!personID) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Get all leave types from leave_table
      const leaveTableResponse = await axios.get('http://localhost:5000/leaveRoute/leave_table');
      const allLeaveTypes = leaveTableResponse.data;

      // Get all leave assignments for this employee
      const assignmentResponse = await axios.get('http://localhost:5000/leaveRoute/leave_assignment');
      const userAssignments = assignmentResponse.data.filter(
        assignment => assignment.employeeNumber?.toString() === personID?.toString()
      );

      // Calculate credits for each leave type
      const creditsData = allLeaveTypes.map(leaveType => {
        // Find all assignments for this leave code and employee
        const assignmentsForThisLeave = userAssignments.filter(
          assignment => assignment.leave_code === leaveType.leave_code
        );

        // Sum up all used hours for this leave type
        const totalUsedHours = assignmentsForThisLeave.reduce((sum, assignment) => {
          return sum + (parseFloat(assignment.used_hours) || 0);
        }, 0);

        const totalHours = parseFloat(leaveType.leave_hours) || 0;
        const remainingHours = Math.max(0, totalHours - totalUsedHours);

        return {
          leave_code: leaveType.leave_code,
          leave_description: leaveType.leave_description,
          total_hours: totalHours,
          used_hours: totalUsedHours,
          remaining_hours: remainingHours,
          has_assignments: assignmentsForThisLeave.length > 0
        };
      });

      setLeaveCredits(creditsData);
      
    } catch (error) {
      console.error('Error fetching leave credits:', error);
      setError('Failed to fetch leave credits');
      setLeaveCredits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveCredits();
  }, [personID]);

  const handleOpenModal = () => {
    setModalOpen(true);
    // Refresh data when modal opens
    fetchLeaveCredits();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getStatusColor = (remainingHours, totalHours) => {
    if (totalHours === 0) return '#999';
    const percentage = (remainingHours / totalHours) * 100;
    if (percentage > 50) return '#2e7d32'; // Green
    if (percentage > 20) return '#ed6c02'; // Orange
    return '#d32f2f'; // Red
  };

  const getStatusText = (remainingHours, totalHours) => {
    if (totalHours === 0) return 'N/A';
    const percentage = (remainingHours / totalHours) * 100;
    if (percentage > 50) return 'Good';
    if (percentage > 20) return 'Low';
    return 'Critical';
  };

  return (
    <>
      {/* Clickable Box */}
      <Box
        onClick={handleOpenModal}
        sx={{
          border: '1px solid #6d2323',
          borderRadius: '8px',
          p: 2,
          cursor: 'pointer',
          transition: '0.2s',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e8e8e8',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '15px',
          width: '75%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditsIcon sx={{ color: '#6d2323', fontSize: '1.5rem' }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: '#6d2323' }}
          >
            Leave Credits Summary
          </Typography>
        </Box>
        {leaveCredits.length > 0 && (
          <Chip
            label={`${leaveCredits.length} Types Available`}
            size="small"
            sx={{
              backgroundColor: '#6d2323',
              color: '#fff',
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
        )}
      </Box>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#fff',
            border: '1px solid #6d2323',
            borderRadius: 2,
            width: '85%',
            maxWidth: '800px',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              backgroundColor: '#6D2323',
              color: '#ffffff',
              p: 2,
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CreditsIcon sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h6">
                  Leave Credits Summary
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  View your available leave hours and balances
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseModal} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: '#6d2323' }} />
                <Typography sx={{ ml: 2, color: '#666' }}>
                  Loading leave credits...
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
                <Button 
                  onClick={fetchLeaveCredits} 
                  sx={{ ml: 2, color: '#d32f2f' }}
                >
                  Retry
                </Button>
              </Alert>
            ) : leaveCredits.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ color: '#666', mb: 2 }}
                >
                  No leave types found
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Please contact HR for leave type setup.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Summary Stats */}
                <Box 
                  sx={{ 
                    backgroundColor: '#f9f9f9', 
                    p: 2, 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#6d2323', mb: 1 }}>
                    Quick Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Total Leave Types: <strong>{leaveCredits.length}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#000000' }}>
                    Total Allocated: <strong>{hoursToDays(leaveCredits.reduce((sum, c) => sum + c.total_hours, 0))} days</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6d2323' }}>
                    Total Used: <strong>{hoursToDays(leaveCredits.reduce((sum, c) => sum + c.used_hours, 0))} days</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Total Remaining: <strong>{hoursToDays(leaveCredits.reduce((sum, c) => sum + c.remaining_hours, 0))} days</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Leave Types Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  {leaveCredits.map((credit, index) => {
                    const statusColor = getStatusColor(credit.remaining_hours, credit.total_hours);
                    const statusText = getStatusText(credit.remaining_hours, credit.total_hours);
                    
                    return (
                      <Box
                        key={`${credit.leave_code}-${index}`}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          p: 2.5,
                          backgroundColor: credit.has_assignments ? '#fafafa' : '#f9f9f9',
                          transition: '0.2s',
                          '&:hover': {
                            borderColor: '#6d2323',
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 'bold', color: '#6d2323', mb: 0.5 }}
                            >
                              {credit.leave_code}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#333', fontSize: '0.95rem' }}
                            >
                              {credit.leave_description}
                            </Typography>
                          </Box>
                          <Chip
                            label={statusText}
                            size="small"
                            sx={{
                              backgroundColor: statusColor,
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                Total Hours
                              </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {hoursToDays(credit.total_hours)} days
                                </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                Used Hours
                              </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {hoursToDays(credit.used_hours)} days
                                </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                              Remaining
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6d2323' }}>
                            {hoursToDays(credit.remaining_hours)} days
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Progress Bar */}
                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${credit.total_hours > 0 ? (credit.remaining_hours / credit.total_hours) * 100 : 0}%`,
                                height: '100%',
                                backgroundColor: statusColor,
                                transition: '0.3s',
                              }}
                            />
                          </Box>
                        </Box>
                        
                        {/* Usage indicator */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#999',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                          }}
                        >
                          {credit.has_assignments 
                            ? `${credit.used_hours > 0 ? 'Currently in use' : 'Available for use'}`
                            : 'Full allocation available'
                          }
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LeaveCredits;