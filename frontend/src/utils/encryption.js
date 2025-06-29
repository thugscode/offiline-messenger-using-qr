/**
 * Utility functions for encryption, decryption, and key management using Web Crypto API
 */

// Convert string to ArrayBuffer
function str2ab(str) {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to base64
function ab2b64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

// Convert base64 to ArrayBuffer
function b642ab(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}

// Derive a CryptoKey from a password
export async function deriveKey(password) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    str2ab(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: str2ab("qr-messenger-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message using a password
export async function encryptMessage(message, password) {
  const key = await deriveKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    str2ab(message)
  );
  return JSON.stringify({
    iv: ab2b64(iv),
    ct: ab2b64(ciphertext)
  });
}

// Decrypt a message using a password
export async function decryptMessage(encrypted, password) {
  const key = await deriveKey(password);
  const { iv, ct } = JSON.parse(encrypted);
  const plaintext = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b642ab(iv) },
    key,
    b642ab(ct)
  );
  return new TextDecoder().decode(plaintext);
}

// Hash a key string using SHA-256
export async function hashKey(name) {
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}