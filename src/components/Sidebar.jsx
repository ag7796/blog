import React from "react";

function Sidebar({ setViewMode, viewMode }) {
  return (
    <div className="sidebar">
      <h2>상품 등록 관리</h2>
      <ul>
        <li onClick={() => setViewMode("calendar")} className={viewMode === "calendar" ? "active" : ""}>
          📅 캘린더 뷰
        </li>
        <li onClick={() => setViewMode("list")} className={viewMode === "list" ? "active" : ""}>
          📋 게시판 뷰
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
