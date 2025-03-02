import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

export function LoadingScreen() {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-indigo-50 flex items-center justify-center z-50"
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
          <Activity className="h-16 w-16 text-indigo-600" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xl font-semibold text-indigo-900"
        >
          Loading Zaid Health...
        </motion.h2>
      </div>
    </motion.div>
  );
}
