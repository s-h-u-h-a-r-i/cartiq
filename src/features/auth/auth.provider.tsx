import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  createContext,
  createMemo,
  createSignal,
  lazy,
  Match,
  onCleanup,
  onMount,
  Switch,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

import { BlockingLoadGate } from '@/features/loading';
import { firebaseAuth } from '@/lib/firebase';
import { runSignOut } from './auth.runner';
import type { SignedInSession } from './auth.service';

const AuthSignInView = lazy(() => import('./components/AuthSignInView'));

interface AuthSession {
  user: User;
  accessToken: string;
}

interface AuthStore {
  session: Accessor<AuthSession>;
  signOutFromApp: () => Promise<void>;
}

const AuthStoreContext = createContext<AuthStore>();

export const AuthStoreProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null | undefined>(undefined);
  const [accessToken, setAccessToken] = createSignal<string | null>(null);

  onMount(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setAccessToken(null);
        return;
      }

      const token = await nextUser.getIdToken();
      setAccessToken(token);
    });

    onCleanup(unsubscribe);
  });

  const applySignedInSession = (session: SignedInSession) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
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

  const isAuthPending = () => user() === undefined;
  const isSignedOut = () => user() === null;
  const hasSession = () => Boolean(session());

  return (
    <BlockingLoadGate isLoading={isAuthPending()} loadingMessage='Checking session...'>
      <Switch>
        <Match when={isSignedOut()}>
          <AuthSignInView onSignedIn={applySignedInSession} />
        </Match>
        <Match when={hasSession() && session()}>
          {(activeSession) => (
            <AuthStoreContext.Provider
              value={{ session: activeSession, signOutFromApp: runSignOut }}>
              {props.children}
            </AuthStoreContext.Provider>
          )}
        </Match>
      </Switch>
    </BlockingLoadGate>
  );
};

export function useAuthStore() {
  const ctx = useContext(AuthStoreContext);
  if (!ctx) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  return ctx;
}
