import { Routine, ExerciseType, DailyDiet, Recipe, NutritionRule, WeeklyRoutineMap, ShoppingCategory, KegelLevel } from './types';

// Helper to generate placeholder image URL (Simulating the schematic images)
const getImageUrl = (text: string) => `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(text)}`;

// --- KEGEL CONSTANTS ---

export const KEGEL_LEVELS: KegelLevel[] = [
  {
    id: 'k_intro',
    title: 'Nivel 1: Localización',
    type: 'localization',
    description: 'Aprende a aislar el músculo PC. Contracciones cortas y controladas.',
    durationMinutes: 2, // 12 reps * 8s = 96s + warmup ~= 2 min
    contractTime: 3,
    relaxTime: 5, 
    reps: 12,
    color: 'text-blue-400'
  },
  {
    id: 'k_endurance',
    title: 'Nivel 2: Resistencia',
    type: 'endurance',
    description: 'Contracciones sostenidas para ganar fuerza y rigidez.',
    durationMinutes: 4, // 24 reps * 10s = 240s = 4 min
    contractTime: 5,
    relaxTime: 5,
    reps: 24,
    color: 'text-emerald-400'
  },
  {
    id: 'k_power',
    title: 'Nivel 3: Potencia',
    type: 'power',
    description: 'Flickers rápidos. 1 segundo activo, 1 de descanso.',
    durationMinutes: 2, // 60 reps * 2s = 120s = 2 min
    contractTime: 1, 
    relaxTime: 1,
    reps: 60,
    color: 'text-amber-400'
  },
  {
    id: 'k_relax',
    title: 'Descarga Pélvica',
    type: 'relaxation',
    description: 'Relajación profunda (Reverse Kegels) para liberar tensión.',
    durationMinutes: 4, // 20 reps * 12s = 240s = 4 min
    contractTime: 4, // Time to "Push out" or Inhale deeply
    relaxTime: 8, // Time to fully let go
    reps: 20,
    color: 'text-purple-400'
  }
];

// --- RUTINAS ---

export const ROUTINE_A: Routine = {
  id: 'routine-a',
  name: 'Rutina A: Circuito Metabólico',
  description: 'Elevar la frecuencia cardíaca y fatigar el pectoral y el abdomen sin saltar.',
  type: ExerciseType.METABOLIC,
  structure: {
    work: '45 seg',
    rest: '15 seg',
    rounds: '4 vueltas',
  },
  // Configuración Lógica
  durationSeconds: 45,
  restSeconds: 15,
  roundRestSeconds: 90, // 1:30 min descanso entre vueltas completas
  totalRounds: 4,
  warmup: [
    {
      id: 'w_a1',
      name: 'Rotación de Hombros',
      position: 'De pie, pies al ancho de hombros.',
      execution: 'Realiza círculos amplios con los brazos hacia adelante y luego hacia atrás. 30 segundos por sentido.',
      focus: 'Movilidad articular de hombros.',
      imageUrl: getImageUrl('Rotación Hombros')
    },
    {
      id: 'w_a2',
      name: 'Jumping Jacks (Sin impacto)',
      position: 'De pie.',
      execution: 'Abre una pierna al lado y sube brazos, vuelve al centro y cambia de lado. Ritmo constante por 1 minuto.',
      focus: 'Elevación de temperatura corporal.',
      imageUrl: getImageUrl('Jumping Jacks')
    },
    {
      id: 'w_a3',
      name: 'Gusano (Walkouts)',
      position: 'De pie.',
      execution: 'Baja las manos al suelo, camina con ellas hasta posición de plancha y vuelve atrás. Repite por 1 minuto.',
      focus: 'Activación de core y cadena posterior.',
      imageUrl: getImageUrl('Gusano Walkouts')
    }
  ],
  exercises: [
    {
      id: 'a1',
      name: 'Press de Suelo + Elevación Piernas',
      position: 'Boca arriba, piernas a 15cm del suelo.',
      execution: 'Empuja mancuernas. Baja hasta tocar suelo con tríceps.',
      focus: 'Pectoral mayor y abdomen bajo.',
      imageUrl: getImageUrl('Press Suelo + Piernas')
    },
    {
      id: 'a2',
      name: 'Burpee "Step-Back" + Press',
      position: 'De pie con mancuernas.',
      execution: 'Sentadilla, paso atrás (plancha), vuelve, pie y Press Militar.',
      focus: 'Full Body cardio sin impacto.',
      imageUrl: getImageUrl('Burpee Step-Back')
    },
    {
      id: 'a3',
      name: 'Remo Renegado',
      position: 'Plancha alta sobre mancuernas.',
      execution: 'Jala mancuerna a cintura alternando brazos.',
      focus: 'Espalda y core anti-rotación.',
      imageUrl: getImageUrl('Remo Renegado')
    },
    {
      id: 'a4',
      name: 'Aperturas (Flyes) en Suelo',
      position: 'Boca arriba, rodillas flectadas.',
      execution: 'Abre brazos semi-flexionados y cierra al centro.',
      focus: 'Aislamiento pectoral.',
      imageUrl: getImageUrl('Aperturas Suelo')
    },
    {
      id: 'a5',
      name: 'Escaladores Lentos',
      position: 'Plancha sobre mancuernas.',
      execution: 'Rodilla al pecho lentamente apretando abdomen.',
      focus: 'Recto abdominal.',
      imageUrl: getImageUrl('Escaladores Lentos')
    }
  ]
};

