import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Dumbbell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

interface WorkoutData {
  [date: string]: {
    completed: boolean;
    exercises: string[];
    completionPercentage: number;
    achievements?: string[];
    notes?: string;
    reps: { [exercise: string]: number };
  };
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const { trainingSchedules, currentWeek, progressData, updateProgressEntry } = useWorkout();
  const { user } = useAuth();
  const selectedPlan = user?.selectedPlan || "Z Axis";

  // Local state for editing
  const [editData, setEditData] = useState<{ reps: { [exercise: string]: number }; notes: string } | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

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

  const getWorkoutForDate = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE');

    if (!trainingSchedules || !trainingSchedules[selectedPlan]) {
      console.error(`Training schedule not found for plan: ${selectedPlan}`);
      return null;
    }

    const weekSchedule = trainingSchedules[selectedPlan][currentWeek];
    if (!weekSchedule) {
      console.error(`No schedule found for week ${currentWeek} in plan ${selectedPlan}`);
      return null;
    }

    const dailyWorkout = weekSchedule.find((workout) => workout.day === dayOfWeek);
    if (!dailyWorkout) {
      return null;
    }

    const weekProgress = progressData.find(entry => entry.week === currentWeek);
    const workoutDisplay: WorkoutData[string] = {
      completed: false,
      exercises: dailyWorkout.exercises.map(ex => ex.name),
      completionPercentage: 0,
      achievements: [],
      notes: weekProgress?.notes || '',
      reps: {},
    };

    let completedExercises = 0;
    dailyWorkout.exercises.forEach(exercise => {
      const repValue = weekProgress?.[exercise.name];
      workoutDisplay.reps[exercise.name] = typeof repValue === 'number' ? repValue : 0;
      if (repValue > 0) {
        completedExercises++;
      }
    });
    workoutDisplay.completionPercentage = dailyWorkout.exercises.length > 0
      ? (completedExercises / dailyWorkout.exercises.length) * 100
      : 0;
    workoutDisplay.completed = workoutDisplay.completionPercentage === 100;

