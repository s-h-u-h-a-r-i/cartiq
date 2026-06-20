import { NullableString } from '@/shared/schema';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Schema } from 'effect';

type AuthUserSource = Pick<SupabaseUser, 'id' | 'email' | 'user_metadata'>;

export const AuthUserSource = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
  user_metadata: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
}) satisfies Schema.Schema<AuthUserSource>;

export const AuthUser = Schema.transform(
  AuthUserSource,
  Schema.Struct({
    id: Schema.String,
    email: NullableString,
    displayName: NullableString,
    avatarUrl: NullableString,
  }),
  {
    strict: true,
    decode: (user) => ({
      id: user.id,
      email: user.email ?? null,
      displayName: getStringMetadata(user.user_metadata, 'full_name'),
      avatarUrl: getStringMetadata(user.user_metadata, 'avatar_url'),
    }),
    encode: (user) => ({
      id: user.id,
      ...('email' in user && user.email !== null ? { email: user.email } : {}),
      user_metadata: {
        full_name: user.displayName,
        avatar_url: user.avatarUrl,
      },
    }),
  }
);

export type AuthUser = Schema.Schema.Type<typeof AuthUser>;

function getStringMetadata(metadata: Readonly<Record<string, unknown>>, key: string) {
  const value = metadata[key];
  return typeof value === 'string' ? value : null;
}
