'use client';
import { getWorkoutsList } from '@/collections/Workouts/actions';
import OdButton from '@/components/buttons/OdButton';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fieldLabels } from '@/lib/fieldLabels';
import { urlConfig } from '@/lib/urlUtils';
import { Exercise } from '@/payload-types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MainPage() {
  const router = useRouter();
  const { user } = useGlobalConfigContext();
  const getWorkoutsListQuery = useQuery({
    queryKey: ['getWorkoutsList', user?.id],
    queryFn: () => getWorkoutsList(),
  });
  return (
    <div>
      <div className={'space-y-2 mb-6'}>
        <OdButton
          onClick={() => {
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
                        <div className={'text-lg mb-2'}>{exercise.label}</div>

                        <div>{`${fieldLabels.weight.singular}: ${workout.weight}`}</div>
                        <div>{`${fieldLabels.workWeight.singular}: ${workout.workWeight}`}</div>
                        <div>{`${fieldLabels.repetitions.singular}: ${workout.repetitions}`}</div>
                        <div>{`${fieldLabels.sets.singular}: ${workout.sets}`}</div>
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
