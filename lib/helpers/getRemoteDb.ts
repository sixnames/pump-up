import 'dotenv/config';
import { exerciseGroupsSlug, exercisesSlug, rolesSlug, usersSlug, workoutsSlug } from '@/lib/collectionNames';
import { MongoClient } from 'mongodb';

(async () => {
  const remoteDbName = process.env.REMOTE_DB_NAME;
  const dbName = process.env.MONGO_DB_NAME;
  const uri = process.env.MONGODB_URI;

  if (!dbName || !uri) {
    throw new Error('Unable to connect to database, missing environment variables');
  }

  const client = await MongoClient.connect(`${uri}`);
  const remoteDb = client.db(remoteDbName);
  const db = client.db(dbName);

  async function seedCollection(collectionName: string) {
    await db.collection(collectionName).deleteMany({});
    const docs = await remoteDb.collection(collectionName).find({}).toArray();
    if (docs.length === 0) {
      return;
    }
    await db.collection(collectionName).insertMany(docs);
  }

  const collections = [usersSlug, rolesSlug, exercisesSlug, exerciseGroupsSlug, workoutsSlug];

  for (const collection of collections) {
    console.log(`Seeding ${collection} collection`);
    await seedCollection(collection);
  }

  console.log('Remote database copied');
  process.exit(0);
})();
