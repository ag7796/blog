const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS 모듈 추가
const { google } = require('googleapis');
const key = require('./google-api/key.json'); // 서비스 계정 키 파일 가져오기

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); // CORS 설정 추가

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

app.get('/data', async (req, res) => {
  const spreadsheetId = '1DhcP4Bl6VnRrLyz3bI7iMivDKOnZm5zcPHJVqInqxRs'; // 실제 스프레드시트 ID로 대체
  const range = '매장!A1:AH'; // 데이터를 가져올 범위 설정

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      const headers = rows[0]; // 첫 번째 행을 열 이름으로 사용
      const data = rows.slice(1).map(row => {
        let rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || "";
        });
        return rowData;
      });
      res.json(data);
    } else {
      res.status(404).send('No data found.');
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.post('/update-status', async (req, res) => {
  console.log("🔹 Received request body:", req.body); // 요청 데이터 확인

  // req.body 구조가 `{ item: {...}, status: '등록완료' }` 형태이므로 item에서 값을 추출
  const { 키열, 일자 } = req.body.item || {}; // item 내부에서 키열, 일자 추출
  const status = req.body.status;

  if (!키열 || !일자 || !status) {
    console.error("⚠️ Missing required fields", { 키열, 일자, status });
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  console.log("📌 키열:", 키열);
  console.log("📌 일자:", 일자);
  console.log("📌 상태 변경:", status);

  const spreadsheetId = '1DhcP4Bl6VnRrLyz3bI7iMivDKOnZm5zcPHJVqInqxRs';
  const range = '매장!A1:AH'; // 데이터를 가져올 범위

  try {
    // ✅ Google Sheets 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("❌ 스프레드시트에서 데이터를 찾을 수 없음.");
      return res.status(404).json({ error: "No data found" });
    }

    // ✅ "키열" 컬럼의 인덱스 찾기
    const headers = rows[0]; // 첫 번째 행이 헤더
    const keyIndex = headers.indexOf("키열");

    if (keyIndex === -1) {
      console.error("❌ '키열' 컬럼을 찾을 수 없습니다. 시트의 첫 번째 행을 확인하세요.");
      return res.status(500).json({ error: "'키열' 컬럼을 찾을 수 없습니다." });
    }

    console.log("📌 키열 찾기 - keyIndex:", keyIndex);

    // ✅ 올바른 행 찾기
    const rowIndex = rows.findIndex(row => row[keyIndex] === 키열);
    console.log("📌 키열 찾기 - rowIndex:", rowIndex + 1);

    if (rowIndex === -1) {
      console.error("❌ 해당 키열을 가진 데이터를 찾을 수 없음.");
      return res.status(404).json({ error: "Item not found" });
    }

    // ✅ 등록여부(B열) 업데이트
    const updateRange = `매장!B${rowIndex + 1}`; // Google Sheets는 1-based index
    const updatedValue = [[status]];

    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: updatedValue },
    });

    console.log("✅ 업데이트 완료 - 업데이트된 셀:", updateResponse.data.updatedRange);
    res.json({ success: true, updatedRange: updateResponse.data.updatedRange });

  } catch (error) {
    console.error("❌ Error updating spreadsheet:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});