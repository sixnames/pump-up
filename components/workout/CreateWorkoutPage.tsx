'use client';

import { createWorkout } from '@/collections/Workouts/actions';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { startOfDay } from 'date-fns';

export default function CreateWorkoutPage() {
  const createWorkoutMutation = useOdMutation({
    action: createWorkout,
    redirectTo: () => {
      return '/';
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
