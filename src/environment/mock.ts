import { Layer } from 'effect';

import { AuthMock } from '@/auth';
import { ProfileRepositoryMock } from '@/profile';

export const MODE = 'mock';

export const AppLayer = Layer.mergeAll(AuthMock, ProfileRepositoryMock);
