import { Effect } from 'effect';
import {
  Accessor,
  createContext,
  createSignal,
  lazy,
  Match,
  onCleanup,
  onMount,
  ParentComponent,
  Switch,
  useContext,
} from 'solid-js';

import { run } from '@/app';
import { LoadingScreen } from '@/layout';
import type { AuthSession, AuthUser } from './model';
import { Auth } from './service';
import { type SignInResult } from './sign-in-view';

const SignInView = lazy(() => import('./sign-in-view'));

interface AuthContext {
  readonly session: Accessor<AuthSession>;
  readonly user: Accessor<AuthUser>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContext>();

export const AuthProvider: ParentComponent = (props) => {
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(() => {
    let unsubscribe: () => void | undefined;

    void run(
      Effect.gen(function* () {
        const currentSession = yield* Auth.getSession;
        const stopObserving = yield* Auth.observeSession(setSession);

        unsubscribe = stopObserving;
        setSession(currentSession);
      }).pipe(
        Effect.catchAll((e) => Effect.sync(() => setError(e.message))),
        Effect.ensuring(
          Effect.sync(() => {
            setIsInitializing(false);
          })
        )
      )
    );

    onCleanup(() => unsubscribe?.());
  });

  const signInWithGoogle = (): Promise<SignInResult> =>
    run(
      Auth.signInWithGoogle.pipe(
        Effect.map(() => ({ ok: true }) as const),
        Effect.catchAll((e) => Effect.succeed({ ok: false, message: e.message } as const))
      )
    );

  const signOut = () => run(Auth.signOut);

  return (
    <Switch>
      <Match when={isInitializing()}>
        <LoadingScreen />
      </Match>

      <Match when={error()}>{(message) => <main>{message()}</main>}</Match>

      <Match when={session() === null}>
        <SignInView onSignInWithGoogle={signInWithGoogle} />
      </Match>

      <Match when={session()}>
        {(resolvedSession) => (
          <AuthContext.Provider
            value={{
              session: resolvedSession,
              user: () => resolvedSession().user,
              signOut,
            }}>
            {props.children}
          </AuthContext.Provider>
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
