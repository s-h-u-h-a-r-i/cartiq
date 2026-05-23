export type AppUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type SignedInSession = {
  accessToken: string;
  user: AppUser;
};
