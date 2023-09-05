import _ from 'lodash';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { UserService } from './user/user.service';

const main = async () => {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);

  try {
    await mongoClient.db().dropCollection('users');
  } catch (e) {
    if (_.get(e, 'codeName') !== 'NamespaceNotFound') {
      throw e;
    }
    console.log(`Collection "users" does not exist, no need to drop`);
  }

  await mongoClient.db().createCollection('users');

  const userService = new UserService(mongoClient);

  const createdUser = await userService.createUser({ name: 'example', email: 'example@example.com' });
  console.log({ createdUser });

  const updatedUser = await userService.updateUser(createdUser.id, { name: 'exampleX' });
  console.log({ updatedUser });

  const foundUser = await userService.findUser(createdUser.id);
  console.log({ foundUser });

  await userService.deleteUser(createdUser.id);
};

main()
  .then(() => {
    process.exit();
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
