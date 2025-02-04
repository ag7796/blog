require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const googleSheetsRoutes = require("./routes/googleSheets");
const googleDriveRoutes = require("./routes/googleDrive");

const app = express();

// 📌 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(express.json());

// 📌 라우트 연결
app.use("/api/sheets", googleSheetsRoutes);
app.use("/api/drive", googleDriveRoutes);

// 📌 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
