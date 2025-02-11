import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchData, getEventsFromData, updateRegistrationStatus } from "./api"; // ✅ 올바르게 가져오기
import './CalendarView.css'; // CSS 파일 추가

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await fetchData(); // 서버에서 데이터 가져오기
      console.log("Fetched data in CalendarView:", data); // 데이터 확인
      const transformedEvents = getEventsFromData(data); // 데이터를 FullCalendar 형식으로 변환
      console.log("Events to be set:", transformedEvents); // 이벤트 데이터 확인
      setEvents(transformedEvents);
    }
    loadData();

    // 모바일 환경 감지
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 실행

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEventClick = (eventInfo) => {
    const date = eventInfo.event.startStr;
    console.log("클릭한 이벤트 데이터:", eventInfo.event.extendedProps); // 클릭한 이벤트 데이터 로그 출력
    fetchData().then(data => {
      const items = data.filter(item => item["일자"] === date); // 클릭한 날짜의 항목 필터링
      setSelectedItems(items);
    });
  };

  const handleUpdateStatus = async (item, status) => {
    console.log("Starting handleUpdateStatus with item:", item); // 함수 시작 로그
    console.log("Updating item with 키열:", item["키열"]); // 키열 값 로그 출력
    try {
      const updatedItem = await updateRegistrationStatus(item, status); // 상태 업데이트 요청
      if (updatedItem) {
        setSelectedItems(prevItems => prevItems.map(i => i["키열"] === item["키열"] ? updatedItem : i));
        setEvents(prevEvents => {
          const newEvents = getEventsFromData(prevEvents.map(e => e["키열"] === item["키열"] ? updatedItem : e));
          return newEvents;
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
    console.log("Finished handleUpdateStatus"); // 함수 끝 로그
  };

  const eventContent = (eventInfo) => {
    const { registered, unregistered } = eventInfo.event.extendedProps;
    return (
      <div className="custom-event-content">
        {registered > 0 && (
          <div className="registered-box" onClick={() => handleEventClick(eventInfo)}>
            {isMobile ? registered : `등록완료: ${registered}`}
          </div>
        )}
        {unregistered > 0 && (
          <div className="unregistered-box" onClick={() => handleEventClick(eventInfo)}>
            {isMobile ? unregistered : `미등록: ${unregistered}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-view">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={eventContent} // 이벤트 콘텐츠 커스터마이징
        eventDisplay="block" // 이벤트를 블록으로 표시
      />
      <div className="event-details">
        <h2>Event Details</h2>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item["상품명,중량/제조원"] || "No Title"} - {item["등록여부"]}
              <button onClick={() => handleUpdateStatus(item, '등록완료')}>등록완료로 변경</button>
              <button onClick={() => handleUpdateStatus(item, '미등록')}>미등록으로 변경</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarView;