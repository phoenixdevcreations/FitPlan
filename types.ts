export enum ExerciseType {
  METABOLIC = 'Circuito Metabólico',
  HYPERTROPHY = 'Hipertrofia',
  REST = 'Descanso',
  WARMUP = 'Calentamiento'
}

export interface Exercise {
  id: string;
  name: string;
  position: string;
  execution: string;
  focus: string;
  detail?: string;
  imageUrl?: string; // New field for exercise image
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  structure: {
    work?: string;
    rest?: string;
    rounds?: string;
    series?: string;
    reps?: string;
  };
  // Logic Control Fields
  durationSeconds?: number; // Work time for metabolic
  restSeconds?: number; // Rest time between exercises
  roundRestSeconds?: number; // Rest time between full circuit rounds
  totalRounds?: number; // For Circuits (Metabolic)
  setsPerExercise?: number; // For Straight Sets (Hypertrophy)
  warmup?: Exercise[]; // New Warmup Section
  exercises: Exercise[];
}

export interface MealDetail {
  title: string;
  description: string;
}

export interface DailyDiet {
  day: string;
  approxCalories: number;
  breakfast: MealDetail;
  lunch: MealDetail;
  snack: MealDetail;
  dinner: MealDetail;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  preparation: string;
}

export interface NutritionRule {
  title: string;
  content: string;
}

export interface WeeklyRoutineMap {
  day: string;
  routineId: string | null;
}

export interface Meal {
  type: string;
  description: string;
}

export interface DailyPlan {
  day: string;
  routineId: string | null;
  meals: Meal[];
}

export interface ShoppingCategory {
  category: string;
  items: string[];
}

// --- KEGEL TYPES ---

export type KegelGoalType = 'erection' | 'stamina' | 'health';

export interface KegelLevel {
  id: string;
  title: string;
  type: 'localization' | 'endurance' | 'power' | 'relaxation';
  description: string;
  durationMinutes: number;
  contractTime: number; // Seconds
  relaxTime: number; // Seconds
  reps: number;
  color: string;
}