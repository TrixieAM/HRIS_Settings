import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { TextField, Button } from "@mui/material";
import earistLogo from '../../assets/earistLogo.jpg';

const DailyTimeRecord = () => {
  const [personID, setPersonID] = useState('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [officialTimes, setOfficialTimes] = useState({});


  useEffect(() => {
    // Retrieve and decode the token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPersonID(decoded.employeeNumber); // Set the employeeNumber in state
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.post("http://localhost:5000/attendance/api/view-attendance", {
        personID,
        startDate,
        endDate,
      });

      const data = response.data;

      if (data.length > 0) {
        // Set the records
        setRecords(data);

        // Extract and set the employee name from the first record
        const { firstName, lastName} = data[0];
        setEmployeeName(`${firstName} ${lastName}`);
        // Extract and map officialTimeIN and officialTimeOUT by day
        const officialTimes = data.reduce((acc, record) => {
          acc[record.Day] = {
            officialTimeIN: record.officialTimeIN,
            officialTimeOUT: record.officialTimeOUT,
          };
          return acc;
        }, {});

        setOfficialTimes(officialTimes); // Save the mapping
      } else {
        setRecords([]);
        setEmployeeName("No records found");
        setOfficialTimes({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const printPage = () => {
    const elementsToHide = document.querySelectorAll(".no-print");
    const sidebar = document.querySelector(".MuiDrawer-root");
    const header = document.querySelector(".header");

    if (sidebar) sidebar.style.display = "none";
    if (header) header.style.display = "none";

    elementsToHide.forEach((el) => (el.style.display = "none"));
    window.print();
    elementsToHide.forEach((el) => (el.style.display = ""));
    if (sidebar) sidebar.style.display = "";
    if (header) header.style.display = "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long" }; // Only include the month name
    return date.toLocaleDateString(undefined, options).toUpperCase();
  };

  
 // Function to format the start date (Month DayNumber)
  const formatStartDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" }; // e.g., October 1
    return date.toLocaleDateString("en-US", options);
  };

// Function to format the end date (DayNumber, Year)
  const formatEndDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate(); // Get the day number
    const year = date.getFullYear(); // Get the year
    return `${day}, ${year}`; // Format as "DayNumber, Year"
  };

  const formattedStartDate = formatStartDate(startDate);
  const formattedEndDate = formatEndDate(endDate);
  return (
    <div className="container faculty" style={{transform: 'scale(0.8)', marginTop: '-10rem'}}>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .header { display: none !important; }
            .table-wrapper { display: flex; justify-content: center; width: 95rem; margin-top: 20px; margin-left: -12%;}
            
            .table { width: 45%; border: 1px solid black; border-collapse: collapse; }
            .table-side-by-side {display: flex; flex-direction: row; gap: 1%}
          }
          @media print {
            .print-visible {
              display: block !important; /* Ensure it's displayed during print */
              page-break-before: always; /* Optional: force a new page if needed */
            }
          }
        `}
      </style>
        <h1 style={{marginTop: '-1%'}} className='no-print'>Daily Time Record</h1>
      <div className="search-container no-print textfield-container" >
        
        <TextField sx={{ width: "200px", marginleft: "10px", backgroundColor:'white' }} m disabled value={personID} variant="outlined" />

        <TextField sx={{ width: "200px", marginleft: "10px", backgroundColor:'white' }} fullWidth label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} variant="outlined" InputLabelProps={{ shrink: true }} />

        <TextField sx={{ width: "200px", marginleft: "10px", backgroundColor:'white' }} label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} variant="outlined" InputLabelProps={{ shrink: true }} />

        <Button
          sx={{
            width: "200px",
            height: "55px",
            marginleft: "10px",
            margintopt: "10px",
            bgcolor: "#6D2323"
          }}
          variant="contained"
          color="primary"
          onClick={fetchRecords}
          fullWidth
        >
          Search
        </Button>
      </div>
      <br />
      <div className="table-container" style={{marginBottom: '3%', backgroundColor:'white'}}>
        <div className="table-wrapper">
          <div style={{ display: "flex", justifyContent: "space-between" }} className="table-side-by-side">
            <table
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                width: "48%",
              }}
              className="print-visble"
            >
              <thead style={{ textAlign: "center", position: 'relative' }}>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td></td>

                  <td
                    colSpan="1"
                    style={{
                      position: 'relative',
                      padding: "0",
                      lineHeight: "0",
                      height: "0px",
                      textAlign: "right",
                      marginRight: "0",
                    }}
                  >
                    <img src={earistLogo} alt="EARIST Logo" width="55" height="55"  style={{position: 'absolute', marginTop: '-14%', left: '60%'}}/>
                  </td>
                  <td colSpan="4">
                    {" "}
                    <p
                      style={{
                        marginTop: '10%',
                        fontSize: "15px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginLeft: '10%'
                      }}
                    >
                      EULOGIO "AMANG" RODRIGUEZ <br /> INSTITUTE OF SCIENCE & TECHNOLOGY
                    </p>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="9">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        lineHeight: "0",
                      }}
                    >
                      Nagtahan, Sampaloc Manila
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan="9">
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        lineHeight: "0",
                      }}
                    >
                      Civil Service Form No. 48
                    </p>
                  </td>
                </tr>

                <tr>
                  <td colSpan="9" style={{ padding: "2", lineHeight: "0" }}>
                    <h4>DAILY TIME RECORD</h4>
                  </td>
                </tr>
                <tr style={{position: 'relative'}}>
                  <td colSpan="3" style={{ padding: "2", lineHeight: "0" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        height: "20px",
                        textAlign: "left",
                        padding: '0 1rem',
                        marginTop: '6%',
                      }}
                    >
                      NAME: {employeeName}
                    </p>
                  </td>
                  <td></td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "right",
                      position:'absolute', 
                      right: '33.3%',
                      top: '7%'
                    }}
                  >
                    Official Time:
                  </td>
                </tr>

                <tr>
                  <td colSpan="5" style={{ padding: "2", lineHeight: "0" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        height: "10px",
                        paddingLeft: '1rem',
                        textAlign: "Left",
                      }}
                    >
                      Covered Dates: {formattedStartDate} - {formattedEndDate}
                    </p>
                  </td>
                </tr>
                <tr style={{position: 'absolute', display: 'flex', flexDirection: 'column', right: '17%', top: '65%', gap: '6px'}}>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    M - {officialTimes["Monday"]?.officialTimeIN || "N/A"} - {officialTimes["Monday"]?.officialTimeOUT || "N/A"}
                  </td>

                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "left",
                      fontSize: '0.8rem'
                    }}
                  >
                    T - {officialTimes["Tuesday"]?.officialTimeIN || "N/A"} - {officialTimes["Tuesday"]?.officialTimeOUT || "N/A"}
                  </td>

                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    W - {officialTimes["Wednesday"]?.officialTimeIN || "N/A"} - {officialTimes["Wednesday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "left",
                      fontSize: '0.8rem'
                    }}
                  >
                    TH - {officialTimes["Thursday"]?.officialTimeIN || "N/A"} - {officialTimes["Thursday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    F - {officialTimes["Friday"]?.officialTimeIN || "N/A"} - {officialTimes["Friday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    SAT - {officialTimes["Saturday"]?.officialTimeIN || "N/A"} - {officialTimes["Saturday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    SUN - {officialTimes["Sunday"]?.officialTimeIN || "N/A"} - {officialTimes["Sunday"]?.officialTimeOUT || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ padding: "2", lineHeight: "2", textAlign: "left" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        paddingLeft: '1rem'
                      }}
                    >
                      For the month of: {startDate ? formatMonth(startDate) : ""}
                    </p>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr> <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                 <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>

                 <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                
                
              </thead>
              <tr>
                <th
                  rowSpan="2"
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  DAY
                </th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  A.M.
                </th>
                <th style={{ border: "1px solid black" }}></th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  P.M.
                </th>
                <th style={{ border: "1px solid black" }}></th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  Undertime
                </th>
              </tr>
              <tr style={{textAlign: 'center'}}>
                <td style={{ border: "1px solid black" }}>ARRIVAL</td>
                <td style={{ border: "1px solid black" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}>ARRIVAL</td>
                <td style={{ border: "1px solid black" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}>Hours</td>
                <td style={{ border: "1px solid black" }}>Minutes</td>
              </tr>

              <tbody>
                {Array.from({ length: 31 }, (_, i) => {
                  const day = (i + 1).toString().padStart(2, "0");
                  const record = records.find((r) => r.date.endsWith(`-${day}`));

                  return (
                    <tr key={i}>
                      <td style={{ border: "1px solid black", textAlign: 'center'}}>{day}</td>
                      <td style={{ border: "1px solid black" }}>{record?.timeIN || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.timeOUT || ""}</td>
                      <td style={{ border: "1px solid black" }}></td>
                      <td style={{ border: "1px solid black" }}>{record?.breaktimeIN || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.breaktimeOUT || ""}</td>
                      <td style={{ border: "1px solid black" }}></td>
                      <td style={{ border: "1px solid black" }}>{record?.hours || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.minutes || ""}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="9">
                    <div className="">
                      <br />
                      <hr
                        style={{
                          borderTop: "3px solid black",
                          width: "98%",
                          margin: "0 auto",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "justify",
                          width: "95%",
                          margin: "0 auto",
                          marginTop: "10px",
                        }}
                      >
                        I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
                      </p>
                      <br />
                      <hr
                        style={{
                          textAlign: "right",
                          borderTop: "3px solid black",
                          width: "55%",
                          marginBottom: "20px",
                          marginRight: "20px",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-12px",
                          marginRight: "200px",
                        }}
                      >
                        Signature
                      </p>
                      <hr
                        style={{
                          borderTop: "3px double black",
                          width: "94%",
                          margin: "0 auto",
                        }}
                      />
                      <p style={{ textAlign: "center", marginTop: "12px" }}>Verified as to prescribe office hours.</p>
                      <br />
                      <hr
                        style={{
                          textAlign: "right",
                          borderTop: "3px solid black",
                          width: "55%",
                          marginBottom: "20px",
                          marginRight: "20px",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-8px",
                          marginRight: "200px",
                        }}
                      >
                        In-Charge
                      </p>
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-12px",
                          marginRight: "125px",
                        }}
                      >
                        (Signature Over Printed Name)
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 2nd TABLE */}

            <table
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                width: "48%",
              }}
              className="print-visble"
            >
              <thead style={{ textAlign: "center", position: 'relative' }}>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td></td>

                  <td
                    colSpan="1"
                    style={{
                      position: 'relative',
                      padding: "0",
                      lineHeight: "0",
                      height: "0px",
                      textAlign: "right",
                      marginRight: "0",
                    }}
                  >
                    <img src={earistLogo} alt="EARIST Logo" width="55" height="55"  style={{position: 'absolute', marginTop: '-14%', left: '60%'}}/>
                  </td>
                  <td colSpan="4">
                    {" "}
                    <p
                      style={{
                        marginTop: '10%',
                        fontSize: "15px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginLeft: '10%'
                      }}
                    >
                      EULOGIO "AMANG" RODRIGUEZ <br /> INSTITUTE OF SCIENCE & TECHNOLOGY
                    </p>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="9">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        lineHeight: "0",
                      }}
                    >
                      Nagtahan, Sampaloc Manila
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan="9">
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        lineHeight: "0",
                      }}
                    >
                      Civil Service Form No. 48
                    </p>
                  </td>
                </tr>

                <tr>
                  <td colSpan="9" style={{ padding: "2", lineHeight: "0" }}>
                    <h4>DAILY TIME RECORD</h4>
                  </td>
                </tr>
                <tr style={{position: 'relative'}}>
                  <td colSpan="3" style={{ padding: "2", lineHeight: "0" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        height: "20px",
                        textAlign: "left",
                        padding: '0 1rem',
                        marginTop: '6%',
                      }}
                    >
                      NAME: {employeeName}
                    </p>
                  </td>
                  <td></td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "right",
                      position:'absolute', 
                      right: '33.3%',
                      top: '7%'
                    }}
                  >
                    Official Time:
                  </td>
                </tr>

                <tr>
                  <td colSpan="5" style={{ padding: "2", lineHeight: "0" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        height: "10px",
                        paddingLeft: '1rem',
                        textAlign: "Left",
                      }}
                    >
                      Covered Dates: {formattedStartDate} - {formattedEndDate}
                    </p>
                  </td>
                </tr>
                <tr style={{position: 'absolute', display: 'flex', flexDirection: 'column', right: '17%', top: '65%', gap: '6px'}}>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    M - {officialTimes["Monday"]?.officialTimeIN || "N/A"} - {officialTimes["Monday"]?.officialTimeOUT || "N/A"}
                  </td>

                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "left",
                      fontSize: '0.8rem'
                    }}
                  >
                    T - {officialTimes["Tuesday"]?.officialTimeIN || "N/A"} - {officialTimes["Tuesday"]?.officialTimeOUT || "N/A"}
                  </td>

                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    W - {officialTimes["Wednesday"]?.officialTimeIN || "N/A"} - {officialTimes["Wednesday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "left",
                      fontSize: '0.8rem'
                    }}
                  >
                    TH - {officialTimes["Thursday"]?.officialTimeIN || "N/A"} - {officialTimes["Thursday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    F - {officialTimes["Friday"]?.officialTimeIN || "N/A"} - {officialTimes["Friday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    SAT - {officialTimes["Saturday"]?.officialTimeIN || "N/A"} - {officialTimes["Saturday"]?.officialTimeOUT || "N/A"}
                  </td>
                  <td
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: "0",
                      height: "10px",
                      textAlign: "Left",
                      fontSize: '0.8rem'
                    }}
                  >
                    SUN - {officialTimes["Sunday"]?.officialTimeIN || "N/A"} - {officialTimes["Sunday"]?.officialTimeOUT || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ padding: "2", lineHeight: "2", textAlign: "left" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0",
                        paddingLeft: '1rem'
                      }}
                    >
                      For the month of: {startDate ? formatMonth(startDate) : ""}
                    </p>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr> <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                 <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>
                </tr>

                 <tr>
                  <td colSpan="3"></td>
                  <td></td>
                  <td></td>

                  <td></td>

                  
                </tr>
                
                
              </thead>
              <tr>
                <th
                  rowSpan="2"
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  DAY
                </th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  A.M.
                </th>
                <th style={{ border: "1px solid black" }}></th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  P.M.
                </th>
                <th style={{ border: "1px solid black" }}></th>
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  Undertime
                </th>
              </tr>
              <tr style={{textAlign: 'center'}}>
                <td style={{ border: "1px solid black" }}>ARRIVAL</td>
                <td style={{ border: "1px solid black" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}>ARRIVAL</td>
                <td style={{ border: "1px solid black" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}>Hours</td>
                <td style={{ border: "1px solid black" }}>Minutes</td>
              </tr>

              <tbody>
                {Array.from({ length: 31 }, (_, i) => {
                  const day = (i + 1).toString().padStart(2, "0");
                  const record = records.find((r) => r.date.endsWith(`-${day}`));

                  return (
                    <tr key={i}>
                      <td style={{ border: "1px solid black", textAlign: 'center'}}>{day}</td>
                      <td style={{ border: "1px solid black" }}>{record?.timeIN || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.timeOUT || ""}</td>
                      <td style={{ border: "1px solid black" }}></td>
                      <td style={{ border: "1px solid black" }}>{record?.breaktimeIN || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.breaktimeOUT || ""}</td>
                      <td style={{ border: "1px solid black" }}></td>
                      <td style={{ border: "1px solid black" }}>{record?.hours || ""}</td>
                      <td style={{ border: "1px solid black" }}>{record?.minutes || ""}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="9">
                    <div className="">
                      <br />
                      <hr
                        style={{
                          borderTop: "3px solid black",
                          width: "98%",
                          margin: "0 auto",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "justify",
                          width: "95%",
                          margin: "0 auto",
                          marginTop: "10px",
                        }}
                      >
                        I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
                      </p>
                      <br />
                      <hr
                        style={{
                          textAlign: "right",
                          borderTop: "3px solid black",
                          width: "55%",
                          marginBottom: "20px",
                          marginRight: "20px",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-12px",
                          marginRight: "200px",
                        }}
                      >
                        Signature
                      </p>
                      <hr
                        style={{
                          borderTop: "3px double black",
                          width: "94%",
                          margin: "0 auto",
                        }}
                      />
                      <p style={{ textAlign: "center", marginTop: "12px" }}>Verified as to prescribe office hours.</p>
                      <br />
                      <hr
                        style={{
                          textAlign: "right",
                          borderTop: "3px solid black",
                          width: "55%",
                          marginBottom: "20px",
                          marginRight: "20px",
                        }}
                      />
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-8px",
                          marginRight: "200px",
                        }}
                      >
                        In-Charge
                      </p>
                      <p
                        style={{
                          textAlign: "right",
                          marginTop: "-12px",
                          marginRight: "125px",
                        }}
                      >
                        (Signature Over Printed Name)
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Button
        sx={{
          width: "200px",
          height: "55px",
          marginleft: "10px",
          margintopt: "10px",
        }}
        className="no-print"
        variant="contained"
        color="primary"
        onClick={printPage}
        fullWidth
      >
        Print
      </Button>
    </div>
  );
};

export default DailyTimeRecord;
