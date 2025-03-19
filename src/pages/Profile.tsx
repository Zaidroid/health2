import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';
import { 
  User, 
  Settings,
  Activity,
  LogOut,
  Edit2,
  Save,
  Shield,
  Mail,
  Clock,
  Dumbbell,
  Scale,
  Ruler,
  Calendar as CalendarIcon,
  Heart,
  Target,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { FitnessLevel } from '../types';

interface UserHealthMetrics {
  weight: number;
  height: number;
  age: number;
  fitnessLevel: FitnessLevel;
  goals: string[];
}

export function Profile() {
  const { user, signOut, updateUserProfile } = useAuth();
  const { themeColor } = useTheme();
  const { trainingPrograms } = useWorkout();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<{
    name: string;
    weight: number;
    height: number;
    age: number;
    fitnessLevel: FitnessLevel;
    goals: string[];
    selectedPlan: string;
  }>({
    name: user?.name || '',
    weight: 70,
    height: 175,
    age: 25,
    fitnessLevel: 'beginner',
    goals: ['weight loss', 'muscle gain'],
    selectedPlan: user?.selectedPlan || 'Z Axis'
  });
  const [isLoading, setIsLoading] = useState(false);

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

  // Get theme-specific accent color
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

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile using the new AuthContext method
      await updateUserProfile({
        name: editedData.name,
        weight: editedData.weight,
        height: editedData.height,
        age: editedData.age,
        fitnessLevel: editedData.fitnessLevel,
        goals: editedData.goals,
        selectedPlan: editedData.selectedPlan
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
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
      <motion.section 
        className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700" 
        variants={itemVariants}
      >
        <div 
          className="relative overflow-hidden p-4 md:p-6 rounded-2xl"
          style={{ 
            background: getThemeGradient(),
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <User className="h-32 w-32 md:h-40 md:w-40 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/90 text-sm">Manage your account and preferences</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 mt-4 md:mt-0 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Email</span>
                </div>
                <span className="text-white font-semibold text-sm truncate block">{user?.email}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Member Since</span>
                </div>
                <span className="text-white font-semibold text-sm">
                  {new Date(user?.trainingStartDate || '').toLocaleDateString()}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <Target className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Fitness Level</span>
                </div>
                <span className="text-white font-semibold text-sm capitalize">
                  {editedData.fitnessLevel}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Active Goals</span>
                </div>
                <span className="text-white font-semibold text-sm">
                  {editedData.goals.length} Goals Set
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section 
          className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <User className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Personal Information
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        style={{
                          borderColor: getAccentColor(0.3),
                          "--tw-ring-color": getAccentColor(0.5)
                        } as React.CSSProperties}
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">{user?.name}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedData.age}
                        onChange={(e) => setEditedData({ ...editedData, age: parseInt(e.target.value) })}
                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        style={{
                          borderColor: getAccentColor(0.3),
                          "--tw-ring-color": getAccentColor(0.5)
                        } as React.CSSProperties}
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">{editedData.age} years</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex-1 flex items-center">
                        <input
                          type="number"
                          value={editedData.weight}
                          onChange={(e) => setEditedData({ ...editedData, weight: parseInt(e.target.value) })}
                          className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          style={{
                            borderColor: getAccentColor(0.3),
                            "--tw-ring-color": getAccentColor(0.5)
                          } as React.CSSProperties}
                        />
                        <span className="ml-2 text-gray-500 dark:text-gray-400">kg</span>
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">{editedData.weight} kg</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex-1 flex items-center">
                        <input
                          type="number"
                          value={editedData.height}
                          onChange={(e) => setEditedData({ ...editedData, height: parseInt(e.target.value) })}
                          className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          style={{
                            borderColor: getAccentColor(0.3),
                            "--tw-ring-color": getAccentColor(0.5)
                          } as React.CSSProperties}
                        />
                        <span className="ml-2 text-gray-500 dark:text-gray-400">cm</span>
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">{editedData.height} cm</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fitness Level
                </label>
                {isEditing ? (
                  <select
                    value={editedData.fitnessLevel}
                    onChange={(e) => setEditedData({ 
                      ...editedData, 
                      fitnessLevel: e.target.value as FitnessLevel
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    style={{
                      borderColor: getAccentColor(0.3),
                      "--tw-ring-color": getAccentColor(0.5)
                    } as React.CSSProperties}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100 capitalize">{editedData.fitnessLevel}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fitness Goals
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {['weight loss', 'muscle gain', 'endurance', 'flexibility', 'strength'].map((goal) => (
                      <label key={goal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editedData.goals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditedData({
                                ...editedData,
                                goals: [...editedData.goals, goal]
                              });
                            } else {
                              setEditedData({
                                ...editedData,
                                goals: editedData.goals.filter(g => g !== goal)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{goal}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedData.goals.map((goal) => (
                      <span
                        key={goal}
                        className="px-2 py-1 text-xs rounded-full capitalize"
                        style={{
                          backgroundColor: getAccentColor(0.1),
                          color: getAccentColor(),
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isEditing) {
                      handleUpdateProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 rounded-lg text-white font-medium text-sm"
                  style={{ background: getThemeGradient() }}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Training Program Selection */}
        <motion.section 
          className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <Dumbbell className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
              Training Program
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {trainingPrograms.map((program) => (
                <div
                  key={program.id}
                  className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    editedData.selectedPlan === program.name
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setEditedData({ ...editedData, selectedPlan: program.name })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          editedData.selectedPlan === program.name
                            ? 'bg-indigo-100 dark:bg-indigo-900/40'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <Dumbbell className="h-5 w-5" style={{ color: getAccentColor() }} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-200">
                          {program.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {program.description}
                        </p>
                      </div>
                    </div>
                    {editedData.selectedPlan === program.name && (
                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full"
                        style={{ backgroundColor: getAccentColor() }}
                      />
                    )}
                  </div>
                </div>
              ))}
              {!isEditing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Edit your profile to change training program
                </p>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Account Settings */}
      <motion.section 
        className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        variants={itemVariants}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 flex items-center">
            <Settings className="h-5 w-5 mr-2" style={{ color: getAccentColor() }} />
            Account Settings
          </h2>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-gray-200">Delete Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
              >
                Delete Account
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
