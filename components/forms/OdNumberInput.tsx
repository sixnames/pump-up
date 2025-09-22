import OdInput, { OdInputProps } from '@/components/forms/OdInput';
import { alwaysNumber } from '@/lib/commonUtils';

interface OdNumberInputProps extends Omit<OdInputProps, 'type' | 'onChangeCallback'> {
  onChangeCallback: (value: number | undefined) => void | Promise<void>;
}

export default function OdNumberInput(props: OdNumberInputProps) {
  return (
    <OdInput
      {...props}
      type='number'
      onChangeCallback={(value) => {
        const number = alwaysNumber(value, 0);
        if (number === 0) {
          props.onChangeCallback(undefined);
        }
        if (number) {
          props.onChangeCallback(number);
        }
      }}
    />
  );
}
