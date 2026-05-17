export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };

export type Result<T, E> = Ok<T> | Err<E>;

export type TaskResult<T, E> = () => Promise<Result<T, E>>;
type YieldableTaskResult<T, E> = Generator<TaskResult<T, E>, T, any>;

type ErrOf<TR> = TR extends TaskResult<any, infer E> ? E : never;

type YieldOf<G> = G extends Generator<infer Y, any, any> ? Y : never;
type ReturnOf<G> = G extends Generator<any, infer R, any> ? R : never;

const Result = {
  ok: <T>(value: T): Ok<T> => ({ ok: true, value }),
  err: <E>(error: E): Err<E> => ({ ok: false, error }),

  isOk: (result: Result<any, any>): result is Ok<any> => result.ok === true,
  isErr: (result: Result<any, any>): result is Err<any> => result.ok === false,
};

export const TaskResult = {
  succeed:
    <T>(value: T): TaskResult<T, never> =>
    async () =>
      Result.ok(value),

  fail:
    <E>(error: E): TaskResult<never, E> =>
    async () =>
      Result.err(error),

  fromPromise:
    <T, E>(_: { try: () => Promise<T>; catch: (reason: unknown) => E }): TaskResult<T, E> =>
    () =>
      _.try()
        .then((value) => Result.ok(value))
        .catch((reason) => Result.err(_.catch(reason))),

  gen:
    <G extends Generator<TaskResult<any, any>, any, any>>(
      make: () => G
    ): TaskResult<ReturnOf<G>, ErrOf<YieldOf<G>>> =>
    async () => {
      const it = make();
      let step = it.next();

      while (!step.done) {
        const r = await step.value();
        if (Result.isErr(r)) {
          return r;
        }
        step = it.next(r.value);
      }

      return Result.ok(step.value);
    },

  adapter: <T, E>(tr: TaskResult<T, E>): YieldableTaskResult<T, E> =>
    (function* () {
      return yield tr;
    })(),

  unwrap: async <T, E>(tr: TaskResult<T, E>): Promise<T> => {
    const r = await tr();
    if (Result.isErr(r)) throw r.error;
    return r.value;
  },

  unwrapOr: async <T, E>(tr: TaskResult<T, E>, fallback: T): Promise<T> => {
    const r = await tr();
    return Result.isOk(r) ? r.value : fallback;
  },

  match: async <T, E, R>(
    tr: TaskResult<T, E>,
    _: { ok: (value: T) => R; err: (error: E) => R }
  ): Promise<R> => {
    const r = await tr();
    return Result.isOk(r) ? _.ok(r.value) : _.err(r.error);
  },

  map:
    <T, E, R>(tr: TaskResult<T, E>, fn: (value: T) => R): TaskResult<R, E> =>
    async () => {
      const r = await tr();
      return Result.isErr(r) ? r : Result.ok(fn(r.value));
    },

  flatMap:
    <T, E, R, E2>(
      tr: TaskResult<T, E>,
      fn: (value: T) => TaskResult<R, E2>
    ): TaskResult<R, E | E2> =>
    async () => {
      const r = await tr();
      return Result.isErr(r) ? r : await fn(r.value)();
    },

  tap:
    <T, E>(tr: TaskResult<T, E>, fn: (value: T) => void): TaskResult<T, E> =>
    async () => {
      const r = await tr();
      if (Result.isErr(r)) return r;
      fn(r.value);
      return r;
    },

  mapErr:
    <T, E, E2>(tr: TaskResult<T, E>, fn: (error: E) => E2): TaskResult<T, E2> =>
    async () => {
      const r = await tr();
      return Result.isOk(r) ? r : Result.err(fn(r.error));
    },

  orElse:
    <T, E, E2>(tr: TaskResult<T, E>, fn: (error: E) => TaskResult<T, E2>): TaskResult<T, E2> =>
    async () => {
      const r = await tr();
      return Result.isOk(r) ? r : await fn(r.error)();
    },

  tapErr:
    <T, E>(tr: TaskResult<T, E>, fn: (error: E) => void): TaskResult<T, E> =>
    async () => {
      const r = await tr();
      if (Result.isOk(r)) return r;
      fn(r.error);
      return r;
    },
};
