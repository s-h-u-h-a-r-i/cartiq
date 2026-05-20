import { Effect } from 'effect';
import {
  GoogleAuthProvider,
  type User,
  signOut as firebaseSignOut,
  signInWithPopup,
} from 'firebase/auth';

import { firebaseAuth } from '@/lib/firebase';
import { AuthError, toAuthError } from './auth.errors';

export type SignedInSession = {
  accessToken: string;
  user: User;
};

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  accessors: true,
  effect: Effect.gen(function* () {
    const signInWithGoogle = Effect.gen(function* () {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      provider.setCustomParameters({ prompt: 'consent' });

      const result = yield* Effect.tryPromise({
        try: () => signInWithPopup(firebaseAuth, provider),
        catch: (reason) => toAuthError(reason, 'Authentication failed.'),
      });

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        return yield* Effect.fail(
          new AuthError({
            message: 'Google access token missing. Please sign in again.',
            code: 'auth/missing-access-token',
          })
        );
      }

      return {
        accessToken: token,
        user: result.user,
      };
    });

    const signOut = Effect.tryPromise({
      try: () => firebaseSignOut(firebaseAuth),
      catch: (reason) => toAuthError(reason, 'Authentication failed.'),
    });

    return {
      signInWithGoogle: signInWithGoogle,
      signOut: signOut,
    };
  }),
}) {}
