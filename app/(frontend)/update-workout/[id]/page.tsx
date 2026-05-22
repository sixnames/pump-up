import { getWorkoutById } from '@/collections/Workouts/actions';
import OdNotFound from '@/components/common/OdNotFound';
import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import UpdateWorkoutPage from '@/components/workout/UpdateWorkoutPage';
import { getReadableDate } from '@/lib/dateUtils';
import { urlConfig } from '@/lib/urlUtils';
import { Exercise, Workout } from '@/payload-types';
import type { Metadata } from 'next';
import { cache } from 'react';

const pageConfig = urlConfig.app.links.updateWorkout;

const getPageData = cache((id: string) => {
  return getWorkoutById(id);
});

function getPageTitle(item?: Workout | null) {
  if (!item) {
    return '';
  }
  const exercise = item.exercise as Exercise;
  return `${exercise.label} ${getReadableDate({ date: item?.date }).readableDate}`;
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const day = await getPageData(id);

  return {
    title: getPageTitle(day),
  };
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = await getPageData(id);
  if (!item) {
    return <OdNotFound />;
  }

  return (
    <ProtectedRoute>
      <OdTitle testId={'update-workout-page'} breadcrumbs={[pageConfig]}>
        {getPageTitle(item)}
      </OdTitle>
      <UpdateWorkoutPage workout={item} />
    </ProtectedRoute>
  );
}
