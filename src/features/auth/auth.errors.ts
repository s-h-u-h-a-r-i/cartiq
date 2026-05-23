import { Data } from 'effect';

import { getErrorMessage } from '@/lib/errors';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly message: string;
  readonly code: string;
}> {}

const AUTH_ERROR_CODES = {
  POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  POPUP_BLOCKED: 'auth/popup-blocked',
  CANCELLED_POPUP_REQUEST: 'auth/cancelled-popup-request',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'auth/too-many-requests',
  USER_DISABLED: 'auth/user-disabled',
  INTERNAL_ERROR: 'auth/internal-error',
  NOT_CONFIGURED: 'auth/not-configured',
} as const;

const KNOWN_SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_CODES.POPUP_CLOSED_BY_USER]: 'Sign-in popup was closed before completion.',
  [AUTH_ERROR_CODES.POPUP_BLOCKED]: 'Popup was blocked. Please allow popups and try again.',
  [AUTH_ERROR_CODES.CANCELLED_POPUP_REQUEST]: 'Another sign-in popup is already open.',
  [AUTH_ERROR_CODES.NETWORK_REQUEST_FAILED]: 'Network error. Check your connection and try again.',
  [AUTH_ERROR_CODES.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Too many attempts. Please try again later.',
  [AUTH_ERROR_CODES.USER_DISABLED]: 'This account is currently disabled.',
  [AUTH_ERROR_CODES.NOT_CONFIGURED]: 'Sign-in is not configured yet.',
};

export const toAuthError = (reason: unknown, fallbackMessage: string): AuthError => {
  if (reason instanceof AuthError) {
    return reason;
  }

  if (reason instanceof Error) {
    return new AuthError({
      message: getErrorMessage(reason, fallbackMessage),
      code: AUTH_ERROR_CODES.INTERNAL_ERROR,
    });
  }

  return new AuthError({
    message: fallbackMessage,
    code: AUTH_ERROR_CODES.INTERNAL_ERROR,
  });
};

export const getSignInErrorMessage = (error: AuthError): string =>
  KNOWN_SIGN_IN_ERROR_MESSAGES[error.code] ?? 'Could not sign in with Google. Please try again.';
