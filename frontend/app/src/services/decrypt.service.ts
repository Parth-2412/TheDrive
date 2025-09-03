import { fromBase64 } from './helpers.service';

export async function decryptFile(record: any, masterAesKey: CryptoKey) {
  const wrapped = fromBase64(record.wrapped_key);
  const wrapIv = new Uint8Array(fromBase64(record.wrap_iv));
  const fileKeyRaw = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: wrapIv },
    masterAesKey,
    wrapped
  );
  const fileKey = await crypto.subtle.importKey(
    'raw', fileKeyRaw, { name:'AES-GCM' }, false, ['decrypt']
  );

  const ct = fromBase64(record.ciphertext);
  const iv = new Uint8Array(fromBase64(record.file_iv));
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, additionalData: undefined },
    fileKey,
    ct
  );
  return new Blob([plaintext], { type: record.mime });
}
