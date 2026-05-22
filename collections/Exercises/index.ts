import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { setFields } from '@/collections/Workouts';
import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { exerciseGroupsSlug, exercisesSlug } from '@/lib/collectionNames';
import { alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

const fieldOptions = setFields.map((field) => {
  return {
    value: field.name,
    label: alwaysString(field.label),
  };
});

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
    {
      name: exerciseFieldConfig.group,
      label: fieldLabels.exerciseGroup.singular.nominative,
      type: 'relationship',
      relationTo: exerciseGroupsSlug,
    },
    {
      name: exerciseFieldConfig.fields,
      label: fieldLabels.exerciseGroup.singular.nominative,
      type: 'select',
      hasMany: true,
      options: fieldOptions,
      defaultValue: [workoutFieldConfig.weight, workoutFieldConfig.repetitions],
    },
  ],
};
