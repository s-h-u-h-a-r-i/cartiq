export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };

export type Result<T, E> = Ok<T> | Err<E>;

export type TaskResult<T, E> = () => Promise<Result<T, E>>;
type YieldableTaskResult<T, E> = Generator<TaskResult<T, E>, T, any>;
type AnyFn = (input: any) => any;

type ErrOf<TR> = TR extends TaskResult<any, infer E> ? E : never;

type YieldOf<G> = G extends Generator<infer Y, any, any> ? Y : never;
type ReturnOf<G> = G extends Generator<any, infer R, any> ? R : never;

const Result = {
  ok: <T>(value: T): Ok<T> => ({ ok: true, value }),
  err: <E>(error: E): Err<E> => ({ ok: false, error }),

  isOk: (result: Result<any, any>): result is Ok<any> => result.ok === true,
  isErr: (result: Result<any, any>): result is Err<any> => result.ok === false,
};

function pipe<A>(value: A): A;
function pipe<A, B>(value: A, ab: (value: A) => B): B;
function pipe<A, B, C>(value: A, ab: (value: A) => B, bc: (value: B) => C): C;
function pipe<A, B, C, D>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D
): D;
function pipe<A, B, C, D, E>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E
): E;
function pipe<A, B, C, D, E, F>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F
): F;
function pipe<A, B, C, D, E, F, G>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G
): G;
function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G,
  gh: (value: G) => H
): H;
function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G,
  gh: (value: G) => H,
  hi: (value: H) => I
): I;
function pipe<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G,
  gh: (value: G) => H,
  hi: (value: H) => I,
  ij: (value: I) => J
): J;
function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G,
  gh: (value: G) => H,
  hi: (value: H) => I,
  ij: (value: I) => J,
  jk: (value: J) => K
): K;
function pipe(value: unknown, ...fns: AnyFn[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

function map<T, E, R>(tr: TaskResult<T, E>, fn: (value: T) => R): TaskResult<R, E>;
function map<T, R>(fn: (value: T) => R): <E>(tr: TaskResult<T, E>) => TaskResult<R, E>;
function map<T, E, R>(
  trOrFn: TaskResult<T, E> | ((value: T) => R),
  maybeFn?: (value: T) => R
): TaskResult<R, E> | (<E2>(tr: TaskResult<T, E2>) => TaskResult<R, E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      return Result.isErr(r) ? r : Result.ok(fn(r.value));
    };
  }

  const fn = trOrFn as (value: T) => R;
  return <E2>(tr: TaskResult<T, E2>): TaskResult<R, E2> => map(tr, fn);
}

function tap<T, E, E2>(
  tr: TaskResult<T, E>,
  fn: (value: T) => TaskResult<void, E2>
): TaskResult<T, E | E2>;
function tap<T, E2>(
  fn: (value: T) => TaskResult<void, E2>
): <E>(tr: TaskResult<T, E>) => TaskResult<T, E | E2>;
function tap<T, E, E2>(
  trOrFn: TaskResult<T, E> | ((value: T) => TaskResult<void, E2>),
  maybeFn?: (value: T) => TaskResult<void, E2>
): TaskResult<T, E | E2> | (<E3>(tr: TaskResult<T, E3>) => TaskResult<T, E3 | E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      if (Result.isErr(r)) return r;
      const r2 = await fn(r.value)();
      if (Result.isErr(r2)) return r2;
      return r;
    };
  }

  const fn = trOrFn as (value: T) => TaskResult<void, E2>;
  return <E3>(tr: TaskResult<T, E3>): TaskResult<T, E3 | E2> => tap(tr, fn);
}

function match<T, E, R>(
  tr: TaskResult<T, E>,
  _: { ok: (value: T) => R; err: (error: E) => R }
): TaskResult<R, never>;
function match<T, E, R>(_: {
  ok: (value: T) => R;
  err: (error: E) => R;
}): (tr: TaskResult<T, E>) => TaskResult<R, never>;
function match<T, E, R>(
  trOrMatchers: TaskResult<T, E> | { ok: (value: T) => R; err: (error: E) => R },
  maybeMatchers?: { ok: (value: T) => R; err: (error: E) => R }
): TaskResult<R, never> | ((tr: TaskResult<T, E>) => TaskResult<R, never>) {
  if (maybeMatchers) {
    const tr = trOrMatchers as TaskResult<T, E>;
    const matchers = maybeMatchers;
    return async () => {
      const r = await tr();
      return Result.isOk(r) ? Result.ok(matchers.ok(r.value)) : Result.ok(matchers.err(r.error));
    };
  }

  const matchers = trOrMatchers as { ok: (value: T) => R; err: (error: E) => R };
  return (tr: TaskResult<T, E>): TaskResult<R, never> => match(tr, matchers);
}

