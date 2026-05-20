import { Effect } from 'effect';

import { getSignInErrorMessage } from './auth.errors';
import { AuthService, type SignedInSession } from './auth.service';

const provideAuth = Effect.provide(AuthService.Default);

export const runSignIn = (
  onSuccess: (session: SignedInSession) => void,
  onError: (message: string) => void
): Promise<void> =>
  AuthService.signInWithGoogle.pipe(
    Effect.matchEffect({
      onSuccess: (session) => Effect.sync(() => onSuccess(session)),
      onFailure: (error) => Effect.sync(() => onError(getSignInErrorMessage(error))),
    }),
    provideAuth,
    Effect.runPromise
  );

export const runSignOut = (): Promise<void> =>
  AuthService.signOut.pipe(provideAuth, Effect.runPromise);
