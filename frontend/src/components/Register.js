import React, { useState } from 'react';

const Register = ({ onRegister, switchToLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!userId.trim() || !password.trim()) {
      setError('Please enter both user ID and password.');
      return;
    }
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('qr-users') || '[]');
    if (users.some(u => u.userId === userId)) {
      setError('User ID already exists.');
      return;
    }
    users.push({ userId, password });
    localStorage.setItem('qr-users', JSON.stringify(users));
    setSuccess('Registration successful! You can now log in.');
    setTimeout(() => {
      onRegister(userId, password);
    }, 1000);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Register</h2>
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
        <button type="submit">Register</button>
        <button type="button" style={{background:'#8e44ad',marginTop:8}} onClick={switchToLogin}>Back to Login</button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default Register;