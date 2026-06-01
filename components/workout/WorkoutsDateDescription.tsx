import { getWorkoutsDateDescription } from '@/collections/Workouts/actions';
import OdQueryLoader from '@/components/common/OdQueryLoader';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface WorkoutsDateDescriptionProps {
  groupIds: string[];
}

export default function WorkoutsDateDescription({ groupIds }: WorkoutsDateDescriptionProps) {
  const { user } = useGlobalConfigContext();
  const getWorkoutsDateDescriptionQuery = useQuery({
    queryKey: ['getWorkoutsDateDescription', user?.id, groupIds],
    queryFn: () => getWorkoutsDateDescription(groupIds),
    enabled: groupIds.length > 0,
  });

  if (getWorkoutsDateDescriptionQuery.isLoading) {
    return <OdQueryLoader />;
  }

  if (!getWorkoutsDateDescriptionQuery.data) {
    return null;
  }

  return (
    <span className={'text-muted-foreground font-normal text-sm'}>{`(${getWorkoutsDateDescriptionQuery.data})`}</span>
  );
}
