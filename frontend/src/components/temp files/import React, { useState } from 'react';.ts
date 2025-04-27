import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
} from '@mui/material';

const ViewAttendance = () => {
  const [personId, setPersonId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  // Function to format the date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // Format as MM/DD/YYYY
  };

  // Ensure time format always has leading zeros for hours
  const ensureTimeFormat = (timeString) => {
    if (!timeString) return '';
    
    const [time, modifier] = timeString.trim().split(' ');
    let [hours, minutes, seconds] = time.split(':');
    
    // Add leading zero to hours if it's single digit
    hours = hours.padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds} ${modifier}`;
  };

  // Function to calculate time difference in HH:mm:ss format
  const calculateTimeDifference = (timeIn, breakIn) => {
    if (!timeIn || !breakIn) return '';

    const timeInDate = new Date(`1970-01-01T${convertTo24Hour(timeIn)}`);
    const breakInDate = new Date(`1970-01-01T${convertTo24Hour(breakIn)}`);

    if (isNaN(timeInDate.getTime()) || isNaN(breakInDate.getTime())) {
      return 'Invalid Time';
    }

    const diff = new Date(breakInDate - timeInDate);
    return `${String(diff.getUTCHours()).padStart(2, '0')}:${String(diff.getUTCMinutes()).padStart(2, '0')}:${String(diff.getUTCSeconds()).padStart(2, '0')}`;
  };

  // Convert 12-hour time to 24-hour format
  const convertTo24Hour = (time) => {
    if (!time) return '';
    
    const [timeStr, modifier] = time.split(' ');
    let [hours, minutes, seconds] = timeStr.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours}:${minutes}:${seconds}`;
  };

  // Handle change of time fields with formatting
  const handleChange = (index, field, value) => {
    const formattedValue = ensureTimeFormat(value);
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index][field] = formattedValue;
    setAttendanceData(updatedAttendanceData);
  };


  // Handle save to send updated data back to the server
  const handleSave = () => {
    const recordsToUpdate = attendanceData.map((record) => ({
      id: record.id,
      timeIN: ensureTimeFormat(record.timeIN),
      breaktimeIN: ensureTimeFormat(record.breaktimeIN),
      breaktimeOUT: ensureTimeFormat(record.breaktimeOUT),
      timeOUT: ensureTimeFormat(record.timeOUT),
    }));

    console.log('Records to update:', recordsToUpdate);

    axios
      .post('http://localhost:5000/api/update-attendance', { records: recordsToUpdate })
      .then((response) => {
        alert('Records updated successfully');
      })
      .catch((error) => {
        console.error('Error updating data:', error.response ? error.response.data : error.message);
      });
      
  };


  function formatTimeTo12Hour(time) {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
  
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
  
    return date.toLocaleTimeString('en-US', options);
  }


// time compute

// for faculty

