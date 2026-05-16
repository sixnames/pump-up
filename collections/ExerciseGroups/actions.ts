'use server';

import { exerciseGroupFieldConfig } from '@/collections/ExerciseGroups/fieldConfig';
import { getComboOptions } from '@/components/combobox/comboActions';
import { QueryComboOption } from '@/components/combobox/QueryCombo';
import { exerciseGroupsSlug } from '@/lib/collectionNames';
import { SORT_ASC_STR } from '@/lib/constants';
import { odSafeQuery } from '@/lib/safeAction';

export const getExerciseGroupOptions = odSafeQuery<QueryComboOption[], string | undefined>({
  key: 'getExerciseGroupOptions',
  action: async ({ payload, params }) => {
    return getComboOptions({
      payload,
      collectionName: exerciseGroupsSlug,
      query: params,
      searchableField: exerciseGroupFieldConfig.label,
      sortableField: exerciseGroupFieldConfig.label,
      sortDirection: SORT_ASC_STR,
    });
  },
});