export const ROUTINE_B: Routine = {
  id: 'routine-b',
  name: 'Rutina B: Fuerza de Brazos',
  description: 'Hipertrofia controlada para bíceps y tríceps.',
  type: ExerciseType.HYPERTROPHY,
  structure: {
    series: '3 series',
    reps: '12 repeticiones',
    rest: 'Descanso libre (45-60s)',
  },
  // Configuración Lógica
  setsPerExercise: 3,
  warmup: [
    {
      id: 'w_b1',
      name: 'Movilidad de Muñecas',
      position: 'Manos entrelazadas.',
      execution: 'Realiza rotaciones suaves en ambos sentidos por 1 minuto. Vital para ejercicios con mancuernas.',
      focus: 'Preparación articular.',
      imageUrl: getImageUrl('Movilidad Muñecas')
    },
    {
      id: 'w_b2',
      name: 'Cruces de Brazos',
      position: 'De pie.',
      execution: 'Abre los brazos al máximo y crúzalos frente al pecho alternando el brazo superior. 1 minuto dinámico.',
      focus: 'Estiramiento dinámico pectoral/espalda.',
      imageUrl: getImageUrl('Cruces Brazos')
    },
    {
      id: 'w_b3',
      name: 'Flexiones en Pared',
      position: 'Frente a una pared, manos apoyadas.',
      execution: 'Realiza 20 flexiones controladas para activar tríceps y pecho sin fatiga excesiva.',
      focus: 'Activación muscular específica.',
      imageUrl: getImageUrl('Flexiones Pared')
    }
  ],
  exercises: [
    {
      id: 'b1',
      name: 'Curl de Bíceps con Giro',
      position: 'De pie, mancuernas a costados.',
      execution: 'Sube girando muñeca (supinación). Baja lento.',
      focus: 'Bíceps braquial.',
      imageUrl: getImageUrl('Curl Bíceps Giro')
    },
    {
      id: 'b2',
      name: 'Press Francés en Suelo',
      position: 'Boca arriba, brazos verticales.',
      execution: 'Flexiona codos llevando pesas a las orejas.',
      focus: 'Tríceps (cabeza larga).',
      imageUrl: getImageUrl('Press Francés Suelo')
    },
    {
      id: 'b3',
      name: 'Curl Martillo',
      position: 'De pie, agarre neutro.',
      execution: 'Sube y baja sin girar la muñeca.',
      focus: 'Braquial anterior (grosor).',
      imageUrl: getImageUrl('Curl Martillo')
    },
    {
      id: 'b4',
      name: 'Patada de Tríceps',
      position: 'Inclinado al frente, codos pegados.',
      execution: 'Extiende el brazo hacia atrás por completo.',
      focus: 'Tríceps (definición).',
      imageUrl: getImageUrl('Patada Tríceps')
    }
  ]
};

