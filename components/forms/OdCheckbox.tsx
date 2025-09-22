import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface OdCheckboxProps {
  onChange?: (checked: boolean) => void | Promise<void>;
  name?: string;
  checked?: boolean | null;
  testId?: string;
}

export default function OdCheckbox({ onChange, name, checked, testId }: OdCheckboxProps) {
  const finalTestId = testId || name;
  return <Checkbox data-cy={finalTestId} onCheckedChange={onChange} name={name} checked={Boolean(checked)} className={'cursor-pointer'} />;
}

interface OdCheckboxLineProps extends OdCheckboxProps {
  label: string;
  className?: string;
}

export function OdCheckboxLine({ label, className, ...props }: OdCheckboxLineProps) {
  return (
    <label className={cn(`flex items-center space-x-2 cursor-pointer mb-6`, className)}>
      <OdCheckbox {...props} />
      <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{label}</span>
    </label>
  );
}
