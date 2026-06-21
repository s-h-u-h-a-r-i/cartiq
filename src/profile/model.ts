import { Schema } from 'effect';

import { decodeMapTo, encodeMapTo, NullableString } from '@/shared/schema';
import { Tables, TablesUpdate } from '@/supabase/database.types';
import { ProfileError } from './error';

export type ProfileRow = Tables<'profiles'>;
export type ProfileUpdateRow = TablesUpdate<'profiles'>;

export type Profile = Schema.Schema.Type<typeof ProfileSchema>;
export type ProfileUpdateInput = Schema.Schema.Type<typeof ProfileUpdateInputSchema>;

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

export const ProfileSchema = Schema.Struct({
  id: Schema.String,
  displayName: NullableString,
  avatarUrl: NullableString,
  createdAt: Schema.String,
  updatedAt: Schema.String,
});

export const ProfileUpdateInputSchema = Schema.Struct({
  displayName: Schema.optional(NullableString),
  avatarUrl: Schema.optional(NullableString),
});

export const decodeProfile = decodeMapTo(ProfileSchema)(
  ProfileRowSchema,
  (input) => ({
    id: input.id,
    displayName: input.display_name,
    avatarUrl: input.avatar_url,
    createdAt: input.created_at,
    updatedAt: input.updated_at,
  }),
  ProfileError.fromParse
);

export const encodeProfileUpdateInput = encodeMapTo(ProfileUpdateRowSchema)(
  ProfileUpdateInputSchema,
  (input) => ({
    ...(input.avatarUrl !== undefined && {
      avatar_url: input.avatarUrl,
    }),
    ...(input.displayName !== undefined && {
      display_name: input.displayName,
    }),
  }),
  ProfileError.fromParse
);

