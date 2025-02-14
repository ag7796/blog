import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { updateRegistrationStatus } from './api';

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  const handleUpdateStatus = async (item, newStatus, event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🔹 클릭된 아이템:", item);
    console.log("🔹 업데이트 전 events 상태:", events);

    const updatedItem = { ...item, 등록여부: newStatus };

    try {
      const response = await updateRegistrationStatus(updatedItem, newStatus);

      if (response.success) {
        console.log("✅ 서버 업데이트 완료:", response);

        setEvents((prevEvents) => {
          const updatedEvents = prevEvents.map((e) => 
            e.키열 === updatedItem.키열
              ? { ...e, 등록여부: newStatus, title: e.title || "이름 없음", date: e.date }
              : e
          );

          console.log("🔄 업데이트 후 새로운 events 상태:", updatedEvents);
          return updatedEvents; // 🔥 기존 이벤트를 유지하면서 업데이트된 항목만 변경
        });
      } else {
        console.error("❌ 업데이트 실패:", response.error);
      }
    } catch (error) {
      console.error("❌ 상태 업데이트 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    console.log("📌 이벤트 상태 변경됨:", events);
  }, [events]);

  // 🔥 handleDateClick 추가 (없으면 실행 시 에러 발생 가능)
  const handleDateClick = (info) => {
    console.log("📅 날짜 클릭됨:", info.dateStr);
  };

  return (
    <div className="app-container">
      <h2>Calendar View</h2>
      <FullCalendar
        key={JSON.stringify(events)} // 🔥 이벤트 변경 강제 반영
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} // 🔥 추가
      />
    </div>
  );
};

export default CalendarView;
