'use client';
import OdButton from '@/components/buttons/OdButton';
import { urlConfig } from '@/lib/urlUtils';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MainPage() {
  const router = useRouter();
  return (
    <div className={'space-y-2'}>
      <OdButton onClick={() => {
        router.push(urlConfig.app.links.addWorkout.url);
      }}>{urlConfig.app.links.addWorkout.title}</OdButton>
    </div>
  );
}