export const WEEKLY_ROUTINE_MAP: WeeklyRoutineMap[] = [
  { day: 'Lunes', routineId: 'routine-a' },
  { day: 'Martes', routineId: 'routine-b' },
  { day: 'Miércoles', routineId: 'routine-a' },
  { day: 'Jueves', routineId: 'routine-b' },
  { day: 'Viernes', routineId: 'routine-a' },
  { day: 'Sábado', routineId: null },
  { day: 'Domingo', routineId: null },
];

// --- NUTRICIÓN ---

export const DIET_W1_3: DailyDiet[] = [
  {
    day: 'Lunes',
    approxCalories: 1850,
    breakfast: { title: 'Avena Proteica', description: '1 taza avena cocida (agua/leche desc) + canela + ½ manzana.' },
    lunch: { title: 'Lentejas Guisadas', description: 'Con verduras (zapallo/zanahoria) + porción arroz integral + ensalada verde.' },
    snack: { title: 'Yogurt + Maní', description: '1 yogurt descremado + 30g maní sin sal.' },
    dinner: { title: 'Tortilla de Acelga', description: '2 huevos con acelga picada + tomate.' }
  },
  {
    day: 'Martes',
    approxCalories: 1780,
    breakfast: { title: 'Tostadas con Huevo', description: '1 marraqueta (sin miga) o 2 integral + 1 huevo revuelto (min aceite).' },
    lunch: { title: 'Croquetas de Jurel', description: 'Jurel + huevo + avena al horno. Papas cocidas y repollo.' },
    snack: { title: 'Fruta', description: '1 fruta estación (naranja/pera).' },
    dinner: { title: 'Ensalada Jurel', description: 'Hojas verdes, ½ lata jurel, pepino y ¼ palta.' }
  },
  {
    day: 'Miércoles',
    approxCalories: 1820,
    breakfast: { title: 'Yogurt con Avena', description: '1 yogurt + 3 cdas avena + fruta picada.' },
    lunch: { title: 'Garbanzos Salteados', description: 'Con acelga/espinaca y cebolla + ensalada chilena.' },
    snack: { title: 'Huevo Duro', description: '1 huevo duro + té/infusión.' },
    dinner: { title: 'Crema de Zapallo', description: 'Zapallo camote procesado + pollo desmenuzado encima.' }
  },
  {
    day: 'Jueves',
    approxCalories: 1900,
    breakfast: { title: 'Pan con Quesillo', description: '2 rebanadas integral + quesillo + tomate.' },
    lunch: { title: 'Pollo al Horno', description: 'Trutro sin piel + bastones zanahoria/zapallo italiano + ½ taza quinoa/arroz.' },
    snack: { title: 'Bastones Verdura', description: 'Zanahoria/apio con limón.' },
    dinner: { title: 'Omelette', description: '2 huevos + champiñones o verduras sobrantes.' }
  },
  {
    day: 'Viernes',
    approxCalories: 1750,
    breakfast: { title: 'Batido Verde', description: '1 fruta + ½ taza avena + agua + espinacas.' },
    lunch: { title: 'Charquicán con Huevo', description: 'Guiso zapallo/papas/verduras molidas + huevo (duro o frito en agua).' },
    snack: { title: 'Frutos Secos', description: 'Puñado nueces o almendras.' },
    dinner: { title: 'Salpicón', description: 'Pollo/carne fría picada + lechuga + tomate + choclo + cebolla.' }
  },
   {
    day: 'Sábado/Domingo',
    approxCalories: 2100,
    breakfast: { title: 'Libre (Controlado)', description: 'Mantiene porciones, permite 1 gusto moderado.' },
    lunch: { title: 'Libre (Casero)', description: 'Prioriza proteína y ensaladas antes del plato de fondo.' },
    snack: { title: 'Fruta/Yogurt', description: 'Mantener hidratación alta.' },
    dinner: { title: 'Ligero', description: 'Evitar carbohidratos pesados de noche.' }
  }
];

