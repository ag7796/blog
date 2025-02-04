import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import ListView from "./components/ListView";
import "./App.css";

function App() {
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "list"

  return (
    <div className="app-container">
      {/* 왼쪽 사이드바 */}
      <Sidebar setViewMode={setViewMode} viewMode={viewMode} />
      
      {/* 선택한 뷰 표시 */}
      <div className="main-content">
        {viewMode === "calendar" ? <CalendarView /> : <ListView />}
      </div>
    </div>
  );
}

export default App;
