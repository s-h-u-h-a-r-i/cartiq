import { Schema } from 'effect';

export const ProfileSchema = Schema.Struct({
  id: Schema.String,
  displayName: Schema.NullOr(Schema.String),
  avatarUrl: Schema.NullOr(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.NullOr(Schema.String),
});

export type Profile = Schema.Schema.Type<typeof ProfileSchema>;

const ProfileRowSchema = Schema.Struct({
  id: Schema.String,
  display_name: Schema.NullOr(Schema.String),
  avatar_url: Schema.NullOr(Schema.String),
  created_at: Schema.String,
  updated_at: Schema.NullOr(Schema.String),
});

export const ProfileRowTransformSchema = Schema.transform(ProfileRowSchema, ProfileSchema, {
  strict: true,
  decode: (profile) => ({
    id: profile.id,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }),
  encode: (profile) => ({
    id: profile.id,
    display_name: profile.displayName,
    avatar_url: profile.avatarUrl,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  }),
});
