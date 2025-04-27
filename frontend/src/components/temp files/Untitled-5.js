  
// FOR FACULTY



// return (
//   <Container>
// <h1>
//   {attendanceData.length > 0
//     ? `View Attendance Records for ${attendanceData[0].username}`
//     : 'View Attendance Records'}
// </h1>

// <TextField
//   label="Person ID"
//   value={personId}
//   onChange={(e) => setPersonId(e.target.value)}
//   InputLabelProps={{ shrink: true }}
// />
// <TextField
//   label="Start Date"
//   type="date"
//   value={startDate}
//   onChange={(e) => setStartDate(e.target.value)}
//   InputLabelProps={{ shrink: true }}
// />
// <TextField
//   label="End Date"
//   type="date"
//   value={endDate}
//   onChange={(e) => setEndDate(e.target.value)}
//   InputLabelProps={{ shrink: true }}
// />
// <Button variant="contained" onClick={handleSearch}>
//   Search
// </Button>

// {/* Wrap Table in a scrollable container */}
// <Box sx={{ overflowX: 'auto', width: '100%', marginTop: 2 }}>
//   <Paper>
//     <Table sx={{ minWidth: '1500px' }}> {/* Ensure table width exceeds screen width */}
//       <TableHead>
//         <TableRow>
//           <TableCell sx={{ width: '80px',textAlign: 'center', }}>Date (MM/DD/YYYY)</TableCell>
//           <TableCell sx={{ width: '50px',textAlign: 'center', }}>Day</TableCell>
//           <TableCell sx={{ width: '150px',textAlign: 'center', }}>Time IN</TableCell>
//           <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             Official Time IN
//           </TableCell>
//           <TableCell sx={{ width: '150px' }}>Break IN</TableCell>
//           <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             Official Breaktime IN
//           </TableCell>
//           <TableCell sx={{ width: '150px' }}>Break OUT</TableCell>
//           <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             Official Breaktime OUT
//           </TableCell>
//           <TableCell sx={{ width: '150px',textAlign: 'center', }}>Time OUT</TableCell>
//           <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             Official Breaktime OUT
//           </TableCell>
//           <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time AM</TableCell>
//           <TableCell sx={{ width: '150px' ,textAlign: 'center',}}>Rendered Time PM</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {attendanceData.map((record, index) => (
          
//           <TableRow key={index}>
//             <TableCell sx={{ width: '80px',textAlign: 'center', }}>{formatDate(record.date)}</TableCell>
//             <TableCell sx={{ width: '50px',textAlign: 'center', }}>
//               {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
//             </TableCell>
//             <TableCell>
//       <TextField 
//         sx={{ width: '120px', textAlign: 'center' }}
//         type="text"
//         value={record.timeIN} // Accessing newTimeIN from record
//         onChange={(e) => handleChange(index, 'timeIN', e.target.value)}
//         placeholder="HH:mm:ss AM/PM"
//       />
//     </TableCell>
//             <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//               {formatTimeTo12Hour(record.officialTimeIN)}
//             </TableCell>
//             <TableCell>
//               <TextField
//                 type="text"
//                 value={record.breaktimeIN}
//                 onChange={(e) => handleChange(index, 'breaktimeIN', e.target.value)}
//                 placeholder="HH:mm:ss AM/PM"
//               />
//             </TableCell>
//             <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             {formatTimeTo12Hour(record.officialBreaktimeIN)}
              
//             </TableCell>
//             <TableCell>
//               <TextField
//                 type="text"
//                 value={record.breaktimeOUT}
//                 onChange={(e) => handleChange(index, 'breaktimeOUT', e.target.value)}
//                 placeholder="HH:mm:ss AM/PM"
//               />
//             </TableCell>
//             <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//               {formatTimeTo12Hour(record.officialBreaktimeOUT)}
//             </TableCell>
//             <TableCell>
//               <TextField
//                 type="text"
//                 value={record.timeOUT}
//                 onChange={(e) => handleChange(index, 'timeOUT', e.target.value)}
//                 placeholder="HH:mm:ss AM/PM"
//               />
//             </TableCell>
//             <TableCell sx={{ backgroundColor: '#d2f8d2', fontWeight: 'bold', width: '100px',textAlign: 'center', }}>
//             {formatTimeTo12Hour(record.officialTimeOUT)}
              
//             </TableCell>
//             <TableCell>
//               {calculateTimeDifference(record.timeIN, record.breaktimeIN)}
//             </TableCell>
//             <TableCell>
//               {calculateTimeDifference(record.newTimeIN, record.newTimeOUT)}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </Paper>
// </Box>

// <Button variant="contained" color="primary" onClick={handleSave}>
//   Save
// </Button>
// </Container>


// );




