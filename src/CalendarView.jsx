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

        setEvents((prevEvents) => {
          return prevEvents.map((e) => {
            if (e.키열 === updatedItem.키열) {
              return {
                ...e,
                등록여부: newStatus,
                title: e.title || "이름 없음", // 🔥 title 유지
                date: e.date, // 🔥 기존 날짜 유지
              };
            }
            return e;
          });
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
    console.log("📌 Updated events state:", events);
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
