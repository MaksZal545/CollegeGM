import React from "react";
import "./header.css";

function Header({ toggleSidebar, currentPage }) {
  return (
    <header className="header">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <h1 className="page-title">{currentPage}</h1>
    </header>
  );
}

export default Header;