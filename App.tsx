import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icon';
import { WEEKLY_ROUTINE_MAP, ROUTINE_A, ROUTINE_B } from './constants';
import { DayCard } from './components/DayCard';
import { RoutineView } from './components/RoutineView';
import { NutritionView } from './components/NutritionView';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { KegelView } from './components/KegelView';
import { Routine, DailyPlan, Meal } from './types';

// Tab Definitions
type Tab = 'schedule' | 'nutrition' | 'kegel';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [darkMode, setDarkMode] = useState(false);
  
  // Logic to determine today's index (0 = Monday, ..., 6 = Sunday)
  const todayIndex = (new Date().getDay() + 6) % 7;
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(todayIndex); 
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // Initialize Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('fp_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('fp_theme', newMode ? 'dark' : 'light');
  };

  const handleRoutineSelect = (routine: Routine) => {
    setSelectedRoutine(routine);
    window.scrollTo(0, 0);
  };

  const handleBackToSchedule = () => {
    setSelectedRoutine(null);
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
  };

  const handleCloseWorkout = () => {
    setIsWorkoutActive(false);
  };

  // Helper to adapt new constants to old component expectations temporarily or just use logic here
  // We construct the "DailyPlan" on the fly based on WEEKLY_ROUTINE_MAP
  const weeklyPlanDisplay: DailyPlan[] = WEEKLY_ROUTINE_MAP.map(dayMap => {
     // Create a minimal meal preview for the DayCard (NutritionView has full details)
     const meals: Meal[] = [
         { type: 'Almuerzo', description: 'Ver detalle en Guía de Nutrición' },
         { type: 'Cena', description: 'Ver detalle en Guía de Nutrición' }
     ];
     return {
         day: dayMap.day,
         routineId: dayMap.routineId,
         meals: meals
     };
  });

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen pb-20 md:pb-0 md:pl-64 transition-colors duration-300 ${activeTab === 'kegel' ? 'bg-slate-900' : 'bg-slate-50 dark:bg-slate-900'}`}>
        {/* Workout Player Overlay */}
        {isWorkoutActive && selectedRoutine && (
            <WorkoutPlayer routine={selectedRoutine} onClose={handleCloseWorkout} />
        )}

        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">FP</div>
              <h1 className="font-bold text-lg tracking-tight">FitPlan Chile</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white">
            {darkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
        <nav className={`fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-r z-40 bottom-0 w-full md:block shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:shadow-none transition-colors duration-300 
          ${activeTab === 'kegel' 
            ? 'bg-slate-900 border-slate-800 text-slate-400' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
          }`}>
          
          {/* Desktop Logo */}
          <div className={`hidden md:flex items-center justify-between p-6 border-b mb-4 ${activeTab === 'kegel' ? 'border-slate-800' : 'border-slate-100 dark:border-slate-800'}`}>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">FP</div>
                 <h1 className={`font-bold text-xl tracking-tight ${activeTab === 'kegel' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>FitPlan</h1>
               </div>
               <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                 {darkMode ? <Icons.Sun className="w-5 h-5 text-amber-400" /> : <Icons.Moon className="w-5 h-5 text-slate-400" />}
               </button>
          </div>

          <div className="flex md:flex-col justify-around md:justify-start md:px-4 gap-1 p-2 md:p-0">
            <button 
              onClick={() => { setActiveTab('schedule'); setSelectedRoutine(null); }}
              className={`flex-1 md:flex-none flex md:flex-row flex-col items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-lg transition-colors 
                ${activeTab === 'schedule' 
                  ? 'text-primary md:bg-primary/5 dark:md:bg-primary/10' 
                  : 'hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <Icons.Calendar className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Entrenamiento</span>
            </button>

            <button 
              onClick={() => { setActiveTab('nutrition'); setSelectedRoutine(null); }}
              className={`flex-1 md:flex-none flex md:flex-row flex-col items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-lg transition-colors 
                ${activeTab === 'nutrition' 
                  ? 'text-primary md:bg-primary/5 dark:md:bg-primary/10' 
                  : 'hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <Icons.Food className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Nutrición</span>
            </button>

            <button 
              onClick={() => { setActiveTab('kegel'); setSelectedRoutine(null); }}
              className={`flex-1 md:flex-none flex md:flex-row flex-col items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-lg transition-colors 
                ${activeTab === 'kegel' 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : 'hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <Icons.Activity className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-bold mt-1 md:mt-0">Potencia</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={`p-0 md:p-8 max-w-3xl mx-auto ${activeTab === 'kegel' ? 'md:max-w-xl' : ''}`}>
          
          {/* VIEW: SCHEDULE / ROUTINE */}
          {activeTab === 'schedule' && (
            <div className="p-4 md:p-0">
              {selectedRoutine ? (
                <RoutineView 
                  routine={selectedRoutine} 
                  onBack={handleBackToSchedule} 
                  onStart={handleStartWorkout}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tu Semana</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Selecciona un día para ver la rutina.</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {weeklyPlanDisplay.map((dayPlan, index) => (
                      <DayCard 
                        key={dayPlan.day}
                        plan={dayPlan}
                        isActive={selectedDayIndex === index}
                        isToday={index === todayIndex}
                        onClick={() => setSelectedDayIndex(index === selectedDayIndex ? null : index)}
                        onViewRoutine={(r) => handleRoutineSelect(r)}
                      />
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50 flex gap-3 text-amber-800 dark:text-amber-400 text-sm">
                     <Icons.Info className="w-5 h-5 shrink-0" />
                     <p>Recuerda descansar Sábado y Domingo. La recuperación es clave para el crecimiento muscular.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: NUTRITION */}
          {activeTab === 'nutrition' && (
               <div className="space-y-6 p-4 md:p-0">
                   <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Guía de Alimentación</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Estrategias, recetas y plan mensual.</p>
                  </div>
                  <NutritionView />
               </div>
          )}

          {/* VIEW: KEGEL (P-TRAINER) */}
          {activeTab === 'kegel' && (
              <KegelView />
          )}

        </main>
      </div>
    </div>
  );
}