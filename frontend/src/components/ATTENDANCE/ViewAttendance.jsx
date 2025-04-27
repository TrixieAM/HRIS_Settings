import React, { useState } from "react";
import axios from "axios";
import {
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
  Typography  
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SaveAsIcon from '@mui/icons-material/SaveAs';

const AttendanceSearch = () => {
  const [personID, setPersonID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/attendance/api/view-attendance",
        {
          personID,
          startDate,
          endDate,
        }
      );
      setRecords(response.data);
    } catch (err) {
      console.error("Axios error:", err.response ? err.response.data : err);
    }
  };

  const saveAll = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/attendance/api/view-attendance",
        { records }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to save records.");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  return (
    <Container sx={{bgcolor: "white", height: "90%", paddingTop: "25px", borderRadius: "10px"}}>
    <div>
    <Box
          sx={{
            backgroundColor: '#6D2323',
            color: '#fff',
            p: 2,
            borderRadius: 2,
            mb: 2,
            
          }}
        >
      <Typography variant="h5" sx={{ m: 0}}>
            Attendance Search
          </Typography>
          <Typography variant="body2" sx={{ m: 0 }}>
            Search & review attendance records
          </Typography>
      </Box> 
      <TextField
        label="Person ID"
        value={personID}
        onChange={(e) => setPersonID(e.target.value)}
        sx={{ width: "300px" }} // Adjust width and add spacing
      />

      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ width: "300px", marginLeft: "10px" }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        sx={{ width: "300px", marginLeft: "10px" }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <Button
        sx={{ width: "200px", height: "55px", marginLeft: "10px", bgcolor: "#6D2323", marginTop:'-3px' }}
        margin="normal"
        variant="contained"
        color="primary"
        onClick={fetchRecords}
        startIcon={<SearchIcon />}
        
      >
        Search
      </Button>
      

      {records.length > 0 && (
        <>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Person ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Time IN</TableCell>
                  <TableCell>Breaktime IN</TableCell>
                  <TableCell>Breaktime OUT</TableCell>
                  <TableCell>Time OUT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.personID}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.Day}</TableCell>
                    <TableCell>
                      <TextField
                        value={record.timeIN || ""}
                        onChange={(e) =>
                          handleInputChange(index, "timeIN", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={record.breaktimeIN || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "breaktimeIN",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={record.breaktimeOUT || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "breaktimeOUT",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={record.timeOUT || ""}
                        onChange={(e) =>
                          handleInputChange(index, "timeOUT", e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={saveAll}
            style={{ marginTop: "20px" }}
            startIcon={<SaveAsIcon />}
            
          >
            Save All
          </Button>
        </>
      )}
    </div>
    </Container>
  );
};

export default AttendanceSearch;
