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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { user } = useAuth();
  const selectedPlan = user?.selectedPlan || "Z Axis";
  const {
    progressData,
    currentWeek,
    updateProgressEntry,
    getPlannedWorkout,
    trainingSchedules,
  } = useWorkout();

  const todaysWorkout = getPlannedWorkout(selectedPlan);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentWeekData = progressData.find((entry) => entry.week === currentWeek) || {
    week: currentWeek,
    skillPractice: false,
    notes: "",
  };

  const [workoutLogs, setWorkoutLogs] = useState<{ [key: string]: number[] }>({});
  const [error, setError] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    console.log("progressData in Dashboard:", progressData);
    if (todaysWorkout && todaysWorkout.exercises.length > 0) {
      const newLogs: { [key: string]: number[] } = {};
      todaysWorkout.exercises.forEach((exercise) => {
        const exerciseKey = exercise.name.toLowerCase().replace(/[- ]/g, '');
        newLogs[exerciseKey] = Array(exercise.sets).fill('');
      });
      setWorkoutLogs(newLogs);
    }
  }, [todaysWorkout]);

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


  const handleSaveWorkout = () => {
    if (!todaysWorkout || todaysWorkout.exercises.length === 0) return;

    setError('');
    todaysWorkout.exercises.forEach((exercise) => {
      const exerciseKey = exercise.name.toLowerCase().replace(/[- ]/g, '');
      const values = workoutLogs[exerciseKey] || [];
      const numericValues = values.filter((v) => v !== '' && !isNaN(v)).map(Number);

      if (numericValues.length === 0) {
        setError(`Please enter valid values for ${exercise.name}`);
        return;
      }

      const maxValue = Math.max(...numericValues);
      if (maxValue > 0) {
        updateProgressEntry(currentWeek, today, exercise.name, [maxValue]);
      }
    });

    if (!error) console.log('Daily workout saved for', today, 'in week', currentWeek);
  };

  const generateProgressChartData = () => {
    const planSchedule = trainingSchedules[selectedPlan] ?? {};
    return progressData.map((entry) => {
      const chartEntry: any = { week: `Week ${entry.week}` };
      Object.keys(entry.reps || {}).forEach((key) => {
        const weekSchedule = planSchedule[entry.week] ?? [];
        const exerciseExistsInPlan = weekSchedule.some((day) =>
          day.exercises.some((ex) => ex.name.toLowerCase().replace(/[- ]/g, '') === key)
        );
        if (exerciseExistsInPlan && entry.reps && entry.reps[key] && Array.isArray(entry.reps[key])) {
          chartEntry[key] = entry.reps[key][0]; // Take first rep value for simplicity
        }
      });
      return chartEntry;
    });
  };

  const progressChartData = generateProgressChartData();

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

  const latestWeekData = progressData.reduce((acc, entry) => {
    return entry.week >= acc.week ? entry : acc;
  }, { week: 0, reps: {} });

  const derivedSteps = latestWeekData.reps?.steps?.[0] || 0;
  const derivedCalories = latestWeekData.reps?.calories?.[0] || 0;
  const derivedActiveMinutes = latestWeekData.reps?.activeMinutes?.[0] || 0;

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700" variants={item}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden p-6 md:p-8 rounded-2xl">
          <div className="absolute right-0 bottom-0 opacity-20">
            <Activity className="h-48 w-48 text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name || 'Fitness Enthusiast'}
            </h1>
            <p className="text-indigo-100 mb-4">Let's crush your fitness goals today!</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center">
                <Clock className="h-5 w-5 text-white mr-2" />
                <span className="text-white text-sm">Current Week: {currentWeek}</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center">
                <Calendar className="h-5 w-5 text-white mr-2" />
                <span className="text-white text-sm">Today: {today}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Health Metrics Section */}
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
            disabled={isSyncing}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 shadow-sm transition-all duration-200 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Google Fit'}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedSteps.toLocaleString()}
                </motion.p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min((derivedSteps / 10000) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedSteps / 10000) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Dumbbell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedCalories.toFixed(0)}
                </motion.p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min((derivedCalories / 2000) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedCalories / 2000) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1)' }}>
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-lg">
                <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Minutes</p>
                <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {derivedActiveMinutes}
                </motion.p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Synced from Google Fit
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min((derivedActiveMinutes / 60) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{Math.min((derivedActiveMinutes / 60) * 100, 100).toFixed(0)}% of daily goal</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Today's Workout Section */}
      <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" variants={item}>
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Today's Workout ({today})
          </h2>
        </div>
        <div className="p-5">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {!todaysWorkout || todaysWorkout.exercises.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <AlertCircle className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
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
                      <CheckCircle className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {exercise.name}
                    </h3>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1 bg-indigo-50 dark:bg-gray-700 rounded-full">
                      {exercise.sets} sets × {exercise.targetReps} {exercise.type === 'reps' ? 'reps' : 'seconds'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                      const exerciseKey = exercise.name.toLowerCase().replace(/[- ]/g, '');
                      return (
                        <motion.div key={setIndex} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <input
                            type="number"
                            placeholder={`Set ${setIndex + 1}`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={workoutLogs[exerciseKey]?.[setIndex] || ''}
                            onChange={(e) => {
                              const newLogs = { ...workoutLogs };
                              if (!newLogs[exerciseKey]) newLogs[exerciseKey] = Array(exercise.sets).fill('');
                              newLogs[exerciseKey][setIndex] = e.target.value;
                              setWorkoutLogs(newLogs);
                            }}
                          />
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
                  value={currentWeekData.notes || ""}
                  onChange={(e) => updateProgressEntry(currentWeek, today, 'notes', e.target.value)}
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWorkout}
                className="w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200"
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
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Your Progress
          </h2>
        </div>
        <div className="p-5">
          {progressChartData.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <AlertCircle className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No Progress Data Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Complete and save your workouts to start tracking your progress.</p>
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#6366F1" tickMargin={10} tick={{ fill: 'rgb(100, 100, 130)' }} />
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
                  {progressChartData.length > 0 &&
                    Object.keys(progressChartData[0])
                      .filter((key) => key !== 'week')
                      .map((key, index) => {
                        const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#F97316'];
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
