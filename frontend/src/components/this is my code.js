this is my code


const AttendanceModuleFaculty = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/attendance/api/attendance", {
        params: {
          personId: employeeNumber,
          startDate,
          endDate,
        },
      });




        // rendered time
        // Convert time strings to Date objects
        const startDateFaculty = new Date(`01/01/2000 ${timeIN}`);
        const endDateFaculty = new Date(`01/01/2000 ${timeOUT}`);
        const startOfficialTimeFaculty = new Date(`01/01/2000 ${officialTimeIN}`);
        const endOfficialTimeFaculty = new Date(`01/01/2000 ${officialTimeOUT}`);

        const defaultTimeFaculty = "00:00:00 AM";
        const midnightFaculty = new Date(`01/01/2000 ${defaultTimeFaculty}`);

        const timeinfaculty = startDateFaculty > endOfficialTimeFaculty ? midnightFaculty : startDateFaculty < startOfficialTimeFaculty ? startOfficialTimeFaculty : startDateFaculty;
        const timeoutfaculty = timeinfaculty === midnightFaculty ? midnightFaculty : endDateFaculty < endOfficialTimeFaculty ? endDateFaculty : endOfficialTimeFaculty;

        // Calculate difference in milliseconds
        const diffMs = timeoutfaculty - timeinfaculty;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFaculty = Math.floor(diffMs / (1000 * 60 * 60));
        const minutesFaculty = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFaculty = Math.floor((diffMs % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS RENDERERED TIME
        const formattedFacultyRenderedTime = [String(hoursFaculty).padStart(2, "0"), String(minutesFaculty).padStart(2, "0"), String(secondsFaculty).padStart(2, "0")].join(":");

        //end rendered time

        //  max rendered time

        // Calculate difference in milliseconds MAX RENDERED TIME
        const diffMsFaculty = endOfficialTimeFaculty - startOfficialTimeFaculty;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyMRT = Math.floor(diffMsFaculty / (1000 * 60 * 60));
        const minutesFacultyMRT = Math.floor((diffMsFaculty % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyMRT = Math.floor((diffMsFaculty % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedFacultyMaxRenderedTime = [String(hoursFacultyMRT).padStart(2, "0"), String(minutesFacultyMRT).padStart(2, "0"), String(secondsFacultyMRT).padStart(2, "0")].join(":");

        // Calculate difference in milliseconds MAX RENDERED TIME

        const tardFinalformattedFacultyRenderedTime = new Date(`01/01/2000 ${formattedFacultyRenderedTime}`);
        const tardFinalformattedFacultyMaxRenderedTime = new Date(`01/01/2000 ${formattedFacultyMaxRenderedTime}`);

        const finalcalcFaculty = tardFinalformattedFacultyMaxRenderedTime - tardFinalformattedFacultyRenderedTime;

        // Convert milliseconds to hours, minutes, seconds
        const hoursfinalcalcFaculty = Math.floor(finalcalcFaculty / (1000 * 60 * 60));
        const minutesfinalcalcFaculty = Math.floor((finalcalcFaculty % (1000 * 60 * 60)) / (1000 * 60));
        const secondsfinalcalcFaculty = Math.floor((finalcalcFaculty % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedfinalcalcFaculty = [String(hoursfinalcalcFaculty).padStart(2, "0"), String(minutesfinalcalcFaculty).padStart(2, "0"), String(secondsfinalcalcFaculty).padStart(2, "0")].join(":");

        // // end max rendered time

return {
          ...row,
          HonorariumTimeIN,          HonorariumTimeOUT,          ServiceCreditTimeIN,          ServiceCreditTimeOUT,          OverTimeIN,          OverTimeOUT,          officialTimeIN,          officialTimeOUT,          officialHonorariumTimeIN,          officialHonorariumTimeOUT,          officialServiceCreditTimeIN,          officialServiceCreditTimeOUT,         officialOverTimeIN,          officialOverTimeOUT,          OfficialTimeMorning,          OfficialTimeAfternoon,          timeIN,          timeOUT,          OfficialBreakPM,          breaktimeIN,          breaktimeOUT,          midnightFaculty,          finalcalcFaculty,          formattedfinalcalcFaculty,          formattedFacultyRenderedTime,          formattedFacultyMaxRenderedTime,          formattedfinalcalcFacultyHN,          formattedFacultyRenderedTimeHN,          formattedFacultyMaxRenderedTimeHN,          formattedfinalcalcFacultySC,         formattedFacultyRenderedTimeSC,          formattedFacultyMaxRenderedTimeSC,          formattedfinalcalcFacultyOT,          formattedFacultyRenderedTimeOT,          formattedFacultyMaxRenderedTimeOT,      };
      });

      setAttendanceData(processedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };




  return (
    <Container
      maxWidth={false} // Disable the default maxWidth
      sx={{
        maxWidth: "4500px", // Set your custom width
        margin: "0 auto", // Center the container
        padding: "0px", // Optional padding
      }}
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Report
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Employee Number"
              variant="outlined"
              fullWidth
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              required
              sx={{ width: "250px", marginLeft: "10px" }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              sx={{ width: "250px", marginLeft: "10px" }}
            />

            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              sx={{ width: "250px", marginLeft: "10px" }}
            />
            <Button sx={{ width: "200px", height: "55px", marginLeft: "10px" }} type="submit" variant="contained" color="primary" fullWidth>
              Generate Report
            </Button>
          </Box>

          {attendanceData.length > 0 && (
            <Button variant="contained" color="primary" onClick={downloadExcel} sx={{ mb: 2 }}>
              Download Excel for Users
            </Button>
          )}
        </form>

        {attendanceData.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4 }} style={{ marginBottom: "5%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "150px",
                      maxWidth: "150px",
                      minWidth: "150px",
                      textAlign: "center", // Optional: ensures text alignment remains consistent
                      overflow: "hidden", // Optional: handle overflow
                      textOverflow: "ellipsis", // Optional: adds ellipsis for overflowing text
                      whiteSpace: "nowrap", // Optional: prevents text wrapping
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      maxWidth: "150px",
                      minWidth: "120px",
                      textAlign: "center", // Optional: ensures text alignment remains consistent
                      overflow: "hidden", // Optional: handle overflow
                      textOverflow: "ellipsis", // Optional: adds ellipsis for overflowing text
                      whiteSpace: "nowrap",
                    }}
                  >
                    Day
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "150px",
                      maxWidth: "150px",
                      minWidth: "120px",
                      textAlign: "center", // Optional: ensures text alignment remains consistent
                      overflow: "hidden", // Optional: handle overflow
                      textOverflow: "ellipsis", // Optional: adds ellipsis for overflowing text
                      whiteSpace: "nowrap", // Optional: prevents text wrapping
                    }}
                  >
                    Time IN
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      maxWidth: "150px",
                      minWidth: "120px",
                      textAlign: "center", // Optional: ensures text alignment remains consistent
                      overflow: "hidden", // Optional: handle overflow
                      textOverflow: "ellipsis", // Optional: adds ellipsis for overflowing text
                      whiteSpace: "nowrap",
                    }}
                  >
                    Official Time IN
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "150px",
                      maxWidth: "150px",
                      minWidth: "120px",
                      textAlign: "center", // Optional: ensures text alignment remains consistent
                      overflow: "hidden", // Optional: handle overflow
                      textOverflow: "ellipsis", // Optional: adds ellipsis for overflowing text
                      whiteSpace: "nowrap", // Optional: prevents text wrapping
                    }}
                  >
                    Time OUT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Official Time OUT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#bafac6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Official Regular Duty Rendered Time
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Tardiness (Official Regular Duty)
                  </TableCell>

                </TableRow> 
 </TableHead>
</Table>
</TableContainer>
</Box>
</Container>
