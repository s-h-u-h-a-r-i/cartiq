import { Layer } from 'effect';
import { DataMode } from './data-mode';

export const DataModeLive = Layer.succeed(DataMode, { mode: null });
