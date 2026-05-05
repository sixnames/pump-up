'use client';

import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkExercisesCombo from '@/components/formik/FkExercisesCombo';
import FkInput from '@/components/formik/FkInput';
import { fieldLabels } from '@/lib/fieldLabels';
import { Form, Formik } from 'formik';

export default function AddWorkoutPage() {
  const { user } = useGlobalConfigContext();
  if (!user) {
    return null;
  }
  return (
    <div className={'max-w-140 mx-auto'}>
      <Formik initialValues={{ userId: user?.id, date: new Date().toISOString() }} onSubmit={async () => {}}>
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
              <FkButton>{fieldLabels.add.action}</FkButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
