import React, { useState } from 'react';
import { readSheet } from './google-api/googleSheets';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const users = await readSheet('Users!A:C');
    const user = users.find((u) => u[0] === email && u[1] === password);
    if (user) {
      onLogin(user[2]);
    } else {
      alert('Login failed');
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;