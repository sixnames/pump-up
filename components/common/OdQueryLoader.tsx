import { Spinner } from '@/components/ui/spinner';
import * as React from 'react';

interface OdQueryLoaderProps {}

export default function OdQueryLoader({}: OdQueryLoaderProps) {
  return (
    <div className={'flex justify-center items-center'}>
      <Spinner aria-label='Loading Spinner' />
    </div>
  );
}
