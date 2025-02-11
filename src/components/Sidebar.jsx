import React from 'react';

function Sidebar({ setViewMode }) {
  return (
    <div className="sidebar">
      <button onClick={() => setViewMode('calendar')}>Calendar View</button>
      <button onClick={() => setViewMode('list')}>List View</button>
    </div>
  );
}

export default Sidebar;