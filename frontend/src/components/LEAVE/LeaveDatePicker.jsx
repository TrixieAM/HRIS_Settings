// LeaveDatePickerModal.jsx
import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const LeaveDatePickerModal = ({ open, onClose, selectedDates, setSelectedDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toggleDate = (dateStr) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #6d2323",
          borderRadius: 2,
          width: "80%",
          maxWidth: "500px",
          p: 3,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Select Leave Dates
        </Typography>

        {/* Calendar navigation */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            ◀
          </Button>
          <Typography>
            {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
          </Typography>
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            ▶
          </Button>
        </Box>

        {/* Days grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {(() => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const blanks = Array.from({ length: firstDay }, (_, i) => <Box key={`b${i}`} />);
            const days = Array.from({ length: daysInMonth }, (_, i) => {
              const dateObj = new Date(year, month, i + 1);
              const dateStr = formatDate(dateObj);
              const isSelected = selectedDates.includes(dateStr);

              return (
                <Box
                  key={dateStr}
                  onClick={() => toggleDate(dateStr)}
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "1px solid #6d2323",
                    backgroundColor: isSelected ? "#6d2323" : "#fff",
                    color: isSelected ? "#fff" : "#000",
                    "&:hover": { backgroundColor: isSelected ? "#5a1d1d" : "#f5f5f5" },
                  }}
                >
                  {i + 1}
                </Box>
              );
            });

            return [...blanks, ...days];
          })()}
        </Box>

        <Button
          onClick={onClose}
          fullWidth
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#6d2323", color: "#fff" }}
        >
          Done
        </Button>
      </Box>
    </Modal>
  );
};

export default LeaveDatePickerModal;