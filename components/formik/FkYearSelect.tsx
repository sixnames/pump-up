import OdYearSelect, { OdYearSelectProps } from '@/components/selects/OdYearSelect';
import { useField } from 'formik';

interface FKYearSelectProps extends Pick<OdYearSelectProps, 'alternativeYearOptions' | 'removeProps' | 'label'> {
  name: string;
  testId?: string;
}

export default function FkYearSelect({ name, testId, ...props }: FKYearSelectProps) {
  const [{ value }, { error }, { setValue }] = useField(name);
  const finalTestId = testId || name;

  return (
    <OdYearSelect
      {...props}
      skipClear
      value={value}
      withError={Boolean(error)}
      testId={finalTestId}
      onValueChange={async (year) => {
        await setValue(year);
      }}
      clearHandler={async () => {
        await setValue(undefined);
      }}
    />
  );
}
