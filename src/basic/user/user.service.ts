import { UserModel } from './user.model';
import { MongoModel } from '../../libs';

export class UserService {
  constructor(protected userModel: MongoModel<UserModel>) {}

  get userCollection() {
    return this.userModel.collection;
  }

  async createUser(input: UserModel) {
    const { insertedId } = await this.userModel.create(input);
    return insertedId.toString();
  }

  async findUser(id: string): Promise<UserModel | null> {
    const data = await this.userModel.findById(id);
    return data;
  }

  async updateUser(id: string, input: Partial<UserModel>) {
    const value = await this.userModel.update(id, input);
    return value;
  }

  async deleteUser(id: string) {
    return await this.userModel.delete(id);
  }
}
