import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Theme variables */
import './global.css'
import './theme/variables.css';
import Manager from './pages/Manager';
import Login from './pages/Login';
import Register from './pages/Register';
setupIonicReact();

const App: React.FC = () => {

  let show = true;
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Login & Register routes */}
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>

          {/* Manager (protected area after login) */}
          <Route exact path="/manager">
            <Manager />
          </Route>

          {/* Default redirect: send unknown routes to /login */}
          <Redirect exact from="/" to="/Manager" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
