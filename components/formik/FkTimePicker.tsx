'use client';

import OdLabel, { OdLabelProps } from '@/components/forms/OdLabel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { safeDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { setHours, setMinutes } from 'date-fns';
import { useField } from 'formik';
import * as React from 'react';
import { ChangeEvent } from 'react';

function normalizeDate(date: Date) {
  return date.toISOString();
}

function formatTimeInput(value?: string | number | null) {
  return alwaysString(value).replace(/\D/g, '');
}

interface FkTimePickerProps {
  fallbackValue?: string | Date | null;
  name: string;
  className?: string;
  testId?: string;
  skipFallback?: boolean;
  callback?: (date: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  label?: OdLabelProps;
}

export default function FkTimePicker({
  label,
  className,
  fallbackValue,
  skipFallback,
  name,
  testId,
  callback,
  disabled,
}: FkTimePickerProps) {
  const [field, { error }, { setValue }] = useField<string | undefined>(name);
  const fallback = safeDate(fallbackValue);
  const fieldValue = safeDate(field.value, skipFallback ? undefined : fallback);
  const finalTestId = testId || name;
  const datePickerTestId = `${finalTestId}-time-picker`;

  function setHandler(date?: Date) {
    const safeInputDate = safeDate(date);
    if (!safeInputDate) {
      return;
    }
    const value = normalizeDate(safeInputDate);
    setValue(value)
      .then(() => {
        if (callback && value) {
          callback(value);
        }
      })
      .catch((e) => {
        console.error(e, name, value);
      });
  }

  return (
    <div
      data-cy={datePickerTestId}
      className={cn('relative', className, {
        'mb-6': !className,
      })}
    >
      <OdLabel {...label} />

      <div className={'grid grid-cols-2 gap-4'}>
        <div>
          <Label className={'text-muted-foreground'}>Години</Label>
          <Input
            className={cn('relative z-30', {
              'border-error dark:border-error': error,
            })}
            disabled={disabled}
            data-cy={`${finalTestId}-hour-picker-input`}
            maxLength={2}
            type={'text'}
            value={fieldValue ? alwaysString(fieldValue.getHours()) : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let value = alwaysNumber(formatTimeInput(e.target.value));
              if (value > 23) {
                value = 23;
              }
              if (value < 0) {
                value = 0;
              }
              if (fieldValue) {
                const newValue = setHours(fieldValue, value);
                setHandler(newValue);
              }
            }}
          />
        </div>
        <div>
          <Label className={'text-muted-foreground'}>Хвилини</Label>
          <Input
            className={cn('relative z-30', {
              'border-error dark:border-error': error,
            })}
            disabled={disabled}
            data-cy={`${finalTestId}-minute-picker-input`}
            type={'text'}
            maxLength={2}
            value={fieldValue ? alwaysString(fieldValue.getMinutes()) : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let value = alwaysNumber(formatTimeInput(e.target.value));
              if (value > 59) {
                value = 59;
              }
              if (value < 0) {
                value = 0;
              }
              if (fieldValue) {
                const newValue = setMinutes(fieldValue, value);
                setHandler(newValue);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
