import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export function Login() {
  const { signIn, user, loading, guest, signUp } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Z Axis'); // State for selected plan

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
    try {
      if (isSignUp) {
        await signUp(email, password, name, selectedPlan); // Pass selectedPlan to signUp
      } else {
        await signIn('email', email, password);
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred.');
    }
  };

  if (loading) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${resolvedTheme === 'dark' ? 'bg-dark-background' : 'bg-gray-50'}`}>
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
            <Activity className={`h-16 w-16 ${resolvedTheme === 'dark' ? 'text-dark-primary' : 'text-indigo-600'}`} />
          </motion.div>
        </div>
        <motion.h2
          className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to Zaid Health
        </motion.h2>
        <motion.p
          className={`mt-2 text-center text-lg ${resolvedTheme === 'dark' ? 'text-dark-text' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {user ? `Welcome back, ${user.name}!` : 'Your personal fitness journey starts here'}
        </motion.p>
      </div>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className={`${resolvedTheme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-indigo-100'} py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}>
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium text-center mb-4 ${resolvedTheme === 'dark' ? 'text-dark-foreground' : 'text-gray-900'}`}>{isSignUp ? 'Sign up for an account' : 'Sign in to your account'}</h3>

              {isSignUp && (
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${resolvedTheme === 'dark' ? 'border-gray-700 bg-dark-card text-gray-200' : 'border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${resolvedTheme === 'dark' ? 'border-gray-700 bg-dark-card text-gray-200' : 'border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${resolvedTheme === 'dark' ? 'border-gray-700 bg-dark-card text-gray-200' : 'border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Training Plan Selection (only for sign-up) */}
              {isSignUp && (
                <div>
                  <label htmlFor="trainingPlan" className={`block text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Training Plan
                  </label>
                  <div className="mt-1">
                    <select
                      id="trainingPlan"
                      name="trainingPlan"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${resolvedTheme === 'dark' ? 'border-gray-700 bg-dark-card text-gray-200' : 'border-gray-300 text-gray-900'}`}
                    >
                      <option value="Z Axis">Z Axis</option>
                      <option value="T Bone">T Bone</option>
                    </select>
                  </div>
                </div>
              )}

              {message && <p className="text-red-500 text-sm mt-2">{message}</p>}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEmailAuth}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
              >
                {isSignUp ? 'Sign up' : 'Sign in'}
              </motion.button>

              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Create an account'}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full ${resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-300'} border-t`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${resolvedTheme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleSignIn}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full ${resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-300'} border-t`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${resolvedTheme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-500'}`}>Or continue as guest</span>
                </div>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${resolvedTheme === 'dark' ? 'border-gray-700 text-gray-200 bg-dark-card hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
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
