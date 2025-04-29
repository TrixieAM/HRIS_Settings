import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Container } from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



const OverallAttendance = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [editRecord, setEditRecord] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedEmployeeNumber = localStorage.getItem('employeeNumber');
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');

    if (storedEmployeeNumber) setEmployeeNumber(storedEmployeeNumber);
    if (storedStartDate) setStartDate(storedStartDate);
    if (storedEndDate) setEndDate(storedEndDate);
  }, []);

const fetchAttendanceData = async () => {
  // Check for duplicate employee number in current data
  

  console.log("Sending request with params: ", {
    personID: employeeNumber,
    startDate,
    endDate,
  });

  try {
    const response = await axios.get("http://localhost:5000/attendance/api/overall_attendance_record", {
      params: {
        personID: employeeNumber,
        startDate,
        endDate,
      },
    });

    if (response.status === 200) {
      setAttendanceData(response.data.data);
    } else {
      console.error("Error: ", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching attendance data.");
  }
};


const updateRecord = async () => {
  if (!editRecord || !editRecord.totalRenderedTimeMorning) return;

  try {
    await axios.put(`http://localhost:5000/attendance/api/overall_attendance_record/${editRecord.id}`, editRecord);
    alert("Record was updated successfully");
    fetchAttendanceData();  // Refresh data before clearing edit state

    window.location.reload();  // Refresh the entire page

  } catch (error) {
    console.error("Error updating record:", error);
    alert("Update failed.");
  }

  setEditRecord(null);  // Clear form after update
};


  const deleteRecord = async (id) => {
    await axios.delete(`http://localhost:5000/attendance/api/overall_attendance_record/${id}`);
    fetchAttendanceData();
    alert("The Data was Successfully Deleted");
  };

  const submitToPayroll = async () => {
    try {
      // Check each record first for duplicates
      for (const record of attendanceData) {
        const { personID, startDate, endDate } = record;
  
        const response = await axios.get(`http://localhost:5000/api/payroll-with-remittance`, {
          params: { employeeNumber: personID, startDate, endDate },
        });
  
        if (response.data.exists) {
          // If record exists, STOP and alert
          alert(`Existing payroll entry found for Employee Number ${personID} from ${startDate} to ${endDate}. Submission cancelled.`);
          return;
        }
      }
  
      // If no duplicates, proceed to submit
      const payload = attendanceData.map(record => ({
        employeeNumber: record.personID,
        startDate: record.startDate,
        endDate: record.endDate,
        overallRenderedOfficialTimeTardiness: record.overallRenderedOfficialTimeTardiness,
        department: record.code,
      }));
  
      await axios.post("http://localhost:5000/api/add-rendered-time", payload);
  
      alert("Submitted to payroll successfully!");
      navigate('/payroll-table');
    } catch (error) {
      console.error("Error submitting to payroll:", error);
      alert("Submission failed.");
    }
  };
  
  

  

  
  
  

  return (
    <Container sx={{ mt: 2, backgroundColor: '#FEF9E1', pb: 4 }} maxWidth={false}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          mb: 3,
        }}
      >      
      <Box
          sx={{
            backgroundColor: '#6D2323',
            color: '#fff',
            p: 2,
            borderRadius: 2,
            mb: 3,
          }}
        >
      <Typography variant="h5" sx={{ m: 0 }}>
            Overall Attendance Report
          </Typography>
          <Typography variant="body2" sx={{ m: 0 }}>
            Generate & review all attendance records
          </Typography>
      </Box>

      {/* Input Fields */}
{/* --- filters & fetch button --- */}
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
      flexGrow: 1,        /* makes button fill remaining space nicely */
    }}
  >
    Fetch Attendance Records
  </Button>
