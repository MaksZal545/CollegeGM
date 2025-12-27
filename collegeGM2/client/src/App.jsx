import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.jsx";

import MainPage from "./pages/mainpage.jsx";
import Roster from "./pages/roster.jsx";
import Development from "./pages/development.jsx";
import Schedule from "./pages/schedule.jsx";
import Standings from "./pages/standings.jsx";
import Recruitment from "./pages/recruitment.jsx";

//testing landing pages
//import WelcomePage from "./pages/welcomepage.jsx";
//import LeagueSelectPage from "./pages/leagueselect.jsx";

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const location = useLocation();

  const pageTitles = {
    "/": "Main Page",
    "/roster": "Roster",
    "/development": "Development",
    "/schedule": "Schedule",
    "/standings": "Standings",
    "/recruitment": "Recruitment",
  };

  const currentPage = pageTitles[location.pathname] || "Page";

  //hide header/sidebar for the landing pages
  //const hideLayout = location.pathname === "/welcome" || location.pathname === "/leagues";

  return (
    <>
      <Header toggleSidebar={toggleSidebar} currentPage={currentPage} />
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="content" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/development" element={<Development />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/recruitment" element={<Recruitment />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}