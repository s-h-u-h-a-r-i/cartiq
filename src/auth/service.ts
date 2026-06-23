import { type AuthError as SupabaseAuthError } from '@supabase/supabase-js';

import { type AppSupabaseClient } from '@/supabase';
import { AuthError } from './error';
import { AuthUserFromSourceSchema, type AuthUser } from './model';

export class Auth {
  constructor(private readonly supabase: AppSupabaseClient) {}

  async signInWithGoogle(): Promise<void> {
    await this.readAuthResponse(() =>
      this.supabase.auth.signInWithOAuth({ provider: 'google' })
    );
  }

  async signOut(): Promise<void> {
    await this.readAuthResponse(() => this.supabase.auth.signOut());
  }

  observeUser(
    onChange: (user: AuthUser | null) => void,
    onError: (error: AuthError) => void
  ): () => void {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        onChange(null);
        return;
      }

      const result = AuthUserFromSourceSchema.safeParse(session.user);

      if (!result.success) {
        onError(AuthError.fromZod(result.error));
        return;
      }

      onChange(result.data);
    });

    return () => subscription.unsubscribe();
  }

  private async readAuthResponse<T extends { readonly error: SupabaseAuthError | null }>(
    request: () => PromiseLike<T>
  ): Promise<T> {
    let response: T;

    try {
      response = await request();
    } catch (error) {
      throw AuthError.fromUnknown(error);
    }

    if (response.error) {
      throw AuthError.fromAuth(response.error);
    }

    return response;
  }
}
