import React from "react";
import "./welcomeHeader.css";

function WelcomeHeader({ title }) {
  return (
    <header className="welcome-header">
      <h1 className="page-title">{title}</h1>
    </header>
  );
}

export default WelcomeHeader;