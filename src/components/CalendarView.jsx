import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DetailPanel from "./DetailPanel";
import { fetchData, getEventsFromData } from "../api"; // 올바른 import 확인

function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchData(); // 서버에서 데이터 가져오기
      setEvents(getEventsFromData(data)); // 데이터를 FullCalendar 형식으로 변환
    }
    loadData();
  }, []);

  return (
    <div className="calendar-view">
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} />
    </div>
  );
}

export default CalendarView;
