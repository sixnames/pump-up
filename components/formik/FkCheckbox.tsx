import { Checkbox } from '@/components/ui/checkbox';
import { odSentenceCase } from '@/lib/stringUtils';
import { cn } from '@/lib/utils';
import { useField } from 'formik';
import get from 'lodash/get';

interface FkCheckboxProps {
  name: string;
  label: string;
  testId?: string;
  className?: string;
  onChange?: (checked: boolean) => void | Promise<void>;
  callback?: (checked: boolean) => void | Promise<void>;
  disabled?: boolean;
}

export default function FkCheckbox({ name, label, testId, className, onChange, disabled, callback }: FkCheckboxProps) {
  const [field, _meta, { setValue }] = useField(name);

  const finalTestId = testId || name;

  return (
    <label className={cn(`flex space-x-2 cursor-pointer mb-6`, className)}>
      <Checkbox
        name={name}
        data-cy={finalTestId}
        disabled={disabled}
        checked={get(field, 'value', false)}
        onCheckedChange={async (checked) => {
          await setValue(checked);
          if (onChange) {
            onChange(Boolean(checked));
          }
          if (callback) {
            await callback(Boolean(checked));
          }
        }}
      />
      <span
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-[0.1rem]">
        {odSentenceCase(label)}
      </span>
    </label>
  );
}
