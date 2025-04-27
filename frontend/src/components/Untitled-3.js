const calculateTotalRenderedTime = () => {
  let totalSeconds = 0;

  attendanceData.forEach((row) => {
    const facultyRenderedTime = !row.officialTimeIN || !row.timeOUT || row.formattedFacultyRenderedTime === "NaN:NaN:NaN" ? "00:00:00" : row.formattedFacultyRenderedTime;

    const [hours, minutes, seconds] = facultyRenderedTime.split(":").map(Number);
    totalSeconds += hours * 3600 + minutes * 60 + seconds;
  });

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecs = totalSeconds % 60;

  return `${String(totalHours).padStart(2, "0")}:${String(totalMinutes).padStart(2, "0")}:${String(totalSecs).padStart(2, "0")}`;
};
