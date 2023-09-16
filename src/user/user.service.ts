import { UserEntity } from './user.entity';
import { MongoEntity } from '../libs';

export class UserService {
  constructor(protected userEntity: MongoEntity<UserEntity>) {}

  get userCollection() {
    return this.userEntity.collection;
  }

  async createUser(input: UserEntity) {
    const { insertedId } = await this.userEntity.create(input);
    return insertedId.toString();
  }

  async findUser(id: string): Promise<UserEntity | null> {
    const data = await this.userEntity.findById(id);
    return data;
  }

  async updateUser(id: string, input: Partial<UserEntity>) {
    const value = await this.userEntity.update(id, input);
    return value;
  }

  async deleteUser(id: string) {
    return await this.userEntity.delete(id);
  }
}
