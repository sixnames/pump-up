import OdInput from '@/components/forms/OdInput';
import { OdLabelProps } from '@/components/forms/OdLabel';
import { useQueryState } from 'nuqs';

interface FilterInputProps {
  name: string;
  label: OdLabelProps;
  className?: string;
}

export default function FilterInput({ name, label, className }: FilterInputProps) {
  const [value, setValue] = useQueryState(name, {});

  return (
    <OdInput
      name={name}
      className={className}
      value={value}
      label={label}
      onChangeAction={async (value) => {
        await setValue(value.target.value);
      }}
      onClear={async () => {
        await setValue('');
      }}
    />
  );
}