</Box>


      {/* Table to Display Data */}
      <Paper sx={{ marginTop: 3, overflowX: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center" }}>
                <b>ID</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b> Department </b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Employee Number</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Start Date</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>End Date</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Morning Hours</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Morning Tardiness</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Afternoon Hours</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Afternoon Tardiness</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Honorarium</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Honorarium Tardiness</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Service Credit</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Service Credit Tardiness</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Overtime</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Overtime Tardiness</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Overall Official Rendered Time</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Overall Official Tardiness Time</b>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((record, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{record.id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{record.code}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{editRecord && editRecord.id === record.id ? <TextField value={editRecord.personID} onChange={(e) => setEditRecord({ ...editRecord, personID: e.target.value })} /> : record.personID}</TableCell>
                <TableCell>{editRecord && editRecord.id === record.id ? <TextField value={editRecord.startDate} onChange={(e) => setEditRecord({ ...editRecord, startDate: e.target.value })} /> : record.startDate}</TableCell>
                <TableCell>{editRecord && editRecord.id === record.id ? <TextField value={editRecord.endDate} onChange={(e) => setEditRecord({ ...editRecord, endDate: e.target.value })} /> : record.endDate}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedTimeMorning} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeMorning: e.target.value })} /> : record.totalRenderedTimeMorning}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedTimeMorningTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalTardAM: e.target.value })} /> : record.totalRenderedTimeMorningTardiness}
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedTimeAfternoon} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeAfternoon: e.target.value })} /> : record.totalRenderedTimeAfternoon}
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedTimeAfternoonTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedTimeAfternoonTardiness: e.target.value })} /> : record.totalRenderedTimeAfternoonTardiness}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedHonorarium} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedHonorarium: e.target.value })} /> : record.totalRenderedHonorarium}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedHonorariumTardiness} onChange={(e) => setEditRecord({ ...editRecord, TotalTatotalRenderedHonorariumTardinessrdHR: e.target.value })} /> : record.totalRenderedHonorariumTardiness}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedServiceCredit} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedServiceCredit: e.target.value })} /> : record.totalRenderedServiceCredit}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedServiceCreditTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedServiceCreditTardiness: e.target.value })} /> : record.totalRenderedServiceCreditTardiness}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedOvertime} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedOvertime: e.target.value })} /> : record.totalRenderedOvertime}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.totalRenderedOvertimeTardiness} onChange={(e) => setEditRecord({ ...editRecord, totalRenderedOvertimeTardiness: e.target.value })} /> : record.totalRenderedOvertimeTardiness}
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.overallRenderedOfficialTime} onChange={(e) => setEditRecord({ ...editRecord, overallRenderedOfficialTime: e.target.value })} /> : record.overallRenderedOfficialTime}
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  {editRecord && editRecord.id === record.id ? <TextField value={editRecord.overallRenderedOfficialTimeTardiness} onChange={(e) => setEditRecord({ ...editRecord, overallRenderedOfficialTimeTardiness: e.target.value })} /> : record.overallRenderedOfficialTimeTardiness}
                </TableCell>

                <TableCell>
                  {editRecord && editRecord.id === record.id ? (
                    <>
                     {/* Save */}
                    <Button
                      onClick={updateRecord}                     // original save logic
                      variant="contained"
                      style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px', width: '100%' }}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>

                    {/* Cancel */}
                    <Button
                      onClick={() => setEditRecord(null)}        // original cancel logic
                      variant="contained"
                      style={{ backgroundColor: 'black', color: 'white', width: '100%' }}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>

                    </>
                  ) : (
                    <>
                     <Button
                      onClick={() => {
                        setEditRecord(record);                                
                      }}
                      variant="contained"
                      style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100%', marginBottom: '5px' }}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => deleteRecord(record.id)}   // ← original delete logic kept
                      variant="contained"
                      style={{ backgroundColor: 'black', color: 'white', width: '100%' }}
                      startIcon={<DeleteIcon />}
                    >
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

      {/* No Data Message */}
      {attendanceData.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
          No records found for the given criteria.
        </Typography>
      )}
    </Box>

    <Button
  variant="contained"
  sx={{
    mt: 3,
    backgroundColor: '#6D2323',
    color: '#ffffff',
    width: '100%',
    fontWeight: 'bold'
  }}
  onClick={submitToPayroll}
>
  Submit Overall Rendered Time to Payroll
</Button>

    
    </Container>
  );
};

export default OverallAttendance;
