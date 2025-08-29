import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText, IonSpinner } from '@ionic/react';
import { deriveAuthKeypair, deriveMasterKeyBytes } from '../services/crypto.service';
import axios from 'axios';
import { signMessage } from '../services/auth.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { stringToUint8Array, uint8ArrayToString } from '../services/helpers.service';
import axiosInstance from '../services/api.service';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginPage: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [challengeMessage, setChallengeMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [needsCredentials, setNeedsCredentials] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if tokens exist
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken && refreshToken) {
        // Tokens exist, user is already authenticated
        setIsAuthenticated(true);
        setSuccessMessage('Already logged in!');
        setLoading(false);
        return;
      }

      // No tokens, check if keys exist in storage
      const storedPvt = await SecureStoragePlugin.get({ key: 'privateKey' });
      const storedPub = await SecureStoragePlugin.get({ key: 'publicKey' });
      const storedMas = await SecureStoragePlugin.get({ key: 'masterKey' });

      if (storedPvt.value && storedPub.value && storedMas.value) {
        // Keys exist, try to get username and perform automatic login
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          await performLoginWithStoredKeys(storedUsername, storedPvt.value, storedPub.value, storedMas.value);
        } else {
          // Keys exist but no username, prompt for username only
          setNeedsCredentials(true);
          setError('Please enter your username to continue');
        }
      } else {
        // No keys, need full credentials
        setNeedsCredentials(true);
      }
    } catch (err) {
      console.error('Error checking authentication status:', err);
      setNeedsCredentials(true);
    }

    setLoading(false);
  };

  const performLoginWithStoredKeys = async (
    usernameToUse: string,
    privateKeyStr: string,
    publicKeyStr: string,
    masterKeyStr: string
  ) => {
    try {
      // Step 1: Get nonce and challenge
      const response = await axiosInstance.post(`/api/auth/login/request`, { 
        username: usernameToUse 
      });
      const { nonce, challenge_message } = response.data;
      setChallengeMessage(challenge_message);

      // Step 2: Use stored keys
      const privateKey = stringToUint8Array(privateKeyStr);
      const publicKey = stringToUint8Array(publicKeyStr);
      const masterKey = stringToUint8Array(masterKeyStr);

      // Step 3: Sign the challenge
      const signedNonce = await signMessage(challenge_message, privateKey);

      // Step 4: Verify with server
      const verifyResponse = await axiosInstance.post(`/api/auth/login/verify`, {
        username: usernameToUse,
        nonce,
        signature: signedNonce,
      });

      const { access_token, refresh_token } = verifyResponse.data;

      if (access_token && refresh_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('username', usernameToUse); // Store username for future use
        setIsAuthenticated(true);
        setSuccessMessage('Login successful!');
      } else {
        setError('Authentication failed.');
        setNeedsCredentials(true);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response?.status === 404) {
        setError('User not found.');
      } else {
        setError(err.message || 'Login failed.');
      }
      setNeedsCredentials(true);
    }
  };

  const handleManualLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Get nonce and challenge
      const response = await axiosInstance.post(`/api/auth/login/request`, { username });
      const { nonce, challenge_message } = response.data;
      setChallengeMessage(challenge_message);

      let privateKey: Uint8Array;
      let publicKey: Uint8Array;
      let masterKey: Uint8Array;

      // Step 2: Try to get keys from storage first
      try {
        const storedPvt = await SecureStoragePlugin.get({ key: 'privateKey' });
        const storedPub = await SecureStoragePlugin.get({ key: 'publicKey' });
        const storedMas = await SecureStoragePlugin.get({ key: 'masterKey' });

        if (storedPvt.value && storedPub.value && storedMas.value) {
          // Use stored keys
          privateKey = stringToUint8Array(storedPvt.value);
          publicKey = stringToUint8Array(storedPub.value);
          masterKey = stringToUint8Array(storedMas.value);
        } else {
          throw new Error('No stored keys found');
        }
      } catch (storageError) {
        // No stored keys, derive from mnemonic/password
        if (!mnemonic || !password) {
          setError('Mnemonic and password are required');
          setLoading(false);
          return;
        }

        const derived = await deriveAuthKeypair(mnemonic, password);
        privateKey = derived.secretKey;
        publicKey = derived.publicKey;
        masterKey = await deriveMasterKeyBytes(mnemonic, password);
      }

      // Step 3: Sign the challenge
      const signedNonce = await signMessage(challenge_message, privateKey);

      // Step 4: Verify with server
      const verifyResponse = await axiosInstance.post(`/api/auth/login/verify`, {
        username,
        nonce,
        signature: signedNonce,
      });

      const { access_token, refresh_token } = verifyResponse.data;

      if (access_token && refresh_token) {
        // Store tokens
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('username', username);

        // Store keys securely
        await SecureStoragePlugin.set({ key: 'privateKey', value: uint8ArrayToString(privateKey) });
        await SecureStoragePlugin.set({ key: 'publicKey', value: uint8ArrayToString(publicKey) });
        await SecureStoragePlugin.set({ key: 'masterKey', value: uint8ArrayToString(masterKey) });

        setIsAuthenticated(true);
        setSuccessMessage('Login successful!');
      } else {
        setError('Authentication failed.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response?.status === 404) {
        setError('User not found.');
      } else {
        setError(err.message || 'Login failed.');
      }
    }

    setLoading(false);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="circular" />
          <IonText><p>Checking authentication...</p></IonText>
        </IonContent>
      </IonPage>
    );
  }

  // Show success page if authenticated
  if (isAuthenticated) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <h1>Welcome!</h1>
          <IonText color="success">
            <p>{successMessage}</p>
          </IonText>
          <IonButton 
            expand="full" 
            fill="outline" 
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('username');
              setIsAuthenticated(false);
              setNeedsCredentials(true);
            }}
          >
            Logout
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  // Show login form if credentials are needed
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Login</h1>

        <IonInput
          value={username}
          placeholder="Enter your username"
          onIonChange={(e) => setUsername(e.detail.value!)}
        />

        {/* Only show mnemonic/password fields if we don't have stored keys */}
        <IonInput
          value={mnemonic}
          placeholder="Enter your mnemonic (if first time login)"
          onIonChange={(e) => setMnemonic(e.detail.value!)}
        />

        <IonInput
          value={password}
          placeholder="Enter your password (if first time login)"
          onIonChange={(e) => setPassword(e.detail.value!)}
          type="password"
        />

        <IonButton onClick={handleManualLogin} expand="full" disabled={loading}>
          {loading ? <IonSpinner name="circular" /> : 'Login'}
        </IonButton>

        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {successMessage && <IonText color="success"><p>{successMessage}</p></IonText>}
        {challengeMessage && <IonText color="primary"><p>Challenge: {challengeMessage}</p></IonText>}
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;