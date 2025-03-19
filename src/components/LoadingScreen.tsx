import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function LoadingScreen() {
  const { loading } = useAuth();
  const { themeColor } = useTheme();

  if (!loading) return null;

  // Get appropriate bg color based on theme
  const getBgColor = () => {
    const colorMap = {
      'indigo': 'rgba(238, 242, 255, 0.5)',
      'blue': 'rgba(239, 246, 255, 0.5)',
      'purple': 'rgba(250, 245, 255, 0.5)',
      'teal': 'rgba(240, 253, 250, 0.5)',
      'emerald': 'rgba(236, 253, 245, 0.5)'
    };
    
    return colorMap[themeColor] || colorMap.indigo;
  };

  // Get appropriate text color based on theme
  const getTextColor = () => {
    const colorMap = {
      'indigo': '#4F46E5',
      'blue': '#2563EB',
      'purple': '#9333EA',
      'teal': '#0D9488',
      'emerald': '#059669'
    };
    
    return colorMap[themeColor] || colorMap.indigo;
  };

  // Get appropriate dark text color for the heading
  const getDarkTextColor = () => {
    const colorMap = {
      'indigo': '#312E81',
      'blue': '#1E3A8A',
      'purple': '#581C87',
      'teal': '#134E4A',
      'emerald': '#064E3B'
    };
    
    return colorMap[themeColor] || colorMap.indigo;
  };

  return (
    <motion.div
      style={{ backgroundColor: getBgColor() }}
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          <Activity className="h-16 w-16" style={{ color: getTextColor() }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xl font-semibold"
          style={{ color: getDarkTextColor() }}
        >
          Loading Zaid Health...
        </motion.h2>
      </div>
    </motion.div>
  );
}
