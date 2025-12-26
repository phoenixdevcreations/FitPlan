import React, { useState, useEffect, useRef } from 'react';
import { Routine, ExerciseType } from '../types';
import { Icons } from './Icon';

interface Props {
  routine: Routine;
  onClose: () => void;
}

export const WorkoutPlayer: React.FC<Props> = ({ routine, onClose }) => {
  const isMetabolic = routine.type === ExerciseType.METABOLIC;
  
  // Has Warmup?
  const hasWarmup = routine.warmup && routine.warmup.length > 0;
  const [isWarmupPhase, setIsWarmupPhase] = useState(hasWarmup);

  // Active Exercise Array based on phase
  const activeExercises = isWarmupPhase ? (routine.warmup || []) : routine.exercises;
  
  // Progress State
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1); // For metabolic circuits
  const [currentSet, setCurrentSet] = useState(1); // For hypertrophy sets
  
  // Timer State
  const [isActive, setIsActive] = useState(false);
  // Default time for Warmup is 60s if not metabolic duration
  const [timeLeft, setTimeLeft] = useState(isWarmupPhase ? 60 : (routine.durationSeconds || 0)); // Countdown
  const [elapsedTime, setElapsedTime] = useState(0); // Stopwatch
  const [isResting, setIsResting] = useState(false);
  const [isRoundRest, setIsRoundRest] = useState(false); // New state for long rest between rounds
  const [completed, setCompleted] = useState(false);

  // Exit Confirmation State
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const currentExercise = activeExercises[exerciseIndex];
  
  // Derived Totals
  const totalRounds = routine.totalRounds || 1;
  const totalSets = routine.setsPerExercise || 1;

  // Cleanup & Wake Lock
  useEffect(() => {
    // Wake Lock implementation
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock error:', err); // Fail silently if not supported/allowed
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      // Re-acquire lock if app comes back to foreground
      if (document.visibilityState === 'visible' && wakeLock !== null) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) wakeLock.release();
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        // Countdown Mode: Metabolic Work, All Rests, Warmups
        if (isMetabolic || isResting || isRoundRest || isWarmupPhase) {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        } else {
          // Stopwatch Mode (Hypertrophy Work)
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => stopTimer();
  }, [isActive, isMetabolic, isResting, isRoundRest, isWarmupPhase]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimerComplete = () => {
    stopTimer();
    
    // Logic: What happens when timer hits 0?
    if (isWarmupPhase) {
        if (isResting) {
            // End of Warmup Rest -> Start Next Warmup Exercise
            setIsResting(false);
            setExerciseIndex(prev => prev + 1);
            resetWorkTimer(true);
            setIsActive(true);
        } else {
            // End of Warmup Work -> Check if last, else Rest
            completeExerciseInstance();
        }
    } else if (isResting) {
        // Rest is over, start next work
        startNextWorkPhase();
    } else if (isRoundRest) {
        // Round rest over, start Round 2+
        setIsRoundRest(false);
        setExerciseIndex(0);
        setCurrentRound(prev => prev + 1);
        
        // Reset to Work Phase
        setIsResting(false);
        setIsActive(false); 
        resetWorkTimer();
    } else {
        // Work Phase Over (Metabolic)
        // Auto-start rest for metabolic? Yes.
        if (isMetabolic) {
           completeExerciseInstance();
        }
    }
  };

  // Called when user hits "Next" or Timer ends
  const completeExerciseInstance = () => {
     stopTimer();
     setIsActive(false);

     // Check if last exercise of CURRENT PHASE
     const isLastExercise = exerciseIndex === activeExercises.length - 1;

     if (isWarmupPhase) {
         if (isLastExercise) {
             // End Warmup -> Start Routine
             setIsWarmupPhase(false);
             setExerciseIndex(0);
             // Setup first exercise time
             resetWorkTimer(false); // pass false for isWarmup
         } else {
             // Next Warmup Exercise (With Transition Rest)
             setIsResting(true);
             setTimeLeft(10); // 10s transition for warmup
             setIsActive(true);
         }
         return;
     }

     // --- MAIN ROUTINE LOGIC ---
     // Decide next step based on routine type
     if (isMetabolic) {
        // Circuit Logic: Ex 1 -> Rest -> Ex 2
        
        if (isLastExercise) {
            // End of Round
            if (currentRound < totalRounds) {
                // Trigger Round Rest
                setIsRoundRest(true);
                setTimeLeft(routine.roundRestSeconds || 60);
                setIsActive(true); // Auto start round rest
            } else {
                setCompleted(true);
            }
        } else {
            // Normal Rest between exercises
            setIsResting(true);
            setTimeLeft(routine.restSeconds || 15);
            setIsActive(true); // Auto start rest
        }
     } else {
        // Hypertrophy Logic: Ex 1 (Set 1) -> Rest -> Ex 1 (Set 2)
        if (currentSet < totalSets) {
            // Same exercise, next set -> Trigger Rest
            setIsResting(true);
            // Default Rest for Hypertrophy
            setTimeLeft(60); 
            // Do NOT auto-start rest for hypertrophy (user controls pace usually), or maybe yes? 
            // Let's auto-start for flow, but user can pause.
            setIsActive(true); 
        } else {
            // All sets done for this exercise -> Move to next exercise (or finish)
            if (exerciseIndex < activeExercises.length - 1) {
                // Transition to next exercise (Maybe a small transition rest? reusing rest logic)
                setIsResting(true);
                setTimeLeft(60);
                setIsActive(true);
            } else {
                setCompleted(true);
            }
        }
     }
  };

  const startNextWorkPhase = () => {
      stopTimer();
      setIsResting(false);
      setIsActive(false);

      if (isMetabolic) {
          // Move to next index if we were not at the end (Round logic handled in completeExerciseInstance)
          // Actually, completeExerciseInstance put us in Rest. Now we wake up from Rest.
          // If we were at last exercise, we went to RoundRest, handled above.
          // So we just need to increment index here.
           setExerciseIndex(prev => prev + 1);
      } else {
          // Hypertrophy
          if (currentSet < totalSets) {
              setCurrentSet(prev => prev + 1);
          } else {
              // We finished the sets, moving to next exercise
              setCurrentSet(1);
              setExerciseIndex(prev => prev + 1);
          }
      }
      resetWorkTimer(false);
  };

  const resetWorkTimer = (forWarmup = false) => {
      if (forWarmup) {
          setTimeLeft(60);
      } else if (isMetabolic) {
          setTimeLeft(routine.durationSeconds || 45);
      } else {
          setElapsedTime(0);
      }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const adjustRestTime = (amount: number) => {
      setTimeLeft(prev => Math.max(0, prev + amount));
  };

  const skipPhase = () => {
      // User pressed skip button
      if (isResting || isRoundRest) {
          // Skip rest
          handleTimerComplete();
      } else {
          // Skip work
          completeExerciseInstance();
      }
  };
  
  const handleAttemptClose = () => {
    setIsActive(false); // Pause timer
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
      setShowExitConfirmation(false);
      onClose();
  };

  const cancelExit = () => {
      setShowExitConfirmation(false);
      // User must manually resume to avoid surprise
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (completed) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-white z-50 flex flex-col items-center justify-center p-8 animate-fade-in">
        <Icons.Check className="w-24 h-24 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold mb-2 text-center">¡Entrenamiento Completado!</h2>
        <p className="text-slate-400 text-center mb-8">Gran trabajo. Recuerda hidratarte y consumir proteína.</p>
        <button 
          onClick={onClose}
          className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors"
        >
          Finalizar
        </button>
      </div>
    );
  }

  // Determine Title based on State
  let phaseTitle = currentExercise?.name || '';
  let phaseSubtitle = '';
  
  if (isWarmupPhase) {
      if (isResting) {
        phaseTitle = 'Preparación';
        phaseSubtitle = `Siguiente: ${activeExercises[exerciseIndex + 1]?.name || 'Fin'}`;
      } else {
        phaseTitle = currentExercise?.name || 'Calentamiento';
        phaseSubtitle = 'Ejercicio de Calentamiento';
      }
  } else if (isRoundRest) {
      phaseTitle = 'Descanso de Vuelta';
      phaseSubtitle = `Prepárate para la vuelta ${currentRound + 1}`;
  } else if (isResting) {
      phaseTitle = 'Descanso';
      // Predict next
      if (isMetabolic) {
          phaseSubtitle = `Siguiente: ${activeExercises[exerciseIndex + 1]?.name || 'Fin'}`;
      } else {
          if (currentSet < totalSets) {
              phaseSubtitle = `Siguiente: Serie ${currentSet + 1}`;
          } else {
              phaseSubtitle = `Siguiente: ${activeExercises[exerciseIndex + 1]?.name || 'Fin'}`;
          }
      }
  }

  // Colors
  const isRecovery = isResting || isRoundRest;
  const headerColor = isWarmupPhase ? 'text-amber-500' : (isRecovery ? 'text-blue-400' : 'text-emerald-500');
  const barCompletedColor = isWarmupPhase ? 'bg-amber-600' : 'bg-emerald-500';
  const barActiveColor = isWarmupPhase ? 'bg-amber-400' : 'bg-amber-500';
  const headerText = isWarmupPhase ? 'CALENTAMIENTO' : (isRecovery ? 'RECUPERACIÓN' : 'TRABAJO');

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 flex flex-col">
      {/* Confirmation Modal */}
      {showExitConfirmation && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                  <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icons.Info className="w-6 h-6 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">¿Abandonar Rutina?</h3>
                      <p className="text-slate-400 text-sm">Si sales ahora, se perderá el progreso de esta sesión.</p>
                  </div>
                  <div className="flex gap-3">
                      <button 
                          onClick={cancelExit}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition-colors"
                      >
                          Continuar
                      </button>
                      <button 
                          onClick={confirmExit}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors"
                      >
                          Salir
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header with Visual Progress */}
      <div className="flex flex-col border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm z-20">
        <div className="flex items-center justify-between p-4 pb-2">
            <button onClick={handleAttemptClose} className="p-2 text-slate-400 hover:text-white">
            <Icons.Close className="w-6 h-6" />
            </button>
            <div className="text-center">
                <span className={`text-xs uppercase font-bold tracking-widest ${headerColor}`}>
                    {headerText}
                </span>
                {!isWarmupPhase && (
                    <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-1">
                        {isMetabolic ? (
                            <span>Vuelta <span className="text-white">{currentRound}</span> / {totalRounds}</span>
                        ) : (
                            <span>Serie <span className="text-white">{currentSet}</span> / {totalSets}</span>
                        )}
                    </div>
                )}
            </div>
            <div className="w-10"></div>
        </div>
        
        {/* Segmented Progress Bar */}
        <div className="px-6 pb-4 w-full max-w-lg mx-auto">
            <div className="flex items-center gap-1.5 h-1.5">
                {activeExercises.map((_, idx) => {
                    let barColor = 'bg-slate-700'; // Upcoming
                    
                    if (idx < exerciseIndex) {
                        barColor = barCompletedColor; // Completed
                    } else if (idx === exerciseIndex) {
                        if (isRecovery) {
                            barColor = 'bg-blue-400 animate-pulse'; // Resting
                        } else {
                            barColor = barActiveColor; // Active Work
                        }
                    }
                    
                    return (
                        <div 
                            key={idx} 
                            className={`flex-1 h-full rounded-full transition-all duration-500 ${barColor} ${idx === exerciseIndex ? 'scale-y-150' : ''}`} 
                        />
                    );
                })}
            </div>
             <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
                <span>Inicio</span>
                <span>Ej {exerciseIndex + 1} de {activeExercises.length}</span>
                <span>Fin</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className={`absolute w-full h-full rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isWarmupPhase ? 'bg-amber-600' : (isRecovery ? 'bg-blue-600' : isActive ? 'bg-emerald-600' : 'bg-slate-700')}`}></div>

        <div className="relative z-10 text-center w-full max-w-md">
            
            {/* Exercise Image Display */}
            {!isRecovery && currentExercise?.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 aspect-video mx-auto w-full max-w-[300px]">
                <img 
                  src={currentExercise.imageUrl} 
                  alt={currentExercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight transition-all animate-fade-in">
              {phaseTitle}
            </h2>
            {phaseSubtitle && <p className="text-slate-300 mb-6">{phaseSubtitle}</p>}
            
            {/* Timer Display */}
            <div 
                onClick={toggleTimer}
                className={`text-8xl font-mono font-bold mb-8 cursor-pointer tabular-nums tracking-tighter transition-colors select-none ${
                  (isMetabolic || isRecovery || isWarmupPhase) && timeLeft <= 5 && isActive ? 'text-red-500 scale-110' : 'text-white'
                }`}
            >
                {(isMetabolic || isRecovery || isWarmupPhase) ? formatTime(timeLeft) : formatTime(elapsedTime)}
            </div>
            
            {/* Adjustable Timer Controls (Only during Rest) */}
            {isRecovery && (
                <div className="flex items-center justify-center gap-4 mb-8">
                     <button 
                       onClick={() => adjustRestTime(-10)}
                       className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 flex items-center justify-center text-white font-bold transition-colors"
                     >
                       -10
                     </button>
                     <span className="text-xs uppercase font-bold text-slate-400">Ajustar</span>
                     <button 
                       onClick={() => adjustRestTime(10)}
                       className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 flex items-center justify-center text-white font-bold transition-colors"
                     >
                       +10
                     </button>
                </div>
            )}

            {/* Instruction Card (Only during Work) */}
            {!isRecovery && (
                <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 mb-6 text-left shadow-xl animate-fade-in-up">
                    <div className="mb-4">
                        <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                          Posición
                        </span>
                        <p className="text-sm md:text-base text-slate-200 leading-snug">{currentExercise?.position}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                          Ejecución
                        </span>
                        <p className="text-sm md:text-base text-slate-200 leading-snug">{currentExercise?.execution}</p>
                    </div>
                    {currentExercise?.detail && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-amber-400 italic">💡 {currentExercise.detail}</p>
                      </div>
                    )}
                     {isWarmupPhase && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-amber-400 italic">🔥 Calentamiento: Realiza movimientos suaves y controlados.</p>
                      </div>
                    )}
                </div>
            )}
             
            {(isRecovery) && (
                 <div className="text-slate-300 mb-8 animate-pulse bg-slate-800/30 p-6 rounded-xl border border-white/5">
                     <p className="text-lg font-medium">¡Respira!</p>
                     <p className="text-sm text-slate-400 mt-2">Inhala por la nariz, exhala por la boca.</p>
                 </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
                <button 
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 ${isActive ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-primary hover:bg-emerald-600 text-white'}`}
                >
                    {isActive ? <Icons.Pause className="w-8 h-8 fill-current" /> : <Icons.Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <button 
                    onClick={skipPhase}
                    className="group flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                    <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                        <Icons.Skip className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Siguiente</span>
                </button>
            </div>
            
            {!isMetabolic && !isWarmupPhase && !isActive && !isRecovery && elapsedTime === 0 && (
               <p className="mt-8 text-slate-500 text-xs uppercase tracking-wider animate-fade-in">
                 Inicia el cronómetro para tu serie
               </p>
            )}
        </div>
      </div>
    </div>
  );
};