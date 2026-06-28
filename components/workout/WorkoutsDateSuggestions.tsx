import { getWorkoutSuggestions } from '@/collections/Workouts/actions';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { Badge } from '@/components/ui/badge';
import { urlConfig } from '@/lib/urlUtils';
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
    <div className={'mb-6'}>
      <div className={'font-bold mb-4'}>Ви робили:</div>
      <div className={'flex flex-wrap gap-4'}>
        {getWorkoutsDateDescriptionQuery.data.map((exercise) => {
          return (
            <Badge key={exercise.id} variant={'secondary'}>
              <a href={`${urlConfig.app.links.createWorkout.url}?exerciseId=${exercise.id}`}>{exercise.label}</a>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
