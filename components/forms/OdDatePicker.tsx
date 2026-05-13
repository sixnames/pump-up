'use client';

import OdButton from '@/components/buttons/OdButton';
import OdRemoveButton, { OdRemoveButtonProps } from '@/components/buttons/OdRemoveButton';
import OdLabel, { OdLabelProps } from '@/components/forms/OdLabel';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { monthOptions, options } from '@/lib/constants';
import { getToday, safeDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { CalendarIcon, Cross2Icon } from '@radix-ui/react-icons';
import { format, setHours, setMinutes, setMonth, setYear } from 'date-fns';
import { uk } from 'date-fns/locale';
import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';

const getDateFormat = (hideTimeInputs?: boolean) => (hideTimeInputs ? 'dd.MM.yyyy' : 'dd.MM.yyyy HH:mm');
const getFormatedDateLength = (hideTimeInputs?: boolean) => getDateFormat(hideTimeInputs).length;

function normalizeDate(date: Date) {
  return date.toISOString();
}

function formatTimeInput(value?: string | number | null) {
  return alwaysString(value).replace(/\D/g, '');
}

function formatDateInput(value: string) {
  let digits = value.replace(/\D/g, '');

  if (digits.length > 4) {
    return digits.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1.$2.$3');
  } else if (digits.length > 2) {
    return digits.replace(/^(\d{2})(\d{0,2}).*/, '$1.$2');
  } else {
    return digits;
  }
}

export interface OdDatePickerProps {
  fallbackValue?: string | Date | null;
  className?: string;
  testId?: string;
  skipFallback?: boolean;
  callback?: (date: string) => void;
  skipClear?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  removeProps?: Omit<OdRemoveButtonProps, 'className' | 'testId'>;
  disabled?: boolean;
  label?: OdLabelProps;
  hideCalendar?: boolean;
  hideTimeInputs?: boolean;
  value?: Date | string | null;
  onChangeAction: (value?: Date | string) => void | Promise<void>;
  withError?: boolean;
  disableDates?: { before?: Date; after: Date } | { before: Date; after?: Date } | { before: Date; after: Date };
}

export default function OdDatePicker({
  label,
  className,
  fallbackValue,
  skipFallback,
  testId,
  callback,
  skipClear,
  removeProps,
  disabled,
  hideCalendar,
  hideTimeInputs,
  withError,
  onChangeAction,
  value,
  disableDates,
}: OdDatePickerProps) {
  const fallback = safeDate(fallbackValue);
  const fieldValue = safeDate(value, skipFallback ? undefined : fallback);
  const finalTestId = testId;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [valueRestored, setValueRestored] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const datePickerTestId = `${finalTestId}-date-picker`;
  const dateFormat = getDateFormat(hideTimeInputs);
  const formatedDateLength = getFormatedDateLength(hideTimeInputs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !inputValue && fieldValue && !valueRestored) {
      setInputValue(format(fieldValue, dateFormat));
      setValueRestored(true);
    }
  }, [mounted, fieldValue, inputValue, valueRestored]);

  useEffect(() => {
    if (valueRestored) {
      setCalendarOpen(false);
    }
  }, [valueRestored]);

  async function clearHandler() {
    if (skipClear) {
      return;
    }
    await onChangeAction(undefined);
    setInputValue('');
    return;
  }

  async function setHandler(date?: Date) {
    const safeInputDate = safeDate(date);
    if (safeInputDate) {
      const value = normalizeDate(safeInputDate);
      await onChangeAction(value);
      callback?.(value);
    }
  }

  return (
    <div
      data-cy={datePickerTestId}
      className={cn('relative', className, {
        'mb-6': !className,
      })}
    >
      <OdLabel {...label} />

      <div className={'w-full relative flex items-start gap-4'}>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <div className={'relative w-full bg-background rounded'}>
            <CalendarIcon className='absolute top-2 left-[0.4rem] z-20 w-5 h-5' />
            <PopoverTrigger
              tabIndex={0}
              disabled={disabled}
              asChild
              className={cn({
                'cursor-not-allowed opacity-50': disabled,
              })}
            >
              <button
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCalendarOpen(true);
                  }
                }}
                className={cn('h-9 w-full rounded-md border border-input px-8 flex items-center', {
                  'border-error dark:border-error': withError,
                })}
              >
                {fieldValue ? format(fieldValue, dateFormat) : ''}
              </button>
            </PopoverTrigger>
            <div className={'absolute flex top-[50%] -translate-y-4 right-px z-30'}>
              {fieldValue && !skipClear ? (
                <OdButton
                  tabIndex={-1}
                  testId={`${testId}-clear`}
                  ariaLabel={`Очистити`}
                  variant={'ghost'}
                  onClick={clearHandler}
                  className={cn(
                    `text-muted-foreground duration-0 animate-none p-0 w-8 h-8 min-h-8 max-h-8 flex items-center justify-center shrink-0`,
                  )}
                >
                  <Cross2Icon className={`w-4 h-4`} />
                </OdButton>
              ) : null}
            </div>

            <PopoverContent className='w-auto p-2' align='start' autoFocus={false}>
              {hideCalendar ? null : (
                <Input
                  autoFocus
                  className={cn('relative w-full z-30 mb-4', {
                    'border-error dark:border-error': withError,
                  })}
                  disabled={disabled}
                  placeholder={''}
                  data-cy={`${finalTestId}-date-picker-input`}
                  maxLength={formatedDateLength}
                  value={inputValue}
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let value = formatDateInput(alwaysString(e.target.value));
                    setInputValue(value);
                    const valueArray = value.split('.');

                    if (value.length === formatedDateLength && valueArray.length === 3) {
                      const day = alwaysNumber(valueArray[0]);
                      const month = alwaysNumber(valueArray[1]);
                      const year = alwaysNumber(valueArray[2]);
                      const date = new Date(year, month - 1, day);
                      await setHandler(date);
                      setInputValue(format(date, dateFormat));
                      setCalendarOpen(false);
                    }
                  }}
                />
              )}

              {hideTimeInputs ? null : (
                <div className={'grid grid-cols-2 gap-4'}>
                  <div>
                    <Label className={'text-muted-foreground'}>Години</Label>
                    <Input
                      className={cn('relative z-30', {
                        'border-error dark:border-error': withError,
                      })}
                      disabled={disabled}
                      data-cy={`${finalTestId}-hour-picker-input`}
                      maxLength={2}
                      type={'text'}
                      value={fieldValue ? alwaysString(fieldValue.getHours()) : ''}
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        let value = alwaysNumber(formatTimeInput(e.target.value));
                        if (value > 23) {
                          value = 23;
                        }
                        if (value < 0) {
                          value = 0;
                        }
                        if (fieldValue) {
                          const newValue = setHours(fieldValue, value);
                          await setHandler(newValue);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className={'text-muted-foreground'}>Хвилини</Label>
                    <Input
                      className={cn('relative z-30', {
                        'border-error dark:border-error': withError,
                      })}
                      disabled={disabled}
                      data-cy={`${finalTestId}-minute-picker-input`}
                      type={'text'}
                      maxLength={2}
                      value={fieldValue ? alwaysString(fieldValue.getMinutes()) : ''}
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        let value = alwaysNumber(formatTimeInput(e.target.value));
                        if (value > 59) {
                          value = 59;
                        }
                        if (value < 0) {
                          value = 0;
                        }
                        if (fieldValue) {
                          const newValue = setMinutes(fieldValue, value);
                          await setHandler(newValue);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {hideCalendar ? null : (
                <>
                  <Calendar
                    locale={uk}
                    weekStartsOn={1}
                    className={'w-full'}
                    mode='single'
                    selected={fieldValue}
                    month={fieldValue}
                    hideNavigation
                    disabled={disableDates}
                    onDayKeyDown={async (date, _modifiers, event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        setInputValue(format(date, dateFormat));
                        await setHandler(date);
                        setCalendarOpen(false);
                      }
                    }}
                    onMonthChange={async (date) => {
                      const monthIndex = date.getMonth();
                      date.setMonth(monthIndex);
                      setInputValue(format(date, dateFormat));
                      await setHandler(date);
                    }}
                    onSelect={async (date) => {
                      if (date) {
                        setInputValue(format(date, dateFormat));
                        await setHandler(date);
                        setCalendarOpen(false);
                      }
                    }}
                    footer={
                      <div className='flex items-center space-x-2 mt-2'>
                        <Select
                          data-cy={`${finalTestId}-month-select`}
                          value={fieldValue ? alwaysString(fieldValue.getMonth()) : alwaysString(getToday().getMonth())}
                          onValueChange={async (monthIndex) => {
                            const currentDate = fieldValue || getToday();
                            const updatedDate = setMonth(currentDate, alwaysNumber(monthIndex));
                            setInputValue(format(updatedDate, dateFormat));
                            await setHandler(updatedDate);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position='popper'>
                            {monthOptions.map((option, index) => {
                              return (
                                <SelectItem
                                  data-cy={`option-${testId}-${index}`}
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Select
                          data-cy={`${finalTestId}-year-select`}
                          value={
                            fieldValue ? alwaysString(fieldValue.getFullYear()) : alwaysString(getToday().getFullYear())
                          }
                          onValueChange={async (yearIndex) => {
                            const currentDate = fieldValue || getToday();
                            const updatedDate = setYear(currentDate, alwaysNumber(yearIndex));
                            setInputValue(format(updatedDate, dateFormat));
                            await setHandler(updatedDate);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position='popper'>
                            {options.map((option, index) => {
                              return (
                                <SelectItem
                                  data-cy={`option-${testId}-${index}`}
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    }
                  />
                </>
              )}
            </PopoverContent>
          </div>
        </Popover>

        {removeProps ? (
          <div className={'h-9 flex items-center'}>
            <OdRemoveButton {...removeProps} testId={finalTestId} className={'static'} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
