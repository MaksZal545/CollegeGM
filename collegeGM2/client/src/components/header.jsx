import React, { useState, useRef, useEffect } from "react";
import "./header.css";

function Header({
  toggleSidebar,
  currentPage,
  onSimOneWeek,
  onSimToPlayoffs,
  onSimFullSeason,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>

      <h1 className="page-title">{currentPage}</h1>

      <div className="play-wrapper" ref={dropdownRef}>
        <button
          className="play-button"
          onClick={() => setOpen((o) => !o)}
        >
          Play
        </button>

        {open && (
          <div className="play-dropdown">
            <button onClick={() => { setOpen(false); onSimOneWeek(); }}>
              Sim 1 Week
            </button>
            <button onClick={() => { setOpen(false); onSimToPlayoffs(); }}>
              Sim Until Playoffs
            </button>
            <button onClick={() => { setOpen(false); onSimFullSeason(); }}>
              Sim Full Season
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
