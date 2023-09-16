/**
 * Parser is a type that can be used to validate and parse data.
 *
 * Ref:
 * - https://github.com/total-typescript/untypeable/blob/main/src/types.ts
 * - https://trpc.io/docs/server/validators#contributing-your-own-validator-library
 * - https://github.com/trpc/trpc/blob/main/packages/server/src/core/parser.ts
 * - https://github.com/trpc/trpc/blob/main/packages/server/src/core/internals/getParseFn.ts
 */

export type Parser<T> = ParserFallback<T> | ParserZodLike<T>;

export type ParserFallback<T> = (input: unknown) => T;
export type ParserZodLike<T> = {
  parse: (input: unknown) => T;
};