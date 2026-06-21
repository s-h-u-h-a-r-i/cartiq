import { Layer } from 'effect';

import { AppSession } from '@/session/session';

export const AppLayer = Layer.mergeAll(AppSession.Default);
