import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import env from '@/config/env';

const firebaseApp = initializeApp(env.firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
