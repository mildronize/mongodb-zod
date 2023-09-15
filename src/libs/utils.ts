import { AcceptedParser } from './type';

export function parseSchema<TSchema>(schema: AcceptedParser<TSchema>, data: unknown): TSchema {
  if (schema && 'parse' in schema) {
    return schema.parse(data);
  }
  if (schema) {
    return schema(data);
  }
  throw new Error('No schema provided');
}
