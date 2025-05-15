import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Paid,
  Payment,
  Search,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { InputAdornment } from '@mui/material';








const EmployeeRemittance = () => {
  const [remittances, setRemittances] = useState([]);
  const [newRemittance, setNewRemittance] = useState({
    employeeNumber: '', name: '',  liquidatingCash: '', gsisSalaryLoan: '', gsisPolicyLoan: '', gsisArrears: '',
    cpl: '', mpl: '', mplLite: '', emergencyLoan: '', nbc594: '',
    increment: '',  pagibigFundCont: '', pagibig2: '', multiPurpLoan: '',
    landbankSalaryLoan: '', earistCreditCoop: '', feu: ''
  });
  const [editingRemittanceId, setEditingRemittanceId] = useState(null);
  const [editRemittanceData, setEditRemittanceData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');




  const filteredRemittances = remittances.filter(remittance =>
  remittance.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  remittance.name?.toLowerCase().includes(searchQuery.toLowerCase())
);














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
    <Container>
<div




  style={{
    backgroundColor: '#6D2323',
    color: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    borderEndEndRadius: '0px',
    borderEndStartRadius: '0px',
    width: '92.5%',
    marginLeft: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  }}
>
  <Paid fontSize="large" />


  <div>
    <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>Employee Remittance</h4>
    <p style={{ margin: 0, fontSize: '85%' }}>Insert Employee Other Deductions</p>
  </div>


 


</div>


    <Container style={{ backgroundColor: '#FEF9E1' }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}
      >










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


      <br />
      <br />


      <TextField
        size="small"
        variant="outlined"
        placeholder="Search by Employee Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ backgroundColor: 'white', borderRadius: 1, marginLeft: '870px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#6D2323', marginRight: 1 }} />
            </InputAdornment>
          ),
        }}
      />






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
       
      <Box display="flex" alignItems="center">
        <Payment sx={{ color: '#6D2323', fontSize: '3rem', marginRight: 2, marginLeft: 2, }} />
        <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold' }}>
          Remittance Records
        </Typography>




      </Box>
      <br />
       
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
  {filteredRemittances.length === 0 ? (
    <TableRow>
      <TableCell colSpan={Object.keys(newRemittance).length + 1} style={{ textAlign: 'left', color: '#8B0000', padding: '20px' }}>
        <Typography variant="h6">
          No matching records found.
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    filteredRemittances.map((remittance) => (
      <TableRow key={remittance.id}>
        {Object.keys(newRemittance).map((key) => (
          <TableCell key={key}>{remittance[key]}</TableCell>
        ))}
        <TableCell>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => {
                setEditRemittanceData(remittance);
                setEditingRemittanceId(remittance.id);
                setOpenEditModal(true);
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
      </TableRow>
    ))
  )}
          </TableBody>


        </Table>
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
  <DialogTitle>Edit Remittance</DialogTitle>
  <DialogContent>
    <Box display="flex" flexWrap="wrap" gap={2}>
      {Object.keys(newRemittance).map((key) => (
        <TextField
          key={key}
          label={key}
          value={editRemittanceData[key] || ''}
          onChange={(e) =>
            setEditRemittanceData({ ...editRemittanceData, [key]: e.target.value })
          }
          style={{ width: '200px' }}
        />
      ))}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        updateRemittance();
        setOpenEditModal(false);
      }}
      variant="contained"
      style={{ backgroundColor: '#6D2323', color: '#FEF9E1' }}
      startIcon={<SaveIcon />}
    >
      Update
    </Button>
    <Button
      onClick={() => setOpenEditModal(false)}
      variant="contained"
      style={{ backgroundColor: 'black', color: 'white' }}
      startIcon={<CancelIcon />}
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>


      </div>
    </Container>
    </Container>
  );
};



export default EmployeeRemittance;
