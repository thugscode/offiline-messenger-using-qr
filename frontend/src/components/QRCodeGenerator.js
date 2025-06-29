import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { encryptMessage } from '../utils/encryption';

const QRCodeGenerator = () => {
    const [message, setMessage] = useState('');
    const [encryptedMessage, setEncryptedMessage] = useState('');
    const canvasRef = useRef(null);

    const handleGenerateQRCode = () => {
        const key = 'your-pre-shared-key'; // Replace with actual key management
        const encrypted = encryptMessage(message, key);
        setEncryptedMessage(encrypted);
    };

    useEffect(() => {
        if (!encryptedMessage || !canvasRef.current) return;

        const generateQR = async () => {
            try {
                await QRCode.toCanvas(canvasRef.current, encryptedMessage, {
                    width: 300,
                    margin: 1,
                    errorCorrectionLevel: 'H'
                });
            } catch (err) {
                console.error("Error generating QR code:", err);
            }
        };

        generateQR();
    }, [encryptedMessage]);

    return (
        <div>
            <h2>QR Code Generator</h2>
            <textarea
                rows="4"
                cols="50"
                placeholder="Enter your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleGenerateQRCode}>Generate QR Code</button>
            {encryptedMessage && (
                <div className="qr-container">
                    <canvas ref={canvasRef} />
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;