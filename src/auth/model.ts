import { type User as SupabaseUser } from '@supabase/supabase-js';
import { z } from 'zod';

export type AuthUserSource = Pick<SupabaseUser, 'id' | 'email'>;

export const AuthUserSourceSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
}) satisfies z.ZodType<AuthUserSource>;

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AuthUserFromSourceSchema = AuthUserSourceSchema.transform(
  (user) =>
    ({
      id: user.id,
      email: user.email ?? null,
    }) satisfies AuthUser
);
