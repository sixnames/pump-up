import { dayFieldConfig } from '@/collections/Days/fieldConfig';
import { daysSlug, exerciseGroupsSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const Days: CollectionConfig = {
  slug: daysSlug,
  labels: {
    singular: fieldLabels.day.singular.nominative,
    plural: fieldLabels.day.plural.nominative,
  },
  defaultSort: `-${dayFieldConfig.date}`,
  admin: {},
  fields: [
    {
      type: 'text',
      name: dayFieldConfig.userId,
      required: true,
    },
    {
      name: dayFieldConfig.date,
      type: 'date',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
      label: fieldLabels.date.singular,
      required: true,
    },
    {
      type: 'relationship',
      name: dayFieldConfig.exerciseGroups,
      label: fieldLabels.exerciseGroup.plural.nominative,
      relationTo: exerciseGroupsSlug,
      maxDepth: 0,
      required: true,
      hasMany: true,
    },
  ],
};
