import React, { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decryptMessage, hashKey } from '../utils/encryption';
import ChatHistory from './ChatHistory';

const MessageDecoder = () => {
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(""); // <-- Add this line
  const userId = localStorage.getItem('qr-user-id') || '';
  const qrRef = useRef(null);

  // Load chat history for selected sender (optional: you can add sender selection)
  // For now, just show all received messages
  React.useEffect(() => {
    const allChats = [];
    for (let key in localStorage) {
      if (key.startsWith(`chat-`)) {
        const msgs = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(msgs)) {
          allChats.push(...msgs.filter(m => m.sender !== userId));
        }
      }
    }
    setChat(allChats);
  }, [userId]);

  const processQRCode = async (data, idx) => {
    if (!data) return;
    try {
      const hashed = await hashKey(userId);
      const decrypted = await decryptMessage(data, hashed);
      setDecryptedMessages(prev => {
        const copy = [...prev];
        copy[idx] = decrypted;
        return copy;
      });

      // Save received message to chat history (optional: you can extract sender info from QR if included)
      const newMsg = {
        sender: 'Other',
        text: decrypted,
        time: new Date().toLocaleTimeString(),
        direction: 'received'
      };
      const chatKey = `chat-${userId}-received`;
      const updatedChat = [...chat, newMsg];
      setChat(updatedChat);
      localStorage.setItem(chatKey, JSON.stringify(updatedChat));
    } catch (err) {
      setDecryptedMessages(prev => {
        const copy = [...prev];
        copy[idx] = 'Could not decrypt message. Wrong key or corrupted QR.';
        return copy;
      });
    }
  };

  const startScan = () => {
    setScanning(true);
    setCameraError(""); // Reset error
    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      async (text) => {
        await processQRCode(text, 0);
        html5QrCode.stop();
        setScanning(false);
      },
      (err) => {
        // Optionally handle scan errors
      }
    ).catch((err) => {
      setCameraError("Camera not detected or not accessible. Please check your device and permissions.");
      setScanning(false);
    });
    qrRef.current = html5QrCode;
  };

  const stopScan = () => {
    if (qrRef.current) {
      qrRef.current.stop();
      setScanning(false);
    }
  };

  const handleImageUpload = (event) => {
    // Add your QR image decoding logic here
    alert('Upload QR Image clicked!');
  };

  return (
    <div>
      <h2>Decode Message</h2>
      {cameraError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{cameraError}</div>
      )}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={startScan}
          disabled={scanning}
          style={{
            background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 18px',
            fontWeight: 'bold',
            cursor: scanning ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          {scanning ? 'Scanning...' : 'Scan QR'}
        </button>
        <label htmlFor="upload-qr" style={{ margin: 0 }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-qr"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            style={{
              background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            Upload QR Image
          </button>
        </label>
      </div>
      <div id="qr-reader" style={{ width: '300px', height: '300px' }}></div>
      {decryptedMessages.length > 0 && decryptedMessages.map((msg, idx) => (
        <div key={idx} style={{ margin: '16px 0' }}>
          <div className="message-container">
            <h4>Decrypted Message {idx + 1}:</h4>
            <div className="message-content">
              <p>{msg}</p>
            </div>
          </div>
        </div>
      ))}
      <h3 style={{marginTop:24}}>Received Messages</h3>
      <ChatHistory messages={chat} userId={userId} />
      {scanning && (
        <button onClick={stopScan}>Stop Scanning</button>
      )}
    </div>
  );
};

export default MessageDecoder;