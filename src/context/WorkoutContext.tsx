import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the training schedule
type ExerciseType = 'reps' | 'duration';

interface Exercise {
  name: string;
  sets: number;
  targetReps?: string; // Optional because it might be duration-based
  type: ExerciseType;
}

interface DailyWorkout {
  day: string;
  exercises: Exercise[];
}

interface WeeklyPlan {
  [week: number]: DailyWorkout[];
}

// Define a type for the user's progress data
interface UserProgressEntry {
  week: number;
  [exerciseName: string]: number | boolean | string; // Flexible to store reps, duration, or notes
}

type WorkoutContextType = {
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  progressData: UserProgressEntry[];
  updateProgressEntry: (week: number, exerciseName: string, value: number | boolean | string) => void;
  getPlannedWorkout: () => DailyWorkout | undefined;
  trainingSchedule: WeeklyPlan;
  progressionPlan: { [week: number]: { [exerciseName: string]: string } };
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

type WorkoutProviderProps = {
  children: ReactNode;
};

// Training Schedule (Constant)
const trainingSchedule: WeeklyPlan = {
    1: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '10-15', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] }, // Rest
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '3-5', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '15-30', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '20-30', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] }, // Rest
    ],
    2: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '10-15', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '3-5', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '15-30', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '20-30', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] },
    ],
  3: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '15-20', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '4-6', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '30-45', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '30-45', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] },
    ],
    4: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '15-20', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '4-6', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '30-45', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '30-45', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] },
    ],
  5: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '20+', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '5-7', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '45-60', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '45-60', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] },
    ],
    6: [
      {
        day: 'Monday',
        exercises: [
          { name: 'Push-ups', sets: 3, targetReps: '20+', type: 'reps' },
          { name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
          { name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Tuesday',
        exercises: [
          { name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      { day: 'Wednesday', exercises: [] },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Pull-ups', sets: 3, targetReps: '5-7', type: 'reps' },
          { name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
          { name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Friday',
        exercises: [
          { name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
          { name: 'Wall-supported handstand hold', sets: 3, targetReps: '45-60', type: 'duration' },
          { name: 'Standard plank', sets: 3, targetReps: '45-60', type: 'duration' },
          { name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' },
        ],
      },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
          { name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      { day: 'Sunday', exercises: [] },
    ],
};

// Progression Plan (Constant)
const progressionPlan = {
    1: { 'Push-ups': '10-15', 'Pull-ups': '3-5', 'Standard plank': '20-30' },
    2: { 'Push-ups': '10-15', 'Pull-ups': '3-5', 'Standard plank': '20-30' },
    3: { 'Push-ups': '15-20', 'Pull-ups': '4-6', 'Standard plank': '30-45' },
    4: { 'Push-ups': '15-20', 'Pull-ups': '4-6', 'Standard plank': '30-45' },
    5: { 'Push-ups': '20+',    'Pull-ups': '5-7', 'Standard plank': '45-60' },
    6: { 'Push-ups': '20+',    'Pull-ups': '5-7', 'Standard plank': '45-60' },
};

export const WorkoutProvider = ({ children }: WorkoutProviderProps) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [progressData, setProgressData] = useState<UserProgressEntry[]>([]);

  const updateProgressEntry = (
    week: number,
    exerciseName: string,
    value: number | boolean | string,
  ) => {
    setProgressData((prevProgress) => {
      const weekIndex = prevProgress.findIndex((entry) => entry.week === week);

      if (weekIndex > -1) {
        // Update existing week
        const updatedWeek = { ...prevProgress[weekIndex], [exerciseName]: value };
        const updatedProgress = [...prevProgress];
        updatedProgress[weekIndex] = updatedWeek;
        return updatedProgress;
      } else {
        // Add new week
        const newWeekEntry: UserProgressEntry = { week, [exerciseName]: value };
        return [...prevProgress, newWeekEntry];
      }
    });
  };

  const getPlannedWorkout = () => {
      return trainingSchedule[currentWeek]?.find(
        (dailyWorkout) =>
          dailyWorkout.day ===
          new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      );
  };

  const contextValue: WorkoutContextType = {
    currentWeek,
    setCurrentWeek,
    progressData,
    updateProgressEntry,
    getPlannedWorkout,
    trainingSchedule,
    progressionPlan
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
