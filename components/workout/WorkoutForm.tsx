import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkExercisesCombo from '@/components/formik/FkExercisesCombo';
import FkInput from '@/components/formik/FkInput';
import { fieldLabels } from '@/lib/fieldLabels';
import { Workout } from '@/payload-types';
import { Form, Formik } from 'formik';

interface WorkoutFormProps {
  initialValues: Partial<Workout>;
  onSubmit: (values: Partial<Workout>) => Promise<void>;
}

export default function WorkoutForm({ initialValues, onSubmit }: WorkoutFormProps) {
  return (
    <div className={'max-w-140 mx-auto'}>
      <Formik<Partial<Workout>>
        initialValues={initialValues}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FkExercisesCombo name={workoutFieldConfig.exercise} />
              <FkDatePicker
                hideTimeInputs
                name={workoutFieldConfig.date}
                label={{ label: fieldLabels.date.singular }}
              />
              <FkInput
                name={workoutFieldConfig.weight}
                label={{ label: fieldLabels.weight.singular }}
                type={'number'}
              />
              <FkInput
                name={workoutFieldConfig.workWeight}
                label={{ label: fieldLabels.workWeight.singular }}
                type={'number'}
              />
              <FkInput
                name={workoutFieldConfig.repetitions}
                label={{ label: fieldLabels.repetitions.singular }}
                type={'number'}
              />
              <FkInput name={workoutFieldConfig.sets} label={{ label: fieldLabels.sets.singular }} type={'number'} />
              <FkButton withKeyboardShortcut>
                {initialValues.id ? fieldLabels.update.action : fieldLabels.add.action}
              </FkButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
