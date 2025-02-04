const { google } = require("googleapis");
const fs = require("fs");
const express = require("express");
const router = express.Router();

const auth = new google.auth.GoogleAuth({
  keyFile: "server/google-api/key.json", // 서버에서 실행될 경로 확인
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

const spreadsheetId = "1DhcP4Bl6VnRrLyz3bI7iMivDKOnZm5zcPHJVqInqxRs";

/** ✅ 1. Google Sheets에서 데이터 읽기 API */
router.get("/readSheet", async (req, res) => {
  try {
    const range = req.query.range; // URL 쿼리 파라미터에서 범위 받기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    res.json({ success: true, data: response.data.values });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** ✅ 2. Google Sheets에 데이터 쓰기 API */
router.post("/writeSheet", async (req, res) => {
  try {
    const { range, values } = req.body;
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** ✅ 3. Google Drive에 이미지 업로드 API */
router.post("/uploadImage", async (req, res) => {
  try {
    const { filePath, folderId } = req.body;
    
    const fileMetadata = {
      name: `${Date.now()}.jpg`,
      parents: [folderId],
    };

    const media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    res.json({ success: true, fileId: response.data.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Express 라우터 내보내기
module.exports = router;
