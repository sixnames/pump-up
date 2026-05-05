import { ExercisesCombo } from '@/components/combobox/ExercisesCombo';
import { FKQueryComboConsumerSingleProps } from '@/components/combobox/QueryCombo';
import { Exercise } from '@/payload-types';
import { useField } from 'formik';

export default function FkExercisesCombo(props: FKQueryComboConsumerSingleProps<Exercise>) {
  const [{ value }, { error }, { setValue }] = useField<Exercise | undefined | null>(props.name);

  const testId = props.testId || props.name;

  return (
    <ExercisesCombo
      {...props}
      testId={testId}
      withError={Boolean(error)}
      selectedOption={value}
      onClear={async () => {
        await setValue(undefined);
        if (props.onClearCallback) {
          await props.onClearCallback();
        }
      }}
      onChangeAction={async (item) => {
        await setValue(item);

        if (!item) {
          return;
        }
        await props.onChangeCallback?.(item);
      }}
    />
  );
}
