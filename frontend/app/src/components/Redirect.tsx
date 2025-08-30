import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../state/user';

interface SmartRedirectProps {
  to: string;
  condition?: boolean; // optional: only redirect if true
}

/**
 * Drop-in replacement for Redirect
 * Automatically navigates when rendered and reacts to state/prop changes
 */
const SmartRedirect: React.FC<SmartRedirectProps> = ({ to, condition = true }) => {
  const user = useRecoilValue(userState);
  const history = useHistory();

  useEffect(() => {
    if (!condition) return; // do not redirect if condition false
    if (user === 'loading') return; // wait for user to load

    history.replace(to); // replace current route with destination
  }, [to, condition, user, history]);

  return null; // renders nothing
};

export default SmartRedirect;