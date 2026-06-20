import type { Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Effect, Schema } from 'effect';

import { Supabase } from '@/supabase';
import { AuthError, authErrorFromUnknown, failAuthFromParse, failAuthFromSupabase } from './error';
import { AuthUser } from './model';

export class Auth extends Effect.Service<Auth>()('cartiq/Auth', {
  accessors: true,
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      signInWithGoogle: readAuthResponse(() =>
        supabase.auth.signInWithOAuth({ provider: 'google' })
      ).pipe(Effect.asVoid),

      signOut: readAuthResponse(() => supabase.auth.signOut()).pipe(Effect.asVoid),

      observeUser: (
        onChange: (user: AuthUser | null) => void,
        onError: (error: AuthError) => void
      ) =>
        Effect.sync(() => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            void Effect.runPromise(
              decodeAuthUserFromSession(session).pipe(
                Effect.match({
                  onFailure: onError,
                  onSuccess: onChange,
                })
              )
            );
          });

          return () => subscription.unsubscribe();
        }),
    };
  }),
}) {}

interface AuthResponseWithError {
  readonly error: SupabaseAuthError | null;
}

const readAuthResponse = <T extends AuthResponseWithError>(request: () => PromiseLike<T>) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: request,
      catch: authErrorFromUnknown,
    });
    if (response.error) return yield* failAuthFromSupabase(response.error);
    return response;
  });

const decodeAuthUserFromSession = (session: Session | null) =>
  session === null
    ? Effect.succeed(null)
    : Schema.decode(AuthUser)(session.user).pipe(Effect.catchTag('ParseError', failAuthFromParse));
