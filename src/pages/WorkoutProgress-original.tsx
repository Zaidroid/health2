import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dumbbell, ClipboardList, Award, TrendingUp, Calendar, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedComponents';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

type ExerciseProgress = {
  week: number;
  day?: string;
  reps?: { [exerciseName: string]: number[] };
  [exerciseName: string]: number | boolean | string | undefined | { [key: string]: number[] };
  skillPractice: boolean;
  notes: string;
};

export function WorkoutProgress() {
  const { currentWeek, setCurrentWeek, progressData, trainingSchedules, progressionPlans, updateProgressEntry } = useWorkout();
  const { user } = useAuth();
  const selectedPlan = user?.selectedPlan || "Z Axis";

  const [localProgressData, setLocalProgressData] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize localProgressData based on the selected plan
  const initializeProgressData = () => {
    const initialData: ExerciseProgress[] = [];
    for (let week = 1; week <= Object.keys(trainingSchedules[selectedPlan]).length; week++) {
      const weekData: ExerciseProgress = {
        week: week,
        day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        reps: {},
        skillPractice: false,
        notes: "",
      };

      const weekSchedule = trainingSchedules[selectedPlan][week];
      if (weekSchedule) {
        weekSchedule.forEach((day: { day: string; exercises: any[] }) => {
          day.exercises.forEach((exercise: { name: string; sets: number }) => {
            const exerciseName = exercise.name;
            if (!weekData.reps) weekData.reps = {};
            weekData.reps[exerciseName] = Array(exercise.sets).fill(0);
            // Also keep legacy format for UI compatibility
            weekData[exercise.name.toLowerCase().replace(/[- ]/g, '')] = 0;
          });
        });
      }

      initialData.push(weekData);
    }
    return initialData;
  };

  // Sync global progressData with localProgressData
  useEffect(() => {
    setLocalProgressData(prevData => {
      const newData = prevData.length === 0 ? initializeProgressData() : [...prevData];
      progressData.forEach(entry => {
        const index = newData.findIndex(localEntry => localEntry.week === entry.week);
        if (index > -1) {
          newData[index] = { ...newData[index], ...entry };
        } else {
          newData.push({ ...entry });
        }
      });
      return newData;
    });
  }, [progressData, trainingSchedules, selectedPlan]);

  const addProgressEntry = () => {
    const lastWeek = localProgressData.length > 0 ? localProgressData[localProgressData.length - 1].week : 0;
    const newWeek = lastWeek + 1;

    const newProgressEntry: ExerciseProgress = {
      week: newWeek,
      skillPractice: false,
      notes: "",
    };

    const weekSchedule = trainingSchedules[selectedPlan]?.[newWeek];
    if (weekSchedule) {
      weekSchedule.forEach(day => {
        day.exercises.forEach(exercise => {
          const exerciseKey = exercise.name.toLowerCase().replace(/[- ]/g, '');
          newProgressEntry[exerciseKey] = 0;
        });
      });
    }

    setLocalProgressData([...localProgressData, newProgressEntry]);
    setCurrentWeek(newWeek);
  };

  const updateProgressEntryLocal = (field: string, value: string | number | boolean) => {
    setLocalProgressData(prevData =>
      prevData.map(entry => {
        if (entry.week === currentWeek) {
          let updatedValue = value;
          if (typeof entry[field] === 'number' && typeof value === 'string') {
            updatedValue = parseInt(value, 10) || 0;
          } else if (typeof entry[field] === 'boolean' && typeof value === 'string') {
            updatedValue = value === 'true';
          }
          return { ...entry, [field]: updatedValue };
        }
        return entry;
      })
    );
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next') {
      const numWeeksInPlan = Object.keys(trainingSchedules[selectedPlan] || {}).length;
      if (currentWeek < numWeeksInPlan) {
        if (currentWeek >= localProgressData.length) {
          addProgressEntry();
        } else {
          setCurrentWeek(currentWeek + 1);
        }
      }
    }
  };

  const currentWeekData = localProgressData.find(entry => entry.week === currentWeek) || {
    week: currentWeek,
    skillPractice: false,
    notes: "",
    ...Object.fromEntries(
      trainingSchedules[selectedPlan]?.[currentWeek]?.flatMap(day =>
        day.exercises.map(exercise => [exercise.name.toLowerCase().replace(/[- ]/g, ''), 0])
      ) || []
    )
  };

  const trainingSchedule = trainingSchedules[selectedPlan] ? trainingSchedules[selectedPlan][currentWeek] : [];
  const progressionPlan = progressionPlans[selectedPlan] || {};

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const generateChartData = () => {
    return localProgressData.map(entry => {
      const chartEntry: any = { week: `Week ${entry.week}` };
      Object.keys(entry).forEach(key => {
        if (key !== 'week' && key !== 'skillPractice' && key !== 'notes' && typeof entry[key] === 'number') {
          const exerciseExistsInPlan = Object.values(trainingSchedules[selectedPlan] || {}).some(week =>
            week.some(day =>
              day.exercises.some(ex => ex.name.toLowerCase().replace(/[- ]/g, '') === key)
            )
          );

          if (exerciseExistsInPlan) {
            chartEntry[key] = entry[key];
          }
        }
      });
      return chartEntry;
    });
  };

  const chartData = generateChartData();

  let exerciseFrequency: { [key: string]: number } = {};
  if (trainingSchedule) {
    trainingSchedule.forEach((day) => {
      day.exercises.forEach((exercise) => {
        const exerciseKey = exercise.name.toLowerCase().replace(/[- ]/g, '');
        if (exerciseFrequency[exerciseKey]) {
          exerciseFrequency[exerciseKey]++;
        } else {
          exerciseFrequency[exerciseKey] = 1;
        }
      });
    });
  }

  const topFourExercises = Object.entries(exerciseFrequency)
    .sort(([, freqA], [, freqB]) => freqB - freqA)
    .slice(0, 4)
    .map((entry) => entry[0]);

  const saveProgress = async () => {
    if (!user) {
      setSaveStatus('error');
      setSaveMessage('You must be logged in to save progress.');
      return;
    }

    setSaveStatus('saving');
    setLoading(true);
    setSaveMessage('');

    try {
      const currentWeekProgress = localProgressData.find(entry => entry.week === currentWeek);
      if (!currentWeekProgress) {
        setSaveStatus('error');
        setSaveMessage('No progress data found for the current week.');
        return;
      }

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      // Save all entries to Supabase via context
      // First, handle exercise data
      Object.entries(currentWeekProgress).forEach(([key, value]) => {
        if (key !== 'week' && key !== 'day' && key !== 'reps' && key !== 'skillPractice' && key !== 'notes') {
          // For exercise data in the legacy format (exerciseKey => number)
          if (typeof value === 'number') {
            // Find the original exercise name from the training schedule
            const exerciseName = trainingSchedules[selectedPlan][currentWeek]?.flatMap(
              (day: { day: string; exercises: any[] }) => 
                day.exercises.filter(
                  (ex: { name: string }) => 
                    ex.name.toLowerCase().replace(/[- ]/g, '') === key
                )
            )[0]?.name;
            
            if (exerciseName) {
              updateProgressEntry(currentWeek, today, exerciseName, [value]);
            }
          }
        }
      });

      // Save notes separately
      if (currentWeekProgress.notes) {
        updateProgressEntry(currentWeek, today, 'notes', currentWeekProgress.notes.toString());
      }

      setSaveStatus('success');
      setSaveMessage('Progress saved successfully!');
    } catch (error: any) {
      setSaveStatus('error');
      setSaveMessage(error.message || 'Failed to save progress.');
      console.error('Error saving progress:', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 5000);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">6-Week {selectedPlan} Program</h2>
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-white font-medium">Week {currentWeek} of {Object.keys(trainingSchedules[selectedPlan] || {}).length}</span>
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWeekChange('prev')}
                  disabled={currentWeek === 1}
                  className={`p-1 rounded-full bg-white/20 ${currentWeek === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWeekChange('next')}
                  disabled={currentWeek === Object.keys(trainingSchedules[selectedPlan] || {}).length}
                  className={`p-1 rounded-full bg-white/20 ${currentWeek === Object.keys(trainingSchedules[selectedPlan] || {}).length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Week {currentWeek} Progress Tracker</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {topFourExercises.map((exerciseKey) => {
                const exercise = trainingSchedule?.flatMap(day => day.exercises).find(ex => ex.name.toLowerCase().replace(/[- ]/g, '') === exerciseKey);
                if (!exercise) return null;

                return (
                  <motion.div
                    key={`${currentWeek}-${exerciseKey}`}
                    className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                    whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                  >
                    <div className="flex items-center mb-2">
                      <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                      <h3 className="font-medium text-gray-700 dark:text-gray-300">{exercise.name}</h3>
                      {typeof currentWeekData[exerciseKey] === 'number' && (currentWeekData[exerciseKey] as number) > 0 && (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      )}
                    </div>
                    <input
                      type="number"
                      value={currentWeekData[exerciseKey] || ''}
                      onChange={(e) => updateProgressEntryLocal(exerciseKey, e.target.value)}
                      className={`w-full rounded-md shadow-sm focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:text-white
                        ${typeof currentWeekData[exerciseKey] === 'number' && (currentWeekData[exerciseKey] as number) > 0
                          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-gray-700 dark:text-gray-300' 
                          : 'border-indigo-200 dark:border-gray-600 dark:bg-gray-700'}`}
                      placeholder={exercise.type === 'reps' ? "Max reps" : "Seconds"}
                    />
                  </motion.div>
                );
              })}

              <motion.div
                className="flex items-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                whileHover={{ y: -3 }}
              >
                <input
                  type="checkbox"
                  id="skillPractice"
                  checked={currentWeekData.skillPractice === true}
                  onChange={(e) => updateProgressEntryLocal('skillPractice', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="skillPractice" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Completed Skill Practice
                </label>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              >
                <div className="flex items-center mb-2">
                  <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Notes</h3>
                </div>
                <textarea
                  value={currentWeekData.notes || ''}
                  onChange={(e) => updateProgressEntryLocal('notes', e.target.value)}
                  className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Add notes about your progress..."
                />
              </motion.div>
            </div>

            <div className="space-y-6">
              <AnimatedCard className="p-4 overflow-hidden">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Weekly Target (Week {currentWeek})
                </h3>
                <div className="bg-indigo-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  {Object.entries(progressionPlan).map(([weekRange, targets], index) => {
                    const weekNumbers = weekRange.split("-").map(Number);
                    const isCurrentPlan = currentWeek >= weekNumbers[0] && currentWeek <= (weekNumbers[1] || weekNumbers[0]);

                    return isCurrentPlan && (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Week {weekRange}</h4>
                        <ul className="space-y-1 mt-2">
                          {Object.entries(targets).map(([exercise, target], idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{exercise}: {target}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Your Progress Chart
                </h3>
                <div className="w-full h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#6366F1" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
                      <YAxis stroke="#6366F1" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #E0E7FF',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      {chartData.length > 0 && Object.keys(chartData[0])
                        .filter(key => key !== 'week')
                        .map((key, index) => {
                          const colors = [
                            '#6366F1', // indigo
                            '#8B5CF6', // violet
                            '#EC4899', // pink
                            '#10B981', // emerald
                            '#F59E0B', // amber
                            '#06B6D4', // cyan
                            '#F97316', // orange
                          ];
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
                            />
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedCard>
            </div>
          </div>

          <motion.button
            onClick={saveProgress}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              } w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200`}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Progress'}
          </motion.button>
          {saveMessage && (
            <p
              className={`mt-2 text-sm ${saveStatus === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
            >
              {saveMessage}
            </p>
          )}
        </div>
      </motion.section>

      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Weekly Training Schedule</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trainingSchedule && trainingSchedule.map((day, index) => (
              <motion.div
                key={index}
                className="border border-indigo-100 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">{day.day}</h3>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1 bg-indigo-50 dark:bg-gray-700 rounded-full">
                    {/* Optional: Add focus property to daily workout if needed */}
                  </span>
                </div>

                {day.exercises.length > 0 ? (
                  <ul className="space-y-2 mt-3">
                    {day.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm flex items-center">
                        <Dumbbell className="h-4 w-4 text-indigo-500 mr-2" />
                        <span>{exercise.name}: {exercise.sets} sets × {exercise.targetReps}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic text-sm mt-2">Rest day</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Nutrition Plan</h2>
        </div>
        <div className="p-6">
          <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Daily Meal Plan (Budget-Friendly &amp; High Protein)</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium mr-2">Breakfast:</span> 4 boiled eggs + oats with peanut butter
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium mr-2">Lunch:</span> Rice with lentils/chicken + vegetables
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium mr-2">Snack:</span> Peanut butter sandwich or yogurt with nuts
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium mr-2">Dinner:</span> Tuna or eggs with whole wheat bread
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium mr-2">Post-Workout:</span> Protein shake (if available) or milk with honey
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Creatine Usage:</h4>
              <p className="text-gray-700 dark:text-gray-300">Take 3-5g daily with plenty of water.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
