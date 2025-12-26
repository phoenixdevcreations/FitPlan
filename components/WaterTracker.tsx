import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';

export const WaterTracker: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [isSetup, setIsSetup] = useState(false);
  
  // Daily State
  const [goal, setGoal] = useState(2000); // Default 2L
  const [current, setCurrent] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Notification Timer Ref
  const notificationInterval = React.useRef<number | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedWeight = localStorage.getItem('fp_weight');
    const savedGoal = localStorage.getItem('fp_water_goal');
    const savedCurrent = localStorage.getItem('fp_water_current');
    const savedDate = localStorage.getItem('fp_water_date');
    const today = new Date().toDateString();

    if (savedWeight && savedGoal) {
      setWeight(savedWeight);
      setGoal(parseInt(savedGoal));
      setIsSetup(true);
    }

    // Reset if it's a new day
    if (savedDate !== today) {
      setCurrent(0);
      localStorage.setItem('fp_water_date', today);
      localStorage.setItem('fp_water_current', '0');
    } else if (savedCurrent) {
      setCurrent(parseInt(savedCurrent));
    }

    // Check Notification Permission status on load
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Save Current Progress
  useEffect(() => {
    localStorage.setItem('fp_water_current', current.toString());
  }, [current]);

  // Manage Notification Interval
  useEffect(() => {
    if (notificationsEnabled) {
      // Set interval for 1 hour (3600000 ms)
      notificationInterval.current = window.setInterval(() => {
        sendNotification();
      }, 60 * 60 * 1000); // Every hour
    } else {
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
      }
    }

    return () => {
      if (notificationInterval.current) clearInterval(notificationInterval.current);
    };
  }, [notificationsEnabled]);

  const calculateGoal = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    // Formula: 35ml per kg
    const calculatedGoal = Math.round(w * 35);
    setGoal(calculatedGoal);
    setIsSetup(true);

    // Save
    localStorage.setItem('fp_weight', weight);
    localStorage.setItem('fp_water_goal', calculatedGoal.toString());
    localStorage.setItem('fp_water_date', new Date().toDateString());
  };

  const addWater = (amount: number) => {
    setCurrent(prev => Math.min(prev + amount, 5000)); // Max 5Lcap
  };

  const removeWater = (amount: number) => {
    setCurrent(prev => Math.max(prev - amount, 0));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }

    // Check if permission is denied
    if (Notification.permission === 'denied') {
      alert("Las notificaciones están bloqueadas. Por favor habilítalas en la configuración de tu navegador para recibir recordatorios.");
      setNotificationsEnabled(false);
      return;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification("¡Recordatorios Activados!", {
        body: "Te avisaremos para que te mantengas hidratado.",
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      requestNotificationPermission();
    }
  };

  const sendNotification = () => {
    if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
        const percent = Math.round((current / goal) * 100);
        if (percent < 100) {
            new Notification("Hora de hidratarse 💧", {
                body: `Llevas un ${percent}% de tu meta diaria. ¡Toma un vaso de agua!`,
                tag: 'hydration-reminder'
            });
        }
    }
  };

  const resetSetup = () => {
    setIsSetup(false);
  };

  // Glass size
  const glassSize = 250;
  const glasses = Math.ceil(goal / glassSize);
  const glassesDrunk = Math.floor(current / glassSize);
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  if (!isSetup) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl animate-fade-in text-center">
        <Icons.Water className="w-16 h-16 mx-auto mb-4 text-blue-100" />
        <h2 className="text-2xl font-bold mb-2">Calculadora de Hidratación</h2>
        <p className="text-blue-100 mb-6 text-sm">Ingresa tu peso corporal para calcular tu meta diaria ideal de agua.</p>
        
        <div className="relative max-w-xs mx-auto mb-6">
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Peso en Kg"
            className="w-full text-center text-slate-900 text-xl font-bold p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>

        <button 
          onClick={calculateGoal}
          disabled={!weight}
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          Calcular Meta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div>
             <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Tu Hidratación</h3>
             <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{current}</span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">/ {goal} ml</span>
             </div>
           </div>
           <button onClick={resetSetup} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <Icons.Settings className="w-5 h-5" />
           </button>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6 relative z-10">
           <div 
             className="h-full bg-blue-500 transition-all duration-500 ease-out relative"
             style={{ width: `${percentage}%` }}
           >
             <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 relative z-10">
           <button 
             onClick={() => removeWater(glassSize)}
             className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:border-red-200 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
           >
             <Icons.Minus className="w-6 h-6" />
           </button>

           <button 
             onClick={() => addWater(glassSize)}
             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
           >
             <Icons.Plus className="w-5 h-5" />
             <span>Agregar Vaso ({glassSize}ml)</span>
           </button>
        </div>

        {/* Background Water Wave Decoration */}
        <div 
            className="absolute bottom-0 left-0 w-full transition-all duration-700 opacity-10 dark:opacity-20 pointer-events-none"
            style={{ height: `${percentage}%`, maxHeight: '100%' }}
        >
             <div className="w-full h-full bg-blue-500 wave-animation"></div>
        </div>
      </div>

      {/* Glasses Visualization */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
         <h4 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-4 flex items-center gap-2">
           <Icons.Glass className="w-4 h-4" /> Distribución Diaria
         </h4>
         <div className="flex flex-wrap gap-3 justify-center">
           {Array.from({ length: glasses }).map((_, idx) => (
             <Icons.Glass 
               key={idx}
               className={`w-8 h-8 transition-all duration-300 ${
                 idx < glassesDrunk 
                   ? 'text-blue-500 fill-blue-500/20 drop-shadow-sm scale-110' 
                   : 'text-slate-300 dark:text-slate-600' 
               }`} 
             />
           ))}
         </div>
         <p className="text-xs text-blue-600 dark:text-blue-400 mt-4 text-center font-medium">
           {glassesDrunk} de {glasses} vasos consumidos
         </p>
      </div>

      {/* Notifications Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${notificationsEnabled ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
               {notificationsEnabled ? <Icons.Bell className="w-5 h-5" /> : <Icons.BellOff className="w-5 h-5" />}
            </div>
            <div>
               <p className="font-bold text-slate-800 dark:text-white text-sm">Recordatorios</p>
               <p className="text-xs text-slate-500 dark:text-slate-400">Recibir alertas cada 1 hora</p>
            </div>
         </div>
         
         <button 
           onClick={toggleNotifications}
           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notificationsEnabled ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`}
         >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
         </button>
      </div>
      
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 px-4">
        * La fórmula utilizada es Peso (kg) x 35ml. Ajusta según tu actividad física.
      </div>
    </div>
  );
};