import React, { useState } from 'react';
import { DIET_W1_3, DIET_W2_4, RECIPES, GOLDEN_RULES, SHOPPING_LIST } from '../constants';
import { Icons } from './Icon';
import { WaterTracker } from './WaterTracker';

export const NutritionView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'recipes' | 'rules' | 'shopping' | 'water'>('plan');
  const [dietPhase, setDietPhase] = useState<1 | 2>(1); // 1 = Weeks 1&3, 2 = Weeks 2&4
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [recipeSearch, setRecipeSearch] = useState('');

  const activeDiet = dietPhase === 1 ? DIET_W1_3 : DIET_W2_4;
  
  // Calculate today index: Monday(0) - Sunday(6)
  const todayIndex = (new Date().getDay() + 6) % 7;

  const toggleCheck = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const toggleCategory = (items: string[]) => {
    const newChecked = new Set(checkedItems);
    const allChecked = items.every(item => newChecked.has(item));
    
    if (allChecked) {
        items.forEach(item => newChecked.delete(item));
    } else {
        items.forEach(item => newChecked.add(item));
    }
    setCheckedItems(newChecked);
  };

  // Filter Recipes Logic
  const filteredRecipes = RECIPES.filter(recipe => 
    recipe.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(recipeSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Sub Navigation */}
      <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('plan')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === 'plan' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Icons.Calendar className="w-4 h-4" /> Plan
        </button>
        <button
          onClick={() => setActiveSubTab('shopping')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === 'shopping' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Icons.List className="w-4 h-4" /> Compras
        </button>
        <button
          onClick={() => setActiveSubTab('recipes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === 'recipes' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Icons.Chef className="w-4 h-4" /> Recetas
        </button>
        <button
          onClick={() => setActiveSubTab('water')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === 'water' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Icons.Water className="w-4 h-4" /> Hidratación
        </button>
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === 'rules' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Icons.Book className="w-4 h-4" /> Tips
        </button>
      </div>

      {/* CONTENT: PLAN */}
      {activeSubTab === 'plan' && (
        <div className="animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
               <button 
                 onClick={() => setDietPhase(1)}
                 className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${dietPhase === 1 ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
               >
                 Semanas 1 y 3
               </button>
               <button 
                 onClick={() => setDietPhase(2)}
                 className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${dietPhase === 2 ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
               >
                 Semanas 2 y 4
               </button>
            </div>
          </div>
          
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-xl mb-6 text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <Icons.Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{dietPhase === 1 ? 'Enfoque en Legumbres y Jurel (Alto Omega-3 y Fibra)' : 'Variedad y Proteína Económica (Batch Cooking)'}</p>
          </div>

          <div className="space-y-6">
            {activeDiet.map((day, idx) => {
              // Logic to highlight today. Note: Weekend is combined in the last entry (index 5)
              let isToday = false;
              if (idx < 5 && idx === todayIndex) {
                 isToday = true;
              } else if (idx === 5 && (todayIndex === 5 || todayIndex === 6)) {
                 // Index 5 covers both Saturday(5) and Sunday(6)
                 isToday = true;
              }

              return (
                <div key={idx} className={`rounded-xl shadow-sm border overflow-hidden transition-all ${isToday ? 'bg-white dark:bg-slate-800 ring-2 ring-amber-400 border-transparent relative' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                  {isToday && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                          DÍA ACTUAL
                      </div>
                  )}
                  <div className={`px-4 py-3 border-b font-bold flex items-center justify-between ${isToday ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50 text-amber-800 dark:text-amber-400' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-amber-600' : 'bg-emerald-500'}`}></div>
                        {day.day}
                     </div>
                     <span className={`text-xs font-normal bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5 ${isToday ? 'mr-24' : ''}`}>
                        ~{day.approxCalories} kcal
                     </span>
                  </div>
                  <div className="p-4 space-y-4">
                     <MealRow label="Desayuno" meal={day.breakfast} />
                     <MealRow label="Almuerzo" meal={day.lunch} />
                     <MealRow label="Once/Merienda" meal={day.snack} />
                     <MealRow label="Cena" meal={day.dinner} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT: SHOPPING LIST */}
      {activeSubTab === 'shopping' && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-4 flex gap-3 text-blue-800 dark:text-blue-300 text-sm">
             <Icons.Bag className="w-5 h-5 shrink-0" />
             <p>Esta lista agrupa todos los ingredientes necesarios para el mes completo (Semanas 1 a 4).</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             {SHOPPING_LIST.map((category, idx) => {
               const allChecked = category.items.every(item => checkedItems.has(item));
               return (
               <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                 <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                   <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     {idx === 0 && <span className="text-emerald-500"><Icons.Food className="w-4 h-4" /></span>}
                     {idx === 1 && <span className="text-red-500"><Icons.Burn className="w-4 h-4" /></span>}
                     {idx === 2 && <span className="text-amber-500"><Icons.Bag className="w-4 h-4" /></span>}
                     {idx === 3 && <span className="text-blue-500"><Icons.Milk className="w-4 h-4" /></span>}
                     {category.category}
                   </div>
                   
                   <button 
                     onClick={() => toggleCategory(category.items)}
                     className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${allChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-400'}`}
                   >
                     {allChecked && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                   </button>
                 </div>
                 <div className="p-2">
                   {category.items.map((item, i) => {
                     const isChecked = checkedItems.has(item);
                     return (
                       <div 
                         key={i} 
                         onClick={() => toggleCheck(item)}
                         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                       >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                             {isChecked && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )})}
          </div>
        </div>
      )}

      {/* CONTENT: RECIPES */}
      {activeSubTab === 'recipes' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar receta o ingrediente (ej: avena, jurel)..."
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-shadow"
            />
          </div>

          <div className="grid gap-4">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <Icons.Chef className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{recipe.name}</h3>
                    </div>
                    <div className="mb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ingredientes</p>
                        <div className="flex flex-wrap gap-2">
                            {recipe.ingredients.map((ing, i) => (
                                <span key={i} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md">{ing}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preparación</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{recipe.preparation}</p>
                    </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 dashed">
                <Icons.Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No se encontraron recetas.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Intenta con otro ingrediente.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT: WATER TRACKER */}
      {activeSubTab === 'water' && (
        <WaterTracker />
      )}

      {/* CONTENT: RULES */}
      {activeSubTab === 'rules' && (
        <div className="grid gap-4 animate-fade-in">
           {GOLDEN_RULES.map((rule, idx) => (
             <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-md">
                <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <Icons.Check className="w-5 h-5" />
                    {rule.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{rule.content}</p>
             </div>
           ))}
           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
               <h3 className="font-bold mb-2">💡 Tip de Economía</h3>
               <p className="text-sm">Cocina en grandes cantidades (Batch Cooking) los Lunes y Miércoles. Congela porciones de legumbres y guisos para las semanas siguientes.</p>
           </div>
        </div>
      )}

    </div>
  );
};

const MealRow = ({ label, meal }: { label: string, meal: { title: string, description: string } }) => (
    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">{label}</span>
        <p className="font-bold text-slate-800 dark:text-white text-sm">{meal.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{meal.description}</p>
    </div>
);