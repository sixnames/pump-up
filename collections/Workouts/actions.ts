'use server';

import { exerciseGroupsSlug, exercisesSlug, workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { TOAST_SUCCESS } from '@/lib/constants';
import { alwaysDate, getAppStartOfDay, getReadableDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { odSafeMutation, odSafeQuery } from '@/lib/safeAction';
import { Exercise, Workout, WorkoutSets } from '@/payload-types';
import { groupBy, meanBy } from 'lodash';
import set from 'lodash/set';

export const getWorkoutsDateDescription = odSafeQuery<string, string[]>({
  key: 'getWorkoutsDateDescription',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return '';
    }

    const groups = await payload.find({
      pagination: false,
      collection: exerciseGroupsSlug,
      depth: 0,
      where: {
        id: {
          in: params,
        },
      },
      select: {
        label: true,
      },
    });

    const stringsSet = new Set<string>();

    groups.docs.forEach((group) => {
      stringsSet.add(group.label);
    });

    return Array.from(stringsSet).join(', ');
  },
});

interface GetWorkoutSuggestionsParams {
  groupIds: string[];
  addedExerciseIds: string[];
}

export const getWorkoutSuggestions = odSafeQuery<string[], GetWorkoutSuggestionsParams>({
  key: 'getWorkoutSuggestions',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return [];
    }

    if (params.addedExerciseIds.length < 1) {
      return [];
    }

    const exercises = await payload.find({
      pagination: false,
      collection: exercisesSlug,
      depth: 0,
      where: {
        group: {
          in: params.groupIds,
        },
      },
      select: {
        label: false,
        group: false,
        fields: false,
        createdAt: false,
        updatedAt: false,
      },
    });
    const exerciseIds = exercises.docs.map(({ id }) => id);

    const workoutsCollection = payload.db.collections[workoutsSlug];
    const doneWorkouts = await workoutsCollection.aggregate<{ exerciseId: string }>([
      {
        $match: {
          userId: user.id,
        },
      },
      {
        $set: {
          exerciseId: {
            $toString: '$exercise',
          },
        },
      },
      {
        $match: {
          exerciseId: {
            $in: exerciseIds,
            $nin: params.addedExerciseIds,
          },
        },
      },
      {
        $group: {
          _id: '$exerciseId',
        },
      },
      {
        $project: {
          _id: 0,
          exerciseId: '$_id',
        },
      },
    ]);

    const ids = doneWorkouts.map((item) => item.exerciseId);
    const suggestions = await payload.find({
      pagination: false,
      collection: exercisesSlug,
      depth: 0,
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        label: true,
      },
    });

    return suggestions.docs.map(({ label }) => alwaysString(label)).filter(Boolean);
  },
});

export const getWorkoutsOnDate = odSafeQuery<Workout[], string[]>({
  key: 'getWorkoutsOnDate',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return [];
    }
    const workouts = await payload.find({
      pagination: false,
      collection: workoutsSlug,
      where: {
        id: {
          in: params,
        },
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

export type WorkoutSet = NonNullable<WorkoutSets>[number];

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

    const fields = alwaysArray(exercise.fields);
    if (fields.length < 1) {
      return null;
    }

    const allSets = data.docs.reduce((acc: WorkoutSet[], workout) => {
      const currentSet = alwaysArray(workout.sets)[params.setIndex];
      if (!currentSet) {
        return acc;
      }

      return [...acc, currentSet];
    }, []);

    const result = {};

    fields.forEach((field) => {
      set(result, field, alwaysNumber(meanBy(allSets, field).toFixed(1)));
    });

    return result as WorkoutSet;
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
        date: alwaysDate(getAppStartOfDay(params.date)).toISOString(),
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
        date: alwaysDate(getAppStartOfDay(params.date)).toISOString(),
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
