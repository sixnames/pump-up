import { FKInputCommonProps } from '@/@types/form-input-types';
import OdRemoveButton from '@/components/buttons/OdRemoveButton';
import OdLabel from '@/components/forms/OdLabel';
import { Textarea } from '@/components/ui/textarea';
import useFieldError from '@/hooks/useFieldError';
import { alwaysString } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import { useField } from 'formik';
import debounce from 'lodash/debounce';
import { ReactNode, useEffect, useState } from 'react';

export interface FKTextareaProps extends FKInputCommonProps {
  placeholder?: string;
  onChangeCallback?: (value: string) => void;
  autoFocus?: boolean;
  icon?: ReactNode;
  onIconClick?: () => void;
  maxLength?: number;
  inputClassName?: string;
  delay?: number;
  withError?: boolean;
}

export default function FkTextarea({
  label,
  className,
  inputClassName,
  testId,
  name,
  disabled,
  placeholder,
  onChangeCallback,
  autoFocus,
  icon,
  onIconClick,
  maxLength,
  removeProps,
  delay = 300,
  ...props
}: FKTextareaProps) {
  const [{ value }, _meta, { setValue }] = useField<string>(name);
  const withError = useFieldError(name) || props.withError;
  const [localValue, setLocalValue] = useState<undefined | string>(undefined);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (value !== localValue && !isMounted) {
      setLocalValue(value || '');
      setIsMounted(true);
    }
  }, [value, localValue, isMounted]);

  const debouncedUpdate = debounce(async (val) => {
    await setValue(val);
  }, delay);

  useEffect(() => {
    if (localValue !== value) {
      debouncedUpdate(localValue);
      return debouncedUpdate.cancel;
    }
  }, [localValue, value, debouncedUpdate]);

  const finalTestId = testId || name;
  return (
    <div
      className={cn('relative z-10 w-full', className, {
        'mb-6': !className,
      })}
    >
      <OdLabel {...label} />

      <div className={'w-full relative flex items-start gap-4'}>
        <div className={'relative w-full z-10'}>
          <Textarea
            autoFocus={autoFocus}
            className={cn('w-full bg-background', inputClassName, {
              'border-error': withError,
              'pl-8': !!icon,
            })}
            disabled={Boolean(disabled)}
            placeholder={placeholder}
            data-cy={finalTestId}
            name={name}
            defaultValue={localValue}
            maxLength={maxLength}
            onBlur={(e) => {
              setLocalValue(e.target.value || '');
            }}
            onInput={async (e) => {
              const target = e.target as unknown as HTMLTextAreaElement;
              setLocalValue(target?.value || '');
              if (onChangeCallback) {
                onChangeCallback(alwaysString(target?.value));
              }
            }}
          />
        </div>

        {removeProps ? (
          <div className={'h-9 flex items-center'}>
            <OdRemoveButton {...removeProps} testId={finalTestId} className={'static'} />
          </div>
        ) : null}
        {icon ? (
          <div
            onClick={onIconClick}
            className={cn('absolute top-[0.5rem] left-[0.4rem] z-20 w-5 h-5', {
              'cursor-pointer hover:text-secondary': !!onIconClick,
            })}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
