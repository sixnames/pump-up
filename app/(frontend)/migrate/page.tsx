import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { workoutsSlug } from '@/lib/collectionNames';
import { getPD, protectedRoute } from '@/lib/payloadUtils';
import { urlConfig } from '@/lib/urlUtils';
import { addMinutes } from 'date-fns';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const pageConfig = urlConfig.app.links.migrate;

const title = pageConfig.title;

export const metadata: Metadata = {
  title,
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { user } = await protectedRoute();
  if (!user?.isAdmin) {
    redirect(`/`);
  }

  const payload = await getPD();
  const workouts = await payload.find({
    collection: workoutsSlug,
    depth: 0,
    pagination: false,
  });
  for (const workout of workouts.docs) {
    await payload.update({
      collection: workoutsSlug,
      id: workout.id,
      data: {
        createdAt: addMinutes(workout.createdAt, 1).toISOString(),
      },
    });
  }

  return (
    <ProtectedRoute>
      <OdTitle testId={'migrate-page'} breadcrumbs={[pageConfig]}>
        {title}
      </OdTitle>
    </ProtectedRoute>
  );
}
