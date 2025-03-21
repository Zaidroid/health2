import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, FitnessLevel } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  signIn: (provider?: 'google' | 'email', email?: string, password?: string) => Promise<void>;
  signUp: (email?: string, password?: string, name?: string, selectedPlan?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  guest: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserObject = (
  id: string,
  email: string,
  name: string,
  googleToken: string,
  trainingStartDate: Date,
  selectedPlan: string,
  fitnessLevel: FitnessLevel = 'beginner',
  goals: string[] = []
): User => {
  const user: User = {
    id,
    email,
    name,
    googleToken,
    trainingStartDate,
    selectedPlan,
    fitnessLevel,
    goals,
    weight: undefined,
    height: undefined,
    age: undefined
  };
  return user;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData = createUserObject(
          session.user.id,
          session.user.email!,
          session.user.user_metadata?.full_name || 'User',
          session.access_token || '',
          new Date(session.user.user_metadata?.training_start_date || new Date()),
          session.user.user_metadata?.selected_plan || 'Z Axis',
          session.user.user_metadata?.fitness_level || 'beginner',
          session.user.user_metadata?.goals || []
        );
        setUser(userData);
        setGuest(false);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        console.log("Auth state changed, session found:", session.user.id);
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching user profile:", profileError);
          }
          
          const userData = createUserObject(
            session.user.id,
            session.user.email!,
            session.user.user_metadata?.full_name || profileData?.name || 'User',
            session.access_token || '',
            new Date(session.user.user_metadata?.training_start_date || profileData?.training_start_date || new Date()),
            session.user.user_metadata?.selected_plan || profileData?.selected_plan || 'Z Axis',
            (session.user.user_metadata?.fitness_level || profileData?.fitness_level || 'beginner') as FitnessLevel,
            session.user.user_metadata?.goals || profileData?.goals || []
          );
          
          setUser(userData);
          setGuest(false);
        } catch (err) {
          console.error("Error in auth state change handler:", err);
          
          const userData = createUserObject(
            session.user.id,
            session.user.email!,
            session.user.user_metadata?.full_name || 'User',
            session.access_token || '',
            new Date(session.user.user_metadata?.training_start_date || new Date()),
            session.user.user_metadata?.selected_plan || 'Z Axis',
            session.user.user_metadata?.fitness_level || 'beginner',
            session.user.user_metadata?.goals || []
          );
          setUser(userData);
          setGuest(false);
        }
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
        const { data, error } = await supabase.auth.signInWithOAuth({
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
          console.error("Google Sign-in error:", error);
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
            selectedPlan: data.user.user_metadata?.selected_plan || 'Z Axis',
            fitnessLevel: data.user.user_metadata?.fitness_level || 'beginner',
            goals: data.user.user_metadata?.goals || []
          });
        }
        setGuest(false);
      } else {
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
            selectedPlan: 'Z Axis',
            fitnessLevel: 'beginner',
            goals: []
          });
          setGuest(true);
        }
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email?: string, password?: string, name?: string, selectedPlan?: string) => {
    setLoading(true);
    try {
      if (!email || !password || !name) {
        throw new Error("Email, password, and name are required for sign up.");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      console.log("Auth user created successfully:", authData.user.id);
      
      setUser({
        id: authData.user.id,
        email: authData.user.email!,
        name: name,
        googleToken: '',
        trainingStartDate: new Date(),
        selectedPlan: selectedPlan || 'Z Axis',
        fitnessLevel: 'beginner',
        goals: [],
        weight: undefined,
        height: undefined,
        age: undefined
      });
      
      setGuest(false);

      try {
        const { error: metaError } = await supabase.auth.updateUser({
          data: {
            full_name: name,
            selected_plan: selectedPlan || 'Z Axis',
            training_start_date: new Date().toISOString()
          }
        });
        if (metaError) console.error("Error updating user metadata:", metaError);
      } catch (metaErr) {
        console.error("Error updating metadata:", metaErr);
      }

      try {
        let planUUID = '550e8400-e29b-41d4-a716-446655440000';
        if (selectedPlan === 'T Bone') {
          planUUID = '550e8400-e29b-41d4-a716-446655440001';
        }
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            name: name,
            training_start_date: new Date().toISOString(),
            selected_plan: planUUID,
            fitness_level: 'beginner',
            goals: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (profileError) console.error("Error creating user profile:", profileError);
      } catch (profileErr) {
        console.error("Profile creation error:", profileErr);
      }
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

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name || user.name,
          selected_plan: updates.selectedPlan || user.selectedPlan,
          fitness_level: updates.fitnessLevel || user.fitnessLevel,
          goals: updates.goals || user.goals,
          training_start_date: updates.trainingStartDate?.toISOString() || user.trainingStartDate.toISOString()
        }
      });
      
      if (authError) {
        console.error("Error updating auth metadata:", authError);
      }
      
      let planUUID = '550e8400-e29b-41d4-a716-446655440000';
      if (updates.selectedPlan === 'T Bone' || (!updates.selectedPlan && user.selectedPlan === 'T Bone')) {
        planUUID = '550e8400-e29b-41d4-a716-446655440001';
      }
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name || user.name,
          selected_plan: planUUID,
          fitness_level: updates.fitnessLevel || user.fitnessLevel,
          goals: updates.goals || user.goals,
          weight: updates.weight,
          height: updates.height,
          age: updates.age,
          training_start_date: updates.trainingStartDate?.toISOString() || user.trainingStartDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error updating user profile:", profileError);
      }
      
      setUser({
        ...user,
        ...updates
      });
      
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, guest, updateUserProfile }}>
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
