import {
  createContext,
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

import type { User } from '@supabase/supabase-js';

import { BlockingLoadGate } from '@/features/loading';
import { run } from '@/lib/runtime';
import { AuthService } from './auth.service';

const AuthSignInView = lazy(() => import('./components/auth-sign-in-view.component'));

interface AuthStore {
  user: Accessor<User>;
  signOutFromApp: () => Promise<void>;
}

const AuthContext = createContext<AuthStore>();

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [isInitializing, setIsInitializing] = createSignal(true);

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    void run(
      AuthService.listenToAuthChanges((nextSession) => {
        setUser(nextSession?.user ?? null);
        setIsInitializing(false);
      })
    ).then((unsub) => {
      unsubscribe = unsub;
    });

    onCleanup(() => void unsubscribe?.());
  });

  const isSignedOut = () => !isInitializing() && user() === null;

  return (
    <BlockingLoadGate isLoading={isInitializing()} loadingMessage='Checking session...'>
      <Switch>
        <Match when={isSignedOut()}>
          <AuthSignInView />
        </Match>
        <Match when={user()}>
          {(u) => (
            <AuthContext.Provider
              value={{
                user: u,
                signOutFromApp: () => run(AuthService.signOut),
              }}>
              {props.children}
            </AuthContext.Provider>
          )}
        </Match>
      </Switch>
    </BlockingLoadGate>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(`${useAuth.name} must be used within a ${AuthProvider.name}`);
  }
  return ctx;
}
