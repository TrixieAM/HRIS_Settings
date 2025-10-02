import API_BASE_URL from '../../apiConfig';
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Container, Box, Typography} from "@mui/material";
import earistLogo from '../../assets/earistLogo.jpg';
import { AccessTime } from '@mui/icons-material';

const DailyTimeRecordFaculty = () => {
  const [personID, setPersonID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };
  const fetchRecords = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/api/view-attendance`,
        {
          personID,
          startDate,
          endDate,
        },
        getAuthHeaders()
      );

      const data = response.data;

      if (data.length > 0) {
        // Set the records
        setRecords(data);

        // Extract and set the employee name from the first record
        const { firstName, lastName } = data[0];
        setEmployeeName(`${firstName} ${lastName}`);
      } else {
        setRecords([]);
        setEmployeeName("No records found");
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

  const currentYear = 2024;
  const months = [
     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

   const handleMonthClick = (monthIndex) => {
    const year = 2024;
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0)); 

    const formattedStart = start.toISOString().substring(0, 10);
    const formattedEnd = end.toISOString().substring(0, 10);

    setStartDate(formattedStart);
    setEndDate(formattedEnd);
  };

  return (
    <div className="container faculty">
      <style>
        {`
          @media print {
            .no-print { 
              display: none !important;
            }

            .header { 
              display: none !important; 
            }

            .table-wrapper { 
              display: flex; 
              justify-content: center; 
              width: 100%; 
              margin-top: -22rem; 
              transform: scale(0.7);
              height: 100vh;
            }
            
            .table { 
              width: 50%;
              border: 1px solid black; 
              border-collapse: collapse; 
            }

            .header, .top-banner, .page-banner, header, footer {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              overflow: hidden !important;
            }
               @media print {
            .print-visible {
              display: block !important;
              page-break-before: avoid;
              margin-bottom: 0;
              margin-top: 0;

            }
              @media print {
              .header, .top-banner, .page-banner, header, footer {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
              }
            }
              body {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }  
          }
        `}
      </style>
      
      <div 
  style={{
    backgroundColor: '#6D2323',
    color: '#ffffff',
    padding: '20px',
    width: '95.4%',
    borderRadius: '8px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
   
  }}>
    <div className="search-container no-print">
        <div  style={{ display: 'flex', alignItems: 'center', color: '#ffffff', }}>
          <AccessTime sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />
          <div >
            <h4  style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
              Overall Daily Time Record
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Manage and filters overall DTR records
            </p>
          </div>
          </div>     
        </div>
        </div>
      <Container sx={{ bgcolor: 'white', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', paddingBottom: '50px', paddingTop:'25px'}}>
      <div className="search-container no-print">

         {/* Month Buttons */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2, ml: 1.3 }}>
                    {months.map((month, index) => (
                      <Button key={month} variant="contained" onClick={() => handleMonthClick(index)} sx={{ backgroundColor: "#6D2323", color: "white", "&:hover": { backgroundColor: "#d4bd99" } }}>
                        {month}
                      </Button>
                    ))}
                  </Box>

        <div className='textfield-container'>
          <TextField
            sx={{ width: "200px", paddingRight: "12px" }}
            m
            label="Employee Number"
            value={personID}
            onChange={(e) => setPersonID(e.target.value)}
            variant="outlined"
          />

          <TextField
            sx={{ width: "200px", paddingRight: "12px" }}
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            sx={{ width: "200px", paddingRight: "12px" }}
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

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
      </div>
      </Container>
      <Container sx={{bgcolor: 'white', marginTop: '20px', marginBottom: '20px'}}>
      <br />
      <div className="table-container" style={{marginBottom: '5%'}}>
        <div className="table-wrapper">
          <div>
            <table
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                width: "52rem",
              }}
              className="table side-by-side"
            >
             <thead style={{ textAlign: "center", position: 'relative' }}>
                            <tr>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "1.5rem",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  fontWeight: "bold",
                                  fontSize: '13px'
                                }}
                              >
                                Republic of the Philippines
                              </div>
                          
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
                              <td colSpan="3">
                                  <p
                                  style={{
                                    marginTop: '15%',
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginLeft: '5%'
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
                
                  <tr >
                    <td colSpan="9" style={{ padding: "2", lineHeight: "0" }}>
                      <p
                        style={{
                          fontSize: "15px",
                          margin: "0",
                          height: "20px",
                          textAlign: "left",
                          padding: '0 1rem',
                        }}
                      >
                        NAME: <b>{employeeName}</b>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="9" style={{ padding: "2", lineHeight: "0" }}>
                      <p
                        style={{
                          fontSize: "15px",
                          margin: "0",
                          height: "10px",
                          textAlign: "left",
                          paddingLeft: '15px'
                        }}
                      >
                        Covered Dates: <b> {startDate ? formatDate(startDate) : ""} -{" "}
                        {endDate ? formatDate(endDate) : ""} </b>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="3"
                      style={{ padding: "2", lineHeight: "2", textAlign: "left", padding: '0rem 1rem' }}
                    >
                      <p
                        style={{
                          fontSize: "15px",
                          margin: "0",
                        }}
                      >
                        For the month of: <b>{" "}
                        {startDate ? formatMonth(startDate) : ""}</b>
                      </p>
                    </td>
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
                <th colSpan="2" style={{ border: "1px solid black" }}>
                  P.M.
                </th>
                <th style={{ border: "1px solid black" }}>Late</th>
                <th colSpan="1" style={{ border: "1px solid black" }}>
                  Undertime
                </th>
              </tr>
              <tr>
                <td style={{ border: "1px solid black",  textAlign: "center"}}>ARRIVAL</td>
                <td style={{ border: "1px solid black",  textAlign: "center" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black",  textAlign: "center" }}>ARRIVAL</td>
                <td style={{ border: "1px solid black",  textAlign: "center" }}>DEPARTURE</td>
                <td style={{ border: "1px solid black",  textAlign: "center" }}>Hours</td>
                <td style={{ border: "1px solid black", textAlign: "center" }}>Minutes</td>
              </tr>

              <tbody>
                {Array.from({ length: 31 }, (_, i) => {
                  const day = (i + 1).toString().padStart(2, "0");
                  const record = records.find((r) =>
                    r.date.endsWith(`-${day}`)
                  );

                  return (
                    <tr key={i}>
                      <td style={{ border: "1px solid black", textAlign: 'center'}}>{day}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.timeIN || ""}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.timeOUT || ""}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.breaktimeIN || ""}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.breaktimeOUT || ""}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.hours || ""}</td>
                      <td style={{ border: "1px solid black", textAlign: 'center' }}>{record?.minutes || ""}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="9">
                    <div className="">

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
                          borderTop: "1px double black",
                          width: "94%",
                          margin: "0 auto",
                        }}
                      />
                      <p style={{ textAlign: "center", marginTop: "12px" }}>Verified as to prescribe office hours.</p>
                      <br />
                      <hr
                        style={{
                          textAlign: "right",
                          borderTop: "1px solid black",
                          width: "94%",
                          marginBottom: "20px",
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
              <div>
              
              </div>
            </table>            
          </div>
        </div>
      </div>
       </Container>

      <Button
        sx={{
          width: "200px",
          height: "55px",
          marginleft: "10px",
          margintopt: "10px",
          marginBottom: "100px",
          bgcolor: "#6D2323",
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

export default DailyTimeRecordFaculty;  