import { IonApp, IonPage, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from './state/user';
import { useEffect, useState } from 'react';
import { importAesKey } from './services/crypto.service';
import { stringToUint8Array } from './services/helpers.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { login_with_keys } from './services/auth.service';

import './global.css';
import './theme/variables.css';
import Manager from './pages/Manager';
import Login from './pages/Login';
import Register from './pages/Register';
import { IonSpinner } from '@ionic/react';
import axiosInstance from './services/api.service';
import SmartRedirect from './components/Redirect';

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

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
    if(user == "loading" || !user?.accessToken || !user.refreshToken) return;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
   
    axiosInstance.interceptors.response.use(
      response => response, // Directly return successful responses.
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
          try {
            
            // Make a request to your auth server to refresh the token.
            const response = await axiosInstance.post(`/api/auth/token/refresh`, {
              refresh_token : user.refreshToken,
            });
            const { access_token, refresh_token: newRefreshToken } = response.data;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser({...user, accessToken: access_token, refreshToken: newRefreshToken})
            return axiosInstance(originalRequest); // Retry the original request with the new access token.
          } catch (refreshError) {
            // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
            console.error('Token refresh failed:', refreshError);
            setUser({...user, accessToken: undefined, refreshToken: undefined})
          }
        }
        return Promise.reject(error); // For all other errors, return the error as is.
      }
          );
  }, [(user =="loading" ? null : user?.accessToken), (user =="loading" ? null : user?.refreshToken)])
  // Effect to handle user login when the access token is not available
  useEffect(() => {
    (async () => {

      if (user === null || user === 'loading') return;
      console.log(user)
      if (!user.accessToken) {
        const tokens = await login_with_keys(user);
        setUser({ ...user, ...tokens, ready: true });
      }
    })()
  }, [user]);

  // Show the spinner when the app is loading the user
  if (user === 'loading' || !user?.ready) {
    return (
      <IonApp>
        <IonPage>
          <IonSpinner name="crescent" />
        </IonPage>
      </IonApp>
    );
  }

  // Render login or manager based on user state
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Login & Register routes */}
          <Route exact path="/login">
            {user ? <SmartRedirect to="/manager" /> : <Login />}
          </Route>
          <Route exact path="/register">
            {user ? <SmartRedirect to="/manager" /> : <Register />}
          </Route>

          {/* Manager (protected area after login) */}
          <Route exact path="/manager">
            {user && user.accessToken ? <Manager /> : <SmartRedirect to="/login" />}
          </Route>

          {/* Default redirect: send unknown routes to /login */}
          <Route exact path="/">
            <SmartRedirect to="/manager" condition={!!user?.accessToken} />
            <SmartRedirect to="/login" condition={!user?.accessToken} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
