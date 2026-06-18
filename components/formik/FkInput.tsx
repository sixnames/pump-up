import OdInput, { OdInputProps } from '@/components/forms/OdInput';
import useFieldError from '@/hooks/useFieldError';
import { useField } from 'formik';

export interface FKInputProps extends Omit<
  OdInputProps,
  'value' | 'withError' | 'onChangeCallback' | 'onChangeAction'
> {
  onChangeCallback?: (value: string) => void | Promise<void>;
  withError?: boolean;
}

export default function FkInput({ name, onChangeCallback, ...props }: FKInputProps) {
  const [{ value }, _meta, { setValue }] = useField<string>(name);
  const withError = useFieldError(name) || props.withError;

  return (
    <OdInput
      withError={withError}
      value={value}
      name={name}
      onChangeAction={async (e) => {
        await setValue(e.target.value || '');
      }}
      onChangeCallback={async (value) => {
        await onChangeCallback?.(value);
      }}
      {...props}
    />
  );
}
