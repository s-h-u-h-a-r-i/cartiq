import {
  type Accessor,
  createContext,
  createSignal,
  Match,
  onCleanup,
  onMount,
  type ParentComponent,
  Show,
  Switch,
  useContext,
} from 'solid-js';

import { LoadingScreen } from '@/layout/loading-screen';
import { AuthError } from './error';
import { type AuthUser } from './model';
import { type Auth } from './service';
import SignInView from './sign-in-view';

interface AuthContext {
  readonly user: Accessor<AuthUser>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContext>();

interface AuthProviderProps {
  readonly auth: Auth;
}

type AuthState =
  | { readonly status: 'initializing' }
  | { readonly status: 'signedOut' }
  | { readonly status: 'signedIn'; readonly user: AuthUser }
  | { readonly status: 'failed'; readonly error: AuthError };

export const AuthProvider: ParentComponent<AuthProviderProps> = (props) => {
  const [state, setState] = createSignal<AuthState>({
    status: 'initializing',
  });

  const isInitializing = () => state().status === 'initializing';
  const isSignedOut = () => state().status === 'signedOut';

  const user = () => {
    const current = state();
    return current.status === 'signedIn' ? current.user : null;
  };

  const error = () => {
    const current = state();
    return current.status === 'failed' ? current.error : null;
  };

  const authenticatedUser = (expectedUserId: string): AuthUser => {
    const current = state();

    if (current.status !== 'signedIn' || current.user.id !== expectedUserId) {
      throw new Error('Authenticated user is unavailable');
    }

    return current.user;
  };

  onMount(() => {
    const unsubscribe = props.auth.observeUser(
      (nextUser) => {
        setState(
          nextUser
            ? { status: 'signedIn', user: nextUser }
            : { status: 'signedOut' }
        );
      },
      (nextError) => {
        setState({ status: 'failed', error: nextError });
      }
    );

    onCleanup(unsubscribe);
  });

  return (
    <Switch>
      <Match when={isInitializing()}>
        <LoadingScreen />
      </Match>

      <Match when={error()}>
        {(authError) => <p role='alert'>{authError().message}</p>}
      </Match>

      <Match when={isSignedOut()}>
        <SignInView onSignInWithGoogle={() => props.auth.signInWithGoogle()} />
      </Match>

      <Match when={user() !== null}>
        <Show when={user()?.id} keyed>
          {(authenticatedUserId) => (
            <AuthContext.Provider
              value={{
                user: () => authenticatedUser(authenticatedUserId),
                signOut: () => props.auth.signOut(),
              }}>
              {props.children}
            </AuthContext.Provider>
          )}
        </Show>
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