// Function to compute newTimeIN and newTimeOUT
function computeTime(record) {
  let deviceTimeIN = record.timeIN;
  let deviceTimeOUT = record.timeOUT;

  let deviceBreakIN = record.breaktimeIN;
  let deviceBreakOUT = record.breaktimeOUT;



  let newTimeIN = record.officialTimeIN;
  let newTimeOUT = record.officialTimeOUT;
  console.log(record.officialTimeIN);

  let newBreakTimeIN = record.officialBreaktimeIN;
  let newBreakTimeOUT = record.officialBreaktimeOUT;

  let newHonorariumTimeIN = record.officialHonorariumTimeIN;
  let newHonorariumTimeOUT = record.officialHonorariumTimeOUT;

  let newServiceCreditTimeIN = record.officialServiceCreditTimeIN;
  let newServiceCreditTimeOUT = record.officialServiceCreditTimeOUT;

  let newOvertimeIN = record.officialOverTimeIN;
  let newOvertimeOUT = record.officialOverTimeOUT;
 

  let employeeCategory = record.employmentCategory;
  // let defaultTime = "00:00:00 AM";
  // let newTardinessHN = "00:00:00 AM";
  // let newTardinessSC = "00:00:00 AM";
  // let newTardinessOT = "00:00:00 AM";
  
  if(employeeCategory === 1) { // this is for Non-Teaching

    // Update newTimeIN if condition is met
          if (record.officialTimeIN < record.timeIN) {
            newTimeIN = record.timeIN;
          } else if (record.officialTimeIN > record.timeIN) {
            newTimeIN = record.officialTimeIN;
          }

          // Update newBreakTimeIN if condition is met
          if (record.officialBreaktimeIN > record.deviceBreakIN) {
            newBreakTimeIN = record.deviceBreakIN;
          } else if (record.officialBreaktimeIN < record.deviceBreakIN) {
            newBreakTimeIN = record.officialTimeIN;
          }


          // Update newBreakTimeIN if condition is met
          if (record.officialBreaktimeOUT > record.deviceBreakOUT) {
            newBreakTimeOUT = record.officialBreaktimeOUT;
          } else if (record.officialBreaktimeOUT < record.deviceBreakOUT) {
            newBreakTimeOUT = record.deviceBreakOUT;
          }
      





          // Update newTimeOUT if condition is met
          if (record.officialTimeOUT > record.timeOUT) {
            newTimeOUT = record.timeOUT;
          } else if (record.officialTimeOUT < record.timeOUT) {
            newTimeOUT = record.officialTimeOUT;
          }

          // HONORARIUM 
          if (record.officialHonorariumTimeIN > record.timeIN) {
            newHonorariumTimeIN = record.officialHonorariumTimeIN;
          } else if (record.officialHonorariumTimeIN < record.timeIN) {
            newHonorariumTimeIN = record.timeIN;
          }
          
          
          // OVERTIME 
          if (record.officialOverTimeIN > record.timeIN) {
            newOvertimeIN = record.officialOverTimeIN;
          } else if (record.officialOverTimeIN < record.timeIN) {
            newOvertimeIN = record.officialHonorariumTimeIN;
          }
          


    } // this is for Non-Teaching


    else if (employeeCategory === 0) { // this is for Teaching
       // Update newTimeIN if condition is met
          if (record.officialTimeIN > record.timeIN) {
            newTimeIN = record.timeIN;
          } else if (record.officialTimeIN < record.timeIN) {
            newTimeIN = record.officialTimeIN;
          }

          // Update newTimeOUT if condition is met
          if (record.officialTimeOUT > record.timeOUT) {
            newTimeOUT = record.timeOUT;
          } else if (record.officialTimeOUT < record.timeOUT) {
            newTimeOUT = record.officialTimeOUT;
          }
    } // this is for Teaching


  return { newTimeIN, newTimeOUT, newBreakTimeIN,newBreakTimeOUT, newHonorariumTimeIN, newHonorariumTimeOUT, newServiceCreditTimeIN, newServiceCreditTimeOUT, newOvertimeIN, newOvertimeOUT, deviceBreakIN, deviceBreakOUT, deviceTimeIN, deviceTimeOUT }; // Return both values as an object
}

