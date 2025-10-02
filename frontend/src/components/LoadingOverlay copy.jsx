  import React from "react";
  import { Box, Typography } from "@mui/material";
  import logo from "../assets/logo.PNG";

  const LoadingOverlay = ({ open, message }) => {
    if (!open) return null;

    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(113, 106, 81, 0.67)", // cream overlay
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          flexDirection: "column",
          perspective: "800px", // enable 3D effect
        }}
      >
        {/* 3D rotating cube loader */}
        <Box
          sx={{
            width: 150,
            height: 150,
            position: "relative",
            transformStyle: "preserve-3d",
            animation: "spinCube 3s linear infinite",
          }}
        >
          {/* Each face of the cube */}
          {["front", "back", "left", "right", "top", "bottom"].map((face) => (
            <Box
              key={face}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(163, 29, 29, 0.7)",
                border: "2px solid #A31D1D",
                borderRadius: 3,
                boxShadow: "0 0 20px rgba(163,29,29,0.5)",
                transform: getCubeFaceTransform(face),
              }}
            />
          ))}

          {/* Center logo */}
          <Box
            component="img"
            src={logo}
            alt="E.A.R.I.S.T Logo"
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              boxShadow: "0 0 20px rgba(163,29,29,0.7)",
              animation: "heartbeat 1.5s ease-in-out infinite",
            }}
          />
        </Box>

        {/* Loading message */}
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            color: "#A31D1D",
            fontWeight: "bold",
            animation: "pulse 1.5s infinite",
          }}
        >
          {message}
        </Typography>

        <style>
          {`
            @keyframes spinCube {
              0% { transform: rotateX(0deg) rotateY(0deg); }
              100% { transform: rotateX(360deg) rotateY(360deg); }
            }
            @keyframes heartbeat {
              0%, 100% { transform: translate(-50%, -50%) scale(1); }
              25%, 75% { transform: translate(-50%, -50%) scale(1.15); }
              50% { transform: translate(-50%, -50%) scale(1.05); }
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.6; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </Box>
    );
  };

  // Helper function for cube face positions
  const getCubeFaceTransform = (face) => {
    const offset = 75; // half cube size
    switch (face) {
      case "front":
        return `translateZ(${offset}px)`;
      case "back":
        return `rotateY(180deg) translateZ(${offset}px)`;
      case "left":
        return `rotateY(-90deg) translateZ(${offset}px)`;
      case "right":
        return `rotateY(90deg) translateZ(${offset}px)`;
      case "top":
        return `rotateX(90deg) translateZ(${offset}px)`;
      case "bottom":
        return `rotateX(-90deg) translateZ(${offset}px)`;
      default:
        return "";
    }
  };

  export default LoadingOverlay;
