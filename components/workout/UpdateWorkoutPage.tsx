'use client';

import { updateWorkout } from '@/collections/Workouts/actions';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { Workout } from '@/payload-types';

interface UpdateWorkoutPageProps {
  workout: Workout;
}

export default function UpdateWorkoutPage({ workout }: UpdateWorkoutPageProps) {
  const updateWorkoutMutation = useOdMutation({
    action: updateWorkout,
    redirectTo: () => {
      return '/';
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