// Handle search to load attendance records
const handleSearch = () => {
  axios
    .get('http://localhost:5000/api/attendance', {
      params: {
        personId: personId,
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((response) => {
      const formattedData = response.data.map((record) => {
        // Compute newTimeIN and newTimeOUT based on the record
        const { newTimeIN, newTimeOUT, newBreakTimeIN,newBreakTimeOUT, newHonorariumTimeIN, newHonorariumTimeOUT, newServiceCreditTimeIN, newServiceCreditTimeOUT, newOvertimeIN, newOvertimeOUT, deviceBreakIN, deviceBreakOUT, deviceTimeIN, deviceTimeOUT } = computeTime(record);

        // Return formatted data with computed values
        return {
          ...record,
          username: record.username,
          timeIN: ensureTimeFormat(record.timeIN),
          breaktimeIN: ensureTimeFormat(record.breaktimeIN),
          breaktimeOUT: ensureTimeFormat(record.breaktimeOUT),
          timeOUT: ensureTimeFormat(record.timeOUT),
          officialTimeIN: record.officialTimeIN,
          newTimeIN, // Store computed newTimeIN
          newTimeOUT, // Store computed newTimeOUT
          newHonorariumTimeIN: ensureTimeFormat(record.newHonorariumTimeIN),
          newHonorariumTimeOUT: ensureTimeFormat(record.newHonorariumTimeOUT),
          newBreakTimeIN: ensureTimeFormat(record.newBreakTimeIN),
          newBreakTimeOUT: ensureTimeFormat(record.newBreakTimeOUT),
          newServiceCreditTimeIN: ensureTimeFormat(record.newServiceCreditTimeIN),
          newServiceCreditTimeOUT: ensureTimeFormat(record.newServiceCreditTimeOUT),
          newOvertimeIN: ensureTimeFormat(record.newOvertimeIN),
          newOvertimeOUT: ensureTimeFormat(record.newOvertimeOUT),
          deviceBreakIN: ensureTimeFormat(record.deviceBreakIN),
          deviceBreakOUT: ensureTimeFormat(record.deviceBreakOUT),
          deviceTimeIN : ensureTimeFormat(record.deviceTimeIN),
          deviceTimeOUT: ensureTimeFormat(record.deviceTimeOUT),
        };
      });

      // Set the formatted data into state
      setAttendanceData(formattedData);
    })
    .catch((error) => {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    });
};



  return (
    <Container>
  <h1>
    {attendanceData.length > 0
      ? `View Attendance Records for ${attendanceData[0].username} - ${attendanceData[0].employeeNumber}`
      : 'View Attendance Records'}
  </h1>

  <TextField
    label="Person ID"
    value={personId}
    onChange={(e) => setPersonId(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
  <TextField
    label="Start Date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
  <TextField
    label="End Date"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
  <Button variant="contained" onClick={handleSearch}>
    Search
  </Button>

  {/* Wrap Table in a scrollable container */}
  <Box sx={{ overflowX: 'fix', width: '100%', marginTop: 2 }}>
    <Paper>
      <Table sx={{ minWidth: '1500px' }}> {/* Ensure table width exceeds screen width */}
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '80px',textAlign: 'center', }}>Date (MM/DD/YYYY)</TableCell>
            <TableCell sx={{ width: '50px',textAlign: 'center', }}>Day</TableCell>
            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Time IN</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Time IN
            </TableCell>
            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Break IN</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Breaktime IN
            </TableCell>
            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Break OUT</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Breaktime OUT
            </TableCell>
            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Time OUT</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official TIME-OUT
            </TableCell>


            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Honorarium Time-in</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Honorarium Time-in
            </TableCell>
            
            <TableCell sx={{ width: '150px',textAlign: 'center', }}>Honorarium Time-out</TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Honorarium Time-out
            </TableCell>

            
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Overtime Time-in
            </TableCell>
            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Overtime Time-out
            </TableCell>

            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Service Credit Time-in
            </TableCell>

            <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              Official Service Credit Time-out
            </TableCell>




            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time AM</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Tardiness Time AM</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time PM</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Tardiness Time AM</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time Honorarium</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Tardiness Honorarium</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time Overtime</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Tardiness Overtime</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time Service Credit</TableCell>
            <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Tardiness Service Credit</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((record, index) => (
            
            <TableRow key={index}>
              <TableCell sx={{ width: '80px',textAlign: 'center', }}>{formatDate(record.date)}</TableCell>
              <TableCell sx={{ width: '50px',textAlign: 'center', }}>
                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </TableCell>
              <TableCell>
        <TextField 
          sx={{ width: '120px', textAlign: 'center' }}
          type="text"
          value={record.timeIN} // Accessing newTimeIN from record
          onChange={(e) => handleChange(index, 'timeIN', e.target.value)}
          placeholder="HH:mm:ss AM/PM"
        />
      </TableCell>
              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
                {formatTimeTo12Hour(record.officialTimeIN)}
              </TableCell>
              <TableCell>
                <TextField
                sx={{ width: '120px', textAlign: 'center' }}
                  type="text"
                  value={record.breaktimeIN}
                  onChange={(e) => handleChange(index, 'breaktimeIN', e.target.value)}
                  placeholder="HH:mm:ss AM/PM"
                />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.officialBreaktimeIN)}
                
              </TableCell>
              <TableCell>
                <TextField
                sx={{ width: '120px', textAlign: 'center' }}
                  type="text"
                  value={record.breaktimeOUT}
                  onChange={(e) => handleChange(index, 'breaktimeOUT', e.target.value)}
                  placeholder="HH:mm:ss AM/PM"
                />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
                {formatTimeTo12Hour(record.officialBreaktimeOUT)}
              </TableCell>
              <TableCell>
                <TextField
                sx={{ width: '120px', textAlign: 'center' }}
                  type="text"
                  value={record.timeOUT}
                  onChange={(e) => handleChange(index, 'timeOUT', e.target.value)}
                  placeholder="HH:mm:ss AM/PM"
                />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.officialTimeOUT)}
                
              </TableCell>


              
              {/* HONORARIUM */}
              <TableCell sx={{ backgroundColor: '', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.newHonorariumTimeIN)} --
              </TableCell>

              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.officialHonorariumTimeIN)}
              </TableCell>

              {/* SERVICE CREDIT */}
              <TableCell sx={{ backgroundColor: '', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.newServiceCreditTimeIN)}
              </TableCell>

              <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
              {formatTimeTo12Hour(record.officialServiceCreditTimeIN)}
              </TableCell>





              <TableCell>
                {calculateTimeDifference(record.timeIN, record.breaktimeIN)}
              </TableCell>
              <TableCell>
                {calculateTimeDifference(record.timeIN, record.breaktimeIN)}
              </TableCell>
              <TableCell>
                {calculateTimeDifference(record.newTimeIN, record.newTimeOUT)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>

  <Button variant="contained" color="primary" onClick={handleSave}>
    Save
  </Button>
</Container>


  );
  
 



};

export default ViewAttendance;