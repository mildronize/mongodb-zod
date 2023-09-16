import { Db, ObjectId } from 'mongodb';
import { UserEntity } from './user.entity';
import { MongoEntity } from './libs';

export class UserService {
  constructor(protected userEntity: MongoEntity<UserEntity>) {}

  get userCollection() {
    return this.userEntity.collection;
  }

  async createUser(input: UserEntity) {
    const data = this.userEntity.parse(input);
    // const { insertedId } = await this.userCollection.insertOne(data);
    const { insertedId } = await this.userEntity.create(data);
    return insertedId.toString();
  }

  async findUser(id: string): Promise<UserEntity | null> {
    // const entity = await this.userCollection.findOne({ _id: new ObjectId(id) });
    const data = await this.userEntity.findById(id);
    return data;
  }

  async updateUser(id: string, input: Partial<UserEntity>) {
    const data = this.userEntity.parse(input);
    const value = await this.userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    return value;
  }
}
