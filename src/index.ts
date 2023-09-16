import _ from 'lodash';
import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { UserService } from './user.service';
import { userEntity } from './user.entity';

async function prepareMongoCollection(db: Db) {
  try {
    await db.dropCollection('users');
  } catch (e) {
    if (_.get(e, 'codeName') !== 'NamespaceNotFound') {
      throw e;
    }
    console.log(`Collection "users" does not exist, no need to drop`);
  }
  // await db.createCollection('users');
}

const main = async () => {
  const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
  const db = mongoClient.db();
  await prepareMongoCollection(db);

  const userService = new UserService(db, userEntity);

  try {
    const userId = await userService.createUser({ name: 'example', email: 'example@example.com' });
    console.log({ userId });

    const foundUser = await userService.findUser(userId);
    console.log({ foundUser });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      // the error now is readable by the user
      // you may print it to console
      // or return it via an API
      console.log(validationError.message);
      process.exit(1);
    } else {
      throw err;
    }
  }

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
