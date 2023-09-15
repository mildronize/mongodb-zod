import _ from 'lodash';
import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';
import { UserService } from './user.service';
import { userEntity } from './user.entity';

async function prepareMongoCollection(db: Db) {
  // try {
  //   await db.dropCollection('users');
  // } catch (e) {
  //   if (_.get(e, 'codeName') !== 'NamespaceNotFound') {
  //     throw e;
  //   }
  //   console.log(`Collection "users" does not exist, no need to drop`);
  // }

  // await db.createCollection('users');
  // db.collection
}

const main = async () => {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  await prepareMongoCollection(db);

  const userService = new UserService(db, userEntity);

  const response = await userService.createUser({ name: 'example', email: 'example@example.com' });
  console.log(response);

  // const userService = new UserService(mongoClient);

  // const createdUser = await userService.createUser({ name: 'example', email: 'example@example.com' });
  // console.log({ createdUser });

  // const updatedUser = await userService.updateUser(createdUser.id, { name: 'exampleX' });
  // console.log({ updatedUser });

  // const foundUser = await userService.findUser(createdUser.id);
  // console.log({ foundUser });

  // await userService.deleteUser(createdUser.id);
};

main()
  .then(() => {
    process.exit();
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
