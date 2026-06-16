import { Schema } from 'effect';

export const NullableString = Schema.NullOr(Schema.String);
