import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Theme variables */
import './theme/variables.css';
import Manager from './pages/Manager';

setupIonicReact();

const App: React.FC = () => {

  let show = true;
  return (
     show ? <Manager /> : <IonApp></IonApp>
  );
};

export default App;
