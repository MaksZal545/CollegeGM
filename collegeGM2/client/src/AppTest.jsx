import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.jsx";
import WelcomeHeader from "./components/Welcomeheader.jsx";

import MainPage from "./pages/mainpage.jsx";
import Roster from "./pages/roster.jsx";
import Development from "./pages/development.jsx";
import Schedule from "./pages/schedule.jsx";
import Standings from "./pages/standings.jsx";
import Recruitment from "./pages/recruitment.jsx";

// 🆕 New Pages
import WelcomePage from "./pages/welcomepage.jsx";
import LeagueSelectPage from "./pages/leagueselect.jsx";

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();

  const pageTitles = {
    "/welcome" : "Welcome Page",
    "/leagues" : "Leagues Page",
    "/main": "Main Page",
    "/roster": "Roster",
    "/development": "Development",
    "/schedule": "Schedule",
    "/standings": "Standings",
    "/recruitment": "Recruitment",
  };

  const currentPage = pageTitles[location.pathname] || "Page";

  // Determine which header to use
  const isWelcomePage =
    location.pathname === "/welcome" || location.pathname === "/leagues";

  return (
    <>
      {/* ✅ Use SimpleHeader for welcome pages, normal Header otherwise */}
      {isWelcomePage ? (
        <WelcomeHeader title={currentPage} />
      ) : (
        <Header toggleSidebar={toggleSidebar} currentPage={currentPage} />
      )}

      {/* Only show sidebar for game pages */}
      {!isWelcomePage && (
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className="content" style={{ padding: "20px", minHeight: "100vh" }}>
        <Routes>
          {/* Intro Pages */}
          <Route path="/welcome" element={<><WelcomePage /></>} />
          <Route path="/leagues" element={<><LeagueSelectPage /></>} />

          {/* Main Game Pages */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/development" element={<Development />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/recruitment" element={<Recruitment />} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
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
