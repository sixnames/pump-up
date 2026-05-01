'use client';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

interface OdPageContainerProps {
  children: React.ReactNode;
}

export default function OdPageContainer({ children }: OdPageContainerProps) {
  const pathname = usePathname();
  return (
    <div
      className={cn('px-4', {
        'pb-4': pathname !== '/',
      })}
    >
      {children}
    </div>
  );
}
