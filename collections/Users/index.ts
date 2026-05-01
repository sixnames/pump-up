import { getAdminAccess } from '@/collections/Roles/utils';
import { userFieldConfig } from '@/collections/Users/fieldConfig';
import { rolesSlug, usersSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';
import { BooleanField } from '../commonFields';

export const Users: CollectionConfig = {
  slug: usersSlug,
  labels: fieldLabels.user,
  access: {
    create: getAdminAccess(),
    read: getAdminAccess(),
    update: getAdminAccess(),
    delete: getAdminAccess(),
  },
  admin: {
    group: fieldLabels.main.plural,
    useAsTitle: userFieldConfig.username,
    defaultColumns: [
      userFieldConfig.username,
      userFieldConfig.createdAt,
      userFieldConfig.updatedAt,
      userFieldConfig.isAdmin,
    ],
  },
  auth: {
    loginWithUsername: true,
    tokenExpiration: 28800,
  },
  fields: [
    {
      name: userFieldConfig.role,
      label: fieldLabels.role,
      type: 'relationship',
      relationTo: rolesSlug,
      saveToJWT: true,
    },
    BooleanField({
      name: userFieldConfig.isAdmin,
      label: fieldLabels.isAdmin.singular,
      defaultValue: false,
      saveToJWT: true,
    }),
  ],
};
