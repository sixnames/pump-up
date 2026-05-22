import { getExerciseGroupOptions } from '@/collections/ExerciseGroups/actions';
import { exerciseFieldOptions } from '@/collections/Exercises';
import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import FkArrayField from '@/components/formik/FkArrayField';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkExercisesCombo from '@/components/formik/FkExercisesCombo';
import FkInput from '@/components/formik/FkInput';
import OdSelect from '@/components/forms/OdSelect';
import { Separator } from '@/components/ui/separator';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { Exercise, Workout, WorkoutSets } from '@/payload-types';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import set from 'lodash/set';
import { nanoid } from 'nanoid';
import { useState } from 'react';

interface WorkoutFormProps {
  initialValues: Partial<Workout>;
  onSubmit: (values: Partial<Workout>) => Promise<void>;
}

export default function WorkoutForm({ initialValues, onSubmit }: WorkoutFormProps) {
  const [groupId, setGroupId] = useState<string | undefined>();
  const exerciseGroupOptionsQuery = useQuery({
    queryKey: ['exercise-group-options'],
    queryFn: async () => getExerciseGroupOptions(),
  });

  if (exerciseGroupOptionsQuery.isLoading) {
    return <OdQueryLoader />;
  }

  const exerciseGroupOptions = alwaysArray(exerciseGroupOptionsQuery.data).map((group) => {
    return {
      value: alwaysString(group.id),
      label: alwaysString(group.label),
    };
  });

  return (
    <div className={'max-w-140 mx-auto'}>
      <Formik<Partial<Workout>>
        initialValues={initialValues}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
        validate={(values) => {
          const errors: Partial<Record<keyof Workout, string>> = {};
          const exercise = values.exercise as Exercise | undefined;
          const fields = alwaysArray(exercise?.fields);
          if (!exercise) {
            errors.exercise = fieldLabels.exercise.singular.nominative;
          }
          const sets = alwaysArray(values.sets);

          if (sets.length === 0) {
            errors.sets = fieldLabels.sets.plural;
          }

          sets.forEach((setItem, setIndex) => {
            const setFieldName = `${workoutFieldConfig.sets}[${setIndex}]`;
            fields.forEach((field) => {
              const option = exerciseFieldOptions.find((option) => {
                return field === option.value;
              });
              if (!option) {
                return;
              }
              const value = setItem[field];

              if (option.type === 'number' && alwaysNumber(value) < 1) {
                set(errors, `${setFieldName}.${field}`, fieldLabels[field]?.singular);
              }

              if (option.type === 'text' && alwaysString(value).length < 1) {
                set(errors, `${setFieldName}.${field}`, fieldLabels[field]?.singular);
              }
            });
          });

          return errors;
        }}
      >
        {({ values }) => {
          const exercise = values.exercise as Exercise | undefined;
          const fields = alwaysArray(exercise?.fields);

          return (
            <Form>
              <OdSelect
                name={'group'}
                options={exerciseGroupOptions}
                label={{ label: fieldLabels.exerciseGroup.singular.nominative, required: true }}
                value={groupId}
                setValue={async (value) => {
                  setGroupId(value?.value);
                }}
              />
              <FkExercisesCombo groupId={groupId} name={workoutFieldConfig.exercise} />

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
                      {fields.map((field) => {
                        const option = exerciseFieldOptions.find((option) => {
                          return field === option.value;
                        });

                        if (!option) {
                          return null;
                        }

                        return (
                          <FkInput
                            key={field}
                            delay={0}
                            name={`${fieldName}.${field}`}
                            label={{ label: fieldLabels[field]?.singular, description: option.description }}
                            type={option?.type}
                            removeProps={{
                              remove,
                              skipConfirm: true,
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                }}
              />

              <FkButton withKeyboardShortcut showErrorsList>
                {initialValues.id ? fieldLabels.update.action : fieldLabels.add.action}
              </FkButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
