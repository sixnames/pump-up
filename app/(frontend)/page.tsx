import OdTitle from '@/components/common/OdTitle';
import MainPage from '@/components/main-page/MainPage';
import type { Metadata } from 'next';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const title = 'PUMP UP';

export const metadata: Metadata = {
  title,
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <ProtectedRoute>
      <OdTitle testId={'main-page'} breadcrumbs={[]}>
        {title}
      </OdTitle>
      <MainPage />
    </ProtectedRoute>
  );
}
