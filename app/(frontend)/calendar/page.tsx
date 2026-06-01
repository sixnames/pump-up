import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import WorkoutsPage from '@/components/WorkoutsPage';
import { urlConfig } from '@/lib/urlUtils';
import type { Metadata } from 'next';

const pageConfig = urlConfig.app.links.calendar;

const title = pageConfig.title;

export const metadata: Metadata = {
  title,
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <ProtectedRoute>
      <OdTitle testId={'calendar-page'} breadcrumbs={[pageConfig]}>
        {title}
      </OdTitle>
      <WorkoutsPage />
    </ProtectedRoute>
  );
}
