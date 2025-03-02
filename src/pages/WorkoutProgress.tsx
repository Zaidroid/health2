import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Dumbbell, ClipboardList, Award, TrendingUp, Calendar, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedComponents';

type ExerciseProgress = {
  week: number;
  pushups: number;
  pullups: number;
  dips: number;
  plank: number;
  handstand: number;
  skillPractice: boolean;
  notes: string;
};

export function WorkoutProgress() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [progressData, setProgressData] = useState<ExerciseProgress[]>([
    { 
      week: 1, 
      pushups: 12, 
      pullups: 3, 
      dips: 8, 
      plank: 25, 
      handstand: 15, 
      skillPractice: true,
      notes: "Form feels good, struggled with handstands"
    },
    { 
      week: 2, 
      pushups: 14, 
      pullups: 4, 
      dips: 10, 
      plank: 30, 
      handstand: 20, 
      skillPractice: true,
      notes: "Increased all reps, getting better at handstands"
    },
    { 
      week: 3, 
      pushups: 16, 
      pullups: 5, 
      dips: 11, 
      plank: 35, 
      handstand: 25, 
      skillPractice: false,
      notes: "Missed skill practice day, but strength improving"
    },
  ]);

  const trainingSchedule = [
    {
      day: "Monday",
      focus: "Upper Body (Push Focus)",
      exercises: [
        { name: "Push-ups", sets: 3, reps: "10-15" },
        { name: "Dips", sets: 3, reps: "8-12" },
        { name: "Resistance band shoulder press", sets: 3, reps: "12" }
      ]
    },
    {
      day: "Tuesday",
      focus: "Lower Body (Knee-Friendly)",
      exercises: [
        { name: "Glute bridges", sets: 3, reps: "15" },
        { name: "Bodyweight squats", sets: 3, reps: "12" },
        { name: "Resistance band leg curls", sets: 3, reps: "15" }
      ]
    },
    {
      day: "Wednesday",
      focus: "Rest or Active Recovery",
      exercises: []
    },
    {
      day: "Thursday",
      focus: "Upper Body (Pull Focus)",
      exercises: [
        { name: "Pull-ups", sets: 3, reps: "3-5" },
        { name: "Inverted rows", sets: 3, reps: "8-10" },
        { name: "Resistance band bicep curls", sets: 3, reps: "12" }
      ]
    },
    {
      day: "Friday",
      focus: "Skill & Core Training",
      exercises: [
        { name: "Handstand wall walks", sets: 3, reps: "5" },
        { name: "Wall-supported handstand hold", sets: 3, reps: "15-30 sec" },
        { name: "Standard plank", sets: 3, reps: "20-30 sec" },
        { name: "Side planks", sets: 3, reps: "15-20 sec per side" }
      ]
    },
    {
      day: "Saturday",
      focus: "Full Body Workout",
      exercises: [
        { name: "Burpees", sets: 3, reps: "10" },
        { name: "Mountain climbers", sets: 3, reps: "20" },
        { name: "Resistance band rows", sets: 3, reps: "12" }
      ]
    },
    {
      day: "Sunday",
      focus: "Rest",
      exercises: []
    }
  ];

  const progressionPlan = [
    {
      weeks: "Week 1-2",
      focus: "Focus on mastering form and endurance.",
      targets: [
        "Push-ups: 3x10-15",
        "Pull-ups: 3x3-5",
        "Planks: 3x20-30 sec"
      ]
    },
    {
      weeks: "Week 3-4",
      focus: "Increase reps and intensity.",
      targets: [
        "Push-ups: 3x15-20",
        "Pull-ups: 3x4-6",
        "Planks: 3x30-45 sec"
      ]
    },
    {
      weeks: "Week 5-6",
      focus: "Push towards strength improvements.",
      targets: [
        "Push-ups: 3x20+",
        "Pull-ups: 3x5-7",
        "Planks: 3x45-60 sec"
      ]
    }
  ];

  const addProgressEntry = () => {
    const lastWeek = progressData.length > 0 ? progressData[progressData.length - 1].week : 0;
    const newProgressEntry: ExerciseProgress = {
      week: lastWeek + 1,
      pushups: 0,
      pullups: 0,
      dips: 0,
      plank: 0,
      handstand: 0,
      skillPractice: false,
      notes: ""
    };
    setProgressData([...progressData, newProgressEntry]);
    setCurrentWeek(lastWeek + 1);
  };

  const updateProgressEntry = (field: keyof ExerciseProgress, value: any) => {
    const updatedData = progressData.map(entry => {
      if (entry.week === currentWeek) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setProgressData(updatedData);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next' && currentWeek < 6) {
      // Check if we need to add a new entry
      if (currentWeek >= progressData.length) {
        addProgressEntry();
      } else {
        setCurrentWeek(currentWeek + 1);
      }
    }
  };

  // Find current week data
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

  // Animation variants
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

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">6-Week Calisthenics Program</h2>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-white font-medium">Week {currentWeek} of 6</span>
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
                  disabled={currentWeek === 6}
                  className={`p-1 rounded-full bg-white/20 ${currentWeek === 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Progress Tracker */}
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
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Push-ups</h3>
                  </div>
                  <input
                    type="number"
                    value={currentWeekData.pushups || ''}
                    onChange={(e) => updateProgressEntry('pushups', parseInt(e.target.value))}
                    className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="Max reps"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Pull-ups</h3>
                  </div>
                  <input
                    type="number"
                    value={currentWeekData.pullups || ''}
                    onChange={(e) => updateProgressEntry('pullups', parseInt(e.target.value))}
                    className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="Max reps"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Dips</h3>
                  </div>
                  <input
                    type="number"
                    value={currentWeekData.dips || ''}
                    onChange={(e) => updateProgressEntry('dips', parseInt(e.target.value))}
                    className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="Max reps"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Plank (sec)</h3>
                  </div>
                  <input
                    type="number"
                    value={currentWeekData.plank || ''}
                    onChange={(e) => updateProgressEntry('plank', parseInt(e.target.value))}
                    className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="Seconds"
                  />
                </motion.div>
              </div>

              <motion.div
                className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              >
                <div className="flex items-center mb-2">
                  <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Handstand Hold (sec)</h3>
                </div>
                <input
                  type="number"
                  value={currentWeekData.handstand || ''}
                  onChange={(e) => updateProgressEntry('handstand', parseInt(e.target.value))}
                  className="w-full rounded-md border-indigo-200 dark:border-gray-600 shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Seconds"
                />
              </motion.div>

              <motion.div 
                className="flex items-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700"
                whileHover={{ y: -3 }}
              >
                <input
                  type="checkbox"
                  id="skillPractice"
                  checked={currentWeekData.skillPractice}
                  onChange={(e) => updateProgressEntry('skillPractice', e.target.checked)}
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
                  onChange={(e) => updateProgressEntry('notes', e.target.value)}
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
                  {progressionPlan.map((plan, index) => {
                    const weekRange = plan.weeks.replace("Week ", "").split("-").map(Number);
                    const isCurrentPlan = (currentWeek >= weekRange[0] && currentWeek <= weekRange[1]);
                    
                    return isCurrentPlan && (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-indigo-700 dark:text-indigo-300">{plan.weeks}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.focus}</p>
                        <ul className="space-y-1 mt-2">
                          {plan.targets.map((target, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{target}</span>
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
                    <LineChart data={progressData}>
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
                      <Line
                        type="monotone"
                        dataKey="pushups"
                        stroke="#6366F1"
                        strokeWidth={2}
                        name="Push-ups"
                        dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: 'white' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pullups"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Pull-ups"
                        dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="plank"
                        stroke="#EC4899"
                        strokeWidth={2}
                        name="Plank (sec)"
                        dot={{ stroke: '#EC4899', strokeWidth: 2, r: 4, fill: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedCard>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200"
          >
            Save Progress
          </motion.button>
        </div>
      </motion.section>

      {/* Weekly Schedule */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Weekly Training Schedule</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trainingSchedule.map((day, index) => (
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
                    {day.focus}
                  </span>
                </div>
                
                {day.exercises.length > 0 ? (
                  <ul className="space-y-2 mt-3">
                    {day.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm flex items-center">
                        <Dumbbell className="h-4 w-4 text-indigo-500 mr-2" />
                        <span>{exercise.name}: {exercise.sets} sets × {exercise.reps}</span>
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

      {/* Nutrition Plan */}
      <motion.section
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-indigo-100 dark:border-gray-700"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Nutrition Plan</h2>
        </div>
        <div className="p-6">
          <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Daily Meal Plan (Budget-Friendly & High Protein)</h3>
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
