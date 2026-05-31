'use server';

import { getWorkoutMetricValues } from '@/collections/Workouts/utils';
import { workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { TOAST_SUCCESS } from '@/lib/constants';
import { alwaysDate, getAppDateKey, getAppDayRange, getReadableDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { odSafeMutation, odSafeQuery } from '@/lib/safeAction';
import { Exercise, ExerciseGroup, Workout, WorkoutSets } from '@/payload-types';
import { groupBy, orderBy, sumBy } from 'lodash';

export const getWorkoutDates = odSafeQuery<string[], void>({
  key: 'getWorkoutDates',
  action: async ({ user, payload }) => {
    if (!user) {
      return [];
    }
    const workouts = await payload.find({
      pagination: false,
      collection: workoutsSlug,
      where: {
        userId: {
          equals: user.id,
        },
      },
      select: {
        date: true,
      },
    });
    const groups = groupBy(workouts.docs, (item) => {
      return getAppDateKey(item.date);
    });
    return Object.keys(groups);
  },
});

export const getWorkoutsDateDescription = odSafeQuery<string, string>({
  key: 'getWorkoutsDateDescription',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return '';
    }
    const dateRange = getAppDayRange(params);
    if (!dateRange) {
      return '';
    }
    const workouts = await payload.find({
      pagination: false,
      collection: workoutsSlug,
      depth: 2,
      where: {
        and: [
          {
            userId: {
              equals: user.id,
            },
          },
          {
            date: {
              less_than: dateRange.end,
            },
          },
          {
            date: {
              greater_than_equal: dateRange.start,
            },
          },
        ],
      },
      select: {
        exercise: true,
      },
    });

    const stringsSet = new Set<string>();

    workouts.docs.forEach((workout) => {
      const exercise = workout.exercise as Exercise | undefined;
      if (!exercise) {
        return;
      }
      const group = exercise.group as ExerciseGroup | undefined;
      if (!group) {
        return;
      }
      stringsSet.add(group.label);
    });

    return Array.from(stringsSet).join(', ');
  },
});

export const getWorkoutsOnDate = odSafeQuery<Workout[], string>({
  key: 'getWorkoutsOnDate',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return [];
    }
    const dateRange = getAppDayRange(params);
    if (!dateRange) {
      return [];
    }
    const workouts = await payload.find({
      pagination: false,
      collection: workoutsSlug,
      where: {
        and: [
          {
            userId: {
              equals: user.id,
            },
          },
          {
            date: {
              less_than: dateRange.end,
            },
          },
          {
            date: {
              greater_than_equal: dateRange.start,
            },
          },
        ],
      },
    });
    return alwaysArray(workouts.docs);
  },
});

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

export type WorkoutSet = NonNullable<WorkoutSets>[number] & {
  rating: number;
};

export interface GetBestSimilarWorkoutParams {
  exerciseId: string;
  setIndex: number;
}

export const getBestSimilarWorkout = odSafeQuery<WorkoutSet | null, GetBestSimilarWorkoutParams>({
  key: 'getBestSimilarWorkout',
  action: async ({ params, user, payload }) => {
    if (!user) {
      return null;
    }

    const data = await payload.find({
      collection: workoutsSlug,
      where: {
        userId: {
          equals: user.id,
        },
        exercise: {
          equals: params.exerciseId,
        },
      },
    });

    const firstWorkout = data.docs[0];
    if (!firstWorkout) {
      return null;
    }

    const exercise = firstWorkout.exercise as Exercise;
    if (!exercise) {
      return null;
    }

    const allSets = orderBy(
      data.docs.reduce((acc: WorkoutSet[], workout) => {
        const currentSet = alwaysArray(workout.sets)[params.setIndex];
        if (!currentSet) {
          return acc;
        }

        const metrics = getWorkoutMetricValues(exercise, [currentSet]);
        const rating = sumBy(metrics, (metric) => alwaysNumber(metric.value));
        return [
          ...acc,
          {
            ...currentSet,
            rating,
          },
        ];
      }, []),
      ['rating'],
      ['desc'],
    );

    return allSets[0] || null;
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
