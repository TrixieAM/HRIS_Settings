import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

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

        // start faculty render

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

        // HN ------------------------------------------------------------------------------

        // rendered time
        // Convert time strings to Date objects
        const startDateFacultyHN = new Date(`01/01/2000 ${timeIN}`);
        const endDateFacultyHN = new Date(`01/01/2000 ${timeOUT}`);
        const startOfficialTimeFacultyHN = new Date(`01/01/2000 ${officialHonorariumTimeIN}`);
        const endOfficialTimeFacultyHN = new Date(`01/01/2000 ${officialHonorariumTimeOUT}`);

        const defaultTimeFacultyHN = "00:00:00 AM";
        const midnightFacultyHN = new Date(`01/01/2000 ${defaultTimeFacultyHN}`);

        const timeinfacultyHN = endDateFacultyHN < startOfficialTimeFacultyHN ? midnightFacultyHN : startDateFacultyHN > endOfficialTimeFacultyHN ? midnightFacultyHN : startDateFacultyHN < startOfficialTimeFacultyHN ? startOfficialTimeFacultyHN : startDateFacultyHN;
        const timeoutfacultyHN = timeinfacultyHN === midnightFacultyHN ? midnightFacultyHN : endDateFacultyHN < startOfficialTimeFacultyHN ? midnightFacultyHN : endDateFacultyHN < endOfficialTimeFacultyHN ? endDateFacultyHN : endOfficialTimeFacultyHN;

        // Calculate difference in milliseconds
        const diffMsHN = timeoutfacultyHN - timeinfacultyHN;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyHN = Math.floor(diffMsHN / (1000 * 60 * 60));
        const minutesFacultyHN = Math.floor((diffMsHN % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyHN = Math.floor((diffMsHN % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS RENDERERED TIME
        const formattedFacultyRenderedTimeHN = [String(hoursFacultyHN).padStart(2, "0"), String(minutesFacultyHN).padStart(2, "0"), String(secondsFacultyHN).padStart(2, "0")].join(":");

        //end rendered time

        //  max rendered time

        // Calculate difference in milliseconds MAX RENDERED TIME
        const diffMsFacultyHN = endOfficialTimeFacultyHN - startOfficialTimeFacultyHN;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyMRTHN = Math.floor(diffMsFacultyHN / (1000 * 60 * 60));
        const minutesFacultyMRTHN = Math.floor((diffMsFacultyHN % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyMRTHN = Math.floor((diffMsFacultyHN % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedFacultyMaxRenderedTimeHN = [String(hoursFacultyMRTHN).padStart(2, "0"), String(minutesFacultyMRTHN).padStart(2, "0"), String(secondsFacultyMRTHN).padStart(2, "0")].join(":");

        // Calculate difference in milliseconds MAX RENDERED TIME

        const tardFinalformattedFacultyRenderedTimeHN = new Date(`01/01/2000 ${formattedFacultyRenderedTimeHN}`);
        const tardFinalformattedFacultyMaxRenderedTimeHN = new Date(`01/01/2000 ${formattedFacultyMaxRenderedTimeHN}`);

        const finalcalcFacultyHN = tardFinalformattedFacultyMaxRenderedTimeHN - tardFinalformattedFacultyRenderedTimeHN;

        // Convert milliseconds to hours, minutes, seconds
        const hoursfinalcalcFacultyHN = Math.floor(finalcalcFacultyHN / (1000 * 60 * 60));
        const minutesfinalcalcFacultyHN = Math.floor((finalcalcFacultyHN % (1000 * 60 * 60)) / (1000 * 60));
        const secondsfinalcalcFacultyHN = Math.floor((finalcalcFacultyHN % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedfinalcalcFacultyHN = [String(hoursfinalcalcFacultyHN).padStart(2, "0"), String(minutesfinalcalcFacultyHN).padStart(2, "0"), String(secondsfinalcalcFacultyHN).padStart(2, "0")].join(":");

        // // end max rendered time
        //HN END-----------------------------------------------------------------------------

        // SC ------------------------------------------------------------------------------

        // rendered time
        // Convert time strings to Date objects
        const startDateFacultySC = new Date(`01/01/2000 ${timeIN}`);
        const endDateFacultySC = new Date(`01/01/2000 ${timeOUT}`);
        const startOfficialTimeFacultySC = new Date(`01/01/2000 ${officialTimeIN}`);
        const endOfficialTimeFacultySC = new Date(`01/01/2000 ${officialTimeOUT}`);

        const defaultTimeFacultySC = "00:00:00 AM";
        const midnightFacultySC = new Date(`01/01/2000 ${defaultTimeFacultySC}`);

        const timeinfacultySC = endDateFacultySC < startOfficialTimeFacultySC ? midnightFacultySC : startDateFacultySC > endOfficialTimeFacultySC ? midnightFacultySC : startDateFacultySC < startOfficialTimeFacultySC ? startOfficialTimeFacultySC : startDateFacultySC;
        const timeoutfacultySC = timeinfacultySC === midnightFacultySC ? midnightFacultySC : endDateFacultySC < startOfficialTimeFacultySC ? midnightFacultySC : endDateFacultySC < endOfficialTimeFacultySC ? endDateFacultySC : endOfficialTimeFacultySC;

        // Calculate difference in milliseconds
        const diffMsSC = timeoutfacultySC - timeinfacultySC;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultySC = Math.floor(diffMsSC / (1000 * 60 * 60));
        const minutesFacultySC = Math.floor((diffMsSC % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultySC = Math.floor((diffMsSC % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS RENDERERED TIME
        const formattedFacultyRenderedTimeSC = [String(hoursFacultySC).padStart(2, "0"), String(minutesFacultySC).padStart(2, "0"), String(secondsFacultySC).padStart(2, "0")].join(":");

        //end rendered time

        //  max rendered time

        // Calculate difference in milliseconds MAX RENDERED TIME
        const diffMsFacultySC = endOfficialTimeFacultySC - startOfficialTimeFacultySC;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyMRTSC = Math.floor(diffMsFacultySC / (1000 * 60 * 60));
        const minutesFacultyMRTSC = Math.floor((diffMsFacultySC % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyMRTSC = Math.floor((diffMsFacultySC % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedFacultyMaxRenderedTimeSC = [String(hoursFacultyMRTSC).padStart(2, "0"), String(minutesFacultyMRTSC).padStart(2, "0"), String(secondsFacultyMRTSC).padStart(2, "0")].join(":");

        // Calculate difference in milliseconds MAX RENDERED TIME

        const tardFinalformattedFacultyRenderedTimeSC = new Date(`01/01/2000 ${formattedFacultyRenderedTimeSC}`);
        const tardFinalformattedFacultyMaxRenderedTimeSC = new Date(`01/01/2000 ${formattedFacultyMaxRenderedTimeSC}`);

        const finalcalcFacultySC = tardFinalformattedFacultyMaxRenderedTimeSC - tardFinalformattedFacultyRenderedTimeSC;

        // Convert milliseconds to hours, minutes, seconds
        const hoursfinalcalcFacultySC = Math.floor(finalcalcFacultySC / (1000 * 60 * 60));
        const minutesfinalcalcFacultySC = Math.floor((finalcalcFacultySC % (1000 * 60 * 60)) / (1000 * 60));
        const secondsfinalcalcFacultySC = Math.floor((finalcalcFacultySC % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedfinalcalcFacultySC = [String(hoursfinalcalcFacultySC).padStart(2, "0"), String(minutesfinalcalcFacultySC).padStart(2, "0"), String(secondsfinalcalcFacultySC).padStart(2, "0")].join(":");

        // // end max rendered time
        //SC END-----------------------------------------------------------------------------

        // OT ------------------------------------------------------------------------------

        // rendered time
        // Convert time strings to Date objects
        const startDateFacultyOT = new Date(`01/01/2000 ${timeIN}`);
        const endDateFacultyOT = new Date(`01/01/2000 ${timeOUT}`);
        const startOfficialTimeFacultyOT = new Date(`01/01/2000 ${officialOverTimeIN}`);
        const endOfficialTimeFacultyOT = new Date(`01/01/2000 ${officialOverTimeOUT}`);

        const defaultTimeFacultyOT = "00:00:00 AM";
        const midnightFacultyOT = new Date(`01/01/2000 ${defaultTimeFacultyOT}`);

        const timeinfacultyOT = endDateFacultyOT < startOfficialTimeFacultyOT ? midnightFacultyOT : startDateFacultyOT > endOfficialTimeFacultyOT ? midnightFacultyOT : startDateFacultyOT < startOfficialTimeFacultyOT ? startOfficialTimeFacultyOT : startDateFacultyOT;
        const timeoutfacultyOT = timeinfacultyOT === midnightFacultyOT ? midnightFacultyOT : endDateFacultyOT < startOfficialTimeFacultyOT ? midnightFacultyOT : endDateFacultyOT < endOfficialTimeFacultyOT ? endDateFacultyOT : endOfficialTimeFacultyOT;

        // Calculate difference in milliseconds
        const diffMsOT = timeoutfacultyOT - timeinfacultyOT;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyOT = Math.floor(diffMsOT / (1000 * 60 * 60));
        const minutesFacultyOT = Math.floor((diffMsOT % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyOT = Math.floor((diffMsOT % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS RENDERERED TIME
        const formattedFacultyRenderedTimeOT = [String(hoursFacultyOT).padStart(2, "0"), String(minutesFacultyOT).padStart(2, "0"), String(secondsFacultyOT).padStart(2, "0")].join(":");

        //end rendered time

        //  max rendered time

        // Calculate difference in milliseconds MAX RENDERED TIME
        const diffMsFacultyOT = endOfficialTimeFacultyOT - startOfficialTimeFacultyOT;

        // Convert milliseconds to hours, minutes, seconds
        const hoursFacultyMRTOT = Math.floor(diffMsFacultyOT / (1000 * 60 * 60));
        const minutesFacultyMRTOT = Math.floor((diffMsFacultyOT % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFacultyMRTOT = Math.floor((diffMsFacultyOT % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedFacultyMaxRenderedTimeOT = [String(hoursFacultyMRTOT).padStart(2, "0"), String(minutesFacultyMRTOT).padStart(2, "0"), String(secondsFacultyMRTOT).padStart(2, "0")].join(":");

        // Calculate difference in milliseconds MAX RENDERED TIME

        const tardFinalformattedFacultyRenderedTimeOT = new Date(`01/01/2000 ${formattedFacultyRenderedTimeOT}`);
        const tardFinalformattedFacultyMaxRenderedTimeOT = new Date(`01/01/2000 ${formattedFacultyMaxRenderedTimeOT}`);

        const finalcalcFacultyOT = tardFinalformattedFacultyMaxRenderedTimeOT - tardFinalformattedFacultyRenderedTimeOT;

        // Convert milliseconds to hours, minutes, seconds
        const hoursfinalcalcFacultyOT = Math.floor(finalcalcFacultyOT / (1000 * 60 * 60));
        const minutesfinalcalcFacultyOT = Math.floor((finalcalcFacultyOT % (1000 * 60 * 60)) / (1000 * 60));
        const secondsfinalcalcFacultyOT = Math.floor((finalcalcFacultyOT % (1000 * 60)) / 1000);

        // Format output as HH:MM:SS
        const formattedfinalcalcFacultyOT = [String(hoursfinalcalcFacultyOT).padStart(2, "0"), String(minutesfinalcalcFacultyOT).padStart(2, "0"), String(secondsfinalcalcFacultyOT).padStart(2, "0")].join(":");

        // // end max rendered time
        //OT END-----------------------------------------------------------------------------

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

          timeIN,
          timeOUT,
          OfficialBreakPM,
          breaktimeIN,
          breaktimeOUT,

          midnightFaculty,
          finalcalcFaculty,

          formattedfinalcalcFaculty,
          formattedFacultyRenderedTime,

          formattedFacultyMaxRenderedTime,

          formattedfinalcalcFacultyHN,
          formattedFacultyRenderedTimeHN,

          formattedFacultyMaxRenderedTimeHN,

          formattedfinalcalcFacultySC,
          formattedFacultyRenderedTimeSC,

          formattedFacultyMaxRenderedTimeSC,

          formattedfinalcalcFacultyOT,
          formattedFacultyRenderedTimeOT,

          formattedFacultyMaxRenderedTimeOT,
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
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.formattedFacultyRenderedTime), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTimeAMSaved = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.formattedfinalcalcFaculty), 0);
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
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.formattedFacultyRenderedTime), 0);
    return secondsToTime(totalSeconds);
  };

  const calculateTotalTardPM = () => {
    const totalSeconds = attendanceData.reduce((acc, row) => acc + timeToSeconds(row.formattedfinalcalcFacultyHN), 0);
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
      totalRenderedTimeMorning: calculateTotalTimeAMSaved("formattedfinalcalcFaculty"),
      totalTardAM: calculateTotalTardAMSaved(),
      totalRenderedTimeAfternoon: calculateTotalTimePMSaved("finalcalcFaculty"),
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
                    <TableCell>{row.timeOUT}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#edfba6",
                        fontWeight: "bold",
                        width: "120px",
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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedFacultyRenderedTime === "NaN:NaN:NaN" ? "00:00:00" : row.formattedFacultyRenderedTime}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#ffd2d2",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                      }}
                    >
                      {!row.officialTimeIN || !row.timeOUT || row.formattedfinalcalcFaculty === "NaN:NaN:NaN" ? row.formattedFacultyMaxRenderedTime : row.formattedfinalcalcFaculty}
                    </TableCell>

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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedFacultyRenderedTimeHN === "NaN:NaN:NaN" ? "00:00:00" : row.formattedFacultyRenderedTimeHN}
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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedfinalcalcFacultyHN === "NaN:NaN:NaN" ? row.formattedFacultyMaxRenderedTimeHN : row.formattedfinalcalcFacultyHN}
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
                      {!row.officialTimeSC || !row.timeOUT || row.formattedFacultyRenderedTimeSC === "NaN:NaN:NaN" ? "00:00:00" : row.formattedFacultyRenderedTimeSC}
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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedfinalcalcFacultySC === "NaN:NaN:NaN" ? row.formattedFacultyMaxRenderedTimeSC : row.formattedfinalcalcFacultySC}
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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedFacultyRenderedTimeOT === "NaN:NaN:NaN" ? "00:00:00" : row.formattedFacultyRenderedTimeOT}
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
                      {!row.officialTimeIN || !row.timeOUT || row.formattedfinalcalcFacultyOT === "NaN:NaN:NaN" ? row.formattedFacultyMaxRenderedTimeOT : row.formattedfinalcalcFacultyOT}
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
                    {calculateTotalTardAM()}
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

export default AttendanceModuleFaculty;
