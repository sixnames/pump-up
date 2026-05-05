import AddWorkoutPage from '@/components/AddWorkoutPage';
import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { urlConfig } from '@/lib/urlUtils';
import type { Metadata } from 'next';

const pageConfig = urlConfig.app.links.addWorkout;

const title = pageConfig.title;

export const metadata: Metadata = {
  title,
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <ProtectedRoute>
      <OdTitle testId={'add-workout-page'} breadcrumbs={[pageConfig]}>
        {title}
      </OdTitle>
      <AddWorkoutPage />
    </ProtectedRoute>
  );
}
