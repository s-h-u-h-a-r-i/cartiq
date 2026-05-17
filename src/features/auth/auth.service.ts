import { GoogleAuthProvider, type User, signInWithPopup, signOut } from 'firebase/auth';

import { getErrorMessage } from '@/lib/errors';
import { firebaseAuth } from '@/lib/firebase';
import { TaskResult } from '@/lib/result';

export type SignedInSession = {
  accessToken: string;
  user: User;
};

export class AuthError extends Error {
  code = 'auth/unknown' as const;

  constructor(message: string) {
    super(message);
  }
}

export const signInWithGooglePopup = TaskResult.gen(function* () {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/spreadsheets');
  provider.setCustomParameters({ prompt: 'consent' });

  const result = yield* TaskResult.adapter(
    TaskResult.fromPromise({
      try: () => signInWithPopup(firebaseAuth, provider),
      catch: (reason) => new AuthError(getErrorMessage(reason, 'Authentication failed.')),
    })
  );

  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) {
    return yield* TaskResult.adapter(
      TaskResult.fail(new AuthError('Google access token missing. Please sign in again.'))
    );
  }

  return {
    accessToken: token,
    user: result.user,
  };
});

export const signOutGoogleSession = TaskResult.fromPromise({
  try: () => signOut(firebaseAuth),
  catch: (reason) => new AuthError(getErrorMessage(reason, 'Authentication failed.')),
});
