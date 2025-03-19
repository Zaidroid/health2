import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { 
  WorkoutProgress, 
  DailyWorkout, 
  TrainingProgram, 
  Exercise,
  WorkoutExercise
} from '../types';

interface WorkoutContextType {
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  progressData: WorkoutProgress[];
  updateProgress: (progress: Partial<WorkoutProgress>) => Promise<void>;
  getPlannedWorkout: (programId: string) => DailyWorkout | undefined;
  trainingPrograms: TrainingProgram[];
  exercises: Exercise[];
  dailyWorkouts: { [programId: string]: { [week: number]: DailyWorkout[] } };
  loadingWorkouts: boolean;
  getProgramUUID: (programName: string) => string;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Map program names to their UUIDs
const PROGRAM_UUID_MAP: { [key: string]: string } = {
  'Z Axis': '550e8400-e29b-41d4-a716-446655440000',
  'T Bone': '550e8400-e29b-41d4-a716-446655440001'
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [progressData, setProgressData] = useState<WorkoutProgress[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dailyWorkouts, setDailyWorkouts] = useState<{ [programId: string]: { [week: number]: DailyWorkout[] } }>({});
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const { user } = useAuth();

  // Helper function to get UUID from program name
  const getProgramUUID = (programName: string): string => {
    return PROGRAM_UUID_MAP[programName] || PROGRAM_UUID_MAP['Z Axis']; // Default to Z Axis if not found
  };

  // Load training programs and exercises
  useEffect(() => {
    const loadProgramData = async () => {
      try {
        // Load training programs
        const { data: programsData, error: programsError } = await supabase
          .from('training_programs')
          .select('*');

        if (programsError) throw programsError;
        setTrainingPrograms(programsData);

        // Load exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*');

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData);

        const zAxisWorkouts = {
          '550e8400-e29b-41d4-a716-446655440000': {
            1: [
              { day: 'Monday', exercises: [
                { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '10-15', type: 'reps' },
                { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
                { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' }
              ]},
              { day: 'Tuesday', exercises: [
                { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
                { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
                { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' }
              ]},
              { day: 'Wednesday', exercises: [] },
              { day: 'Thursday', exercises: [
                { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '3-5', type: 'reps' },
                { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
                { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' }
              ]},
              { day: 'Friday', exercises: [
                { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
                { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '15-30', type: 'duration' },
                { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '20-30', type: 'duration' },
                { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' }
              ]},
              { day: 'Saturday', exercises: [
                { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
                { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' }
              ]},
              { day: 'Sunday', exercises: [] }
            ],
            2: [
                { day: 'Monday', exercises: [
                  { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '10-15', type: 'reps' },
                  { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '8-12', type: 'reps' },
                  { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '12', type: 'reps' }
                ]},
                { day: 'Tuesday', exercises: [
                  { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '15', type: 'reps' },
                  { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '12', type: 'reps' },
                  { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Wednesday', exercises: [] },
                { day: 'Thursday', exercises: [
                  { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '3-5', type: 'reps' },
                  { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '8-10', type: 'reps' },
                  { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '12', type: 'reps' }
                ]},
                { day: 'Friday', exercises: [
                  { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '5', type: 'reps' },
                  { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '15-30', type: 'duration' },
                  { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '20-30', type: 'duration' },
                  { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '15-20', type: 'duration' }
                ]},
                { day: 'Saturday', exercises: [
                  { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '10', type: 'reps' },
                  { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '20', type: 'reps' },
                  { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '12', type: 'reps' }
                ]},
                { day: 'Sunday', exercises: [] }
              ],
            3: [
                { day: 'Monday', exercises: [
                  { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '15-20', type: 'reps' },
                  { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '10-15', type: 'reps' },
                  { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Tuesday', exercises: [
                  { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '20', type: 'reps' },
                  { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '15', type: 'reps' },
                  { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '20', type: 'reps' }
                ]},
                { day: 'Wednesday', exercises: [] },
                { day: 'Thursday', exercises: [
                  { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '4-6', type: 'reps' },
                  { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '10-12', type: 'reps' },
                  { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Friday', exercises: [
                  { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '6', type: 'reps' },
                  { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '20-35', type: 'duration' },
                  { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '30-45', type: 'duration' },
                  { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '20-30', type: 'duration' }
                ]},
                { day: 'Saturday', exercises: [
                  { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '12', type: 'reps' },
                  { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '25', type: 'reps' },
                  { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Sunday', exercises: [] }
              ],
            4:  [
                { day: 'Monday', exercises: [
                  { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '15-20', type: 'reps' },
                  { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '10-15', type: 'reps' },
                  { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Tuesday', exercises: [
                  { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '20', type: 'reps' },
                  { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '15', type: 'reps' },
                  { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '20', type: 'reps' }
                ]},
                { day: 'Wednesday', exercises: [] },
                { day: 'Thursday', exercises: [
                  { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '4-6', type: 'reps' },
                  { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '10-12', type: 'reps' },
                  { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Friday', exercises: [
                  { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '6', type: 'reps' },
                  { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '20-35', type: 'duration' },
                  { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '30-45', type: 'duration' },
                  { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '20-30', type: 'duration' }
                ]},
                { day: 'Saturday', exercises: [
                  { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '12', type: 'reps' },
                  { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '25', type: 'reps' },
                  { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '15', type: 'reps' }
                ]},
                { day: 'Sunday', exercises: [] }
              ],
            5: [
                { day: 'Monday', exercises: [
                  { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '20+', type: 'reps' },
                  { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '12-18', type: 'reps' },
                  { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Tuesday', exercises: [
                  { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '25', type: 'reps' },
                  { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '20', type: 'reps' },
                  { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '25', type: 'reps' }
                ]},
                { day: 'Wednesday', exercises: [] },
                { day: 'Thursday', exercises: [
                  { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '5-7', type: 'reps' },
                  { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '12-15', type: 'reps' },
                  { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Friday', exercises: [
                  { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '7', type: 'reps' },
                  { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '30-45', type: 'duration' },
                  { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '45-60', type: 'duration' },
                  { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '30-40', type: 'duration' }
                ]},
                { day: 'Saturday', exercises: [
                  { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '15', type: 'reps' },
                  { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '30', type: 'reps' },
                  { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Sunday', exercises: [] }
              ],
            6: [
                { day: 'Monday', exercises: [
                  { exerciseId: 'push-ups', name: 'Push-ups', sets: 3, targetReps: '20+', type: 'reps' },
                  { exerciseId: 'dips', name: 'Dips', sets: 3, targetReps: '12-18', type: 'reps' },
                  { exerciseId: 'resistance-band-shoulder-press', name: 'Resistance band shoulder press', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Tuesday', exercises: [
                  { exerciseId: 'glute-bridges', name: 'Glute bridges', sets: 3, targetReps: '25', type: 'reps' },
                  { exerciseId: 'bodyweight-squats', name: 'Bodyweight squats', sets: 3, targetReps: '20', type: 'reps' },
                  { exerciseId: 'resistance-band-leg-curls', name: 'Resistance band leg curls', sets: 3, targetReps: '25', type: 'reps' }
                ]},
                { day: 'Wednesday', exercises: [] },
                { day: 'Thursday', exercises: [
                  { exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, targetReps: '5-7', type: 'reps' },
                  { exerciseId: 'inverted-rows', name: 'Inverted rows', sets: 3, targetReps: '12-15', type: 'reps' },
                  { exerciseId: 'resistance-band-bicep-curls', name: 'Resistance band bicep curls', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Friday', exercises: [
                  { exerciseId: 'handstand-wall-walks', name: 'Handstand wall walks', sets: 3, targetReps: '7', type: 'reps' },
                  { exerciseId: 'wall-supported-handstand-hold', name: 'Wall-supported handstand hold', sets: 3, targetReps: '30-45', type: 'duration' },
                  { exerciseId: 'standard-plank', name: 'Standard plank', sets: 3, targetReps: '45-60', type: 'duration' },
                  { exerciseId: 'side-planks', name: 'Side planks', sets: 3, targetReps: '30-40', type: 'duration' }
                ]},
                { day: 'Saturday', exercises: [
                  { exerciseId: 'burpees', name: 'Burpees', sets: 3, targetReps: '15', type: 'reps' },
                  { exerciseId: 'mountain-climbers', name: 'Mountain climbers', sets: 3, targetReps: '30', type: 'reps' },
                  { exerciseId: 'resistance-band-rows', name: 'Resistance band rows', sets: 3, targetReps: '18', type: 'reps' }
                ]},
                { day: 'Sunday', exercises: [] }
              ]
          }
        };

        const tBoneWorkouts = {
          '550e8400-e29b-41d4-a716-446655440001': {
            1: [
              { day: 'Sunday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Monday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '20', type: 'duration' }
              ]},
              { day: 'Tuesday', exercises: [] },
              { day: 'Wednesday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Thursday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '20', type: 'duration' }
              ]},
              { day: 'Friday', exercises: [] },
              { day: 'Saturday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '20', type: 'duration' }
              ]}
            ],
            2: [
              { day: 'Sunday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Monday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '30', type: 'duration' }
              ]},
              { day: 'Tuesday', exercises: [] },
              { day: 'Wednesday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Thursday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '30', type: 'duration' }
              ]},
              { day: 'Friday', exercises: [] },
              { day: 'Saturday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '30', type: 'duration' }
              ]}
            ],
            3: [
              { day: 'Sunday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Monday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '40', type: 'duration' }
              ]},
              { day: 'Tuesday', exercises: [] },
              { day: 'Wednesday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Thursday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '40', type: 'duration' }
              ]},
              { day: 'Friday', exercises: [] },
              { day: 'Saturday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '40', type: 'duration' }
              ]}
            ],
            4: [
              { day: 'Sunday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '12', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Monday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '50', type: 'duration' }
              ]},
              { day: 'Tuesday', exercises: [] },
              { day: 'Wednesday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '12', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Thursday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '50', type: 'duration' }
              ]},
              { day: 'Friday', exercises: [] },
              { day: 'Saturday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '12', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '50', type: 'duration' }
              ]}
            ],
            5: [
              { day: 'Sunday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '15', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Monday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '60', type: 'duration' }
              ]},
              { day: 'Tuesday', exercises: [] },
              { day: 'Wednesday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-lateral-raises', name: 'Dumbbell Lateral Raises (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '15', type: 'reps' },
                { exerciseId: 'lying-leg-raises', name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' }
              ]},
              { day: 'Thursday', exercises: [
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'band-lateral-walks', name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps', type: 'reps' },
                { exerciseId: 'glute-kickbacks', name: 'Glute Kickbacks (band)', sets: 3, targetReps: '10', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '60', type: 'duration' }
              ]},
              { day: 'Friday', exercises: [] },
              { day: 'Saturday', exercises: [
                { exerciseId: 'dumbbell-bicep-curls', name: 'Dumbbell Bicep Curls (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'dumbbell-squats', name: 'Dumbbell Squats (3 kg)', sets: 4, targetReps: '10', type: 'reps' },
                { exerciseId: 'push-ups', name: 'Push-Ups', sets: 4, targetReps: '15', type: 'reps' },
                { exerciseId: 'plank', name: 'Plank', sets: 3, targetReps: '60', type: 'duration' }
              ]}
            ]
          }
        };

        // Combine pre-defined workout data with data from Supabase (if any)
        const combinedWorkouts = {
          ...zAxisWorkouts,
          ...tBoneWorkouts
        };

        setDailyWorkouts(combinedWorkouts);
        setLoadingWorkouts(false);

      } catch (error) {
        console.error('Error loading program data:', error);
        setLoadingWorkouts(false);
      }
    };

    loadProgramData();
  }, []);

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('workout_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        if (data) {
          // Transform dates from strings to Date objects
          const transformedData = data.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setProgressData(transformedData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, [user]);

  const updateProgress = async (progress: Partial<WorkoutProgress>) => {
    if (!user) return;

    // Convert selectedPlan name to UUID if needed
    let programId = (progress as any).program_id;
    if (!programId && user.selectedPlan) {
      programId = getProgramUUID(user.selectedPlan);
    }

    try {
      const { error } = await supabase
        .from('workout_progress')
        .upsert({
          user_id: user.id,
          ...progress,
          program_id: programId
        }, {
          onConflict: 'user_id, date'
        });

      if (error) throw error;

      // Update local state
      setProgressData(prev => {
        const newData = [...prev];
        const existingIndex = newData.findIndex(
          p => p.date.toISOString() === (progress.date as Date).toISOString()
        );

        if (existingIndex >= 0) {
          newData[existingIndex] = {
            ...newData[existingIndex],
            ...progress
          } as WorkoutProgress;
      } else {
          newData.push(progress as WorkoutProgress);
        }

        return newData;
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const getPlannedWorkout = (programId: string): DailyWorkout | undefined => {
    // Convert program name to UUID if needed    
    // Handle both direct UUIDs and program names
    let programUUID = programId;
    
    // If it's not in UUID format, convert from name to UUID
    if (!programId.includes('-')) {
      programUUID = PROGRAM_UUID_MAP[programId] || programId;
    }
        
    if (!dailyWorkouts[programUUID] || !dailyWorkouts[programUUID][currentWeek]) {
      return undefined;
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
    const workout = dailyWorkouts[programUUID][currentWeek].find(
      workout => workout.day === today
    );
    
    return workout;
  };

  return (
    <WorkoutContext.Provider value={{
    currentWeek,
    setCurrentWeek,
    progressData,
      updateProgress,
    getPlannedWorkout,
      trainingPrograms,
      exercises,
      dailyWorkouts,
      loadingWorkouts,
      getProgramUUID
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
