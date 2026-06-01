import { exerciseFieldOptions } from '@/collections/Exercises';
import { deleteWorkout, getWorkoutsOnDate } from '@/collections/Workouts/actions';
import OdButton from '@/components/buttons/OdButton';
import OdConfirmButton from '@/components/buttons/OdConfirmButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import WorkoutsDateDescription from '@/components/workout/WorkoutsDateDescription';
import { useOdMutation } from '@/hooks/useOdMutation';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { getReadableDate } from '@/lib/dateUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { getWorkoutLink } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import { Day, Exercise, ExerciseGroup } from '@/payload-types';
import { useProgress } from '@bprogress/next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PenIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface WorkoutsDateContentProps {
  day: Day;
}

function WorkoutsDateContent({ day }: WorkoutsDateContentProps) {
  const { user } = useGlobalConfigContext();
  const workoutIds = alwaysArray(day.workouts) as string[];
  const getWorkoutsOnDateQuery = useQuery({
    queryKey: ['getWorkoutsList', user?.id, workoutIds],
    queryFn: () => getWorkoutsOnDate(workoutIds),
    enabled: workoutIds.length > 0,
  });
  const router = useRouter();
  const { start } = useProgress();

  const client = useQueryClient();
  const deleteWorkoutMutation = useOdMutation({
    action: deleteWorkout,
    onSuccessCallback: async () => {
      await client.invalidateQueries();
    },
  });

  if (getWorkoutsOnDateQuery.isLoading) {
    return <OdQueryLoader />;
  }

  return (
    <CardContent className={'space-y-4'}>
      {alwaysArray(getWorkoutsOnDateQuery.data).map((workout, workoutIndex) => {
        const exercise = workout.exercise as Exercise;
        const fields = alwaysArray(exercise?.fields);
        const group = exercise.group as ExerciseGroup | undefined;

        return (
          <div key={workoutIndex}>
            <Separator className={'mb-4'} />
            <div className={'flex gap-4 items-start'}>
              <div className={'flex-1'}>
                <div className={'mb-4 text-success flex flex-wrap gap-2'}>
                  <span>{exercise.label}</span>
                  {group ? <span>{`(${group.label})`}</span> : null}
                </div>

                <div className={'space-y-2'}>
                  {alwaysArray(workout.sets).map((set, setIndex) => {
                    return (
                      <div className={''} key={set.id}>
                        <div
                          className={'text-muted-foreground mb-1'}
                        >{`${fieldLabels.sets.singular} ${setIndex + 1}`}</div>

                        {fields.map((field) => {
                          const option = exerciseFieldOptions.find((option) => {
                            return field === option.value;
                          });
                          if (!option) {
                            return null;
                          }
                          let value: number | string = alwaysNumber(set[field]);
                          if (option.type === 'text') {
                            value = alwaysString(set[field]);
                          }

                          return <div key={field}>{`${fieldLabels[field]?.singular}: ${value}`}</div>;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={'grid grid-cols-1 sm:grid-cols-2 items-center gap-4'}>
                <OdButton
                  className={cn('w-7 h-7 p-0 flex items-center justify-center cursor-pointer')}
                  variant={'outline'}
                  onClick={async () => {
                    start();
                    router.push(getWorkoutLink(workout.id).root.url);
                  }}
                  type={'button'}
                  tabIndex={-1}
                >
                  <PenIcon className={'h-4 w-4 shrink-0 opacity-50'} />
                </OdButton>
                <OdConfirmButton
                  button={{
                    className: 'w-7 h-7 p-0 flex items-center justify-center cursor-pointer',
                    variant: 'destructive',
                  }}
                  dialog={{
                    title: `${fieldLabels.deleteConfirm.singular} ${fieldLabels.workout.singular.toLowerCase()}`,
                    isDialogOpen: false,
                    onConfirm: async () => {
                      await deleteWorkoutMutation.mutateAsync(workout.id);
                    },
                  }}
                >
                  <XIcon className='h-4 w-4 shrink-0 opacity-50' />
                </OdConfirmButton>
              </div>
            </div>
          </div>
        );
      })}
    </CardContent>
  );
}

interface WorkoutsDateProps {
  day: Day;
  isOpen: boolean;
}

export default function WorkoutsDate({ day, isOpen }: WorkoutsDateProps) {
  const groupIds = alwaysArray(day.exerciseGroups) as string[];

  return (
    <Collapsible defaultOpen={isOpen} asChild>
      <Card>
        <CardHeader>
          <CardTitle>
            <CollapsibleTrigger
              className={'text-warning w-full text-lg cursor-pointer flex flex-wrap items-center gap-2'}
            >
              <span>{getReadableDate({ date: day.date }).readableDate}</span>
              <WorkoutsDateDescription groupIds={groupIds} />
            </CollapsibleTrigger>
          </CardTitle>
        </CardHeader>
        <CollapsibleContent>
          <WorkoutsDateContent day={day} />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
