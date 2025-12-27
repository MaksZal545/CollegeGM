import React from "react";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <div>
      <Sidebar />
      <div className="content" style={{ padding: "20px" }}>
        <h1>Welcome to the Main Page</h1>
        <p>This is rendered by React.</p>
      </div>
    </div>
  );
}

export default App;