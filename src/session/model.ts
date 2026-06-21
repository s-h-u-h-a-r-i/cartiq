import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Schema } from 'effect';

import { decodeMapTo, encodeMapTo, NullableString } from '@/shared/schema';
import { Tables, TablesUpdate } from '@/supabase/database.types';
import { SessionError } from './error';

export type AuthUserSource = Pick<SupabaseUser, 'id' | 'email'>;

export type ProfileRow = Tables<'profiles'>;
export type ProfileUpdateRow = TablesUpdate<'profiles'>;

export type SessionAuth = Schema.Schema.Type<typeof SessionAuthSchema>;
export type SessionProfile = Schema.Schema.Type<typeof SessionProfileSchema>;
export type SessionProfileUpdateInput = Schema.Schema.Type<typeof SessionProfileUpdateInputSchema>;

export interface SessionUser extends SessionProfile {
  readonly email: string | null;
}

export const AuthUserSourceSchema = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
}) satisfies Schema.Schema<AuthUserSource>;

export const ProfileRowSchema = Schema.Struct({
  id: Schema.String,
  avatar_url: NullableString,
  created_at: Schema.String,
  display_name: NullableString,
  updated_at: Schema.String,
}) satisfies Schema.Schema<ProfileRow>;

export const ProfileUpdateRowSchema = Schema.Struct({
  display_name: Schema.optional(NullableString),
  avatar_url: Schema.optional(NullableString),
}) satisfies Schema.Schema<ProfileUpdateRow>;

export const SessionAuthSchema = Schema.Struct({
  id: Schema.String,
  email: NullableString,
});

export const SessionProfileSchema = Schema.Struct({
  id: Schema.String,
  displayName: NullableString,
  avatarUrl: NullableString,
  createdAt: Schema.String,
  updatedAt: Schema.String,
});

export const SessionProfileUpdateInputSchema = Schema.Struct({
  displayName: Schema.optional(NullableString),
  avatarUrl: Schema.optional(NullableString),
});

export const encodeSessionProfileUpdateInput = encodeMapTo(ProfileUpdateRowSchema)(
  SessionProfileUpdateInputSchema,
  (input) => ({
    ...(input.avatarUrl !== undefined && {
      avatar_url: input.avatarUrl,
    }),
    ...(input.displayName !== undefined && {
      display_name: input.displayName,
    }),
  }),
  SessionError.fromParse
);

export const decodeSessionAuth = decodeMapTo(SessionAuthSchema)(
  AuthUserSourceSchema,
  (input) => ({ id: input.id, email: input.email ?? null }),
  SessionError.fromParse
);

export const decodeSessionProfile = decodeMapTo(SessionProfileSchema)(
  ProfileRowSchema,
  (input) => ({
    id: input.id,
    displayName: input.display_name,
    avatarUrl: input.avatar_url,
    createdAt: input.created_at,
    updatedAt: input.updated_at,
  }),
  SessionError.fromParse
);
