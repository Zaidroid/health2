import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Dumbbell, CheckCircle, XCircle, AlertTriangle, ClipboardList, TrendingUp, Calendar as CalendarIcon, Edit, Activity, Target, Zap, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { ExerciseProgress, WorkoutProgress } from '../types';

// Map program names to their UUIDs
const PROGRAM_UUID_MAP: { [key: string]: string } = {
  'Z Axis': '550e8400-e29b-41d4-a716-446655440000',
  'T Bone': '550e8400-e29b-41d4-a716-446655440001'
};

interface WorkoutData {
  completed: boolean;
  exercises: string[];
  completionPercentage: number;
  achievements?: string[];
  notes?: string;
  exerciseProgress: { [exercise: string]: ExerciseProgress };
}

export function Calendar() {
  const [progressData, setProgressData] = useState<WorkoutProgress[]>([]);
  const { dailyWorkouts, getProgramUUID, updateProgress } = useWorkout();
  const { user } = useAuth();
  const { themeColor } = useTheme();
  const selectedPlan = user?.selectedPlan || "Z Axis";
  const selectedPlanUUID = getProgramUUID(selectedPlan);
  console.log("Calendar - Selected plan:", selectedPlan, "UUID:", selectedPlanUUID);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [editData, setEditData] = useState<{ exerciseProgress: Record<string, ExerciseProgress>; notes: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Function to get theme-specific colors
  const getThemeColors = () => {
    const colorMap = {
      'indigo': {
        primary: '#4F46E5',
        secondary: '#6366F1',
        gradient: 'linear-gradient(to right, #4f46e5, #6366f1)',
        light: 'rgba(238, 242, 255, 0.5)',
        dark: '#312E81',
        accent: '#818CF8'
      },
      'blue': {
        primary: '#2563EB',
        secondary: '#3B82F6',
        gradient: 'linear-gradient(to right, #2563eb, #3b82f6)',
        light: 'rgba(239, 246, 255, 0.5)',
        dark: '#1E3A8A',
        accent: '#60A5FA'
      },
      'purple': {
        primary: '#7E22CE',
        secondary: '#8B5CF6',
        gradient: 'linear-gradient(to right, #7e22ce, #8b5cf6)',
        light: 'rgba(250, 245, 255, 0.5)',
        dark: '#581C87',
        accent: '#A78BFA'
      },
      'teal': {
        primary: '#0D9488',
        secondary: '#14B8A6',
        gradient: 'linear-gradient(to right, #0d9488, #14b8a6)',
        light: 'rgba(240, 253, 250, 0.5)',
        dark: '#134E4A',
        accent: '#2DD4BF'
      },
      'emerald': {
        primary: '#047857',
        secondary: '#10B981',
        gradient: 'linear-gradient(to right, #047857, #10b981)',
        light: 'rgba(236, 253, 245, 0.5)',
        dark: '#064E3B',
        accent: '#34D399'
      }
    };
    
    return colorMap[themeColor] || colorMap.indigo;
  };

  const colors = getThemeColors();

  const previousMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
    setEditData(null);
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
    setEditData(null);
  };

  // Load progress data when component mounts
  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workout_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          // Transform the data to match our WorkoutProgress type
          const transformedData = data.map(entry => ({
            id: entry.id,
            userId: entry.user_id,
            program_id: entry.program_id,
            week: entry.week,
            day: entry.day,
            date: new Date(entry.date),
            exercises: entry.exercises || {},
            notes: entry.notes || '',
            completionRate: entry.completion_rate || 0
          }));
          
          setProgressData(transformedData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        toast.error('Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [user]);

  // Update edit data when selected date changes
  useEffect(() => {
    if (selectedDate && !isLoading) {
      const workout = getWorkoutForDate(selectedDate);
      if (!workout) return;

      const dayOfWeek = format(selectedDate, 'EEEE');
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const dayProgress = progressData.find(entry => 
        entry.week === getCurrentWeek() && 
        entry.day === dayOfWeek && 
        format(entry.date, 'yyyy-MM-dd') === formattedDate
      );

      setEditData({
        exerciseProgress: dayProgress?.exercises || workout.exerciseProgress,
        notes: dayProgress?.notes || workout.notes || ''
      });
    }
  }, [selectedDate, progressData, isLoading]);

  // Helper function to get current week
  const getCurrentWeek = () => {
    // In a real app, this would be calculated based on the training start date
    return Math.ceil((new Date().getTime() - new Date(user?.trainingStartDate || new Date()).getTime()) / (7 * 24 * 60 * 60 * 1000));
  };

  const getWorkoutForDate = (date: Date): WorkoutData | null => {
    const dayOfWeek = format(date, 'EEEE');
    const weekSchedule = dailyWorkouts[selectedPlanUUID]?.[getCurrentWeek()];
    if (!weekSchedule) return null;

    const dailyWorkout = weekSchedule.find((workout) => workout.day === dayOfWeek);
    if (!dailyWorkout) return null;

    // Find progress for this specific date
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayProgress = progressData.find(entry => 
      entry.week === getCurrentWeek() && 
      entry.day === dayOfWeek && 
      format(entry.date, 'yyyy-MM-dd') === formattedDate
    );

    const workoutDisplay: WorkoutData = {
      completed: false,
      exercises: dailyWorkout.exercises.map((ex) => ex.name),
      completionPercentage: 0,
      achievements: [],
      notes: dayProgress?.notes || '',
      exerciseProgress: {},
    };

    let completedExercises = 0;
    dailyWorkout.exercises.forEach((exercise) => {
      const exerciseProgress = dayProgress?.exercises?.[exercise.name] || {
        sets: Array(exercise.sets).fill(0),
        completed: false
      };
      
      workoutDisplay.exerciseProgress[exercise.name] = exerciseProgress;
      
      if (exerciseProgress.completed || 
         (exerciseProgress.sets && exerciseProgress.sets.some((rep: number) => rep > 0))) {
        completedExercises++;
      }
    });

    workoutDisplay.completionPercentage =
      dailyWorkout.exercises.length > 0
        ? (completedExercises / dailyWorkout.exercises.length) * 100
        : 0;
    workoutDisplay.completed = workoutDisplay.completionPercentage === 100;

    return workoutDisplay;
  };

  const handleEditChange = (exercise: string, setIndex: number, value: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      
      const newData = { ...prev };
      // Create a deep copy of the exercise progress
      const exerciseProgress = { ...prev.exerciseProgress };
      
      // Initialize exercise if it doesn't exist
      if (!exerciseProgress[exercise]) {
        exerciseProgress[exercise] = {
          sets: [],
          completed: false
        };
      }
      
      // Create a new sets array if needed
      if (!exerciseProgress[exercise].sets) {
        exerciseProgress[exercise].sets = [];
      }
      
      // Create a copy of the sets array
      const sets = [...exerciseProgress[exercise].sets];
      sets[setIndex] = parseInt(value, 10) || 0;
      
      // Update the exercise progress with new sets
      exerciseProgress[exercise] = {
        ...exerciseProgress[exercise],
        sets,
        completed: sets.some(rep => rep > 0)
      };
      
      return {
        ...newData,
        exerciseProgress
      };
    });
  };

  const handleNotesChange = (value: string) => {
    setEditData((prev) => {
      const newData = prev || { exerciseProgress: {}, notes: '' };
      return { ...newData, notes: value };
    });
  };

  const saveEdits = async () => {
    if (!selectedDate || !user) {
      toast.error('Please sign in to save your workout data.');
      return;
    }

    const workout = getWorkoutForDate(selectedDate);
    if (!workout) {
      toast.error('No workout scheduled for this day.');
      return;
    }

    const dayOfWeek = format(selectedDate, 'EEEE');
    const formattedDate = selectedDate;
    const exercisesToSave = editData?.exerciseProgress || workout.exerciseProgress;
    const notesToSave = editData?.notes !== undefined ? editData.notes : workout.notes || '';

    try {
      // Calculate completion rate
      let totalExercises = Object.keys(exercisesToSave).length;
      let completedExercises = Object.values(exercisesToSave).filter(ex => 
        ex.completed || (ex.sets && ex.sets.some(rep => rep > 0))
      ).length;
      
      const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

      // Create progress entry for the database
      const progressEntry: Partial<WorkoutProgress> = {
        week: getCurrentWeek(),
        day: dayOfWeek,
        date: formattedDate,
        exercises: exercisesToSave,
        notes: notesToSave,
        completionRate
      };

      // Use the updateProgress function from WorkoutContext
      await updateProgress(progressEntry);

      toast.success('Progress saved successfully');
      setEditData(null);
      
      // Update local state to reflect the changes
      setProgressData(prevData => {
        const newData = [...prevData];
        const existingEntryIndex = newData.findIndex(
          entry => entry.week === getCurrentWeek() && 
                  entry.day === dayOfWeek && 
                  format(entry.date, 'yyyy-MM-dd') === format(formattedDate, 'yyyy-MM-dd')
        );
        
        if (existingEntryIndex !== -1) {
          // Update existing entry
          newData[existingEntryIndex] = {
            ...newData[existingEntryIndex],
            exercises: exercisesToSave,
            notes: notesToSave,
            completionRate
          };
        } else {
          // Add new entry (with a temporary ID)
          newData.push({
            id: crypto.randomUUID(),
            userId: user.id,
            program_id: selectedPlanUUID,
            week: getCurrentWeek(),
            day: dayOfWeek,
            date: formattedDate,
            exercises: exercisesToSave,
            notes: notesToSave,
            completionRate
          });
        }
        
        return newData;
      });

    } catch (error) {
      console.error('Error saving edits:', error);
      toast.error('Failed to save workout. Please try again.');
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const analytics = useMemo(() => {
    let totalWorkouts = 0;
    const workoutTypes: { [key: string]: number } = {};
    let totalCompletionPercentage = 0;
    let completedWorkouts = 0;

    days.forEach((day) => {
      const workout = getWorkoutForDate(day);
      if (workout) {
        totalWorkouts++;
        totalCompletionPercentage += workout.completionPercentage;
        if (workout.completed) completedWorkouts++;
        workout.exercises.forEach((exercise) => {
          workoutTypes[exercise] = (workoutTypes[exercise] || 0) + 1;
        });
      }
    });

    const averageCompletionPercentage = totalWorkouts > 0 ? totalCompletionPercentage / totalWorkouts : 0;
    const mostFrequentWorkout = Object.entries(workoutTypes).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

    return {
      totalWorkouts,
      averageCompletionPercentage,
      mostFrequentWorkout,
      completedWorkouts,
    };
  }, [currentDate, days, progressData, selectedPlanUUID, user]);

  const getDayColor = (date: Date) => {
    const workout = getWorkoutForDate(date);
    if (!workout) return '';
    if (workout.completed) return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300';
    if (workout.completionPercentage > 0) return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300';
    return 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300';
  };

  // Get theme-specific gradient
  const getThemeGradient = (opacity = 0.85) => {
    const gradients = {
      'indigo': `linear-gradient(to right, rgba(79, 70, 229, ${opacity}), rgba(99, 102, 241, ${opacity}))`,
      'blue': `linear-gradient(to right, rgba(37, 99, 235, ${opacity}), rgba(59, 130, 246, ${opacity}))`,
      'purple': `linear-gradient(to right, rgba(126, 34, 206, ${opacity}), rgba(139, 92, 246, ${opacity}))`,
      'teal': `linear-gradient(to right, rgba(13, 148, 136, ${opacity}), rgba(20, 184, 166, ${opacity}))`,
      'emerald': `linear-gradient(to right, rgba(4, 120, 87, ${opacity}), rgba(16, 185, 129, ${opacity}))`
    };
    return gradients[themeColor] || gradients.indigo;
  };

  // Get theme-specific colors for accents
  const getAccentColor = (opacity = 1) => {
    const colors = {
      'indigo': `rgba(99, 102, 241, ${opacity})`,
      'blue': `rgba(59, 130, 246, ${opacity})`,
      'purple': `rgba(139, 92, 246, ${opacity})`,
      'teal': `rgba(20, 184, 166, ${opacity})`,
      'emerald': `rgba(16, 185, 129, ${opacity})`
    };
    return colors[themeColor] || colors.indigo;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6" 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
    >
      {/* Header Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
        <div 
          className="relative overflow-hidden p-4 md:p-6 rounded-2xl"
          style={{ 
            background: getThemeGradient(),
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <Activity className="h-32 w-32 md:h-40 md:w-40 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg md:text-xl font-bold text-white">Workout Calendar</h1>
              <div className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={previousMonth}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextMonth}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <Target className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Completion</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {analytics.completedWorkouts}/{analytics.totalWorkouts}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Success Rate</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {Math.round(analytics.averageCompletionPercentage)}%
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <Dumbbell className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Most Common</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white truncate">
                  {analytics.mostFrequentWorkout}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Current Month</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {format(currentDate, 'MMMM')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Monthly Overview
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-7 gap-4 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentDate.toString()}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="grid grid-cols-7 gap-4"
              >
                {days.map((day, dayIdx) => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayColor = getDayColor(day);
                  const workout = getWorkoutForDate(day);

                  return (
                    <motion.button
                      key={day.toString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "relative h-12 sm:h-16 p-1 rounded-lg text-sm transition-colors flex flex-col items-center justify-center",
                        !isSameMonth(day, currentDate) && "text-gray-400 dark:text-gray-600",
                        isToday(day) && "ring-2",
                        isSelected && "ring-2",
                        dayColor,
                        !dayColor && "hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      style={{
                        ...(isToday(day) && { '--ring-color': getAccentColor() }),
                        ...(isSelected && { '--ring-color': getAccentColor(0.8) }),
                        ...(isToday(day) || isSelected ? { 
                          borderColor: 'var(--ring-color)',
                          boxShadow: '0 0 0 2px var(--ring-color)'
                        } : {})
                      } as React.CSSProperties}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')} className="font-medium">
                        {format(day, 'd')}
                      </time>
                      {workout && (
                        <div className="mt-1 flex items-center">
                          {workout.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : workout.completionPercentage > 0 ? (
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Workout Details Section */}
        {selectedDate && editData && (
          <motion.section 
            className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            variants={itemVariants}
          >
            <div className="border-b border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveEdits}
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                  style={{ background: getThemeGradient() }}
                >
                  Save Progress
                </motion.button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-200">Exercises</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.entries(editData.exerciseProgress).map(([exercise, exerciseProgress]) => (
                      <div
                        key={exercise}
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-200">{exercise}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {exerciseProgress.sets.filter(r => r > 0).length} / {exerciseProgress.sets.length} sets
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {exerciseProgress.sets.map((rep, idx) => (
                            <div key={idx} className="space-y-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400">
                                Set {idx + 1}
                              </label>
                              <input
                                type="number"
                                value={rep}
                                onChange={(e) => handleEditChange(exercise, idx, e.target.value)}
                                className="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                style={{
                                  borderColor: getAccentColor(0.3),
                                  "--tw-ring-color": getAccentColor(0.5)
                                } as React.CSSProperties}
                                min="0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-200">Notes</h3>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Add your workout notes here..."
                    className="w-full h-40 p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 resize-none text-gray-900 dark:text-gray-100"
                    style={{
                      borderColor: getAccentColor(0.3),
                      "--tw-ring-color": getAccentColor(0.5)
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
