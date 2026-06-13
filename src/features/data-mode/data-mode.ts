import { Context, Effect } from 'effect';

export class DataMode extends Context.Tag('cartiq/DataMode')<
  DataMode,
  { readonly mode: 'mock' | null }
>() {}

export const getDataMode = Effect.gen(function* () {
  const dataMode = yield* DataMode;
  return dataMode.mode;
});
