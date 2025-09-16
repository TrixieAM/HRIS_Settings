import React from "react";
import logo from "../assets/earist-logo.png";

const Unauthorized = () => {
  return (
    <div
     
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.08, // lighter = faint watermark
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <img
          src={logo}
          alt="EARIST Logo"
          style={{ width: "800px", height: "auto" }}
        />
      </div>

      {/* Card Content */}
      <div
        
      >
        <h1
          style={{
            fontSize: "10rem",
            fontWeight: "bold",
            color: "#6D2323",
            marginTop: "-5px",
            animation: "fadeFlicker 2s infinite",
            marginBottom:'50px'
          }}
        >
          PAGE NOT FOUND
        </h1>

        <div
          style={{
            fontSize: "7rem",
            fontWeight: "bold",
            color: "#FF6B35",
            marginTop: "-80px",
            animation: "glitchText 1.5s infinite",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

          }}
        >
          404
        </div>

        <h2
          style={{
            color: "#A31D1D",
            fontSize: "2rem",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Unauthorized Access
        </h2>

        <p
          style={{
            color: "#333",
            fontSize: "1.2rem",
            lineHeight: "1.6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          You do not have access to this page. 
          Please contact the administrator.
        </p>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes glitchText {
            0%, 90%, 100% { transform: translateX(0); }
            20% { transform: translateX(-2px) skew(-1deg); }
            40% { transform: translateX(-2px) skew(1deg); }
            60% { transform: translateX(2px) skew(-1deg); }
            80% { transform: translateX(1px) skew(1deg); }
          }
          @keyframes fadeFlicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
            75% { opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
};

export default Unauthorized;