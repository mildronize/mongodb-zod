import { MongoClient, Db } from 'mongodb';
import { z } from 'zod';
import { MongoModel } from './mongo-Model';
import { Parser } from './parser';

/**
 * TODO: To publish as a package
 */
export class MongoModels<TModels extends Record<string, MongoModel<any>> = {}> {
  Models: TModels = {} as TModels;

  constructor(public readonly db: Db) {}

  add<TNewModel extends string, TSchema extends Record<string, unknown>>(
    collectionName: TNewModel,
    schema?: Parser<TSchema> | undefined
  ) {
    this.Models = {
      ...this.Models,
      [collectionName]: new MongoModel({
        collectionName,
        schema: schema ?? ({} as Parser<TSchema>),
      }),
    };
    return this as MongoModels<TModels & Record<TNewModel, MongoModel<TSchema>>>;
  }

}

/**
 * Example Usage
 */

export function testMongoModels() {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  const client = new MongoModels(db)
    // Add user collection
    .add<'users', { id: string }>('users')
    // Add posts collection
    .add(
      'posts',
      z.object({
        name: z.string(),
      })
    );

  const usersCollection = client.Models.users.collection;
  const postsCollection = client.Models.posts.collection;

  usersCollection.findOne({ id: '1' }).then(user => {
    user?.id;
  });

  const data = client.Models.users.parse({ id: '1' });
}
