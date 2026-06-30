import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { daysSlug, workoutsSlug } from '@/lib/collectionNames';
import { alwaysArray, alwaysNumber } from '@/lib/commonUtils';
import { getDayId } from '@/lib/dateUtils';
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

  const days = await payload.find({
    collection: daysSlug,
    pagination: false,
    depth: 0,
    where: {},
  });

  let daysCounter = 0;
  for (const day of days.docs) {
    const { id } = day;
    const date = new Date(day.date).toISOString();
    await payload.update({
      collection: daysSlug,
      id,
      data: {
        date,
        dayId: getDayId(date),
      },
    });

    daysCounter++;
    console.log(`Updated ${daysCounter} days of ${days.totalDocs}`);
  }

  const workouts = await payload.find({
    collection: workoutsSlug,
    depth: 0,
    pagination: false,
  });

  let counter = 0;
  for (const workout of workouts.docs) {
    const { id, ...data } = workout;
    const date = new Date(data.date).toISOString();

    try {
      await payload.update({
        collection: workoutsSlug,
        id,
        data: {
          ...data,
          date,
          dayId: getDayId(date),
          sets: alwaysArray(data.sets).map((set) => {
            return {
              ...set,
              minutes: alwaysNumber(set?.minutes),
              incline: alwaysNumber(set?.incline),
              speed: alwaysNumber(set?.speed),
              distance: alwaysNumber(set?.distance),
              repetitions: alwaysNumber(set.repetitions),
              weight: alwaysNumber(set.weight),
            };
          }),
          createdAt: addMinutes(workout.createdAt, 1).toISOString(),
        },
      });
    } catch (error) {
      console.error({ error, d: data.date, date });
    }
    counter++;
    console.log(`Updated ${counter} workouts of ${workouts.totalDocs}`);
  }

  return (
    <ProtectedRoute>
      <OdTitle testId={'migrate-page'} breadcrumbs={[pageConfig]}>
        {title}
      </OdTitle>
    </ProtectedRoute>
  );
}
