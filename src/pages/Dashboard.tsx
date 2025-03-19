import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Dumbbell,
  Award,
  RefreshCw,
  TrendingUp,
  Zap,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { WorkoutProgress, ExerciseProgress, ProgressData, ExerciseSets } from '../types';

interface WorkoutLog {
  sets: number[];
  completed: boolean;
}

interface DailyProgress {
  week: number;
  day: string;
  exercises: ProgressData;
  notes: string;
}

interface ChartData {
  week: string;
  [key: string]: string | number;
}

export function Dashboard() {
  const { user } = useAuth();
  const { resolvedTheme, themeColor, getAccentColorClass } = useTheme();

  // Log the current theme color to help debug
  console.log("Current theme color:", themeColor);
  // Log a CSS variable value to verify it's applied
  console.log("CSS Variable --color-primary-600:", getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600'));
  
  const selectedPlan = user?.selectedPlan || "Z Axis";
  const {
    progressData,
    currentWeek,
    updateProgress,
    getPlannedWorkout,
    trainingPrograms,
    exercises,
    dailyWorkouts,
    loadingWorkouts,
    getProgramUUID
  } = useWorkout();

  // Use consistent program ID format - either name or UUID
  const selectedPlanUUID = getProgramUUID(selectedPlan);
  console.log("Selected plan:", selectedPlan, "UUID:", selectedPlanUUID);
  
  const todaysWorkout = getPlannedWorkout(selectedPlanUUID);
  console.log("Today's workout:", todaysWorkout);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Convert WorkoutProgress to DailyProgress
  const todayProgress = progressData.find(
    (entry) => entry.week === currentWeek && entry.day === today
  );

  const currentWeekData: DailyProgress = {
    week: currentWeek,
    day: today,
    exercises: todayProgress?.exercises || {},
    notes: todayProgress?.notes || ""
  };

  const [workoutLogs, setWorkoutLogs] = useState<{ [key: string]: number[] }>({});
  const [error, setError] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (todaysWorkout && todaysWorkout.exercises.length > 0) {
      const newLogs: { [key: string]: number[] } = {};
      
      todaysWorkout.exercises.forEach((exercise) => {
        const exerciseKey = exercise.exerciseId;
        // Initialize with existing data if available, otherwise empty array
        const existingReps = todayProgress?.exercises?.[exerciseKey]?.sets || Array(exercise.sets).fill(0);
        newLogs[exerciseKey] = existingReps;
      });
      
      setWorkoutLogs(newLogs);
    }
  }, [todaysWorkout, todayProgress, currentWeek, today]);

  const handleSyncGoogleFit = async () => {
    if (!user) {
      toast.error('Please login to sync with Google Fit.');
      return;
    }

    setIsSyncing(true);
    setError('');

    try {
      await useAuth().signIn('google'); // Trigger Google Sign-in flow

      // The rest of the Google Fit data fetching logic will be handled after successful sign-in
      // in the AuthContext's useEffect when the user session changes.
      // We don't need to duplicate the data fetching here.
      toast.success('Please wait, syncing data from Google Fit...');

    } catch (error: any) {
      console.error('Google Fit sync error:', error.response || error.message);
      toast.error('Failed to sync with Google Fit. Please try again.');
      setError('Sync failed. Check your Google Fit connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!todaysWorkout || !user) return;

    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const programId = getProgramUUID(user.selectedPlan);
      
      // Calculate completion rate
      let totalSets = 0;
      let completedSets = 0;
      
      Object.values(workoutLogs).forEach(sets => {
        totalSets += sets.length;
        completedSets += sets.filter(reps => reps > 0).length;
      });
      
      const completionRate = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

      // Convert workoutLogs to ExerciseProgress format
      const exerciseProgress: { [exerciseId: string]: ExerciseProgress } = {};
      
      Object.entries(workoutLogs).forEach(([exerciseId, sets]) => {
        exerciseProgress[exerciseId] = {
          sets,
          completed: sets.some(reps => reps > 0)
        };
      });
      
      await updateProgress({
        week: currentWeek,
        day: today,
        date: new Date(),
        exercises: exerciseProgress,
        notes: currentWeekData.notes,
        completionRate,
        program_id: programId
      });

      toast.success('Workout saved!');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout');
    }
  };

  const latestWeekData = progressData.reduce<WorkoutProgress>((latest, current) => {
    return current.week > latest.week ? current : latest;
  }, progressData[0] || {
    id: '',
    userId: '',
    week: 0,
    day: '',
    date: new Date(),
    exercises: {},
    notes: '',
    completionRate: 0
  });

  const generateProgressChartData = () => {
    if (!dailyWorkouts || !progressData.length) return [];

    return progressData.map((entry): ChartData => {
      const chartEntry: ChartData = { week: `Week ${entry.week}` };
      
      if (entry.exercises) {
        Object.entries(entry.exercises).forEach(([exerciseId, data]) => {
          const exercise = exercises.find(e => e.id === exerciseId);
          if (exercise && data.sets && data.sets.length > 0) {
            // Use the maximum value from the sets as the progress indicator
            chartEntry[exercise.name] = Math.max(...data.sets);
          }
        });
      }
      
      return chartEntry;
    });
  };

  const progressChartData = generateProgressChartData();

  // Use these color utility functions to generate dynamic styles
  const getBgGradient = () => `bg-gradient-to-r from-${themeColor}-600 to-${themeColor}-500`;
  
  // More direct approach using CSS variables for icon backgrounds
  const getIconBg = (intensity = 100) => {
    const colorMap = {
      'indigo': intensity === 100 ? '#EEF2FF' : '#C7D2FE',
      'blue': intensity === 100 ? '#EFF6FF' : '#BFDBFE',
      'purple': intensity === 100 ? '#FAF5FF' : '#E9D5FF',
      'teal': intensity === 100 ? '#F0FDFA' : '#99F6E4',
      'emerald': intensity === 100 ? '#ECFDF5' : '#A7F3D0'
    };
    
    return {
      backgroundColor: colorMap[themeColor] || colorMap.indigo
    };
  };
  
  // More direct approach using CSS variables for icon colors
  const getIconColor = (intensity = 600) => {
    const colorMap = {
      'indigo': intensity === 600 ? '#4F46E5' : intensity === 400 ? '#818CF8' : '#6366F1',
      'blue': intensity === 600 ? '#2563EB' : intensity === 400 ? '#60A5FA' : '#3B82F6',
      'purple': intensity === 600 ? '#9333EA' : intensity === 400 ? '#C084FC' : '#8B5CF6',
      'teal': intensity === 600 ? '#0D9488' : intensity === 400 ? '#2DD4BF' : '#14B8A6',
      'emerald': intensity === 600 ? '#059669' : intensity === 400 ? '#34D399' : '#10B981'
    };
    
    return {
      color: colorMap[themeColor] || colorMap.indigo
    };
  };
  
  const getHoverBg = (intensity = 50) => `${getAccentColorClass('bg', intensity)}`;
  const getBtnBg = () => `${getAccentColorClass('bg', 600)}`;
  const getBtnHoverBg = () => `${getAccentColorClass('bg', 700)}`;

  // Additional utility functions for chart colors and other elements
  const getColorHex = (defaultColor = '6366F1') => {
    const colorMap = {
      'indigo': '6366F1',
      'blue': '3B82F6',
      'purple': '8B5CF6',
      'teal': '14B8A6',
      'emerald': '10B981'
    };
    return colorMap[themeColor] || defaultColor;
  };
  
  // Generate a coordinated color palette based on the theme color
  const getChartColorPalette = () => {
    const basePalettes = {
      'indigo': ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#F97316'],
      'blue': ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#F97316'],
      'purple': ['#8B5CF6', '#EC4899', '#6366F1', '#10B981', '#F59E0B', '#06B6D4', '#F97316'],
      'teal': ['#14B8A6', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#F97316'],
      'emerald': ['#10B981', '#14B8A6', '#06B6D4', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
    };
    
    return basePalettes[themeColor] || basePalettes.indigo;
  };

  // Get theme-specific gradient
  const getThemeGradient = () => {
    const gradients = {
      'indigo': 'linear-gradient(to right, rgba(79, 70, 229, 0.85), rgba(99, 102, 241, 0.85))',
      'blue': 'linear-gradient(to right, rgba(37, 99, 235, 0.85), rgba(59, 130, 246, 0.85))',
      'purple': 'linear-gradient(to right, rgba(126, 34, 206, 0.85), rgba(139, 92, 246, 0.85))',
      'teal': 'linear-gradient(to right, rgba(13, 148, 136, 0.85), rgba(20, 184, 166, 0.85))',
      'emerald': 'linear-gradient(to right, rgba(4, 120, 87, 0.85), rgba(16, 185, 129, 0.85))'
    };
    
    return gradients[themeColor] || gradients.indigo;
  };

  // Get theme-specific gradient for progress bars (more muted version)
  const getProgressBarGradient = () => {
    const gradients = {
      'indigo': 'linear-gradient(to right, rgba(79, 70, 229, 0.7), rgba(99, 102, 241, 0.7))',
      'blue': 'linear-gradient(to right, rgba(37, 99, 235, 0.7), rgba(59, 130, 246, 0.7))',
      'purple': 'linear-gradient(to right, rgba(126, 34, 206, 0.7), rgba(139, 92, 246, 0.7))',
      'teal': 'linear-gradient(to right, rgba(13, 148, 136, 0.7), rgba(20, 184, 166, 0.7))',
      'emerald': 'linear-gradient(to right, rgba(4, 120, 87, 0.7), rgba(16, 185, 129, 0.7))'
    };
    
    return gradients[themeColor] || gradients.indigo;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Helper function to check if an exercise has valid sets
  const hasValidSets = (exercise: ExerciseProgress | undefined): boolean => {
    const sets = exercise?.sets;
    return Boolean(sets && sets.length > 0);
  };

  // Helper function to check if an exercise is completed
  const isExerciseCompleted = (exercise: ExerciseProgress | undefined): boolean => {
    return Boolean(exercise?.completed && hasValidSets(exercise));
  };

  // Helper function to get the maximum value from an exercise's sets
  const getMaxSetValue = (exercise: ExerciseProgress | undefined): number => {
    const sets = exercise?.sets;
    if (!sets || sets.length === 0) return 0;
    return Math.max(...sets);
  };

  // Helper function to check if skill practice is completed
  const isSkillPracticeCompleted = (exercises: ProgressData): boolean => {
    const skillPractice = exercises.skillPractice;
    return Boolean(skillPractice?.completed);
  };

  // Use safe access to extract health metric values
  const getMetricValue = (metricName: string): number => {
    const entries = progressData.filter(entry => {
      const exercise = entry.exercises[metricName];
      return isExerciseCompleted(exercise);
    });
    
    if (entries.length === 0) return 0;
    
    const latestEntry = entries.reduce((latest, current) => 
      current.week > latest.week ? current : latest, entries[0]);
    
    return getMaxSetValue(latestEntry.exercises[metricName]);
  };

  const derivedSteps = getMetricValue('steps');
  const derivedCalories = getMetricValue('calories');
  const derivedActiveMinutes = getMetricValue('activeMinutes');

  // Add this helper function at the top of the component
  const getTrainingDuration = (startDate: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    return { days: diffDays, weeks: diffWeeks };
  };

  // Inside the Dashboard component, add this before the return statement
  const trainingDuration = getTrainingDuration(user?.trainingStartDate || new Date());
  const todayWorkout = getPlannedWorkout(selectedPlanUUID);
  const isRestDay = !todayWorkout || todayWorkout.exercises.length === 0;

  // Update the skill practice checkbox handler
  const handleSkillPracticeChange = async () => {
    if (!user) return;
    
    const isCurrentlyChecked = isSkillPracticeCompleted(currentWeekData.exercises);
    
    const newProgress: WorkoutProgress = {
      id: crypto.randomUUID(),
      userId: user.id,
      week: currentWeek,
      day: today,
      date: new Date(),
      exercises: {
        ...currentWeekData.exercises,
        skillPractice: {
          sets: [isCurrentlyChecked ? 0 : 1],
          completed: !isCurrentlyChecked
        }
      },
      notes: currentWeekData.notes,
      completionRate: 0
    };

    await updateProgress(newProgress);
  };

  // Update the notes change handler
  const handleNotesChange = async (value: string) => {
    if (!user) return;
    
    const newProgress: WorkoutProgress = {
      id: crypto.randomUUID(),
      userId: user.id,
      week: currentWeek,
      day: today,
      date: new Date(),
      exercises: currentWeekData.exercises,
      notes: value,
      completionRate: 0
    };

    await updateProgress(newProgress);
  };

  // Update the JSX for skill practice checkbox
  const renderSkillPractice = () => {
    const isCompleted = isSkillPracticeCompleted(currentWeekData.exercises);

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="skillPractice"
          checked={isCompleted}
          onChange={handleSkillPracticeChange}
          className="h-4 w-4 border-gray-300 rounded"
          style={{
            accentColor: `rgb(var(--color-primary-500))`,
            "--tw-ring-color": `rgb(var(--color-primary-500) / 0.5)`,
            backgroundColor: isCompleted ? 
              `rgb(var(--color-primary-100))` : undefined
          } as React.CSSProperties}
        />
        <label htmlFor="skillPractice" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
          Completed Skill Practice Session
        </label>
      </div>
    );
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700" variants={item}>
        <div 
          className="relative overflow-hidden p-4 md:p-6 rounded-2xl"
          style={{ 
            background: getThemeGradient(),
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <Activity className="h-32 w-32 md:h-40 md:w-40 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col space-y-3">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">
              Welcome back, {user?.name || 'Fitness Enthusiast'}
            </h1>
                <p className="text-white/90 text-sm">Let's crush your fitness goals today!</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center shadow-sm">
                  <Clock className="h-4 w-4 mr-1.5 text-white/90" />
                  <span className="text-white text-xs">Week {currentWeek}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center shadow-sm">
                  <Calendar className="h-4 w-4 mr-1.5 text-white/90" />
                  <span className="text-white text-xs">{today}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Health Metrics Section */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Activity style={getIconColor()} className="h-5 w-5 mr-2" />
            Today's Health Metrics
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSyncGoogleFit}
            disabled={isSyncing}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm transition-all duration-200 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              color: getIconColor().color,
              backgroundColor: getIconBg().backgroundColor,
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} style={getIconColor()} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Google Fit'}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div style={getIconBg()} className="dark:bg-gray-700 p-3 rounded-lg">
                <Activity style={getIconColor()} className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedSteps.toLocaleString()}
                </motion.p>
                <p className="text-xs mt-1 flex items-center" style={getIconColor()}>
                  <TrendingUp className="h-3 w-3 mr-1" style={getIconColor()} />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4 overflow-hidden">
              <div 
                className="h-1.5 rounded-full" 
                style={{ 
                  width: `${Math.min((derivedSteps / 10000) * 100, 100)}%`,
                  background: getProgressBarGradient(),
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedSteps / 10000) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div style={getIconBg()} className="dark:bg-gray-700 p-3 rounded-lg">
                <Dumbbell style={getIconColor()} className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedCalories.toFixed(0)}
                </motion.p>
                <p className="text-xs mt-1 flex items-center" style={getIconColor()}>
                  <Zap className="h-3 w-3 mr-1" style={getIconColor()} />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4 overflow-hidden">
              <div 
                className="h-1.5 rounded-full" 
                style={{ 
                  width: `${Math.min((derivedCalories / 2000) * 100, 100)}%`,
                  background: getProgressBarGradient(),
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedCalories / 2000) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div style={getIconBg()} className="dark:bg-gray-700 p-3 rounded-lg">
                <Award style={getIconColor()} className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Minutes</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedActiveMinutes}
                </motion.p>
                <p className="text-xs mt-1 flex items-center" style={getIconColor()}>
                  <TrendingUp className="h-3 w-3 mr-1" style={getIconColor()} />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4 overflow-hidden">
              <div 
                className="h-1.5 rounded-full" 
                style={{ 
                  width: `${Math.min((derivedActiveMinutes / 60) * 100, 100)}%`,
                  background: getProgressBarGradient(),
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedActiveMinutes / 60) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Today's Workout Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={item}>
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Dumbbell style={getIconColor()} className="h-5 w-5 mr-2" />
            Today's Workout ({today})
          </h2>
        </div>
        <div className="p-5">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {!todaysWorkout || todaysWorkout.exercises.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <AlertCircle style={getIconColor(400)} className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Rest Day</h3>
              <p className="text-gray-500 dark:text-gray-400">Today is your scheduled rest day. Take time to recover and prepare for your next workout!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysWorkout.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-200 flex items-center">
                      <CheckCircle style={getIconColor()} className="h-4 w-4 mr-2" />
                      {exercise.name}
                    </h3>
                    <span className="text-xs font-medium px-3 py-1 dark:bg-gray-700 rounded-full" style={{...getIconColor(), backgroundColor: `rgb(var(--color-primary-50))`}}>
                      {exercise.sets} sets × {exercise.targetReps} {exercise.type === 'reps' ? 'reps' : 'seconds'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                      const exerciseKey = exercise.exerciseId;
                      let wasCompletedPreviously = false;
                      
                      if (todayProgress && 
                          exercise.exerciseId in todayProgress.exercises && 
                          Array.isArray(todayProgress.exercises[exercise.exerciseId].sets) && 
                          setIndex < todayProgress.exercises[exercise.exerciseId].sets.length) {
                        wasCompletedPreviously = todayProgress.exercises[exercise.exerciseId].sets[setIndex] > 0;
                      }
                      
                      return (
                        <motion.div key={setIndex} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <div className="relative">
                            {wasCompletedPreviously && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <CheckCircle className="h-4 w-4" style={{ color: '#22C55E' }} />
                              </div>
                            )}
                          <input
                            type="number"
                            placeholder={`Set ${setIndex + 1}`}
                              className={`w-full px-3 py-2 rounded-md border ${wasCompletedPreviously 
                                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'} 
                                text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                                ${wasCompletedPreviously ? 'text-gray-500 dark:text-gray-400' : ''}`}
                              style={wasCompletedPreviously ? {} : {
                                "--tw-ring-color": `rgb(var(--color-primary-500) / 0.5)`
                              } as React.CSSProperties}
                            value={workoutLogs[exerciseKey]?.[setIndex] || ''}
                            onChange={(e) => {
                              const newLogs = { ...workoutLogs };
                              if (!newLogs[exerciseKey]) newLogs[exerciseKey] = Array(exercise.sets).fill('');
                                newLogs[exerciseKey][setIndex] = parseInt(e.target.value, 10) || 0;
                              setWorkoutLogs(newLogs);
                            }}
                          />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
              <motion.div
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {renderSkillPractice()}
              </motion.div>
              <motion.div
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workout Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2"
                  style={{
                    "--tw-ring-color": `rgb(var(--color-primary-500) / 0.5)`
                  } as React.CSSProperties}
                  placeholder="How did the workout feel?"
                  value={currentWeekData.notes || ""}
                  onChange={(e) => handleNotesChange(e.target.value)}
                />
              </motion.div>
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWorkout}
                className="w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md transition-all duration-200"
                style={{ 
                  background: getThemeGradient(),
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Save Today's Workout
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Progress Chart Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={item}>
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <TrendingUp style={getIconColor()} className="h-5 w-5 mr-2" />
            Your Progress
          </h2>
        </div>
        <div className="p-5">
          {progressChartData.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <AlertCircle style={getIconColor(400)} className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Progress Data Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Complete and save your workouts to start tracking your progress.</p>
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke={`#${getColorHex()}`} 
                         tickMargin={10} 
                         tick={{ fill: 'rgb(100, 100, 130)' }} />
                  <YAxis stroke={`#${getColorHex()}`} 
                         tick={{ fill: 'rgb(100, 100, 130)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: `1px solid #${getColorHex('E0E7FF')}20`,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  {progressChartData.length > 0 &&
                    Object.keys(progressChartData[0])
                      .filter((key) => key !== 'week')
                      .map((key, index) => {
                        // Use our coordinated color palette
                        const colors = getChartColorPalette();
                        const color = colors[index % colors.length];
                        return (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={color}
                            strokeWidth={2}
                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                            dot={{ stroke: color, strokeWidth: 2, r: 4, fill: 'white' }}
                            activeDot={{ stroke: color, strokeWidth: 2, r: 6, fill: color }}
                          />
                        );
                      })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
