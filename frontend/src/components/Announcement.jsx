import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Announcement as AnnouncementIcon, Reorder as ReorderIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { Image as ImageIcon } from "@mui/icons-material";

const AnnouncementForm = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    about: "",
    date: "",
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/announcements`);
      setAnnouncements(response.data);
    } catch (err) {
      console.error("Error fetching announcements", err.message);
    }
  };

  const handleNewChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewAnnouncement({ ...newAnnouncement, image: files[0] });
    } else {
      setNewAnnouncement({ ...newAnnouncement, [name]: value });
    }
  };

  const handleAdd = async () => {
    try {
      setError("");
      if (!newAnnouncement.title || !newAnnouncement.about || !newAnnouncement.date) {
        setError("Please fill in all required fields");
        return;
      }

      const formData = new FormData();
      formData.append("title", newAnnouncement.title);
      formData.append("about", newAnnouncement.about);
      formData.append("date", newAnnouncement.date);
      if (newAnnouncement.image) formData.append("image", newAnnouncement.image);

      await axios.post(`${API_BASE_URL}/api/announcements`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchAnnouncements();
      setNewAnnouncement({ title: "", about: "", date: "", image: null });
    } catch (error) {
      console.error("Error adding announcement", error);
      setError("Failed to add announcement");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      about: item.about,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
    });
    setOpenEditModal(true);
  };

const handleSaveEdit = async () => {
  try {
    setError("");

    if (!editingId) {
      setError("No announcement selected for editing.");
      return;
    }

    // Prepare FormData so we can send a new image if the user selected one
    const payload = new FormData();
    payload.append("title", editForm.title || "");
    payload.append("about", editForm.about || "");
    payload.append("date", editForm.date || "");

    // If editForm.image is a File (user selected a new file), append it.
    // If it's a string (existing image path from DB), don't append — backend will keep it.
    if (editForm.image && editForm.image instanceof File) {
      payload.append("image", editForm.image);
    }

    await axios.put(
      `${API_BASE_URL}/api/announcements/${editingId}`,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // close modal / reset edit state / refresh
    setOpenEditModal(false);
    setEditingId(null);
    setEditForm({});
    fetchAnnouncements();
  } catch (err) {
    console.error("Error updating announcement:", err);
    setError("Failed to update announcement");
  }
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement", error);
        setError("Failed to delete announcement");
      }
    }
  };

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.about.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#6D2323",
          color: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <AnnouncementIcon sx={{ fontSize: "3rem", marginRight: "16px" }} />
          <div>
            <h4 style={{ margin: 0, fontSize: "150%", marginBottom: "1px" }}>
              Announcement Management
            </h4>
            <p style={{ margin: 0, fontSize: "85%" }}>
              Post and manage employee announcements
            </p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <Container
        sx={{
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          mb: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Title"
            name="title"
            value={newAnnouncement.title}
            onChange={handleNewChange}
            InputLabelProps={{ required: false }}
            sx={{ minWidth: 250 }}
          />
          <TextField
            label="About"
            name="about"
            value={newAnnouncement.about}
            onChange={handleNewChange}
            multiline
            InputLabelProps={{ required: false }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newAnnouncement.date}
            onChange={handleNewChange}
            InputLabelProps={{ required: false, shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: "#6D2323",
              color: "#6D2323",
              "&:hover": { backgroundColor: "#6D2323", color: "#fff" },
            }}
          >
            Upload Image
            <input
              type="file"
              hidden
              name="image"
              onChange={handleNewChange}
            />
          </Button>
          {newAnnouncement.image && (
            <Typography variant="body2">{newAnnouncement.image.name}</Typography>
          )}
        </Box>

        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            mt: 3,
            width: "100%",
            backgroundColor: "#6D2323",
            color: "#FEF9E1",
            "&:hover": { backgroundColor: "#5a1d1d" },
          }}
        >
          Add Announcement
        </Button>
      </Container>

      {/* Table */}
      <div
        style={{
          marginTop: "5px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <ReorderIcon sx={{ color: "#6D2323", fontSize: "2rem", marginRight: 1 }} />
            <Typography variant="h5" sx={{ color: "#000", fontWeight: "bold" }}>
              Announcement Records
            </Typography>
          </Box>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Title or About"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1, width: "300px" }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#6D2323", marginRight: 1 }} />,
            }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>About</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnnouncements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6">No announcements found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAnnouncements.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.about}</TableCell>
                  <TableCell>{formatDateForDisplay(item.date)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        backgroundColor: "#6D2323",
                        color: "#FEF9E1",
                        width: 100,
                        mr: 1,
                        mb: 1,
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      sx={{ backgroundColor: "black", color: "white", width: 100, mb: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Announcement</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={editForm.title || ""}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="About"
              name="about"
              value={editForm.about || ""}
              onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={editForm.date || ""}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          {editForm.image && typeof editForm.image === "string" && (
            <Box sx={{ mt: 1 }}>
              <img
                src={editForm.image}
                alt="current"
                style={{ maxWidth: 160, maxHeight: 90, borderRadius: 4 }}
              />
            </Box>
          )}

          {/* file chooser to replace image */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{
                borderColor: "#6D2323",
                color: "#6D2323",
                "&:hover": { backgroundColor: "#6D2323", color: "#fff" },
              }}
            >
              Replace Image
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.files ? e.target.files[0] : null })
                }
              />
            </Button>

            {/* show filename if user selected a new file */}
            {editForm.image && editForm.image instanceof File && (
              <Typography variant="body2" sx={{ display: "inline-block", ml: 2 }}>
                {editForm.image.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: "#6D2323", color: "#FEF9E1", width: 100, mr: 1 }}
          >
            Save
          </Button>
          <Button
            onClick={() => setOpenEditModal(false)}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ backgroundColor: "black", color: "white", width: 100 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnnouncementForm;
