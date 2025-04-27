import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PDS2 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [eligibilityInfo, setEligibilityInfo] = useState([]);
  const [workexperience, setWorkExperienceInfo] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('role');
    const storedEmployeeNumber = localStorage.getItem('employeeNumber');

    console.log("Stored email:", storedEmail);
    console.log("Stored Role:", storedRole);
    console.log("Stored Employee Number:", storedEmployeeNumber);

    if (storedEmail && storedRole && storedEmployeeNumber) {
      setEmail(storedEmail);
      setRole(storedRole);
      setEmployeeNumber(storedEmployeeNumber);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (employeeNumber) {
      const fetchEligibilityData = async () => {
        try {
          const requests = Array.from({ length: 7 }, (_, i) =>
            axios.get(`http://localhost:5000/eligibilityRoute/eligibility${i + 1}/${employeeNumber}`)
          );
          const responses = await Promise.all(requests);
          setEligibilityInfo(responses.map(res => res.data || null));
        } catch (error) {
          console.error("Error loading eligibility data:", error);
        }
      };

      const fetchWorkExperienceData = async () => {
        try {
          const requests = Array.from({ length: 26 }, (_, i) =>
            axios.get(`http://localhost:5000/WorkExperienceRoute/work-experience-table${i + 1}/${employeeNumber}`)
          );
          const responses = await Promise.all(requests);
          setWorkExperienceInfo(responses.map(res => res.data || null));
        } catch (error) {
          console.error("Error loading work experience data:", error);
        }
      };

      fetchEligibilityData();
      fetchWorkExperienceData();
    }
  }, [employeeNumber]);

  // Normalize data
  const normalizedEligibility = [...eligibilityInfo.filter(e => e !== null)];
  while (normalizedEligibility.length < 7) normalizedEligibility.push(null);

  const normalizedWorkExperience = [...workexperience.filter(e => e !== null)];
  while (normalizedWorkExperience.length < 26) normalizedWorkExperience.push(null);






   










    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor:'white'}}>
            <div style={{ overflow:'hidden', border: '1px solid black', padding: '0.25in', width: '8in', height: '14in' }}>
                     
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

                    {normalizedEligibility.map((eligibility, index) => (
                      <tr key={index}>

                        <td colSpan="6" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                       {eligibility ? eligibility.eligibilityName: 'N/A'}
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        {eligibility ? eligibility.eligibilityRating: 'N/A'}                   
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        {eligibility ? eligibility.eligibilityDateOfExam: 'N/A'}    
                        </td>
                        <td colSpan="5" style={{height:'0.25in', fontSize:'62.5%', border: '1px solid black'}}>
                        {eligibility ? eligibility.eligibilityPlaceOfExam: 'N/A'}
                        </td>
                        <td colSpan="2" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        {eligibility ? eligibility.licenseNumber: 'N/A'}
                        </td>
                        <td colSpan="1" style={{height:'0.25in', fontSize:'52.5%', border: '1px solid black'}}>
                        {eligibility ? eligibility.DateOfValidity: 'N/A'}
                        </td>
                    </tr>
                  ))}


                    




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



                    {normalizedWorkExperience.map((workexperience, index) => (
                    <tr key={index}>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.workDateFrom: 'N/A'}
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.workDateTo: 'N/A'}
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.workPositionTitle: 'N/A'}
                        </td>
                        <td colSpan="4" style={{height:'0.3in', fontSize:'62.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.workCompany: 'N/A'}
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.workMonthlySalary: 'N/A'}
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.SalaryJobOrPayGrade: 'N/A'}
                        </td>
                        <td colSpan="2" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.StatusOfAppointment: 'N/A'}
                        </td>
                        <td colSpan="1" style={{height:'0.3in', fontSize:'52.5%', border: '1px solid black'}}>
                        {workexperience ? workexperience.isGovtService: 'N/A'}
                        </td>
                    </tr>
                    ))}

          




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

                    </tbody>
                </table>
        </div>
    </div>




);
}








export default PDS2;











