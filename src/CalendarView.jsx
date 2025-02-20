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
        console.log("🧐 기존 prevEvents 상태:", prevEvents);
        
        const newEvents = prevEvents.map((e) =>
          e.키열 === updatedItem.키열
            ? { 
                ...e, 
                등록여부: newStatus, 
                title: e.title || "이름 없음", 
                start: updatedItem.일자 || e.start,
                end: updatedItem.일자 || e.end
              }
            : e
        );

        console.log("🔄 업데이트 후 새로운 events 상태:", newEvents);
        return [...newEvents]; // 🔥 배열 참조 변경
      });
    } else {
      console.error("❌ 업데이트 실패:", response.error);
    }
  } catch (error) {
    console.error("❌ 상태 업데이트 중 오류 발생:", error);
  }
};
