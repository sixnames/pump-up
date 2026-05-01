import 'dotenv/config';
import { usersSlug } from '@/lib/collectionNames';
import { createAdminUser } from '@/lib/helpers/createAdminUser';
import config from '@payload-config';
import { getPayload } from 'payload';

(async () => {
  const allowColdStart = process.env.ALLOW_COLD_START;
  if (allowColdStart !== 'true') {
    throw new Error('Cold start is not allowed');
  }

  const dbName = process.env.MONGO_DB_NAME;
  const uri = process.env.MONGODB_URI;

  if (!dbName || !uri) {
    throw new Error('Unable to connect to database, missing environment variables');
  }

  const payload = await getPayload({ config });

  const adminData = await payload.find({
    collection: usersSlug,
    where: {
      username: {
        equals: 'admin',
      },
    },
  });

  const admin = adminData.docs[0];

  if (!admin) {
    await createAdminUser();
  }

  console.log('Cold started');
  process.exit(0);
})();
