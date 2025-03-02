import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (provider?: 'google' | 'email', email?: string, password?: string) => Promise<void>;
  signUp: (email?: string, password?: string, name?: string, selectedPlan?: string) => Promise<void>; // Add selectedPlan
  signOut: () => Promise<void>;
  loading: boolean;
  guest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Removed duplicate supabase client initialization.  The client is now initialized in src/lib/supabase.ts
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button in the top right.');
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { supabase } from '../lib/supabase'; // Import the supabase client

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || 'User',
          googleToken: session.provider_token || '',
          trainingStartDate: new Date(session.user.user_metadata?.training_start_date || new Date()),
          selectedPlan: session.user.user_metadata?.selected_plan || 'Z Axis', // Load selectedPlan
        });
        setGuest(false);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || 'User',
          googleToken: session.provider_token || '',
          trainingStartDate: new Date(session.user.user_metadata?.training_start_date || new Date()),
          selectedPlan: session.user.user_metadata?.selected_plan || 'Z Axis', // Load selectedPlan
        });
        setGuest(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (provider?: 'google' | 'email', email?: string, password?: string) => {
    setLoading(true);
    try {
      if (provider === 'google') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
              scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
            },
          },
        });

        if (error) {
          throw error;
        }
        setGuest(false);
      } else if (provider === 'email' && email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        if (data && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || 'User',
            googleToken: '',
            trainingStartDate: new Date(),
            selectedPlan: data.user.user_metadata?.selected_plan || 'Z Axis', // Load selectedPlan
          });
        }
        setGuest(false);
      } else {
        // Anonymous sign-in
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
          throw error;
        }

        if (data && data.user) {
          setUser({
            id: data.user.id,
            email: 'guest@example.com',
            name: 'Guest User',
            googleToken: '',
            trainingStartDate: new Date(),
            selectedPlan: 'Z Axis', // Default for guests
          });
          setGuest(true);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email?: string, password?: string, name?: string, selectedPlan?: string) => { // Add selectedPlan
    setLoading(true);
    try {
      if (!email || !password || !name) {
        throw new Error("Email, password, and name are required for sign up.");
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            selected_plan: selectedPlan || 'Z Axis', // Store selectedPlan, default to 'Z Axis'
          }
        }
      });

      if (error) {
        throw error;
      }
      if (data && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: name,
          googleToken: '',
          trainingStartDate: new Date(),
          selectedPlan: selectedPlan || 'Z Axis', // Store selectedPlan
        });
      }
      setGuest(false);

    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setGuest(false);
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, guest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
