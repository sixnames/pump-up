'use server';

import { workoutsSlug } from '@/lib/collectionNames';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { TOAST_SUCCESS } from '@/lib/constants';
import { alwaysDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { odSafeMutation } from '@/lib/safeAction';
import { Exercise, Workout } from '@/payload-types';

export const createWorkout = odSafeMutation<Workout, Partial<Workout>>({
  permissionPath: 'allow',
  key: 'createWorkout',
  action: async (params, { payload, user, messages }) => {
    const workout = await payload.create({
      collection: workoutsSlug,
      data: {
        exercise: (params.exercise as Exercise)?.id,
        date: alwaysDate(params.date).toISOString(),
        sets: alwaysNumber(params.sets),
        repetitions: alwaysNumber(params.repetitions),
        weight: alwaysNumber(params.weight),
        workWeight: alwaysNumber(params.workWeight),
        userId: alwaysString(user?.id),
      },
    });

    return {
      status: TOAST_SUCCESS,
      message: messages.create.success(fieldLabels.workout.singular),
      data: workout,
    };
  },
});
