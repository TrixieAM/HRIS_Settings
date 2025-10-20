import API_BASE_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const SystemSetting = () => {
  const [settings, setSettings] = useState({
    // Color Palette
    primaryColor: '#894444',
    secondaryColor: '#6d2323',
    accentColor: '#FEF9E1',
    textColor: '#FFFFFF',
    hoverColor: '#6D2323',
    
    // Logos
    institutionLogo: '',
    hrisLogo: '',
    
    // Institution Information
    institutionName: 'Eulogio "Amang" Rodriguez Institute of Science and Technology',
    systemName: 'Human Resources Information System',
    institutionAbbreviation: 'EARIST',
    
    // Footer
    footerText: '© 2025 EARIST Manila - Human Resources Information System. All rights Reserved.',
    
    // Advanced Settings
    enableWatermark: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleColorChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleTextChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleLogoUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({
          ...settings,
          [field]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully! Please refresh the page to see changes.',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving settings. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('systemSettings');
      window.location.reload();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ bgcolor: settings.primaryColor, '&:hover': { bgcolor: settings.hoverColor } }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Color Palette Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ mr: 1, color: settings.primaryColor }} />
                <Typography variant="h6" fontWeight="bold">
                  Color Palette
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {[
                  { label: 'Primary Color', field: 'primaryColor' },
                  { label: 'Secondary Color', field: 'secondaryColor' },
                  { label: 'Accent Color', field: 'accentColor' },
                  { label: 'Hover Color', field: 'hoverColor' }
                ].map(({ label, field }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      type="color"
                      value={settings[field]}
                      onChange={(e) => handleColorChange(field, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: settings[field],
                        borderRadius: 1,
                        textAlign: 'center',
                        color: field === 'accentColor' ? '#000' : '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      Preview
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Logo Upload Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ImageIcon sx={{ mr: 1, color: settings.primaryColor }} />
                <Typography variant="h6" fontWeight="bold">
                  Logos
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Institution Logo
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                  >
                    Upload Institution Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('institutionLogo', e)}
                    />
                  </Button>
                  {settings.institutionLogo && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        border: '2px dashed #ccc',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={settings.institutionLogo}
                        alt="Institution Logo Preview"
                        style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    HRIS Logo
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                  >
                    Upload HRIS Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('hrisLogo', e)}
                    />
                  </Button>
                  {settings.hrisLogo && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        border: '2px dashed #ccc',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={settings.hrisLogo}
                        alt="HRIS Logo Preview"
                        style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Institution Information Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: settings.primaryColor }} />
                <Typography variant="h6" fontWeight="bold">
                  Institution Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institution Name"
                    value={settings.institutionName}
                    onChange={(e) => handleTextChange('institutionName', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="System Name"
                    value={settings.systemName}
                    onChange={(e) => handleTextChange('systemName', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institution Abbreviation"
                    value={settings.institutionAbbreviation}
                    onChange={(e) => handleTextChange('institutionAbbreviation', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Footer Settings Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DescriptionIcon sx={{ mr: 1, color: settings.primaryColor }} />
                <Typography variant="h6" fontWeight="bold">
                  Footer Settings
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Footer Text"
                value={settings.footerText}
                onChange={(e) => handleTextChange('footerText', e.target.value)}
                multiline
                rows={3}
              />

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableWatermark}
                      onChange={(e) =>
                        setSettings({ ...settings, enableWatermark: e.target.checked })
                      }
                    />
                  }
                  label="Enable Watermark"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ bgcolor: settings.secondaryColor }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                👁️ Live Preview
              </Typography>
              <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

              {/* Header Preview */}
              <Box
                sx={{
                  bgcolor: settings.primaryColor,
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: settings.textColor }}>
                  {settings.institutionName}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: settings.textColor }}>
                  {settings.systemName}
                </Typography>
              </Box>

              {/* Accent Color Preview */}
              <Box
                sx={{
                  bgcolor: settings.accentColor,
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Selected Item Background (Accent Color)
                </Typography>
              </Box>

              {/* Footer Preview */}
              <Box
                sx={{
                  bgcolor: settings.secondaryColor,
                  p: 2,
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: settings.textColor }}>
                  {settings.footerText}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSetting;