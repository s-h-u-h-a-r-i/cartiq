import { Schema } from 'effect';

import { NullableString } from '@/shared/schema';
import { Tables, TablesUpdate } from '@/supabase/database.types';

type ProfileRow = Tables<'profiles'>;
type ProfileUpdateRow = TablesUpdate<'profiles'>;

const ProfileRowSchema = Schema.Struct({
  id: Schema.String,
  display_name: NullableString,
  avatar_url: NullableString,
  created_at: Schema.String,
  updated_at: Schema.String,
}) satisfies Schema.Schema<ProfileRow>;

export const Profile = Schema.transform(
  ProfileRowSchema,
  Schema.Struct({
    id: Schema.String,
    displayName: NullableString,
    avatarUrl: NullableString,
    createdAt: Schema.String,
    updatedAt: Schema.String,
  }),
  {
    strict: true,
    decode: (row) => ({
      id: row.id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
    encode: (profile) => ({
      id: profile.id,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt,
    }),
  }
);

export type Profile = Schema.Schema.Type<typeof Profile>;

const ProfileUpdateRowSchema = Schema.Struct({
  display_name: Schema.optional(NullableString),
  avatar_url: Schema.optional(NullableString),
}) satisfies Schema.Schema<ProfileUpdateRow>;

export const UpdateProfileInput = Schema.transform(
  ProfileUpdateRowSchema,
  Schema.Struct({
    displayName: Schema.optional(NullableString),
    avatarUrl: Schema.optional(NullableString),
  }),
  {
    strict: true,
    decode: (row) => ({
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    }),
    encode: (input) => ({
      ...('displayName' in input ? { display_name: input.displayName } : {}),
      ...('avatarUrl' in input ? { avatar_url: input.avatarUrl } : {}),
    }),
  }
);

export type UpdateProfileInput = Schema.Schema.Type<typeof UpdateProfileInput>;
