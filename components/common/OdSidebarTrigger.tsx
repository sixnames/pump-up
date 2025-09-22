'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function OdSidebarTrigger() {
  const pathname = usePathname();
  if (pathname === '/') {
    return null;
  }

  return (
    <div className={'py-2 px-4 md:px-6 lg:px-10'}>
      <SidebarTrigger />
    </div>
  );
}
