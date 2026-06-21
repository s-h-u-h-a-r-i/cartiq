import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Schema } from 'effect';

import { decodeMapTo, NullableString } from '@/shared/schema';
import { AuthError } from './error';

export type AuthUserSource = Pick<SupabaseUser, 'id' | 'email'>;

export type AuthUser = Schema.Schema.Type<typeof AuthUserSchema>;

export const AuthUserSourceSchema = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
}) satisfies Schema.Schema<AuthUserSource>;

export const AuthUserSchema = Schema.Struct({
  id: Schema.String,
  email: NullableString,
});

export const decodeAuthUser = decodeMapTo(AuthUserSchema)(
  AuthUserSourceSchema,
  (input) => ({ id: input.id, email: input.email ?? null }),
  AuthError.fromParse
);

