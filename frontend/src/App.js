import React, { useState } from 'react';
import './App.css';
import MessageEncoder from './components/MessageEncoder';
import MessageDecoder from './components/MessageDecoder';
import KeyManagement from './components/KeyManagement';
import Register from './components/Register';
import { hashKey } from './utils/encryption';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('qr-user-id') || '');
  const [password, setPassword] = useState(localStorage.getItem('qr-shared-password') || '');
  const [loggedIn, setLoggedIn] = useState(!!(userId && password));
  const [loginError, setLoginError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!userId.trim() || !password.trim()) {
      setLoginError('Please enter both user ID and password.');
      return;
    }
    // Check registered users
    const users = JSON.parse(localStorage.getItem('qr-users') || '[]');
    const user = users.find(u => u.userId === userId && u.password === password);
    if (!user) {
      setLoginError('Invalid user ID or password.');
      return;
    }
    localStorage.setItem('qr-user-id', userId);
    localStorage.setItem('qr-shared-password', password);
    const userKey = await hashKey(userId);
    localStorage.setItem(`qr-key-${userId}`, userKey);
    setLoggedIn(true);
    setLoginError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('qr-user-id');
    localStorage.removeItem('qr-shared-password');
    setUserId('');
    setPassword('');
    setLoggedIn(false);
    setShowKey(false);
  };

  const handleRegister = (newUserId, newPassword) => {
    setShowRegister(false);
    setUserId(newUserId);
    setPassword(newPassword);
  };

  const userKey = localStorage.getItem(`qr-key-${userId}`) || '';

  if (!loggedIn) {
    if (showRegister) {
      return <Register onRegister={handleRegister} switchToLogin={() => setShowRegister(false)} />;
    }
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <button type="button" style={{background:'#43e97b',marginTop:8}} onClick={() => setShowRegister(true)}>Register</button>
          {loginError && <div className="error-message">{loginError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Offline QR Code Messenger</h1>
        <div className="header-user-row">
          User: <strong>{userId}</strong>
          <button className="btn-success show-key-btn" onClick={() => setShowKey(v => !v)}>
            {showKey ? 'Hide Key' : 'Show Key'}
          </button>
          <button className="btn-danger logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {showKey && (
          <div className="user-key-display">
            <strong>Your Key:</strong>
            <div style={{wordBreak: 'break-all', fontSize: 13, marginTop: 4}}>
              {userKey}
            </div>
          </div>
        )}
      </header>
      <main>
        <div className="three-column-layout">
          <div className="column">
            <MessageEncoder />
          </div>
          <div className="column">
            <KeyManagement />
          </div>
          <div className="column">
            <MessageDecoder />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;