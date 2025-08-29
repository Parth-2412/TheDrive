import * as bip39 from 'bip39';
import nacl from 'tweetnacl';

export const randomBytes = (len: number) =>
  crypto.getRandomValues(new Uint8Array(len));

// export const toBase64 = (buf: ArrayBuffer) =>
//   btoa(String.fromCharCode(...new Uint8Array(buf)));

export function toBase64(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  uint8Array.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
}


// export const fromBase64 = (b64: string) =>
  // Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;


export function fromBase64(base64String: string) {
  const binaryString = atob(base64String); // Decode base64 to binary string
  const uint8Array = new Uint8Array(binaryString.length); // Create a Uint8Array with the binary string length

  // Fill the Uint8Array with the byte values
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i); // Convert each character to byte
  }

  return uint8Array.buffer; // Return as ArrayBuffer

}

// Convert a string to a Uint8Array using TextEncoder
export const stringToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);  // Decode the base64 string
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
export function actualstringToUint8Array(input: string): Uint8Array {
  const encoder = new TextEncoder();  // Create a TextEncoder instance
  return encoder.encode(input);  // Encode the string into a Uint8Array
}
export const uint8ArrayToString = (arr: Uint8Array): string => {
  const decoder = new TextDecoder('utf-8');
  return btoa(String.fromCharCode(...arr));
};
