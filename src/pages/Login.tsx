import React, { useEffect, useState } from 'react';
import { Activity, ChevronRight, Dumbbell, Users, Clock, Calendar, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export function Login() {
  const { signIn, user, loading, guest, signUp } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme, themeColor } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Z Axis');
  const [step, setStep] = useState(1); // 1: auth form, 2: program selection
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get theme-specific muted gradient for headers
  const getHeaderGradient = () => {
    const gradients = {
      'indigo': 'linear-gradient(to right, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))',
      'blue': 'linear-gradient(to right, rgba(37, 99, 235, 0.9), rgba(79, 70, 229, 0.9))',
      'purple': 'linear-gradient(to right, rgba(126, 34, 206, 0.9), rgba(139, 92, 246, 0.9))',
      'teal': 'linear-gradient(to right, rgba(13, 148, 136, 0.9), rgba(20, 184, 166, 0.9))',
      'emerald': 'linear-gradient(to right, rgba(4, 120, 87, 0.9), rgba(16, 185, 129, 0.9))'
    };
    
    return gradients[themeColor] || gradients.indigo;
  };

  // Get theme-specific muted gradient for buttons
  const getButtonGradient = () => {
    const gradients = {
      'indigo': 'linear-gradient(to right, rgba(79, 70, 229, 0.85), rgba(99, 102, 241, 0.85))',
      'blue': 'linear-gradient(to right, rgba(37, 99, 235, 0.85), rgba(59, 130, 246, 0.85))',
      'purple': 'linear-gradient(to right, rgba(126, 34, 206, 0.85), rgba(139, 92, 246, 0.85))',
      'teal': 'linear-gradient(to right, rgba(13, 148, 136, 0.85), rgba(20, 184, 166, 0.85))',
      'emerald': 'linear-gradient(to right, rgba(4, 120, 87, 0.85), rgba(16, 185, 129, 0.85))'
    };
    
    return gradients[themeColor] || gradients.indigo;
  };

  // Get primary color for icons and accents
  const getPrimaryColor = () => {
    const colors = {
      'indigo': '#4f46e5',
      'blue': '#2563eb',
      'purple': '#7e22ce',
      'teal': '#0d9488',
      'emerald': '#047857'
    };
    
    return colors[themeColor] || colors.indigo;
  };

  useEffect(() => {
    if (user || guest) {
      navigate('/');
    }
  }, [user, guest, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleEmailAuth = async () => {
    setMessage('');
    setIsSubmitting(true);
    
    if (isSignUp && step === 1) {
      // Validate required fields for the first step
      if (!email || !password || !name) {
        setMessage('All fields are required.');
        setIsSubmitting(false);
        return;
      }
      
      // Move to program selection step
      setStep(2);
      setIsSubmitting(false);
      return;
    }
    
    try {
      if (isSignUp) {
        // We're at step 2 (program selection)
        console.log('Signing up with plan:', selectedPlan);
        
        try {
          await signUp(email, password, name, selectedPlan);
          toast.success('Account created! Redirecting to dashboard...');
        } catch (signUpError: any) {
          console.error('Detailed signup error:', signUpError);
          
          // Try to extract more detailed error information
          let errorDetails = '';
          if (signUpError.error_description) {
            errorDetails += signUpError.error_description;
          }
          if (signUpError.message) {
            errorDetails += ' ' + signUpError.message;
          }
          
          // If there's an inner error object, log that too
          if (signUpError.error) {
            console.error('Inner error:', signUpError.error);
          }
          
          // Check specifically for email confirmation requirement
          if (signUpError.message && signUpError.message.includes('confirmation')) {
            toast.success('Sign-up successful! Please check your email to confirm your account.');
          } else {
            throw new Error(`Sign-up failed: ${errorDetails || 'Unknown error'}`);
          }
        }
      } else {
        // Sign in with email
        await signIn('email', email, password);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Format a user-friendly error message
      let errorMessage = 'An error occurred during authentication.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        // Handle specific error codes
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          default:
            errorMessage = `Authentication error: ${error.code}`;
        }
      }
      
      // For Supabase specific errors
      if (error.code === '400' || error.code === 400) {
        if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Password should be at least 6 characters.';
        }
      } else if (error.code === '500' || error.code === 500) {
        errorMessage = 'Server error. Please try again or contact support.';
      }
      
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDarkMode = resolvedTheme === 'dark';
  const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const cardBg = isDarkMode ? 'bg-dark-card border border-gray-700' : 'bg-white border border-indigo-100';
  const inputBg = isDarkMode ? 'bg-dark-card border-gray-700 text-gray-200' : 'border-gray-300 text-gray-900';
  const pageBg = isDarkMode ? 'bg-dark-background' : 'bg-gray-50';
  const planCardBg = isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-indigo-50';
  const planCardSelected = isDarkMode 
    ? 'bg-indigo-900 border-indigo-600' 
    : 'bg-indigo-50 border-indigo-500';

  if (loading) return null;

  // Program selection screen
  if (isSignUp && step === 2) {
    return (
      <div className={`min-h-screen flex flex-col py-6 sm:py-12 ${pageBg}`}>
        <div className="px-4 sm:px-0 max-w-4xl mx-auto w-full">
          <div className="flex justify-center mb-4 sm:mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Activity className="h-12 w-12 sm:h-16 sm:w-16" style={{ color: getPrimaryColor() }} />
            </motion.div>
          </div>
          
          <motion.h2
            className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text"
            style={{ backgroundImage: getHeaderGradient() }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Choose Your Fitness Journey
          </motion.h2>
          
          <motion.p 
            className={`mt-2 text-center text-base sm:text-lg ${textColor} mb-6 sm:mb-8 px-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Select a training program that matches your goals
          </motion.p>
          
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Z Axis Program Card */}
            <motion.div 
              className={`border rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 ${selectedPlan === 'Z Axis' ? '' : planCardBg}`}
              style={selectedPlan === 'Z Axis' ? {
                backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.15)' : 'rgba(238, 242, 255, 0.8)',
                borderColor: getPrimaryColor(),
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
              } : {}}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan('Z Axis')}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className={`rounded-full p-2 sm:p-3`} style={{ 
                  backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'
                }}>
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: getPrimaryColor() }} />
                </div>
                {selectedPlan === 'Z Axis' && (
                  <CheckCircle2 className="text-green-500 h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </div>
              
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Z Axis Program</h3>
              <p className={`${textColor} mb-3 sm:mb-4 text-sm sm:text-base`}>Bodyweight-focused calisthenics program with resistance band integration.</p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>30-45 min sessions</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>5 days per week</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>All fitness levels</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 rounded-lg" style={{
                backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : 'rgba(238, 242, 255, 0.7)'
              }}>
                <p className="text-xs sm:text-sm" style={{ color: getPrimaryColor() }}>
                  Features push-ups, pull-ups, and bodyweight exercises with progressive overload over 6 weeks.
                </p>
              </div>
            </motion.div>
            
            {/* T Bone Program Card */}
            <motion.div 
              className={`border rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 ${selectedPlan === 'T Bone' ? '' : planCardBg}`}
              style={selectedPlan === 'T Bone' ? {
                backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.15)' : 'rgba(238, 242, 255, 0.8)',
                borderColor: getPrimaryColor(),
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
              } : {}}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan('T Bone')}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className={`rounded-full p-2 sm:p-3`} style={{ 
                  backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'
                }}>
                  <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: getPrimaryColor() }} />
                </div>
                {selectedPlan === 'T Bone' && (
                  <CheckCircle2 className="text-green-500 h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </div>
              
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>T Bone Program</h3>
              <p className={`${textColor} mb-3 sm:mb-4 text-sm sm:text-base`}>Dumbbell-focused program targeting muscle growth and strength.</p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>45-60 min sessions</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>4-6 days per week</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" style={{ color: getPrimaryColor() }} />
                  <span className={`${textColor} text-sm sm:text-base`}>Beginner to intermediate</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 rounded-lg" style={{
                backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : 'rgba(238, 242, 255, 0.7)'
              }}>
                <p className="text-xs sm:text-sm" style={{ color: getPrimaryColor() }}>
                  Focused on dumbbell exercises with progressive overload and functional strength building over 4 weeks.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="flex mt-6 sm:mt-8 justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setStep(1)}
            >
              Back
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className={`flex items-center px-4 sm:px-6 py-2 text-white rounded-md font-medium text-sm sm:text-base ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                background: getButtonGradient(),
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onClick={handleEmailAuth}
            >
              {isSubmitting ? 'Creating Account...' : 'Continue'} 
              <ChevronRight className="ml-1 h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup form
  return (
    <div className={`min-h-screen flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 ${pageBg}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Activity className="h-12 w-12 sm:h-16 sm:w-16" style={{ color: getPrimaryColor() }} />
          </motion.div>
        </div>
        <motion.h2
          className="mt-4 sm:mt-6 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text"
          style={{ backgroundImage: getHeaderGradient() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to Zaid Health
        </motion.h2>
        <motion.p
          className={`mt-2 text-center text-base sm:text-lg ${textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {isSignUp ? 'Create your account to get started' : 'Sign in to continue your journey'}
        </motion.p>
      </div>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>

      <motion.div
        className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className={`${cardBg} py-6 sm:py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}>
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h3 className={`text-base sm:text-lg font-medium text-center mb-5 sm:mb-6 ${isDarkMode ? 'text-dark-foreground' : 'text-gray-900'}`}>
                {isSignUp ? 'Sign up for an account' : 'Sign in to your account'}
              </h3>

              {isSignUp && (
                <div className="mb-4">
                  <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="email" className={`block text-sm font-medium ${textColor}`}>
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm ${inputBg}`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm ${inputBg}`}
                  />
                </div>
              </div>

              {message && <p className="text-red-500 text-sm mt-2 mb-4">{message}</p>}

              <motion.button
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEmailAuth}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white transition-all duration-200"
                style={{ 
                  background: getButtonGradient(),
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {isSignUp ? 'Continue' : 'Sign in'}
              </motion.button>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setStep(1);
                  }}
                  className={`text-sm font-medium ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Create an account'}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full ${borderColor} border-t`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDarkMode ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                </div>
              </div>

              <div className="mt-5">
                <motion.button
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white transition-all duration-200"
                  style={{ 
                    background: getButtonGradient(),
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Sign in with Google
                </motion.button>
              </div>
            </div>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full ${borderColor} border-t`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDarkMode ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-500'}`}>Or continue as guest</span>
                </div>
              </div>

              <div className="mt-5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex justify-center py-2.5 sm:py-3 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none transition-all duration-200 ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-700'}`}
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => {
                    signIn();
                    navigate('/');
                  }}
                >
                  Continue without signing in
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
