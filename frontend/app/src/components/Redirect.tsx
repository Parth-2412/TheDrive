import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { User } from '../state/user';

interface SmartRedirectProps {
  to: string;
}

/**
 * Drop-in replacement for Redirect
 * Automatically navigates when rendered and reacts to state/prop changes
 */
const SmartRedirect: React.FC<SmartRedirectProps> = ({ to }) => {
  const history = useHistory();

  useEffect(() => {
    history.replace(to); // replace current route with destination
  }, [to, history]);

  return null; // renders nothing
};

export default SmartRedirect;