    return workoutDisplay;
  };

  const handleEditChange = (exercise: string, value: string) => {
    setEditData(prev => {
      const newData = prev || { reps: { ...getWorkoutForDate(selectedDate!)?.reps }, notes: getWorkoutForDate(selectedDate!)?.notes || '' };
      newData.reps[exercise] = parseInt(value, 10) || 0;
      return { ...newData };
    });
  };

  const handleNotesChange = (value: string) => {
    setEditData(prev => {
      const newData = prev || { reps: { ...getWorkoutForDate(selectedDate!)?.reps }, notes: '' };
      return { ...newData, notes: value };
    });
  };

  const saveEdits = () => {
    if (!selectedDate || !user) return;

    const workout = getWorkoutForDate(selectedDate);
    if (!workout) return;

    // Use editData if available, otherwise use original workout data
    const repsToSave = editData?.reps || workout.reps;
    const notesToSave = editData?.notes !== undefined ? editData.notes : workout.notes;

    // Save reps for each exercise
    Object.entries(repsToSave).forEach(([exercise, reps]) => {
      updateProgressEntry(currentWeek, exercise, reps);
    });

    // Save notes if changed
    if (notesToSave !== (weekProgress?.notes || '')) {
      updateProgressEntry(currentWeek, 'notes', notesToSave);
    }

    setEditData(null); // Reset edit state after saving
  };

  const weekProgress = progressData.find(entry => entry.week === currentWeek);

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

    days.forEach(day => {
      const workout = getWorkoutForDate(day);
      if (workout) {
        totalWorkouts++;
        totalCompletionPercentage += workout.completionPercentage;
        if (workout.completed) completedWorkouts++;
        workout.exercises.forEach(exercise => {
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
      completedWorkouts
    };
  }, [currentDate, days, trainingSchedules, currentWeek, progressData, selectedPlan]);

  const getDayColor = (workout: ReturnType<typeof getWorkoutForDate>) => {
    if (!workout) return 'gray';
    if (workout.completionPercentage > 75) return 'green';
    if (workout.completionPercentage >= 25) return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Workout Calendar</h2>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousMonth}
                className="p-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="p-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentDate.toString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h3>

              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="bg-indigo-50 dark:bg-gray-800 py-2 text-center text-sm font-semibold text-indigo-900 dark:text-gray-200"
                  >
                    {day}
                  </div>
                ))}
                {days.map((day) => {
                  const workout = getWorkoutForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayColor = getDayColor(workout);

                  return (
                    <motion.div
                      key={day.toString()}
                      whileHover={{ scale: 0.98 }}
                      className={`
                        relative bg-white dark:bg-gray-800 py-6 px-3 cursor-pointer transition-all duration-200
                        ${isToday(day) ? 'bg-indigo-50 dark:bg-gray-700' : ''}
                        ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'dark:text-gray-400'}
                        ${isSelected ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 z-10' : ''}
                        ${workout ? 'hover:bg-indigo-50 dark:hover:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <time
                        dateTime={format(day, 'yyyy-MM-dd')}
                        className={`
                          block text-sm mb-1 w-6 h-6 rounded-full flex items-center justify-center mx-auto
                          ${isToday(day) ? 'text-white bg-indigo-600 dark:bg-indigo-400' : ''}
                          ${!isToday(day) && dayColor === 'green' ? 'bg-green-500 text-white' : ''}
                          ${!isToday(day) && dayColor === 'yellow' ? 'bg-yellow-500 text-white' : ''}
                          ${!isToday(day) && dayColor === 'red' ? 'bg-red-500 text-white' : ''}
                          ${!isToday(day) && dayColor === 'gray' ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300' : ''}
                        `}
                      >
                        {format(day, 'd')}
                      </time>

                      {workout && (
                        <div className="mt-1">
                          {workout.completed ? (
                            <div className="flex justify-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                                Completed
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                                <Dumbbell className="h-3 w-3 mr-1" />
                                {workout.exercises.length}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mt-8 bg-white dark:bg-dark-card p-6 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Details for {format(selectedDate, 'MMMM do, yyyy')}
                </h4>
                {getWorkoutForDate(selectedDate) ? (
                  (() => {
                    const workout = getWorkoutForDate(selectedDate)!;
                    const displayReps = editData?.reps || workout.reps;
                    const displayNotes = editData?.notes !== undefined ? editData.notes : workout.notes;

                    return (
                      <>
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300">Scheduled Workout:</h5>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                            {workout.exercises.map((exercise, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span>{exercise}</span>
                                <input
                                  type="number"
                                  value={displayReps[exercise] || ''}
                                  onChange={(e) => handleEditChange(exercise, e.target.value)}
                                  className="w-16 ml-2 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  placeholder="Reps"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        {workout.achievements && workout.achievements.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 dark:text-gray-300">Achievements:</h5>
                            <ul className="list-disc list-inside text-green-600 dark:text-green-400">
                              {workout.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300">Notes:</h5>
                          <textarea
                            value={displayNotes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            placeholder="Add notes about your workout..."
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 dark:text-gray-300">Completion:</h5>
                          <div className="flex items-center">
                            {workout.completionPercentage > 75 && <CheckCircle className="text-green-500 mr-2" />}
                            {workout.completionPercentage >= 25 && workout.completionPercentage <= 75 && <AlertTriangle className="text-yellow-500 mr-2" />}
                            {workout.completionPercentage < 25 && <XCircle className="text-red-500 mr-2" />}
                            <span className="text-gray-600 dark:text-gray-400">
                              {workout.completionPercentage}%
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={saveEdits}
                          className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200"
                        >
                          Save Changes
                        </motion.button>
                      </>
                    );
                  })()
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No workout scheduled for this day.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 bg-white dark:bg-dark-card p-6 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Analytics</h4>
            {analytics.totalWorkouts > 0 ? (
              <>
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300">Total Workouts:</h5>
                  <p className="text-gray-600 dark:text-gray-400">{analytics.totalWorkouts}</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300">Completed Workouts:</h5>
                  <p className="text-gray-600 dark:text-gray-400">{analytics.completedWorkouts}</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300">Average Completion:</h5>
                  <p className="text-gray-600 dark:text-gray-400">{analytics.averageCompletionPercentage.toFixed(2)}%</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300">Most Frequent Workout:</h5>
                  <p className="text-gray-600 dark:text-gray-400">{analytics.mostFrequentWorkout}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No workout data available for this month.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
