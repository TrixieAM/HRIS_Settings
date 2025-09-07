import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessfullOverlay = ({ open, action }) => {
  if (!open) return null;

  // Decide message based on action
  const getMessage = () => {
    switch (action) {
      case "create":
        return "Successfully Created!";
      case "edit":
        return "Successfully Edited!";
      case "delete":
        return "Successfully Deleted!";
      default:
        return "Action Successful!";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(240, 255, 240, 0.95)", // light greenish overlay
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        flexDirection: "column",
      }}
    >
      {/* Success Check Icon */}
      <CheckCircleIcon
        sx={{
          fontSize: 100,
          color: "#2e7d32", // green
          animation: "popIn 0.6s ease-out",
        }}
      />

      {/* Success Message */}
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: "#2e7d32",
          fontWeight: "bold",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        {getMessage()}
      </Typography>

      {/* Animations */}
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default SuccessfullOverlay;
