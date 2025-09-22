'use server';

import config from '@payload-config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

export async function getPD() {
  return getPayload({ config });
}

export async function protectedRoute() {
  const nextHeaders = await headers();
  const payload = await getPD();
  return payload.auth({ headers: nextHeaders });
}
