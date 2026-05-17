export function getErrorMessage(error: unknown, message: string): string;
export function getErrorMessage(error: unknown, thunk: () => string): string;
export function getErrorMessage(error: unknown, messageOrThunk: string | (() => string)) {
  if (error instanceof Error) return error.message;
  if (typeof messageOrThunk === 'string') return messageOrThunk;
  return messageOrThunk();
}
