'use server';

import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { exerciseGroupsSlug, exercisesSlug, workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { SORT_DESC_STR, TOAST_SUCCESS } from '@/lib/constants';
import { alwaysDate, getReadableDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { odSafeMutation, odSafeQuery } from '@/lib/safeAction';
import { Exercise, ExerciseGroup, Workout, WorkoutSets } from '@/payload-types';
import { ObjectId } from 'bson';
import { groupBy, orderBy } from 'lodash';

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

export const getWorkoutSuggestions = odSafeQuery<Exercise[], GetWorkoutSuggestionsParams>({
  key: 'getWorkoutSuggestions',
  action: async ({ user, payload, params }) => {
    if (!user) {
      return [];
    }

    if (params.addedExerciseIds.length < 1) {
      return [];
    }

    const workoutsCollection = payload.db.collections[workoutsSlug];
    const doneWorkouts = await workoutsCollection.aggregate([
      {
        $match: {
          $and: [
            {
              _id: {
                $nin: params.addedExerciseIds.map((id) => new ObjectId(id)),
              },
            },
            {
              userId: {
                $eq: user.id,
              },
            },
            {
              groupId: {
                $in: params.groupIds,
              },
            },
          ],
        },
      },
      {
        $project: {
          exercise: true,
        },
      },
      {
        $group: {
          _id: '$exercise',
        },
      },
    ]);
    const exerciseIds = doneWorkouts.map((item) => item._id.toString());

    const exercises = await payload.find({
      collection: exercisesSlug,
      pagination: false,
      where: {
        id: {
          in: exerciseIds,
        },
      },
    });

    return exercises.docs;
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
      limit: 5,
      where: {
        userId: {
          equals: user.id,
        },
        exercise: {
          equals: params.exerciseId,
        },
      },
    });

    const workouts = orderBy(data.docs, workoutFieldConfig.rating, SORT_DESC_STR);
    const bestWorkout = workouts[0];
    const sets = alwaysArray(bestWorkout?.sets);
    const currentSet = sets[params.setIndex];

    return currentSet || null;
  },
});

export const createWorkout = odSafeMutation<Workout, Partial<Workout>>({
  permissionPath: 'allow',
  key: 'createWorkout',
  action: async (params, { payload, user, messages }) => {
    const exercise = params.exercise as Exercise;
    const group = exercise?.group as ExerciseGroup;

    const workout = await payload.create({
      collection: workoutsSlug,
      data: {
        userId: alwaysString(user?.id),
        exercise: exercise?.id,
        groupId: group?.id,
        date: alwaysDate(params.date).toISOString(),
        dayId: alwaysString(params.dayId),
        metrics: [],
        rating: 0,
        sets: alwaysArray(params.sets).map((set) => {
          return {
            ...set,
            minutes: alwaysNumber(set?.minutes),
            incline: alwaysNumber(set?.incline),
            speed: alwaysNumber(set?.speed),
            distance: alwaysNumber(set?.distance),
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
    const exercise = params.exercise as Exercise;
    const group = exercise?.group as ExerciseGroup;

    const workout = await payload.update({
      collection: workoutsSlug,
      id: alwaysString(id),
      data: {
        exercise: (values.exercise as Exercise)?.id,
        date: alwaysDate(params.date).toISOString(),
        dayId: alwaysString(params.dayId),
        userId: alwaysString(user?.id),
        groupId: group?.id,
        metrics: [],
        rating: 0,
        sets: alwaysArray(params.sets).map((set) => {
          return {
            ...set,
            minutes: alwaysNumber(set?.minutes),
            incline: alwaysNumber(set?.incline),
            speed: alwaysNumber(set?.speed),
            distance: alwaysNumber(set?.distance),
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
