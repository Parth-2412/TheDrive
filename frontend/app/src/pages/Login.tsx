import React, { useState } from 'react';
import { IonButton, IonInput, IonLabel, IonItem, IonText, IonAlert, IonSpinner, IonRouterLink, IonPage } from '@ionic/react';
import { deriveAuthKeypair, deriveMasterKeyBytes, importAesKey } from '../services/crypto.service'; // Assuming functions are in helpers.service
import { useRecoilState } from 'recoil';  // Assuming Recoil state management
import { userState } from '../state/user'; // Path to your recoil atom
import { showError } from '../util';  // Assuming showError is a utility function
import MnemonicForm from './MnemonicForm';

const LoginForm: React.FC = () => {

  const [loading, setLoading] = useState(false);  // Loading state for the button
  const [_,setUser] = useRecoilState(userState)

  const handleLogin = async (mnemonic : string[], passphrase : string) => {
    setLoading(true);  // Start the loading spinner

    try {
      if (mnemonic.some((word) => word === '')) {
        showError('Please enter all 12 words.');
        setLoading(false);  // Stop the loading spinner
        return;
      }
      if (!passphrase) {
        showError('Please enter the passphrase');
        setLoading(false);  // Stop the loading spinner
        return;
      }

      // Join the words and create the full mnemonic
      const mnemonicString = mnemonic.join(' ');

      // Derive the keys
      const { publicKey, secretKey } = await deriveAuthKeypair(mnemonicString, passphrase);
      const masterAesKey = await importAesKey(await deriveMasterKeyBytes(mnemonicString, passphrase));

      // Set the user state with the derived keys
      setUser({
        publicKey,
        privateKey: secretKey,
        masterAesKey
      });

      setLoading(false);  // Stop the loading spinner
    } catch (error) {
      console.error('Error during login:', error);
      showError('Failed to derive keys. Please check your mnemonic.');
      setLoading(false);  // Stop the loading spinner
    }
  };

  return (
    <IonPage>
      <MnemonicForm loading={loading} onClick={handleLogin} buttonText='Login'/>
      <div>
        New ? <IonRouterLink routerLink="/register" routerDirection='forward'>Register here!</IonRouterLink>
      </div>
    </IonPage>
  );
};

export default LoginForm;
