import React from "react";
import { useNavigate } from "react-router-dom";


export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>College Basketball Simulator</h1>
      <p style={{ color: "#ccc", maxWidth: "600px", margin: "0 auto" }}>
        Build your team, recruit stars, and chase championships.
      </p>
      <button
        onClick={() => navigate("/leagues")}
        style={{
          marginTop: "2rem",
          backgroundColor: "#fcbf49",
          color: "#000",
          padding: "0.8rem 2rem",
          border: "none",
          borderRadius: "0.5rem",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Play
      </button>
    </div>
  );
}