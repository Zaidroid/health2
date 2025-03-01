import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Dumbbell, Award, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetrics, Exercise } from '../types';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { user } = useAuth();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    steps: 8432,
    caloriesBurned: 420,
    activeMinutes: 45,
    lastSynced: new Date(),
  });

  const [todaysWorkout] = useState<Exercise[]>([
    {
      name: 'Push-ups',
      sets: 3,
      targetReps: '10-15',
      type: 'reps',
    },
    {
      name: 'Plank',
      sets: 3,
      targetReps: '20-30',
      type: 'duration',
    },
    {
      name: 'Squats',
      sets: 3,
      targetReps: '15-20',
      type: 'reps',
    },
  ]);

  const [workoutLogs, setWorkoutLogs] = useState<{ [key: string]: number[]}>({});

  const handleSyncGoogleFit = async () => {
    // TODO: Implement Google Fit sync
    console.log('Syncing with Google Fit...');
  };

  const handleSaveWorkout = () => {
    // TODO: Implement workout saving
    console.log('Saving workout...');
  };

  const progressData = [
    { date: '2025-02-10', pushups: 10, planks: 20, squats: 15 },
    { date: '2025-02-11', pushups: 12, planks: 25, squats: 16 },
    { date: '2025-02-12', pushups: 13, planks: 30, squats: 17 },
    { date: '2025-02-13', pushups: 14, planks: 32, squats: 18 },
    { date: '2025-02-14', pushups: 15, planks: 35, squats: 19 },
  ];

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
      {/* Health Metrics */}
      <motion.section 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Today's Health Metrics</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSyncGoogleFit}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-sm transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync with Google Fit
            </motion.button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Steps</p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {healthMetrics.steps.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-indigo-600 mt-1">
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from yesterday
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Dumbbell className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Calories Burned</p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {healthMetrics.caloriesBurned}
                  </motion.p>
                  <p className="text-xs text-indigo-600 mt-1">
                    <span className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      On track for daily goal
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Minutes</p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {healthMetrics.activeMinutes}
                  </motion.p>
                  <p className="text-xs text-green-600 mt-1">
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5 minutes from yesterday
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Today's Workout */}
      <motion.section 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Today's Workout</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {todaysWorkout.map((exercise, index) => (
              <motion.div 
                key={index} 
                className="border border-indigo-100 rounded-lg p-4 bg-white shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-indigo-600" />
                    {exercise.name}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium px-3 py-1 bg-indigo-50 rounded-full">
                    {exercise.sets} sets of {exercise.targetReps} {exercise.type === 'reps' ? 'reps' : 'seconds'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                    <motion.div
                      key={setIndex}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <input
                        type="number"
                        placeholder={`Set ${setIndex + 1}`}
                        className="block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                        value={workoutLogs[exercise.name]?.[setIndex] || ''}
                        onChange={(e) => {
                          const newLogs = { ...workoutLogs };
                          if (!newLogs[exercise.name]) {
                            newLogs[exercise.name] = [];
                          }
                          newLogs[exercise.name][setIndex] = parseInt(e.target.value);
                          setWorkoutLogs(newLogs);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveWorkout}
              className="w-full mt-6 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200"
            >
              Save Workout
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Progress Charts */}
      <motion.section 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100"
        variants={item}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Your Progress</h2>
        </div>
        <div className="p-6">
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6366F1" />
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
                  activeDot={{ stroke: '#6366F1', strokeWidth: 2, r: 6, fill: '#6366F1' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="planks" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Plank (seconds)" 
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 6, fill: '#8B5CF6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="squats" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                  name="Squats" 
                  dot={{ stroke: '#EC4899', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#EC4899', strokeWidth: 2, r: 6, fill: '#EC4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}