import { Parser } from "./parser";


export type ParseFn<TSchema> = (value: unknown) => TSchema

export function getParserFn<TSchema>(_parser: Parser<TSchema>): ParseFn<TSchema> {
  const parser = _parser as any;

  /**
   * Fallback parser function
   * Get parser function from schema `ParserFallback<T>`
   */
  if(typeof parser === 'function'){ 
    return parser;
  }

  /**
   * Zod-like parser function
   * Get parser function from schema `ParserZodLike<T>`
   */
  if(typeof parser.parse === 'function'){
    return parser.parse;
  }
  
  throw new Error('No available parser function found.');
}
