'use client';

import { getTodayDay } from '@/collections/Days/actions';
import OdButton from '@/components/buttons/OdButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import WorkoutsDate from '@/components/workout/WorkoutsDate';
import { getReadableDate } from '@/lib/dateUtils';
import { urlConfig } from '@/lib/urlUtils';
import { useProgress } from '@bprogress/next';
import { useQuery } from '@tanstack/react-query';
import { startOfToday } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MainPage() {
  const router = useRouter();
  const { start } = useProgress();
  const date = startOfToday().toISOString();
  const dayQuery = useQuery({
    queryKey: ['day', date],
    queryFn: async () => getTodayDay(date),
  });

  if (dayQuery.isLoading) {
    return <OdQueryLoader />;
  }

  const day = dayQuery.data;
  return (
    <div>
      <div className={'space-y-2 mb-6'}>
        <div>{getReadableDate({ date }).readableDate}</div>
        <OdButton
          onClick={() => {
            start();
            router.push(urlConfig.app.links.createWorkout.url);
          }}
        >
          {urlConfig.app.links.createWorkout.title}
        </OdButton>
      </div>
      {day ? <WorkoutsDate day={day} isOpen enableSuggestions /> : null}
    </div>
  );
}
