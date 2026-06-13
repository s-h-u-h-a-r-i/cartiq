import { Auth } from '@/auth/auth';
import { AuthMock } from '@/auth/auth-mock';

export const AppLayer = import.meta.env.MODE === 'mock' ? AuthMock : Auth.Default;
