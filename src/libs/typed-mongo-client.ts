import { MongoClient, Db, DbOptions } from 'mongodb';
import { AcceptedParser, TypedMongoEntity } from './type';
import { z } from 'zod';

function parseSchema<TSchema>(schema: AcceptedParser<TSchema>, data: unknown): TSchema {
  if (schema && 'parse' in schema) {
    return schema.parse(data);
  }
  if (schema) {
    return schema(data);
  }
  throw new Error('No schema provided');
}

/**
 * TODO: To publish as a package
 */
export class TypedMongoClient<TEntities extends Record<string, TypedMongoEntity<any>> = {}> {
  entities: TEntities = {} as TEntities;
  public readonly db: Db;

  /**
   *
   * @param mongoClient MongoClient
   * @param dbName - The name of the database we want to use. If not provided, use database name from connection string.
   * @param options - Optional settings for Db construction
   */
  constructor(mongoClient: MongoClient, dbName?: string, options?: DbOptions) {
    this.db = mongoClient.db(dbName, options);
  }

  addCollection<TNewEntity extends string, TSchema extends Record<string, unknown>>(
    collectionName: TNewEntity,
    schema?: AcceptedParser<TSchema> | undefined
  ) {
    this.entities = {
      ...this.entities,
      [collectionName]: {
        schema: schema ?? ({} as AcceptedParser<TSchema>),
        collection: this.db.collection<TSchema>(collectionName),
        parse: (data: unknown) => parseSchema(schema ?? ({} as AcceptedParser<TSchema>), data),
      },
    };
    return this as TypedMongoClient<TEntities & Record<TNewEntity, TypedMongoEntity<TSchema>>>;
  }
}

/**
 * Example Usage
 */

const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
const client = new TypedMongoClient(mongoClient)
  // Add user collection
  .addCollection<'users', { id: string }>('users')
  // Add posts collection
  .addCollection(
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
