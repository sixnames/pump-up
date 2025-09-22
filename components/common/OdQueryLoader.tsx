import * as React from 'react';
import { BarLoader } from 'react-spinners';

interface OdQueryLoaderProps {}

export default function OdQueryLoader({}: OdQueryLoaderProps) {
  return (
    <div className={'flex justify-center items-center'}>
      <BarLoader color={'#e00101'} aria-label='Loading Spinner' />
    </div>
  );
}
