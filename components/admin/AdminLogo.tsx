import Logo from '@/components/common/Logo';
import React from 'react';

interface AdminLogoProps {}

export default function AdminLogo({}: AdminLogoProps) {
  return (
    <div className={'admin-logo'}>
      <div className={'admin-logo__icon-container'}>
        <Logo size={'xl'} />
      </div>
      <span className={'text-center font-semibold text-3xl'}>ONE DAY</span>
    </div>
  );
}
