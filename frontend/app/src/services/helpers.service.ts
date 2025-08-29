import * as bip39 from 'bip39';
import nacl from 'tweetnacl';

export const randomBytes = (len: number) =>
  crypto.getRandomValues(new Uint8Array(len));

export const toBase64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));

export const fromBase64 = (b64: string) =>
  Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;


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
