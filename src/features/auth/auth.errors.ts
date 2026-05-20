import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import { Data } from 'effect';

import { getErrorMessage } from '@/lib/errors';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly message: string;
  readonly code: string;
}> {}

const KNOWN_SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCodes.POPUP_CLOSED_BY_USER]: 'Sign-in popup was closed before completion.',
  [AuthErrorCodes.POPUP_BLOCKED]: 'Popup was blocked. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Another sign-in popup is already open.',
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Network error. Check your connection and try again.',
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Too many attempts. Please try again later.',
  [AuthErrorCodes.USER_DISABLED]: 'This account is currently disabled.',
};

export const toAuthError = (reason: unknown, fallbackMessage: string): AuthError => {
  if (reason instanceof FirebaseError) {
    return new AuthError({
      message: getErrorMessage(reason, fallbackMessage),
      code: reason.code,
    });
  }

  return new AuthError({
    message: fallbackMessage,
    code: AuthErrorCodes.INTERNAL_ERROR,
  });
};

export const getSignInErrorMessage = (error: AuthError): string =>
  KNOWN_SIGN_IN_ERROR_MESSAGES[error.code] ?? 'Could not sign in with Google. Please try again.';
