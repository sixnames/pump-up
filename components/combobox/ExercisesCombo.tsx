'use client';

import { getExerciseOptions } from '@/collections/Exercises/actions';
import { QueryCombo, QueryComboConsumerSingleProps } from '@/components/combobox/QueryCombo';
import { exercisesSlug } from '@/lib/collectionNames';
import { alwaysArray } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { Exercise } from '@/payload-types';
import * as React from 'react';

export function ExercisesCombo({ selectedOption, ...props }: QueryComboConsumerSingleProps<Exercise>) {
  return (
    <QueryCombo<Exercise>
      {...props}
      label={{
        label: fieldLabels.exercise.singular.nominative,
      }}
      selectedOptions={alwaysArray(selectedOption)}
      collectionName={exercisesSlug}
      queryFn={getExerciseOptions}
    />
  );
}
