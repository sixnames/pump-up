import { BooleanField } from '@/collections/commonFields';
import { userFieldConfig } from '@/collections/Users/fieldConfig';
import { usersSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: usersSlug,
  labels: fieldLabels.user,
  admin: {
    group: fieldLabels.main.plural,
    useAsTitle: userFieldConfig.username,
    defaultColumns: [userFieldConfig.username, userFieldConfig.createdAt, userFieldConfig.updatedAt, userFieldConfig.isAdmin],
  },
  auth: {
    loginWithUsername: true,
  },
  fields: [
    BooleanField({
      name: userFieldConfig.isAdmin,
      label: fieldLabels.isAdmin.singular,
      defaultValue: false,
      saveToJWT: true,
    }),
  ],
};
