import { GoogleAuthProvider, type User, signInWithPopup, signOut } from 'firebase/auth';

import { firebaseAuth } from '@/lib/firebase';

export type SignedInSession = {
  accessToken: string;
  user: User;
};

const buildGoogleProvider = (): GoogleAuthProvider => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/spreadsheets');
  provider.setCustomParameters({ prompt: 'consent' });
  return provider;
};

export const signInWithGooglePopup = async (): Promise<SignedInSession> => {
  const provider = buildGoogleProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) {
    throw new Error('Google access token missing. Please sign in again.');
  }

  return {
    accessToken: token,
    user: result.user,
  };
};

export const signOutGoogleSession = async (): Promise<void> => {
  await signOut(firebaseAuth);
};
