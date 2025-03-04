import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { User } from '@supabase/supabase-js';

type ExerciseType = 'reps' | 'duration';

interface Exercise {
  name: string;
  sets: number;
  targetReps?: string;
  type: ExerciseType;
}

interface DailyWorkout {
  day: string;
  exercises: Exercise[];
}

interface WeeklyPlan {
  [week: number]: DailyWorkout[];
}

interface UserProgressEntry {
  week: number;
  day: string; // Added day
  reps: { [exerciseName: string]: number[] }; // Changed to store reps per set
  notes?: string; // Added notes
}

type WorkoutContextType = {
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  progressData: UserProgressEntry[];
  updateProgressEntry: (week: number, day: string, exerciseName: string, value: number[] | string) => void; // Updated type
  getPlannedWorkout: (planName: string) => DailyWorkout | undefined;
  trainingSchedules: { [planName: string]: WeeklyPlan };
  progressionPlans: { [planName: string]: { [week: number]: { [exerciseName: string]: string } } };
  setProgressData: (data: UserProgressEntry[]) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

type WorkoutProviderProps = {
  children: ReactNode;
};

const zAxisTrainingSchedule: WeeklyPlan = {
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

const zAxisProgressionPlan = {
  1: { 'Push-ups': '10-15', 'Pull-ups': '3-5', 'Standard plank': '20-30' },
  2: { 'Push-ups': '10-15', 'Pull-ups': '3-5', 'Standard plank': '20-30' },
  3: { 'Push-ups': '15-20', 'Pull-ups': '4-6', 'Standard plank': '30-45' },
  4: { 'Push-ups': '15-20', 'Pull-ups': '4-6', 'Standard plank': '30-45' },
  5: { 'Push-ups': '20+',    'Pull-ups': '5-7', 'Standard plank': '45-60' },
  6: { 'Push-ups': '20+',    'Pull-ups': '5-7', 'Standard plank': '45-60' },
};

const tBoneTrainingSchedule: WeeklyPlan = {
    1: [
      {
        day: 'Sunday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' },
        ],
      },
      {
        day: 'Monday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps/dir', type: 'reps' },
          { name: 'Glute Kickbacks', sets: 3, targetReps: '10/leg', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '20s', type: 'duration' },
        ],
      },
      { day: 'Tuesday', exercises: [] },
      {
        day: 'Wednesday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '10', type: 'reps' },
        ],
      },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '10 steps/dir', type: 'reps' },
          { name: 'Glute Kickbacks', sets: 3, targetReps: '10/leg', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '20s', type: 'duration' },
        ],
      },
      { day: 'Friday', exercises: [] },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Dumbbell Squats', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '8', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '20s', type: 'duration' },
        ],
      },
    ],
    2: [
      {
        day: 'Sunday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Monday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '12 steps/dir', type: 'reps' },
          { name: 'Glute Kickbacks', sets: 3, targetReps: '12/leg', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '30s', type: 'duration' },
        ],
      },
      { day: 'Tuesday', exercises: [] },
      {
        day: 'Wednesday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '12', type: 'reps' },
        ],
      },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '12 steps/dir', type: 'reps' },
          { name: 'Glute Kickbacks', sets: 3, targetReps: '12/leg', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '30s', type: 'duration' },
        ],
      },
      { day: 'Friday', exercises: [] },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '10', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '30s', type: 'duration' },
        ],
      },
    ],
    3: [
      {
        day: 'Sunday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Overhead Press', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      {
        day: 'Monday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Glute Bridges', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '12 steps/dir', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '40s', type: 'duration' },
        ],
      },
      { day: 'Tuesday', exercises: [] },
      {
        day: 'Wednesday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Overhead Press', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Lying Leg Raises', sets: 3, targetReps: '15', type: 'reps' },
        ],
      },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Glute Bridges', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '12 steps/dir', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '40s', type: 'duration' },
        ],
      },
      { day: 'Friday', exercises: [] },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 4, targetReps: '12', type: 'reps' },
          { name: 'Dumbbell Squats', sets: 4, targetReps: '12', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '12', type: 'reps' },
          { name: 'Bicycle Crunches', sets: 3, targetReps: '12/side', type: 'reps' },
        ],
      },
    ],
    4: [
      {
        day: 'Sunday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Overhead Press', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Russian Twists', sets: 3, targetReps: '20/side', type: 'reps' },
        ],
      },
      {
        day: 'Monday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Glute Bridges', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '15 steps/dir', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '50s', type: 'duration' },
        ],
      },
      { day: 'Tuesday', exercises: [] },
      {
        day: 'Wednesday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Lateral Raises', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Overhead Press', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Russian Twists', sets: 3, targetReps: '20/side', type: 'reps' },
        ],
      },
      {
        day: 'Thursday',
        exercises: [
          { name: 'Dumbbell Squats', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Glute Bridges', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Band Lateral Walks', sets: 3, targetReps: '15 steps/dir', type: 'reps' },
          { name: 'Plank', sets: 3, targetReps: '50s', type: 'duration' },
        ],
      },
      { day: 'Friday', exercises: [] },
      {
        day: 'Saturday',
        exercises: [
          { name: 'Dumbbell Bicep Curls', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Dumbbell Squats', sets: 4, targetReps: '15', type: 'reps' },
          { name: 'Push-Ups', sets: 3, targetReps: '15', type: 'reps' },
          { name: 'Bicycle Crunches', sets: 3, targetReps: '15/side', type: 'reps' },
        ],
      },
    ],
};