export const DIET_W2_4: DailyDiet[] = [
  {
    day: 'Lunes',
    approxCalories: 1800,
    breakfast: { title: 'Porridge', description: 'Avena cocida caliente con leche desc. y canela.' },
    lunch: { title: 'Porotos con Riendas', description: 'Versión liviana (zapallo/pimentón, sin longaniza) + ensalada verde.' },
    snack: { title: 'Yogurt + Semillas', description: '1 yogurt + linaza/chía.' },
    dinner: { title: 'Budín Zapallo Italiano', description: 'Rallado con huevo al horno + tomate.' }
  },
  {
    day: 'Martes',
    approxCalories: 1850,
    breakfast: { title: 'Pan con Palta', description: '2 rebanadas integral + 2 cdas palta.' },
    lunch: { title: 'Estofado de Jurel', description: 'Guiso de jurel, cebolla, zanahoria y papas + salsa tomate.' },
    snack: { title: 'Cítricos', description: '1 pomelo o naranja.' },
    dinner: { title: 'Pollo Plancha', description: 'Pechuga limón/orégano + brócoli/coliflor.' }
  },
  {
    day: 'Miércoles',
    approxCalories: 1790,
    breakfast: { title: 'Copa Yogurt', description: 'Yogurt natural + ½ plátano + 3 nueces.' },
    lunch: { title: 'Tomaticán', description: 'Guiso carne molida magra (o soya), tomate, choclo + papas/arroz.' },
    snack: { title: 'Huevo Duro', description: '1 unidad.' },
    dinner: { title: 'Ceviche Jurel/Atún', description: 'Lavado, con cebolla cuadritos, cilantro y limón.' }
  },
  {
    day: 'Jueves',
    approxCalories: 1880,
    breakfast: { title: 'Tostadas con Huevo', description: 'Igual a semana 1.' },
    lunch: { title: 'Fideos con Salsa', description: 'Porción moderada (integral) + salsa tomate casera + carne magra.' },
    snack: { title: 'Leche', description: '1 vaso leche desc o bebida vegetal.' },
    dinner: { title: 'Sopa Verduras + Huevo', description: 'Caldo de verduras con 1 huevo escalfado dentro.' }
  },
  {
    day: 'Viernes',
    approxCalories: 1760,
    breakfast: { title: 'Avena Manzana', description: 'Rallada mezclada con avena remojada noche anterior.' },
    lunch: { title: 'Carbonada', description: 'Sopa carne cubitos, papas, zapallo, porotos verdes.' },
    snack: { title: 'Fruta', description: 'Estación.' },
    dinner: { title: 'Pichanga Healthy', description: 'Cubos quesillo, jamón pavo, pepinillos, tomate cherry.' }
  },
  {
    day: 'Sábado/Domingo',
    approxCalories: 2100,
    breakfast: { title: 'Libre (Controlado)', description: 'Mantiene porciones, permite 1 gusto moderado.' },
    lunch: { title: 'Libre (Casero)', description: 'Prioriza proteína y ensaladas antes del plato de fondo.' },
    snack: { title: 'Fruta/Yogurt', description: 'Mantener hidratación alta.' },
    dinner: { title: 'Ligero', description: 'Evitar carbohidratos pesados de noche.' }
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Estofado de Jurel (Almuerzo)',
    ingredients: ['1 tarro jurel', '1 cebolla', '1 zanahoria', '2 papas', 'Salsa tomate', 'Orégano'],
    preparation: 'Sofreír cebolla y zanahoria. Agregar papas en bastones gruesos, agua y salsa. Al final, agregar jurel (usar jugo para sabor) y cocinar 5 min.'
  },
  {
    id: 'r2',
    name: 'Charquicán Light (Almuerzo)',
    ingredients: ['Carne molida baja grasa (o soya)', 'Zapallo', 'Papas', 'Choclo', 'Acelga', 'Cebolla'],
    preparation: 'Sofreír carne y cebolla. Agregar cubos de zapallo/papas y agua hirviendo. Cocinar 15 min. Agregar verdes. Machacar rústicamente.'
  },
  {
    id: 'r3',
    name: 'Tortilla de Acelga (Cena)',
    ingredients: ['1/2 paquete acelga cocida', '2 huevos', '1/2 cebolla picada fina', 'Sal y pimienta'],
    preparation: 'Picar la acelga cocida (exprimida). Mezclar con cebolla salteada y huevos batidos. Cuajar en sartén antiadherente tapada a fuego medio-bajo.'
  },
  {
    id: 'r4',
    name: 'Pancakes de Avena y Plátano (Desayuno)',
    ingredients: ['1/2 taza avena', '1 plátano maduro', '1 huevo', 'Chorrito de leche/agua'],
    preparation: 'Licuar o procesar todos los ingredientes hasta tener una mezcla espesa. Cocinar en sartén antiadherente con una gota de aceite "vuelta y vuelta".'
  },
  {
    id: 'r5',
    name: 'Hamburguesas de Lentejas (Almuerzo/Cena)',
    ingredients: ['Lentejas cocidas (sobras)', 'Zanahoria rallada', 'Cebolla picada', 'Avena (para unir)', '1 huevo'],
    preparation: 'Moler las lentejas con tenedor (o procesadora). Mezclar con verduras sofritas, huevo y avena hasta que sea moldeable. Formar hamburguesas y dorar en sartén.'
  },
  {
    id: 'r6',
    name: 'Boloñesa de Jurel (Almuerzo)',
    ingredients: ['1 tarro jurel', 'Salsa de tomate', 'Cebolla', 'Zanahoria rallada', 'Fideos integrales'],
    preparation: 'Hacer un sofrito con cebolla y zanahoria. Agregar el jurel desmenuzado y la salsa de tomate. Cocinar 5 min. Servir sobre fideos.'
  },
  {
    id: 'r7',
    name: 'Budín de Zapallo Italiano (Cena)',
    ingredients: ['2 zapallos italianos rallados', '2 huevos', 'Quesillo trozado', 'Cebolla en cuadros'],
    preparation: 'Rallar zapallo y estrujar líquido. Sofreír cebolla. Mezclar todo, agregar huevos batidos y hornear 25 min hasta que cuaje.'
  },
  {
    id: 'r8',
    name: 'Bastones con Dip de Yogurt (Snack)',
    ingredients: ['1 yogurt natural', 'Ciboulette/Cilantro', 'Sal/Limón', 'Zanahoria/Apio crudo'],
    preparation: 'Mezclar el yogurt con las hierbas, limón y sal. Cortar las verduras en bastones largos. Ideal para ansiedad o picoteo.'
  },
  {
    id: 'r9',
    name: 'Batido Verde Detox (Desayuno)',
    ingredients: ['1 manzana verde o pera', '1 taza espinaca cruda', '1/2 pepino', 'Jugo de 1/2 limón', 'Agua fría'],
    preparation: 'Lavar bien todos los ingredientes. Licuar con agua hasta obtener consistencia deseada. Tomar inmediatamente para aprovechar vitaminas.'
  },
  {
    id: 'r10',
    name: 'Porridge de Avena (Desayuno)',
    ingredients: ['1/2 taza avena', '1 taza leche o agua', 'Canela en rama/polvo', 'Endulzante al gusto', '1/2 Manzana rallada'],
    preparation: 'Cocinar avena en líquido con canela a fuego medio hasta espesar. Apagar y mezclar con manzana rallada para dar volumen y dulzor natural.'
  },
  {
    id: 'r11',
    name: 'Tomaticán Clásico (Almuerzo)',
    ingredients: ['250g carne molida o posta', '2 tomates maduros', '1 choclo desgranado', '1 cebolla pluma', 'Orégano'],
    preparation: 'Sofreír carne y cebolla. Agregar tomate en gajos (con jugo) y choclo. Tapar y cocinar 15 min a fuego medio en su propio jugo.'
  },
  {
    id: 'r12',
    name: 'Crema de Zapallo (Cena)',
    ingredients: ['300g zapallo camote', '1/2 cebolla', 'Caldo de verduras o agua', '1 cda leche (opcional)'],
    preparation: 'Cocer zapallo y cebolla en agua hasta que estén blandos. Procesar/licuar con un poco del caldo de cocción hasta tener crema. Rectificar sal.'
  }
];

