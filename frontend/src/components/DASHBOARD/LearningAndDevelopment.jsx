import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Paper } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const LearningAndDevelopment = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItem2, setNewItem2] = useState('');
  const [newItem3, setNewItem3] = useState('');
  const [newItem4, setNewItem4] = useState('');
  const [newItem5, setNewItem5] = useState('');
  const [newItem6, setNewItem6] = useState('');
  const [newItem7, setNewItem7] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/learning_and_development_table');
    setData(response.data);
  };

  const addItem = async () => {
    if (
      newItem.trim() === '' ||
      newItem2.trim() === '' ||
      newItem3.trim() === '' ||
      newItem4.trim() === '' ||
      newItem5.trim() === '' ||
      newItem6.trim() === '' ||
      newItem7.trim() === ''
    )
      return;
    await axios.post('http://localhost:5000/learning_and_development_table', {
      titleOfProgram: newItem,
      dateFrom: newItem2,
      dateTo: newItem3,
      numberOfHours: newItem4,
      typeOfLearningDevelopment: newItem5,
      conductedSponsored: newItem6,
      person_id: newItem7,
    });
    setNewItem('');
    setNewItem2('');
    setNewItem3('');
    setNewItem4('');
    setNewItem5('');
    setNewItem6('');
    setNewItem7('');
    fetchItems();
  };

  const updateItem = async () => {
    if (
      !editItem ||
      editItem.titleOfProgram.trim() === '' ||
      editItem.dateFrom.trim() === '' ||
      editItem.dateTo.trim() === '' ||
      editItem.numberOfHours === '' ||
      editItem.typeOfLearningDevelopment.trim() === '' ||
      editItem.conductedSponsored === '' ||
      editItem.person_id === ''
    )
      return;
    await axios.put(`http://localhost:5000/learning_and_development_table/${editItem.id}`, {
      titleOfProgram: editItem.titleOfProgram,
      dateFrom: editItem.dateFrom,
      dateTo: editItem.dateTo,
      numberOfHours: editItem.numberOfHours,
      typeOfLearningDevelopment: editItem.typeOfLearningDevelopment,
      conductedSponsored: editItem.conductedSponsored,
      person_id: editItem.person_id,
    });
    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/learning_and_development_table/${id}`);
    fetchItems();
  };

  return (
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1' }}>
      {/* Red Header Section */}
      <div
        style={{
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h5" style={{ margin: 0, fontWeight: 'bold' }}>Learning and Development Dashboard</Typography>
        <Typography variant="h6" style={{ margin: 0 }}>Add New Program</Typography>
      </div>

      {/* Add New Learning and Development Form Box */}
      <Paper
        elevation={3}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Title of Program"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Date From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newItem2}
            onChange={(e) => setNewItem2(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newItem3}
            onChange={(e) => setNewItem3(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Number of Hours"
            value={newItem4}
            onChange={(e) => setNewItem4(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Type of Learning Development"
            value={newItem5}
            onChange={(e) => setNewItem5(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Conducted/Sponsored"
            value={newItem6}
            onChange={(e) => setNewItem6(e.target.value)}
            style={{ width: '324.25px' }}
          />
          <TextField
            label="Person ID"
            value={newItem7}
            onChange={(e) => setNewItem7(e.target.value)}
            style={{ width: '324.25px' }}
          />
        </Box>
        <Button
          onClick={addItem}
          variant="contained"
          style={{
            backgroundColor: '#6D2323',
            color: '#FEF9E1',
            width: '100%',
            marginTop: '35px',
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Paper>

      {/* Learning and Development Table */}
      <Paper
        elevation={3}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" style={{ marginBottom: '20px' }}>Programs List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title of Program</TableCell>
              <TableCell>Date From</TableCell>
              <TableCell>Date To</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Conducted/Sponsored</TableCell>
              <TableCell>Person ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {editItem && editItem.id === item.id ? (
                  <>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.titleOfProgram}
                        onChange={(e) => setEditItem({ ...editItem, titleOfProgram: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.dateFrom}
                        onChange={(e) => setEditItem({ ...editItem, dateFrom: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.dateTo}
                        onChange={(e) => setEditItem({ ...editItem, dateTo: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.numberOfHours}
                        onChange={(e) => setEditItem({ ...editItem, numberOfHours: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.typeOfLearningDevelopment}
                        onChange={(e) => setEditItem({ ...editItem, typeOfLearningDevelopment: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.conductedSponsored}
                        onChange={(e) => setEditItem({ ...editItem, conductedSponsored: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.person_id}
                        onChange={(e) => setEditItem({ ...editItem, person_id: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={updateItem} variant="contained" style={{ backgroundColor: '#6D2323', color: '#FEF9E1' }} startIcon={<SaveIcon />}>Save</Button>
                      <Button onClick={() => setEditItem(null)} variant="contained" style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px' }} startIcon={<CancelIcon />}>Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.titleOfProgram}</TableCell>
                    <TableCell>{item.dateFrom}</TableCell>
                    <TableCell>{item.dateTo}</TableCell>
                    <TableCell>{item.numberOfHours}</TableCell>
                    <TableCell>{item.typeOfLearningDevelopment}</TableCell>
                    <TableCell>{item.conductedSponsored}</TableCell>
                    <TableCell>{item.person_id}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEditItem(item)} variant="contained" style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginRight: '10px' }} startIcon={<EditIcon />}>Edit</Button>
                      <Button onClick={() => deleteItem(item.id)} variant="contained" style={{ backgroundColor: 'black', color: 'white' }} startIcon={<DeleteIcon />}>Delete</Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default LearningAndDevelopment;
