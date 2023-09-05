import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const userEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  email: z.string().email(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;

// DTO

export const userDTOSchema = z.object({
  id: z.string(),
  name: userEntitySchema.shape.name,
  email: userEntitySchema.shape.email,
});

export type UserDTO = z.infer<typeof userDTOSchema>;

//   Util func

export const UserDTO = {
  convertFromEntity(entity: UserEntity): UserDTO {
    const candidate: UserDTO = {
      id: entity._id.toHexString(),
      name: entity.name,
      email: entity.email,
    };
    return userDTOSchema.parse(candidate);
  },
};
