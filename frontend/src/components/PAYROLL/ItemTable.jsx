import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Add, Edit, Save, Cancel, Delete, Label } from "@mui/icons-material";


const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item_description: "",
    employeeID: "",
    item_code: "",
    salary_grade: "",
    step: "",
    effectivityDate: "",
  });
  const [editItemId, setEditItemId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});


  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    const response = await axios.get("http://localhost:5000/api/item-table");
    setItems(response.data);
  };


  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };


  const handleRowChange = (e) => {
    setEditedRowData({
      ...editedRowData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await axios.put(
          `http://localhost:5000/api/item-table/${editItemId}`,
          editedRowData
        );
        setEditItemId(null);
        setEditedRowData({});
      } else {
        await axios.post("http://localhost:5000/api/item-table", newItem);
        resetForm();
      }
      fetchItems();
    } catch (error) {
      console.error("Error submitting item data", error);
    }
  };


  const handleEdit = (item) => {
    setEditItemId(item.id);
    setEditedRowData(item);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/item-table/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };


  const handleCancel = () => {
    setEditItemId(null);
    setEditedRowData({});
  };


  const resetForm = () => {
    setNewItem({
      item_description: "",
      employeeID: "",
      item_code: "",
      salary_grade: "",
      step: "",
      effectivityDate: "",
    });
  };


  return (
    <Container>
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
  <Label sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />


  <div>
    <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
      Item Table
    </h4>
    <p style={{ margin: 0, fontSize: '85%' }}>
      Insert Your Item Table
    </p>
  </div>
</div>


  </div>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: "8px", marginBottom: "24px" }}>
        <Box display="flex" flexWrap="wrap" sx={{ marginBottom: 3, gap: 2 }}>
          <TextField
            label="Item Description"
            name="item_description"
            value={newItem.item_description}
            onChange={handleChange}
            sx={{ width: "23%" }}
          />
          <TextField
            label="Employee ID"
            name="employeeID"
            value={newItem.employeeID}
            onChange={handleChange}
            sx={{ width: "23%" }}
          />
          <TextField
            label="Item Code"
            name="item_code"
            value={newItem.item_code}
            onChange={handleChange}
            sx={{ width: "23%" }}
          />
          <Autocomplete
            freeSolo
            options={[...Array(33)].map((_, index) => `${index + 1}`)}
            value={newItem.salary_grade}
            onChange={(event, newValue) =>
              setNewItem({ ...newItem, salary_grade: newValue || "" })
            }
            onInputChange={(event, newInputValue) =>
              setNewItem({ ...newItem, salary_grade: newInputValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Salary Grade" sx={{ width: "250%" }} />
            )}
          />
          <FormControl sx={{ width: "23%" }}>
            <InputLabel>Step</InputLabel>
            <Select
              name="step"
              value={newItem.step}
              onChange={handleChange}
              label="Step"
            >
              {[...Array(8)].map((_, index) => (
                <MenuItem key={index + 1} value={`Step${index + 1}`}>
                  Step{index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="effectivityDate"
            name="effectivityDate"
            value={newItem.effectivityDate}
            onChange={handleChange}
            sx={{ width: "23%" }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#6D2323",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#9C2A2A",
              },
              width: "250px",
              height: "55px",
            }}
          >
            <Add sx={{ marginRight: "5px" }} />
            Add New Item
          </Button>
        </Box>
      </Paper>


      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: "#6D2323" }}>
              <TableCell>ID</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Salary Grade</TableCell>
              <TableCell>Step</TableCell>
              <TableCell>Effectivity Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <TextField
                      name="item_description"
                      value={editedRowData.item_description || ""}
                      onChange={handleRowChange}
                      size="small"
                    />
                  ) : (
                    item.item_description
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <TextField
                      name="employeeID"
                      value={editedRowData.employeeID || ""}
                      onChange={handleRowChange}
                      size="small"
                    />
                  ) : (
                    item.employeeID
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <TextField
                      name="item_code"
                      value={editedRowData.item_code || ""}
                      onChange={handleRowChange}
                      size="small"
                    />
                  ) : (
                    item.item_code
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <Autocomplete
                      freeSolo
                      options={[...Array(33)].map((_, index) => `${index + 1}`)}
                      value={editedRowData.salary_grade || ""}
                      onChange={(event, newValue) =>
                        setEditedRowData({ ...editedRowData, salary_grade: newValue || "" })
                      }
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  ) : (
                    item.salary_grade
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <FormControl size="small">
                      <Select
                        name="step"
                        value={editedRowData.step ||""}
                        onChange={handleRowChange}
                      >
                        {[...Array(8)].map((_, index) => (
                          <MenuItem key={index + 1} value={`Step${index + 1}`}>
                            Step{index + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    item.step
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <TextField
                      name="effectivityDate"
                      value={editedRowData.effectivityDate || ""}
                      onChange={handleRowChange}
                      size="small"
                    />
                  ) : (
                    item.effectivityDate
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item.id ? (
                    <>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: "#6D2323", color: "#fff", marginRight: 1, width: "100px", marginBottom: 1 }}
                      >
                        <Save sx={{ marginRight: 1 }} />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="contained"
                        sx={{ backgroundColor: "#000", color: "#fff", width: "100px" }}
                      >
                        <Cancel sx={{ marginRight: 1 }} />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(item)}
                        variant="contained"
                        sx={{ backgroundColor: "#6D2323", color: "#fff", marginRight: 1, width: "100px" }}
                      >
                        <Edit sx={{ marginRight: 1 }} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="contained"
                        sx={{ backgroundColor: "#000", color: "#fff", width: "100px" }}
                      >
                        <Delete sx={{ marginRight: 1 }} />
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};


export default ItemTable;



