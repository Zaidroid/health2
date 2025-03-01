import React, { useState } from 'react';
    import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
    import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    export function Calendar() {
      const [currentDate, setCurrentDate] = useState(new Date());
      const [selectedDate, setSelectedDate] = useState<Date | null>(null);
      const [direction, setDirection] = useState(0);

      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      const previousMonth = () => {
        setDirection(-1);
        setCurrentDate(subMonths(currentDate, 1));
      };

      const nextMonth = () => {
        setDirection(1);
        setCurrentDate(addMonths(currentDate, 1));
      };

      // Sample workout data
      const workoutData = {
        '2025-02-15': { completed: true, exercises: ['Push-ups', 'Plank', 'Squats'] },
        '2025-02-18': { completed: true, exercises: ['Pull-ups', 'Lunges', 'Crunches'] },
        '2025-02-20': { completed: false, exercises: ['Push-ups', 'Dips', 'Plank'] },
      };

      const getWorkoutForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return workoutData[dateStr] || null;
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
                    {days.map((day, dayIdx) => {
                      const workout = getWorkoutForDate(day);
                      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

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
                          block text-sm mb-1
                          ${isToday(day) ? 'text-white bg-indigo-600 dark:bg-indigo-400 w-6 h-6 rounded-full flex items-center justify-center mx-auto' : ''}
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
                    className="mt-8 bg-white dark:bg-dark-card p-6 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      );
    }
