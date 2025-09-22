import { FKInputCommonProps } from '@/@types/form-input-types';
import OdCrossButton from '@/components/buttons/OdCrossButton';
import OdRemoveButton from '@/components/buttons/OdRemoveButton';
import OdLabel from '@/components/forms/OdLabel';
import { Input } from '@/components/ui/input';
import { alwaysString } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import { ChangeEvent, ReactNode, useEffect } from 'react';

export interface OdInputProps extends FKInputCommonProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'search' | 'color' | 'tel' | 'number';
  placeholder?: string;
  pattern?: string;
  onChangeCallback: (value: string) => void | Promise<void>;
  autoFocus?: boolean;
  icon?: ReactNode;
  onIconClick?: () => void;
  maxLength?: number;
  onBlur?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void | Promise<void>;
  value?: string | null;
  withError?: boolean;
}

export default function OdInput({
  label,
  type = 'text',
  className,
  testId,
  name,
  disabled,
  placeholder,
  pattern,
  onChangeCallback,
  autoFocus,
  icon,
  onIconClick,
  maxLength,
  removeProps,
  onBlur,
  onClear,
  value,
  withError,
}: OdInputProps) {
  useEffect(() => {
    if (autoFocus) {
      const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }, [autoFocus, name]);

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
          <Input
            onBlur={onBlur}
            autoFocus={autoFocus}
            className={cn('w-full bg-background', {
              'border-error': withError,
              'pl-8': !!icon,
              'pr-8': !!onClear,
            })}
            disabled={Boolean(disabled)}
            placeholder={placeholder}
            data-cy={finalTestId}
            name={name}
            type={type}
            pattern={pattern}
            defaultValue={alwaysString(value)}
            maxLength={maxLength}
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              onChangeCallback(alwaysString(e.target.value));
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
            className={cn('absolute top-[0.5rem] left-[0.4rem] z-20 w-5 h-5', {
              'cursor-pointer hover:text-secondary': !!onIconClick,
            })}
            onClick={onIconClick}
          >
            {icon}
          </div>
        ) : null}

        {onClear && value ? (
          <OdCrossButton
            onClick={onClear}
            className={'absolute top-[0.5rem] right-[0.4rem] z-20 w-5 h-5 cursor-pointer hover:text-primary/40'}
            hidden={!onClear}
          />
        ) : null}
      </div>
    </div>
  );
}
