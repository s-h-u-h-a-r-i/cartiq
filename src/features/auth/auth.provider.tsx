import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  createContext,
  createMemo,
  createSignal,
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
import { TaskResult } from '@/lib/result';
import { signOutGoogleSession } from './auth.service';

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
  const [user, setUser] = createSignal<User | null | undefined>(undefined);
  const [accessToken, setAccessToken] = createSignal<string | null>(null);

  onMount(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) setAccessToken(null);
    });

    onCleanup(unsubscribe);
  });

  const signOutFromApp = async () => {
    await TaskResult.unwrap(signOutGoogleSession);
    setUser(null);
    setAccessToken(null);
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
    <BlockingLoadGate isLoading={user() === undefined} loadingMessage='Checking session...'>
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
