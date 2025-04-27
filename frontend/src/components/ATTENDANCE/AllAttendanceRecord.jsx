import React, { useState } from "react";
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AllAttendanceRecord = () => {
  const [personID, setPersonID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [submittedID, setSubmittedID] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/attendance/api/attendance",
        { personID, startDate, endDate }
      );
      setRecords(response.data);
      setSubmittedID(personID);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  return (

    
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontWeight: 'bold',
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '12px 16px',
          borderRadius: '8px',
        }}
      >
        Attendance Record Search
      </Typography>

      {/* Form Box (white background) */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Person ID"
            variant="outlined"
            value={personID}
            onChange={(e) => setPersonID(e.target.value)}
            required
            sx={{ width: "180px" }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            sx={{ width: "180px" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            sx={{ width: "180px" }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            type="submit"
            style={{
              width: "200px",
              height: "55px",
              backgroundColor: "#6D2323",
              color: "#FEF9E1",
            }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* Display submitted Person ID */}
      {submittedID && (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Records for Person ID: {submittedID}
        </Typography>
      )}

      {/* Results Table */}
      {records.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ mt: 4, mb: 6 }}
          elevation={3}
        >
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#6D2323' }}>
                <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>
                  Person ID
                </TableCell>
                <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>
                  Date
                </TableCell>
                <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>
                  Time
                </TableCell>
                <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>
                  Attendance State
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.PersonID}</TableCell>
                  <TableCell>{record.Date}</TableCell>
                  <TableCell>{record.Time}</TableCell>
                  <TableCell>{record.AttendanceState}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllAttendanceRecord;
