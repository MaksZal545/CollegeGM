import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

function sidebar({ isOpen, toggleSidebar }) {
  
  return (
    <>
      

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>

        <nav className="sidebar-links">
          <Link to="/main" onClick={toggleSidebar}>Main Page</Link>
          <Link to="/roster" onClick={toggleSidebar}>Roster</Link>
          <Link to="/development" onClick={toggleSidebar}>Development</Link>
          <Link to="/schedule" onClick={toggleSidebar}>Schedule</Link>
          <Link to="/standings" onClick={toggleSidebar}>Standings</Link>
          <Link to="/recruitment" onClick={toggleSidebar}>Recruitment</Link>
        </nav>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default sidebar;