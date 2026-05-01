import { SelectDataItem } from '@/@types/common-types';
import OdRemoveButton, { OdRemoveButtonProps } from '@/components/buttons/OdRemoveButton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { options } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import OdLabel, { OdLabelProps } from '../forms/OdLabel';

export interface OdYearSelectProps {
  testId: string;
  className?: string;
  label?: OdLabelProps;
  value?: string | number | null;
  withError?: boolean;
  alternativeYearOptions?: SelectDataItem[];
  skipClear?: boolean;
  clearHandler: () => void | Promise<void>;
  removeProps?: OdRemoveButtonProps;
  onValueChange: (value: number | null) => void | Promise<void>;
}

export default function OdYearSelect({
                                       testId,
                                       className,
                                       label,
                                       value,
                                       withError,
                                       alternativeYearOptions,
                                       skipClear,
                                       clearHandler,
                                       removeProps,
                                       onValueChange,
                                     }: OdYearSelectProps) {
  return (
    <div
      data-cy={testId}
      className={cn('relative', className, {
        'mb-6': !className,
      })}
    >
      <OdLabel {...label} />

      <div className={'w-full relative flex items-center gap-2'}>
        <div className={'relative w-full'}>
          <Select
            value={value ? alwaysString(value) : undefined}
            onValueChange={async (yearIndex) => {
              await onValueChange(alwaysNumber(yearIndex));
            }}
          >
            <SelectTrigger
              data-cy={`${testId}-trigger`}
              className={cn('w-full bg-background', {
                'border-red-600': withError,
              })}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {(alternativeYearOptions || options).map((option) => {
                return (
                  <SelectItem data-cy={`${testId}-option-${option.value}`} key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className={'flex items-center'}>
          {value && !skipClear ? (
            <Button
              className={'w-6 h-6 p-0 flex items-center justify-center'}
              variant={'ghost'}
              onClick={clearHandler}
              type={'button'}
              data-cy={`${testId}-clear`}
            >
              <XIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          ) : null}
        </div>

        {removeProps ? (
          <div className={'h-9 flex items-center'}>
            <OdRemoveButton {...removeProps} testId={testId} className={'static'} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
