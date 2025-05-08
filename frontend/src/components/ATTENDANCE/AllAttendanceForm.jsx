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
import { Search } from "@mui/icons-material";

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

  const currentYear = new Date().getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthClick = (monthIndex) => {
    const year = new Date().getFullYear();
  
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  
    // format as YYYY-MM-DD (ISO format expected by <TextField type="date" />)
    const formattedStart = start.toISOString().substring(0, 10);
    const formattedEnd = end.toISOString().substring(0, 10);
  
    setStartDate(formattedStart);
    setEndDate(formattedEnd);
  };

  return (

    
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <div
                  style={{
                    backgroundColor: '#6D2323',
                    color: '#ffffff',
                    padding: '20px',
                    width: '96.6%',
                    borderRadius: '8px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px',
                   
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', color: '#ffffff', }}>
                    <Search sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
                        Attendance Record Search
                      </h4>
                      <p style={{ margin: 0, fontSize: '85%' }}>
                      Generate & review attendance records
         
                      </p>
                    </div>
                  </div>
                  
                      </div>
                      

      {/* Form Box (white background) */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#ffffff',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
      >
        {/* Month Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2, pt: 5, pb: 5 }}>
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant="contained"
                    onClick={() => handleMonthClick(index)}
                    sx={{
                      backgroundColor: "#6D2323",
                      color: "white", // optional: text color for contrast
                      "&:hover": {
                        backgroundColor: "#d4bd99", // optional: slightly darker hover effect
                      },
                    }}
                  >
                    {month}
                  </Button>
                ))}
              </Box>
        
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
            sx={{ width: "250px", marginLeft: '15px'  }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            sx={{
              width: "250px",
              height: "54px",
              marginLeft: "10px",
              marginTop: "14px",
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            sx={{
              width: "250px",
              height: "54px",
              marginLeft: "10px",
              marginTop: "14px",
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            type="submit"
            style={{
              width: "250px",
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
          Records for Person ID: <b>{submittedID}</b>
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
                  <TableCell 
                    style={{ color: record.AttendanceState === 0 || record.AttendanceState === 'Uncategorized' ? 'red' : 'black', fontWeight: 'bold'}} 
                  >
                    {record.AttendanceState === 4 ? "Time OUT" : record.AttendanceState === 3 ? "Breaktime OUT" : record.AttendanceState === 2 ? "Breaktime IN" : record.AttendanceState === 1 ? "Time IN" : "Uncategorized" } 
                  </TableCell>
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
