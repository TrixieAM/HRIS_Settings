import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Link } from '@mui/material';
import childrenDashboardIMG from '../assets/childrenDashboardIMG.jpg';
import LearningDevProgIMG from '../assets/LearningDevProgIMG.jpg';
import VoluntaryWork from '../assets/VoluntaryWork.jpg';
import EligibilityIMG from '../assets/EligibilityIMG.jpg';
import CollegeIMG from '../assets/CollegeIMG.jpg';
import VocationalIMG from '../assets/VocationalIMG.jpg';

const Home = () => {
  const [userData, setUserData] = useState({
    username: '',
    role: '',
    employeeNumber: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserData({
        username: decoded.username || 'Name not available',
        role: decoded.role || 'Role not available',
        employeeNumber: decoded.employeeNumber || 'Employee number not available',
      });
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }, []);

  const isAdminOrSuperAdmin = userData.role === 'superadmin' || userData.role === 'administrator';

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center', color: '#400000', marginTop: '-70px', marginBottom: '-35px', fontSize: '13px' }}>
        <h1 style={{ marginBottom: '-5px' }}>Welcome, {userData.username || 'Guest'}!<br /></h1>
        <h2 style={{ marginBottom: '-10px' }}>Employee ID: {userData.employeeNumber}</h2>
        <h2>Role: {userData.role}</h2>
      </div>

      {isAdminOrSuperAdmin && (
        <>
          <h1 style={{ width: '90%' }}></h1>
          <Grid container spacing={{ xs: 3, md: 1 }} columnSpacing={{ xs: 1, sm: 2, md: 2 }} className="ImageContainer">
            {[{ img: childrenDashboardIMG, link: 'PersonalInfo' },
              { img: childrenDashboardIMG, link: 'ChildrenInfo' },
              { img: LearningDevProgIMG, link: 'Learningdev' },
              { img: VoluntaryWork, link: 'VoluntaryWork' },
              { img: EligibilityIMG, link: 'Eligibility' },
              { img: CollegeIMG, link: 'College' },
              { img: childrenDashboardIMG, link: 'WorkExperience' },
              { img: VocationalIMG, link: 'Vocational' },
              { img: childrenDashboardIMG, link: 'OtherSkills' }]
              .map((item, index) => (
                <Grid item xs={4} key={index}>
                  <Link href={item.link} sx={{ maxWidth: 350 }}>
                    <Box
                      component="img"
                      src={item.img}
                      sx={{
                        border: 'black 1px solid',
                        width: '100%',
                        height: '235px',
                        borderRadius: '8px',
                      }}
                    />
                  </Link>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Home;
