import { z } from 'zod';
import { MongoClient, Db, CollectionOptions, ObjectId, Collection, Document } from 'mongodb';

export function getDTOFromEntity<T extends z.ZodRawShape>(schema: z.ZodObject<T, any, any>) {
  return schema.omit({ _id: true }).merge(z.object({ id: z.string() }));
}

// export class TypeMongoCollection {
//   private readonly db: Db;

//   constructor(mongoClient: MongoClient) {
//     this.db = mongoClient.db();
//   }

//   /**
//    * Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
//    *
//    * @param name - the collection name we wish to access.
//    * @returns return the new Collection instance
//    */
//   collection<TSchema extends Document = Document>(
//     name: string,
//     options?: CollectionOptions | undefined
//   ): Collection<TSchema> {
//     return this.db.collection(name, options);
//   }
// }

// export const userEntitySchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   email: z.string().email(),
// });

// export type UserEntity = z.infer<typeof userEntitySchema>;

// // const b = new MongoClient('').db().collection<UserEntity>('sss');

// const a = new TypeMongoCollection(new MongoClient('')).collection<UserEntity>('user').findOne();
