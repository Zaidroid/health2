-- 1. Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    training_start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    selected_plan UUID NOT NULL,
    fitness_level TEXT NOT NULL DEFAULT 'beginner',
    goals TEXT[] DEFAULT '{}'::TEXT[],
    weight NUMERIC,
    height NUMERIC,
    age INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Create training_programs table
CREATE TABLE public.training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add initial data
INSERT INTO public.training_programs (id, name, description, duration_weeks, difficulty)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Z Axis', 'Bodyweight-focused calisthenics program with resistance bands', 6, 'beginner'),
  ('550e8400-e29b-41d4-a716-446655440001', 'T Bone', 'Dumbbell-focused program targeting muscle growth and strength', 4, 'intermediate');

-- 3. Create exercises table
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'reps',
    equipment TEXT[] DEFAULT '{}'::TEXT[],
    muscle_groups TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create program_workouts table
CREATE TABLE public.program_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.training_programs(id),
    exercise_id UUID NOT NULL REFERENCES public.exercises(id),
    week INTEGER NOT NULL,
    day TEXT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    target_reps TEXT NOT NULL DEFAULT '10',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create workout_progress table
CREATE TABLE public.workout_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    program_id UUID REFERENCES public.training_programs(id),
    week INTEGER NOT NULL,
    day TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    exercises JSONB NOT NULL DEFAULT '{}'::JSONB,
    notes TEXT,
    completion_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.workout_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
    ON public.workout_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON public.workout_progress
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.workout_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
