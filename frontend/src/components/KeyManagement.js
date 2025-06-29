import React, { useState, useEffect } from 'react';
import { hashKey } from '../utils/encryption';

const KeyManagement = () => {
  const [keys, setKeys] = useState([]);
  const [recipientName, setRecipientName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedKeys = localStorage.getItem('qr-messenger-keys');
    if (storedKeys) {
      setKeys(JSON.parse(storedKeys));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qr-messenger-keys', JSON.stringify(keys));
  }, [keys]);

  const handleAddKey = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!recipientName.trim()) {
      setError('Please enter recipient name.');
      return;
    }
    if (keys.some(k => k.name === recipientName)) {
      setError('Recipient already exists.');
      return;
    }
    try {
      const hashed = await hashKey(recipientName);
      const newKey = {
        id: Date.now().toString(),
        name: recipientName,
        key: hashed
      };
      setKeys([...keys, newKey]);
      setRecipientName('');
      setSuccess('Recipient key (hashed) added.');
    } catch (err) {
      setError('Failed to hash and add key.');
    }
  };

  const handleDeleteKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div>
      <h2>Key Management</h2>
      <form onSubmit={handleAddKey}>
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          style={{marginRight: 8}}
        />
        <button className="btn-success" type="submit">Generate key</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <ul>
        {keys.map(key => (
          <li key={key.id}>
            <strong>{key.name}</strong>: <span style={{wordBreak: 'break-all', fontStyle: 'italic', color: '#888'}}>••••••••••••••••</span>
            <button className="btn-danger" onClick={() => handleDeleteKey(key.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyManagement;