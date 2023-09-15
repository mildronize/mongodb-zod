
import { Collection } from "mongodb";

/**
 * Ref: https://github.com/total-typescript/untypeable/blob/main/src/types.ts
 */
export type AcceptedParser<T> =
  | ((input: unknown) => T)
  | {
      parse: (input: unknown) => T;
    };

export type InferEntity<T> = T extends TypedMongoBase<infer U> ? U : never;

export type TypedMongoBase<TSchema extends Record<string, unknown>> = {
  schema: AcceptedParser<TSchema>;
  collection: Collection<TSchema>;
  parse: (data: unknown) => TSchema;
};