export const GOLDEN_RULES: NutritionRule[] = [
  { title: 'Porciones (La Mano)', content: 'Usa tu mano para medir: Proteína = Palma. Carbohidratos (Arroz/Fideo) = Puño cerrado frontal. Verduras = 2 manos abiertas juntas. Grasas = Dedo pulgar.' },
  { title: 'Hidratación Estratégica', content: 'Bebe un vaso grande de agua 15 minutos antes de cada comida. Esto mejora la digestión y aumenta la saciedad, ayudando a controlar porciones.' },
  { title: 'Compras Inteligentes', content: 'Prefiere Feria libre para frutas/verduras. Compra Jurel en conserva en vez de Atún (tiene más Omega-3 y es más barato). Compra legumbres secas a granel, rinden el triple.' },
  { title: 'Horarios de Comidas', content: 'Intenta comer cada 3-4 horas para mantener el metabolismo activo y evitar atracones. Desayuno 08:00 | Almuerzo 13:30 | Once 17:30 | Cena 20:30 (Ligera).' },
  { title: 'Batch Cooking (Cocinar por lotes)', content: 'Dedica el Domingo o Lunes a cocinar legumbres y carbohidratos para 3 días. Refrigerar en potes de vidrio ahorra tiempo y evita pedir comida rápida.' },
  { title: 'Regla del 80/20', content: 'El 80% de tu alimentación debe ser nutritiva y planificada. El 20% puede ser flexible (una comida libre el fin de semana). Esto asegura adherencia a largo plazo.' }
];

