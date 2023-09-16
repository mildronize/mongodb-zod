import { MongoClient, Db } from 'mongodb';
import { z } from 'zod';
import { MongoEntity } from './mongo-entity';
import { Parser } from './parser';

/**
 * TODO: To publish as a package
 */
export class MongoEntities<TEntities extends Record<string, MongoEntity<any>> = {}> {
  entities: TEntities = {} as TEntities;

  constructor(public readonly db: Db) {}

  add<TNewEntity extends string, TSchema extends Record<string, unknown>>(
    collectionName: TNewEntity,
    schema?: Parser<TSchema> | undefined
  ) {
    this.entities = {
      ...this.entities,
      [collectionName]: new MongoEntity({
        collectionName,
        schema: schema ?? ({} as Parser<TSchema>),
      }),
    };
    return this as MongoEntities<TEntities & Record<TNewEntity, MongoEntity<TSchema>>>;
  }

}

/**
 * Example Usage
 */

export function testMongoEntities() {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  const client = new MongoEntities(db)
    // Add user collection
    .add<'users', { id: string }>('users')
    // Add posts collection
    .add(
      'posts',
      z.object({
        name: z.string(),
      })
    );

  const usersCollection = client.entities.users.collection;
  const postsCollection = client.entities.posts.collection;

  usersCollection.findOne({ id: '1' }).then(user => {
    user?.id;
  });

  const data = client.entities.users.parse({ id: '1' });
}
