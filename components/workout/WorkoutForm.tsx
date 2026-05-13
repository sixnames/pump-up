import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import FkArrayField from '@/components/formik/FkArrayField';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkExercisesCombo from '@/components/formik/FkExercisesCombo';
import FkInput from '@/components/formik/FkInput';
import { Separator } from '@/components/ui/separator';
import { fieldLabels } from '@/lib/fieldLabels';
import { Workout, WorkoutSets } from '@/payload-types';
import { Form, Formik } from 'formik';
import { nanoid } from 'nanoid';

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
              <FkArrayField<Partial<NonNullable<WorkoutSets>[number]>>
                name={workoutFieldConfig.sets}
                title={fieldLabels.sets.plural}
                addButtonProps={{
                  suffix: fieldLabels.sets.singular,
                  emptyItem: () => {
                    return {
                      id: nanoid(),
                    };
                  },
                }}
                renderItem={({ fieldName, index, remove }) => {
                  return (
                    <div>
                      <Separator className={'mb-5'} />
                      <div className={'text-muted-foreground mb-1'}>{`${fieldLabels.sets.singular} ${index + 1}`}</div>
                      <FkInput
                        name={`${fieldName}.${workoutFieldConfig.weight}`}
                        label={{ label: fieldLabels.weight.singular }}
                        type={'number'}
                        removeProps={{
                          remove,
                          skipConfirm: true,
                        }}
                      />
                      <FkInput
                        name={`${fieldName}.${workoutFieldConfig.repetitions}`}
                        label={{ label: fieldLabels.repetitions.singular }}
                        type={'number'}
                      />
                    </div>
                  );
                }}
              />

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
