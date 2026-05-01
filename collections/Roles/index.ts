import { BooleanField } from '@/collections/commonFields';
import { getCreateAccess, getDeleteAccess, getReadAccess, getUpdateAccess } from '@/collections/Roles/utils';
import { rolesSlug } from '@/lib/collectionNames';
import { alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { CollectionConfig, Field } from 'payload';
import { roleFieldConfig } from './fieldConfig';
//
const ruleCollections = [
  {
    slug: rolesSlug,
    labels: fieldLabels.role,
  },
];

export const ruleCollectionSlugs = [rolesSlug] as const;

export const roleRuleActions = [
  {
    name: roleFieldConfig.create,
    label: fieldLabels.create.singular,
  },
  {
    name: roleFieldConfig.read,
    label: fieldLabels.read.singular,
  },
  {
    name: roleFieldConfig.update,
    label: fieldLabels.update.singular,
  },
  {
    name: roleFieldConfig.delete,
    label: fieldLabels.delete.singular,
  },
  {
    name: roleFieldConfig.generate,
    label: fieldLabels.generate.singular,
  },
] as const;

const booleanFields = roleRuleActions.map((item) => BooleanField(item));

const ruleCollectionFields: Field[] = ruleCollections.map((collection) => {
  return {
    name: collection.slug,
    type: 'group',
    interfaceName: 'RoleCollection',
    label: alwaysString(collection.labels?.plural),
    fields: booleanFields,
  };
});

export type RolePermissionSlug = (typeof ruleCollectionSlugs)[number];
export type RolePermissionOperation =
  'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'generate';

export const Roles: CollectionConfig = {
  slug: rolesSlug,
  labels: fieldLabels.role,
  access: {
    create: getCreateAccess(rolesSlug),
    read: getReadAccess(rolesSlug),
    update: getUpdateAccess(rolesSlug),
    delete: getDeleteAccess(rolesSlug),
  },
  admin: {
    group: fieldLabels.main.plural,
    useAsTitle: roleFieldConfig.label,
    listSearchableFields: [roleFieldConfig.label],
    defaultColumns: [roleFieldConfig.label],
  },
  fields: [
    {
      name: roleFieldConfig.label,
      label: fieldLabels.label.singular,
      type: 'text',
    },
    ...ruleCollectionFields,
  ],
};
