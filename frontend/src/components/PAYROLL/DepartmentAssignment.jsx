import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';

const DepartmentAssignment = () => {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    code: "",
    name: "",
    employeeNumber: "",  // updated field name
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [departmentCodes, setDepartmentCodes] = useState([]); // to hold department codes

  useEffect(() => {
    fetchData();
    fetchDepartmentCodes(); // fetch department codes
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
      setDepartmentCodes(response.data.map(item => item.code)); // store department codes
    } catch (error) {
      console.error("Error fetching department codes", error);
    }
  };

  const addEntry = async () => {
    try {
      await axios.post("http://localhost:5000/api/department-assignment", newEntry);
      setNewEntry({ code: "", name: "", employeeNumber: "" });  // updated field name
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
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1' }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#6D2323', color: '#ffffff', padding: '10px',
          borderRadius: '8px', marginBottom: '25px'
        }}>
          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>Department Assignment</h4>
          <p style={{ margin: 0, fontSize: '85%', marginLeft: '.25%' }}>Manage Department Assignment</p>
        </div>

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
            label="Employee Number"  // updated field name
            value={newEntry.employeeNumber}  // updated field name
            onChange={(e) => setNewEntry({ ...newEntry, employeeNumber: e.target.value })}  // updated field name
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

        {/* Table */}
        <Table style={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#6D2323' }}>
              <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>No.</TableCell>
              <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>Department Code</TableCell>
              <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>Employee Number</TableCell> {/* updated field name */}
              <TableCell style={{ color: "#ffffff", fontWeight: "bold", paddingLeft:'75px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
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
                        value={editData.employeeNumber}  // updated field name
                        onChange={(e) => setEditData({ ...editData, employeeNumber: e.target.value })}  // updated field name
                        style={{ width: '150px' }}
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.employeeNumber}</TableCell> {/* updated field name */}
                  </>
                )}
                <TableCell>
                  {editingId === item.id ? (
                    <>
                      <Button
                        onClick={updateEntry}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        style={{
                          backgroundColor: '#6D2323',
                          color: '#FEF9E1',
                          marginRight: '5px',
                          textTransform: 'none',
                          width: '100px',
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="contained"
                        style={{ 
                          backgroundColor: 'black', 
                          color: 'white',
                          marginLeft: '10px', 
                          width: '100px',

                        }}
                                    startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditData({
                            code: item.code,
                            name: item.name,
                            employeeNumber: item.employeeNumber,  // updated field name
                          });
                        }}
                        variant="contained"
                        startIcon={<EditIcon />}
                        style={{
                          backgroundColor: '#6D2323',
                          color: '#FEF9E1',
                          marginRight: '5px',
                          textTransform: 'none',
                          width: '100px',
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
                          color: '#FEF9E1',
                          textTransform: 'none'
                        }}
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
      </div>
    </Container>
  );
};

export default DepartmentAssignment;
