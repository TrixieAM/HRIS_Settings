import API_BASE_URL from "../../apiConfig";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Avatar, Typography, Box, CircularProgress, Paper,
  Grid, Container, Fade, Button, Alert,
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

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        setPerson(match);
        
        if (match) {
          setProfilePicture(match.profile_picture);
          // Initialize form data
          const formattedData = { ...match };
          if (match.birthDate) {
            const date = new Date(match.birthDate);
            if (!isNaN(date.getTime())) {
              formattedData.birthDate = date.toISOString().split('T')[0];
            }
          }
          setFormData(formattedData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [employeeNumber]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/personalinfo/person_table/by-employee/${employeeNumber}`, formData);
      setPerson(formData);
      setEditOpen(false);
      setUploadStatus({ message: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setUploadStatus({ message: '', type: '' }), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setUploadStatus({ message: 'Failed to update profile', type: 'error' });
      setTimeout(() => setUploadStatus({ message: '', type: '' }), 3000);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeNumber) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({ message: 'Please upload a valid image file (JPEG, PNG, GIF)', type: 'error' });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
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

      const newPicturePath = res.data.filePath;
      setProfilePicture(newPicturePath);

      if (person) {
        setPerson(prev => ({ ...prev, profile_picture: newPicturePath }));
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

  const handleRemovePicture = async () => {
    if (!person?.id) return;

    try {
      await axios.delete(`${API_BASE_URL}/personalinfo/remove-profile-picture/${person.id}`);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const renderField = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
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

  return (
    <Container sx={{ py: -1, mb: 5 }}>
      <Fade in={true} timeout={1000}>
        <StyledPaper>
          {/* Profile Header */}
          <ProfileHeader sx={{ mb: -8}}>
            <Box position="relative" display="inline-block">
              <ProfileAvatar
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture"
                sx={{ border: "4px solid #6d2323", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", backgroundColor: 'white' }}
              >
                {!profilePicture && <PersonIcon sx={{ fontSize: 100, color: "#6d2323", backgroundColor: 'white'}} />}
              </ProfileAvatar>
            </Box>

            {person ? (
              <>
                <Typography variant="h4" sx={{ mt: 3, fontWeight: 700, color: "#6d2323", textShadow: "0 2px 4px rgba(109, 35, 35, 0.2)" }}>
                  {person.firstName} {person.middleName} {person.lastName} {person.nameExtension}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#000", mt: 1, letterSpacing: 1 }}>
                  Employee No.: <b>{person.agencyEmployeeNum}</b>
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={handleEditOpen} sx={{ bgcolor: "#6d2323", "&:hover": { bgcolor: "#a44a4aff" } }}>
                    Edit Information
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="h6" sx={{ mt: 3, color: "#666" }}>
                No profile data found
              </Typography>
            )}
          </ProfileHeader>

          {/* Status Messages */}
          {uploadStatus.message && (
            <Alert severity={uploadStatus.type} onClose={() => setUploadStatus({ message: '', type: '' })} sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
              {uploadStatus.message}
            </Alert>
          )}

          {!person ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h4" color="text.secondary">No employee data found!</Typography>
              <Typography variant="subtitle1" color="text.secondary" mt={1}>
                Contact administrator to set up your profile.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 6 }}>
              {/* Personal Information */}
              <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1, mt:10 }}>
                <PersonIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Personal Information</Typography>
              </SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
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

              {/* Government IDs */}
              <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BadgeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Government Identification</Typography>
              </SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {renderField("GSIS Number", person.gsisNum)}
                {renderField("Pag-IBIG Number", person.pagibigNum)}
                {renderField("PhilHealth Number", person.philhealthNum)}
                {renderField("SSS Number", person.sssNum)}
                {renderField("TIN Number", person.tinNum)}
                {renderField("Agency Employee Number", person.agencyEmployeeNum)}
              </Grid>

              {/* Addresses Side by Side */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HomeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Permanent Address</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("House & Lot Number", person.permanent_houseBlockLotNum)}
                    {renderField("Street", person.permanent_streetName)}
                    {renderField("Subdivision", person.permanent_subdivisionOrVillage)}
                    {renderField("Barangay", person.permanent_barangay)}
                    {renderField("City/Municipality", person.permanent_cityOrMunicipality)}
                    {renderField("Province", person.permanent_provinceName)}
                    {renderField("Zip Code", person.permanent_zipcode)}
                  </Grid>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HomeIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Residential Address</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("House & Lot Number", person.residential_houseBlockLotNum)}
                    {renderField("Street", person.residential_streetName)}
                    {renderField("Subdivision", person.residential_subdivisionOrVillage)}
                    {renderField("Barangay", person.residential_barangayName)}
                    {renderField("City/Municipality", person.residential_cityOrMunicipality)}
                    {renderField("Province", person.residential_provinceName)}
                    {renderField("Zip Code", person.residential_zipcode)}
                  </Grid>
                </Grid>
              </Grid>

              {/* Contact Information */}
              <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CallIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Contact Information</Typography>
              </SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {renderField("Telephone", person.telephone)}
                {renderField("Mobile", person.mobileNum)}
                {renderField("Email", person.emailAddress)}
              </Grid>

              {/* Family Information Side by Side */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GroupIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Spouse Information</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("Spouse Name", `${person.spouseFirstName || ''} ${person.spouseMiddleName || ''} ${person.spouseLastName || ''} ${person.spouseNameExtension || ''}`.trim() || null)}
                    {renderField("Occupation", person.spouseOccupation)}
                    {renderField("Employer/Business Name", person.spouseEmployerBusinessName)}
                    {renderField("Business Address", person.spouseBusinessAddress)}
                    {renderField("Telephone", person.spouseTelephone)}
                  </Grid>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FamilyRestroomIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Parents Information</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("Father's Name", `${person.fatherFirstName || ''} ${person.fatherMiddleName || ''} ${person.fatherLastName || ''} ${person.fatherNameExtension || ''}`.trim())}
                    {renderField("Mother's Name", `${person.motherMaidenFirstName || ''} ${person.motherMaidenMiddleName || ''} ${person.motherMaidenLastName || ''}`.trim())}
                  </Grid>
                </Grid>
              </Grid>

              {/* Education Side by Side */}
              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Elementary Education</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("School", person.elementaryNameOfSchool)}
                    {renderField("Degree", person.elementaryDegree)}
                    {renderField("Period", `${person.elementaryPeriodFrom || ''} - ${person.elementaryPeriodTo || ''}`)}
                    {renderField("Highest Attained", person.elementaryHighestAttained)}
                    {renderField("Year Graduated", person.elementaryYearGraduated)}
                    {renderField("Honors", person.elementaryScholarshipAcademicHonorsReceived)}
                  </Grid>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <SectionTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: "#ffffff", fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>Secondary Education</Typography>
                  </SectionTitle>
                  <Grid container spacing={2}>
                    {renderField("School", person.secondaryNameOfSchool)}
                    {renderField("Degree", person.secondaryDegree)}
                    {renderField("Period", `${person.secondaryPeriodFrom || ''} - ${person.secondaryPeriodTo || ''}`)}
                    {renderField("Highest Attained", person.secondaryHighestAttained)}
                    {renderField("Year Graduated", person.secondaryYearGraduated)}
                    {renderField("Honors", person.secondaryScholarshipAcademicHonorsReceived)}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Edit Modal - Simplified */}
          <Modal open={editOpen} onClose={handleEditClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "95%",
                maxWidth: 1000,
                bgcolor: "#fff8f5",
                borderRadius: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                p: 4,
                maxHeight: "90vh",
                overflowY: "auto",
                borderTop: "6px solid #6d2323",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} pb={2} borderBottom="1px solid #e0dcdc">
                <Typography variant="h5" fontWeight={700} sx={{ color: "#6d2323" }}>
                  Edit Employee Information
                </Typography>
                <Button onClick={handleEditClose} sx={{ color: "#6d2323" }}>
                  <CloseIcon />
                </Button>
              </Box>

              {/* Profile Picture */}
              <Box textAlign="center" mb={4}>
                <ProfileAvatar
                  src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                  sx={{ width: 120, height: 120, border: "3px solid #6d2323", mb: 2 }}
                >
                  {!profilePicture && <PersonIcon sx={{ fontSize: 50, color: "#6d2323" }} />}
                </ProfileAvatar>
                <Box>
                  <Button component="label" startIcon={<PhotoCamera />} variant="contained" sx={{ bgcolor: "#6d2323", mr: 2 }}>
                    Upload
                    <input hidden accept="image/*" type="file" onChange={handlePictureChange} />
                  </Button>
                  <Button startIcon={<CloseIcon />} onClick={handleRemovePicture} variant="outlined" sx={{ color: "#6d2323", borderColor: "#6d2323" }}>
                    Remove
                  </Button>
                </Box>
              </Box>

              {/* Personal Information Section */}
              <Box sx={{ mb: 4, p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ color: "#6d2323", mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                    Personal Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="First Name" name="firstName" value={formData.firstName || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Middle Name" name="middleName" value={formData.middleName || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Last Name" name="lastName" value={formData.lastName || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Name Extension" name="nameExtension" value={formData.nameExtension || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Date of Birth" name="birthDate" type="date" value={formData.birthDate || ""} onChange={handleFormChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Sex" name="sex" value={formData.sex || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Civil Status" name="civilStatus" value={formData.civilStatus || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Citizenship" name="citizenship" value={formData.citizenship || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Height (cm)" name="heightCm" value={formData.heightCm || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Weight (kg)" name="weightKg" value={formData.weightKg || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Blood Type" name="bloodType" value={formData.bloodType || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                </Grid>
              </Box>

              {/* Government Identification Section */}
              <Box sx={{ mb: 4, p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BadgeIcon sx={{ color: "#6d2323", mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                    Government Identification <i style={{ fontWeight: 400, fontStyle: "italic", marginLeft: 6 }}>(Please contact administrator for assistance)</i>
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="GSIS Number" name="gsisNum" value={formData.gsisNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Pag-IBIG Number" name="pagibigNum" value={formData.pagibigNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="PhilHealth Number" name="philhealthNum" value={formData.philhealthNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="SSS Number" name="sssNum" value={formData.sssNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="TIN Number" name="tinNum" value={formData.tinNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Agency Employee Number" name="agencyEmployeeNum" value={formData.agencyEmployeeNum || ""} onChange={handleFormChange} fullWidth size="small" disabled />
                  </Grid>
                </Grid>
              </Box>

              {/* Address Sections */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Permanent Address */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <HomeIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Permanent Address
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField label="House & Lot Number" name="permanent_houseBlockLotNum" value={formData.permanent_houseBlockLotNum || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Street" name="permanent_streetName" value={formData.permanent_streetName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Subdivision" name="permanent_subdivisionOrVillage" value={formData.permanent_subdivisionOrVillage || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Barangay" name="permanent_barangay" value={formData.permanent_barangay || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="City/Municipality" name="permanent_cityOrMunicipality" value={formData.permanent_cityOrMunicipality || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Province" name="permanent_provinceName" value={formData.permanent_provinceName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Zip Code" name="permanent_zipcode" value={formData.permanent_zipcode || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Residential Address */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <HomeIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Residential Address
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField label="House & Lot Number" name="residential_houseBlockLotNum" value={formData.residential_houseBlockLotNum || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Street" name="residential_streetName" value={formData.residential_streetName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Subdivision" name="residential_subdivisionOrVillage" value={formData.residential_subdivisionOrVillage || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Barangay" name="residential_barangayName" value={formData.residential_barangayName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="City/Municipality" name="residential_cityOrMunicipality" value={formData.residential_cityOrMunicipality || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Province" name="residential_provinceName" value={formData.residential_provinceName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Zip Code" name="residential_zipcode" value={formData.residential_zipcode || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Contact Information */}
              <Box sx={{ mb: 4, p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <CallIcon sx={{ color: "#6d2323", mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                    Contact Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Telephone" name="telephone" value={formData.telephone || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Mobile" name="mobileNum" value={formData.mobileNum || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Email" name="emailAddress" value={formData.emailAddress || ""} onChange={handleFormChange} fullWidth size="small" />
                  </Grid>
                </Grid>
              </Box>

              {/* Family Information */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Spouse Information */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <GroupIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Spouse Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Spouse First Name" name="spouseFirstName" value={formData.spouseFirstName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Spouse Middle Name" name="spouseMiddleName" value={formData.spouseMiddleName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Spouse Last Name" name="spouseLastName" value={formData.spouseLastName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Spouse Name Extension" name="spouseNameExtension" value={formData.spouseNameExtension || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Occupation" name="spouseOccupation" value={formData.spouseOccupation || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Employer/Business Name" name="spouseEmployerBusinessName" value={formData.spouseEmployerBusinessName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Business Address" name="spouseBusinessAddress" value={formData.spouseBusinessAddress || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Telephone" name="spouseTelephone" value={formData.spouseTelephone || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Parents Information */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <FamilyRestroomIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Parents Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Father First Name" name="fatherFirstName" value={formData.fatherFirstName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Father Middle Name" name="fatherMiddleName" value={formData.fatherMiddleName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Father Last Name" name="fatherLastName" value={formData.fatherLastName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Father Name Extension" name="fatherNameExtension" value={formData.fatherNameExtension || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Mother Maiden First Name" name="motherMaidenFirstName" value={formData.motherMaidenFirstName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Mother Maiden Middle Name" name="motherMaidenMiddleName" value={formData.motherMaidenMiddleName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Mother Maiden Last Name" name="motherMaidenLastName" value={formData.motherMaidenLastName || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Education Information */}
              <Grid container spacing={3}>
                {/* Elementary Education */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SchoolIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Elementary Education
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField label="School" name="elementaryNameOfSchool" value={formData.elementaryNameOfSchool || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Degree" name="elementaryDegree" value={formData.elementaryDegree || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Period From" name="elementaryPeriodFrom" value={formData.elementaryPeriodFrom || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Period To" name="elementaryPeriodTo" value={formData.elementaryPeriodTo || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Highest Attained" name="elementaryHighestAttained" value={formData.elementaryHighestAttained || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Year Graduated" name="elementaryYearGraduated" value={formData.elementaryYearGraduated || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Honors" name="elementaryScholarshipAcademicHonorsReceived" value={formData.elementaryScholarshipAcademicHonorsReceived || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Secondary Education */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, borderLeft: "6px solid #6d2323" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SchoolIcon sx={{ color: "#6d2323", mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#6d2323" }}>
                        Secondary Education
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField label="School" name="secondaryNameOfSchool" value={formData.secondaryNameOfSchool || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Degree" name="secondaryDegree" value={formData.secondaryDegree || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Period From" name="secondaryPeriodFrom" value={formData.secondaryPeriodFrom || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Period To" name="secondaryPeriodTo" value={formData.secondaryPeriodTo || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Highest Attained" name="secondaryHighestAttained" value={formData.secondaryHighestAttained || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Year Graduated" name="secondaryYearGraduated" value={formData.secondaryYearGraduated || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Honors" name="secondaryScholarshipAcademicHonorsReceived" value={formData.secondaryScholarshipAcademicHonorsReceived || ""} onChange={handleFormChange} fullWidth size="small" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button onClick={handleEditClose} sx={{ color: "#6d2323" }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#6d2323" }}>
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>

        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default Profile;