const tBoneProgressionPlan = {
    1: {
        'Dumbbell Bicep Curls': '3x10',
        'Dumbbell Lateral Raises': '3x10',
        'Push-Ups': '3x8',
        'Lying Leg Raises': '3x10',
        'Dumbbell Squats': '3x10',
        'Band Lateral Walks': '3x10 steps/dir',
        'Glute Kickbacks': '3x10/leg',
        'Plank': '3x20s'
    },
    2: {
        'Dumbbell Bicep Curls': '3x12',
        'Dumbbell Lateral Raises': '3x12',
        'Push-Ups': '3x10',
        'Lying Leg Raises': '3x12',
        'Dumbbell Squats': '3x12',
        'Band Lateral Walks': '3x12 steps/dir',
                'Glute Kickbacks': '3x12/leg',
        'Plank': '3x30s'
    },
    3: {
        'Dumbbell Bicep Curls': '3x12',
        'DumbbellLateral Raises': '3x12',
        'Dumbbell Overhead Press': '3x12',
        'Push-Ups': '3x12',
        'Lying Leg Raises': '3x15',
        'Dumbbell Squats': '3x12',
        'Dumbbell Glute Bridges': '3x12',
        'Band Lateral Walks': '3x12 steps/dir',
        'Plank': '3x40s'
    },
    4: {
        'Dumbbell Bicep Curls': '4x15',
        'Dumbbell Lateral Raises': '3x15',
        'Dumbbell Overhead Press': '4x15',
        'Push-Ups': '3x15',
        'Russian Twists': '3x20/side',
        'Dumbbell Squats': '4x15',
        'Dumbbell Glute Bridges': '4x15',
        'Band Lateral Walks': '3x15 steps/dir',
        'Plank': '3x50s'
    }
};

export const WorkoutProvider = ({ children }: WorkoutProviderProps) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [progressData, setProgressData] = useState<UserProgressEntry[]>([]);
  const { user } = useAuth();

  // Fetch progress data from Supabase on initialization
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        console.log("Fetched data:", data); // Debug log

        // Transform Supabase data into UserProgressEntry format
        const transformedData = data.reduce((acc: UserProgressEntry[], item) => {
          let weekEntry = acc.find(e => e.week === item.week && e.day === item.day);
          if (!weekEntry) {
            weekEntry = { week: item.week, day: item.day, reps: {} };
            acc.push(weekEntry);
          }
          if (item.exercise_name === 'notes') {
            weekEntry.notes = item.notes;
          } else {
            weekEntry.reps[item.exercise_name] = item.reps;
          }
          return acc;
        }, []);

        console.log("Transformed data:", transformedData); // Debug log
        setProgressData(transformedData);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, [user]);

  const updateProgressEntry = async (week: number, day: string, exerciseName: string, value: number[] | string) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }
    console.log(`updateProgressEntry called with week: ${week}, day: ${day}, exerciseName: ${exerciseName}, value:`, value); // Debug log

    // Update local progressData
    const updatedProgress = [...progressData];
    let weekDayEntry = updatedProgress.find(entry => entry.week === week && entry.day === day);

    if (!weekDayEntry) {
      weekDayEntry = { week, day, reps: {} };
      updatedProgress.push(weekDayEntry);
    }

    if (typeof value === 'string') {
      weekDayEntry.notes = value;
    } else {
      weekDayEntry.reps[exerciseName] = value;
    }

    setProgressData(updatedProgress);
    console.log("Updated progress data:", updatedProgress); // Debug log

    // Prepare data for Supabase
    const upsertData = {
      user_id: user.id,
      week,
      day,
      exercise_name: exerciseName,
      reps: typeof value !== 'string' ? value : null,
      notes: typeof value === 'string' ? value : null,
    };

    console.log("Data to upsert:", upsertData); // Debug log

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert([upsertData], { onConflict: 'user_id, week, day, exercise_name' });

      if (error) {
        console.error('Error updating progress:', error);
      } else {
        console.log('Progress updated successfully for', exerciseName);
      }
    } catch (err) {
      console.error('Unexpected error updating progress:', err);
    }
  };

  const getPlannedWorkout = (planName: string) => {
    const selectedSchedule = planName === "Z Axis" ? zAxisTrainingSchedule : tBoneTrainingSchedule;
    return selectedSchedule[currentWeek]?.find(
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
    trainingSchedules: { "Z Axis": zAxisTrainingSchedule, "T Bone": tBoneTrainingSchedule },
    progressionPlans: { "Z Axis": zAxisProgressionPlan, "T Bone": tBoneProgressionPlan },
    setProgressData,
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
