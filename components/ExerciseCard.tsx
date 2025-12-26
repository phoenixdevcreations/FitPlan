import React from 'react';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<Props> = ({ exercise, index }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
          <span className="bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          {exercise.name}
        </h3>
      </div>
      
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 pl-8">
        <div>
          <span className="font-semibold text-primary block text-xs uppercase tracking-wider mb-1">Posición</span>
          <p>{exercise.position}</p>
        </div>
        <div>
          <span className="font-semibold text-primary block text-xs uppercase tracking-wider mb-1">Ejecución</span>
          <p>{exercise.execution}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600 mt-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs uppercase tracking-wider mb-1">Enfoque</span>
          <p className="text-slate-700 dark:text-slate-300">{exercise.focus}</p>
          {exercise.detail && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium italic">💡 {exercise.detail}</p>
          )}
        </div>
      </div>
    </div>
  );
};