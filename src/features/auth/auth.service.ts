import { Effect } from 'effect';

import { Supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { supabaseErrorToAuthError } from './auth.errors';

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  accessors: true,
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      signInWithGoogle: Effect.promise(() =>
        supabase.auth.signInWithOAuth({ provider: 'google' })
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

      listenToAuthChanges: (onChange: (session: Session | null) => void) =>
        Effect.sync(() => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => void onChange(session));
          return () => subscription.unsubscribe();
        }),
    };
  }),
}) {}
