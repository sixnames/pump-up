import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { uk } from '@payloadcms/translations/languages/uk';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
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
  },
  collections: [Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      dbName: process.env.DATABASE_NAME || '',
      ignoreUndefined: false,
    },
  }),
  sharp,
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
