import React from 'react';
import { DailyPlan, Routine } from '../types';
import { Icons } from './Icon';
import { ROUTINE_A, ROUTINE_B } from '../constants';

interface Props {
  plan: DailyPlan;
  isActive: boolean;
  isToday: boolean;
  onClick: () => void;
  onViewRoutine: (routine: Routine) => void;
}

export const DayCard: React.FC<Props> = ({ plan, isActive, isToday, onClick, onViewRoutine }) => {
  const routine = plan.routineId === 'routine-a' ? ROUTINE_A : ROUTINE_B;

  // Determine styles based on state
  const containerClasses = isToday
    ? isActive
        ? 'ring-2 ring-amber-500 border-transparent shadow-md bg-amber-50/40 dark:bg-amber-900/20' 
        : 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/20 dark:bg-amber-900/10 shadow-sm'
    : isActive
        ? 'ring-2 ring-primary border-transparent shadow-md bg-primary/5 dark:bg-primary/10'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/30 dark:hover:border-primary/30';

  const circleClasses = isToday
    ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
    : isActive
        ? 'border-primary bg-primary text-white'
        : 'border-slate-100 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';

  const titleClasses = isToday
    ? 'text-slate-900 dark:text-white'
    : isActive
        ? 'text-primary'
        : 'text-slate-800 dark:text-slate-200';

  return (
    <div className={`transition-all duration-300 rounded-xl overflow-hidden border relative ${containerClasses}`}>
      
      {/* Today Badge */}
      {isToday && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10 shadow-sm">
          HOY
        </div>
      )}

      {/* Header clickable to expand */}
      <div 
        onClick={onClick}
        className="p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${circleClasses}`}>
                {plan.day.substring(0, 2)}
            </div>
            <div>
                <h3 className={`font-bold transition-colors ${titleClasses}`}>
                  {plan.day}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{routine.type}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <Icons.ArrowRight className={`w-5 h-5 text-slate-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Expanded Content */}
      {isActive && (
        <div className={`p-4 pt-0 animate-fade-in-down border-t ${isToday ? 'border-amber-200 dark:border-amber-900/50' : 'border-primary/10 dark:border-primary/5'}`}>
          
          {/* Workout Section */}
          <div className={`mt-4 bg-white dark:bg-slate-700/50 rounded-lg p-4 border shadow-sm ${isToday ? 'border-amber-100 dark:border-amber-900/30' : 'border-slate-100 dark:border-slate-700'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className={`flex items-center gap-2 font-semibold text-sm ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
                    <Icons.Workout className="w-4 h-4" />
                    <span>Entrenamiento</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onViewRoutine(routine); }}
                    className={`text-xs text-white px-3 py-1.5 rounded-full transition-colors ${isToday ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500'}`}
                >
                    Ver Rutina
                </button>
            </div>
            <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{routine.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{routine.structure.rounds || routine.structure.series} • {routine.structure.work || routine.structure.reps}</p>
          </div>

          {/* Meal Section */}
          <div className="mt-4">
            <div className={`flex items-center gap-2 font-semibold text-sm mb-3 ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
                <Icons.Food className="w-4 h-4" />
                <span>Alimentación del día</span>
            </div>
            
            <div className="space-y-3">
                {plan.meals.map((meal, idx) => (
                    <div key={idx} className={`relative pl-4 border-l-2 transition-colors ${isToday ? 'border-amber-200 dark:border-amber-800 hover:border-amber-400' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase mb-0.5">{meal.type}</span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{meal.description}</p>
                    </div>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};