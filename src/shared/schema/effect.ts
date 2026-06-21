import { Effect, ParseResult, Schema } from 'effect';

export const NullableString = Schema.NullOr(Schema.String);

export const decodeMapTo =
  <B, BI, BR>(targetSchema: Schema.Schema<B, BI, BR>) =>
  <A, I, R, E = ParseResult.ParseError>(
    sourceSchema: Schema.Schema<A, I, R>,
    map: (value: A) => BI,
    mapError: (error: ParseResult.ParseError) => E = (e) => e as E
  ) =>
  (input: I) =>
    Schema.decode(sourceSchema)(input).pipe(
      Effect.map(map),
      Effect.flatMap(Schema.decode(targetSchema)),
      Effect.mapError(mapError)
    );

export const encodeMapTo =
  <B, BI, BR>(targetSchema: Schema.Schema<B, BI, BR>) =>
  <A, I, R, E = ParseResult.ParseError>(
    sourceSchema: Schema.Schema<A, I, R>,
    map: (value: I) => B,
    mapError: (error: ParseResult.ParseError) => E = (e) => e as E
  ) =>
  (input: A) =>
    Schema.encode(sourceSchema)(input).pipe(
      Effect.map(map),
      Effect.flatMap(Schema.encode(targetSchema)),
      Effect.mapError(mapError)
    );
