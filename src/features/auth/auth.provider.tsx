import {
  createContext,
  createMemo,
  createSignal,
  lazy,
  Match,
  Switch,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

import { BlockingLoadGate } from '@/features/loading';
import { run } from '@/lib/runtime';
import { AuthService } from './auth.service';
import type { AppUser, SignedInSession } from './auth.types';

const AuthSignInView = lazy(() => import('./components/AuthSignInView'));

interface AuthSession {
  user: AppUser;
  accessToken: string;
}

interface AuthStore {
  session: Accessor<AuthSession>;
  signOutFromApp: () => Promise<void>;
}

const AuthStoreContext = createContext<AuthStore>();

export const AuthStoreProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<AppUser | null>(null);
  const [accessToken, setAccessToken] = createSignal<string | null>(null);

  const applySignedInSession = (session: SignedInSession) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
  };

  const clearSession = () => {
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

  const isSignedOut = () => user() === null;
  const hasSession = () => Boolean(session());

  return (
    <BlockingLoadGate isLoading={false} loadingMessage='Checking session...'>
      <Switch>
        <Match when={isSignedOut()}>
          <AuthSignInView onSignedIn={applySignedInSession} />
        </Match>
        <Match when={hasSession() && session()}>
          {(activeSession) => (
            <AuthStoreContext.Provider
              value={{
                session: activeSession,
                signOutFromApp: async () => {
                  await run(AuthService.signOut);
                  clearSession();
                },
              }}>
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
