import React, { useState } from 'react';
import Login from './Login';
import ImageUpload from './ImageUpload';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role) => {
    setUser(role);
  };

  return (
    <div className="App">
      {user ? (
        <div>
          <h1>Welcome, {user}</h1>
          <ImageUpload store="매장1" date="2023-10-01" productName="상품1" barcode="123456789" />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;