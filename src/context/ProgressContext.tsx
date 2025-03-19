import { createContext, useContext, useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from './AuthContext';
import { UserProgressEntry } from '../types/progress';

const updateProgressEntry = async (
  week: string,
  day: string,
  exerciseName: string,
  value: number[] | string,
  date: Date
) => {
  if (!user) return;

  const progressRef = ref(database, `progress/${user.uid}/${week}/${day}`);
  const updates: { [key: string]: any } = {};

  if (exerciseName === 'notes') {
    updates['notes'] = value;
  } else {
    updates[`reps/${exerciseName}`] = value;
  }
  
  // Add the date to the progress entry
  updates['date'] = date.toISOString();

  try {
    await update(progressRef, updates);
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

const ProgressContext = createContext<{
  progressData: UserProgressEntry[];
  updateProgressEntry: (week: string, day: string, exerciseName: string, value: number[] | string, date: Date) => Promise<void>;
} | null>(null);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progressData, setProgressData] = useState<UserProgressEntry[]>([]);
  const { user } = useAuth();

  const updateProgressEntry = async (
    week: string,
    day: string,
    exerciseName: string,
    value: number[] | string,
    date: Date
  ) => {
    if (!user) return;

    const progressRef = ref(database, `progress/${user.uid}/${week}/${day}`);
    const updates: { [key: string]: any } = {};

    if (exerciseName === 'notes') {
      updates['notes'] = value;
    } else {
      updates[`reps/${exerciseName}`] = value;
    }
    
    // Add the date to the progress entry
    updates['date'] = date.toISOString();

    try {
      await update(progressRef, updates);
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  // ... rest of the existing code ...
};