function finallyTask<T, E, E2>(
  tr: TaskResult<T, E>,
  fn: () => TaskResult<void, E2>
): TaskResult<T, E | E2>;
function finallyTask<E2>(
  fn: () => TaskResult<void, E2>
): <T, E>(tr: TaskResult<T, E>) => TaskResult<T, E | E2>;
function finallyTask<T, E, E2>(
  trOrFn: TaskResult<T, E> | (() => TaskResult<void, E2>),
  maybeFn?: () => TaskResult<void, E2>
): TaskResult<T, E | E2> | (<T2, E3>(tr: TaskResult<T2, E3>) => TaskResult<T2, E3 | E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      const r2 = await fn()();
      if (Result.isErr(r2)) return r2;
      return r;
    };
  }

  const fn = trOrFn as () => TaskResult<void, E2>;
  return <T2, E3>(tr: TaskResult<T2, E3>): TaskResult<T2, E3 | E2> => finallyTask(tr, fn);
}

function flatMap<T, E, R, E2>(
  tr: TaskResult<T, E>,
  fn: (value: T) => TaskResult<R, E2>
): TaskResult<R, E | E2>;
function flatMap<T, R, E2>(
  fn: (value: T) => TaskResult<R, E2>
): <E>(tr: TaskResult<T, E>) => TaskResult<R, E | E2>;
function flatMap<T, E, R, E2>(
  trOrFn: TaskResult<T, E> | ((value: T) => TaskResult<R, E2>),
  maybeFn?: (value: T) => TaskResult<R, E2>
): TaskResult<R, E | E2> | (<E3>(tr: TaskResult<T, E3>) => TaskResult<R, E3 | E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      return Result.isErr(r) ? r : await fn(r.value)();
    };
  }

  const fn = trOrFn as (value: T) => TaskResult<R, E2>;
  return <E3>(tr: TaskResult<T, E3>): TaskResult<R, E3 | E2> => flatMap(tr, fn);
}

function mapErr<T, E, E2>(tr: TaskResult<T, E>, fn: (error: E) => E2): TaskResult<T, E2>;
function mapErr<E, E2>(fn: (error: E) => E2): <T>(tr: TaskResult<T, E>) => TaskResult<T, E2>;
function mapErr<T, E, E2>(
  trOrFn: TaskResult<T, E> | ((error: E) => E2),
  maybeFn?: (error: E) => E2
): TaskResult<T, E2> | (<T2>(tr: TaskResult<T2, E>) => TaskResult<T2, E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      return Result.isOk(r) ? r : Result.err(fn(r.error));
    };
  }

  const fn = trOrFn as (error: E) => E2;
  return <T2>(tr: TaskResult<T2, E>): TaskResult<T2, E2> => mapErr(tr, fn);
}

function orElse<T, E, E2>(
  tr: TaskResult<T, E>,
  fn: (error: E) => TaskResult<T, E2>
): TaskResult<T, E2>;
function orElse<T, E, E2>(
  fn: (error: E) => TaskResult<T, E2>
): (tr: TaskResult<T, E>) => TaskResult<T, E2>;
function orElse<T, E, E2>(
  trOrFn: TaskResult<T, E> | ((error: E) => TaskResult<T, E2>),
  maybeFn?: (error: E) => TaskResult<T, E2>
): TaskResult<T, E2> | ((tr: TaskResult<T, E>) => TaskResult<T, E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      return Result.isOk(r) ? r : await fn(r.error)();
    };
  }

  const fn = trOrFn as (error: E) => TaskResult<T, E2>;
  return (tr: TaskResult<T, E>): TaskResult<T, E2> => orElse(tr, fn);
}

function tapErr<T, E, E2>(
  tr: TaskResult<T, E>,
  fn: (error: E) => TaskResult<void, E2>
): TaskResult<T, E | E2>;
function tapErr<E, E2>(
  fn: (error: E) => TaskResult<void, E2>
): <T>(tr: TaskResult<T, E>) => TaskResult<T, E | E2>;
function tapErr<T, E, E2>(
  trOrFn: TaskResult<T, E> | ((error: E) => TaskResult<void, E2>),
  maybeFn?: (error: E) => TaskResult<void, E2>
): TaskResult<T, E | E2> | (<T2>(tr: TaskResult<T2, E>) => TaskResult<T2, E | E2>) {
  if (maybeFn) {
    const tr = trOrFn as TaskResult<T, E>;
    const fn = maybeFn;
    return async () => {
      const r = await tr();
      if (Result.isOk(r)) return r;
      const r2 = await fn(r.error)();
      if (Result.isErr(r2)) return r2;
      return r;
    };
  }

  const fn = trOrFn as (error: E) => TaskResult<void, E2>;
  return <T2>(tr: TaskResult<T2, E>): TaskResult<T2, E | E2> => tapErr(tr, fn);
}

const asVoid = <T, E>(tr: TaskResult<T, E>): TaskResult<void, E> => map(tr, () => undefined);

export const TaskResult = {
  pipe,

  succeed:
    <T>(value: T): TaskResult<T, never> =>
    async () =>
      Result.ok(value),

  fail:
    <E>(error: E): TaskResult<never, E> =>
    async () =>
      Result.err(error),

  sync:
    <T>(fn: () => T): TaskResult<T, never> =>
    async () =>
      Result.ok(fn()),

  tryAsync:
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

  match: match,

  map: map,

  flatMap: flatMap,

  tap: tap,

  mapErr: mapErr,

  orElse: orElse,

  tapErr: tapErr,

  finally: finallyTask,

  asVoid,
};
