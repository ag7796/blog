import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";  // ✅ styles 폴더가 없으면 이렇게 변경
// 또는 "./styles/App.css" (styles 폴더가 있다면)

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
