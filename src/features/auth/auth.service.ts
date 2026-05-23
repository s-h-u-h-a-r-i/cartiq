import { Effect } from 'effect';

import { AuthError } from './auth.errors';

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  accessors: true,
  effect: Effect.succeed({
    signInWithGoogle: Effect.fail(
      new AuthError({
        message: 'Sign-in is not configured yet.',
        code: 'auth/not-configured',
      })
    ),
    signOut: Effect.void,
  }),
}) {}

export const AuthLive = AuthService.Default;
