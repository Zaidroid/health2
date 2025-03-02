import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { HealthMetrics, Exercise } from '../types';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { user } = useAuth();
  const { progressData, currentWeek, updateProgressEntry } = useWorkout();
  
  // Get the current week's progress data
  const currentWeekData = progressData.find(entry => entry.week === currentWeek) || {
    week: currentWeek,
    pushups: 0,
    pullups: 0,
    dips: 0,
    plank: 0,
    handstand: 0,
    skillPractice: false,
    notes: ""
  };
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    steps: 8432,
    caloriesBurned: 420,
    activeMinutes: 45,
    lastSynced: new Date(),
  });

  // Define today's workout based on WorkoutContext
  const todaysWorkout: Exercise[] = [
    {
      name: 'Push-ups',
      sets: 3,
      targetReps: '10-15',
      type: 'reps',
    },
    {
      name: 'Pull-ups',
      sets: 3,
      targetReps: '3-8',
      type: 'reps',
    },
    {
      name: 'Dips',
      sets: 3,
      targetReps: '8-12',
      type: 'reps',
    },
    {
      name: 'Plank',
      sets: 3,
      targetReps: '20-40',
      type: 'duration',
    },
    {
      name: 'Handstand',
      sets: 3,
      targetReps: '10-30',
      type: 'duration',
    },
  ];

  // Track workout input values
  const [workoutLogs, setWorkoutLogs] = useState<{ [key: string]: number[] }>({
    pushups: Array(3).fill(0),
    pullups: Array(3).fill(0),
    dips: Array(3).fill(0),
    plank: Array(3).fill(0),
    handstand: Array(3).fill(0),
  });

  const handleSyncGoogleFit = async () => {
    // TODO: Implement Google Fit sync
    console.log('Syncing with Google Fit...');
  };

  const handleSaveWorkout = () => {
    // Update all exercise values in the WorkoutContext
    // For each exercise, take the maximum value across all sets
    const exercises = ['pushups', 'pullups', 'dips', 'plank', 'handstand'] as const;
    
    exercises.forEach(exercise => {
      const values = workoutLogs[exercise] || [];
      if (values.length > 0) {
        const maxValue = Math.max(...values.filter(v => v > 0));
        if (maxValue > 0) {
          updateProgressEntry(currentWeek, exercise, maxValue);
        }
      }
    });
    
    console.log('Workout saved for week', currentWeek);
  };

  // Convert progress data to chart format
  const generateProgressChartData = () => {
    return progressData.map(entry => ({
      week: `Week ${entry.week}`,
      pushups: entry.pushups,
      pullups: entry.pullups,
      dips: entry.dips,
      plank: entry.plank,
      handstand: entry.handstand,
    }));
  };

  const progressChartData = generateProgressChartData();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome & Summary Banner */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden p-6 md:p-8 rounded-2xl">
          <div className="absolute right-0 bottom-0 opacity-20">
            <Activity className="h-48 w-48 text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name || 'Fitness Enthusiast'}
            </h1>
            <p className="text-indigo-100 mb-4">
              Let's crush your fitness goals today!
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center">
                <Clock className="h-5 w-5 text-white mr-2" />
                <span className="text-white text-sm">
                  Current Week: {currentWeek}
                </span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center">
                <Calendar className="h-5 w-5 text-white mr-2" />
                <span className="text-white text-sm">Total Weeks: {progressData.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Health Metrics Cards */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Today's Health Metrics
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSyncGoogleFit}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 shadow-sm transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sync</span> Google Fit
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{
              y: -3,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)',
            }}
          >
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Steps
                </p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {healthMetrics.steps.toLocaleString()}
                </motion.p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from yesterday
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: '75%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
              75% of daily goal
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{
              y: -3,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)',
            }}
          >
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Dumbbell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Calories Burned
                </p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {healthMetrics.caloriesBurned}
                </motion.p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  On track for daily goal
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: '60%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
              60% of daily goal
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{
              y: -3,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)',
            }}
          >
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Minutes
                </p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {healthMetrics.activeMinutes}
                </motion.p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5 minutes from yesterday
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: '90%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
              90% of daily goal
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Today's Workout - Now using WorkoutContext data */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        variants={item}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Week {currentWeek} Workout
          </h2>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {todaysWorkout.map((exercise, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-200 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {exercise.name}
                  </h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1 bg-indigo-50 dark:bg-gray-700 rounded-full">
                    {exercise.sets} sets × {exercise.targetReps}{' '}
                    {exercise.type === 'reps' ? 'reps' : 'seconds'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                    // Convert exercise name to the property name in WorkoutContext
                    const exerciseKey = exercise.name.toLowerCase().replace('-', '');
                    
                    return (
                      <motion.div
                        key={setIndex}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <input
                          type="number"
                          placeholder={`Set ${setIndex + 1}`}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={workoutLogs[exerciseKey]?.[setIndex] || ''}
                          onChange={(e) => {
                            const newLogs = { ...workoutLogs };
                            if (!newLogs[exerciseKey]) {
                              newLogs[exerciseKey] = [];
                            }
                            newLogs[exerciseKey][setIndex] = parseInt(
                              e.target.value || '0',
                            );
                            setWorkoutLogs(newLogs);
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
            
            {/* Skill Practice Checkbox */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="skillPractice"
                  checked={currentWeekData.skillPractice}
                  onChange={() => updateProgressEntry(currentWeek, 'skillPractice', !currentWeekData.skillPractice)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="skillPractice" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                  Completed Skill Practice Session
                </label>
              </div>
            </motion.div>
            
            {/* Notes Field */}
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
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="How did the workout feel?"
                value={currentWeekData.notes}
                onChange={(e) => updateProgressEntry(currentWeek, 'notes', e.target.value)}
              ></textarea>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveWorkout}
            className="w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200"
          >
            Save Workout
          </motion.button>
        </div>
      </motion.section>

      {/* Progress Charts - Using WorkoutContext data */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        variants={item}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Your Progress
          </h2>
        </div>
        <div className="p-5">
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  stroke="#6366F1"
                  tickMargin={10}
                  tick={{ fill: 'rgb(100, 100, 130)' }}
                />
                <YAxis stroke="#6366F1" tick={{ fill: 'rgb(100, 100, 130)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E0E7FF',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pushups"
                  stroke="#6366F1"
                  strokeWidth={2}
                  name="Push-ups"
                  dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{
                    stroke: '#6366F1',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#6366F1',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pullups"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Pull-ups"
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{
                    stroke: '#8B5CF6',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#8B5CF6',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="dips"
                  stroke="#EC4899"
                  strokeWidth={2}
                  name="Dips"
                  dot={{ stroke: '#EC4899', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{
                    stroke: '#EC4899',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#EC4899',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="plank"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Plank (seconds)"
                  dot={{ stroke: '#10B981', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{
                    stroke: '#10B981',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#10B981',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="handstand"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Handstand (seconds)"
                  dot={{ stroke: '#F59E0B', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{
                    stroke: '#F59E0B',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#F59E0B',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
