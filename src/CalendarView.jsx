const handleUpdateStatus = async (item, newStatus, event) => {
  event.preventDefault();
  event.stopPropagation();

  const updatedItem = { ...item, 등록여부: newStatus };

  try {
    const response = await updateRegistrationStatus(updatedItem, newStatus);

    if (response.success) {
      console.log("✅ 서버 업데이트 완료:", response);

      setTimeout(() => {
        fetchEvents(); // 🔥 Google Sheets에서 데이터 다시 불러오기
      }, 1000); // 1초 딜레이
    } else {
      console.error("❌ 업데이트 실패:", response.error);
    }
  } catch (error) {
    console.error("❌ 상태 업데이트 중 오류 발생:", error);
  }
};

const fetchEvents = async () => {
  try {
    const response = await getEventsFromGoogleSheets(); // 🔥 Google Sheets에서 데이터 가져오기
    setEvents(response.data); // 🔥 상태 업데이트
  } catch (error) {
    console.error("❌ 이벤트 불러오기 오류:", error);
  }
};

useEffect(() => {
  fetchEvents(); // 🔥 컴포넌트가 처음 렌더링될 때 데이터 불러오기
}, []);
