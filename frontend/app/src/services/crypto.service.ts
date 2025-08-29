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
    'raw', raw, { name: 'AES-GCM' }, false, usages
  );
}

