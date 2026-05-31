import OdTitle from '@/components/common/OdTitle';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { protectedRoute } from '@/lib/payloadUtils';
import { urlConfig } from '@/lib/urlUtils';
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

  return (
    <ProtectedRoute>
      <OdTitle testId={'migrate-page'} breadcrumbs={[pageConfig]}>
        {title}
      </OdTitle>
    </ProtectedRoute>
  );
}
