import { MongoClient, Db, ObjectId } from 'mongodb';
import { UserDTO, UserEntity, userEntitySchema } from './user.model';

export class UserService {
  private readonly db: Db;

  constructor(mongoClient: MongoClient) {
    this.db = mongoClient.db();
  }

  private getUsersCollection() {
    return this.db.collection<UserEntity>('users')
  }

  async findUser(id: string): Promise<UserDTO | null> {
    const entity = await this.getUsersCollection().findOne({ _id: new ObjectId(id) });
    return entity ? UserDTO.convertFromEntity(entity) : null;
  }

  async createUser(dto: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    const candidate = userEntitySchema.parse({
      ...dto,
      _id: new ObjectId(),
    });
    const { insertedId } = await this.getUsersCollection().insertOne(candidate);
    return UserDTO.convertFromEntity({ ...dto, _id: insertedId });
  }

  async updateUser(id: string, dto: Omit<Partial<UserDTO>, 'id'>): Promise<UserDTO | null> {
    const candidate = userEntitySchema.partial().parse(dto);

    const value = await this.getUsersCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: candidate },
      { returnDocument: 'after' }
    );
    return value ? UserDTO.convertFromEntity(value) : null;
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUsersCollection().deleteOne({ _id: new ObjectId(id) });
  }
}
