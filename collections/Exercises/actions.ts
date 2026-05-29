'use server';

import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { getComboOptions } from '@/components/combobox/comboActions';
import { QueryComboOption } from '@/components/combobox/QueryCombo';
import { exercisesSlug } from '@/lib/collectionNames';
import { alwaysString } from '@/lib/commonUtils';
import { SORT_ASC_STR } from '@/lib/constants';
import { odSafeQuery } from '@/lib/safeAction';
import { Exercise } from '@/payload-types';

interface GetExerciseOptionsParams {
  query?: string | null;
  groupId?: string;
}

export const getExerciseOptions = odSafeQuery<QueryComboOption[], GetExerciseOptionsParams>({
  key: 'getExerciseOptions',
  action: async ({ payload, params }) => {
    if (!params.groupId) {
      return [];
    }

    return getComboOptions({
      payload,
      collectionName: exercisesSlug,
      query: alwaysString(params.query),
      searchableField: exerciseFieldConfig.label,
      sortableField: exerciseFieldConfig.label,
      sortDirection: SORT_ASC_STR,
      additionalDbQuery: {
        group: {
          $eq: params.groupId,
        },
      },
    });
  },
});

export const getExerciseById = odSafeQuery<Exercise, string>({
  key: 'getExerciseById',
  action: async ({ payload, params }) => {
    return await payload.findByID({
      collection: exercisesSlug,
      id: params,
    });
  },
});
