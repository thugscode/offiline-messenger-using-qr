# QR Code Messenger Frontend

This project is a frontend application that allows users to send and receive encrypted messages using QR codes, completely offline. The application utilizes pre-shared keys for encryption and decryption of messages.

## Features

- **QR Code Generation**: Create QR codes from encrypted messages.
- **Message Encryption**: Encrypt messages using pre-shared keys before generating QR codes.
- **Message Decryption**: Scan QR codes to retrieve and decrypt messages.
- **Camera Access**: Use the device camera to scan QR codes directly from the application.
- **Key Management**: Manage pre-shared keys for secure communication.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the Repository**:
   ```
   git clone https://github.com/yourusername/qr-code-messenger.git
   cd qr-code-messenger/frontend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Application**:
   ```
   npm start
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` in your web browser to access the application.

## Folder Structure

- `public/`: Contains static files such as `index.html` and `manifest.json`.
- `src/`: Contains the main application code, including components and utilities.
  - `components/`: Contains React components for various functionalities.
  - `utils/`: Contains utility functions for encryption and QR code handling.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.