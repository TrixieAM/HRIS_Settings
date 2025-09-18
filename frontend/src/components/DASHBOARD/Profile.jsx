import API_BASE_URL from "../../apiConfig";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Avatar, IconButton, Typography, Box, CircularProgress, Paper,
  Grid, Container, Fade, useTheme, Button, Link, Alert,
  Modal, TextField
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";



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
  const [user, setUser] = useState(null);
  const [person, setPerson] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const employeeNumber = localStorage.getItem('employeeNumber');
  const theme = useTheme();

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
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


  // Fetch person data from person_table
  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);

        if (match) {
          setPerson(match);

          // ✅ Only use person's picture if we don't already have one (keeps user->person priority)
          if (match.profile_picture) {
            setProfilePicture(prev => prev || match.profile_picture);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [employeeNumber]); // ← do NOT depend on profilePicture to avoid unintended overrides


useEffect(() => {
  if (person) {
    setFormData(prev => {
      // Only set if formData is empty
      if (Object.keys(prev).length === 0) {
        return person;
      }
      return prev; // keep existing formData while typing
    });
  }
}, [person]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};


  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/personalinfo/person_table/${employeeNumber}`, formData);
      setPerson(formData);
      setEditOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  
  // Upload handler (works even with no person record)
  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeNumber) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({ message: 'Please upload a valid image file (JPEG, PNG, GIF)', type: 'error' });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadStatus({ message: 'File size must be less than 5MB', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('profile', file);

    try {
      setUploadStatus({ message: 'Uploading...', type: 'info' });

      const res = await axios.post(
        `${API_BASE_URL}/upload-profile-picture/${employeeNumber}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      // ✅ Update picture everywhere in state
      const newPicturePath = res.data.filePath;
      setProfilePicture(newPicturePath);

      if (person) {
        setPerson(prev => ({ ...prev, profile_picture: newPicturePath }));
      }
      if (user) {
        setUser(prev => ({ ...prev, profile_picture: newPicturePath }));
      }

      setUploadStatus({ message: 'Profile picture updated successfully!', type: 'success' });
      setTimeout(() => setUploadStatus({ message: '', type: '' }), 3000);

    } catch (err) {
      console.error('Image upload failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setUploadStatus({ message: errorMessage, type: 'error' });
      setTimeout(() => setUploadStatus({ message: '', type: '' }), 5000);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  const renderField = (label, value) => (
    <Grid item xs={12} sm={6} md={4} key={label + (value || '')}>
      <InfoCard>
        <Typography variant="subtitle2" sx={{ color: '#6d2323', fontWeight: 600 }} gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-word', color: '#333' }}>
          {value || '...'}
        </Typography>
      </InfoCard>
    </Grid>
  );

  const addressBlock = (prefix) => (
    <>
      {renderField("House & Lot Number", person?.[`${prefix}_houseBlockLotNum`])}
      {renderField("Street", person?.[`${prefix}_streetName`])}
      {renderField("Subdivision", person?.[`${prefix}_subdivisionOrVillage`])}
      {renderField("Barangay", person?.[`${prefix}_barangayName`])}
      {renderField("City/Municipality", person?.[`${prefix}_cityOrMunicipality`])}
      {renderField("Province", person?.[`${prefix}_provinceName`])}
      {renderField("Zip Code", person?.[`${prefix}_zipcode`])}
    </>
  );
  

 const handleRemovePicture = async () => {
  if (!person?.id) return; // make sure you have the correct id

  try {
    await axios.delete(`${API_BASE_URL}/personalinfo/remove-profile-picture/${person.id}`);

    // Update frontend state
    setProfilePicture(null);
    setPerson(prev => ({ ...prev, profile_picture: null }));

    setUploadStatus({ message: 'Profile picture removed successfully!', type: 'success' });
    setTimeout(() => setUploadStatus({ message: '', type: '' }), 3000);

  } catch (err) {
    console.error('Remove picture failed:', err);
    setUploadStatus({ message: 'Failed to remove picture.', type: 'error' });
    setTimeout(() => setUploadStatus({ message: '', type: '' }), 3000);
  }
};


const SectionCard = ({ title, icon, subtitle, children }) => (
  <Box
    sx={{
      p: 3,
      mb: 3,
      bgcolor: "#fff",
      borderRadius: 3,
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      borderLeft: "6px solid #6d2323",
    }}
  >
    <Box display="flex" alignItems="center" mb={2}>
      {React.cloneElement(icon, { sx: { color: "#6d2323", mr: 1 } })}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
        {title} {subtitle && <i style={{ fontWeight: 400, fontStyle: "italic", marginLeft: 6 }}>{subtitle}</i>}
      </Typography>
    </Box>
    {children}
  </Box>
);

const textfieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff8f5",
  },
  "& label.Mui-focused": { color: "#6d2323" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#6d2323", borderWidth: 1.5 },
};

const disabledFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#f0f0f0",
  },
};


  return (
    <Container sx={{ py: -1, mb: 5 }}>
  <Fade in={true} timeout={1000}>
    <StyledPaper>
      {/* Profile Header with editable avatar */}
      <ProfileHeader sx={{ mb: -8}}>
        <Box position="relative" display="inline-block">
          <ProfileAvatar
            src={
              profilePicture
                ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}`
                : undefined
            }
            alt="Profile Picture"
            key={profilePicture}
            sx={{ border: "4px solid #6d2323", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", backgroundColor: 'white' }}
          >
            {!profilePicture &&
              (user?.username
                ? user.username.charAt(0).toUpperCase()
                : <PersonIcon sx={{ fontSize: 100, color: "#6d2323", backgroundColor: 'white'}} />)}
          </ProfileAvatar>
        </Box>

        {/* Name + Employee No. */}
        {user ? (
          <>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                fontWeight: 700,
                color: "#6d2323",
                textShadow: "0 2px 4px rgba(109, 35, 35, 0.2)",
              }}
            >
              {user.username}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#000", mt: 10, letterSpacing: 1 }}>
              Employee No.: <b>{user.employeeNumber}</b>
            </Typography>
          </>
        ) : person ? (
          <>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                fontWeight: 700,
                color: "#6d2323",
                textShadow: "0 2px 4px rgba(109, 35, 35, 0.2)",
              }}
            >
              {person.firstName} {person.middleName} {person.lastName} {person.nameExtension}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#000", mt: 1, letterSpacing: 1 }}>
              Employee No.: <b>{person.agencyEmployeeNum}</b>
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ mt: 3, color: "#666" }}>
            No profile data found
          </Typography>
        )}

        {person && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleEditOpen}
              sx={{ bgcolor: "#6d2323", "&:hover": { bgcolor: "#a44a4aff" } }}
            >
              Edit Information
            </Button>
          </Box>
        )}
      </ProfileHeader>

      {!person ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h4" color="text.secondary">No employee data found!</Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Contact administrator to set up your profile.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} mt={2}>

         {/* Personal Information */}
          <Grid item xs={12}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Personal Information
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("First Name", person.firstName)}
              {renderField("Middle Name", person.middleName)}
              {renderField("Last Name", person.lastName)}
              {renderField("Name Extension", person.nameExtension)}
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
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BadgeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Government Identification
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("GSIS Number", person.gsisNum)}
              {renderField("Pag-IBIG Number", person.pagibigNum)}
              {renderField("PhilHealth Number", person.philhealthNum)}
              {renderField("SSS Number", person.sssNum)}
              {renderField("TIN Number", person.tinNum)}
              {renderField("Agency Employee Number", person.agencyEmployeeNum)}
            </Grid>
          </Grid>

          {/* Permanent Address */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Permanent Address
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {addressBlock('permanent')}
            </Grid>
          </Grid>

          {/* Residential Address */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Residential Address
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {addressBlock('residential')}
            </Grid>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CallIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Contact Information
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("Telephone", person.telephone)}
              {renderField("Mobile", person.mobileNum)}
              {renderField("Email", person.emailAddress)}
            </Grid>
          </Grid>

          {/* Spouse Information */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Spouse Information
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("Spouse Name",(`${person.spouseFirstName || ''} ${person.spouseMiddleName || ''} ${person.spouseLastName || ''} ${person.spouseNameExtension || ''}`).trim() || null)}
              {renderField("Occupation", person.spouseOccupation)}
              {renderField("Employer/Business Name", person.spouseEmployerBusinessName)}
              {renderField("Business Address", person.spouseBusinessAddress)}
              {renderField("Telephone", person.spouseTelephone)}
            </Grid>
          </Grid>

          {/* Parents Information */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FamilyRestroomIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Parents Information
              </Typography>
            </SectionTitle>
            <Grid container spacing={1}>
              {renderField("Father's Name", `${person.fatherFirstName || ''} ${person.fatherMiddleName || ''} ${person.fatherLastName || ''} ${person.fatherNameExtension || ''}`)}
              {renderField("Mother's Name", `${person.motherMaidenFirstName || ''} ${person.motherMaidenMiddleName || ''} ${person.motherMaidenLastName || ''}`)}
            </Grid>
          </Grid>

          {/* Elementary Education */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Elementary Education
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("School", person.elementaryNameOfSchool)}
              {renderField("Degree", person.elementaryDegree)}
              {renderField("Period", `${person.elementaryPeriodFrom || ''} - ${person.elementaryPeriodTo || ''}`)}
              {renderField("Highest Attained", person.elementaryHighestAttained)}
              {renderField("Year Graduated", person.elementaryYearGraduated)}
              {renderField("Honors", person.elementaryScholarshipAcademicHonorsReceived)}
            </Grid>
          </Grid>

          {/* Secondary Education */}
          <Grid item xs={12} md={6}>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Secondary Education
              </Typography>
            </SectionTitle>
            <Grid container spacing={3}>
              {renderField("School", person.secondaryNameOfSchool)}
              {renderField("Degree", person.secondaryDegree)}
              {renderField("Period", `${person.secondaryPeriodFrom || ''} - ${person.secondaryPeriodTo || ''}`)}
              {renderField("Highest Attained", person.secondaryHighestAttained)}
              {renderField("Year Graduated", person.secondaryYearGraduated)}
              {renderField("Honors", person.secondaryScholarshipAcademicHonorsReceived)}
            </Grid>
          </Grid>

        </Grid>
      )}
        <Modal open={editOpen} onClose={handleEditClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 1000,
                bgcolor: "#fff8f5",
                borderRadius: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                p: 5,
                maxHeight: "90vh",
                overflowY: "auto",
                borderTop: "6px solid #6d2323",
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "#6d2323", borderRadius: 4 },
              }}
            >
              {/* Modal Header */}
              <Box display="flex" alignItems="center" mb={4} borderBottom="1px solid #e0dcdc" pb={2}>
                <PersonIcon sx={{ color: "#6d2323", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} sx={{ color: "#6d2323" }}>
                  Edit Employee Information
                </Typography>
              </Box>

              {/* Profile Picture */}
              <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                {uploadStatus.message && (
                  <Alert
                    severity={uploadStatus.type}
                    onClose={() => setUploadStatus({ message: '', type: '' })}
                    sx={{ borderRadius: 3, width: "100%", mb: 3, fontWeight: 500 }}
                  >
                    {uploadStatus.message}
                  </Alert>
                )}
                <ProfileAvatar
                  src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                  sx={{
                    width: 130,
                    height: 130,
                    border: "3px solid #6d2323",
                    fontSize: 50,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  {!profilePicture && (user?.username
                    ? user.username.charAt(0).toUpperCase()
                    : <PersonIcon sx={{ fontSize: 50, color: "#6d2323" }} />)}
                </ProfileAvatar>

                <Box display="flex" gap={2} mt={3}>
                  <Button
                    component="label"
                    startIcon={<PhotoCamera sx={{ color: "#fff" }} />}
                    variant="contained"
                    sx={{
                      bgcolor: "#6d2323",
                      "&:hover": { bgcolor: "#a44a4aff" },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Upload
                    <input hidden accept="image/*" type="file" onChange={handlePictureChange} />
                  </Button>
                  <Button
                    startIcon={<CloseIcon sx={{ color: "#fff" }} />}
                    onClick={handleRemovePicture}
                    variant="contained"
                    sx={{
                      bgcolor: "#4c4747",
                      "&:hover": { bgcolor: "#333" },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>

              {/* Form Sections */}
              <Grid container spacing={3}>
                {/** Sections with all fields included **/}
                {[
                  { icon: <PersonIcon />, title: "Personal Information", fields: [
                      ["First Name", "firstName"],
                      ["Middle Name", "middleName"],
                      ["Last Name", "lastName"],
                      ["Name Extension", "nameExtension"],
                      ["Date of Birth", "birthDate"],
                      ["Place of Birth", "placeOfBirth"],
                      ["Sex", "sex"],
                      ["Civil Status", "civilStatus"],
                      ["Citizenship", "citizenship"],
                      ["Height (cm)", "heightCm"],
                      ["Weight (kg)", "weightKg"],
                      ["Blood Type", "bloodType"],
                  ]},
                  { icon: <BadgeIcon />, title: "Government Identification", subtitle: <i>(Please contact administrator for assistance)</i>, fields: [
                      ["GSIS Number", "gsisNum", true],
                      ["Pag-IBIG Number", "pagibigNum", true],
                      ["PhilHealth Number", "philhealthNum", true],
                      ["SSS Number", "sssNum", true],
                      ["TIN Number", "tinNum", true],
                      ["Agency Employee Number", "agencyEmployeeNum", true],
                  ]},
                  { icon: <HomeIcon />, title: "Permanent Address", fields: [
                      ["Street", "permanentStreet"],
                      ["Barangay", "permanentBarangay"],
                      ["City/Municipality", "permanentCity"],
                      ["Province", "permanentProvince"],
                      ["Zip Code", "permanentZip"],
                  ]},
                  { icon: <HomeIcon />, title: "Residential Address", fields: [
                      ["Street", "residentialStreet"],
                      ["Barangay", "residentialBarangay"],
                      ["City/Municipality", "residentialCity"],
                      ["Province", "residentialProvince"],
                      ["Zip Code", "residentialZip"],
                  ]},
                  { icon: <CallIcon />, title: "Contact Information", fields: [
                      ["Telephone", "telephone"],
                      ["Mobile", "mobileNum"],
                      ["Email", "emailAddress"],
                  ]},
                  { icon: <GroupIcon />, title: "Spouse Information", fields: [
                      ["Spouse First Name", "spouseFirstName"],
                      ["Spouse Middle Name", "spouseMiddleName"],
                      ["Spouse Last Name", "spouseLastName"],
                      ["Spouse Name Extension", "spouseNameExtension"],
                      ["Occupation", "spouseOccupation"],
                      ["Employer/Business Name", "spouseEmployerBusinessName"],
                      ["Business Address", "spouseBusinessAddress"],
                      ["Telephone", "spouseTelephone"],
                  ]},
                  { icon: <FamilyRestroomIcon />, title: "Parents Information", fields: [
                      ["Father First Name", "fatherFirstName"],
                      ["Father Middle Name", "fatherMiddleName"],
                      ["Father Last Name", "fatherLastName"],
                      ["Father Name Extension", "fatherNameExtension"],
                      ["Mother Maiden First Name", "motherMaidenFirstName"],
                      ["Mother Maiden Middle Name", "motherMaidenMiddleName"],
                      ["Mother Maiden Last Name", "motherMaidenLastName"],
                  ]},
                  { icon: <SchoolIcon />, title: "Elementary Education", fields: [
                      ["School", "elementaryNameOfSchool"],
                      ["Degree", "elementaryDegree"],
                      ["Period", "elementaryPeriodFromTo"],
                      ["Highest Attained", "elementaryHighestAttained"],
                      ["Year Graduated", "elementaryYearGraduated"],
                      ["Honors", "elementaryScholarshipAcademicHonorsReceived"],
                  ]},
                  { icon: <SchoolIcon />, title: "Secondary Education", fields: [
                      ["School", "secondaryNameOfSchool"],
                      ["Degree", "secondaryDegree"],
                      ["Period", "secondaryPeriodFromTo"],
                      ["Highest Attained", "secondaryHighestAttained"],
                      ["Year Graduated", "secondaryYearGraduated"],
                      ["Honors", "secondaryScholarshipAcademicHonorsReceived"],
                  ]},
                ].map((section, idx) => (
                  <Grid item xs={12} key={idx}>
                    <SectionCard title={section.title} icon={section.icon} subtitle={section.subtitle}>
                      <Grid container spacing={2}>
                        {section.fields.map(([label, name, disabled], fidx) => (
                          <Grid item xs={12} sm={section.fields.length > 2 ? 4 : 6} key={fidx}>
                            <TextField
                              label={label}
                              name={name}
                              type={name === "birthDate" ? "date" : "text"}
                              value={formData[name] || ""}
                              onChange={handleFormChange}
                              fullWidth
                              size="small"
                              variant="outlined"
                              disabled={disabled}
                              sx={disabled ? disabledFieldStyle : textfieldStyle}
                              InputLabelProps={name === "birthDate" ? { shrink: true } : {}}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </SectionCard>
                  </Grid>
                ))}

                {/* Save/Cancel */}
                <Grid item xs={12} mt={4} textAlign="right">
                  <Button
                    onClick={handleEditClose}
                    sx={{
                      mr: 2,
                      color: "#6d2323",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#f0dede" },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                      bgcolor: "#6d2323",
                      "&:hover": { bgcolor: "#a44a4aff" },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>


        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default Profile;
