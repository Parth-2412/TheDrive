// encryptFile.ts
import { fromBase64, stringToUint8Array, toBase64, uint8ArrayToString } from './helpers.service';

export default async function encryptFile(file: File, masterAesKey: CryptoKey) {
  const fileArray = await file.arrayBuffer();

  // 1) Generate fileKey (AES-GCM)
  const fileKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt','decrypt']
  );

  // 2) Encrypt file with fileKey
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: undefined },
    fileKey,
    fileArray
  );
  const encryptedFileName = await crypto.subtle.encrypt(
    {name: 'AES-GCM', iv, additionalData: undefined},
    masterAesKey,
    new TextEncoder().encode(file.name)
  )

  // 3) Export raw fileKey and encrypt (wrap) it with masterAesKey
  const fileKeyRaw = await crypto.subtle.exportKey('raw', fileKey); // ArrayBuffer
  const wrapIv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: wrapIv },
    masterAesKey,
    fileKeyRaw
  );
  // 4) Return payload to upload
  return {
    ciphertext: toBase64(ciphertext),
    file_iv: toBase64(iv.buffer),
    wrapped_key: toBase64(wrapped),
    wrap_iv: toBase64(wrapIv.buffer),
    filename: toBase64(encryptedFileName),
    mime: file.type
  };
}

export async function encryptName (name: string, masterAesKey: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  
  const encryptedName = await crypto.subtle.encrypt(
    {name: "AES-GCM", iv}, masterAesKey, new TextEncoder().encode(name)
  )
  const combined = new Uint8Array(iv.length + encryptedName.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedName), iv.length);
  return toBase64(combined.buffer)
}


export async function decryptFileName(encryptedData: string, masterAesKey: CryptoKey) {
  // Convert base64 string back to an ArrayBuffer
  const combined = fromBase64(encryptedData);  // Assuming `fromBase64` returns an ArrayBuffer
  
  // Convert ArrayBuffer to Uint8Array
  const uint8ArrayCombined = new Uint8Array(combined);

  // The first 12 bytes are the IV
  const iv = uint8ArrayCombined.slice(0, 12);  // AES-GCM IV is 12 bytes
  // The rest is the ciphertext
  const ciphertext = uint8ArrayCombined.slice(12);

  try {
    // Decrypt the ciphertext with AES-GCM using the IV and master AES key
    const decryptedName = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      masterAesKey,
      ciphertext
    );

    // Decode the decrypted data into a string
    return new TextDecoder().decode(decryptedName);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt the file name.");
  }
}
