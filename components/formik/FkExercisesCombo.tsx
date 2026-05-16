import { ExercisesCombo } from '@/components/combobox/ExercisesCombo';
import { FKQueryComboConsumerSingleProps } from '@/components/combobox/QueryCombo';
import { Exercise } from '@/payload-types';
import { useField } from 'formik';

interface FkExercisesComboProps extends FKQueryComboConsumerSingleProps<Exercise> {
  groupId?: string;
}

export default function FkExercisesCombo(props: FkExercisesComboProps) {
  const [{ value }, { error }, { setValue }] = useField<Exercise | undefined | null>(props.name);

  const testId = props.testId || props.name;

  return (
    <ExercisesCombo
      {...props}
      disabled={!props.groupId}
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
