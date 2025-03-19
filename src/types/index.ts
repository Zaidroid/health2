export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseType = 'reps' | 'duration';

export interface User {
  id: string;
  email: string;
  name: string;
  googleToken?: string;
  trainingStartDate: Date;
  selectedPlan: string;
  weight?: number;
  height?: number;
  age?: number;
  fitnessLevel: FitnessLevel;
  goals: string[];
}

export interface WorkoutPlan {
  [day: string]: WorkoutDay;
}

export interface WorkoutDay {
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  type: ExerciseType;
  equipment: string[];
  muscleGroups: string[];
}

export interface ProgressEntry {
  week: number;
  [exercise: string]: number | boolean | string; // Allow numbers, booleans, and strings
  skillPractice: boolean;
  notes: string;
}

export interface HealthMetrics {
  date: Date;
  weight?: number;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  targetReps: string;
  type: ExerciseType;
}

export interface DailyWorkout {
  day: string;
  exercises: WorkoutExercise[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  difficulty: FitnessLevel;
}

export interface ExerciseSets extends Array<number> {}

export interface ExerciseProgress {
  sets: ExerciseSets;
  completed: boolean;
}

export interface WorkoutProgress {
  id: string;
  userId: string;
  program_id?: string;
  week: number;
  day: string;
  date: Date;
  exercises: { [exerciseId: string]: ExerciseProgress };
  notes?: string;
  completionRate: number;
}

export interface ProgressData {
  [exerciseId: string]: ExerciseProgress;
}
