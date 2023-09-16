import { InferEntity, MongoEntity } from '../libs';
import { z } from 'zod';

export const userEntity = new MongoEntity({
  collectionName: 'users',
  schema: z
    .object({
      name: z.string(),
      email: z.string(),
    })
    .partial()
    .strict(),
});

export type UserEntity = InferEntity<typeof userEntity>;
