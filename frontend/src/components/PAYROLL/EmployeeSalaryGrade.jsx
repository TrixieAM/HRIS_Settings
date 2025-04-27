import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';


const EmployeeSalaryGrade = () => {
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    employeeNumber: '',
    plantilla_id: '',
    step: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});


  useEffect(() => {
    fetchGrades();
  }, []);


  const fetchGrades = async () => {
    try {
      const res = await axios.get('http://localhost:5000/EmployeeSalaryGrade/employee-salary-grade');
      setGrades(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleAdd = async () => {
    await axios.post('http://localhost:5000/EmployeeSalaryGrade/employee-salary-grade', newGrade);
    setNewGrade({ employeeNumber: '', plantilla_id: '', step: '' });
    fetchGrades();
  };


  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/EmployeeSalaryGrade/employee-salary-grade/${editingId}`, editData);
    setEditingId(null);
    fetchGrades();
  };


  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/EmployeeSalaryGrade/employee-salary-grade/${id}`);
    fetchGrades();
  };


  return (
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#6D2323',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>Employee Salary Grade</h4>
          <p style={{ margin: 0, fontSize: '85%', marginLeft: '.25%' }}>Insert Salary Grade Information</p>
        </div>


        <Box display="flex" flexWrap="wrap" gap={2} marginLeft="0px">
          {Object.keys(newGrade).map((key) => (
            <TextField
              key={key}
              label={key}
              value={newGrade[key]}
              onChange={(e) => setNewGrade({ ...newGrade, [key]: e.target.value })}
              style={{ width: '300px', marginLeft: '15px' }}
            />
          ))}
        </Box>


        <Button
          onClick={handleAdd}
          variant="contained"
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            width: '1000px',
            marginTop: '35px',
            marginLeft: '0px'
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>


      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(newGrade).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                {editingId === grade.id ? (
                  <>
                    {Object.keys(newGrade).map((key) => (
                      <TableCell key={key}>
                        <TextField
                          value={editData[key] || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, [key]: e.target.value })
                          }
                          style={{ width: '120px' }}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        onClick={handleUpdate}
                        variant="contained"
                        style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px', width: '100px' }}
                        startIcon={<SaveIcon />}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="contained"
                        style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', width: '100px', marginBottom: '5px' }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {Object.keys(newGrade).map((key) => (
                      <TableCell key={key}>{grade[key]}</TableCell>
                    ))}
                    <TableCell>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          onClick={() => {
                            setEditData(grade);
                            setEditingId(grade.id);
                          }}
                          variant="contained"
                          style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100px' }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(grade.id)}
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


export default EmployeeSalaryGrade;



