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
} from "@mui/material";

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item_description: "",
    employeeID: "",
    item_code: "",
    salary_grade: "",
  });
  const [editItemId, setEditItemId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await axios.put(
          `http://localhost:5000/api/item-table/${editItemId}`,
          newItem
        );
      } else {
        await axios.post("http://localhost:5000/api/item-table", newItem);
      }
      setEditItemId(null);
      fetchItems();
      resetForm();
    } catch (error) {
      console.error("Error submitting item data", error);
    }
  };

  const handleEdit = (item) => {
    setNewItem(item);
    setEditItemId(item.id);
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
    resetForm();
    setEditItemId(null);
  };

  const resetForm = () => {
    setNewItem({
      item_description: "",
      employeeID: "",
      item_code: "",
      salary_grade: "",
    });
  };

  return (
    <Container>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          backgroundColor: "#6D2323", // Maroon color
          color: "#FEF9E1", // Cream color
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        Item Table Management
      </Typography>

      {/* Form Box for Item (white background) */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: "#ffffff", // White background
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Box display="flex" flexWrap="wrap" sx={{ marginBottom: 3, gap: 2 }}>
          {Object.keys(newItem).map((key) => (
            <TextField
              key={key}
              label={key.replace(/([A-Z])/g, " $1").trim()}
              name={key}
              value={newItem[key]}
              onChange={handleChange}
              sx={{
                width: "23%",
                color: "#000000", // Black text for the input
              }}
            />
          ))}
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#6D2323", // Maroon for Add/Update
              "&:hover": {
                backgroundColor: "#9C2A2A", // Darker maroon for hover
              },
              height: "55px",
            }}
          >
            {editItemId ? "Update" : "Add"}
          </Button>
          {editItemId && (
            <Button
              onClick={handleCancel}
              variant="contained"
              color="error"
              sx={{
                height: "55px",
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: "#6D2323" }}>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>Item Description</TableCell>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>Employee ID</TableCell>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>Item Code</TableCell>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>Salary Grade</TableCell>
              <TableCell style={{ color: "#000000", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.item_description}</TableCell>
                <TableCell>{item.employeeID}</TableCell>
                <TableCell>{item.item_code}</TableCell>
                <TableCell>{item.salary_grade}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="contained"
                    sx={{
                      backgroundColor: "#6D2323", // Maroon for Edit
                      color: "#FEF9E1", // Cream color text
                      "&:hover": {
                        backgroundColor: "#9C2A2A", // Darker maroon hover
                      },
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="contained"
                    color="error"
                    sx={{
                      backgroundColor: "#000000", // Black for Delete
                      color: "#ffffff", // White text
                      "&:hover": {
                        backgroundColor: "#333333", // Darker black hover
                      },
                    }}
                  >
                    Delete
                  </Button>
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
