-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE fitness_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE exercise_type AS ENUM ('reps', 'duration');

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    training_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    selected_plan UUID,
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    age INTEGER,
    fitness_level fitness_level DEFAULT 'beginner',
    goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Training programs table
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    difficulty fitness_level DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type exercise_type NOT NULL,
    equipment TEXT[],
    muscle_groups TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Program workouts table (connects programs with exercises)
CREATE TABLE program_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    day TEXT NOT NULL,
    sets INTEGER NOT NULL,
    target_reps TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, week, day, exercise_id)
);

-- Workout progress table
CREATE TABLE workout_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES training_programs(id),
    week INTEGER NOT NULL,
    day TEXT NOT NULL,
    date DATE NOT NULL,
    exercises JSONB NOT NULL DEFAULT '{}',
    notes TEXT,
    completion_rate NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Health metrics table
CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight NUMERIC(5,2),
    steps INTEGER,
    calories_burned INTEGER,
    active_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON training_programs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON program_workouts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON workout_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON health_metrics
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for better query performance
CREATE INDEX idx_workout_progress_user_date ON workout_progress(user_id, date);
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date);
CREATE INDEX idx_program_workouts_program ON program_workouts(program_id);
CREATE INDEX idx_user_profiles_selected_plan ON user_profiles(selected_plan);

-- Sample data for training programs
INSERT INTO training_programs (id, name, description, duration_weeks, difficulty) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Z Axis', 'Bodyweight-focused calisthenics program with resistance band integration', 6, 'beginner'),
    ('550e8400-e29b-41d4-a716-446655440001', 'T Bone', 'Dumbbell-focused program targeting muscle growth and strength', 4, 'intermediate');

-- Sample exercises (just a few examples)
INSERT INTO exercises (id, name, description, type, equipment, muscle_groups) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Push-ups', 'Classic bodyweight push-up', 'reps', '{}', '{chest, triceps, shoulders}'),
    ('660e8400-e29b-41d4-a716-446655440001', 'Pull-ups', 'Traditional pull-up', 'reps', '{pull-up bar}', '{back, biceps}'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Bodyweight Squats', 'Standard bodyweight squat', 'reps', '{}', '{quadriceps, hamstrings, glutes}'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Dumbbell Bicep Curls', 'Standing dumbbell curl', 'reps', '{dumbbells}', '{biceps}'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Plank', 'Core stabilization exercise', 'duration', '{}', '{core, shoulders}');

-- Sample program workouts (just a few examples for Z Axis program)
INSERT INTO program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 1, 'Monday', 3, '10-15', 1),
    ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 1, 'Thursday', 3, '3-5', 1),
    ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 1, 'Tuesday', 3, '15', 1);

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policies for workout_progress
CREATE POLICY "Users can view their own workout progress"
    ON workout_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout progress"
    ON workout_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout progress"
    ON workout_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for health_metrics
CREATE POLICY "Users can view their own health metrics"
    ON health_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics"
    ON health_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics"
    ON health_metrics FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow public read access to training programs and exercises
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training programs"
    ON training_programs FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Anyone can view exercises"
    ON exercises FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Anyone can view program workouts"
    ON program_workouts FOR SELECT
    TO PUBLIC
    USING (true);
