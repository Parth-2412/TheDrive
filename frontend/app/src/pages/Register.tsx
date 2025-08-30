import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonText, IonItem, IonLabel, IonRouterLink } from '@ionic/react';
import { createMnemonic, deriveAuthKeypair, deriveMasterKeyBytes, importAesKey } from '../services/crypto.service'; // Import your helper functions
import { Buffer } from 'buffer';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { uint8ArrayToString } from '../services/helpers.service';
import axiosInstance from '../services/api.service';
import { showError } from '../util';
import { useRecoilState } from 'recoil';
import { userState } from '../state/user';
import './Register.css'
import MnemonicForm from './MnemonicForm';

window.Buffer = Buffer;

const RegisterPage: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [_, setUser] = useRecoilState(userState);  // Using Recoil state for user data

  // Generate a new mnemonic
  const generateMnemonic = () => {
    const mnemonic = createMnemonic();
    setMnemonic(mnemonic);
  };

  // Handle user registration
  const handleRegister = async (mnemonic : string[], passphrase : string) => {
   

    try {
      const mnemonic_str = mnemonic.join(' ')
      // Derive the keypair using the mnemonic and password
      const { publicKey: pk, secretKey: sk } = await deriveAuthKeypair(mnemonic_str, passphrase);

      // Step 1: Send a POST request to the server to register the user with the public key
      const response = await axiosInstance.post(`/api/auth/register`, {
        public_key: Buffer.from(pk).toString('hex')  // Convert public key to a hex string before sending
      });

      const derivedMasterKey = await deriveMasterKeyBytes(mnemonic_str, passphrase);

      // Save keys securely using SecureStorage
      SecureStoragePlugin.set({ key: "publicKey", value: uint8ArrayToString(pk) });
      SecureStoragePlugin.set({ key: "privateKey", value: uint8ArrayToString(sk) });
      SecureStoragePlugin.set({ key: "masterKey", value: uint8ArrayToString(derivedMasterKey) });

      // Set the user state
      setUser({
        privateKey: sk,
        publicKey: pk,
        masterAesKey: await importAesKey(derivedMasterKey)
      });

      // Step 2: Handle server response
      const data = response.data;
      console.log(data); // Process any further response data if needed
    } catch (err) {
      console.error(err);
      showError('An error occurred during registration');
    }
  };

  return (
    <IonPage>
      <div className="register-container">

          <div className='generate'>

            <IonButton expand='block' onClick={generateMnemonic} style={{marginBottom : "30px"}}>
              Generate Mnemonic
            </IonButton>
          </div>


        
          <MnemonicForm copy loading={false} buttonText='Register' onClick={handleRegister} initialMnemonic={mnemonic == '' ? undefined : mnemonic.split(' ')} />
      </div>
      <div>
        Already have an account ? <IonRouterLink routerDirection='none' routerLink="/login" >Login here!</IonRouterLink>
      </div>
    </IonPage>
  );
};

export default RegisterPage;
