import { Exercises } from '@/collections/Exercises';
import { Roles } from '@/collections/Roles';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { uk } from '@payloadcms/translations/languages/uk';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
export default buildConfig({
  admin: {
    user: Users.slug,
    dateFormat: 'dd.MM.yyyy HH:mm',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ['/components/admin/MainLink'],
      graphics: {
        Icon: '/components/common/Logo',
        Logo: '/components/admin/AdminLogo',
      },
    },
    autoRefresh: true,
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
          username: process.env.DEV_ADMIN_USERNAME,
          password: process.env.DEV_ADMIN_PASSWORD,
        }
        : false,
  },
  globals: [],
  collections: [Exercises, Roles, Users],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    autoGenerate: true,
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
    connectOptions: {
      dbName: process.env.MONGO_DB_NAME || '',
      ignoreUndefined: false,
    },
  }),
  plugins: [],
  i18n: {
    supportedLanguages: { uk },
    translations: {
      uk: {
        general: {
          false: '-',
          true: 'Так',
        },
      },
    },
  },
});
