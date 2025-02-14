// ...existing code...
export async function updateRegistrationStatus(item, status) {
  console.log("📡 서버에 전송할 데이터:", item); // item 전체 출력
  console.log("📡 서버에 전송할 키열:", item["키열"]); // 키열 값 로그 출력
  console.log("📡 서버에 전송할 날짜:", item["일자"]); // 날짜 값 로그 출력
  console.log("📡 서버에 전송할 새로운 상태:", status); // 새로운 상태 로그 출력

  try {
    const response = await fetch(`http://localhost:5000/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item, // item 객체를 통째로 보냄
        status, // 상태값만 따로 보냄
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update data");
    }

    const result = await response.json();
    console.log("📡 서버 응답:", result);
    return result.success;
  } catch (error) {
    console.error('❌ Error updating data:', error);
    throw error;
  }
}
// ...existing code...
