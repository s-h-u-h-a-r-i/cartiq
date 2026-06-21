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
import { SessionProfileUpdateInput, SessionUser } from './model';
import { AppSession } from './session';
import SignInView from './sign-in-view';

interface AppSessionContext {
  readonly user: Accessor<SessionUser>;
  updateProfile(input: SessionProfileUpdateInput): Promise<void>;
  signOut(): Promise<void>;
}

const AppSessionContext = createContext();

export const AppSessionProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<SessionUser | null>(null);
  const [isInitializing, setIsInitializing] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const signInWithGoogle = () =>
    run(
      AppSession.signInWithGoogle.pipe(
        Effect.map(() => ({ ok: true } as const)),
        Effect.catchAll((e) => Effect.succeed({ ok: false, message: e.message } as const))
      )
    );

  const signOut = () => run(AppSession.signOut);

  const updateProfile = (input: SessionProfileUpdateInput) =>
    run(
      AppSession.updateProfile(user()!.id, input).pipe(
        Effect.tap((profile) =>
          Effect.sync(() =>
            setUser((current) =>
              current === null
                ? current
                : {
                    ...current,
                    ...profile,
                  }
            )
          )
        ),
        Effect.tap(() => Effect.sync(() => setError(null))),
        Effect.asVoid
      )
    );

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    void run(
      AppSession.observeSession(setUser, (e) => setError(e.message)).pipe(
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
          <AppSessionContext.Provider value={{ user: u, updateProfile, signOut }}>
            {props.children}
          </AppSessionContext.Provider>
        )}
      </Match>
    </Switch>
  );
};

export function useAppSession() {
  const ctx = useContext(AppSessionContext);
  if (!ctx) {
    throw new Error(`${useAppSession.name} must be used within ${AppSessionProvider.name}`);
  }
  return ctx;
}
