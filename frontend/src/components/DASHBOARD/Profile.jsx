import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Avatar, IconButton, Typography, Box, CircularProgress, Paper, Divider, Grid,
  Container, Fade, useTheme, alpha
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  maxWidth: '1300px',
  width: '90%',
  borderRadius: 16,
  marginLeft: 20,
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(109, 35, 35, 0.15)',
  transition: 'transform 0.3s ease-in-out',

}));

const SectionTitle = styled(Box)(({ theme }) => ({
  backgroundColor: '#6d2323',
  color: '#fef9e1',
  padding: theme.spacing(2, 3),
  borderRadius: 12,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(109, 35, 35, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ProfilePictureContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  padding: theme.spacing(2),
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6d2323 0%, #fef9e1 50%, #ffffff 100%)',
  boxShadow: '0 4px 20px rgba(109, 35, 35, 0.2)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: '0 auto',
  border: `4px solid #ffffff`,
  boxShadow: '0 4px 20px rgba(109, 35, 35, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(109, 35, 35, 0.08)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(109, 35, 35, 0.12)',
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  padding: theme.spacing(4),
  borderRadius: 24,
  background: 'linear-gradient(135deg, #6d2323 0%, #fef9e1 50%, #6d2323 100%)',
  boxShadow: '0 4px 20px rgba(109, 35, 35, 0.15)',
}));

const Profile = () => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const employeeNumber = localStorage.getItem('employeeNumber');
  const theme = useTheme();

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/personalinfo/person_table');
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        setPerson(match);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [employeeNumber]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !person) return;

    const formData = new FormData();
    formData.append('profile', file);

    try {
      const res = await axios.post(
        `http://localhost:5000/upload-profile-picture/${employeeNumber}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setPerson(prev => ({ ...prev, profile_picture: res.data.filePath }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
  
  if (!person) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography variant="h5" color="text.secondary">No profile data found.</Typography>
    </Box>
  );

  const renderField = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <InfoCard>
        <Typography variant="subtitle2" sx={{ color: '#6d2323', fontWeight: 600 }} gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-word', color: '#333' }}>
          {value || 'N/A'}
        </Typography>
      </InfoCard>
    </Grid>
  );

  const addressBlock = (prefix) => (
    <>
      {renderField("House / Lot #", person[`${prefix}_houseBlockLotNum`])}
      {renderField("Street", person[`${prefix}_streetName`])}
      {renderField("Subdivision", person[`${prefix}_subdivisionOrVillage`])}
      {renderField("Barangay", person[`${prefix}_barangayName`])}
      {renderField("City / Municipality", person[`${prefix}_cityOrMunicipality`])}
      {renderField("Province", person[`${prefix}_provinceName`])}
      {renderField("Zip Code", person[`${prefix}_zipcode`])}
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Fade in={true} timeout={1000}>
        <StyledPaper>
          {/* Profile Header */}
          <ProfileHeader>
            <Box position="relative" display="inline-block">
              <ProfileAvatar
                src={`http://localhost:5000${person.profile_picture}`}
              />
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#6d2323',
                  color: '#fef9e1',
                  '&:hover': {
                    backgroundColor: '#000000',
                  },
                }}
              >
                <PhotoCamera />
                <input hidden accept="image/*" type="file" onChange={handlePictureChange} />
              </IconButton>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 3,
                fontWeight: 700,
                color: '#6d2323',
                textShadow: '0 2px 4px rgba(109, 35, 35, 0.1)',
                color: '#000000'
              }}
            >
              {person.firstName} {person.middleName} {person.lastName} {person.nameExtension}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#6d2323',
                mt: 1,
                letterSpacing: 1,
                opacity: 0.8,
                color: '#000000'
              }}
            >
              Employee No.: <b>{person.agencyEmployeeNum}</b>
            </Typography>
          </ProfileHeader>

          {/* Content Sections */}
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Personal Information</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("First Name", person.firstName)}
                {renderField("Middle Name", person.middleName)}
                {renderField("Last Name", person.lastName)}
                {renderField("Date of Birth", person.birthDate)}
                {renderField("Place of Birth", person.placeOfBirth)}
                {renderField("Sex", person.sex)}
                {renderField("Civil Status", person.civilStatus)}
                {renderField("Citizenship", person.citizenship)}
                {renderField("Height (cm)", person.heightCm)}
                {renderField("Weight (kg)", person.weightKg)}
                {renderField("Blood Type", person.bloodType)}
              </Grid>
            </Grid>

            {/* Government IDs */}
            <Grid item xs={12}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Government Identification</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("GSIS Number", person.gsisNum)}
                {renderField("Pag-IBIG Number", person.pagibigNum)}
                {renderField("PhilHealth Number", person.philhealthNum)}
                {renderField("SSS Number", person.sssNum)}
                {renderField("TIN Number", person.tinNum)}
              </Grid>
            </Grid>

            {/* Addresses */}
            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Permanent Address</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {addressBlock('permanent')}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Residential Address</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {addressBlock('residential')}
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Contact Information</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("Telephone", person.telephone)}
                {renderField("Mobile", person.mobileNum)}
                {renderField("Email", person.emailAddress)}
              </Grid>
            </Grid>

            {/* Family Information */}
            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Spouse Information</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("Spouse Name", `${person.spouseFirstName} ${person.spouseMiddleName} ${person.spouseLastName} ${person.spouseNameExtension}`)}
                {renderField("Occupation", person.spouseOccupation)}
                {renderField("Employer/Business Name", person.spouseEmployerBusinessName)}
                {renderField("Business Address", person.spouseBusinessAddress)}
                {renderField("Telephone", person.spouseTelephone)}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Parents Information</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("Father's Name", `${person.fatherFirstName} ${person.fatherMiddleName} ${person.fatherLastName} ${person.fatherNameExtension}`)}
                {renderField("Mother's Name", `${person.motherMaidenFirstName} ${person.motherMaidenMiddleName} ${person.motherMaidenLastName}`)}
              </Grid>
            </Grid>

            {/* Education */}
            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Elementary Education</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("School", person.elementaryNameOfSchool)}
                {renderField("Degree", person.elementaryDegree)}
                {renderField("Period", `${person.elementaryPeriodFrom} - ${person.elementaryPeriodTo}`)}
                {renderField("Highest Attained", person.elementaryHighestAttained)}
                {renderField("Year Graduated", person.elementaryYearGraduated)}
                {renderField("Honors", person.elementaryScholarshipAcademicHonorsReceived)}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionTitle>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Secondary Education</Typography>
              </SectionTitle>
              <Grid container spacing={3}>
                {renderField("School", person.secondaryNameOfSchool)}
                {renderField("Degree", person.secondaryDegree)}
                {renderField("Period", `${person.secondaryPeriodFrom} - ${person.secondaryPeriodTo}`)}
                {renderField("Highest Attained", person.secondaryHighestAttained)}
                {renderField("Year Graduated", person.secondaryYearGraduated)}
                {renderField("Honors", person.secondaryScholarshipAcademicHonorsReceived)}
              </Grid>
            </Grid>
          </Grid>
        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default Profile;
