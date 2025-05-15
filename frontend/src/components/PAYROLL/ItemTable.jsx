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
  FormControl,
  InputAdornment  
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Add, Edit, Save, Cancel, Delete, Label, Search } from "@mui/icons-material";




const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item_description: "",
    employeeID: "",
    name: "",
    item_code: "",
    salary_grade: "",
    step: "",
    effectivityDate: "",
  });
  const [editItemId, setEditItemId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");


  const filteredItems = items.filter((item) =>
    (item?.employeeID?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/item-table");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
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
        await axios.put(`http://localhost:5000/api/item-table/${editItemId}`, editedRowData);
        setEditItemId(null);
        setEditedRowData({});
      } else {
        await axios.post("http://localhost:5000/api/item-table", newItem);
        resetForm();
      }
      fetchItems();
    } catch (error) {
      console.error("Error submitting data", error);
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
      name: "",
      item_code: "",
      salary_grade: "",
      step: "",
      effectivityDate: "",
    });
  };


  return (
    <Container>
      {/* Header */}
      <Box sx={{ backgroundColor: "#6D2323", color: "#fff", padding: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <Box display="flex" alignItems="center">
          <Label sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Item Table</Typography>
            <Typography variant="body2">Insert Your Item Table</Typography>
          </Box>
        </Box>
      </Box>


      {/* Form */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "0 0 8px 8px", mb: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <TextField label="Position" name="item_description" value={newItem.item_description} onChange={handleChange} sx={{ width: "23%" }} />
          <TextField label="Employee Number" name="employeeID" value={newItem.employeeID} onChange={handleChange} sx={{ width: "23%" }} />
          <TextField label="Name" name="name" value={newItem.name} onChange={handleChange} sx={{ width: "23%" }} />
          <TextField label="Item Code" name="item_code" value={newItem.item_code} onChange={handleChange} sx={{ width: "23%" }} />


          <FormControl sx={{ width: "23%" }}>
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
                  <TextField {...params} label="Salary Grade" />
                )}
              />
            </FormControl>




          <FormControl sx={{ width: "23%" }}>
              <Autocomplete
                freeSolo
                options={[...Array(8)].map((_, index) => `step${index + 1}`)}
                value={newItem.step}
                onChange={(event, newValue) =>
                  setNewItem({ ...newItem, step: newValue || "" })
                }
                onInputChange={(event, newInputValue) =>
                  setNewItem({ ...newItem, step: newInputValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Step" />
                )}
              />
            </FormControl>






          <TextField
            label="Effectivity Date"
            name="effectivityDate"
            value={newItem.effectivityDate}
            onChange={handleChange}
            sx={{ width: "23%" }}
          />


          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#6D2323", color: "#fff", width: "250px", height: "55px" }}
          >
            <Add sx={{ mr: 1 }} />
            Add New Item
          </Button>
        </Box>
      </Paper>


      {/* Search Bar */}


<Box mb={2} position={"relative"} display="flex" justifyContent="flex-end">
  <TextField
    label="Search by ID or Name"
    variant="outlined"
    size="medium"
    sx={{ backgroundColor: "white", borderRadius: 1, width: "250px" }}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end" style={{ color: "#6D2323" }}>
          <Search />
        </InputAdornment>
      ),
    }}
  />
</Box>




      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["ID", "Position", "Employee Number", "Name", "Item Code", "Salary Grade", "Step", "Effectivity Date", "Actions"].map((head) => (
                <TableCell key={head}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  {["item_description", "employeeID", "name", "item_code", ].map((field) => (
                    <TableCell key={field}>
                      {editItemId === item.id ? (
                        <TextField name={field} value={editedRowData[field] || ""} onChange={handleRowChange} size="small" />
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editItemId === item.id ? (
                      <Autocomplete
                        freeSolo
                        options={[...Array(33)].map((_, index) => `${index + 1}`)}
                        value={editedRowData.salary_grade || ""}
                        onChange={(e, val) => setEditedRowData({ ...editedRowData, salary_grade: val || "" })}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    ) : (
                      item.salary_grade
                    )}
                  </TableCell>
                  <TableCell>
                    {editItemId === item.id ? (
                      <Autocomplete
                        freeSolo
                        options={[...Array(8)].map((_, index) => `step${index + 1}`)}
                        value={editedRowData.step || ""}
                        onChange={(e, val) => setEditedRowData({ ...editedRowData, step: val || "" })}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
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
                        <Button onClick={handleSubmit} variant="contained" sx={{ mr: 1, mb: 1, width: 100, backgroundColor: "#6D2323", color: "#fff" }}>
                          <Save sx={{ mr: 1 }} />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="contained" sx={{ width: 100, backgroundColor: "#000", color: "#fff" }}>
                          <Cancel sx={{ mr: 1 }} />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEdit(item)} variant="contained" sx={{ mr: 1, width: 100, backgroundColor: "#6D2323", color: "#fff" }}>
                          <Edit sx={{ mr: 1 }} />
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(item.id)} variant="contained" sx={{ width: 100, backgroundColor: "#000", color: "#fff" }}>
                          <Delete sx={{ mr: 1 }} />
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ color: "red" }}>
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};


export default ItemTable;



