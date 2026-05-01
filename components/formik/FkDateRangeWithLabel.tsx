import FkDatePicker from '@/components/formik/FkDatePicker';
import OdLabel, { OdLabelProps } from '@/components/forms/OdLabel';
import { cn } from '@/lib/utils';
import React from 'react';

interface FKDateRangeWithLabelProps {
  fallbackValue?: string | null;
  name: string;
  className?: string;
  testId?: string;
  showYearPicker?: boolean;
  skipFallback?: boolean;
  callback?: (date: string) => void;
  skipConfirm?: boolean;
  skipClear?: boolean;
  label?: OdLabelProps;
}

export default function FkDateRangeWithLabel({ label, name, className, ...rest }: FKDateRangeWithLabelProps) {
  return (
    <div className={'mb-6'}>
      {label ? <OdLabel {...label} /> : null}

      <div className={'flex gap-4 w-full'}>
        <FkDatePicker {...rest} name={`${name}Start`} skipFallback className={cn(className, 'w-full')} />
        <FkDatePicker {...rest} name={`${name}End`} skipFallback className={cn(className, 'w-full')} />
      </div>
    </div>
  );
}
