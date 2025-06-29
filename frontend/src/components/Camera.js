import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function DecodeMessage({ onScan, onError, onScanningChange }) {
  const [decodedText, setDecodedText] = useState("");
  const [scanning, setScanning] = useState(false);
  const qrRef = useRef(null);
  const animationFrameId = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        onScanningChange(true);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanQRCode();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onError("Could not access camera: " + err.message);
        onScanningChange(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      onScanningChange(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanQRCode = () => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        onScan(code.data);
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanQRCode);
  };

  const startScan = () => {
    setScanning(true);
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (text) => {
        setDecodedText(text);
        html5QrCode.stop();
        setScanning(false);
      },
      (err) => {
        // Optionally handle scan errors
      }
    );
    qrRef.current = html5QrCode;
  };

  const stopScan = () => {
    if (qrRef.current) {
      qrRef.current.stop();
      setScanning(false);
    }
  };

  return (
    <div>
      <div className="camera-container">
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ width: "100%", maxHeight: "70vh" }} />
      </div>
      <button onClick={startScan} disabled={scanning}>
        {scanning ? "Scanning..." : "Scan QR"}
      </button>
      <div id="qr-reader" style={{ width: "300px", height: "300px" }}></div>
      {decodedText && (
        <div>
          <h4>Decoded Message:</h4>
          <p>{decodedText}</p>
        </div>
      )}
      {scanning && <button onClick={stopScan}>Stop Scanning</button>}
    </div>
  );
}

export default DecodeMessage;