export interface User {
  id: string;
  name: string;
  email: string;
  googleToken: string;
  trainingStartDate: Date;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: Date;
  exerciseName: string;
  sets: number[];
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  unlockedAt: Date;
}

export interface HealthMetrics {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  lastSynced: Date;
}

export interface Exercise {
  name: string;
  sets: number;
  targetReps: string;
  type: 'reps' | 'duration';
}

export interface DailyWorkout {
  day: string;
  exercises: Exercise[];
}