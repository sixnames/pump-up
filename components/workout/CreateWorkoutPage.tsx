'use client';

import { createWorkout } from '@/collections/Workouts/actions';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { useQueryClient } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';

export default function CreateWorkoutPage() {
  const client = useQueryClient();
  const createWorkoutMutation = useOdMutation({
    action: createWorkout,
    redirectTo: () => {
      return '/';
    },
    onSuccessCallback: async () => {
      await client.invalidateQueries();
    },
  });
  return (
    <WorkoutForm
      initialValues={{ date: startOfDay(new Date()).toISOString() }}
      onSubmit={async (values) => {
        await createWorkoutMutation.mutateAsync(values);
      }}
    />
  );
}
