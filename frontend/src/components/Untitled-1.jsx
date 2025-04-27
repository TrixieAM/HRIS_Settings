

// OT ------------------------------------------------------------------------------

  // rendered time
        // Convert time strings to Date objects
        const startDateFacultyOT= new Date(`01/01/2000 ${timeIN}`);
        const endDateFacultyOT = new Date(`01/01/2000 ${timeOUT}`);
        const startOfficialTimeFacultyOT = new Date(`01/01/2000 ${officialTimeIN}`);
        const endOfficialTimeFacultyOT = new Date(`01/01/2000 ${officialTimeOUT}`);


        const defaultTimeFacultyOT = "00:00:00 AM";
        const midnightFacultyOT = new Date(`01/01/2000 ${defaultTimeFacultyOT}`);

        const timeinfacultyOT = startDateFacultyOT > endOfficialTimeFacultyOT ? midnightFacultyOT : startDateFacultyOT < startOfficialTimeFacultyOT ? startOfficialTimeFacultyOT : startDateFacultyOT;
        const timeoutfacultyOT = timeinfacultyOT === midnightFacultyOT ? midnightFacultyOT : endDateFacultyOT < endOfficialTimeFacultyOT ? endDateFacultyOT : endOfficialTimeFacultyOT;

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

