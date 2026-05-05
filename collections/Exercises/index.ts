import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { exercisesSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const Exercises: CollectionConfig = {
  slug: exercisesSlug,
  labels: fieldLabels.user,
  admin: {
    useAsTitle: exerciseFieldConfig.label,
  },
  fields: [
    {
      name: exerciseFieldConfig.label,
      label: fieldLabels.label.singular,
      type: 'text',
    },
  ],
};
