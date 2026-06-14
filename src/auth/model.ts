export interface AuthUser {
  readonly id: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
}

export interface AuthSession {
  readonly user: AuthUser;
}
