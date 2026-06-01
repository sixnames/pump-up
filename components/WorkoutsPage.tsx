'use client';
import { getUserDays } from '@/collections/Days/actions';
import OdButton from '@/components/buttons/OdButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import WorkoutsDate from '@/components/workout/WorkoutsDate';
import { alwaysArray } from '@/lib/commonUtils';
import { urlConfig } from '@/lib/urlUtils';
import { useProgress } from '@bprogress/next';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function WorkoutsPage() {
  const router = useRouter();
  const { start } = useProgress();
  const { user } = useGlobalConfigContext();
  const getUserDaysQuery = useQuery({
    queryKey: ['getUserDays', user?.id],
    queryFn: () => getUserDays(),
    networkMode: 'always',
  });

  return (
    <div>
      <div className={'space-y-2 mb-6'}>
        <OdButton
          onClick={() => {
            start();
            router.push(urlConfig.app.links.createWorkout.url);
          }}
        >
          {urlConfig.app.links.createWorkout.title}
        </OdButton>
      </div>
      {getUserDaysQuery.isLoading ? <OdQueryLoader /> : null}
      {getUserDaysQuery.data ? (
        <div className={'pb-12 space-y-6'}>
          {alwaysArray(getUserDaysQuery.data).map((day, index) => {
            return <WorkoutsDate day={day} isOpen={index === 0} key={day.id} />;
          })}
        </div>
      ) : null}
    </div>
  );
}
