'use client';
import { deleteWorkout, getWorkoutsList } from '@/collections/Workouts/actions';
import OdButton from '@/components/buttons/OdButton';
import OdConfirmButton from '@/components/buttons/OdConfirmButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOdMutation } from '@/hooks/useOdMutation';
import { alwaysArray } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { getWorkoutLink, urlConfig } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import { Exercise } from '@/payload-types';
import { useProgress } from '@bprogress/next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PenIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MainPage() {
  const router = useRouter();
  const { start } = useProgress();
  const { user } = useGlobalConfigContext();
  const getWorkoutsListQueryKey = ['getWorkoutsList', user?.id];
  const getWorkoutsListQuery = useQuery({
    queryKey: getWorkoutsListQueryKey,
    queryFn: () => getWorkoutsList(),
  });
  const client = useQueryClient();
  const deleteWorkoutMutation = useOdMutation({
    action: deleteWorkout,
    onSuccessCallback: async () => {
      await client.refetchQueries({
        queryKey: getWorkoutsListQueryKey,
      });
    },
  });

  return (
    <div>
      <div className={'space-y-2 mb-6'}>
        <OdButton
          onClick={() => {
            start();
            router.push(urlConfig.app.links.createWorkout.url);
          }}
        >
          {urlConfig.app.links.createWorkout.title}
        </OdButton>
      </div>
      {getWorkoutsListQuery.isLoading ? <OdQueryLoader /> : null}
      {getWorkoutsListQuery.data ? (
        <div>
          {Object.entries(getWorkoutsListQuery.data).map(([date, workouts]) => {
            return (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className={'text-warning text-lg'}>{date}</CardTitle>
                </CardHeader>
                <CardContent className={'space-y-4'}>
                  {workouts.map((workout, workoutIndex) => {
                    const exercise = workout.exercise as Exercise;
                    return (
                      <div key={workoutIndex}>
                        <Separator className={'mb-4'} />
                        <div className={'flex gap-4 items-start'}>
                          <div className={'flex-1'}>
                            <div className={'mb-2 text-success'}>{exercise.label}</div>

                            <div className={'space-y-2'}>
                              {alwaysArray(workout.sets).map((set, setIndex) => {
                                return (
                                  <div className={''} key={set.id}>
                                    <div
                                      className={'text-muted-foreground mb-1'}
                                    >{`${fieldLabels.sets.singular} ${setIndex + 1}`}</div>

                                    <div>{`${fieldLabels.weight.singular}: ${set.weight}`}</div>
                                    <div>{`${fieldLabels.repetitions.singular}: ${set.repetitions}`}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className={'flex items-center gap-4'}>
                            <OdButton
                              className={cn('w-6 h-6 p-0 flex items-center justify-center cursor-pointer')}
                              variant={'ghost'}
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
                                className: 'w-6 h-6 p-0 flex items-center justify-center cursor-pointer',
                                variant: 'ghost',
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
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
