import { Db, ObjectId } from 'mongodb';
import { UserEntity } from './user.entity';
import { MongoEntity } from './libs';

export class UserService {
  constructor(public readonly db: Db, protected userEntity: MongoEntity<UserEntity>) {}

  get userCollection() {
    return this.userEntity.getCollection(this.db);
  }

  async createUser(input: UserEntity) {
    const data = this.userEntity.parse(input);
    const { insertedId } = await this.userCollection.insertOne(data);
    return insertedId.toString();
  }

  async findUser(id: string): Promise<UserEntity | null> {
    const entity = await this.userCollection.findOne({ _id: new ObjectId(id) });
    return entity;
  }
}