export const SHOPPING_LIST: ShoppingCategory[] = [
  {
    category: 'Feria / Verdulería (Semanal)',
    items: [
      'Papas (Kilo)',
      'Zanahorias',
      'Cebollas',
      'Zapallo Camote (Trozo)',
      'Zapallo Italiano (3 un)',
      'Acelga / Espinaca (Paquete)',
      'Tomates',
      'Lechuga / Repollo',
      'Porotos Verdes',
      'Palta (Opcional)',
      'Manzanas',
      'Naranjas / Peras',
      'Plátanos',
      'Cilantro / Ciboulette',
      'Limones'
    ]
  },
  {
    category: 'Carnicería / Proteínas (Mensual/Quincenal)',
    items: [
      'Huevos (Bandeja 30 un)',
      'Jurel en conserva (4-6 latas)',
      'Pechuga o Trutro de Pollo',
      'Carne Molida (Baja grasa / Tártaro)',
      'Quesillo / Queso Fresco',
      'Jamón de Pavo (Opcional)'
    ]
  },
  {
    category: 'Despensa / Abarrotes (Mensual)',
    items: [
      'Avena Instantánea o Tradicional (1 Kg)',
      'Arroz Integral',
      'Fideos Integrales',
      'Lentejas (Bolsa)',
      'Porotos (Bolsa)',
      'Garbanzos (Bolsa)',
      'Maní sin sal / Nueces',
      'Salsa de Tomate',
      'Aceite',
      'Sal / Orégano / Canela'
    ]
  },
  {
    category: 'Lácteos y Otros',
    items: [
      'Yogurt Natural o Diet (Pack familiar)',
      'Leche Descremada o Bebida Vegetal',
      'Té / Café / Infusiones'
    ]
  }
];