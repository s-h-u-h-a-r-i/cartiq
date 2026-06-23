import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';

import { type AppSupabaseClient } from '@/supabase';
import { ProfileError } from './error';
import {
  ProfileFromRowSchema,
  type Profile,
  type ProfileRow,
} from './model';

export class ProfileRepository {
  constructor(private readonly supabase: AppSupabaseClient) {}

  async getProfile(userId: string): Promise<Profile> {
    const row = await this.readProfileResponse(() =>
      this.supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    );
    const result = ProfileFromRowSchema.safeParse(row);

    if (!result.success) {
      throw ProfileError.fromZod(result.error);
    }

    return result.data;
  }

  private async readProfileResponse(
    request: () => PromiseLike<PostgrestMaybeSingleResponse<ProfileRow>>
  ): Promise<ProfileRow> {
    let response: PostgrestMaybeSingleResponse<ProfileRow>;

    try {
      response = await request();
    } catch (error) {
      throw ProfileError.fromUnknown(error);
    }

    if (!response.success) {
      throw ProfileError.fromPostgrest(response.error);
    }

    if (response.data === null) {
      throw ProfileError.notFound();
    }

    return response.data;
  }
}
