import React from "react";

function DetailPanel({ date, items, onClose }) {
  if (!date) return null;

  return (
    <div className="detail-panel open">
      <h3>{date} 상품 목록</h3>
      <button onClick={onClose}>닫기</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <strong>{item.title}</strong> ({item.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DetailPanel;
