export interface User {
  id: string;
  email: string;
  name: string;
  googleToken: string;
  trainingStartDate: Date;
}

export interface WorkoutPlan {
  [day: string]: WorkoutDay;
}

export interface WorkoutDay {
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  targetReps: number;
  type: 'reps' | 'time';
}

export interface ProgressEntry {
  week: number;
  [exercise: string]: number | boolean | string; // Allow numbers, booleans, and strings
  skillPractice: boolean;
  notes: string;
}

export interface HealthMetrics {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  lastSynced: Date;
}
