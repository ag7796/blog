import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CalendarView from "./components/CalendarView";
import ListView from "./components/ListView";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 App Component Loaded!");
    setIsLoaded(true);
  }, []);

  const setViewMode = (mode) => {
    if (mode === 'calendar') {
      navigate('/');
    } else if (mode === 'list') {
      navigate('/list');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;  // 만약 isLoaded가 false면 Loading 화면 표시
  }

  return (
    <div className="app-container">
      <Sidebar setViewMode={setViewMode} />
      <div className="content">
        <Routes>
          <Route path="/" element={<CalendarView />} />
          <Route path="/list" element={<ListView />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;