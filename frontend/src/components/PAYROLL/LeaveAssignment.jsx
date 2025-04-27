import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const LeaveAssignment = () => {
  const [leaveAssignments, setLeaveAssignments] = useState([]);
  const [form, setForm] = useState({
    employeeID: "",
    leaveID: "",
    noOfLeaves: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLeaveAssignments();
  }, []);

  const fetchLeaveAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leave_assignment");
      setLeaveAssignments(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/leave_assignment/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/leave_assignment", form);
      }
      setForm({ employeeID: "", leaveID: "", noOfLeaves: "" });
      fetchLeaveAssignments();
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const handleEdit = (assignment) => {
    setForm({
      employeeID: assignment.employeeID,
      leaveID: assignment.leaveID,
      noOfLeaves: assignment.noOfLeaves,
    });
    setEditingId(assignment.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/leave_assignment/${id}`);
      fetchLeaveAssignments();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  return (
    <Container>
      {/* Section Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        Leave Assignment Management
      </Typography>

      {/* Form Section */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Employee ID"
              type="number"
              name="employeeID"
              value={form.employeeID}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Leave ID"
              type="number"
              name="leaveID"
              value={form.leaveID}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="No. of Leaves"
              type="number"
              name="noOfLeaves"
              value={form.noOfLeaves}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: '#6D2323',
                color: '#FEF9E1',
                '&:hover': {
                  backgroundColor: '#9C2A2A',
                },
              }}
            >
              {editingId ? "Update" : "Add"} Leave Assignment
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#6D2323' }}>
              <TableCell sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>Employee ID</TableCell>
              <TableCell sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>Leave ID</TableCell>
              <TableCell sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>No. of Leaves</TableCell>
              <TableCell sx={{ color: '#FEF9E1', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.id}</TableCell>
                <TableCell>
                  {editingId === assignment.id ? (
                    <TextField
                      value={form.employeeID}
                      name="employeeID"
                      onChange={handleChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    assignment.employeeID
                  )}
                </TableCell>
                <TableCell>
                  {editingId === assignment.id ? (
                    <TextField
                      value={form.leaveID}
                      name="leaveID"
                      onChange={handleChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    assignment.leaveID
                  )}
                </TableCell>
                <TableCell>
                  {editingId === assignment.id ? (
                    <TextField
                      value={form.noOfLeaves}
                      name="noOfLeaves"
                      onChange={handleChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    assignment.noOfLeaves
                  )}
                </TableCell>
                <TableCell>
                  {editingId === assignment.id ? (
                    <>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                          backgroundColor: '#6D2323',
                          color: '#FEF9E1',
                          '&:hover': {
                            backgroundColor: '#9C2A2A',
                          },
                          marginRight: 1,
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setForm({ employeeID: "", leaveID: "", noOfLeaves: "" });
                        }}
                        variant="contained"
                        color="error"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(assignment)}
                        variant="contained"
                        sx={{
                          backgroundColor: '#6D2323',
                          color: '#FEF9E1',
                          '&:hover': {
                            backgroundColor: '#9C2A2A',
                          },
                          marginRight: 1,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(assignment.id)}
                        variant="contained"
                        sx={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: '#333333',
                          },
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
      </Paper>
    </Container>
  );
};

export default LeaveAssignment;
