import nacl from 'tweetnacl';
import { actualstringToUint8Array } from './helpers.service'

// Example usage with nacl signing
export async function signMessage(message: string | '', privateKey: Uint8Array): Promise<string> {
  const encodedMessage = actualstringToUint8Array(message);  // Convert message string to Uint8Array
  const signedMessage = nacl.sign.detached(encodedMessage, privateKey);  // Sign the message
  return Buffer.from(signedMessage).toString('hex');  // Return the signed message as a hex string
}
