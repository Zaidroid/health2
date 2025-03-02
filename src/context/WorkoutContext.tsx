import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ExerciseProgress } from '../types';

type WorkoutContextType = {
  progressData: ExerciseProgress[];
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  addProgressEntry: () => void;
  updateProgressEntry: (week: number, field: keyof ExerciseProgress, value: any) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

type WorkoutProviderProps = {
  children: ReactNode;
};

export const WorkoutProvider = ({ children }: WorkoutProviderProps) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [progressData, setProgressData] = useState<ExerciseProgress[]>([
    {
      week: 1,
      pushups: 12,
      pullups: 3,
      dips: 8,
      plank: 25,
      handstand: 15,
      skillPractice: true,
      notes: "Form feels good, struggled with handstands",
    },
    {
      week: 2,
      pushups: 14,
      pullups: 4,
      dips: 10,
      plank: 30,
      handstand: 20,
      skillPractice: true,
      notes: "Increased all reps, getting better at handstands",
    },
    {
      week: 3,
      pushups: 16,
      pullups: 5,
      dips: 11,
      plank: 35,
      handstand: 25,
      skillPractice: false,
      notes: "Missed skill practice day, but strength improving",
    },
  ]);

  const addProgressEntry = () => {
    const lastWeek =
      progressData.length > 0 ? progressData[progressData.length - 1].week : 0;
    const newProgressEntry: ExerciseProgress = {
      week: lastWeek + 1,
      pushups: 0,
      pullups: 0,
      dips: 0,
      plank: 0,
      handstand: 0,
      skillPractice: false,
      notes: "",
    };
    setProgressData([...progressData, newProgressEntry]);
    setCurrentWeek(lastWeek + 1);
  };

  const updateProgressEntry = (
    week: number,
    field: keyof ExerciseProgress,
    value: any,
  ) => {
    const updatedData = progressData.map((entry) => {
      if (entry.week === week) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setProgressData(updatedData);
  };

  const contextValue: WorkoutContextType = {
    progressData,
    currentWeek,
    setCurrentWeek,
    addProgressEntry,
    updateProgressEntry,
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

