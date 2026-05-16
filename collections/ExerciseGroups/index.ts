import { exerciseGroupFieldConfig } from '@/collections/ExerciseGroups/fieldConfig';
import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { exerciseGroupsSlug, exercisesSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const ExerciseGroups: CollectionConfig = {
  slug: exerciseGroupsSlug,
  labels: {
    singular: fieldLabels.exerciseGroup.singular.nominative,
    plural: fieldLabels.exerciseGroup.plural.nominative,
  },
  admin: {
    useAsTitle: exerciseGroupFieldConfig.label,
  },
  fields: [
    {
      name: exerciseGroupFieldConfig.label,
      label: fieldLabels.label.singular,
      type: 'text',
    },
    {
      name: exerciseGroupFieldConfig.exercises,
      label: fieldLabels.exercise.plural.nominative,
      type: 'join',
      collection: exercisesSlug,
      on: exerciseFieldConfig.group,
      defaultSort: exerciseFieldConfig.label,
      maxDepth: 2,
      defaultLimit: 1000,
    },
  ],
};
