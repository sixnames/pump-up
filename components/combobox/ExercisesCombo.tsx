'use client';

import { getExerciseOptions } from '@/collections/Exercises/actions';
import { QueryCombo, QueryComboConsumerSingleProps } from '@/components/combobox/QueryCombo';
import { exercisesSlug } from '@/lib/collectionNames';
import { alwaysArray } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { Exercise } from '@/payload-types';
import * as React from 'react';

interface ExercisesComboProps extends QueryComboConsumerSingleProps<Exercise> {
  groupId?: string;
}

export function ExercisesCombo({ selectedOption, groupId, ...props }: ExercisesComboProps) {
  return (
    <QueryCombo<Exercise>
      {...props}
      label={{
        label: fieldLabels.exercise.singular.nominative,
        required: true,
      }}
      selectedOptions={alwaysArray(selectedOption)}
      collectionName={exercisesSlug}
      queryFn={(query) => getExerciseOptions({ query, groupId })}
    />
  );
}
