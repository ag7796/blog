import React, { useState } from 'react';
import { uploadImage } from './google-api/googleSheets';

const ImageUpload = ({ store, date, productName, barcode }) => {
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    const folderPath = `신규제품이미지/${new Date(date).toISOString().slice(0, 7).replace(/-/g, '')}/${store}/${new Date(date).toISOString().slice(0, 10).replace(/-/g, '')}/${productName.replace(/\//g, '-')}/${barcode}`;
    const folderId = await createFolder(folderPath); // 폴더 생성 함수 필요
    const fileId = await uploadImage(image.path, folderId);
    console.log('Image uploaded:', fileId);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;