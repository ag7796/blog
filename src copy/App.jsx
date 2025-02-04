import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then((response) => response.json())
      .then((json) => {
        const filtered = json.filter(item => item["검수"] === "메일전송");
        const groupedData = {};

        filtered.forEach(item => {
          const date = item["일자"];
          const category = item["등록여부"];
          if (!groupedData[date]) {
            groupedData[date] = { 등록완료: 0, 미등록: 0, items: [] };
          }
          groupedData[date][category]++;
          groupedData[date].items.push(item);
        });

        const eventList = Object.keys(groupedData).map(date => ({
          title: `${groupedData[date]["등록완료"]} / ${groupedData[date]["미등록"]}`,
          start: date,
          extendedProps: groupedData[date],
        }));

        setEvents(eventList);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.event.startStr);
    setSelectedDetails(info.event.extendedProps.items);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product["단품바코드"]}`, { state: { product } });
  };

  return (
    <div className="app-container">
      <h2>📅 상품 등록 캘린더</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleDateClick}
        eventContent={(arg) => {
          const [registered, notRegistered] = arg.event.title.split(" / ");
          return (
            <div className="calendar-event">
              <span className="registered-count">{registered}</span> /
              <span className="not-registered-count">{notRegistered}</span>
            </div>
          );
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
      />

      {selectedDate && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedDate} 상품 목록</h3>
            <ul>
              {selectedDetails.map((item, index) => (
                <li key={index} onClick={() => handleProductClick(item)} className="product-link">
                  <b>{item["상품명,중량/제조원"]}</b> ({item["등록여부"]})
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedDate(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
