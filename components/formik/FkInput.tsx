import OdInput, { OdInputProps } from '@/components/forms/OdInput';
import useFieldError from '@/hooks/useFieldError';
import { useField } from 'formik';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';

export interface FKInputProps extends Omit<OdInputProps, 'value' | 'withError' | 'onChangeCallback'> {
  onChangeCallback?: (value: string) => void | Promise<void>;
  delay?: number;
  withError?: boolean;
}

export default function FkInput({ name, onChangeCallback, delay = 300, ...props }: FKInputProps) {
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

  return (
    <OdInput
      withError={withError}
      value={localValue}
      name={name}
      onBlur={(e) => {
        setLocalValue(e.target.value || '');
      }}
      onChangeCallback={async (value) => {
        setLocalValue(value);
        await onChangeCallback?.(value);
      }}
      {...props}
    />
  );
}
