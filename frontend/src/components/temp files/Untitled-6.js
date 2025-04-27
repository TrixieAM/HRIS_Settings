
// time compute

// for faculty

// Function to compute newTimeIN and newTimeOUT

// function computeTime(record) {
//   let newTimeIN = record.officialTimeIN;
//   let newTimeOUT = record.officialTimeOUT;

//   let newBreakTimeIN = record.officialBreaktimeIN;
//   let newBreakTimeOUT = record.officialBreaktimeOUT;

//   let newHonorariumTimeIN = formatTimeTo12Hour(record.officialHonorariumTimeIN);
//   let newHonorariumTimeOUT = formatTimeTo12Hour(record.officialHonorariumTimeOUT);

//   let newServiceCreditTimeIN = record.officialServiceCreditTimeIN;
//   let newServiceCreditTimeOUT = record.officialServiceCreditTimeOUT;

//   let newOvertimeIN = record.officialOverTimeIN;
//   let newOvertimeOUT = record.officialOverTimeOUT;
//   let defaultTime = "00:00:00 AM";

//   let employeeCategory = record.employmentCategory;

//   let newTardinessHN = "00:00:00 AM";
//   let newTardinessSC = "00:00:00 AM";
//   let newTardinessOT = "00:00:00 AM";
//   let deviceTimeIN = record.timeIN;

//   if(employeeCategory == 1) { // this is for Non-Teaching

//     // Update newTimeIN if condition is met
//           if (record.officialTimeIN < record.timeIN) {
//             newTimeIN = record.timeIN;
//           } else if (record.officialTimeIN > record.timeIN) {
//             newTimeIN = record.officialTimeIN;
//           }

//           // Update newBreakTimeIN if condition is met
//           if (record.officialBreaktimeIN > record.breakIn) {
//             newBreakTimeIN = record.breakIn;
//           } else if (record.officialBreaktimeIN < record.breakIn) {
//             newBreakTimeIN = record.officialTimeIN;
//           }


//           // Update newBreakTimeIN if condition is met
//           if (record.officialBreaktimeOUT > record.breaktimeOUT) {
//             newBreakTimeOUT = record.officialBreaktimeOUT;
//           } else if (record.officialBreaktimeOUT < record.breaktimeOUT) {
//             newBreakTimeOUT = record.breaktimeOUT;
//           }
      





//           // Update newTimeOUT if condition is met
//           if (record.officialTimeOUT > record.timeOUT) {
//             newTimeOUT = record.timeOUT;
//           } else if (record.officialTimeOUT < record.timeOUT) {
//             newTimeOUT = record.officialTimeOUT;
//           }

//           // HONORARIUM 
//           if (record.officialHonorariumTimeIN < record.timeIN) {
//             newHonorariumTimeIN = record.timeIN;
//           } else if (record.officialHonorariumTimeIN > record.timeIN) {
//             newHonorariumTimeIN = record.officialHonorariumTimeIN ;
//           }
          
          
//           // OVERTIME 
//           if (record.officialOverTimeIN > record.timeIN) {
//             newOvertimeIN = record.officialOverTimeIN;
//           } else if (record.officialOverTimeIN < record.timeIN) {
//             newOvertimeIN = record.officialHonorariumTimeIN;
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


//   return { newTimeIN, newTimeOUT, newBreakTimeIN,newBreakTimeOUT, newHonorariumTimeIN, newHonorariumTimeOUT, newServiceCreditTimeIN, newServiceCreditTimeOUT, newOvertimeIN, newOvertimeOUT, deviceTimeIN }; // Return both values as an object
// }

