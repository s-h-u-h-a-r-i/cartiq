import { Effect } from 'effect';
import {
  Accessor,
  createContext,
  createSignal,
  Match,
  onCleanup,
  onMount,
  ParentComponent,
  Switch,
  useContext,
} from 'solid-js';

import { run } from '@/app';
import { LoadingScreen } from '@/layout/loading-screen';
import { AuthUser } from './model';
import { Auth } from './service';
import SignInView from './sign-in-view';

interface AuthContext {
  readonly user: Accessor<AuthUser>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContext>();

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = createSignal(true);
  const [, setError] = createSignal<string | null>(null);

  const signInWithGoogle = () =>
    run(
      Auth.signInWithGoogle.pipe(
        Effect.map(() => ({ ok: true } as const)),
        Effect.catchAll((e) => Effect.succeed({ ok: false, message: e.message } as const))
      )
    );

  const signOut = () => run(Auth.signOut);

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    void run(
      Auth.observeUser(setUser, (e) => setError(e.message)).pipe(
        Effect.tap((unsub) =>
          Effect.sync(() => {
            unsubscribe = unsub;
          })
        ),
        Effect.ensuring(Effect.sync(() => setIsInitializing(false)))
      )
    );

    onCleanup(() => unsubscribe?.());
  });

  return (
    <Switch>
      <Match when={isInitializing()}>
        <LoadingScreen />
      </Match>

      <Match when={user() === null}>
        <SignInView onSignInWithGoogle={signInWithGoogle} />
      </Match>

      <Match when={user()}>
        {(u) => (
          <AuthContext.Provider value={{ user: u, signOut }}>{props.children}</AuthContext.Provider>
        )}
      </Match>
    </Switch>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(`${useAuth.name} must be used within ${AuthProvider.name}`);
  }
  return ctx;
}

