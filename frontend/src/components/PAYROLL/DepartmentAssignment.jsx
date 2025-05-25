import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, InputAdornment
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon, Search as SearchIcon,
  Domain
} from '@mui/icons-material';


const DepartmentAssignment = () => {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    code: "",
    name: "",
    employeeNumber: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [departmentCodes, setDepartmentCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredData = data.filter((item) =>
    (item?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item?.employeeNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchData();
    fetchDepartmentCodes();
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department-assignment");
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


  const fetchDepartmentCodes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department-table");
      setDepartmentCodes(response.data.map(item => item.code));
    } catch (error) {
      console.error("Error fetching department codes", error);
    }
  };


  const addEntry = async () => {
    try {
      await axios.post("http://localhost:5000/api/department-assignment", newEntry);
      setNewEntry({ code: "", name: "", employeeNumber: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding entry", error);
    }
  };


  const updateEntry = async () => {
    try {
      await axios.put(`http://localhost:5000/api/department-assignment/${editingId}`, editData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating entry", error);
    }
  };


  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/department-assignment/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting entry", error);
    }
  };


  return (
    <Box>
          <div style={{
        backgroundColor: '#6D2323',
        color: '#ffffff',
        padding: '25px',
        width: '89.5%',
        marginLeft: '24px',
        borderRadius: '8px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        display: 'flex',
      }}>
        <Domain sx={{ fontSize: '3rem', marginRight: '15px', marginTop: '5px', marginLeft: '5px' }} />
     
        <div>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
            Department Assignment
          </h4>
          <p style={{ margin: 0, fontSize: '85%' }}>
            Manage Department Assignment
          </p>
        </div>
      </div>
    <Container style={{  backgroundColor: '#FEF9E1', marginRight: '50px' }}>




      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px'
      }}>
        {/* Add New Entry Section */}
        <Box display="flex" gap={2} marginLeft="0px" marginBottom="20px">
          <TextField
            label=" "
            select
            value={newEntry.code}
            onChange={(e) => setNewEntry({ ...newEntry, code: e.target.value })}
            style={{ width: '220px' }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Department</option>
            {departmentCodes.map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </TextField>
          <TextField
            label="Name"
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
            style={{ width: '220px' }}
          />
          <TextField
            label="Employee Number"
            value={newEntry.employeeNumber}
            onChange={(e) => setNewEntry({ ...newEntry, employeeNumber: e.target.value })}
            style={{ width: '220px' }}
          />
          <Button
            onClick={addEntry}
            variant="contained"
            startIcon={<AddIcon />}
            style={{
              backgroundColor: '#6D2323', color: '#FEF9E1',
              textTransform: 'none'
            }}
          >
            Add
          </Button>
        </Box>
      </div>


      </Container>
     
        <Box mb={2} position={"relative"} display="flex" justifyContent="flex-end" marginRight="25px" height="45px">
          <TextField
            label="Search Name "
            variant="outlined"
            size="medium"
            sx={{ backgroundColor: "white", borderRadius: 1, maxWidth: "250px" , }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ color: "#6D2323" }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>


      <Container style={{ backgroundColor: '#FFFFFF', padding: '0px', borderRadius: '8px', marginBottom: '50px', width: '95%', marginLeft: '24px' }}>


        {/* Search Bar */}


        {/* Table */}
        <Table style={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#6D2323' }}>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>NO.</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>DEPARTMENT CODE</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>NAME</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>EMPLOYEE NUMBER</TableCell>
              <TableCell style={{ color: '#FEF9E1', fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <TextField
                          select
                          value={editData.code}
                          onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                          style={{ width: '150px' }}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {departmentCodes.map((code, index) => (
                            <option key={index} value={code}>
                              {code}
                            </option>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          style={{ width: '150px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editData.employeeNumber}
                          onChange={(e) => setEditData({ ...editData, employeeNumber: e.target.value })}
                          style={{ width: '150px' }}
                        />
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.employeeNumber}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {editingId === item.id ? (
                      <Box display="flex" gap={1}>
                        <Button
                          onClick={updateEntry}
                          variant="contained"
                          startIcon={<SaveIcon />}
                          style={{
                            backgroundColor: '#6D2323',
                            color: '#FEF9E1',
                            textTransform: 'none',
                            width: '100px'
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="contained"
                          startIcon={<CancelIcon />}
                          style={{
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            textTransform: 'none',
                            width: '100px'
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Box display="flex" gap={1}>
                        <Button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditData({
                              code: item.code,
                              name: item.name,
                              employeeNumber: item.employeeNumber,
                            });
                          }}
                          variant="contained"
                          startIcon={<EditIcon />}
                          style={{
                            backgroundColor: '#6D2323',
                            color: '#FEF9E1',
                            textTransform: 'none',
                            width: '100px'
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteEntry(item.id)}
                          variant="contained"
                          startIcon={<DeleteIcon />}
                          style={{
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            textTransform: 'none',
                            width: '100px'
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "red" }}>
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </Container>
    </Box>
  );
};


export default DepartmentAssignment;



