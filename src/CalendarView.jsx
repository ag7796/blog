import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { updateRegistrationStatus } from './api';

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  const handleUpdateStatus = async (item, newStatus, event) => {
    event.preventDefault();
    event.stopPropagation();
  
    console.log("Starting handleUpdateStatus with item:", item);
  
    const updatedItem = { ...item, 등록여부: newStatus };
  
    try {
      const response = await updateRegistrationStatus(updatedItem, newStatus);
  
      if (response.success) {
        console.log("Updated item:", response);
  
        // 🔥 기존 상태를 직접 변경하지 않고 새로운 배열을 만들어 업데이트
        setEvents((prevEvents) => {
          return prevEvents.map((e) =>
            e.키열 === updatedItem.키열
              ? { ...e, 등록여부: newStatus, title: e.title || "No Title" }
              : e
          );
        });
  
        console.log("✅ Updated events list:", events);
      } else {
        console.error("❌ Update failed:", response.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  useEffect(() => {
    console.log("📌 Events state updated:", events);
  }, [events]);
  
  return (
    <div className="app-container">
      <h2>Calendar View</h2>
      <FullCalendar
  key={JSON.stringify(events)} // 🔥 강제 리렌더링
  plugins={[dayGridPlugin]}
  initialView="dayGridMonth"
  events={events}
  dateClick={handleDateClick}
/>

    </div>
  );
};

export default CalendarView;
