'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function OdSidebarTrigger() {
  return (
    <div className={'py-2 px-4'}>
      <SidebarTrigger tabIndex={-1} className={'cursor-pointer'} />
    </div>
  );
}
