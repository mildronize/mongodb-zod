import { Db } from 'mongodb';
import { MongoModels } from './libs';
import { z } from 'zod';

export function setupSchema(db: Db) {
  const Models = new MongoModels(db)
    // Add user collection
    .add<'users', { id: string }>('users')
    // Add posts collection
    .add(
      'posts',
      z.object({
        name: z.string(),
      })
    );

  return Models;
}
