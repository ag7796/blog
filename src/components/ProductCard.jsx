import React from "react";

function ProductCard({ item }) {
  return (
    <div className="product-card">
      <img src={item["제품전면"]} alt={item["상품명"]} className="product-image" />
      <div className="product-info">
        <h3>{item["상품명,중량/제조원"]}</h3>
        <p>바코드: {item["단품바코드"]}</p>
        <p>매장: {item["매장"]}</p>
        <p>판매가: {item["판매단가"]} 원</p>
        <p>저장방법: {item["저장방법 (상온/냉장/냉동)"]}</p>
      </div>
    </div>
  );
}

export default ProductCard;
