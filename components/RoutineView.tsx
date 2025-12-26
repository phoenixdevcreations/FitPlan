import React from 'react';
import { Routine, ExerciseType } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { Icons } from './Icon';

interface Props {
  routine: Routine;
  onBack: () => void;
  onStart: () => void;
}

export const RoutineView: React.FC<Props> = ({ routine, onBack, onStart }) => {
  const isMetabolic = routine.type === ExerciseType.METABOLIC;

  return (
    <div className="animate-fade-in pb-10">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
      >
        ← Volver al calendario
      </button>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden ring-1 ring-white/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            {isMetabolic ? <Icons.Burn className="w-5 h-5 text-orange-400" /> : <Icons.Workout className="w-5 h-5 text-blue-400" />}
            <span className="uppercase tracking-widest text-xs font-bold">{routine.type}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{routine.name}</h2>
          <p className="text-slate-300 text-sm mb-6 max-w-lg leading-relaxed">{routine.description}</p>
          
          <button 
            onClick={onStart}
            className="group w-full sm:w-auto bg-primary hover:bg-emerald-500 text-white font-bold py-3.5 px-8 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                <Icons.Play className="w-4 h-4 fill-current" />
            </div>
            <span>COMENZAR RUTINA</span>
          </button>
        </div>
        
        {/* Abstract shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6">
        {routine.structure.work && (
          <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
            <Icons.Clock className="w-4 h-4 text-primary" />
            <span>Trabajo: <span className="font-bold text-slate-800 dark:text-white">{routine.structure.work}</span></span>
          </div>
        )}
        {routine.structure.rest && (
          <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
            <Icons.Timer className="w-4 h-4 text-orange-500" />
            <span>Descanso: <span className="font-bold text-slate-800 dark:text-white">{routine.structure.rest}</span></span>
          </div>
        )}
        {routine.structure.rounds && (
            <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
            <Icons.Reset className="w-4 h-4 text-blue-500" />
            <span>Rondas: <span className="font-bold text-slate-800 dark:text-white">{routine.structure.rounds}</span></span>
            </div>
        )}
        {routine.structure.series && (
            <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
            <Icons.Reset className="w-4 h-4 text-blue-500" />
            <span>Series: <span className="font-bold text-slate-800 dark:text-white">{routine.structure.series}</span></span>
            </div>
        )}
        {routine.structure.reps && (
            <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
            <Icons.Workout className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Reps: <span className="font-bold text-slate-800 dark:text-white">{routine.structure.reps}</span></span>
            </div>
        )}
      </div>
      
      {/* Warmup Section */}
      {routine.warmup && routine.warmup.length > 0 && (
        <div className="mb-8">
            <h3 className="font-bold text-lg text-amber-600 dark:text-amber-500 ml-1 flex items-center gap-2 mb-4">
                <Icons.Burn className="w-5 h-5 text-amber-500" />
                Calentamiento Previo
            </h3>
            <div className="grid gap-3">
                {routine.warmup.map((ex, idx) => (
                    <div key={ex.id} className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                         <div className="bg-white dark:bg-slate-800 text-amber-600 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/50 shadow-sm text-sm">
                            W{idx + 1}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{ex.name}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ex.execution}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white ml-1 flex items-center gap-2">
            <Icons.Menu className="w-5 h-5 text-slate-400" />
            Lista de Ejercicios
        </h3>
        {routine.exercises.map((ex, idx) => (
          <ExerciseCard key={ex.id} exercise={ex} index={idx} />
        ))}
      </div>
    </div>
  );
};