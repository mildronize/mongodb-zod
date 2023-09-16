import { Db, MongoClient, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import { z } from 'zod';
import { getParserFn } from './getParserFn';
import { Parser } from './parser';

export interface MongoEntityProp<TSchema extends Record<string, unknown>> {
  readonly collectionName: string;
  readonly schema?: Parser<TSchema> | undefined;
}

/**
 * Mongoose-like client for MongoDB
 * Ref: https://mongoosejs.com/
 */

class EntityOption {
  constructor(public skipValidation = false) {}
}


export class MongoEntity<TSchema extends Record<string, unknown> = {}> {
  protected db!: Db;
  constructor(public prop: MongoEntityProp<TSchema>) {}

  public parse(data: unknown): TSchema {
    const parseFn = getParserFn(this.prop.schema ?? ({} as Parser<TSchema>));
    return parseFn(data);
  }

  public findById(id: string) {
    this.validate();
    return this.collection.findOne({ _id: new ObjectId(id) as any });
  }

  public create(data: OptionalUnlessRequiredId<TSchema>, option: EntityOption = new EntityOption()) {
    this.validate(data, option);
    return this.collection.insertOne(data);
  }

  public get collection() {
    return this.db.collection<TSchema>(this.prop.collectionName);
  }

  public build(db: Db) {
    this.db = db;
    return this;
  }

  public validate(data?: unknown, option?: EntityOption) {
    if (!this.db) {
      throw new Error(`MongoEntityClient: You must call "build" method before using this client`);
    }
  
    if (option?.skipValidation === false && data !== undefined) {
      this.parse(data);
    }
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
  }).build(db);

  const data = userEntity.parse({ name: 'John', age: 20 });
  userEntity.collection.find({ name: 'John' });

  const postEntity = new MongoEntity<{ id: string }>({
    collectionName: 'posts',
  });
}
