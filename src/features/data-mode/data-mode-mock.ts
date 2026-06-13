import { Layer } from 'effect';
import { DataMode } from './data-mode';

export const DataModeMock = Layer.succeed(DataMode, {
  mode: 'mock',
});
