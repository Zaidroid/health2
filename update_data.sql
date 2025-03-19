-- --- Update Exercises ---

-- Push-ups
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('660e8400-e29b-41d4-a716-446655440000', 'Push-ups', 'Classic bodyweight push-up', 'reps', '{}', '{chest, triceps, shoulders}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Pull-ups
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('660e8400-e29b-41d4-a716-446655440001', 'Pull-ups', 'Traditional pull-up', 'reps', '{pull-up bar}', '{back, biceps}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Bodyweight Squats
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('660e8400-e29b-41d4-a716-446655440002', 'Bodyweight Squats', 'Standard bodyweight squat', 'reps', '{}', '{quadriceps, hamstrings, glutes}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Dumbbell Bicep Curls
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('660e8400-e29b-41d4-a716-446655440003', 'Dumbbell Bicep Curls', 'Standing dumbbell curl', 'reps', '{dumbbells}', '{biceps}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Plank
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('660e8400-e29b-41d4-a716-446655440004', 'Plank', 'Core stabilization exercise', 'duration', '{}', '{core, shoulders}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Dips
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440000', 'Dips', 'Bodyweight dips', 'reps', '{dip bar}', '{triceps, chest, shoulders}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Resistance band shoulder press
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440001', 'Resistance band shoulder press', 'Shoulder press with resistance band', 'reps', '{resistance band}', '{shoulders}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Glute bridges
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440002', 'Glute bridges', 'Glute bridge exercise', 'reps', '{}', '{glutes, hamstrings}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Resistance band leg curls
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440003', 'Resistance band leg curls', 'Leg curls with resistance band', 'reps', '{resistance band}', '{hamstrings}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Inverted rows
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440004', 'Inverted rows', 'Inverted row exercise', 'reps', '{bar, suspension trainer}', '{back, biceps}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Resistance band bicep curls
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440005', 'Resistance band bicep curls', 'Bicep curls with resistance band', 'reps', '{resistance band}', '{biceps}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Handstand wall walks
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440006', 'Handstand wall walks', 'Handstand wall walk exercise', 'reps', '{}', '{shoulders, core}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Wall-supported handstand hold
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440007', 'Wall-supported handstand hold', 'Handstand hold against a wall', 'duration', '{}', '{shoulders, core}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Standard plank
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440008', 'Standard plank', 'Standard plank exercise', 'duration', '{}', '{core}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Side planks
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440009', 'Side planks', 'Side plank exercise', 'duration', '{}', '{core, obliques}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Burpees
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440010', 'Burpees', 'Burpee exercise', 'reps', '{}', '{full body}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Mountain climbers
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440011', 'Mountain climbers', 'Mountain climber exercise', 'reps', '{}', '{core, legs}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Resistance band rows
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('770e8400-e29b-41d4-a716-446655440012', 'Resistance band rows', 'Rows with resistance band', 'reps', '{resistance band}', '{back}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Dumbbell Lateral Raises
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('880e8400-e29b-41d4-a716-446655440000', 'Dumbbell Lateral Raises', 'Dumbbell lateral raise exercise', 'reps', '{dumbbells}', '{shoulders}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Lying Leg Raises
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('880e8400-e29b-41d4-a716-446655440001', 'Lying Leg Raises', 'Lying leg raise exercise', 'reps', '{}', '{abs}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Dumbbell Squats
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('880e8400-e29b-41d4-a716-446655440002', 'Dumbbell Squats', 'Dumbbell squat exercise', 'reps', '{dumbbells}', '{quadriceps, hamstrings, glutes}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Band Lateral Walks
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('880e8400-e29b-41d4-a716-446655440003', 'Band Lateral Walks', 'Lateral walks with resistance band', 'reps', '{resistance band}', '{glutes, abductors}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- Glute Kickbacks (band)
INSERT INTO public.exercises (id, name, description, type, equipment, muscle_groups)
VALUES ('880e8400-e29b-41d4-a716-446655440004', 'Glute Kickbacks (band)', 'Glute kickbacks with resistance band', 'reps', '{resistance band}', '{glutes}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    equipment = EXCLUDED.equipment,
    muscle_groups = EXCLUDED.muscle_groups;

-- --- Update Program Workouts (Z Axis) ---

-- Clear existing Z Axis program workouts
DELETE FROM public.program_workouts WHERE program_id = '550e8400-e29b-41d4-a716-446655440000';

-- Week 1
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 1, 'Monday', 3, '10-15', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 1, 'Monday', 3, '8-12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 1, 'Monday', 3, '12', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 1, 'Tuesday', 3, '15', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 1, 'Tuesday', 3, '12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 1, 'Tuesday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 1, 'Thursday', 3, '3-5', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 1, 'Thursday', 3, '8-10', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 1, 'Thursday', 3, '12', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 1, 'Friday', 3, '5', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 1, 'Friday', 3, '15-30', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 1, 'Friday', 3, '20-30', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 1, 'Friday', 3, '15-20', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 1, 'Saturday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 1, 'Saturday', 3, '20', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 1, 'Saturday', 3, '12', 3);

-- Week 2
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 2, 'Monday', 3, '10-15', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 2, 'Monday', 3, '8-12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 2, 'Monday', 3, '12', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 2, 'Tuesday', 3, '15', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 2, 'Tuesday', 3, '12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 2, 'Tuesday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 2, 'Thursday', 3, '3-5', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 2, 'Thursday', 3, '8-10', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 2, 'Thursday', 3, '12', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 2, 'Friday', 3, '5', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 2, 'Friday', 3, '15-30', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 2, 'Friday', 3, '20-30', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 2, 'Friday', 3, '15-20', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 2, 'Saturday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 2, 'Saturday', 3, '20', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 2, 'Saturday', 3, '12', 3);

-- Week 3
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 3, 'Monday', 3, '15-20', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 3, 'Monday', 3, '10-15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 3, 'Monday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 3, 'Tuesday', 3, '20', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 3, 'Tuesday', 3, '15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 3, 'Tuesday', 3, '20', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 3, 'Thursday', 3, '4-6', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 3, 'Thursday', 3, '10-12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 3, 'Thursday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 3, 'Friday', 3, '6', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 3, 'Friday', 3, '20-35', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 3, 'Friday', 3, '30-45', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 3, 'Friday', 3, '20-30', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 3, 'Saturday', 3, '12', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 3, 'Saturday', 3, '25', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 3, 'Saturday', 3, '15', 3);

-- Week 4
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 4, 'Monday', 3, '15-20', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 4, 'Monday', 3, '10-15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 4, 'Monday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 4, 'Tuesday', 3, '20', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 4, 'Tuesday', 3, '15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 4, 'Tuesday', 3, '20', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 4, 'Thursday', 3, '4-6', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 4, 'Thursday', 3, '10-12', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 4, 'Thursday', 3, '15', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 4, 'Friday', 3, '6', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 4, 'Friday', 3, '20-35', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 4, 'Friday', 3, '30-45', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 4, 'Friday', 3, '20-30', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 4, 'Saturday', 3, '12', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 4, 'Saturday', 3, '25', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 4, 'Saturday', 3, '15', 3);

-- Week 5
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 5, 'Monday', 3, '20+', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 5, 'Monday', 3, '12-18', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 5, 'Monday', 3, '18', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 5, 'Tuesday', 3, '25', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 5, 'Tuesday', 3, '20', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 5, 'Tuesday', 3, '25', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 5, 'Thursday', 3, '5-7', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 5, 'Thursday', 3, '12-15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 5, 'Thursday', 3, '18', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 5, 'Friday', 3, '7', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 5, 'Friday', 3, '30-45', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 5, 'Friday', 3, '45-60', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 5, 'Friday', 3, '30-40', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 5, 'Saturday', 3, '15', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 5, 'Saturday', 3, '30', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 5, 'Saturday', 3, '18', 3);

-- Week 6 (Same as Week 5 for Z Axis)
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 6, 'Monday', 3, '20+', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 6, 'Monday', 3, '12-18', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 6, 'Monday', 3, '18', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 6, 'Tuesday', 3, '25', 1),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 6, 'Tuesday', 3, '20', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 6, 'Tuesday', 3, '25', 3),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 6, 'Thursday', 3, '5-7', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 6, 'Thursday', 3, '12-15', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440005', 6, 'Thursday', 3, '18', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440006', 6, 'Friday', 3, '7', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440007', 6, 'Friday', 3, '30-45', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440008', 6, 'Friday', 3, '45-60', 3),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440009', 6, 'Friday', 3, '30-40', 4),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440010', 6, 'Saturday', 3, '15', 1),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440011', 6, 'Saturday', 3, '30', 2),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440012', 6, 'Saturday', 3, '18', 3);

-- --- Update Program Workouts (T Bone) ---

-- Clear existing T Bone program workouts
DELETE FROM public.program_workouts WHERE program_id = '550e8400-e29b-41d4-a716-446655440001';

-- Week 1
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 1, 'Sunday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 1, 'Sunday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 1, 'Sunday', 3, '8', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 1, 'Sunday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 1, 'Monday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 1, 'Monday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 1, 'Monday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 1, 'Monday', 3, '20', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 1, 'Wednesday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 1, 'Wednesday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 1, 'Wednesday', 3, '8', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 1, 'Wednesday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 1, 'Thursday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 1, 'Thursday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 1, 'Thursday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 1, 'Thursday', 3, '20', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 1, 'Saturday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 1, 'Saturday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 1, 'Saturday', 3, '8', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 1, 'Saturday', 3, '20', 4);

-- Week 2
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 2, 'Sunday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 2, 'Sunday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 2, 'Sunday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 2, 'Sunday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 2, 'Monday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 2, 'Monday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 2, 'Monday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 2, 'Monday', 3, '30', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 2, 'Wednesday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 2, 'Wednesday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 2, 'Wednesday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 2, 'Wednesday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 2, 'Thursday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 2, 'Thursday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 2, 'Thursday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 2, 'Thursday', 3, '30', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 2, 'Saturday', 3, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 2, 'Saturday', 3, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 2, 'Saturday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 2, 'Saturday', 3, '30', 4);

-- Week 3
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 3, 'Sunday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 3, 'Sunday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 3, 'Sunday', 4, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 3, 'Sunday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 3, 'Monday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 3, 'Monday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 3, 'Monday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 3, 'Monday', 3, '40', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 3, 'Wednesday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 3, 'Wednesday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 3, 'Wednesday', 4, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 3, 'Wednesday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 3, 'Thursday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 3, 'Thursday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 3, 'Thursday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 3, 'Thursday', 3, '40', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 3, 'Saturday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 3, 'Saturday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 3, 'Saturday', 4, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 3, 'Saturday', 3, '40', 4);

-- Week 4
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 4, 'Sunday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 4, 'Sunday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 4, 'Sunday', 4, '12', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 4, 'Sunday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 4, 'Monday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 4, 'Monday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 4, 'Monday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 4, 'Monday', 3, '50', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 4, 'Wednesday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 4, 'Wednesday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 4, 'Wednesday', 4, '12', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 4, 'Wednesday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 4, 'Thursday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 4, 'Thursday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 4, 'Thursday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 4, 'Thursday', 3, '50', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 4, 'Saturday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 4, 'Saturday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 4, 'Saturday', 4, '12', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 4, 'Saturday', 3, '50', 4);

-- Week 5
INSERT INTO public.program_workouts (program_id, exercise_id, week, day, sets, target_reps, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 5, 'Sunday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 5, 'Sunday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 5, 'Sunday', 4, '15', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 5, 'Sunday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 5, 'Monday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 5, 'Monday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 5, 'Monday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 5, 'Monday', 3, '60', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 5, 'Wednesday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 5, 'Wednesday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 5, 'Wednesday', 4, '15', 3),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 5, 'Wednesday', 3, '10', 4),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 5, 'Thursday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 5, 'Thursday', 3, '10 steps', 2),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 5, 'Thursday', 3, '10', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 5, 'Thursday', 3, '60', 4),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 5, 'Saturday', 4, '10', 1),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 5, 'Saturday', 4, '10', 2),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 5, 'Saturday', 4, '15', 3),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 5, 'Saturday', 3, '60', 4);
