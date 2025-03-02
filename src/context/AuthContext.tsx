import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (provider?: 'google') => Promise<void>; // Simplified signIn signature
  signOut: () => Promise<void>;
  loading: boolean;
  guest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button in the top right.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        });
        setGuest(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (provider?: 'google') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        // Regular Google Sign-In
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
      } else {
        // Anonymous sign-in for guest
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
          console.error("Guest sign-in error:", error);
          throw error;
        }

        if (data && data.user) {
          setUser({
            id: data.user.id,
            email: 'guest@example.com', // Use a consistent guest email
            name: 'Guest User',
            googleToken: '', // No token for guests
            trainingStartDate: new Date(),
          });
          setGuest(true);
        } else {
          console.warn("Guest sign-in: No user data returned");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Sign-in error:", error);
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
    <AuthContext.Provider value={{ user, signIn, signOut, loading, guest }}>
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
