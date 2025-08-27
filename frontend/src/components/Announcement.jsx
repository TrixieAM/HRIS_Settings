import React, { useState } from 'react';
import axios from 'axios';
import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [about, setAbout] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('about', about);
    formData.append('date', date);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/announcements', formData);
      alert('Announcement added!');
      // Clear form after successful submission
      setTitle('');
      setSubtitle('');
      setAbout('');
      setDate('');
      setImage(null);
    } catch (err) {
      alert('Failed to post announcement');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'white', 
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#6D2323',
          mb: 3
        }}>
          <AnnouncementIcon /> Create New Announcement
        </Typography>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Subtitle"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="About"
            value={about}
            onChange={e => setAbout(e.target.value)}
            required
            multiline
            rows={4}
            margin="normal"
          />
          
          <TextField
            fullWidth
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
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
                sx={{ mr: 2 }}
              >
                Choose Image
              </Button>
            </label>
            {image && <Typography variant="body2">{image.name}</Typography>}
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt: 2,
              backgroundColor: '#6D2323',
              '&:hover': {
                backgroundColor: '#541818'
              }
            }}
          >
            Post Announcement
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AnnouncementForm;
