import { z } from 'zod';

import { type Tables, type TablesUpdate } from '@/supabase/database.types';

export type ProfileRow = Tables<'profiles'>;
export type ProfileUpdateRow = TablesUpdate<'profiles'>;

export const ProfileRowSchema = z.object({
  id: z.string(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  display_name: z.string().nullable(),
  updated_at: z.string(),
}) satisfies z.ZodType<ProfileRow>;

export const ProfileUpdateRowSchema = z.object({
  display_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
}) satisfies z.ZodType<ProfileUpdateRow>;

export const ProfileSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileUpdateInputSchema = z.object({
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateInputSchema>;

export const ProfileFromRowSchema = ProfileRowSchema.transform(
  (row) =>
    ({
      id: row.id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }) satisfies Profile
);

export const ProfileUpdateToRowSchema = ProfileUpdateInputSchema.transform(
  (input) =>
    ({
      ...(input.avatarUrl !== undefined && {
        avatar_url: input.avatarUrl,
      }),
      ...(input.displayName !== undefined && {
        display_name: input.displayName,
      }),
    }) satisfies ProfileUpdateRow
);
