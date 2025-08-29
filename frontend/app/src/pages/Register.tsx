import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText } from '@ionic/react';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { createMnemonic, deriveAuthKeypair, deriveMasterKeyBytes } from '../services/crypto.service'; // Import your helper functions
import { Buffer } from 'buffer';
import axios from 'axios';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { stringToUint8Array, uint8ArrayToString } from '../services/helpers.service';
import axiosInstance from '../services/api.service';
window.Buffer = Buffer;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const RegisterPage: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);
  const [masterKey, setMasterKey] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isKeyStored, setIsKeysStored] = useState<Boolean>(false);
  // Generate a new mnemonic
  const generateMnemonic = () => {
    const mnemonic = createMnemonic();
    setMnemonic(mnemonic);
    setPublicKey(null);  // Reset publicKey on new mnemonic generation
    setMasterKey(null);   // Reset masterKey
    setError(null);       // Reset errors
  };
  useEffect(() => {
    const checkStoredKeys = async () => {
      try {
        const storedPvt = await SecureStoragePlugin.get({ key: 'privateKey' });
        const storedPub = await SecureStoragePlugin.get({ key: 'publicKey' });
        const storedmas = await SecureStoragePlugin.get({ key: 'masterKey' });
        console.log("ASdf")
        if (storedPvt.value && storedPub.value && storedmas.value) {
          setIsKeysStored(true); // Keys are already stored
          // setPvtKey(stringToUint8Array(storedPvt.value)); // Store private key
        }
      } catch (err) {
        setIsKeysStored(false); // No keys found
      }
    };
    checkStoredKeys();
  }, []);

  // Handle user registration

  const handleRegister = async () => {
    if (!mnemonic || !username) {
      setError('Mnemonic and Username are required');
      return;
    }


    try {
      // Derive the keypair using the mnemonic and password
      const { publicKey: pk, secretKey: sk } = await deriveAuthKeypair(mnemonic, password);

      // Generate the master key
      const derivedMasterKey = await deriveMasterKeyBytes(mnemonic, password);
      SecureStoragePlugin.set({key: "publicKey", value: uint8ArrayToString(pk)})
      SecureStoragePlugin.set({key: "privateKey", value: uint8ArrayToString(sk)})
      SecureStoragePlugin.set({key: "masterKey", value: uint8ArrayToString(derivedMasterKey)})

      // Step 1: Send a POST request to the server to register the user with the public key
      const response = await axiosInstance.post(`/api/auth/register`, {
        username,
        public_key: Buffer.from(pk).toString('hex')  // Convert public key to a hex string before sending
      });

      // Step 2: Handle server response
      const { id, username: serverUsername, public_key, preferred_ai_node, storage_used, created_at, last_login } = response.data;
      
      // Successfully registered
      setStatus(`Registration successful! User ID: ${id} --- ${username}`);
      setError(null); // Clear any previous errors

      // Optionally, store user data (like access tokens or user profile info) locally if required
      // For example: localStorage.setItem('user_id', id);

    } catch (err) {
      console.error(err);
      setError('An error occurred during registration');
    }
  };
    if (isKeyStored) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <h1>Already Logged In.</h1>
          </IonContent>
        </IonPage>
      );
    }
  

  return (
    <IonPage>
      <IonContent className="ion-padding p-10 m-10 ion-content">
        <h1 className='text-5xl font-sans font-bold'>Register</h1>

        <IonInput
          value={username}
          placeholder="Enter your username"
          onIonChange={(e) => setUsername(e.detail.value!)}
          type="text"
        />

        <IonButton onClick={generateMnemonic} className=''>Generate Mnemonic</IonButton>
        <IonText color="medium">
          <p>Mnemonic: {mnemonic || 'No mnemonic generated'}</p>
        </IonText>

        <IonInput
          value={password}
          placeholder="Enter your password"
          onIonChange={(e) => setPassword(e.detail.value!)}
          type="password"
        />

        <div className='text-center'>
            <IonButton onClick={handleRegister} expand="full" disabled={!mnemonic || !username}>
              Register
            </IonButton>
            {status && <IonText color="success"> {status} </IonText>}
        </div>

        {error && <IonText color="danger">{error}</IonText>}
        {publicKey && (
          <IonText color="primary">
            <p>Public Key: {Buffer.from(publicKey).toString('hex')}</p>
          </IonText>
        )}
        {masterKey && (
          <IonText color="primary">
            <p>Master Key (Encrypted): {Buffer.from(masterKey).toString('hex')}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
