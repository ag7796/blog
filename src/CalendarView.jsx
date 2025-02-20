import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { updateRegistrationStatus } from './api';

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  // 🔹 상태 업데이트 함수
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

        // 🔥 기존 상태 업데이트 방식 변경 (새로운 배열로 업데이트)
        setEvents((prevEvents) => {
          const newEvents = prevEvents.map((e) =>
            e.키열 === updatedItem.키열
              ? { 
                  ...e, 
                  등록여부: newStatus, 
                  title: `등록완료: ${updatedItem.등록완료}, 미등록: ${updatedItem.미등록}`, 
                  start: e.start || updatedItem.일자 // 🔥 undefined 방지
                }
              : e
          );
          console.log("🔄 업데이트 후 새로운 events 상태:", newEvents);
          return [...newEvents]; // 🔥 새로운 배열을 반환하여 상태 변경 감지
        });
      } else {
        console.error("❌ 업데이트 실패:", response.error);
      }
    } catch (error) {
      console.error("❌ 상태 업데이트 중 오류 발생:", error);
    }
  };

  // 🔹 상태 변화 감지 로그
  useEffect(() => {
    console.log("📌 이벤트 상태 변경됨:", events);
  }, [events]);

  return (
    <div className="app-container">
      <h2>Calendar View</h2>
      <FullCalendar
        key={events.length} // 🔥 강제 리렌더링
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[...events]} // 🔥 새로운 배열 전달하여 변화 감지
      />
    </div>
  );
};

export default CalendarView;
