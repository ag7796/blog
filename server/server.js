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
  const { id, status } = req.body;
  console.log("Received update request with 키열:", id); // 키열 값 로그 출력

  const spreadsheetId = '1DhcP4Bl6VnRrLyz3bI7iMivDKOnZm5zcPHJVqInqxRs'; // 실제 스프레드시트 ID로 대체
  const range = '매장!A1:AH'; // 데이터를 가져올 범위 설정

  try {
    // 데이터를 가져와서 업데이트할 행을 찾습니다.
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values;
    const headers = rows[0]; // 첫 번째 행을 열 이름으로 사용
    const rowIndex = rows.findIndex(row => row[32] === id); // "키열"은 32번째 인덱스 (0부터 시작)
    console.log("Found row index:", rowIndex); // 찾은 행의 인덱스 로그 출력

    if (rowIndex === -1) {
      return res.status(404).send('Item not found');
    }

    // 해당 행의 등록여부 셀을 업데이트합니다.
    const updateRange = `매장!B${rowIndex + 2}`; // 등록여부는 B 열에 위치, +2는 헤더 행을 고려한 것
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange, // 특정 셀만 업데이트
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]], // 상태 업데이트
      },
    });

    if (updateResponse.status !== 200) throw new Error("Failed to update data");
    console.log("Updated item:", updateResponse.data); // 업데이트된 데이터 확인
    console.log("업데이트할 셀 위치:", updateResponse.data.updatedRange); // 업데이트할 셀 위치 로그 출력
    console.log("업데이트된 값:", status); // 실제 입력된 값 확인

    res.json({ id, status });
  } catch (error) {
    console.error("❌ Error updating data:", error);
    res.status(500).send("Error updating data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});