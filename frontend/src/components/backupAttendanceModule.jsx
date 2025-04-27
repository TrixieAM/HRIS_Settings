import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const AttendanceModule = () => {
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

      const processedData = response.data.map((row) => {
        const { timeIN, timeOUT, breaktimeIN, breaktimeOUT, officialBreaktimeIN, officialBreaktimeOUT, officialTimeIN, officialTimeOUT, officialHonorariumTimeIN, officialHonorariumTimeOUT, officialServiceCreditTimeIN, officialServiceCreditTimeOUT, officialOverTimeIN, officialOverTimeOUT } = row;

        const defaultTime = "12:00:00 AM";
        // Parse the times for comparison
        const parsedDefaultTime = dayjs(`2024-01-01 ${defaultTime}`, "YYYY-MM-DD hh:mm:ss A");

        const parsedTimeIN = dayjs(`2024-01-01 ${timeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedTimeOUT = dayjs(`2024-01-01 ${timeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedBreaktimeIN = dayjs(`2024-01-01 ${breaktimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedBreaktimeOUT = dayjs(`2024-01-01 ${breaktimeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedOfficialBreaktimeIN = dayjs(`2024-01-01 ${officialBreaktimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedOfficialBreaktimeOUT = dayjs(`2024-01-01 ${officialBreaktimeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedOfficialTimeIN = dayjs(`2024-01-01 ${officialTimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedOfficialTimeOUT = dayjs(`2024-01-01 ${officialTimeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedOfficialHonorariumTimeIN = dayjs(`2024-01-01 ${officialHonorariumTimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedOfficialHonorariumTimeOUT = dayjs(`2024-01-01 ${officialHonorariumTimeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedOfficialServiceCreditTimeIN = dayjs(`2024-01-01 ${officialServiceCreditTimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedOfficialServiceCreditTimeOUT = dayjs(`2024-01-01 ${officialServiceCreditTimeOUT}`, "YYYY-MM-DD hh:mm:ss A");
        const parsedOfficialOverTimeIN = dayjs(`2024-01-01 ${officialOverTimeIN}`, "YYYY-MM-DD hh:mm:ss A"); // Example date
        const parsedOfficialOverTimeOUT = dayjs(`2024-01-01 ${officialOverTimeOUT}`, "YYYY-MM-DD hh:mm:ss A");

        const OfficialTimeMorning = parsedTimeIN.isBefore(parsedOfficialTimeIN) ? parsedOfficialTimeIN.format("hh:mm:ss A") : parsedTimeIN.format("hh:mm:ss A");

        const OfficialTimeAfternoon = parsedTimeOUT.isAfter(parsedOfficialTimeOUT) ? parsedOfficialTimeOUT.format("hh:mm:ss A") : parsedTimeOUT.format("hh:mm:ss A");

        const HonorariumTimeIN = parsedTimeIN.isBefore(parsedOfficialHonorariumTimeIN) ? parsedOfficialHonorariumTimeIN.format("hh:mm:ss A") : parsedTimeIN.format("hh:mm:ss A");

        const HonorariumTimeOUT = parsedTimeOUT.isAfter(parsedOfficialHonorariumTimeOUT) ? parsedOfficialHonorariumTimeOUT.format("hh:mm:ss A") : parsedTimeOUT.format("hh:mm:ss A");

        const ServiceCreditTimeIN = parsedTimeIN.isBefore(parsedOfficialServiceCreditTimeIN) ? parsedOfficialServiceCreditTimeIN.format("hh:mm:ss A") : parsedTimeIN.format("hh:mm:ss A");

        const ServiceCreditTimeOUT = parsedTimeOUT.isAfter(parsedOfficialServiceCreditTimeOUT) ? parsedOfficialServiceCreditTimeOUT.format("hh:mm:ss A") : parsedTimeOUT.format("hh:mm:ss A");

        const OverTimeIN = parsedTimeIN.isBefore(parsedOfficialOverTimeIN) ? parsedOfficialOverTimeIN.format("hh:mm:ss A") : parsedTimeIN.format("hh:mm:ss A");

        const OverTimeOUT = parsedTimeOUT.isAfter(parsedOfficialOverTimeOUT) ? parsedOfficialOverTimeOUT.format("hh:mm:ss A") : parsedTimeOUT.format("hh:mm:ss A");

        const OfficialBreakAM = parsedBreaktimeIN.isAfter(parsedOfficialBreaktimeIN) ? parsedOfficialBreaktimeIN.format("hh:mm:ss A") : parsedBreaktimeIN.format("hh:mm:ss A");

        const OfficialBreakPM = parsedBreaktimeOUT.isAfter(parsedOfficialBreaktimeOUT) ? parsedBreaktimeOUT.format("hh:mm:ss A") : parsedOfficialBreaktimeOUT.format("hh:mm:ss A");

        const tardBreakIN = parsedOfficialBreaktimeIN.format("hh:mm:ss A");
        const tardTimeIN = parsedOfficialTimeIN.format("hh:mm:ss A");
        const tardBreakOUT = parsedOfficialBreaktimeOUT.format("hh:mm:ss A");
        const tardTimeOut = parsedOfficialTimeOUT.format("hh:mm:ss A");
        const tardHNIn = parsedOfficialHonorariumTimeIN.format("hh:mm:ss A");
        const tardHNOut = parsedOfficialHonorariumTimeOUT.format("hh:mm:ss A");
        const tardSCIn = parsedOfficialServiceCreditTimeIN.format("hh:mm:ss A");
        const tardSCOut = parsedOfficialServiceCreditTimeOUT.format("hh:mm:ss A");
        const tardOTIn = parsedOfficialOverTimeIN.format("hh:mm:ss A");
        const tardOTOut = parsedOfficialOverTimeOUT.format("hh:mm:ss A");

        // Function to calculate time difference in HH:mm:ss format
        const calculateTimeDifference = (timeIN, timeOUT) => {
          if (!timeIN || !timeOUT) return "";

          const timeInDate = new Date(`1970-01-01T${convertTo24Hour(timeIN)}`);
          const timeOutDate = new Date(`1970-01-01T${convertTo24Hour(timeOUT)}`);

          if (isNaN(timeInDate.getTime()) || isNaN(timeOutDate.getTime())) {
            return "00:00:00";
          }

          const diff = new Date(timeOutDate - timeInDate);
          return `${String(diff.getUTCHours()).padStart(2, "0")}:${String(diff.getUTCMinutes()).padStart(2, "0")}:${String(diff.getUTCSeconds()).padStart(2, "0")}`;
        };

        // Convert 12-hour time to 24-hour format
        const convertTo24Hour = (time) => {
          if (!time) return "";

          const [timeStr, modifier] = time.split(" ");
          let [hours, minutes, seconds] = timeStr.split(":");

          if (modifier === "PM" && hours !== "12") {
            hours = String(Number(hours) + 12);
          } else if (modifier === "AM" && hours === "12") {
            hours = "00";
          }

          return `${hours}:${minutes}:${seconds}`;
        };

        // Function to compare times in HH:mm:ss format
        const isTimeGreaterThan = (time1, time2) => {
          const [h1, m1, s1] = time1.split(":").map(Number);
          const [h2, m2, s2] = time2.split(":").map(Number);
          return h1 > h2 || (h1 === h2 && (m1 > m2 || (m1 === m2 && s1 > s2)));
        };

        // Function to calculate and reset time difference if it exceeds threshold
        const calculateAdjustedTimeDifference = (timeIN, timeOUT, threshold = "08:00:00") => {
          const timeDifference = calculateTimeDifference(timeIN, timeOUT);
          if (isTimeGreaterThan(timeDifference, threshold)) {
            return "00:00:00";
          }
          return timeDifference;
        };

        // Calculate and adjust each time difference
        const timeDifferenceHonorarium = calculateAdjustedTimeDifference(HonorariumTimeIN, HonorariumTimeOUT);
        const timeDifferenceServiceCredit = calculateAdjustedTimeDifference(ServiceCreditTimeIN, ServiceCreditTimeOUT);
        const timeDifferenceOvertime = calculateAdjustedTimeDifference(OverTimeIN, OverTimeOUT);
        const timeDifferenceAM = calculateAdjustedTimeDifference(OfficialTimeMorning, OfficialBreakAM);
        const timeDifferencePM = calculateAdjustedTimeDifference(OfficialBreakPM, OfficialTimeAfternoon);

        const tardtimeDifferenceAM1 = calculateTimeDifference(OfficialBreakAM, tardBreakIN);
        const tardtimeDifferenceAM2 = calculateTimeDifference(tardTimeIN, OfficialTimeMorning);

        const tardtimeDifferencePM1 = calculateTimeDifference(tardBreakOUT, OfficialBreakPM);
        const tardtimeDifferencePM2 = calculateTimeDifference(OfficialTimeAfternoon, tardTimeOut);

        const tardtimeDifferenceHN1 = calculateTimeDifference(HonorariumTimeIN, tardHNIn);
        const tardtimeDifferenceHN2 = calculateTimeDifference(HonorariumTimeOUT, tardHNOut);

        const tardtimeDifferenceSC1 = calculateTimeDifference(ServiceCreditTimeIN, tardSCIn);
        const tardtimeDifferenceSC2 = calculateTimeDifference(ServiceCreditTimeOUT, tardSCOut);

        const tardtimeDifferenceOT1 = calculateTimeDifference(OverTimeIN, tardOTIn);
        const tardtimeDifferenceOT2 = calculateTimeDifference(OverTimeOUT, tardOTOut);

        function addTimeStrings(time1, time2) {
          // Split the time strings into hours, minutes, and seconds
          const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
          const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

          // Add the seconds, minutes, and hours
          let totalSeconds = seconds1 + seconds2;
          let totalMinutes = minutes1 + minutes2 + Math.floor(totalSeconds / 60);
          let totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60);

          // Normalize the seconds and minutes
          totalSeconds %= 60;
          totalMinutes %= 60;

          // Format the result back into HH:MM:SS
          const formattedHours = String(totalHours).padStart(2, "0");
          const formattedMinutes = String(totalMinutes).padStart(2, "0");
          const formattedSeconds = String(totalSeconds).padStart(2, "0");

          return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }

        const theOfficialTimeIN = parsedOfficialTimeIN.format("hh:mm:ss A");
        const theOfficialBreaktimeIN = parsedOfficialBreaktimeIN.format("hh:mm:ss A");

        const theOfficialBreaktimeOUT = parsedOfficialOverTimeOUT.format("hh:mm:ss A");
        const theOfficialTimeOUT = parsedOfficialTimeOUT.format("hh:mm:ss A");

        const theOfficialHonorariumTimeIN = parsedOfficialHonorariumTimeIN.format("hh:mm:ss A");
        const theOfficialHonorariumTimeOUT = parsedOfficialHonorariumTimeOUT.format("hh:mm:ss A");

        const theOfficialServiceCreditTimeIN = parsedOfficialServiceCreditTimeIN.format("hh:mm:ss A");
        const theOfficialServiceCreditTimeOUT = parsedOfficialServiceCreditTimeOUT.format("hh:mm:ss A");

        const theOfficialOverTimeIN = parsedOfficialOverTimeIN.format("hh:mm:ss A");
        const theOfficialOverTimeOUT = parsedOfficialOverTimeOUT.format("hh:mm:ss A");

        const maxRenderedTimeAM = calculateTimeDifference(theOfficialTimeIN, theOfficialBreaktimeIN);
        const maxRenderedTimePM = calculateTimeDifference(theOfficialBreaktimeOUT, theOfficialTimeOUT);

        const maxRenderedTimeHN = calculateTimeDifference(theOfficialHonorariumTimeIN, theOfficialHonorariumTimeOUT);
        const maxRenderedTimeSC = calculateTimeDifference(theOfficialServiceCreditTimeIN, theOfficialServiceCreditTimeOUT);

        const maxRenderedTimeOT = calculateTimeDifference(theOfficialOverTimeIN, theOfficialOverTimeOUT);

        const tardAM = addTimeStrings(tardtimeDifferenceAM1, tardtimeDifferenceAM2);

        const tardPM = addTimeStrings(tardtimeDifferencePM1, tardtimeDifferencePM2);
        const tardHN = addTimeStrings(tardtimeDifferenceHN1, tardtimeDifferenceHN2);
        const tardSC = addTimeStrings(tardtimeDifferenceSC1, tardtimeDifferenceSC2);
        const tardOT = addTimeStrings(tardtimeDifferenceOT1, tardtimeDifferenceOT2);

        const tardAMFinal = maxRenderedTimeAM < tardAM ? "00:00:00" : tardAM;

        const tardPMFinal = maxRenderedTimePM < tardPM ? "00:00:00" : tardPM;

        const tardHNFinal = maxRenderedTimeHN < tardHN ? "00:00:00" : tardHN;
        const tardSCFinal = maxRenderedTimeSC < tardSC ? "00:00:00" : tardSC;

        const tardOTFinal = maxRenderedTimeOT < tardOT ? "00:00:00" : tardOT;

        return {
          ...row,
          HonorariumTimeIN,
          HonorariumTimeOUT,
          ServiceCreditTimeIN,
          ServiceCreditTimeOUT,
          OverTimeIN,
          OverTimeOUT,
          officialTimeIN,
          officialTimeOUT,
          officialHonorariumTimeIN,
          officialHonorariumTimeOUT,
          officialServiceCreditTimeIN,
          officialServiceCreditTimeOUT,
          officialOverTimeIN,
          officialOverTimeOUT,
          OfficialTimeMorning,
          OfficialTimeAfternoon,
          timeDifferenceHonorarium,
          timeDifferenceServiceCredit,
          timeDifferenceOvertime,
          timeDifferenceAM,
          timeDifferencePM,
          timeIN,
          timeOUT,
          parsedDefaultTime,
          tardtimeDifferenceAM1,
          tardAM,
          tardAMFinal,
          tardPMFinal,
          OfficialBreakPM,
          breaktimeIN,
          breaktimeOUT,
          tardHNFinal,
          tardSCFinal,
          tardOTFinal,
          tardtimeDifferenceHN1,
        };
      });

      setAttendanceData(processedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Helper function to convert HH:mm:ss to total seconds
  // Helper function to convert HH:mm:ss to total seconds
  const timeToSeconds = (time) => {
    const ZERO_TIME = "00:00:00"; // Define ZERO_TIME as a fallback value
    if (!time || time === ZERO_TIME) return 0;
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Helper function to convert total seconds to HH:mm:ss
  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}hrs, ${String(minutes).padStart(2, "0")} minutes and, ${String(seconds).padStart(2, "0")} seconds`;
  };

  const secondsToTimeSaved = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Calculate total time for each category
  const calculateTotalTimeAM = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceAM), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTimeAMSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceAM), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTimePM = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferencePM), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTimePMSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferencePM), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTimeHN = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceHonorarium), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTimeHNSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceHonorarium), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTimeSC = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceServiceCredit), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTimeSCSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceServiceCredit), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTimeOT = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceOvertime), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardAM = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardAMFinal), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardPM = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardPMFinal), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardHN = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardHNFinal), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardSC = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardSCFinal), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardOT = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardOTFinal), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardAMSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardAMFinal), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTardPMSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardPMFinal), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTardHNSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardHNFinal), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTardSCSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardSCFinal), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTardOTSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.tardOTFinal), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  const calculateTotalTimeOTSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceOvertime), 0);
    return secondsToTimeSaved(totalSeconds);
  };

  // Calculate overall total time
  const calculateOverallTime = () => {
    const totalSecondsAM = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceAM), 0);

    const totalSecondsPM = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferencePM), 0);

    const totalSecondsHN = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceHonorarium), 0);

    const totalSecondsSC = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceServiceCredit), 0);

    const totalSecondsOT = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceOvertime), 0);

    // Sum up all the total seconds
    const overallTotalSeconds = totalSecondsAM + totalSecondsPM + totalSecondsHN + totalSecondsSC + totalSecondsOT;

    // Convert total seconds to HH:mm:ss
    return secondsToTime(overallTotalSeconds);
  };

  const calculateOverallTimeSaved = () => {
    const totalSecondsAM = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceAM), 0);

    const totalSecondsPM = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferencePM), 0);

    const totalSecondsHN = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceHonorarium), 0);

    const totalSecondsSC = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceServiceCredit), 0);

    const totalSecondsOT = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceOvertime), 0);

    const totalSecondsTARTAM = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.timeDifferenceOvertime), 0);

    // Sum up all the total seconds
    const overallTotalSeconds = totalSecondsAM + totalSecondsPM + totalSecondsHN + totalSecondsSC + totalSecondsOT;

    // Convert total seconds to HH:mm:ss
    return secondsToTimeSaved(overallTotalSeconds);
  };

  const saveOverallAttendance = async () => {
    console.log("Employee Number:", employeeNumber);
    const record = {
      employeeNumber,
      startDate,
      endDate,
      totalRenderedTimeMorning: calculateTotalTimeAMSaved("timeDifferenceAM"),
      totalTardAM: calculateTotalTardAMSaved(),
      totalRenderedTimeAfternoon: calculateTotalTimePMSaved("timeDifferencePM"),
      totalTardPM: calculateTotalTardPMSaved(),
      totalRenderedHonorarium: calculateTotalTimeHNSaved("timeDifferenceHonorarium"),
      totalTardHR: calculateTotalTardHNSaved(),
      totalRenderedServiceCredit: calculateTotalTimeSCSaved("timeDifferenceServiceCredit"),
      totalTardSC: calculateTotalTardSCSaved(),
      totalRenderedOvertime: calculateTotalTimeOTSaved("timeDifferenceOvertime"),
      totalTardOT: calculateTotalTardOTSaved(),
      overallRenderedTime: calculateOverallTimeSaved(),
    };

    try {
      const response = await axios.post("http://localhost:5000/attendance/api/overall_attendance", record);
      alert(response.data.message || "Attendance record saved successfully!");
    } catch (error) {
      console.error("Error saving overall attendance:", error);
      alert("Failed to save attendance record.");
    }
  };

  const downloadExcel = () => {
    const data = attendanceData.map((row) => ({
      Date: row.date,
      Day: row.day,
      "Time IN": row.timeIN,
      "Official Time IN": row.officialTimeIN,
      "Breaktime IN": row.breaktimeIN,
      "Official Breaktime IN": row.officialBreaktimeIN,
      "Morning Rendered Time": row.timeDifferenceAM,
      "Breaktime OUT": row.breaktimeOUT,
      "Official Breaktime OUT": row.officialBreaktimeOUT,
      "Time OUT": row.timeOUT,
      "Official Time OUT": row.officialTimeOUT,
      "Afternoon Rendered Time": row.timeDifferencePM,
      "Honorarium Time IN": row.officialHonorariumTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN,
      "Official Honorarium Time IN": row.officialHonorariumTimeIN,
      "Honorarium Time OUT": row.officialHonorariumTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT,
      "Official Honorarium Time OUT": row.officialHonorariumTimeOUT,
      "Honorarium Rendered Time": row.timeDifferenceHonorarium,
      "Service Credit Time IN": row.officialServiceCreditTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN,
      "Official Service Credit Time IN": row.officialServiceCreditTimeIN,
      "Service Credit Time OUT": row.officialServiceCreditTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT,
      "Official Service Credit Time OUT": row.officialServiceCreditTimeOUT,
      "Service Credit Rendered Time": row.timeDifferenceServiceCredit,
      "Overtime Time IN": row.officialOverTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN,
      "Official Overtime Time IN": row.officialOverTimeIN,
      "Overtime Time OUT": row.officialOverTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT,
      "Official Overtime Time OUT": row.officialOverTimeOUT,
      "Overtime Rendered Time": row.timeDifferenceOvertime,
    }));

    // Add total and overall rows to the data
    data.push(
      {
        Date: "Total Rendered Time",
        "Morning Rendered Time": calculateTotalTimeAM(),
        "Afternoon Rendered Time": calculateTotalTimePM(),
        "Honorarium Rendered Time": calculateTotalTimeHN(),
        "Service Credit Rendered Time": calculateTotalTimeSC(),
        "Overtime Rendered Time": calculateTotalTimeOT(),
      },
      {
        Date: `Overall Rendered Time (${startDate} to ${endDate})`,
        "Morning Rendered Time": calculateOverallTime(),
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Data");

    // Download the Excel file
    XLSX.writeFile(workbook, "AttendanceData.xlsx");
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
                    Breaktime IN
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Official Breaktime IN
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#bafac6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Official Time (MORNING) Rendered Time
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Tardiness (MORNING)
                  </TableCell>

                  <TableCell>Breaktime OUT</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Official Breaktime OUT
                  </TableCell>
                  <TableCell>Time OUT</TableCell>
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
                    Official Time (AFTERNOON) Rendered Time
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    TARDINESS (AFTERNOON)
                  </TableCell>

                  <TableCell>Honorarium Time IN</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Honorarium Time IN
                  </TableCell>
                  <TableCell>Honorarium Time OUT</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Honorarium Time OUT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#bafac6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Honorarium Rendered Time
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    TARDINESS (HONORARIUM)
                  </TableCell>

                  <TableCell>Service Credit Time IN</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Service Credit Time IN
                  </TableCell>
                  <TableCell>Service Credit Time OUT</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Service Credit Time OUT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#bafac6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Service Credit Rendered Time
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    TARDINESS (SERVICE CREDIT)
                  </TableCell>

                  <TableCell>Overtime Time IN</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Overtime Time IN
                  </TableCell>
                  <TableCell>Overtime Time OUT</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#edfba6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL Overtime Time OUT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#bafac6",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Overtime Rendered Time
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#ffd2d2",
                      fontWeight: "bold",
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    TARDINESS (OVERTIME)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {row.date}
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
                      {row.day}
                    </TableCell>
                    <TableCell>{row.timeIN}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "120px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialTimeIN}
                    </TableCell>
                    <TableCell>{row.breaktimeIN}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "120px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialBreaktimeIN}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#bafac6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.timeDifferenceAM}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.tardAM}
                    </TableCell>

                    <TableCell>{row.OfficialBreakPM}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialBreaktimeOUT}
                    </TableCell>
                    <TableCell>{row.timeOUT}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialTimeOUT}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#bafac6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.timeDifferencePM}
                    </TableCell>

                    {/*    ----------------------PM  ------------------------------*/}
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.tardPMFinal}
                    </TableCell>
                    {/*    ----------------------PM  ------------------------------*/}

                    <TableCell>{row.officialHonorariumTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialHonorariumTimeIN === "12:00:00 AM" ? "N/A" : row.officialHonorariumTimeIN}
                    </TableCell>
                    <TableCell>{row.officialHonorariumTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialHonorariumTimeOUT === "12:00:00 AM" ? "N/A" : row.officialHonorariumTimeOUT}
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: "#bafac6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.timeDifferenceHonorarium}
                    </TableCell>
                    {/*    ----------------------HN  ------------------------------*/}
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.tardHNFinal}
                    </TableCell>
                    {/*    ----------------------HN  ------------------------------*/}

                    <TableCell>{row.officialServiceCreditTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialServiceCreditTimeIN === "12:00:00 AM" ? "N/A" : row.officialServiceCreditTimeIN}
                    </TableCell>
                    <TableCell>{row.officialServiceCreditTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialServiceCreditTimeOUT === "12:00:00 AM" ? "N/A" : row.officialServiceCreditTimeOUT}
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: "#bafac6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.timeDifferenceServiceCredit}
                    </TableCell>
                    {/*    ----------------------SC  ------------------------------*/}
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.tardSCFinal}
                    </TableCell>
                    {/*    ----------------------SC  ------------------------------*/}

                    <TableCell>{row.officialOverTimeIN === "12:00:00 AM" ? "N/A" : row.timeIN}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialOverTimeIN === "12:00:00 AM" ? "N/A" : row.officialOverTimeIN}
                    </TableCell>
                    <TableCell>{row.officialOverTimeOUT === "12:00:00 AM" ? "N/A" : row.timeOUT}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.officialOverTimeOUT === "12:00:00 AM" ? "N/A" : row.officialOverTimeOUT}
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: "#bafac6",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.timeDifferenceOvertime}
                    </TableCell>

                    {/*    ----------------------OT  ------------------------------*/}
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {row.tardOTFinal}
                    </TableCell>
                    {/*    ----------------------OT  ------------------------------*/}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Total Rendered Time (Morning):
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#bafac6",
                    }}
                  >
                    {calculateTotalTimeAM()}
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#ffd2d2",
                    }}
                  >
                    {calculateTotalTardAM()}
                  </TableCell>
                  <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Total Rendered Time (Afternoon):
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#bafac6",
                    }}
                  >
                    {calculateTotalTimePM()}
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#ffd2d2",
                    }}
                  >
                    {calculateTotalTardPM()}
                  </TableCell>
                  <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Total Rendered Time (Honorarium):
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#bafac6",
                    }}
                  >
                    {calculateTotalTimeHN()}
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#ffd2d2",
                    }}
                  >
                    {calculateTotalTardHN()}
                  </TableCell>

                  <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Total Rendered Time (Service Credit):
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#bafac6",
                    }}
                  >
                    {calculateTotalTimeSC()}
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#ffd2d2",
                    }}
                  >
                    {calculateTotalTardSC()}
                  </TableCell>
                  <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Total Rendered Time (Overtime):
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#bafac6",
                    }}
                  >
                    {calculateTotalTimeOT()}
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#ffd2d2",
                    }}
                  >
                    {calculateTotalTardOT()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Overall Rendered Time {startDate} to {endDate}:
                  </TableCell>
                  <TableCell
                    colSpan={5}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "left",
                      backgroundColor: "#ADD8E6",
                    }}
                  >
                    {calculateOverallTime()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          sx={{
            width: "200px",
            height: "55px",
            marginleft: "10px",
            margintopt: "10px",
          }}
          variant="contained"
          color="primary"
          onClick={saveOverallAttendance}
          fullWidth
        >
          Saved Record
        </Button>
      </Box>
    </Container>
  );
};

export default AttendanceModule;
