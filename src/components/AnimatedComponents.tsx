import React, { forwardRef } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: { 
    scale: [1, 1.05, 1],
    transition: { 
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1.5
    } 
  }
};

// Reusable animated components
type AnimatedCardProps = MotionProps & React.HTMLAttributes<HTMLDivElement> & {
  variants?: Variants;
};

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className = '', variants = slideUp, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`card ${className}`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

type AnimatedContainerProps = MotionProps & React.HTMLAttributes<HTMLDivElement> & {
  variants?: Variants;
};

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className = '', variants = staggerContainer, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

export const AnimatedText = ({ 
  children, 
  className = '', 
  variants = fadeIn,
  ...props 
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

type AnimatedButtonProps = MotionProps & 
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className = '', variant = 'primary', ...props }, ref) => {
    const variantClass = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
    }[variant];

    return (
      <motion.button
        ref={ref}
        className={`${variantClass} ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

export const AnimatedIcon = ({ 
  children, 
  className = '',
  ...props 
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ rotate: 15, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Progress bar component
type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  showValue?: boolean;
};

export const ProgressBar = ({ 
  value, 
  max, 
  className = '', 
  showValue = true 
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}>
      <motion.div
        className="h-2.5 rounded-full gradient-primary"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {showValue && (
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-right">
          {value} / {max}
        </div>
      )}
    </div>
  );
};
