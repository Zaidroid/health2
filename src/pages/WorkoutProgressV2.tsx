import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  Target,
  Dumbbell,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowUp,
  Flame,
  Zap,
  Activity,
  AlertCircle,
  CalendarOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { WorkoutProgress, DailyWorkout, ExerciseProgress } from '../types';

interface WorkoutInsight {
  type: 'success' | 'warning' | 'info';
  icon: LucideIcon;
  title: string;
  message: string;
}

interface WorkoutStats {
  volumeChange: number;
  completionRate: number;
  targetProgress: Record<string, number>;
}

interface TrainingSchedule {
  [programId: string]: {
    [week: number]: DailyWorkout[];
  };
}

interface ProgressionPlan {
  [programId: string]: {
    [week: number]: {
      [exerciseName: string]: string;
    };
  };
}

// Map program names to their UUIDs
const PROGRAM_UUID_MAP: { [key: string]: string } = {
  'Z Axis': '550e8400-e29b-41d4-a716-446655440000',
  'T Bone': '550e8400-e29b-41d4-a716-446655440001'
};

export function WorkoutProgressV2() {
  const { currentWeek, setCurrentWeek, progressData, dailyWorkouts, getProgramUUID } = useWorkout();
  const { user } = useAuth();
  const { themeColor, resolvedTheme } = useTheme();
  const selectedPlan = user?.selectedPlan || "Z Axis";
  const selectedPlanUUID = getProgramUUID(selectedPlan);
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'completionRate' | 'avgReps'>('volume');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // For backward compatibility, we'll create empty trainingSchedules if needed
  const trainingSchedules: TrainingSchedule = useMemo(() => {
    return dailyWorkouts || {};
  }, [dailyWorkouts]);

  // Mock progression plans - should be fetched from the database in a real app
  const progressionPlans: ProgressionPlan = useMemo(() => ({
    [PROGRAM_UUID_MAP['Z Axis']]: {
      1: { 'Push-ups': '10-15', 'Pull-ups': '3-5', 'Bodyweight Squats': '15' },
      2: { 'Push-ups': '12-18', 'Pull-ups': '5-8', 'Bodyweight Squats': '20' },
      3: { 'Push-ups': '15-20', 'Pull-ups': '8-10', 'Bodyweight Squats': '25' },
    },
    [PROGRAM_UUID_MAP['T Bone']]: {
      1: { 'Dumbbell Bicep Curls': '10-12', 'Plank': '30-45' },
      2: { 'Dumbbell Bicep Curls': '12-15', 'Plank': '45-60' },
    }
  }), []);

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

  // Calculate workout statistics
  const calculateVolumeChange = () => {
    const currentWeekData = progressData.filter(entry => entry.week === currentWeek);
    const previousWeekData = progressData.filter(entry => entry.week === currentWeek - 1);

    const currentVolume = currentWeekData.reduce((total, entry) => {
      return total + Object.values(entry.exercises || {}).reduce((sum, exercise) => {
        if (exercise && 'sets' in exercise && Array.isArray(exercise.sets)) {
          return sum + exercise.sets.reduce((setSum, rep) => setSum + (rep || 0), 0);
        }
        return sum;
      }, 0);
    }, 0);

    const previousVolume = previousWeekData.reduce((total, entry) => {
      return total + Object.values(entry.exercises || {}).reduce((sum, exercise) => {
        if (exercise && 'sets' in exercise && Array.isArray(exercise.sets)) {
          return sum + exercise.sets.reduce((setSum, rep) => setSum + (rep || 0), 0);
        }
        return sum;
      }, 0);
    }, 0);

    return previousVolume > 0 ? ((currentVolume - previousVolume) / previousVolume) * 100 : 0;
  };

  const calculateCompletionRate = () => {
    const currentWeekData = progressData.filter(entry => entry.week === currentWeek);
    const programWorkouts = trainingSchedules[selectedPlanUUID]?.[currentWeek] || [];
    const totalWorkouts = programWorkouts.filter((day: DailyWorkout) => day.exercises.length > 0).length || 0;
    const completedWorkouts = new Set(currentWeekData.map(entry => entry.day)).size;
    return totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
  };

  const calculateTargetProgress = () => {
    const currentWeekData = progressData.filter(entry => entry.week === currentWeek);
    const currentTargets = progressionPlans[selectedPlanUUID]?.[currentWeek] || {};
    
    return Object.entries(currentTargets).reduce((acc, [exercise, targetValue]) => {
      const exerciseData = currentWeekData
        .flatMap(entry => {
          const exerciseProgress = entry.exercises?.[exercise];
          if (exerciseProgress && 'sets' in exerciseProgress && Array.isArray(exerciseProgress.sets)) {
            return exerciseProgress.sets.filter(rep => rep > 0);
          }
          return [];
        });
      
      if (exerciseData.length > 0) {
        const maxRep = Math.max(...exerciseData);
        const targetNum = parseInt(targetValue.split('-')[1] || targetValue, 10);
        acc[exercise] = (maxRep / targetNum) * 100;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  // Calculate personalized insights
  const personalizedInsights = useMemo(() => {
    const insights: WorkoutInsight[] = [];
    
    // Get workout stats from your data source
    const stats: WorkoutStats = {
      volumeChange: calculateVolumeChange(),
      completionRate: calculateCompletionRate(),
      targetProgress: calculateTargetProgress(),
    };
    
    // Volume trend insight
    if (Math.abs(stats.volumeChange) > 10) {
      insights.push({
        type: stats.volumeChange > 0 ? 'success' : 'warning',
        icon: stats.volumeChange > 0 ? TrendingUp : ArrowUp,
        title: stats.volumeChange > 0 ? 'Great Progress!' : 'Volume Decreased',
        message: stats.volumeChange > 0
          ? `You've increased your workout volume by ${stats.volumeChange.toFixed(0)}% this week. Keep up the momentum!`
          : `Your workout volume has decreased by ${Math.abs(stats.volumeChange).toFixed(0)}%. Try to maintain consistency in your workouts.`
      });
    }

    // Completion rate insight
    if (stats.completionRate < 70) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Room for Improvement',
        message: `Your workout completion rate is ${stats.completionRate.toFixed(0)}%. Try to complete more of your scheduled workouts to stay on track.`
      });
    } else if (stats.completionRate >= 90) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Consistency!',
        message: `You've completed ${stats.completionRate.toFixed(0)}% of your workouts this week. Outstanding commitment!`
      });
    }

    // Target progress insights
    const targetProgressEntries = Object.entries(stats.targetProgress);
    if (targetProgressEntries.length > 0) {
      const bestExercise = targetProgressEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      const worstExercise = targetProgressEntries.reduce((a, b) => a[1] < b[1] ? a : b);

      if (bestExercise[1] >= 90) {
        insights.push({
          type: 'success',
          icon: Award,
          title: 'Personal Best',
          message: `You're excelling at ${bestExercise[0]} with ${bestExercise[1].toFixed(0)}% of your target. Consider increasing the difficulty!`
        });
      }

      if (worstExercise[1] < 60) {
        insights.push({
          type: 'info',
          icon: Dumbbell,
          title: 'Focus Area',
          message: `${worstExercise[0]} might need more attention. You're at ${worstExercise[1].toFixed(0)}% of your target.`
        });
      }
    }

    return insights;
  }, [currentWeek, progressData, selectedPlanUUID, trainingSchedules, progressionPlans]);

  // Prepare chart data with more meaningful metrics
  const chartData = useMemo(() => {
    const volumeData = Array.from({ length: 4 }, (_, i) => {
      const weekNum = currentWeek - (3 - i);
      if (weekNum <= 0) return null;

      const weekData = progressData.filter(entry => entry.week === weekNum);
      
      // Calculate total volume using updated data structure
      const volume = weekData.reduce((total, entry) => {
        return total + Object.values(entry.exercises || {}).reduce((sum, exercise) => {
          if (exercise && 'sets' in exercise && Array.isArray(exercise.sets)) {
            return sum + exercise.sets.reduce((setSum, rep) => setSum + (rep || 0), 0);
          }
          return sum;
        }, 0);
      }, 0);

      // Calculate completion rate
      const programWorkouts = trainingSchedules[selectedPlanUUID]?.[weekNum] || [];
      const totalWorkouts = programWorkouts.filter((day: DailyWorkout) => day.exercises.length > 0).length || 0;
      const completedWorkouts = new Set(weekData.map(entry => entry.day)).size;
      const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

      // Calculate average reps per exercise
      const exerciseCount = weekData.reduce((count, entry) => {
        return count + Object.keys(entry.exercises || {}).length;
      }, 0);
      const avgRepsPerExercise = exerciseCount > 0 ? volume / exerciseCount : 0;

      return {
        week: `Week ${weekNum}`,
        volume,
        completionRate,
        avgReps: Math.round(avgRepsPerExercise),
        target: progressionPlans[selectedPlanUUID]?.[weekNum]?.['Push-ups']?.split('-')[1] || '0',
      };
    }).filter(Boolean);

    return volumeData;
  }, [currentWeek, progressData, selectedPlanUUID, progressionPlans, trainingSchedules]);

  // Get theme-specific colors for charts
  const getChartColors = () => {
    const colors = {
      'indigo': ['#818CF8', '#4F46E5'],
      'blue': ['#60A5FA', '#2563EB'],
      'purple': ['#A78BFA', '#7C3AED'],
      'teal': ['#2DD4BF', '#0D9488'],
      'emerald': ['#34D399', '#059669']
    };
    return colors[themeColor] || colors.indigo;
  };

  // Get theme-specific colors for accents throughout the page
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

  // Helper function to safely get sets from exercise progress
  const getSetsFromExercise = (
    progress: WorkoutProgress | undefined, 
    exerciseName: string
  ): number[] => {
    if (!progress || !progress.exercises) return [];
    
    const exercise = progress.exercises[exerciseName];
    if (!exercise || !('sets' in exercise) || !Array.isArray(exercise.sets)) {
      return [];
    }
    
    return exercise.sets;
  };

  // Helper function to check if exercise is completed
  const isExerciseCompleted = (
    progress: WorkoutProgress | undefined, 
    exerciseName: string
  ): boolean => {
    const sets = getSetsFromExercise(progress, exerciseName);
    return sets.some(rep => rep > 0);
  };

  // Get max rep from sets
  const getMaxRep = (sets: number[]): number => {
    if (sets.length === 0) return 0;
    return Math.max(...sets.filter(rep => rep > 0));
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
              <h1 className="text-lg md:text-xl font-bold text-white">Week {currentWeek} Progress</h1>
              <div className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => currentWeek > 1 && setCurrentWeek(currentWeek - 1)}
                  className={`p-1.5 rounded-full bg-white/10 text-white ${currentWeek === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                  disabled={currentWeek === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentWeek(currentWeek + 1)}
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
                  {calculateCompletionRate().toFixed(0)}%
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Volume</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white flex items-center">
                  {calculateVolumeChange() > 0 && '+'}
                  {calculateVolumeChange().toFixed(1)}%
                  {calculateVolumeChange() !== 0 && (
                    <ArrowUp 
                      className={`h-3.5 w-3.5 ml-1 ${calculateVolumeChange() > 0 ? 'text-green-400' : 'text-red-400 rotate-180'}`} 
                    />
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <Flame className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Streak</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {progressData.length} days
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-center text-white/80 mb-0.5">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Avg. Reps</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {Math.round(progressData.reduce((total, entry) => {
                    return total + Object.values(entry.exercises || {}).reduce((sum, exercise) => {
                      if (exercise && 'sets' in exercise && Array.isArray(exercise.sets)) {
                        return sum + exercise.sets.reduce((setSum, rep) => setSum + (rep || 0), 0);
                      }
                      return sum;
                    }, 0);
                  }, 0) / (progressData.length || 1))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Section */}
        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Weekly Progress
            </h2>
          </div>
          <div className="p-5">
            {chartData.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4" style={{ color: getAccentColor(0.8) }} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Progress Data Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Complete more workouts to see your progress charts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                    <button
                      onClick={() => setSelectedMetric('volume')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                        selectedMetric === 'volume' 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Volume
                    </button>
                    <button
                      onClick={() => setSelectedMetric('completionRate')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                        selectedMetric === 'completionRate'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Completion
                    </button>
                    <button
                      onClick={() => setSelectedMetric('avgReps')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                        selectedMetric === 'avgReps'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Avg. Reps
                    </button>
                  </div>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="week" 
                        stroke={resolvedTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                      <YAxis 
                        stroke={resolvedTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        label={{ 
                          value: selectedMetric === 'completionRate' ? 'Completion %' : 
                                 selectedMetric === 'avgReps' ? 'Average Reps' : 'Total Volume',
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: resolvedTheme === 'dark' ? '#9CA3AF' : '#6B7280' } 
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: resolvedTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                          border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#E5E7EB'}`,
                          borderRadius: '0.5rem',
                        }}
                        formatter={(value: number) => [
                          selectedMetric === 'completionRate' ? `${value.toFixed(0)}%` :
                          selectedMetric === 'avgReps' ? `${value.toFixed(0)} reps` :
                          value.toLocaleString(),
                          selectedMetric === 'completionRate' ? 'Completion Rate' :
                          selectedMetric === 'avgReps' ? 'Average Reps' :
                          'Total Volume'
                        ]}
                      />
                      <Bar 
                        dataKey={selectedMetric}
                        fill={getAccentColor(0.8)}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Personalized Insights Section */}
        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <Zap className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Personalized Insights
            </h2>
          </div>
          <div className="p-5">
            {personalizedInsights.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4" style={{ color: getAccentColor(0.8) }} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Insights Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Complete more workouts to receive personalized insights!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-auto">
                {personalizedInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col p-4 rounded-lg border ${
                      insight.type === 'success'
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        : insight.type === 'warning'
                        ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: 'fit-content' }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        insight.type === 'success'
                          ? 'bg-green-100 dark:bg-green-800'
                          : insight.type === 'warning'
                          ? 'bg-yellow-100 dark:bg-yellow-800'
                          : 'bg-blue-100 dark:bg-blue-800'
                      }`}>
                        <insight.icon className={`h-5 w-5 ${
                          insight.type === 'success'
                            ? 'text-green-600 dark:text-green-200'
                            : insight.type === 'warning'
                            ? 'text-yellow-600 dark:text-yellow-200'
                            : 'text-blue-600 dark:text-blue-200'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{insight.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            insight.type === 'success'
                              ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-200'
                              : insight.type === 'warning'
                              ? 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-200'
                              : 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200'
                          }`}>
                            {insight.type === 'success' ? 'Achievement' : insight.type === 'warning' ? 'Action Needed' : 'Insight'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">{insight.message}</p>
                        
                        {/* Additional Context Section */}
                        {insight.type === 'success' && insight.title.includes('Progress') && (
                          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-600 dark:text-green-200">Volume Increase</span>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                +{Math.abs(calculateVolumeChange()).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {insight.title.includes('Consistency') && (
                          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-blue-600 dark:text-blue-200">Completion Rate</span>
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {calculateCompletionRate().toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {insight.title.includes('Personal Best') && (
                          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-600 dark:text-green-200">
                              <div className="flex justify-between items-center mb-1">
                                <span>Progress to Next Level</span>
                                <span className="font-medium">90%</span>
                              </div>
                              <div className="h-1.5 bg-green-100 dark:bg-green-800 rounded-full">
                                <div
                                  className="h-full rounded-full bg-green-500 dark:bg-green-400"
                                  style={{ width: '90%' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {insight.title.includes('Focus Area') && (
                          <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-yellow-600 dark:text-yellow-200">Current Level</span>
                              <span className="font-medium text-yellow-700 dark:text-yellow-300">
                                Beginner
                              </span>
                            </div>
                            <div className="mt-2 flex items-center space-x-1">
                              <Clock className="h-3.5 w-3.5 text-yellow-500" />
                              <span className="text-xs text-yellow-600 dark:text-yellow-200">
                                Estimated 2 weeks to next level
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Additional Summary Cards for Desktop */}
                {personalizedInsights.length > 0 && personalizedInsights.length < 4 && (
                  <>
                    <motion.div
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ height: 'fit-content' }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <Activity className="h-5 w-5" style={{ color: getAccentColor() }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Weekly Activity</h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {calculateCompletionRate().toFixed(0)}% completion rate this week
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${calculateCompletionRate()}%`,
                            backgroundColor: getAccentColor(0.8)
                          }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ height: 'fit-content' }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <Target className="h-5 w-5" style={{ color: getAccentColor() }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Goal Progress</h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {Object.keys(calculateTargetProgress()).length} exercises tracked
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {Object.entries(calculateTargetProgress())
                          .slice(0, 3)
                          .map(([exercise, progress]) => (
                            <div key={exercise} className="text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {exercise}
                              </div>
                              <div className="mt-1 text-sm font-medium" style={{ color: getAccentColor() }}>
                                {progress.toFixed(0)}%
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Exercise Progress Section */}
        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <Target className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Exercise Progress
            </h2>
          </div>
          <div className="p-5">
            {Object.entries(calculateTargetProgress()).length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4" style={{ color: getAccentColor(0.8) }} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Progress Data Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Complete your workouts to track progress towards your targets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(calculateTargetProgress()).map(([exercise, progress]) => (
                  <div key={exercise} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{exercise}</span>
                      <span className="text-sm font-medium" style={{ 
                        color: progress >= 90 ? '#22C55E' : progress >= 60 ? '#F59E0B' : '#EF4444' 
                      }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: progress >= 90 
                            ? 'linear-gradient(to right, rgba(34, 197, 94, 0.7), rgba(34, 197, 94, 0.9))' 
                            : progress >= 60
                            ? 'linear-gradient(to right, rgba(245, 158, 11, 0.7), rgba(245, 158, 11, 0.9))'
                            : 'linear-gradient(to right, rgba(239, 68, 68, 0.7), rgba(239, 68, 68, 0.9))'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Daily Breakdown Section */}
        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={itemVariants}>
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <Calendar className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Daily Breakdown
            </h2>
          </div>
          
          <div className="p-5">
            {(!trainingSchedules[selectedPlanUUID] || !trainingSchedules[selectedPlanUUID][currentWeek] || trainingSchedules[selectedPlanUUID][currentWeek].length === 0) ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4" style={{ color: getAccentColor(0.8) }} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Schedule Available</h3>
                <p className="text-gray-500 dark:text-gray-400">No training schedule found for this week.</p>
              </div>
            ) : (
              <>
                {/* Day Tabs Navigation - Improved for mobile */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {trainingSchedules[selectedPlanUUID][currentWeek].map((day: DailyWorkout) => {
                    const dayProgress = progressData.find(
                      entry => entry.week === currentWeek && entry.day === day.day
                    );
                    
                    const hasCompletedExercises = dayProgress && 
                      Object.keys(dayProgress.exercises || {}).length > 0 &&
                      Object.values(dayProgress.exercises || {}).some(ex => 
                        ex && 'sets' in ex && Array.isArray(ex.sets) && ex.sets.some(rep => rep > 0)
                      );
                      
                    const dayAbbr = day.day.substring(0, 3);
                    
                    return (
                      <motion.button
                        key={day.day}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        onClick={() => setSelectedDay(day.day)}
                        className={`py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center ${
                          selectedDay === day.day 
                            ? `bg-${themeColor}-100 dark:bg-${themeColor}-900/30 text-${themeColor}-800 dark:text-${themeColor}-300`
                            : hasCompletedExercises
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        style={selectedDay === day.day ? {
                          backgroundColor: resolvedTheme === 'dark' 
                            ? `${getAccentColor(0.3)}` 
                            : `${getAccentColor(0.1)}`,
                          color: resolvedTheme === 'dark'
                            ? `${getAccentColor(0.9)}`
                            : `${getAccentColor(0.8)}`
                        } : {}}
                      >
                        <span>{dayAbbr}</span>
                        {hasCompletedExercises && (
                          <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Day Content */}
                {trainingSchedules[selectedPlanUUID][currentWeek].map((day: DailyWorkout) => {
                  if (day.day !== selectedDay) return null;
                  
                  const dayProgress = progressData.find(
                    entry => entry.week === currentWeek && entry.day === day.day
                  );
                  
                  const hasCompletedExercises = dayProgress && 
                    Object.keys(dayProgress.exercises || {}).length > 0 &&
                    Object.values(dayProgress.exercises || {}).some(ex => 
                      ex && 'sets' in ex && Array.isArray(ex.sets) && ex.sets.some(rep => rep > 0)
                    );

                  return (
                    <motion.div 
                      key={day.day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{day.day}'s Workout</h3>
                        {hasCompletedExercises && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                      
                      {day.exercises.length > 0 ? (
                        <div className="space-y-3">
                          {day.exercises.map((exercise) => {
                            const sets = getSetsFromExercise(dayProgress, exercise.name);
                            const exerciseCompleted = isExerciseCompleted(dayProgress, exercise.name);
                            const maxRep = getMaxRep(sets);
                            
                            const targetValue = progressionPlans[selectedPlanUUID]?.[currentWeek]?.[exercise.name] || '0';
                            const targetNum = parseInt(targetValue.split('-')[1] || targetValue, 10);
                            const progressPercentage = targetNum > 0 ? (maxRep / targetNum) * 100 : 0;

                            return (
                              <div
                                key={exercise.name}
                                className={`p-3 rounded-lg border ${
                                  exerciseCompleted 
                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{exercise.name}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {exercise.sets} sets × {exercise.targetReps} {exercise.type === 'reps' ? 'reps' : 'sec'}
                                  </span>
                                </div>
                                
                                {exerciseCompleted && progressPercentage > 0 && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress to target</span>
                                      <span className="font-medium">{Math.min(progressPercentage, 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                          width: `${Math.min(progressPercentage, 100)}%`,
                                          backgroundColor: progressPercentage >= 100 ? '#22C55E' : getAccentColor(0.8)
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CalendarOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">Rest day</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Take time to recover and prepare for your next workout!</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
