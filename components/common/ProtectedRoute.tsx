'use server';
import { protectedRoute } from '@/lib/payloadUtils';
import { redirect } from 'next/navigation';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectUrl?: string;
}

export default async function ProtectedRoute({ children, redirectUrl }: ProtectedRouteProps) {
  const { user } = await protectedRoute();

  if (!user) {
    redirect(redirectUrl || `/admin/login?redirect=/`);
  }

  return <>{children}</>;
}
