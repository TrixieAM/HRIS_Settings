import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Announcement as AnnouncementIcon,
  Event as EventIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { 
  Container, TextField, Button, Box, Typography, Alert 
} from '@mui/material';

const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  // const [subtitle, setSubtitle] = useState('');
  const [about, setAbout] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('title', title);
    // formData.append('subtitle', subtitle);
    formData.append('about', about);
    formData.append('date', date);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/announcements', formData);
      setSuccess('Announcement added successfully!');
      setTitle('');
      // setSubtitle('');
      setAbout('');
      setDate('');
      setImage(null);
    } catch (err) {
      setError('Failed to post announcement');
      console.error(err);
    }
  };

  // Shared burgundy style for TextFields
  const textFieldStyle = {
    '& label.Mui-focused': { color: '#6D2323' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#6D2323' },
      '&:hover fieldset': { borderColor: '#541818' },
      '&.Mui-focused fieldset': { borderColor: '#6D2323' },
    },
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: '#6D2323',
          color: '#fff',
          padding: '20px',
          borderRadius: '8px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AnnouncementIcon sx={{ fontSize: '3rem', mr: 2 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '4px' }}>
              Create Announcement
            </h4>
            <p style={{ margin: 0, fontSize: '85%' }}>
              Post new announcements for employees
            </p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <Box
        sx={{
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: '#FDECEA',
              color: '#6D2323',
              border: '1px solid #6D2323',
              '& .MuiAlert-icon': { color: '#6D2323' },
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              backgroundColor: '#FEF9E1',
              color: '#6D2323',
              border: '1px solid #6D2323',
              '& .MuiAlert-icon': { color: '#6D2323' },
            }}
          >
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            InputLabelProps={{ required: false }}
            margin="normal"
            sx={textFieldStyle}
          />

          {/* <TextField
            fullWidth
            label="Subtitle"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            margin="normal"
            sx={textFieldStyle}
          /> */}

          <TextField
            fullWidth
            label="About"
            value={about}
            onChange={e => setAbout(e.target.value)}
            InputLabelProps={{ required: false }}
            multiline
            rows={4}
            margin="normal"
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            type="date"
            label="Date"
            value={date}
            onChange={e => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true, required: false }}
            sx={textFieldStyle}
          />

          {/* Image Upload */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              type="file"
              onChange={e => setImage(e.target.files[0])}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button 
                variant="outlined" 
                component="span" 
                sx={{ 
                  mr: 2, 
                  borderColor: '#6D2323', 
                  color: '#6D2323',
                  '&:hover': { borderColor: '#541818', backgroundColor: '#FEF9E1' } 
                }}
              >
                Choose Image
              </Button>
            </label>
            {image && <Typography variant="body2">{image.name}</Typography>}
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                flex: 1,
                backgroundColor: '#6D2323',
                color: '#FEF9E1',
                '&:hover': { backgroundColor: '#541818' },
              }}
            >
              Post Announcement
            </Button>

            <Button
              variant="contained"
              startIcon={<EventIcon />}
              onClick={() => navigate('/holiday')}
              sx={{
                flex: 1,
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Go to Holiday
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AnnouncementForm;
