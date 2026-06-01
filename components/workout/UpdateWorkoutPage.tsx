'use client';

import { updateWorkout } from '@/collections/Workouts/actions';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { Workout } from '@/payload-types';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateWorkoutPageProps {
  workout: Workout;
}

export default function UpdateWorkoutPage({ workout }: UpdateWorkoutPageProps) {
  const client = useQueryClient();
  const updateWorkoutMutation = useOdMutation({
    action: updateWorkout,
    redirectTo: () => {
      return '/';
    },
    onSuccessCallback: async () => {
      await client.invalidateQueries();
    },
  });

  return (
    <WorkoutForm
      initialValues={workout}
      onSubmit={async (values) => {
        await updateWorkoutMutation.mutateAsync(values);
      }}
    />
  );
}
