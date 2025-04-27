
// // Function to compute newTimeIN and newTimeOUT
// function computeTime(record) {
//   let newTimeIN = record.officialTimeIN;
//   let newTimeOUT = record.officialTimeOUT;

//   let newBreakTimeIN = record.officialBreaktimeIN;
//   let newBreakTimeOUT = record.officialBreaktimeOUT;

//   let newHonorariumTimeIN = record.officialHonorariumTimeIN;
//   let newHonorariumTimeOUT = record.officialHonorariumTimeOUT;

//   let newServiceCreditTimeIN = record.officialServiceCreditTimeIN;
//   let newServiceCreditTimeOUT = record.officialServiceCreditTimeOUT;

//   let newOvertimeIN = record.officialOverTimeIN;
//   let newOvertimeOUT = record.officialOverTimeOUT;


//   let employeeCategory = record.employmentCategory;

  
//   if(employeeCategory == 1) { // this is for Non-Teaching

//     // Update newTimeIN if condition is met
//           if (record.officialTimeIN > record.timeIN) {
//             newTimeIN = record.timeIN;
//           } else if (record.officialTimeIN < record.timeIN) {
//             newTimeIN = record.officialTimeIN;
//           }

//           // Update newBreakTimeIN if condition is met
//           if (record.officialBreaktimeIN > record.breakIn) {
//             newTimeIN = record.timeIN;
//           } else if (record.officialTimeIN < record.timeIN) {
//             newTimeIN = record.officialTimeIN;
//           }




//           // Update newTimeOUT if condition is met
//           if (record.officialTimeOUT > record.timeOUT) {
//             newTimeOUT = record.timeOUT;
//           } else if (record.officialTimeOUT < record.timeOUT) {
//             newTimeOUT = record.officialTimeOUT;
//           }
//     } // this is for Non-Teaching


//     else if (employeeCategory == 0) { // this is for Teaching
//        // Update newTimeIN if condition is met
//           if (record.officialTimeIN > record.timeIN) {
//             newTimeIN = record.timeIN;
//           } else if (record.officialTimeIN < record.timeIN) {
//             newTimeIN = record.officialTimeIN;
//           }

//           // Update newTimeOUT if condition is met
//           if (record.officialTimeOUT > record.timeOUT) {
//             newTimeOUT = record.timeOUT;
//           } else if (record.officialTimeOUT < record.timeOUT) {
//             newTimeOUT = record.officialTimeOUT;
//           }
//     } // this is for Teaching


//   return { newTimeIN, newTimeOUT, newBreakTimeIN,newBreakTimeOUT, newHonorariumTimeIN, newHonorariumTimeOUT, newServiceCreditTimeIN, newServiceCreditTimeOUT, newOvertimeIN, newOvertimeOUT }; // Return both values as an object
// }

// // Handle search to load attendance records
// const handleSearch = () => {
//   axios
//     .get('http://localhost:5000/api/attendance', {
//       params: {
//         personId: personId,
//         startDate: startDate,
//         endDate: endDate,
//       },
//     })
//     .then((response) => {
//       const formattedData = response.data.map((record) => {
//         // Compute newTimeIN and newTimeOUT based on the record
//         const { newTimeIN, newTimeOUT, newBreakTimeIN,newBreakTimeOUT, newHonorariumTimeIN, newHonorariumTimeOUT, newServiceCreditTimeIN, newServiceCreditTimeOUT, newOvertimeIN, newOvertimeOUT } = computeTime(record);

//         // Return formatted data with computed values
//         return {
//           ...record,
//           username: record.username,
//           timeIN: ensureTimeFormat(record.timeIN),
//           breaktimeIN: ensureTimeFormat(record.breaktimeIN),
//           breaktimeOUT: ensureTimeFormat(record.breaktimeOUT),
//           timeOUT: ensureTimeFormat(record.timeOUT),
//           officialTimeIN: record.officialTimeIN,
//           newTimeIN, // Store computed newTimeIN
//           newTimeOUT, // Store computed newTimeOUT
//         };
//       });

//       // Set the formatted data into state
//       setAttendanceData(formattedData);
//     })
//     .catch((error) => {
//       console.error('Error fetching data:', error.response ? error.response.data : error.message);
//     });
// };
