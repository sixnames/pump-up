'use client';

import { getWorkoutById, updateWorkout } from '@/collections/Workouts/actions';
import OdNotFound from '@/components/common/OdNotFound';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useOdMutation } from '@/hooks/useOdMutation';
import { useQuery } from '@tanstack/react-query';

interface UpdateWorkoutPageProps {
  id: string;
}

export default function UpdateWorkoutPage({ id }: UpdateWorkoutPageProps) {
  const workoutQuery = useQuery({
    queryKey: ['workout', id],
    queryFn: async () => getWorkoutById(id),
  });
  const updateWorkoutMutation = useOdMutation({
    action: updateWorkout,
    redirectTo: () => {
      return '/';
    },
  });

  if (workoutQuery.isLoading) {
    return <OdQueryLoader />;
  }

  if (!workoutQuery.data) {
    return <OdNotFound />;
  }

  return (
    <WorkoutForm
      initialValues={workoutQuery.data}
      onSubmit={async (values) => {
        await updateWorkoutMutation.mutateAsync(values);
      }}
    />
  );
}
