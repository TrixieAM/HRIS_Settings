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
  Grid,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SearchIcon from '@mui/icons-material/Search';

const VoluntaryWork = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItem2, setNewItem2] = useState('');
  const [newItem3, setNewItem3] = useState('');
  const [newItem4, setNewItem4] = useState('');
  const [newItem5, setNewItem5] = useState('');
  const [newItem6, setNewItem6] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      backgroundColor: '#6D2323',
      color: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
    }}
    
  >
<div style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
  <VolunteerActivismIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />

  <div>
    <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
      Voluntary Information
    </h4>
    <p style={{ margin: 0, fontSize: '85%' }}>
      Insert Your Voluntary Information
    </p>
  </div>
</div>

  </div>



<Paper elevation={3} sx={{ padding: 5, marginBottom: 3 }}>
  <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginBottom: 2, width: '100%' }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Name and Address"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Date From"
          InputLabelProps={{ shrink: true }}
          type="date"
          value={newItem2}
          onChange={(e) => setNewItem2(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Date To"
          InputLabelProps={{ shrink: true }}
          type="date"
          value={newItem3}
          onChange={(e) => setNewItem3(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Number of Hours"
          value={newItem4}
          onChange={(e) => setNewItem4(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Nature of Works"
          value={newItem5}
          onChange={(e) => setNewItem5(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Person ID"
          value={newItem6}
          onChange={(e) => setNewItem6(e.target.value)}
        />
      </Grid>
    </Grid>

    <Button
      onClick={addItem}
      variant="contained"
      color="primary"
      sx={{
        backgroundColor: '#6D2323',
        color: '#FEF9E1',
        width: '100%',
        marginTop: 5,
      }}
      startIcon={<AddIcon />}
    >
      Add
    </Button>
  </Box>
</Paper>


      {/* Items Table */}
      <Paper elevation={3} sx={{ padding: 2 }}>
      <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={2}
          borderRadius={1}
          marginBottom={2}
        >
          <Box display="flex" alignItems="center">
          <VolunteerActivismIcon sx={{ color: '#6D2323', marginRight: 2, fontSize:'3rem', }} />

            <Typography variant="h5" sx={{ margin: 0, color: '#000000', fontWeight: 'bold' }}  >
              Voluntary Records
            </Typography>
          </Box>


          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Employee Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#6D2323', marginRight: 1 }} />
              ),
            }}
          />
        </Box>
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
  {data.filter((item) => {
    const fullSearchText = `${item.nameAndAddress} ${item.natureOfWork}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      item.person_id?.toString().includes(search) ||
      fullSearchText.includes(search)
    );
  }).length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
        <Typography variant="h6">No matching records found.</Typography>
      </TableCell>
    </TableRow>
  ) : (
    data
      .filter((item) => {
        const fullSearchText = `${item.nameAndAddress} ${item.natureOfWork} ${item.person_id}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
          item.person_id?.toString().includes(search) ||
          fullSearchText.includes(search)
        );
      })
      .map((item) => (
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
                    backgroundColor: '#6D2323',
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
                    backgroundColor: '#6d2323',
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
      ))
  )}
</TableBody>

        </Table>
      </Paper>
    </Container>
  );
};

export default VoluntaryWork;