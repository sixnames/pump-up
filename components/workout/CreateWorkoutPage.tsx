'use client';

import { getExerciseById } from '@/collections/Exercises/actions';
import { createWorkout } from '@/collections/Workouts/actions';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { getDayId } from '@/lib/dateUtils';
import { ExerciseGroup } from '@/payload-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ObjectId } from 'bson';
import { useQueryState } from 'nuqs';

export default function CreateWorkoutPage() {
  const client = useQueryClient();
  const [exerciseId] = useQueryState('exerciseId');
  const exerciseQuery = useQuery({
    queryKey: ['exercise', exerciseId],
    enabled: !!exerciseId,
    queryFn: async () => {
      if (!exerciseId) {
        return null;
      }
      return getExerciseById(exerciseId);
    },
  });
  const createWorkoutMutation = useOdMutation({
    action: createWorkout,
    redirectTo: () => {
      return '/';
    },
    onSuccessCallback: async () => {
      await client.invalidateQueries();
    },
  });

  if (exerciseQuery.isLoading && exerciseId) {
    return <OdQueryLoader />;
  }

  const exercise = exerciseQuery.data || undefined;
  const group = exercise?.group as ExerciseGroup | undefined;
  const date = new Date();
  const dayId = getDayId(date);

  return (
    <WorkoutForm
      initialValues={{
        date: date.toISOString(),
        dayId,
        exercise: exerciseQuery.data || undefined,
        sets: [
          {
            id: new ObjectId().toHexString(),
          },
        ],
        groupId: group?.id,
      }}
      onSubmit={async (values) => {
        await createWorkoutMutation.mutateAsync(values);
      }}
    />
  );
}
