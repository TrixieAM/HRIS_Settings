import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';


const PlantillaTable = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [newPlantilla, setNewPlantilla] = useState({
    employeeNumber: '',
    plantilla_code: '',
    position: '',
    salary_grade_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});


  useEffect(() => {
    fetchPlantillas();
  }, []);


  const fetchPlantillas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/PlantillaTable/plantilla');
      setPlantillas(res.data);
    } catch (err) {
      console.error('Error fetching plantilla:', err);
    }
  };


  const addPlantilla = async () => {
    try {
      await axios.post('http://localhost:5000/PlantillaTable/plantilla', newPlantilla);
      setNewPlantilla({ employeeNumber: '', plantilla_code: '', position: '', salary_grade_id: '' });
      fetchPlantillas();
    } catch (err) {
      console.error('Error adding plantilla:', err);
    }
  };


  const updatePlantilla = async () => {
    try {
      await axios.put(`http://localhost:5000/PlantillaTable/plantilla/${editingId}`, editData);
      setEditingId(null);
      fetchPlantillas();
    } catch (err) {
      console.error('Error updating plantilla:', err);
    }
  };


  const deletePlantilla = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/PlantillaTable/plantilla/${id}`);
      fetchPlantillas();
    } catch (err) {
      console.error('Error deleting plantilla:', err);
    }
  };


  return (
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1' }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#6D2323', color: '#ffffff', padding: '10px',
          borderRadius: '8px', marginBottom: '25px'
        }}>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>Plantilla Table</h4>
          <p style={{ margin: 0, fontSize: '85%', marginLeft: '.25%' }}>Manage Plantilla Records</p>
        </div>


        <Box display="flex" gap={2} marginLeft="0px">
        <TextField
            label="Employee Number"
            value={newPlantilla.employeeNumber}
            onChange={(e) => setNewPlantilla({ ...newPlantilla, employeeNumber: e.target.value })}
            style={{ width: '300px' }}
          />
           <TextField
            label="Plantilla Code"
            value={newPlantilla.plantilla_code}
            onChange={(e) => setNewPlantilla({ ...newPlantilla, plantilla_code: e.target.value })}
            style={{ width: '300px' }}
          />
          <TextField
            label="Position"
            value={newPlantilla.position}
            onChange={(e) => setNewPlantilla({ ...newPlantilla, position: e.target.value })}
            style={{ width: '300px' }}
          />
          <TextField
            label="Salary Grade ID"
            value={newPlantilla.salary_grade_id}
            onChange={(e) => setNewPlantilla({ ...newPlantilla, salary_grade_id: e.target.value })}
            style={{ width: '300px' }}
            type="number"
          />
        </Box>


        <Button
          onClick={addPlantilla}
          variant="contained"
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            width: '100%',
            marginTop: '35px',
            marginLeft: '0px'
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>


      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px', overflowX: 'auto'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Plantilla Code</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Salary Grade ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantillas.map((row) => (
              <TableRow key={row.id}>
                {editingId === row.id ? (
                  <>
                  <TableCell>
                      <TextField
                        value={editData.employeeNumber}
                        onChange={(e) =>
                          setEditData({ ...editData, employeeNumber: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.plantilla_code}
                        onChange={(e) =>
                          setEditData({ ...editData, plantilla_code: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.position}
                        onChange={(e) =>
                          setEditData({ ...editData, position: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.salary_grade_id}
                        type="number"
                        onChange={(e) =>
                          setEditData({ ...editData, salary_grade_id: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={updatePlantilla}
                        variant="contained"
                        style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px' }}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="contained"
                        style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px' }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{row.employeeNumber}</TableCell>
                    <TableCell>{row.plantilla_code}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.salary_grade_id}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          onClick={() => {
                            setEditData(row);
                            setEditingId(row.id);
                          }}
                          variant="contained"
                          style={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deletePlantilla(row.id)}
                          variant="contained"
                          style={{ backgroundColor: 'black', color: 'white' }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};


export default PlantillaTable;



