import React, { useState } from 'react';
const PDS2 = () => {
    const handleSave = async () => {
        try {
          const response = await fetch('http://localhost:5000/save-pds2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
   
          const result = await response.json();
          console.log('Success:', result);
          setIsEditable(false); // Disable form after save
        } catch (error) {
          console.error('Error:', error);
        }
      };




   










    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ overflow:'auto', border: '1px solid black', padding: '0.25in', width: '8in', height: '13.2in' }}>
                <table style={{ border: '1px solid black', borderCollapse: 'collapse', fontFamily: 'Arial, Helvetica, sans-serif', width: '8in', tableLayout: 'fixed' }}>
                    <tbody>
                    <tr>
                        <td colSpan="18" style={{height:'0.2in', fontSize:'72.5%', backgroundColor: 'gray', color: 'white' }}>
                            <b><i>IV. CIVIL SERVICE ELIGIBILITY</i></b>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="1" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px 1px 1px 0px solid black'}}>
                            27.
                        </td>
                        <td colSpan="5" rowSpan="2" style={{height:'0.3in', fontSize:'52.5%', backgroundColor:'lightgray', border: '1px 0px 1px 1px solid black', textAlign:'center'}}>
                            CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER <br></br>
                            SPECIAL LAWS/ CES/ CSEE <br></br>
                            BARANGAY ELIGIBILITY / DRIVER'S LICENSE
                        </td>
                        <td colSpan="2" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            RATING <br></br>
                            (If Applicable)
                        </td>
                        <td colSpan="2" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            DATE OF <br></br>
                            EXAMINATION / <br></br>
                            CONFERMENT
                        </td>
                        <td colSpan="5" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            PLACE OF EXAMINATION / CONFERMENT
                        </td>
                        <td colSpan="3" style={{height:'0.11in', fontSize:'55%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            LICENSE (if applicable)
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{height:'0.2in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            NUMBER
                        </td>  
                        <td colSpan="1" style={{height:'0.2in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            Date of <br></br>
                            Validity
                        </td>          
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                                    &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;                   </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;    
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;  
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                   
                    </tr>
                    <tr>
                        <td colSpan="18" style={{height:'0.11in', fontSize:'55%', backgroundColor:'lightgray', color: 'red', border: '1px solid black', textAlign:'center'}}>
                            <b><i>(Continue on separate sheet if necessary)</i></b>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="18" style={{height:'0.55in', fontSize:'70%', backgroundColor: 'gray', color: 'white' }}>
                            <b> <i>
                            V. WORK EXPERIENCE <br></br>
                            (Include private employment.  Start from your recent work) Description of duties should be indicated in the attached Work Experience sheet.
                            </i></b>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="1" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px 1px 1px 0px solid black'}}>
                            28.
                        </td>
                        <td colSpan="3" rowSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px 0px 1px 1px solid black', textAlign:'center'}}>
                            INCLUSIVE DATES <br></br>
                            (mm/dd/yyyy)
                        </td>
                        <td colSpan="4" rowSpan="3" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            POSITION TITLE <br></br>
                            (Write in full/Do not abbreviate)
                        </td>
                        <td colSpan="4" rowSpan="3" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            DEPARTMENT / AGENCY / OFFICE / COMPANY  <br></br>
                            (Write in full/Do not abbreviate)
                        </td>
                        <td colSpan="1" rowSpan="3" style={{height:'0.3in', fontSize:'52.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            MONTHLY <br></br>
                            SALARY
                        </td>
                        <td colSpan="2" rowSpan="3" style={{height:'0.3in', fontSize:'50%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            SALARY/ JOB/ <br></br>
                            PAY GRADE (if <br></br>
                            applicable)& <br></br>
                            STEP  (Format <br></br>
                            "00-0")/ <br></br>
                            INCREMENT
                        </td>
                        <td colSpan="2" rowSpan="3" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            STATUS OF <br></br>
                            APPOINTMENT
                        </td>
                        <td colSpan="1" rowSpan="3" style={{height:'0.3in', fontSize:'55%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            GOV'T <br></br>
                            SERVICE <br></br>
                            (Y/N)
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            From
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                            To
                        </td>
                    </tr>




                    <tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr><tr>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        &nbsp;
                        </td>
                    </tr>




                    <tr>
                        <td colSpan="18" style={{height:'0.11in', fontSize:'55%', backgroundColor:'lightgray', color: 'red', border: '1px solid black', textAlign:'center'}}>
                            <b><i>(Continue on separate sheet if necessary)</i></b>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={{height:'0.25in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                        <b><i>SIGNATURE</i> </b>
                        </td>
                        <td colSpan="7" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                            &nbsp;
                        </td>
                        <td colSpan="3" style={{height:'0.25in', fontSize:'62.5%', backgroundColor:'lightgray', border: '1px solid black', textAlign:'center'}}>
                        <b><i>DATE</i></b>
                        </td>
                        <td colSpan="4" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                            &nbsp;
                        </td>      
                    </tr>
                    <tr>
                        <td colSpan="18" style={{height:'0.11in', fontSize:'50%', border: '1px solid white', textAlign: 'right'}}>
                        <i>CS FORM 212 (Revised 2017), Page 2 of 4</i>
                        </td>
                    </tr>
{/* ---------------------------------SAVE BUTTON--------------------------------------------- */}
{/* ---------------------------------SAVE BUTTON--------------------------------------------- */}
<tr>
  <td colSpan="15" style={{ textAlign: 'center' }}>
    <button
      onClick={handleSave}
      style={{
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 'bolder', // Making the text bolder
        backgroundColor: '#400000', // Optional: Adding a background color for better visibility
        color: 'white', // Optional: Adding text color
        border: 'none', // Optional: Remove border
        borderRadius: '5px', // Optional: Rounded corners
      }}
     
    >
      Save
    </button>
  </td>
</tr>
{/* ---------------------------------SAVE BUTTON--------------------------------------------- */}
{/* ---------------------------------SAVE BUTTON--------------------------------------------- */}
                    </tbody>
                </table>
        </div>
    </div>




);
}








export default PDS2;











