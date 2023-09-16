import { Db, MongoClient, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import { z } from 'zod';
import { getParserFn } from './getParserFn';
import { Parser } from './parser';

export interface MongoModelProp<TSchema extends Record<string, unknown>> {
  readonly collectionName: string;
  readonly schema?: Parser<TSchema> | undefined;
}

/**
 * Mongoose-like client for MongoDB
 * Ref: https://mongoosejs.com/
 */

class ModelOption {
  constructor(public skipValidation = false) {}
}

export class MongoModel<TSchema extends Record<string, unknown> = {}> {
  protected db!: Db;
  constructor(public prop: MongoModelProp<TSchema>) {}

  public parse(data: unknown): TSchema {
    const parseFn = getParserFn(this.prop.schema ?? ({} as Parser<TSchema>));
    return parseFn(data);
  }

  /**
   * Get Native MongoDB collection
   * Manage it by yourself
   */

  public get collection() {
    return this.db.collection<TSchema>(this.prop.collectionName);
  }

  public connect(db: Db) {
    this.db = db;
    return this;
  }

  public validate(data?: unknown, option?: ModelOption) {
    if (!this.db) {
      throw new Error(`MongoModelClient: You must call "connect" method before using this client`);
    }

    if (option?.skipValidation === false && data !== undefined) {
      this.parse(data);
    }
  }

  public findById(id: string) {
    this.validate();
    return this.collection.findOne({ _id: new ObjectId(id) as any });
  }

  public create(data: OptionalUnlessRequiredId<TSchema>, option: ModelOption = new ModelOption()) {
    this.validate(data, option);
    return this.collection.insertOne(data);
  }

  public update(id: string, data: Partial<TSchema>, option: ModelOption = new ModelOption()) {
    this.validate(data, option);
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: data },
      { returnDocument: 'after' }
    );
  }

  public delete(id: string) {
    this.validate();
    return this.collection.deleteOne({ _id: new ObjectId(id) as any });
  }
}

/**
 * Usage Example
 */

export function testMongoModel() {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  const userModel = new MongoModel({
    collectionName: 'users',
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
  }).connect(db);

  const data = userModel.parse({ name: 'John', age: 20 });
  userModel.collection.find({ name: 'John' });

  const postModel = new MongoModel<{ id: string }>({
    collectionName: 'posts',
  });
}
