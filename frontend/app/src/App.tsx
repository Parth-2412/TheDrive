import React, { useEffect, useState } from 'react';
import { IonApp, IonPage, IonRouterOutlet, IonSpinner, setupIonicReact, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom'; // Using React Router v5
import { useRecoilState } from 'recoil';
import { userState } from './state/user';
import { generateSignature, importAesKey } from './services/crypto.service';
import { stringToUint8Array, uint8ArrayToString } from './services/helpers.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { login_with_keys } from './services/auth.service';
import Login from './pages/Login';
import Register from './pages/Register';
import axiosInstance, { aiNodeInstance } from './services/api.service';
import './global.css'
import ChatApp from './components/Chat';

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [present] = useIonToast();

  // Effect to check user credentials on app load
  useEffect(() => {
    const checkUserCredentials = async () => {
      try {
        const masterAesKey = await importAesKey(
          stringToUint8Array((await SecureStoragePlugin.get({ key: 'masterKey' })).value)
        );
        const privateKey = stringToUint8Array((await SecureStoragePlugin.get({ key: 'privateKey' })).value);
        const publicKey = stringToUint8Array((await SecureStoragePlugin.get({ key: 'publicKey' })).value);
        setUser({
          masterAesKey,
          privateKey,
          publicKey,
        });
      } catch (error) {
        setUser(null);
        console.error(error);
      }
    };

    checkUserCredentials();
  }, []);

  useEffect(() => {
    if(user == "loading" || user == null || !user.accessToken || !user.refreshToken) return;
    // Set the Authorization header
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
    
    axiosInstance.interceptors.response.use(
      (response) => response, // Return successful responses directly
      async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors and retry the request if it hasn't been tried already
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark the request as retried to avoid infinite loops

          try {
            // Make a request to refresh the access token
            const response = await axiosInstance.post('/api/auth/token/refresh', {
              refresh_token: user.refreshToken,
            });

            const { access_token, refresh_token: newRefreshToken } = response.data;

            // Set the new access token and refresh token
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Update user state with the new tokens
            setUser({
              ...user,
              accessToken: access_token,
              refreshToken: newRefreshToken,
            });

            // Retry the original request with the new access token
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return axiosInstance(originalRequest); // Retry the original request

          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            setUser({ ...user, accessToken: undefined, refreshToken: undefined });
          }
        }

        // If the error is not 401 or retrying failed, reject the error
        return Promise.reject(error);
      }
    );
    aiNodeInstance.interceptors.request.use(
    async (config) => {
        if (config.headers["Content-Type"] != "application/json"){
          return config;
        }
        // Get your public key, can be from state, context, or environment
        const publicKey = user.publicKey; // Replace with actual public key

        // Assuming you already have data being sent in the request body
        const requestData = config.data || {}; // Fallback to an empty object if no data

        // Generate the signature based on the public key and the data
        const signature = await generateSignature(publicKey, requestData);

        // Modify the request data by adding public_key, signature, and the actual data
        config.data = {
            public_key: publicKey,
            signature: signature,
            data: requestData,  // Actual request data
        };

        // Return the modified config
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);
}, [user]);
  useEffect(() => {
    (async () => {
      if (user === null || user === 'loading') return;
      if (!user.accessToken) {
        try {
          const tokens = await login_with_keys(user);
          await SecureStoragePlugin.set({ key: 'privateKey', value : uint8ArrayToString(user.privateKey) })
          await SecureStoragePlugin.set({ key: 'publicKey', value : uint8ArrayToString(user.publicKey) })
          await SecureStoragePlugin.set({ key: 'masterKey', value : uint8ArrayToString(new Uint8Array(await crypto.subtle.exportKey("raw", user.masterAesKey))) })
          setUser({ ...user, ...tokens, ready: true });
        } catch (error) {
          console.error(error);
          setUser(null);
        }
      }
    })();
  }, [user]);

  // Show the spinner when the app is loading the user
  if (user === 'loading' || (user !== null && !user.accessToken)) {
    return (
      <IonApp>
        <IonPage>
          <IonSpinner name="crescent" />
        </IonPage>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Login & Register routes */}
          {
            !user ? (
              <>
                <Route exact path="/login" render={() => <Login />} />
                <Route exact path="/register" render={() => <Register />} />
                <Route render={() => <Redirect to='/login' />} />
              </>
            ) : (
              <>
                <Route exact path="/">
                  <ChatApp />
                </Route>
                {/* <Route render={() => <Redirect to='/' />} /> */}
              </>

            )
          }
         

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
