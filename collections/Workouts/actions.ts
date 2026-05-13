'use server';

import { workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { TOAST_SUCCESS } from '@/lib/constants';
import { alwaysDate, getReadableDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { odSafeMutation, odSafeQuery } from '@/lib/safeAction';
import { Exercise, Workout } from '@/payload-types';
import { groupBy } from 'lodash';

export type WorkoutsList = Record<string, Workout[]>;

export const getWorkoutsList = odSafeQuery<WorkoutsList | null, void>({
  key: 'getWorkoutsList',
  action: async ({ user, payload }) => {
    if (!user) {
      return null;
    }
    const workouts = await payload.find({
      pagination: false,
      collection: workoutsSlug,
      where: {
        userId: {
          equals: user.id,
        },
      },
    });
    return groupBy(workouts.docs, (item) => {
      return getReadableDate({ date: item.date }).readableDate;
    });
  },
});

export const getWorkoutById = odSafeQuery<Workout | null, string>({
  key: 'getWorkoutById',
  action: async ({ params, user, payload }) => {
    if (!user) {
      return null;
    }
    return await payload.findByID({
      collection: workoutsSlug,
      id: params,
    });
  },
});

export const createWorkout = odSafeMutation<Workout, Partial<Workout>>({
  permissionPath: 'allow',
  key: 'createWorkout',
  action: async (params, { payload, user, messages }) => {
    const workout = await payload.create({
      collection: workoutsSlug,
      data: {
        userId: alwaysString(user?.id),
        exercise: (params.exercise as Exercise)?.id,
        date: alwaysDate(params.date).toISOString(),
        sets: alwaysArray(params.sets).map((set) => {
          return {
            ...set,
            repetitions: alwaysNumber(set.repetitions),
            weight: alwaysNumber(set.weight),
          };
        }),
      },
    });

    return {
      status: TOAST_SUCCESS,
      message: messages.create.success(fieldLabels.workout.singular),
      data: workout,
    };
  },
});

export const updateWorkout = odSafeMutation<Workout, Partial<Workout>>({
  permissionPath: 'allow',
  key: 'updateWorkout',
  action: async (params, { payload, user, messages }) => {
    const { id, ...values } = params;
    const workout = await payload.update({
      collection: workoutsSlug,
      id: alwaysString(id),
      data: {
        exercise: (values.exercise as Exercise)?.id,
        date: alwaysDate(values.date).toISOString(),
        userId: alwaysString(user?.id),
        sets: alwaysArray(params.sets).map((set) => {
          return {
            ...set,
            repetitions: alwaysNumber(set.repetitions),
            weight: alwaysNumber(set.weight),
          };
        }),
      },
    });

    return {
      status: TOAST_SUCCESS,
      message: messages.update.success(fieldLabels.workout.singular),
      data: workout,
    };
  },
});

export const deleteWorkout = odSafeMutation<null, string>({
  permissionPath: 'allow',
  key: 'deleteWorkout',
  action: async (params, { payload, messages }) => {
    await payload.delete({
      collection: workoutsSlug,
      id: alwaysString(params),
    });

    return {
      status: TOAST_SUCCESS,
      message: messages.delete.success(fieldLabels.workout.singular),
      data: null,
    };
  },
});
