/**
 * Helper functions for QR code generation and scanning
 */

// Format data for QR code to ensure it fits within size limitations
export const formatDataForQR = (data) => {
  // QR code has size limitations depending on version and error correction level
  // This is a simple implementation - for large messages, might need to implement chunking
  
  // Maximum size of QR code data (version 40, error correction level L) is around 4296 characters
  // For higher error correction levels, it's less
  const MAX_QR_DATA_SIZE = 2953; // Using version 40 with error correction level M
  
  if (data.length <= MAX_QR_DATA_SIZE) {
    return data;
  }
  
  // If the data is too large, we'll need to split it across multiple QR codes
  // This is a basic implementation - in a real app, you would want to add sequence numbers
  console.warn(`Data size (${data.length}) exceeds QR code capacity (${MAX_QR_DATA_SIZE}). Message will be truncated.`);
  
  return data.substring(0, MAX_QR_DATA_SIZE);
};

// Validate QR data structure
export const validateQRData = (data) => {
  try {
    const parsed = JSON.parse(data);
    
    // Check required fields
    if (!parsed.v || !parsed.k || !parsed.m) {
      return {
        valid: false,
        error: 'Invalid QR code format: missing required fields'
      };
    }
    
    // Check version
    if (parsed.v !== 1) {
      return {
        valid: false,
        error: `Unsupported QR code version: ${parsed.v}`
      };
    }
    
    return {
      valid: true,
      data: parsed
    };
  } catch (e) {
    return {
      valid: false,
      error: 'Invalid QR code: ' + e.message
    };
  }
};

export const generateQRCode = (text) => {
    const qrCode = require('qrcode');
    return qrCode.toDataURL(text);
};

export const readQRCode = async (image) => {
    const jsQR = require('jsqr');
    const { createCanvas, loadImage } = require('canvas');

    const img = await loadImage(image);
    const canvas = createCanvas(img.width, img.height);
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);

    const imageData = context.getImageData(0, 0, img.width, img.height);
    const code = jsQR(imageData.data, img.width, img.height);

    return code ? code.data : null;
};