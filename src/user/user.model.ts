import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { getDTOFromEntity } from '../libs/zod-extenstion';


export const userEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  email: z.string().email(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;

// DTO

const userDTOSchema = getDTOFromEntity(userEntitySchema);
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
