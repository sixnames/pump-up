'use client';

import { createWorkout } from '@/collections/Workouts/actions';
import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkExercisesCombo from '@/components/formik/FkExercisesCombo';
import FkInput from '@/components/formik/FkInput';
import { useOdMutation } from '@/hooks/useOdMutation';
import { fieldLabels } from '@/lib/fieldLabels';
import { Workout } from '@/payload-types';
import { Form, Formik } from 'formik';

export default function AddWorkoutPage() {
  const { user } = useGlobalConfigContext();
  const createWorkoutMutation = useOdMutation({
    action: createWorkout,
    redirectTo: () => {
      return '/';
    },
  });
  if (!user) {
    return null;
  }
  return (
    <div className={'max-w-140 mx-auto'}>
      <Formik<Partial<Workout>>
        initialValues={{ userId: user?.id, sets: 3, date: new Date().toISOString() }}
        onSubmit={async (values) => {
          await createWorkoutMutation.mutateAsync(values);
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
              <FkButton withKeyboardShortcut>{fieldLabels.add.action}</FkButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
