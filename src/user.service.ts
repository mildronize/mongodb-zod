import { MongoClient, Db, ObjectId, DbOptions } from 'mongodb';
import { UserEntity, userEntity } from './user.entity';
import { MongoEntity } from './libs';

export class UserService {
  constructor(public readonly db: Db, protected userEntity: MongoEntity<UserEntity>) {}

  async createUser(input: UserEntity) {
    const data = this.userEntity.parse(input);
    const { insertedId } = await this.userEntity.getCollection(this.db).insertOne(data);
    return insertedId;
  }
}
