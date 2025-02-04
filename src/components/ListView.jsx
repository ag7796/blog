import React, { useState, useEffect } from "react";
import { fetchData } from "../api"; // 데이터를 가져오는 함수

function ListView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };
    getData();
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <h3>{item["상품명"]}</h3>
            <p>날짜: {item["일자"]}</p>
            <p>매장: {item["매장"]}</p>
            <p>상태: {item["등록여부"]}</p>
          </div>
        ))
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default ListView;
