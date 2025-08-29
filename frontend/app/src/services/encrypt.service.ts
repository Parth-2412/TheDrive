// encryptFile.ts
import { toBase64 } from './helpers.service';

export async function encryptFile(file: File, masterAesKey: CryptoKey) {
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
    filename: file.name,
    mime: file.type
  };
}
