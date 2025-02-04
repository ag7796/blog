import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || {}; // 클릭한 상품 정보 가져오기

  return (
    <div className="product-detail">
      <h2>{product["상품명,중량/제조원"]}</h2>
      <p>바코드: {product["단품바코드"]}</p>
      <p>매장: {product["매장"]}</p>
      <p>판매가: {product["판매단가"]} 원</p>
      <p>저장방법: {product["저장방법 (상온/냉장/냉동)"]}</p>
      <p>입고처: {product["입고처"]}</p>
      <p>제조원: {product["제조원"]}</p>
      <img src={product["제품전면"]} alt={product["상품명"]} className="product-image" />
      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </div>
  );
}

export default ProductDetail;
