import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import { Effect } from 'effect';

import { Supabase } from '@/supabase';
import { supabaseErrorToAuthError, unknownToAuthError } from './auth.error';

export interface AuthUser {
  readonly id: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
}

export interface AuthSession {
  readonly user: AuthUser;
}

export class Auth extends Effect.Service<Auth>()('cartiq/Auth', {
  accessors: true,
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      getSession: Effect.tryPromise({
        try: () => supabase.auth.getSession(),
        catch: unknownToAuthError,
      }).pipe(
        Effect.flatMap(({ data, error }) =>
          error
            ? Effect.fail(supabaseErrorToAuthError(error))
            : Effect.succeed(data.session ? toAuthSession(data.session) : null)
        )
      ),

      signInWithGoogle: Effect.tryPromise({
        try: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
        catch: unknownToAuthError,
      }).pipe(
        Effect.flatMap(({ error }) =>
          error ? Effect.fail(supabaseErrorToAuthError(error)) : Effect.void
        )
      ),

      signOut: Effect.tryPromise({
        try: () => supabase.auth.signOut(),
        catch: unknownToAuthError,
      }).pipe(
        Effect.flatMap(({ error }) =>
          error ? Effect.fail(supabaseErrorToAuthError(error)) : Effect.void
        )
      ),

      observeSession: (onChange: (session: AuthSession | null) => void) =>
        Effect.sync(() => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            onChange(session ? toAuthSession(session) : null);
          });

          return () => subscription.unsubscribe();
        }),
    };
  }),
}) {}

function toAuthSession(session: SupabaseSession): AuthSession {
  return {
    user: toAuthUser(session.user),
  };
}

function toAuthUser(user: SupabaseUser): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: getStringMetadata(user, 'full_name'),
    avatarUrl: getStringMetadata(user, 'avatar_url'),
  };
}

function getStringMetadata(user: SupabaseUser, key: string) {
  const value = user.user_metadata[key];
  return typeof value === 'string' ? value : null;
}
