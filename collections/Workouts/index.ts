import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { getWorkoutMetricValues } from '@/collections/Workouts/utils';
import { daysSlug, exercisesSlug, workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { Exercise, ExerciseGroup, Workout } from '@/payload-types';
import { startOfDay } from 'date-fns';
import type { CollectionConfig, NumberField, TextField } from 'payload';

export const setFields: (NumberField | TextField)[] = [
  {
    type: 'number',
    name: workoutFieldConfig.weight,
    label: fieldLabels.weight.singular,
  },
  {
    type: 'number',
    name: workoutFieldConfig.repetitions,
    label: fieldLabels.repetitions.singular,
  },
  {
    type: 'number',
    name: workoutFieldConfig.speed,
    label: fieldLabels.speed.singular,
  },
  {
    type: 'number',
    name: workoutFieldConfig.minutes,
    label: fieldLabels.minutes.singular,
  },
  {
    type: 'number',
    name: workoutFieldConfig.distance,
    label: fieldLabels.distance.singular,
  },
  {
    type: 'number',
    name: workoutFieldConfig.incline,
    label: fieldLabels.incline.singular,
  },
];

export const Workouts: CollectionConfig = {
  slug: workoutsSlug,
  labels: {
    singular: fieldLabels.workout.singular,
    plural: fieldLabels.workout.singular,
  },
  defaultSort: `-${workoutFieldConfig.date}`,
  timestamps: true,
  admin: {
    // hidden: true,
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        const payload = req.payload;
        const workout = data as Workout;
        let exercise = workout.exercise;
        if (typeof exercise === 'string') {
          exercise = await payload.findByID({
            collection: exercisesSlug,
            id: exercise,
          });
        }
        const exerciseGroup = exercise.group as ExerciseGroup;
        data.groupId = exerciseGroup?.id;

        const metrics = getWorkoutMetricValues(exercise, alwaysArray(workout.sets));
        data.metrics = metrics;
        const totalRating = metrics.reduce((acc: number, item) => {
          return acc + alwaysNumber(item.value);
        }, 0);
        data.rating = metrics.length < 1 ? 0 : totalRating / metrics.length;

        return data;
      },
    ],
    afterChange: [
      async ({ req, doc }) => {
        const payload = req.payload;
        const workout = doc as Workout;
        let exercise = workout.exercise;
        if (typeof exercise === 'string') {
          exercise = await payload.findByID({
            collection: exercisesSlug,
            id: exercise,
          });
        }
        const exerciseGroup = exercise.group as ExerciseGroup;

        const date = startOfDay(workout.date).toISOString();

        const days = await payload.find({
          collection: daysSlug,
          pagination: false,
          depth: 0,
          where: {
            userId: {
              equals: workout.userId,
            },
            date: {
              equals: date,
            },
          },
        });

        let day = days.docs[0];
        if (!day) {
          day = await payload.create({
            collection: daysSlug,
            depth: 0,
            data: {
              userId: workout.userId,
              date,
              exerciseGroups: [],
              workouts: [],
            },
          });
        }

        const exerciseGroupsSet = new Set(day.exerciseGroups as string[]);
        exerciseGroupsSet.add(exerciseGroup.id);

        const dayWorkoutsSet = new Set(alwaysArray(day.workouts) as string[]);
        dayWorkoutsSet.add(workout.id);

        await payload.update({
          collection: daysSlug,
          id: day.id,
          data: {
            exerciseGroups: Array.from(exerciseGroupsSet),
            workouts: Array.from(dayWorkoutsSet),
          },
        });
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const payload = req.payload;
        const workout = await payload.findByID({
          collection: workoutsSlug,
          id,
        });
        const date = startOfDay(workout.date).toISOString();

        const days = await payload.find({
          collection: daysSlug,
          pagination: false,
          depth: 2,
          where: {
            userId: {
              equals: workout.userId,
            },
            date: {
              equals: date,
            },
          },
        });

        const day = days.docs[0];
        if (!day) {
          return;
        }

        const prevWorkoutIds = alwaysArray(day.workouts);
        const workouts = prevWorkoutIds.filter((item) => {
          const dayWorkout = item as Workout;
          return dayWorkout.id !== workout.id;
        }) as Workout[];

        if (workouts.length < 1) {
          await payload.delete({
            collection: daysSlug,
            id: day.id,
          });
          return;
        }

        const exerciseGroupsSet = new Set<string>();
        workouts.forEach((item) => {
          const exercise = item.exercise as Exercise;
          const group = exercise.group as string;
          exerciseGroupsSet.add(group);
        });

        await payload.update({
          collection: daysSlug,
          id: day.id,
          data: {
            exerciseGroups: Array.from(exerciseGroupsSet),
            workouts: workouts.map(({ id }) => id),
          },
        });
      },
    ],
  },
  fields: [
    {
      type: 'text',
      name: workoutFieldConfig.userId,
      required: true,
      admin: { position: 'sidebar' },
      index: true,
    },
    {
      type: 'text',
      name: workoutFieldConfig.groupId,
      required: true,
      admin: { position: 'sidebar' },
      index: true,
    },
    {
      type: 'relationship',
      name: workoutFieldConfig.exercise,
      label: fieldLabels.exercise.singular.nominative,
      relationTo: exercisesSlug,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'number',
      name: workoutFieldConfig.rating,
      label: fieldLabels.rating.singular,
      defaultValue: 0,
    },
    {
      type: 'array',
      name: workoutFieldConfig.metrics,
      label: fieldLabels.metrics.singular,
      interfaceName: 'WorkoutMetrics',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          type: 'text',
          name: 'key',
        },
        {
          type: 'text',
          name: 'label',
        },
        {
          type: 'number',
          name: 'value',
        },
      ],
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
  ],
};
