export interface UserProgressEntry {
  week: number;
  day: string;
  date: string;
  user_id: string;
  reps: { [exerciseName: string]: number[] };
  notes: string;
}
