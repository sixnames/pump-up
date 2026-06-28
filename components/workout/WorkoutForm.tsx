import { getExerciseGroupOptions } from '@/collections/ExerciseGroups/actions';
import { exerciseFieldOptions } from '@/collections/Exercises';
import { getExerciseById, getExerciseOptions } from '@/collections/Exercises/actions';
import { getBestSimilarWorkout } from '@/collections/Workouts/actions';
import { workoutFieldConfig } from '@/collections/Workouts/fieldConfig';
import OdButton from '@/components/buttons/OdButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import FkArrayField from '@/components/formik/FkArrayField';
import FkButton from '@/components/formik/FkButton';
import FkDatePicker from '@/components/formik/FkDatePicker';
import { FKErrorsInfobox } from '@/components/formik/FkErrorsList';
import FkInput from '@/components/formik/FkInput';
import NvSelect from '@/components/forms/NvSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { collectYupErrors } from '@/lib/errorUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { getUserActionTitle } from '@/lib/textUtils';
import { Exercise, Workout, WorkoutSets } from '@/payload-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, useFormikContext } from 'formik';
import set from 'lodash/set';
import { nanoid } from 'nanoid';
import React from 'react';

interface WorkoutSetFieldsProps {
  setIndex: number;
  remove: () => void;
  fieldName: string;
}

function WorkoutSetFields({ remove, setIndex, fieldName }: WorkoutSetFieldsProps) {
  const { values } = useFormikContext<Partial<Workout>>();
  const exercise = values.exercise as Exercise | undefined;
  const getLastSimilarWorkoutQuery = useQuery({
    queryKey: ['last-similar-workout', exercise?.id, setIndex],
    enabled: !!exercise,
    queryFn: async () =>
      getBestSimilarWorkout({
        exerciseId: exercise?.id as string,
        setIndex,
      }),
  });

  if (!exercise) {
    return null;
  }

  if (getLastSimilarWorkoutQuery.isLoading) {
    return <OdQueryLoader />;
  }

  const fields = alwaysArray(exercise?.fields);

  return (
    <Card className={'mb-6'}>
      <CardHeader>
        <CardTitle className={'text-success'}>{`${fieldLabels.sets.singular} ${setIndex + 1}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {fields.map((field, index) => {
          const option = exerciseFieldOptions.find((option) => {
            return field === option.value;
          });

          if (!option) {
            return null;
          }

          const prevValue = getLastSimilarWorkoutQuery?.data?.[field];

          return (
            <div className={'mb-6'} key={field}>
              <FkInput
                className={'mb-0'}
                name={`${fieldName}.${field}`}
                label={{ label: fieldLabels[field]?.singular, description: option.description }}
                type={option?.type}
                removeProps={
                  index === 0
                    ? {
                        remove,
                        skipConfirm: true,
                      }
                    : undefined
                }
              />
              {prevValue ? <div className={' mt-2'}>{`Середній результат: ${prevValue}`}</div> : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function WorkoutFormFields() {
  const { values, setFieldValue, errors } = useFormikContext<Partial<Workout>>();
  const errorsList = collectYupErrors(errors);
  const groupId = values.groupId;
  const exercise = values.exercise as Exercise | undefined;

  const exerciseGroupOptionsQuery = useQuery({
    queryKey: ['exercise-group-options'],
    queryFn: async () => getExerciseGroupOptions(),
  });

  const exerciseOptionsQuery = useQuery({
    queryKey: ['exercise-options', groupId],
    enabled: !!groupId,
    queryFn: async () =>
      getExerciseOptions({
        groupId: groupId as string,
      }),
  });

  const getExerciseByIdMutation = useMutation({
    mutationFn: getExerciseById,
    onSuccess: async (exercise) => {
      if (!exercise) {
        return;
      }
      await setFieldValue(workoutFieldConfig.exercise, exercise);
    },
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

  const exerciseOptions = alwaysArray(exerciseOptionsQuery.data).map((group) => {
    return {
      value: alwaysString(group.id),
      label: alwaysString(group.label),
    };
  });

  return (
    <Form className={'pb-16'}>
      <NvSelect
        name={'group'}
        options={exerciseGroupOptions}
        label={{ label: fieldLabels.exerciseGroup.singular.nominative, required: true }}
        value={groupId}
        setValue={async (value) => {
          await setFieldValue(workoutFieldConfig.groupId, value?.value);
        }}
      />
      <NvSelect
        name={workoutFieldConfig.exercise}
        disabled={!groupId || exerciseOptionsQuery.isLoading}
        options={exerciseOptions}
        label={{
          label: fieldLabels.exercise.singular.nominative,
          required: true,
        }}
        value={exercise?.id}
        setValue={async (value) => {
          if (!value) {
            return;
          }
          await getExerciseByIdMutation.mutateAsync(value?.value);
        }}
      />

      <FkDatePicker hideTimeInputs name={workoutFieldConfig.date} label={{ label: fieldLabels.date.singular }} />

      <FkArrayField<Partial<NonNullable<WorkoutSets>[number]>>
        containerClassName={'mb-0'}
        name={workoutFieldConfig.sets}
        title={fieldLabels.sets.plural}
        renderItem={({ fieldName, index, remove }) => {
          return <WorkoutSetFields setIndex={index} remove={remove} fieldName={fieldName} />;
        }}
      />

      {errorsList.length > 0 ? (
        <FKErrorsInfobox errorsList={errorsList} className={'mb-6'} title={'Заповніть наступні поля:'} />
      ) : null}

      <div className={'flex justify-between'}>
        <OdButton
          disabled={!values.exercise}
          variant={'secondary'}
          onClick={async () => {
            const sets = alwaysArray(values.sets);
            const newSet: Partial<NonNullable<WorkoutSets>[number]> = {
              id: nanoid(),
            };
            await setFieldValue(workoutFieldConfig.sets, [...sets, newSet]);
          }}
        >
          {getUserActionTitle(fieldLabels.sets.singular).add}
        </OdButton>

        <FkButton withKeyboardShortcut>{fieldLabels.save.action}</FkButton>
      </div>
    </Form>
  );
}

interface WorkoutFormProps {
  initialValues: Partial<Workout>;
  onSubmit: (values: Partial<Workout>) => Promise<void>;
}

export default function WorkoutForm({ initialValues, onSubmit }: WorkoutFormProps) {
  return (
    <div className={'max-w-140 mx-auto'}>
      <Formik<Partial<Workout>>
        validateOnChange
        initialValues={initialValues}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
        validate={async (values) => {
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
        {() => {
          return <WorkoutFormFields />;
        }}
      </Formik>
    </div>
  );
}
