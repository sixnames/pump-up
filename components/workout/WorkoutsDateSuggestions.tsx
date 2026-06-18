import { getWorkoutSuggestions } from '@/collections/Workouts/actions';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface WorkoutsDateSuggestionsProps {
  groupIds: string[];
  enableSuggestions?: boolean;
  addedExerciseIds: string[];
}

export default function WorkoutsDateSuggestions({
  groupIds,
  enableSuggestions,
  addedExerciseIds,
}: WorkoutsDateSuggestionsProps) {
  const { user } = useGlobalConfigContext();
  const getWorkoutsDateDescriptionQuery = useQuery({
    queryKey: ['getWorkoutSuggestions', user?.id, groupIds, addedExerciseIds],
    queryFn: () =>
      getWorkoutSuggestions({
        groupIds,
        addedExerciseIds,
      }),
    enabled: Boolean(groupIds.length > 0 && enableSuggestions && addedExerciseIds.length > 0),
  });

  if (getWorkoutsDateDescriptionQuery.isLoading) {
    return <OdQueryLoader />;
  }

  if (!getWorkoutsDateDescriptionQuery.data) {
    return null;
  }

  if (getWorkoutsDateDescriptionQuery.data.length < 1) {
    return null;
  }

  return (
    <div className={''}>
      <div className={'font-bold mb-2'}>Ви робили:</div>
      <div className={'text-muted-foreground space-y-1'}>
        {getWorkoutsDateDescriptionQuery.data.map((item) => {
          return <div key={item}>{item}</div>;
        })}
      </div>
    </div>
  );
}
