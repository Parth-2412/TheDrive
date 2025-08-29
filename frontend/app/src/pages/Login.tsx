import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText } from '@ionic/react';
import { deriveAuthKeypair, deriveMasterKeyBytes } from '../services/crypto.service';
import axios from 'axios';
import { signMessage } from '../services/auth.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { stringToUint8Array, uint8ArrayToString } from '../services/helpers.service';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginPage: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [challengeMessage, setChallengeMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pvtKey, setPvtKey] = useState<Uint8Array>();
  const [isKeysStored, setIsKeysStored] = useState<boolean>(false);

  // Check if keys are stored when component mounts
  useEffect(() => {
    const checkStoredKeys = async () => {
      try {
        const storedPvt = await SecureStoragePlugin.get({ key: 'privateKey' });
        const storedPub = await SecureStoragePlugin.get({ key: 'publicKey' });
        const storedmas = await SecureStoragePlugin.get({ key: 'masterKey' });

        if (storedPvt.value && storedPub.value && storedmas.value) {
          setIsKeysStored(true); // Keys are already stored
          setPvtKey(stringToUint8Array(storedPvt.value)); // Store private key
        }
      } catch (err) {
        setIsKeysStored(false); // No keys found
      }
    };
    checkStoredKeys();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!username) {
      setError('Username is required');
      return;
    }

    try {
    //   Step 1: Send request to get nonce + challenge
      const response = await axios.post(`${BACKEND_URL}/api/auth/login/request/`, { username });
      const { nonce, challenge_message } = response.data;
      setChallengeMessage(challenge_message);

      let privateKey: Uint8Array;
      let publicKey: Uint8Array;
      let masterKey: Uint8Array;
      // Step 2: Check if keys are stored, otherwise ask for mnemonic + password
      if (isKeysStored) {
        // Keys are already stored in SecureStorage
        privateKey = pvtKey as Uint8Array;
        const storedPub = await SecureStoragePlugin.get({ key: 'publicKey' });
        console.log("adf")
        const storedmas = await SecureStoragePlugin.get({ key: 'masterKey' });
        publicKey = stringToUint8Array(storedPub.value);
        masterKey = stringToUint8Array(storedmas.value)
      } else {
        // Derive keys from mnemonic/password
        if (!mnemonic || !password) {
          setError('Mnemonic and password are required');
          return;
        }

        // Derive keypair
        const derived = await deriveAuthKeypair(mnemonic, password);
        privateKey = derived.secretKey;
        publicKey = derived.publicKey;
        masterKey = await deriveMasterKeyBytes(mnemonic, password);
        // Store keys securely for future use
    }
    
    // Step 3: Sign the challenge message
    const signedNonce = await signMessage(challenge_message, privateKey);
    
    // Step 4: Send signed nonce + public key to server
    const verifyResponse = await axios.post(`${BACKEND_URL}/api/auth/login/verify/`, {
        username,
        nonce,
        signature: signedNonce,
    });
    
    const { access_token, refresh_token } = verifyResponse.data;
    
    if (access_token && refresh_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        await SecureStoragePlugin.set({ key: 'privateKey', value: uint8ArrayToString(privateKey) });
        await SecureStoragePlugin.set({ key: 'publicKey', value: uint8ArrayToString(publicKey) });
        await SecureStoragePlugin.set({ key: 'masterKey', value: uint8ArrayToString(masterKey) });
        setSuccessMessage('Login successful!');
      } else {
        setError('Invalid nonce signature.');
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('User not found.');
      } else {
        console.error(err);
        setError(err.message || 'Unexpected error occurred.');
      }
    }
  };

  if (isKeysStored) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <h1>Login Successful!</h1>
          <IonText color="success"><p>{successMessage}</p></IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Login</h1>

        <IonInput
          value={username}
          placeholder="Enter your username"
          onIonChange={(e) => setUsername(e.detail.value!)}
        />

        <IonInput
          value={mnemonic}
          placeholder="Enter your mnemonic"
          onIonChange={(e) => setMnemonic(e.detail.value!)}
        />

        <IonInput
          value={password}
          placeholder="Enter your password"
          onIonChange={(e) => setPassword(e.detail.value!)}
          type="password"
        />

        <IonButton onClick={handleLogin} expand="full">
          Login
        </IonButton>

        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {successMessage && <IonText color="success"><p>{successMessage}</p></IonText>}

        {challengeMessage && <IonText color="primary"><p>{challengeMessage}</p></IonText>}
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
