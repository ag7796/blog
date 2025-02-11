import React, { useEffect, useState } from "react";
import { fetchData } from "./api"; // api.jsx의 fetchData 가져오기

function ListView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      console.log("ListView data:", result); // 데이터 확인
      setData(result);
    };
    getData();
  }, []);

  return (
    <div>
      <h2>상품 목록</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item["상품명,중량/제조원"] || "No Title"} - {item["등록여부"]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListView;