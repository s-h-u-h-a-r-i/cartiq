import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Effect, Option } from 'effect';

import { Supabase } from '@/supabase';
import { AuthError } from './error';
import { AuthUser, decodeAuthUser } from './model';

export class Auth extends Effect.Service<Auth>()('cartiq/Auth', {
  accessors: true,
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    const decodeNullableUser = (user: Parameters<typeof decodeAuthUser>[0] | null) =>
      Option.match(Option.fromNullable(user), {
        onNone: () => Effect.succeed(null),
        onSome: decodeAuthUser,
      });

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
            Effect.runFork(
              decodeNullableUser(session?.user ?? null).pipe(
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

const readAuthResponse = <T extends { readonly error: SupabaseAuthError | null }>(
  request: () => PromiseLike<T>
) =>
  Effect.tryPromise({
    try: request,
    catch: AuthError.fromUnknown,
  }).pipe(
    Effect.filterOrFail(
      (response) => response.error === null,
      (response) => AuthError.fromAuth(response.error!)
    )
  );

