export const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/data");
    if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
