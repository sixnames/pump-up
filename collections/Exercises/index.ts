import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { exercisesSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const Exercises: CollectionConfig = {
  slug: exercisesSlug,
  labels: {
    singular: fieldLabels.exercise.singular.nominative,
    plural: fieldLabels.exercise.plural.nominative,
  },
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
