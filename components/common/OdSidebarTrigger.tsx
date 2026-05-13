'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function OdSidebarTrigger() {
  return (
    <div className={'pt-4 px-4 md:hidden'}>
      <SidebarTrigger tabIndex={-1} className={'cursor-pointer'} />
    </div>
  );
}
