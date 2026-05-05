import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { exercisesSlug, workoutsSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig } from 'payload';

export const Workouts: CollectionConfig = {
  slug: workoutsSlug,
  labels: {
    singular: fieldLabels.workout.singular,
    plural: fieldLabels.workout.singular,
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      type: 'text',
      name: workoutFieldConfig.userId,
      required: true,
    },
    {
      name: workoutFieldConfig.date,
      type: 'date',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
      label: fieldLabels.date.singular,
      required: true,
    },
    {
      type: 'number',
      name: workoutFieldConfig.weight,
      required: true,
    },
    {
      type: 'number',
      name: workoutFieldConfig.workWeight,
      required: true,
    },
    {
      type: 'number',
      name: workoutFieldConfig.repetitions,
      required: true,
    },
    {
      type: 'relationship',
      name: workoutFieldConfig.exercise,
      label: fieldLabels.exercise.singular.nominative,
      relationTo: exercisesSlug,
      required: true,
    },
  ],
};
