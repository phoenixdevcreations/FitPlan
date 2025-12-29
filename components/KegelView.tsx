import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icon';
import { KEGEL_LEVELS } from '../constants';
import { KegelLevel, KegelGoalType } from '../types';

export const KegelView: React.FC = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [goal, setGoal] = useState<KegelGoalType | null>(null);
    const [activeLevel, setActiveLevel] = useState<KegelLevel | null>(null);
    const [sessionActive, setSessionActive] = useState(false);
    const [tutorialSeen, setTutorialSeen] = useState(false);

    // Persistence
    useEffect(() => {
        const savedOnboarding = localStorage.getItem('fp_kegel_onboarding');
        const savedGoal = localStorage.getItem('fp_kegel_goal');
        const savedTutorial = localStorage.getItem('fp_kegel_tutorial');

        if (savedOnboarding === 'true' && savedGoal) {
            setOnboardingComplete(true);
            setGoal(savedGoal as KegelGoalType);
        }
        if (savedTutorial === 'true') {
            setTutorialSeen(true);
        }
    }, []);

    const finishOnboarding = (selectedGoal: KegelGoalType) => {
        setGoal(selectedGoal);
        setOnboardingComplete(true);
        localStorage.setItem('fp_kegel_onboarding', 'true');
        localStorage.setItem('fp_kegel_goal', selectedGoal);
    };

    const startSession = (level: KegelLevel) => {
        setActiveLevel(level);
        setSessionActive(true);
    };

    const finishSession = () => {
        setSessionActive(false);
        setActiveLevel(null);
    };

    const markTutorialSeen = () => {
        setTutorialSeen(true);
        localStorage.setItem('fp_kegel_tutorial', 'true');
    };

    if (sessionActive && activeLevel) {
        return <KegelPlayer level={activeLevel} onComplete={finishSession} />;
    }

    if (!onboardingComplete) {
        return <OnboardingScreen onComplete={finishOnboarding} />;
    }

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-4 pb-24 md:pb-4 animate-fade-in relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/20 blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center mb-8 pt-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">P-Trainer</h2>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Potencia & Control</p>
                </div>
            </div>

            {/* Tutorial Card (If not fully mastered, keep showing small) */}
            <div
                onClick={() => setTutorialSeen(false)} // Re-open tutorial
                className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl mb-8 flex items-center gap-4 cursor-pointer hover:bg-slate-700/80 transition-colors shadow-lg"
            >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icons.Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-200 text-sm">¿Lo estoy haciendo bien?</h3>
                    <p className="text-xs text-slate-400 mt-1">Repasa la técnica de localización muscular.</p>
                </div>
                <Icons.ArrowRight className="w-5 h-5 text-slate-500" />
            </div>

            {/* Goal Context */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    Tu Objetivo:
                    <span className="text-emerald-400 capitalize">
                        {goal === 'erection' ? 'Rigidez Máxima' : goal === 'stamina' ? 'Duración y Control' : 'Salud Integral'}
                    </span>
                </h3>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex gap-3 items-start">
                    <Icons.Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-sm leading-snug">
                        Elige <strong>una sola rutina</strong> para hoy. Se recomienda dominar el Nivel 1 antes de avanzar.
                    </p>
                </div>
            </div>

            {/* Levels Grid */}
            <div className="grid gap-4">
                {KEGEL_LEVELS.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => {
                            if (!tutorialSeen && level.type !== 'localization') {
                                alert("Por favor completa primero el tutorial de localización.");
                                setTutorialSeen(false); // Force modal
                            } else {
                                startSession(level);
                            }
                        }}
                        className="group relative overflow-hidden bg-slate-800 border border-slate-700 p-5 rounded-2xl text-left hover:border-slate-500 transition-all active:scale-[0.98]"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full ${level.color.replace('text-', 'bg-')}`}></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold uppercase tracking-wider ${level.color}`}>
                                {level.type === 'localization' ? 'Básico' : level.type === 'power' ? 'Avanzado' : 'Intermedio'}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                                <Icons.Clock className="w-3 h-3" /> {level.durationMinutes} min
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{level.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{level.description}</p>

                        {/* Visual Indicator of Activity Type */}
                        <div className="mt-4 flex gap-2">
                            {level.type === 'endurance' && (
                                <div className="h-1 w-full flex gap-1">
                                    <div className="h-full w-1/2 bg-emerald-500/50 rounded-full"></div>
                                    <div className="h-full w-1/2 bg-slate-700 rounded-full"></div>
                                </div>
                            )}
                            {level.type === 'power' && (
                                <div className="h-1 w-full flex gap-0.5">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className={`h-full flex-1 rounded-full ${i % 2 === 0 ? 'bg-amber-500/50' : 'bg-slate-700'}`}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Tutorial Modal Overlay */}
            {!tutorialSeen && (
                <TutorialModal onComplete={markTutorialSeen} />
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const OnboardingScreen: React.FC<{ onComplete: (goal: KegelGoalType) => void }> = ({ onComplete }) => {
    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-6 animate-fade-in text-white">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 mx-auto">
                    <Icons.Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-center mb-2">P-Trainer</h1>
                <p className="text-slate-400 text-center mb-10 text-lg">Optimización de rendimiento para hombres.</p>

                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 text-center">¿Cuál es tu objetivo principal?</p>

                <div className="space-y-4">
                    <button onClick={() => onComplete('erection')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-xl flex items-center gap-4 transition-all group">
                        <Icons.Activity className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-lg">Rigidez y Potencia</span>
                            <span className="text-sm text-slate-400">Mejorar calidad de erección.</span>
                        </div>
                    </button>
                    <button onClick={() => onComplete('stamina')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-xl flex items-center gap-4 transition-all group">
                        <Icons.Timer className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-lg">Duración y Control</span>
                            <span className="text-sm text-slate-400">Gestionar reflejo eyaculatorio.</span>
                        </div>
                    </button>
                    <button onClick={() => onComplete('health')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-xl flex items-center gap-4 transition-all group">
                        <Icons.Shield className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-lg">Salud Prostática</span>
                            <span className="text-sm text-slate-400">Prevención y flujo urinario.</span>
                        </div>
                    </button>
                </div>

                <p className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Icons.Shield className="w-3 h-3" /> Privacidad Garantizada. No se comparten datos.
                </p>
            </div>
        </div>
    );
};

const TutorialModal: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 flex">
                    <div className={`h-full bg-blue-500 transition-all duration-300`} style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
                </div>

                <div className="mt-4 min-h-[300px] flex flex-col items-center text-center">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
                                <Icons.Activity className="w-12 h-12 text-blue-400" />
                                <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-ping"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Localiza el Músculo</h3>
                            <p className="text-slate-300 mb-4">
                                Imagina que intentas <strong>detener el flujo de orina</strong> a mitad de camino. Ese músculo que contraes es el Pubococcígeo (PC).
                            </p>
                            <p className="text-sm text-amber-400 font-bold bg-amber-900/20 px-3 py-2 rounded-lg inline-block">
                                ⚠️ No contraigas glúteos ni abdomen.
                            </p>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Icons.Wind className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">La Respiración</h3>
                            <p className="text-slate-300 mb-4">
                                <strong>Inhala</strong> relajando el suelo pélvico (como si empujaras suavemente hacia afuera).
                                <br /><br />
                                <strong>Exhala</strong> contrayendo y elevando el músculo hacia adentro.
                            </p>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Icons.Zap className="w-12 h-12 text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Tipos de Ejercicio</h3>
                            <p className="text-slate-300 mb-2 text-sm text-left w-full px-4">
                                <strong className="text-white">Lentos:</strong> Mantener 5-10s. (Resistencia)
                            </p>
                            <p className="text-slate-300 mb-2 text-sm text-left w-full px-4">
                                <strong className="text-white">Rápidos:</strong> Contracciones de 1s. (Potencia)
                            </p>
                            <p className="text-slate-300 mb-4 text-sm text-left w-full px-4">
                                <strong className="text-white">Reverse:</strong> Relajación profunda.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => step < 3 ? setStep(s => s + 1) : onComplete()}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/50"
                    >
                        {step < 3 ? 'Siguiente' : 'Entendido, Comenzar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const KegelPlayer: React.FC<{ level: KegelLevel; onComplete: () => void }> = ({ level, onComplete }) => {
    // Session State
    const [timeLeft, setTimeLeft] = useState(level.durationMinutes * 60);
    const [phase, setPhase] = useState<'warmup' | 'contract' | 'relax' | 'finished'>('warmup');
    const [cycleTime, setCycleTime] = useState(5); // Countdown for current phase
    const [repsDone, setRepsDone] = useState(0);

    // Haptics Helper
    const vibrate = (pattern: number | number[]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    useEffect(() => {
        // Initial Warmup Timer
        if (phase === 'warmup') {
            // 5s Warmup
            const timer = setTimeout(() => {
                setPhase('relax'); // Start with relax/prepare
                setCycleTime(3);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Main Loop
    useEffect(() => {
        if (phase === 'finished' || phase === 'warmup') return;

        const interval = setInterval(() => {
            setCycleTime((prev) => {
                if (prev <= 1) {
                    // Switch Phase
                    if (phase === 'contract') {
                        setPhase('relax');
                        setRepsDone(r => r + 1);
                        vibrate([50, 50]); // Double tap for relax
                        return level.relaxTime;
                    } else {
                        setPhase('contract');
                        vibrate(200); // Long buzz for contract start
                        return level.contractTime;
                    }
                }
                return prev - 1;
            });

            setTimeLeft((prev) => {
                if (prev <= 1 || repsDone >= level.reps) {
                    setPhase('finished');
                    return 0;
                }
                return prev - 1;
            });

        }, 1000);

        return () => clearInterval(interval);
    }, [phase, level, repsDone]);

    // Render Finished State
    if (phase === 'finished') {
        return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in z-50">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Icons.Trophy className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">¡Sesión Completada!</h2>
                <p className="text-slate-400 text-center mb-8">Has sumado puntos a tu salud sexual.</p>
                <button onClick={onComplete} className="bg-white text-slate-900 font-bold py-3 px-10 rounded-full hover:bg-slate-200">
                    Continuar
                </button>
            </div>
        );
    }

    const isContracting = phase === 'contract';
    const isRelaxationLevel = level.type === 'relaxation';

    return (
        <div className="fixed inset-0 bg-slate-900 text-white z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <button onClick={onComplete} className="p-2 bg-slate-800 rounded-full text-slate-400">
                    <Icons.Close className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{level.title}</span>
                    <div className="text-xl font-mono font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Visualizer */}
            <div className="flex-1 flex flex-col items-center justify-center relative">

                {/* Breathing/Visual Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${isContracting ? 'bg-amber-500/30 scale-100' : 'bg-blue-500/20 scale-125'}`}></div>

                    {/* Ring */}
                    <div className={`w-full h-full border-4 rounded-full flex items-center justify-center transition-all duration-[2000ms] ${isContracting ? 'border-amber-500 scale-75' : 'border-blue-400/50 scale-110'}`}>
                        {/* Inner Core */}
                        <div className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-[2000ms] flex items-center justify-center ${isContracting ? 'bg-amber-500 scale-90' : 'bg-slate-800 scale-100'}`}>
                            <span className="text-4xl font-bold">{phase === 'warmup' ? 'Prep' : cycleTime}</span>
                        </div>
                    </div>
                </div>

                {/* Instruction Text */}
                <div className="mt-12 text-center h-20">
                    {phase === 'warmup' ? (
                        <h2 className="text-2xl font-bold text-slate-300">Prepárate...</h2>
                    ) : isContracting ? (
                        <>
                            <h2 className="text-4xl font-bold text-amber-500 mb-2 animate-pulse">
                                {isRelaxationLevel ? "EXPANDE / EMPUJA" : "CONTRAE"}
                            </h2>
                            <p className="text-slate-400">
                                {isRelaxationLevel ? "Inhala profundamente hacia abajo" : "Eleva hacia adentro"}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-blue-400 mb-2">RELAJA</h2>
                            <p className="text-slate-400">Suelta todo</p>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="p-8 pb-12">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Repeticiones</span>
                    <span>{repsDone} / {level.reps}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${(repsDone / level.reps) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};