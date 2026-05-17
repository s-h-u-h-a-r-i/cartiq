import type { User } from 'firebase/auth';
import {
  createContext,
  createMemo,
  createSignal,
  Match,
  Switch,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

import { getErrorMessage } from '@/lib/errors';
import { signInWithGooglePopup, signOutGoogleSession } from './auth.service';

interface AuthSession {
  user: User;
  accessToken: string;
}

interface AuthStore {
  session: Accessor<AuthSession>;
  signOutFromApp(): Promise<void>;
}

const AuthStoreContext = createContext<AuthStore>();

export const AuthStoreProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [accessToken, setAccessToken] = createSignal<string | null>(null);
  const [error, setError] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError('');
    try {
      const session = await signInWithGooglePopup();
      setUser(session.user);
      setAccessToken(session.accessToken);
    } catch (signInError) {
      setError(getErrorMessage(signInError, 'Could not sign in right now.'));
    } finally {
      setIsLoading(false);
    }
  };

  const signOutFromApp = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signOutGoogleSession();
      setUser(null);
      setAccessToken(null);
    } catch (signOutError) {
      setError(getErrorMessage(signOutError, 'Could not sign out right now.'));
    } finally {
      setIsLoading(false);
    }
  };

  const session = createMemo(() => {
    const u = user();
    const at = accessToken();
    if (!u || !at) return null;

    return {
      user: u,
      accessToken: at,
    };
  });

  return (
    <Switch>
      <Match when={user() === null}>
        {/* Need to onboard user so create that in proper location */}
        {null}
      </Match>
      <Match when={session()}>
        {(session) => (
          <AuthStoreContext.Provider value={{ session, signOutFromApp }}>
            {props.children}
          </AuthStoreContext.Provider>
        )}
      </Match>
    </Switch>
  );
};

export function useAuthStore() {
  const ctx = useContext(AuthStoreContext);
  if (!ctx) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  return ctx;
}
