# Offline QR Code Messenger

![Offline QR Code Messenger Screenshot](./frontend/Offline-messanger-qr.png)

Send and receive encrypted messages using QR codes, completely offline — no Wi-Fi, Bluetooth, or internet required. Messages are scanned and decrypted using pre-shared keys.

## Features

- Generate RSA key pairs for secure communication
- Encrypt messages using recipients' public keys
- Generate QR codes for encrypted messages
- Scan QR codes using device camera or upload QR images
- Decrypt messages using your private key
- Works entirely offline after initial load
- No data is sent to any server

## How It Works

1. **Key Exchange**: Users generate key pairs and share their public keys with trusted contacts
2. **Message Encryption**: Sender encrypts a message using recipient's public key
3. **QR Code Generation**: Encrypted message is embedded in a QR code
4. **Scanning**: Recipient scans QR code with their device or uploads a QR image
5. **Decryption**: Message is decrypted using recipient's private key

## Security Notes

- Private keys never leave your device
- Messages can only be decrypted with the correct private key
- All cryptographic operations are performed locally using Web Crypto API
- No data is stored on servers or transmitted over the internet

## Installation

### Prerequisites

- Node.js 14+ and npm

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd offiline-messenger-using-qr
   ```
3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```
4. Start the frontend development server:
   ```
   npm start
   ```

> **Note:**  
> The backend server is **not required** for the current version. All features work fully offline in your browser.

## Usage

1. Open the frontend application in your browser.
2. Generate your RSA key pair in the Key Management component.
3. Share your public key with the person you want to communicate with.
4. Use the Message Encoder to create encrypted messages and generate QR codes.
5. Scan the QR codes using the Camera component or upload a QR image to receive and decrypt messages.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.