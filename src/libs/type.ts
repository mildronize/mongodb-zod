import { MongoEntity } from "./mongo-entity";

/**
 * Ref: https://github.com/total-typescript/untypeable/blob/main/src/types.ts
 */
export type AcceptedParser<T> =
  | ((input: unknown) => T)
  | {
      parse: (input: unknown) => T;
    };

export type InferEntity<T> = T extends MongoEntity<infer U> ? U : never;
