import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const VoluntaryWork = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItem2, setNewItem2] = useState('');
  const [newItem3, setNewItem3] = useState('');
  const [newItem4, setNewItem4] = useState('');
  const [newItem5, setNewItem5] = useState('');
  const [newItem6, setNewItem6] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(
      'http://localhost:5000/VoluntaryRoute/voluntary-work'
    );
    setData(response.data);
  };

  const addItem = async () => {
    if (
      newItem.trim() === '' ||
      newItem2.trim() === '' ||
      newItem3.trim() === '' ||
      newItem4.trim() === '' ||
      newItem5.trim() === '' ||
      newItem6.trim() === ''
    )
      return;
    await axios.post('http://localhost:5000/VoluntaryRoute/voluntary-work', {
      nameAndAddress: newItem,
      dateFrom: newItem2,
      dateTo: newItem3,
      numberOfHours: newItem4,
      natureOfWork: newItem5,
      person_id: newItem6,
    });
    setNewItem('');
    setNewItem2('');
    setNewItem3('');
    setNewItem4('');
    setNewItem5('');
    setNewItem6('');
    fetchItems();
  };

  const updateItem = async () => {
    if (
      !editItem ||
      editItem.nameAndAddress.trim() === '' ||
      editItem.dateFrom.trim() === '' ||
      editItem.dateTo.trim() === '' ||
      String(editItem.numberOfHours).trim() === '' ||
      String(editItem.natureOfWork).trim() === '' ||
      String(editItem.person_id).trim() === ''
    )
      return;

    await axios.put(
      `http://localhost:5000/VoluntaryRoute/voluntary-work/${editItem.id}`,
      {
        nameAndAddress: editItem.nameAndAddress,
        dateFrom: editItem.dateFrom,
        dateTo: editItem.dateTo,
        numberOfHours: String(editItem.numberOfHours),
        natureOfWork: String(editItem.natureOfWork),
        person_id: editItem.person_id,
      }
    );

    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(
      `http://localhost:5000/VoluntaryRoute/voluntary-work/${id}`
    );
    fetchItems();
  };

  return (
    <Container>
      {/* Styled Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#6D2323',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ width: '100%', color: '#FEF9E1', margin: 0 }}>
          Voluntary Work
        </h1>
      </div>

      {/* Add New Item Form Box */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginBottom: 2 }}>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Name and Address"
              value={newItem}
              sx={{ marginRight: 1 }}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <TextField
              label="Date From"
              InputLabelProps={{ shrink: true }}
              type="date"
              value={newItem2}
              sx={{ marginRight: 1 }}
              onChange={(e) => setNewItem2(e.target.value)}
            />
            <TextField
              label="Date To"
              InputLabelProps={{ shrink: true }}
              type="date"
              value={newItem3}
              sx={{ marginRight: 1 }}
              onChange={(e) => setNewItem3(e.target.value)}
            />
            <TextField
              label="Number of Hours"
              value={newItem4}
              sx={{ marginRight: 1 }}
              onChange={(e) => setNewItem4(e.target.value)}
            />
            <TextField
              label="Nature of Works"
              value={newItem5}
              sx={{ marginRight: 1 }}
              onChange={(e) => setNewItem5(e.target.value)}
            />
            <TextField
              label="Person ID"
              value={newItem6}
              sx={{ marginRight: 2 }}
              onChange={(e) => setNewItem6(e.target.value)}
            />
          </Box>
          <Button
            onClick={addItem}
            variant="contained"
            color="primary"
            style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '1120px', marginTop: '5px', marginLeft: '5px' }}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Items Table */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name and Address</TableCell>
              <TableCell>Date From</TableCell>
              <TableCell>Date To</TableCell>
              <TableCell>Number of Hours</TableCell>
              <TableCell>Nature of Works</TableCell>
              <TableCell>Person ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={editItem.nameAndAddress}
                      onChange={(e) =>
                        setEditItem({ ...editItem, nameAndAddress: e.target.value })
                      }
                    />
                  ) : (
                    item.nameAndAddress
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={editItem.dateFrom}
                      onChange={(e) =>
                        setEditItem({ ...editItem, dateFrom: e.target.value })
                      }
                    />
                  ) : (
                    item.dateFrom
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={editItem.dateTo}
                      onChange={(e) =>
                        setEditItem({ ...editItem, dateTo: e.target.value })
                      }
                    />
                  ) : (
                    item.dateTo
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={String(editItem.numberOfHours)}
                      onChange={(e) =>
                        setEditItem({ ...editItem, numberOfHours: e.target.value })
                      }
                    />
                  ) : (
                    item.numberOfHours
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={String(editItem.natureOfWork)}
                      onChange={(e) =>
                        setEditItem({ ...editItem, natureOfWork: e.target.value })
                      }
                    />
                  ) : (
                    item.natureOfWork
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <TextField
                      value={String(editItem.person_id)}
                      onChange={(e) =>
                        setEditItem({ ...editItem, person_id: e.target.value })
                      }
                    />
                  ) : (
                    item.person_id
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === item.id ? (
                    <>
                      <Button
                        onClick={updateItem}
                        variant="contained"
                        color="primary"
                        sx={{
                          width: '100px',
                          backgroundColor: '#6c0b19',
                          color: 'white',
                        }}
                        startIcon={<SaveIcon />}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => setEditItem(null)}
                        variant="outlined"
                        color="secondary"
                        sx={{
                          width: '100px',
                          color: 'white',
                          backgroundColor: '#000000',
                          marginTop: '5px',
                        }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditItem(item)}
                        variant="outlined"
                        color="primary"
                        sx={{
                          marginRight: 2,
                          width: '100px',
                          backgroundColor: '#6c0b19',
                          color: 'white',
                        }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteItem(item.id)}
                        variant="outlined"
                        color="secondary"
                        sx={{
                          width: '100px',
                          color: 'white',
                          backgroundColor: '#000000',
                          marginTop: '5px',
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default VoluntaryWork;
