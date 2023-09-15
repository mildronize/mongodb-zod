import { Collection, Db, MongoClient } from 'mongodb';
import { AcceptedParser } from './type';
import { z } from 'zod';
import { parseSchema } from './utils';

export interface MongoEntityProp<TSchema extends Record<string, unknown>> {
  readonly collectionName: string;
  readonly schema?: AcceptedParser<TSchema> | undefined;
}

export class MongoEntity<TSchema extends Record<string, unknown>> {
  public readonly collection: Collection<TSchema>;
  constructor(protected db: Db, public prop: MongoEntityProp<TSchema>) {
    this.collection = this.db.collection<TSchema>(prop.collectionName);
  }

  public parse(data: unknown): TSchema {
    return parseSchema(this.prop.schema ?? ({} as AcceptedParser<TSchema>), data);
  }
}

/**
 * Usage Example
 */

function testMongoEntity() {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  const userEntity = new MongoEntity(db, {
    collectionName: 'users',
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
  });

  const data = userEntity.parse({ name: 'John', age: 20 });
  userEntity.collection.find({ name: 'John' });

  const postEntity = new MongoEntity<{ id: string }>(db, {
    collectionName: 'posts',
  });
}
