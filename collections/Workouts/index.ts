import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { exercisesSlug, workoutsSlug } from '@/lib/collectionNames';
import { fieldLabels } from '@/lib/fieldLabels';
import type { CollectionConfig, NumberField } from 'payload';

export const setFields: NumberField[] = [
  {
    type: 'number',
    name: workoutFieldConfig.weight,
    label: fieldLabels.weight.singular,
    required: true,
    defaultValue: 0,
  },
  {
    type: 'number',
    name: workoutFieldConfig.repetitions,
    label: fieldLabels.repetitions.singular,
    required: true,
    defaultValue: 0,
  },
  {
    type: 'number',
    name: workoutFieldConfig.speed,
    label: fieldLabels.speed.singular,
    required: true,
    defaultValue: 0,
  },
  {
    type: 'number',
    name: workoutFieldConfig.minutes,
    label: fieldLabels.minutes.singular,
    required: true,
    defaultValue: 0,
  },
  {
    type: 'number',
    name: workoutFieldConfig.distance,
    label: fieldLabels.distance.singular,
    required: true,
    defaultValue: 0,
  },
  {
    type: 'number',
    name: workoutFieldConfig.incline,
    label: fieldLabels.incline.singular,
    required: true,
    defaultValue: 0,
  },
];

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
      type: 'array',
      name: workoutFieldConfig.sets,
      required: true,
      interfaceName: 'WorkoutSets',
      fields: setFields,
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
