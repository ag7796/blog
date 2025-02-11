export const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/data");
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    console.log("Fetched data:", data); // 데이터 확인

    // 빈 행을 제외하는 필터링 작업
    const filteredData = data.filter(item => item["상품명,중량/제조원"] && item["일자"]);
    console.log("Filtered data:", filteredData); // 필터링된 데이터 확인

    return filteredData;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return [];
  }
};

export const getEventsFromData = (data) => {
  // 데이터를 날짜별로 그룹화하고, 등록 완료와 미등록 항목의 갯수를 계산
  const groupedData = data.reduce((acc, item) => {
    const date = item["일자"];
    if (!acc[date]) {
      acc[date] = { registered: 0, unregistered: 0 };
    }
    if (item["등록여부"] === "등록완료") {
      acc[date].registered += 1;
    } else {
      acc[date].unregistered += 1;
    }
    return acc;
  }, {});

  // FullCalendar 형식으로 변환
  const events = Object.keys(groupedData).map(date => ({
    title: `등록완료: ${groupedData[date].registered}, 미등록: ${groupedData[date].unregistered}`,
    start: date,
    end: date,
    extendedProps: {
      registered: groupedData[date].registered,
      unregistered: groupedData[date].unregistered
    }
  }));
  console.log("Transformed events:", events); // 변환된 데이터 확인
  return events;
};

export const updateRegistrationStatus = async (item, status) => {
  try {
    const response = await fetch("http://localhost:5000/update-status", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item, status })
    });

    if (!response.ok) throw new Error("Failed to update data");
    const updatedItem = await response.json();
    console.log("Updated item:", updatedItem); // 업데이트된 데이터 확인
    return updatedItem;
  } catch (error) {
    console.error("❌ Error updating data:", error);
    return null;
  }
};