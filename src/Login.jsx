import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // 페이지 이동을 위한 Hook

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // 네비게이션 객체 생성

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        onLogin();
        navigate("/");  // 로그인 성공 시 캘린더 화면으로 이동
      } else {
        setError("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
