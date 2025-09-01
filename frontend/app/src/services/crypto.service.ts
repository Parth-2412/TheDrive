import * as bip39 from '@scure/bip39';
import nacl from 'tweetnacl';
import { randomBytes } from './helpers.service';
import { wordlist } from '@scure/bip39/wordlists/english.js';
export function createMnemonic() {
  return bip39.generateMnemonic(wordlist, 128);
}

async function mnemonicToSeed(mnemonic: string, passphrase = ''): Promise<Uint8Array> {
  // bip39.mnemonicToSeedSync returns Buffer
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonic, passphrase);
  return new Uint8Array(seedBuffer);
}

async function hkdf(ikm: Uint8Array, info: string, length = 32) {
  const salt = new Uint8Array(32);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', ikm, 'HKDF', false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode(info) },
    keyMaterial, length * 8
  );
  return new Uint8Array(derived);
}
export async function deriveAuthKeypair(mnemonic: string, passphrase = '') {
  const seed = await mnemonicToSeed(mnemonic, passphrase); // 64 bytes
  const skSeed = await hkdf(seed, 'auth-ed25519', 32); // 32 bytes
  // tweetnacl expects 32-byte seed
  const keyPair = nacl.sign.keyPair.fromSeed(skSeed);
  return {
    publicKey: keyPair.publicKey, // Uint8Array
    secretKey: keyPair.secretKey  // Uint8Array (64 bytes)
  };
}
export async function deriveMasterKeyBytes(mnemonic: string, passphrase = '') {
  const seed = await mnemonicToSeed(mnemonic, passphrase);
  return await hkdf(seed, 'master-encryption', 32); // 32 bytes => AES-256
}

export async function importAesKey(raw: Uint8Array, usages: KeyUsage[] = ['encrypt','decrypt']) {
  return crypto.subtle.importKey(
    'raw', raw, { name: 'AES-GCM' }, true, usages
  );
}

export function uint8ArrayToHex(uint8Array : Uint8Array) {
    return Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))  // Convert each byte to hex, ensuring it's 2 characters
        .join('');  // Join the array of hex values into a single string
}


async function _generateSHA256Hash(data : Uint8Array<ArrayBuffer>) {

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function generateSHA256Hash(inputString : string){
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  return await _generateSHA256Hash(data);
}

export async function getFileSHA256Hash(file: File) {
    const arrayBuffer = await file.arrayBuffer(); // Convert the File object to an ArrayBuffer
    const hash = await _generateSHA256Hash(new Uint8Array(arrayBuffer)); // Generate SHA-256 hash from the ArrayBuffer
    return hash;
}

export async function generateSignature(privateKey: Uint8Array, dataJson: string): Promise<string> {

  // The secret key is the first 32 bytes of the private key
  const secretKey = privateKey.slice(0, 32);

  // Convert the JSON string to a Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(dataJson);

  // Create the signing key from the secret key (32 bytes)
  const signingKey = nacl.sign.keyPair.fromSeed(secretKey);

  // Sign the data
  const signature = nacl.sign.detached(dataBuffer, signingKey.secretKey);

  // Return the signature as a hexadecimal string
  return Buffer.from(signature).toString('hex');
}