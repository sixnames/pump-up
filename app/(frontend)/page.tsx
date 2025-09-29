import type { Metadata } from 'next';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const title = `Pump Up`;

export const metadata: Metadata = {
  title,
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <ProtectedRoute>
      <div className={'min-h-svh flex items-center justify-center'}>
        <div className={'flex flex-col gap-3'}>Home Page</div>
      </div>
    </ProtectedRoute>
  );
}
