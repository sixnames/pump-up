'use server';

import { exerciseFieldConfig } from '@/collections/Exercises/fieldConfig';
import { getComboOptions } from '@/components/combobox/comboActions';
import { QueryComboOption } from '@/components/combobox/QueryCombo';
import { exercisesSlug } from '@/lib/collectionNames';
import { SORT_ASC_STR } from '@/lib/constants';
import { odSafeQuery } from '@/lib/safeAction';

export const getExerciseOptions = odSafeQuery<QueryComboOption[], string | undefined>({
  key: 'getExerciseOptions',
  action: async ({ payload, params }) => {
    return getComboOptions({
      payload,
      collectionName: exercisesSlug,
      query: params,
      searchableField: exerciseFieldConfig.label,
      sortableField: exerciseFieldConfig.label,
      sortDirection: SORT_ASC_STR,
    });
  },
});
