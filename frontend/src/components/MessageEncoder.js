import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { encryptMessage, hashKey } from '../utils/encryption';
import ChatHistory from './ChatHistory';

const MessageEncoder = () => {
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]);
  const [chat, setChat] = useState([]);
  const userId = localStorage.getItem('qr-user-id') || '';

  // Load recipients
  useEffect(() => {
    const storedKeys = localStorage.getItem('qr-messenger-keys');
    if (storedKeys) {
      try {
        const keys = JSON.parse(storedKeys);
        setUserList(keys.map(key => ({ id: key.id, name: key.name })));
      } catch {
        setUserList([]);
      }
    } else {
      setUserList([]);
    }
  }, []);

  // Load chat history for selected recipient
  useEffect(() => {
    if (recipientId) {
      const chatKey = `chat-${userId}-${recipientId}`;
      const storedChat = localStorage.getItem(chatKey);
      setChat(storedChat ? JSON.parse(storedChat) : []);
    } else {
      setChat([]);
    }
  }, [recipientId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setQrCodeData('');
    if (!message.trim() || !recipientId) {
      setError('Please enter a message and select a recipient.');
      return;
    }
    const recipient = userList.find(u => u.id === recipientId);
    if (!recipient) {
      setError('Recipient not found.');
      return;
    }
    try {
      const hashed = await hashKey(recipient.name);
      const encrypted = await encryptMessage(message, hashed);
      setQrCodeData(encrypted);

      // Save to chat history
      const newMsg = {
        sender: userId,
        text: message,
        time: new Date().toLocaleTimeString(),
        direction: 'sent'
      };
      const chatKey = `chat-${userId}-${recipientId}`;
      const updatedChat = [...chat, newMsg];
      setChat(updatedChat);
      localStorage.setItem(chatKey, JSON.stringify(updatedChat));
      setMessage('');
    } catch (err) {
      setError('Encryption failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Chat & Encode Message</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient:</label>
          <select
            value={recipientId}
            onChange={e => setRecipientId(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          >
            <option value="">Select recipient</option>
            {userList.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <button className="btn-success" type="submit">Generate QR Code</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {qrCodeData && (
        <div style={{ marginTop: 16 }}>
          <QRCodeCanvas value={qrCodeData} size={256} level="H" />
        </div>
      )}
      <h3 style={{marginTop:24}}>Chat History</h3>
      <ChatHistory messages={chat} userId={userId} />
    </div>
  );
};

export default MessageEncoder;