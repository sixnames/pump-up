import FkDatePicker from '@/components/formik/FkDatePicker';
import { fieldLabels } from '@/lib/fieldLabels';
import React from 'react';

interface FKDateRangeProps {
  index?: number;
  name: string;
  remove?: () => void;
  required?: boolean;
  startLabel?: string;
  endLabel?: string;
  hideCalendar?: boolean;
}

export default function FkDateRange({
  index,
  name,
  remove,
  required,
  startLabel,
  endLabel,
  hideCalendar,
}: FKDateRangeProps) {
  const indexNamePart = !index && index !== 0 ? '' : `[${index}]`;

  return (
    <div className={'w-full'}>
      <FkDatePicker
        label={{ label: startLabel || fieldLabels.startDate.singular, required }}
        name={`${name}${indexNamePart}.start`}
        skipFallback
        hideCalendar={hideCalendar}
        removeProps={
          remove
            ? {
                remove,
                nameInMessage: fieldLabels.range.singular,
              }
            : undefined
        }
      />
      <div className={'w-full flex gap-4'}>
        <div className={'w-full'}>
          <FkDatePicker
            label={{ label: endLabel || fieldLabels.endDate.singular, required }}
            name={`${name}${indexNamePart}.end`}
            hideCalendar={hideCalendar}
            skipFallback
          />
        </div>
        {remove ? <div className={'w-6 h-6'} /> : null}
      </div>
    </div>
  );
}
