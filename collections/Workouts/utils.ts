import { alwaysArray, alwaysNumber } from '@/lib/commonUtils';
import { Exercise, WorkoutSets } from '@/payload-types';

type SetItem = NonNullable<WorkoutSets>[number];

type Metric = {
  key: string;
  label: string;
  requiredFields: string[];
  calculate: (sets: SetItem[], repsLimit: number) => number | null;
};

export const workoutMetrics: Metric[] = [
  {
    key: 'volume',
    label: 'Volume',
    requiredFields: ['weight', 'repetitions'],
    calculate: (sets, repsLimit) => {
      return sets.reduce((sum, set) => {
        const repetitions = alwaysNumber(set.repetitions);
        const reps = repetitions > repsLimit ? repsLimit : repetitions;
        return sum + alwaysNumber(set.weight) * reps;
      }, 0);
    },
  },
  {
    key: 'estimatedOneRepMax',
    label: 'Estimated 1RM',
    requiredFields: ['weight', 'repetitions'],
    calculate: (sets, repsLimit) => {
      const values = sets.map((set) => {
        const weight = alwaysNumber(set.weight);
        const repetitions = alwaysNumber(set.repetitions);
        const reps = repetitions > repsLimit ? repsLimit : repetitions;

        if (!weight || !reps) {
          return 0;
        }

        return weight * (1 + reps / 30);
      });

      return Math.max(...values);
    },
  },
  {
    key: 'totalReps',
    label: 'Total reps',
    requiredFields: ['repetitions'],
    calculate: (sets, repsLimit) => {
      return sets.reduce((sum, set) => {
        const repetitions = alwaysNumber(set.repetitions);
        const reps = repetitions > repsLimit ? repsLimit : repetitions;
        return sum + reps;
      }, 0);
    },
  },
  {
    key: 'distance',
    label: 'Distance',
    requiredFields: ['distance'],
    calculate: (sets) => {
      return sets.reduce((sum, set) => sum + alwaysNumber(set.distance), 0);
    },
  },
  {
    key: 'pace',
    label: 'Pace',
    requiredFields: ['distance', 'minutes'],
    calculate: (sets) => {
      const distance = sets.reduce((sum, set) => sum + alwaysNumber(set.distance), 0);
      const minutes = sets.reduce((sum, set) => sum + alwaysNumber(set.minutes), 0);

      if (!distance || !minutes) {
        return null;
      }

      return minutes / distance;
    },
  },
];

export function getWorkoutMetricValues(exercise: Exercise, setsList: WorkoutSets, repsLimit: number) {
  const exerciseFields = alwaysArray(exercise.fields);
  const sets = alwaysArray(setsList);

  return workoutMetrics
    .filter((metric) => {
      return metric.requiredFields.every((field) => exerciseFields.includes(field as any));
    })
    .map((metric) => {
      return {
        key: metric.key,
        label: metric.label,
        value: metric.calculate(sets, repsLimit),
      };
    })
    .filter((metric) => metric.value !== null);
}
