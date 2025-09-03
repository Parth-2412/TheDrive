import nacl from 'tweetnacl';
import { actualstringToUint8Array } from './helpers.service'
import { User } from '../state/user';
import axiosInstance from './api.service';

// Example usage with nacl signing
export async function signMessage(message: string | '', privateKey: Uint8Array): Promise<string> {
  const encodedMessage = actualstringToUint8Array(message);  // Convert message string to Uint8Array
  const signedMessage = nacl.sign.detached(encodedMessage, privateKey);  // Sign the message
  return Buffer.from(signedMessage).toString('hex');  // Return the signed message as a hex string
}


  export async function login_with_keys (
    user : User
  )  {
      let {
        publicKey : pk,
        privateKey,
      } = user;
      // Step 1: Get nonce and challenge
      const publicKey = Buffer.from(pk).toString('hex')
      const response = await axiosInstance.post(`/api/auth/login/request`, { 
        username: publicKey,
      });
      const { nonce, challenge_message } = response.data;

      // Step 3: Sign the challenge
      const signedNonce = await signMessage(challenge_message, privateKey);

      // Step 4: Verify with server
      const verifyResponse = await axiosInstance.post(`/api/auth/login/verify`, {
        username: publicKey,
        nonce,
        signature: signedNonce,
      });

      const { access_token : accessToken, refresh_token: refreshToken } = verifyResponse.data;
      return { accessToken, refreshToken }
      
    
  };

  