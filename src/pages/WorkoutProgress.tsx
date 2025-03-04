import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dumbbell, ClipboardList, Award, TrendingUp, Calendar, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedComponents';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

type ExerciseProgress = {
  week: number;
  [exerciseName: string]: number | boolean | string;
  skillPractice: boolean;
  notes: string;
};

export function WorkoutProgress() {
  const { currentWeek, setCurrentWeek, progressData, trainingSchedules, progressionPlans, updateProgressEntry, loading, error } = useWorkout();
  const { user } = useAuth();
  const selectedPlan = user?.selectedPlan || "Z Axis";

  const [localProgressData, setLocalProgressData] = useState<ExerciseProgress[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const initializeProgressData = () => {
    const initialData: ExerciseProgress[] = [];
    for (let week = 1; week <= Object.keys(trainingSchedules[selectedPlan]).length; week++) {
      const weekData: ExerciseProgress = { week, skillPractice: false, notes: "" };
      const weekSchedule = trainingSchedules[selectedPlan][week];
      if (weekSchedule) {
        weekSchedule.forEach(day => {
          day.exercises.forEach(exercise => {
            weekData[exercise.name.toLowerCase().replace(/[- ]/g, '')] = 0;
          });
        });
      }
      initialData.push(weekData);
    }
    return initialData;
  };

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
    const newProgressEntry: ExerciseProgress = { week: newWeek, skillPractice: false, notes: "" };
    const weekSchedule = trainingSchedules[selectedPlan]?.[newWeek];
    if (weekSchedule) {
      weekSchedule.forEach(day => {
        day.exercises.forEach(exercise => {
          newProgressEntry[exercise.name.toLowerCase().replace(/[- ]/g, '')] = 0;
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
            updatedValue = Math.max(0, parseInt(value, 10) || 0); // Validate non-negative
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
        if (currentWeek >= localProgressData.length) addProgressEntry();
        else setCurrentWeek(currentWeek + 1);
      }
    }
  };

  const currentWeekData = localProgressData.find(entry => entry.week === currentWeek) || {
    week: currentWeek,
    skillPractice: false,
    notes: "",
    ...Object.fromEntries(trainingSchedules[selectedPlan]?.[currentWeek]?.flatMap(day => day.exercises.map(ex => [ex.name.toLowerCase().replace(/[- ]/g, ''), 0])) || [])
  };

  const trainingSchedule = trainingSchedules[selectedPlan] ? trainingSchedules[selectedPlan][currentWeek] : [];
  const progressionPlan = progressionPlans[selectedPlan] || {};

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const generateChartData = () => {
    return localProgressData.map(entry => {
      const chartEntry: any = { week: `Week ${entry.week}` };
      Object.keys(entry).forEach(key => {
        if (key !== 'week' && key !== 'skillPractice' && key !== 'notes' && typeof entry[key] === 'number') {
          const exerciseExistsInPlan = Object.values(trainingSchedules[selectedPlan] || {}).some(week =>
            week.some(day => day.exercises.some(ex => ex.name.toLowerCase().replace(/[- ]/g, '') === key))
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
        exerciseFrequency[exerciseKey] = (exerciseFrequency[exerciseKey] || 0) + 1;
      });
    });
  }

  const topFourExercises = Object.entries(exerciseFrequency).sort(([, freqA], [, freqB]) => freqB - freqA).slice(0, 4).map(([key]) => key);

  const saveProgress = async () => {
    if (!user) {
      setSaveStatus('error');
      setSaveMessage('You must be logged in to save progress.');
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('');

    try {
      const currentWeekProgress = localProgressData.find(entry => entry.week === currentWeek);
      if (!currentWeekProgress) {
        setSaveStatus('error');
        setSaveMessage('No progress data found for the current week.');
        return;
      }

      Object.entries(currentWeekProgress).forEach(([key, value]) => {
        if (key !== 'week') {
          updateProgressEntry(currentWeek, key, value);
        }
      });

      setSaveStatus('success');
      setSaveMessage('Progress saved successfully!');
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err.message || 'Failed to save progress.');
      console.error('Error saving progress:', err);
    }
  };

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
      <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700" variants={item}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">6-Week {selectedPlan} Program</h2>
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
              <span className="text-white font-medium">Week {currentWeek} of {Object.keys(trainingSchedules[selectedPlan] || {}).length}</span>
              <div className="flex space-x-1">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleWeekChange('prev')} disabled={currentWeek === 1} className={`p-1 rounded-full bg-white/20 ${currentWeek === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}>
                  <ChevronLeft className="h-5 w-5 text-white" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleWeekChange('next')} disabled={currentWeek === Object.keys(trainingSchedules[selectedPlan] || {}).length} className={`p-1 rounded-full bg-white/20 ${currentWeek === Object.keys(trainingSchedules[selectedPlan] || {}).length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}>
                  <ChevronRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700" variants={item}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Week {currentWeek} Progress Tracker</h2>
          </div>
          <div className="p-6">
            {loading && <p className="text-gray-500 text-sm mb-4">Loading...</p>}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {saveMessage && <p className={`text-sm mb-4 ${saveStatus === 'error' ? 'text-red-500' : 'text-green-500'}`}>{saveMessage}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {topFourExercises.map((exerciseKey) => {
                  const exercise = trainingSchedule?.flatMap(day => day.exercises).find(ex => ex.name.toLowerCase().replace(/[- ]/g, '') === exerciseKey);
                  if (!exercise) return null;
                  return (
                    <motion.div key={`${currentWeek}-${exerciseKey}`} className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}>
                      <div className="flex items-center mb-2">
                        <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">{exercise.name}</h3>
                      </div>
                      <input
                        type="number"
                        value={currentWeekData[exerciseKey] || ''}
                        onChange={(e) => updateProgressEntryLocal(exerciseKey, e.target.value)}
                        className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        placeholder={exercise.type === 'reps' ? "Max reps" : "Seconds"}
                        min="0"
                      />
                    </motion.div>
                  );
                })}
                <motion.div className="flex items-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700" whileHover={{ y: -3 }}>
                  <input
                    type="checkbox"
                    id="skillPractice"
                    checked={currentWeekData.skillPractice === true}
                    onChange={(e) => updateProgressEntryLocal('skillPractice', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="skillPractice" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Completed Skill Practice</label>
                </motion.div>
                <motion.div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700" whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}>
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
                        <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E0E7FF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Legend />
                        {chartData.length > 0 && Object.keys(chartData[0]).filter(key => key !== 'week').map((key, index) => {
                          const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#F97316'];
                          const color = colors[index % colors.length];
                          const displayName = key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              stroke={color}
                              strokeWidth={2}
                              name={displayName}
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
              className={`w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Save progress"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Progress'}
            </motion.button>
          </div>
        </motion.section>

        {/* Weekly Training Schedule and Nutrition Plan unchanged */}
      </motion.div>
    );
  }
