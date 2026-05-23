import type { User } from '@supabase/supabase-js';
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

import { BlockingLoadGate } from '@/features/loading';
import { run } from '@/lib/runtime';
import { AuthService } from './auth.service';

const AuthSignInView = lazy(() => import('./components/AuthSignInView'));

interface AuthStore {
  user: Accessor<User>;
  signOutFromApp: () => Promise<void>;
}

const AuthStoreContext = createContext<AuthStore>();

export const AuthStoreProvider: ParentComponent = (props) => {
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
          {(activeUser) => (
            <AuthStoreContext.Provider
              value={{
                user: activeUser,
                signOutFromApp: () => run(AuthService.signOut),
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
