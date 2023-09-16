import { InferModel, MongoModel } from '../../libs';
import { z } from 'zod';

export const userModel = new MongoModel({
  collectionName: 'users',
  schema: z
    .object({
      name: z.string(),
      email: z.string(),
    })
    .partial()
    .strict(),
});

export type UserModel = InferModel<typeof userModel>;
