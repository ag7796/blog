const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");

const router = express.Router();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

/** 📌 Google Drive에 이미지 업로드 */
router.post("/upload", async (req, res) => {
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
    console.error("❌ Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
