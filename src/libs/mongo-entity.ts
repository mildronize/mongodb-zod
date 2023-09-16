import { Db, MongoClient } from 'mongodb';
import { z } from 'zod';
import { getParserFn } from './getParserFn';
import { Parser } from './parser';

export interface MongoEntityProp<TSchema extends Record<string, unknown>> {
  readonly collectionName: string;
  readonly schema?: Parser<TSchema> | undefined;
}

export class MongoEntity<TSchema extends Record<string, unknown> = {}> {
  constructor(public prop: MongoEntityProp<TSchema>) {}

  public parse(data: unknown): TSchema {
    const parseFn = getParserFn(this.prop.schema ?? ({} as Parser<TSchema>));
    return parseFn(data);
  }

  public getCollection(db: Db) {
    return db.collection<TSchema>(this.prop.collectionName);
  }

}

/**
 * Usage Example
 */

function testMongoEntity() {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  const userEntity = new MongoEntity({
    collectionName: 'users',
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
  });

  const data = userEntity.parse({ name: 'John', age: 20 });
  userEntity.getCollection(db).find({ name: 'John' });

  const postEntity = new MongoEntity<{ id: string }>({
    collectionName: 'posts',
  });
}
