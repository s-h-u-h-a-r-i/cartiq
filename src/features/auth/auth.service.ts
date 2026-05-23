import { Effect } from 'effect';

import { Supabase, SupabaseLive } from '@/lib/supabase';
import { supabaseErrorToAuthError } from './auth.errors';

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  accessors: true,
  dependencies: [SupabaseLive],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      signInWithGoogle: Effect.promise(() =>
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      ).pipe(
        Effect.flatMap(({ error, data }) =>
          error ? Effect.fail(supabaseErrorToAuthError(error)) : Effect.succeed(data)
        )
      ),

      signOut: Effect.promise(() => supabase.auth.signOut()).pipe(
        Effect.flatMap((result) =>
          result.error ? Effect.fail(supabaseErrorToAuthError(result.error)) : Effect.void
        )
      ),
    };
  }),
}) {}

export const AuthLive = AuthService.Default;
