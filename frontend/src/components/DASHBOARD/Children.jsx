import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, Box } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, Search as SearchIcon } from '@mui/icons-material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';




const Children = () => {
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState({
    childrenFirstName: '',
    childrenMiddleName: '',
    childrenLastName: '',
    childrenNameExtension: '',
    dateOfBirth: '',
    person_id: ''
  });
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildData, setEditChildData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');




  useEffect(() => {
    fetchChildren();
  }, []);




  const fetchChildren = async () => {
    try {
      const result = await axios.get('http://localhost:5000/childrenRoute/children-table');
      setChildren(result.data);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };




  const updateChild = async () => {
    try {
      await axios.put(`http://localhost:5000/childrenRoute/children-table/${editingChildId}`, editChildData);
      setEditingChildId(null);
      fetchChildren();
    } catch (error) {
      console.error('Failed to update child:', error);
    }
  };




  const deleteChild = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/childrenRoute/children-table/${id}`);
      fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
    }
  };




  return (
    <Container style={{ marginTop: '0px', backgroundColor: '#FEF9E1' }}>

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
  <ChildFriendlyIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />

  <div>
    <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
      Children Information
    </h4>
    <p style={{ margin: 0, fontSize: '85%' }}>
      Insert Your Children Information
    </p>
  </div>
</div>

  </div>
      {/* Red Header Section */}
      <div
  style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  }}
  
>
  
  {/* Header Section */}





  {/* Form Section */}
  <TextField
    label="First Name"
    value={newChild.childrenFirstName}
    onChange={(e) => setNewChild({ ...newChild, childrenFirstName: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '20px', width: '324.25px', marginLeft:'50px' }}
  />
  <TextField
    label="Middle Name"
    value={newChild.childrenMiddleName}
    onChange={(e) => setNewChild({ ...newChild, childrenMiddleName: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '10px', width: '324.25px' }}
  />
  <TextField
    label="Last Name"
    value={newChild.childrenLastName}
    onChange={(e) => setNewChild({ ...newChild, childrenLastName: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '10px', width: '324.25px' }}
  />
  <TextField
    label="Name Extension"
    value={newChild.childrenNameExtension}
    onChange={(e) => setNewChild({ ...newChild, childrenNameExtension: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '10px', width: '324.25px', marginLeft:'50px' }}
  />
  <TextField
    type="Date"
    label=""
    value={newChild.dateOfBirth}
    onChange={(e) => setNewChild({ ...newChild, dateOfBirth: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '10px', width: '324.25px' }}
  />
  <TextField
    label="Employee Number"
    value={newChild.person_id}
    onChange={(e) => setNewChild({ ...newChild, person_id: e.target.value })}
    style={{ marginRight: '10px', marginBottom: '10px', width: '324.25px' }}
  />




  <Button
    onClick={async () => {
      await axios.post('http://localhost:5000/childrenRoute/children-table', newChild);
      fetchChildren();
      setNewChild({
        childrenFirstName: '',
        childrenMiddleName: '',
        childrenLastName: '',
        childrenNameExtension: '',
        dateOfBirth: '',
        person_id: ''
      });
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








      {/* Children Table Styled Like Personal Info */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}
      >
<Box
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  padding={2}
  borderRadius={1}
  marginBottom={2}
>
  <Box display="flex" alignItems="center">
  <ChildCareIcon sx={{ color: '#6D2323', marginRight: 2, fontSize:'3rem', }} />

    <Typography variant="h5" sx={{ margin: 0, color: '#000000', fontWeight: 'bold' }}  >
      Children Records
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
              <TableCell>First Name</TableCell>
              <TableCell>Middle Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Name Extension</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Employee Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {children.filter((child) => {
    const fullName = `${child.childrenFirstName} ${child.childrenMiddleName} ${child.childrenLastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      child.person_id?.toString().includes(search) ||
      fullName.includes(search)
    );
  }).length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} style={{ textAlign: 'center', color: '#8B0000', padding: '20px' }}>
        <Typography variant="h6">
          No matching records found.
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    children
      .filter((child) => {
        const fullName = `${child.childrenFirstName} ${child.childrenMiddleName} ${child.childrenLastName}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
          child.person_id?.toString().includes(search) ||
          fullName.includes(search)
        );
      })
      .map((child) => (
        <TableRow key={child.id}>
          {editingChildId === child.id ? (
            <>
              <TableCell>{child.id}</TableCell>
              <TableCell>
                <TextField
                  value={editChildData.childrenFirstName}
                  onChange={(e) => setEditChildData({ ...editChildData, childrenFirstName: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={editChildData.childrenMiddleName}
                  onChange={(e) => setEditChildData({ ...editChildData, childrenMiddleName: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={editChildData.childrenLastName}
                  onChange={(e) => setEditChildData({ ...editChildData, childrenLastName: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={editChildData.childrenNameExtension}
                  onChange={(e) => setEditChildData({ ...editChildData, childrenNameExtension: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  value={editChildData.dateOfBirth}
                  onChange={(e) => setEditChildData({ ...editChildData, dateOfBirth: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={editChildData.person_id}
                  onChange={(e) => setEditChildData({ ...editChildData, person_id: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={updateChild}
                  variant="contained"
                  style={{
                    backgroundColor: '#6D2323',
                    color: '#FEF9E1',
                    width: '100px',
                    height: '40px',
                    marginBottom: '5px'
                  }}
                  startIcon={<SaveIcon />}
                >
                  Update
                </Button>
                <Button
                  onClick={() => setEditingChildId(null)}
                  variant="contained"
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    width: '100px',
                    height: '40px',
                    marginBottom: '5px',
                    marginLeft: '10px'
                  }}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </TableCell>
            </>
          ) : (
            <>
              <TableCell>{child.id}</TableCell>
              <TableCell>{child.childrenFirstName}</TableCell>
              <TableCell>{child.childrenMiddleName}</TableCell>
              <TableCell>{child.childrenLastName}</TableCell>
              <TableCell>{child.childrenNameExtension}</TableCell>
              <TableCell>{child.dateOfBirth?.split('T')[0]}</TableCell>
              <TableCell>{child.person_id}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={() => {
                      setEditChildData(child);
                      setEditingChildId(child.id);
                    }}
                    variant="contained"
                    style={{
                      backgroundColor: '#6D2323',
                      color: '#FEF9E1',
                      width: '100px',
                      height: '40px',
                      marginBottom: '5px'
                    }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteChild(child.id)}
                    variant="contained"
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      width: '100px',
                      height: '40px',
                      marginBottom: '5px'
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </>
          )}
        </TableRow>
      ))
  )}
</TableBody>

        </Table>
      </div>
    </Container>
  );
};




export default Children;








