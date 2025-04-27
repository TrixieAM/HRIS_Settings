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


const EmployeeRemittance = () => {
  const [remittances, setRemittances] = useState([]);
  const [newRemittance, setNewRemittance] = useState({
    employeeNumber: '', disallowance: '', gsisSalaryLoan: '', gsisPolicyLoan: '',
    gfal: '', cpl: '', mpl: '', mplLite: '', emergencyLoan: '', nbc594: '',
    increment: '', pagibigFundCont: '', pagibig2: '', multiPurpLoan: '',
    landbankSalaryLoan: '', earistCreditCoop: '', feu: ''
  });
  const [editingRemittanceId, setEditingRemittanceId] = useState(null);
  const [editRemittanceData, setEditRemittanceData] = useState({});


  useEffect(() => {
    fetchRemittances();
  }, []);


  const fetchRemittances = async () => {
    try {
      const result = await axios.get('http://localhost:5000/Remittance/employee-remittance');
      setRemittances(result.data);
    } catch (error) {
      console.error('Error fetching remittances:', error);
    }
  };


  const updateRemittance = async () => {
    try {
      await axios.put(`http://localhost:5000/Remittance/employee-remittance/${editingRemittanceId}`, editRemittanceData);
      setEditingRemittanceId(null);
      fetchRemittances();
    } catch (error) {
      console.error('Failed to update remittance:', error);
    }
  };


  const deleteRemittance = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Remittance/employee-remittance/${id}`);
      fetchRemittances();
    } catch (error) {
      console.error('Error deleting remittance:', error);
    }
  };


  return (
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1' }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}
        >
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>Employee Remittance</h4>
          <p style={{ margin: 0, fontSize: '85%', marginLeft: '.25%' }}>Insert Employee Remittance Information</p>
        </div>


        <Box display="flex" flexWrap="wrap" gap={2} marginLeft="50px">
          {Object.keys(newRemittance).map((key) => (
            <TextField
              key={key}
              label={key}
              value={newRemittance[key]}
              onChange={(e) => setNewRemittance({ ...newRemittance, [key]: e.target.value })}
              style={{ width: '300px', marginLeft: '15px' }}
            />
          ))}
        </Box>


        <Button
          onClick={async () => {
            // Filter out empty fields
            const filteredRemittance = Object.fromEntries(
              Object.entries(newRemittance).filter(([_, value]) => value !== '')
            );
         
            await axios.post('http://localhost:5000/Remittance/employee-remittance', filteredRemittance);
            fetchRemittances();
            setNewRemittance(Object.fromEntries(Object.keys(newRemittance).map(k => [k, ''])));
          }}
         
          variant="contained"
          style={{
            backgroundColor: '#6D2323',
            color: '#ffffff',
            width: '1000px',
            marginTop: '35px',
            marginLeft: '50px'
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>


      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          overflowX: 'auto'
        }}
      >
       
        <Table>
          <TableHead>
            <TableRow >
              {Object.keys(newRemittance).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
             


              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {remittances.map((remittance) => (
              <TableRow key={remittance.id}>
                {editingRemittanceId === remittance.id ? (
                  <>
                    {Object.keys(newRemittance).map((key) => (
                      <TableCell key={key}>
                        <TextField
                          value={editRemittanceData[key] || ''}
                          onChange={(e) =>
                            setEditRemittanceData({ ...editRemittanceData, [key]: e.target.value })
                          }
                          style={{ width: '120px', }}
                         
                        />
                       
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        onClick={updateRemittance}
                        variant="contained"
                        style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px', width: '100px' }}
                        startIcon={<SaveIcon />}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => setEditingRemittanceId(null)}
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
                    {Object.keys(newRemittance).map((key) => (
                      <TableCell key={key}>{remittance[key]}</TableCell>
                    ))}
                    <TableCell>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          onClick={() => {
                            setEditRemittanceData(remittance);
                            setEditingRemittanceId(remittance.id);
                          }}
                          variant="contained"
                          style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100px' }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteRemittance(remittance.id)}
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


export default EmployeeRemittance;



