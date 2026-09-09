import React, { useState, useEffect, useRef, useCallback } from "react";


// ==========================================
// 🧠 TRADUCTOR DE DESVÍOS DIDÁCTICOS (Español Pedagógico)
// ==========================================
const translateDesvio = (code) => {
  if (code === "ERR_DIRECT") return "Suma Directa (Sin unificar base)";
  if (code === "ERR_PARTIAL") return "Suma Incompleta (Un solo sumando)";
  if (code === "ERR_LCD") return "Denominador Común Incorrecto";
  if (code === "ERR_COMPARE") return "Comparación de Magnitudes sin Base";
  return "Desvío General de Operación";
};

// ==========================================
// 🛠️ MOCK BASE DE DATOS SEMILLA (8 Alumnos)
// ==========================================
const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Martín G. (Tú)",
    
    uuid: "7a3b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    xp: 0,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "activa", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m2: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m4: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0, possibleFraud: false }
    },
    justificationQuality: null,
    xapi_history: [{ time: "10:14:02", verb: "CONECTÓ", object: "Inicio de sesión vía CiDi" }]
  },
  {
    id: 2,
    name: "Sofía V.",
    
    uuid: "8b4c3d2e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    xp: 250,
    badgeEarned: false,
    interestRegistered: true,
    helpsRequested: 1,
    errorsCount: 4,
    missions: {
      m1: { status: "completado", attempts: 2, lastErrorCode: "ERR_DIRECT", helps: 1, errors: 1 },
      m2: { status: "bloqueado", attempts: 3, lastErrorCode: "ERR_DIRECT", helps: 0, errors: 3 },
      m3: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m4: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 3,
    name: "Facundo S.",
    
    uuid: "9c5d4e3f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    xp: 450,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 2,
    errorsCount: 3,
    missions: {
      m1: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m2: { status: "completado", attempts: 2, lastErrorCode: "ERR_PARTIAL", helps: 1, errors: 1 },
      m3: { status: "completado", attempts: 3, lastErrorCode: "ERR_LCD", helps: 1, errors: 2 },
      m4: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 4,
    name: "Valentina R.",
    
    uuid: "1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
    xp: 500,
    badgeEarned: true,
    interestRegistered: true,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m2: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m4: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: "Master",
    xapi_history: []
  },
  {
    id: 5,
    name: "Tomás B.",
    
    uuid: "2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b",
    xp: 100,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 2,
    errorsCount: 2,
    missions: {
      m1: { status: "completado", attempts: 3, lastErrorCode: "ERR_PARTIAL", helps: 2, errors: 2 },
      m2: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m4: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 6,
    name: "Camila O.",
    
    uuid: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
    xp: 450,
    badgeEarned: false,
    interestRegistered: true,
    helpsRequested: 1,
    errorsCount: 3,
    missions: {
      m1: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m2: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "completado", attempts: 4, lastErrorCode: "ERR_LCD", helps: 1, errors: 3 },
      m4: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 7,
    name: "Bautista L.",
    
    uuid: "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
    xp: 500,
    badgeEarned: true,
    interestRegistered: true,
    helpsRequested: 2,
    errorsCount: 2,
    missions: {
      m1: { status: "completado", attempts: 2, lastErrorCode: "ERR_DIRECT", helps: 1, errors: 1 },
      m2: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "completado", attempts: 2, lastErrorCode: "ERR_COMPARE", helps: 1, errors: 1 },
      m4: { status: "completado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: "Intuitive",
    xapi_history: []
  },
  {
    id: 8,
    name: "Delfina P.",
    
    uuid: "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
    xp: 0,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m2: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m3: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
      m4: { status: "no_iniciado", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
    },
    justificationQuality: null,
    xapi_history: []
  }
];

// Helper para barajar aleatoriamente y reasignar letras en orden
function prepareOptions(optionsList) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const copy = [...optionsList];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.map((opt, idx) => ({ ...opt, id: letters[idx] || `${idx + 1}` }));
}

// ==========================================
// 🛠️ MOTOR MATEMÁTICO PROCEDIMENTAL
// ==========================================
const MathGenerator = {
  generateM1() {
    const denoms = [5, 6, 7, 8, 9, 10];
    const D = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const sumN = n1 + n2;

    const raw = [
      { value: `${sumN}/${D}`, correct: true, feedback: `¡Suministro registrado! Con igual base de tanque (${D}) sumamos las partes reunidas: ${n1} + ${n2} = ${sumN}.` },
      { value: `${sumN}/${D + D}`, correct: false, errorCode: "ERR_DIRECT", feedback: `Alerta: Sumaste denominadores (${D}+${D}=${D + D}). Las divisiones del tanque no se duplican al juntar agua.` },
      { value: `${n1}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste el primer balde de agua. No olvides sumar el segundo.` },
      { value: `${n2}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste el segundo balde de agua. Falta el primero.` },
      { value: `${n1 * n2}/${D}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Multiplicaste las partes de agua en vez de sumarlas.` },
      { value: `${sumN}/${D * 2 + 2}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Calibración errónea. El agua no coincide con el tamaño del tanque.` }
    ];

    return { equation: `${n1}/${D} + ${n2}/${D} = ?`, n1, n2, D, options: prepareOptions(raw) };
  },

  generateM2() {
    // Escenarios de múltiplo puro que no requieren simplificación
    const scenarios = [
      { d1: 4, d2: 8, n1: 1, n2: 1, correct: "3/8", errDirect: "2/12", errLcd: "2/32", errPartial: "1/4", d1Val: "1/8", d2Val: "5/8", fb: "Denominador común 8: 1/4 equivale a 2/8. Sumando: 2/8 + 1/8 = 3/8." },
      { d1: 3, d2: 9, n1: 1, n2: 1, correct: "4/9", errDirect: "2/12", errLcd: "2/27", errPartial: "1/3", d1Val: "1/9", d2Val: "5/9", fb: "Denominador común 9: 1/3 equivale a 3/9. Sumando: 3/9 + 1/9 = 4/9." },
      { d1: 2, d2: 8, n1: 1, n2: 1, correct: "5/8", errDirect: "2/10", errLcd: "2/16", errPartial: "1/2", d1Val: "1/8", d2Val: "6/8", fb: "Denominador común 8: 1/2 equivale a 4/8. Sumando: 4/8 + 1/8 = 5/8." },
      { d1: 5, d2: 10, n1: 1, n2: 1, correct: "3/10", errDirect: "2/15", errLcd: "2/50", errPartial: "1/5", d1Val: "1/10", d2Val: "4/10", fb: "Denominador común 10: 1/5 equivale a 2/10. Sumando: 2/10 + 1/10 = 3/10." },
      { d1: 3, d2: 9, n1: 2, n2: 1, correct: "7/9", errDirect: "3/12", errLcd: "3/27", errPartial: "2/3", d1Val: "4/9", d2Val: "8/9", fb: "Denominador común 9: 2/3 equivale a 6/9. Sumando: 6/9 + 1/9 = 7/9." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const raw = [
      { value: choice.correct, correct: true, feedback: `¡Alimentos unificados con éxito! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `No sumes directamente los tamaños de las cajas (${choice.d1}+${choice.d2}). Primero unificá los tamaños de las porciones.` },
      { value: choice.errPartial, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la caja principal de alimentos. Falta el aporte de la caja auxiliar.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Multiplicaste los denominadores sin amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste las porciones de la caja auxiliar, olvidando la principal.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Almacenamiento erróneo. El alimento sobrepasa la capacidad física de las cajas.` }
    ];

    return { equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, n1: choice.n1, d1: choice.d1, n2: choice.n2, d2: choice.d2, correctVal: choice.correct, options: prepareOptions(raw) };
  },

  generateM3() {
    // Escenarios con simplificación real para enlazar
    const scenarios = [
      { d1: 3, d2: 6, n1: 1, n2: 1, displayCorrect: "1/2", errDirect: "2/9", errLcd: "2/18", d1Val: "1/3", d2Val: "4/6", d3Val: "2/3", fb: "1/3 + 1/6 = 3/6. Simplificado por 3 da la porción de 1/2." },
      { d1: 4, d2: 12, n1: 1, n2: 1, displayCorrect: "1/3", errDirect: "2/16", errLcd: "2/48", d1Val: "1/4", d2Val: "3/12", d3Val: "5/12", fb: "1/4 + 1/12 = 4/12. Simplificado por 4 da la porción de 1/3." },
      { d1: 6, d2: 10, n1: 1, n2: 1, displayCorrect: "4/15", errDirect: "2/16", errLcd: "2/60", d1Val: "1/6", d2Val: "1/10", d3Val: "7/30", fb: "MCM 30: 5/30 + 3/30 = 8/30, que simplificado es 4/15." },
      { d1: 2, d2: 10, n1: 1, n2: 1, displayCorrect: "3/5", errDirect: "2/12", errLcd: "2/20", d1Val: "1/2", d2Val: "4/10", d3Val: "7/10", fb: "1/2 + 1/10 = 5/10 + 1/10 = 6/10, que simplificado por 2 da 3/5." },
      { d1: 5, d2: 15, n1: 2, n2: 1, displayCorrect: "7/15", errDirect: "3/20", errLcd: "3/75", d1Val: "2/5", d2Val: "4/15", d3Val: "8/15", fb: "2/5 + 1/15 = 6/15 + 1/15 = 7/15 (fracción irreducible)." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const raw = [
      { value: choice.displayCorrect, correct: true, feedback: `¡Conexión eléctrica exitosa! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `Sumar directo no sirve cuando las bases de conexión difieren.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Buscaste base común pero olvidaste amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste el aporte del primer tramo del cableado eléctrico.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Señal distorsionada. Revisá la simplificación a su fracción irreducible en papel.` },
      { value: choice.d3Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Desvío al buscar el mínimo común múltiplo en las tablas de multiplicar.` }
    ];

    return { equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, n1: choice.n1, d1: choice.d1, n2: choice.n2, d2: choice.d2, correctVal: choice.displayCorrect, options: prepareOptions(raw) };
  },

  generateM4() {
    const variants = [
      {
        steps: [
          {
            title: "Paso 1: Suministro Colectivo de Agua (M1)",
            prompt: "Tres grupos vuelcan sus raciones de agua en el tanque común: 1/6 + 2/6 + 1/6. ¿Qué porción del tanque de agua lograron llenar en total?",
            rawOptions: [
              { value: "4/6", correct: true, feedback: "¡Exacto! Al tener el mismo tamaño de porciones se suman los de arriba: 1 + 2 + 1 = 4 sobre 6." },
              { value: "4/18", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste los denominadores (6+6+6). Los tanques no se duplican, el tamaño de la porción se mantiene igual." },
              { value: "3/6", correct: false, errorCode: "ERR_PARTIAL", feedback: "Omitiste sumar el agua aportada por el tercer grupo." },
              { value: "4/12", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste los denominadores de solo dos aportes." },
              { value: "1/6", correct: false, errorCode: "ERR_PARTIAL", feedback: "Este es solo el aporte de agua del primer grupo." },
              { value: "4/24", correct: false, errorCode: "ERR_LCD", feedback: "Multiplicaste los tanques en lugar de mantener la base común." }
            ]
          },
          {
            title: "Paso 2: Contenedor Completo de Alimento (M2)",
            prompt: "El refugio exige completar una caja de raciones al 100% (1 entero = 4/4). Tres depósitos entregan: 1/4 + 1/4 + 1/2. ¿Alcanza el alimento para completar la caja entera?",
            rawOptions: [
              { value: "Sí alcanza: suman 4/4 (1 entero) y entregan el 100% de la caja.", correct: true, feedback: "¡Exacto! 1/4 + 1/4 = 2/4. Al sumar 1/2 (que equivale a 2/4), completamos la caja entera: 4/4 = 1 entero." },
              { value: "No alcanza: apenas juntamos 3/10 de caja.", correct: false, errorCode: "ERR_DIRECT", feedback: "Suma directa errónea. Sumaste numeradores y denominadores linealmente (1+1+1 sobre 4+4+2)." },
              { value: "No alcanza: sumamos 3/4 y todavía falta 1/4.", correct: false, errorCode: "ERR_LCD", feedback: "Error de base. Sumaste numeradores sin amplificar previamente el 1/2 a cuartos (2/4)." },
              { value: "Sí alcanza: sumamos 2/4 de los dos primeros y el 1/2 no se suma.", correct: false, errorCode: "ERR_PARTIAL", feedback: "Medición incompleta. Ignoraste el aporte del tercer depósito de raciones." },
              { value: "Sobra potencia: sobrecargamos con 5/4.", correct: false, errorCode: "ERR_GENERIC", feedback: "Multiplicación errónea. Multiplicaste arriba y abajo en exceso al intentar amplificar." },
              { value: "No alcanza: los depósitos apenas entregan 3/8.", correct: false, errorCode: "ERR_LCD", feedback: "Error de cálculo. No se encontró el denominador común correcto." }
            ]
          },
          {
            title: "Paso 3: Estimación de Consumo Semanal (M3)",
            prompt: "El refugio consumió 3/4 de sus raciones de agua guardadas en un plazo de 3 semanas. Al mismo ritmo, ¿cuántas semanas faltan para consumir la totalidad del tanque (4/4)?",
            rawOptions: [
              { value: "1 semana restante", correct: true, feedback: "¡Exacto! Si 3 partes de 4 tomaron 3 semanas, cada cuarto (1/4) dura 1 semana. Falta 1/4 = 1 semana restante." },
              { value: "4 semanas de consumo restantes", correct: false, errorCode: "ERR_GENERIC", feedback: "4 semanas es la duración total del suministro completo, no el tiempo que falta." },
              { value: "3/4 de semana (5 días)", correct: false, errorCode: "ERR_COMPARE", feedback: "Confundiste la fracción con la escala de días." },
              { value: "2 semanas restantes", correct: false, errorCode: "ERR_GENERIC", feedback: "Estimación errónea sin aplicar la proporción directa del tiempo transcurrido." },
              { value: "1/4 de semana", correct: false, errorCode: "ERR_COMPARE", feedback: "1/4 de suministro de agua a este ritmo equivale a 1 semana entera." },
              { value: "6 semanas restantes", correct: false, errorCode: "ERR_GENERIC", feedback: "Duplicaste las semanas en lugar de calcular el cuarto restante." }
            ]
          },
          {
            title: "Paso 4: Justificación del Encargado del Refugio",
            prompt: "¿Cuál fue el razonamiento matemático que usaste en el paso anterior para saber que faltaba exactamente 1 semana?",
            rawOptions: [
              { value: "Si 3 cuartos duraron 3 semanas, cada cuarto (1/4) dura 1 semana. Como falta solo 1 cuarto para consumir la unidad entera (4/4), falta 1 semana.", correct: true, justificationType: "Master", feedback: "¡Dominio conceptual absoluto de la fracción como magnitud y proporción continua!" },
              { value: "Hice un cálculo aproximado mental sabiendo que 3 semanas era casi todo el suministro y 1 semana sonaba razonable.", correct: true, justificationType: "Intuitive", feedback: "¡Aceptado por intuición! Buen cálculo de proporción mental." },
              { value: "Resté 4 menos 3 directamente porque son los números que aparecían escritos en la fracción 3/4.", correct: false, justificationType: "Failed", errorCode: "ERR_DIRECT", feedback: "Restar los números de forma aislada (4 - 3) no justifica matemáticamente una proporción." },
              { value: "Supuse que 3/4 de cualquier tanque siempre equivale a 3 semanas fijas de reloj.", correct: false, justificationType: "Failed", errorCode: "ERR_COMPARE", feedback: "El consumo de agua depende del número de personas y la velocidad de consumo, no es una constante fija." }
            ]
          }
        ]
      }
    ];
    const chosenVariant = variants[Math.floor(Math.random() * variants.length)];
    return chosenVariant.steps.map((st) => ({
      ...st,
      options: prepareOptions(st.rawOptions)
    }));
  }
};

const SYSTEM_EXPERT_ALERTS = {
  ERR_DIRECT: "🛠️ Propuesta aula: dinámica de doblado de tiras de papel para visualizar por qué el denominador nunca se suma.",
  ERR_PARTIAL: "🍳 Actividad hogar: usen elementos divisibles en la mesa para representar la agregación de partes.",
  ERR_LCD: "🧩 Actividad hogar: repasen juntos las tablas de multiplicar de los denominadores antes de operar.",
  ERR_COMPARE: "🥤 Actividad hogar: sirvan agua en vasos de diferente diámetro para ilustrar la necesidad de una base común."
};

// ==========================================
// 📚 FICHA PEDAGÓGICA POPUP (Para el docente)
// ==========================================
const MISSION_PEDAGOGICAL_INFO = {
  m1: {
    title: "Misión 1: Suministro de Agua de Emergencia",
    curriculum: "Suma de fracciones de igual denominador (Racionales homogéneos).",
    objective: "Evaluar si el alumno asimila que cuando las partes pertenecen a la misma base o tamaño de tanque, solo se agregan los numeradores, manteniendo el denominador común intacto.",
    actions: "El alumno opera una consola de calibración táctil. Debe presionar los pulsadores [＋] y [－] para registrar las partes de agua en el Numerador en 3 y las divisiones del tanque en el Denominador en 5, manteniendo el denominador común intacto, y luego presionar '📊 REGISTRAR AGUA Y VERIFICAR' para confirmar."
  },
  m2: {
    title: "Misión 2: Raciones de Alimento Seco",
    curriculum: "Suma de fracciones con denominador múltiplo directo (sin simplificación).",
    objective: "Analizar el paso intermedio de unificar denominadores mediante amplificación de una de las fracciones en un denominador común directo, sin requerir simplificación del resultado.",
    actions: "El alumno opera una consola de calibración de alimentos. Debe presionar los pulsadores [＋] y [－] para amplificar la primera fracción de raciones y sumar el aporte de la segunda de forma unificada. Debe colocar las raciones totales en el Numerador y la base unificada en el Denominador al resultado exacto, y luego presionar '📊 REGISTRAR ALIMENTO Y VERIFICAR'."
  },
  m3: {
    title: "Misión 3: Conexión de Red Eléctrica",
    curriculum: "Suma de fracciones con denominadores heterogéneos y simplificación obligatoria.",
    objective: "Evaluar la capacidad de encontrar el mínimo común múltiplo (mcm), amplificar numeradores correspondientes y realizar la posterior reducción del resultado a la fracción irreducible.",
    actions: "El alumno opera un tablero con opciones predefinidas de red eléctrica. Debe calcular la suma de los consumos heterogéneos encontrando el mínimo común múltiplo (MCD) y reduciendo el resultado final a su fracción irreducible más pura antes de presionar '📊 REGISTRAR CONEXIÓN Y VERIFICAR'."
  },
  m4: {
    title: "Misión 4: Gestión de Colonos (El Día 1)",
    curriculum: "Integración de saberes, suma triple de fracciones, comparación de proporciones y justificación.",
    objective: "Monitorear la articulación de todas las destrezas adquiridas para resolver un problema de administración de recursos del refugio en 4 pasos, requiriendo argumentar por escrito su deducción lógica.",
    actions: "El alumno opera 4 palancas táctiles compactas para calibrar el despegue de recursos de supervivencia en 4 pasos progresivos: (1) Sintonizar una ración de agua de tres partes con igual denominador, (2) Sumar tres consumos heterogéneos para completar el contenedor entero (100%), (3) Calcular y comparar proporciones de tiempo de raciones restantes, y (4) Elegir la justificación matemática precisa que valide su razonamiento lógico."
  }
};

// ==========================================
// 🔊 MÓDULO DE AUDIO SINTETIZADO (Web Audio API)
// ==========================================

// Helper to get mission rules name dynamically
const getMissionRulesName = (missionKey) => {
  if (missionKey === "m1") return "Reglas de Suministro de Agua";
  if (missionKey === "m2") return "Reglas de Almacenamiento de Alimentos";
  if (missionKey === "m3") return "Reglas de Conexión de Red";
  return "Reglas de Gestión del Refugio";
};

function useGameFeedback() {
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playCorrect = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, t); // C5
      gain1.gain.setValueAtTime(0.04, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc1.start(t); osc1.stop(t + 0.1);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, t + 0.08); // E5
      gain2.gain.setValueAtTime(0.04, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.start(t + 0.08); osc2.stop(t + 0.18);

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (e) { console.warn(e); }
  };

  const playError = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, t); // Tono de atención neutro
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.18);
    } catch (e) { console.warn(e); }
  };

  const playRobotChat = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.08);
    } catch (e) { console.warn(e); }
  };

  const playMissionDone = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + i * 0.1);
        gain.gain.setValueAtTime(0.04, t + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.25);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.25);
      });
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 80, 100]);
      }
    } catch (e) { console.warn(e); }
  };

  const playBadge = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t + i * 0.07);
        gain.gain.setValueAtTime(0.03, t + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.2);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.07); osc.stop(t + i * 0.07 + 0.2);
      });
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([150, 100, 150, 100, 400]);
      }
    } catch (e) { console.warn(e); }
  };

  return { playCorrect, playError, playRobotChat, playMissionDone, playBadge };
}

// ==========================================
// 🌌 SALTO A HIPERESPACIO
// ==========================================
function HyperspaceJump() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${5 + Math.random() * 90}%`,
      width: `${100 + Math.random() * 200}px`,
      height: `${1.5 + Math.random() * 2}px`,
      duration: `${0.35 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 0.2}s`
    }));
    setStars(generated);
  }, []);

  return (
    <div style={hyperspaceStyles.overlay}>
      <style>{`
        @keyframes streak {
          0% { transform: translateX(-150vw); }
          100% { transform: translateX(150vw); }
        }
        @keyframes glowFlash {
          0% { background-color: rgba(3, 8, 24, 0.4); }
          50% { background-color: rgba(56, 189, 248, 0.25); }
          100% { background-color: rgba(3, 8, 24, 0.8); }
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: star.top,
            left: "0px",
            width: star.width,
            height: star.height,
            background: "linear-gradient(90deg, transparent, #38bdf8, #ffffff, #c084fc, transparent)",
            boxShadow: "0 0 10px rgba(56, 189, 248, 0.9)",
            opacity: 0.9,
            animation: `streak ${star.duration} linear infinite`,
            animationDelay: star.delay
          }}
        />
      ))}
      <div style={hyperspaceStyles.hudText}>⚡ SALTO HIPERESPACIAL EN CURSO... ⚡</div>
    </div>
  );
}

const hyperspaceStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(2, 3, 8, 0.75)",
    zIndex: 9000,
    overflow: "hidden",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "glowFlash 1.2s ease-in-out infinite"
  },
  hudText: {
    fontSize: "18px",
    fontWeight: "900",
    color: "#38bdf8",
    letterSpacing: "2px",
    textShadow: "0 0 15px #38bdf8",
    backgroundColor: "rgba(2, 3, 8, 0.85)",
    padding: "10px 24px",
    borderRadius: "20px",
    border: "2px solid #38bdf8"
  }
};

// ==========================================
// 🤖 EDUBOT (COPILOTO ROBOT)
// ==========================================
function EduBotCopilot({ mood, message, errorWarning }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 400);
    }, 20000); // Parpadeo cada 20 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={astroStyles.container}>
      <div style={astroStyles.header}>
        <div style={astroStyles.robotBody}>
          <div style={astroStyles.antenna}>
            <div style={astroStyles.antennaLight(mood)} />
          </div>
          <div style={astroStyles.head(mood)}>
            <div style={astroStyles.screen}>
              {isBlinking ? (
                <span style={astroStyles.eyesIdle}>- _ -</span>
              ) : (
                <>
                  {mood === "happy" && <span style={astroStyles.eyesHappy}>^ ‿ ^</span>}
                  {mood === "shocked" && <span style={astroStyles.eyesShock}>O ⍜ O</span>}
                  {mood === "thinking" && <span style={astroStyles.eyesThink}>o _ O</span>}
                  {mood === "idle" && <span style={astroStyles.eyesIdle}>• _ •</span>}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={astroStyles.titleBlock}>
          <div style={astroStyles.copilotName}>🤖 EDUBOT (Copiloto)</div>
          <div style={astroStyles.copilotSub}>Asistencia de Cabina en Vivo</div>
        </div>
      </div>

      <div style={astroStyles.speechBubble}>
        <div style={astroStyles.copilotText}>{message}</div>
      </div>

      {errorWarning && (
        <div style={astroStyles.errorAlertBox}>
          <span style={{ fontSize: "26px" }}>📝⚠️</span>
          <div style={{ fontSize: "14px", color: "#fca5a5", lineHeight: "1.5", fontFamily: "monospace" }}>
            <strong style={{ color: "#ffffff" }}>¡RECOMENDACIÓN DE CABINA!</strong><br />
            {errorWarning}
          </div>
        </div>
      )}
    </div>
  );
}

const astroStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    border: "2px solid #8b5cf6",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
  },
  header: { display: "flex", alignItems: "center", gap: "14px" },
  robotBody: { display: "flex", flexDirection: "column", alignItems: "center" },
  antenna: { width: "4px", height: "12px", backgroundColor: "#64748b", position: "relative" },
  antennaLight: (mood) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8",
    position: "absolute",
    top: "-10px",
    left: "-4px",
    boxShadow: `0 0 10px ${mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8"}`
  }),
  head: (mood) => ({
    width: "70px",
    height: "56px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    border: `2px solid ${mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.7)"
  }),
  screen: {
    width: "100%",
    height: "100%",
    backgroundColor: "#03040b",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #334155"
  },
  eyesHappy: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#10b981", textShadow: "0 0 8px #10b981" },
  eyesShock: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#ef4444", textShadow: "0 0 8px #ef4444" },
  eyesThink: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#fb923c", textShadow: "0 0 8px #fb923c" },
  eyesIdle: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#38bdf8", textShadow: "0 0 8px #38bdf8" },
  titleBlock: { flex: 1 },
  copilotName: { fontSize: "14px", fontWeight: "900", color: "#c084fc", letterSpacing: "1px" },
  copilotSub: { fontSize: "11px", color: "#94a3b8", marginBottom: "6px" },
  hintBtn: {
    padding: "6px 12px",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    border: "1px solid #8b5cf6",
    color: "#c084fc",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  speechBubble: { backgroundColor: "#03040b", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px 14px" },
  copilotText: { 
    fontSize: "15px", 
    fontWeight: "500", 
    color: "#cbd5e1", 
    lineHeight: "1.7", 
    letterSpacing: "0.6px", // Letras separadas y legibles
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
  },
  errorAlertBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    animation: "pulseWarning 1.5s infinite"
  }
};

// ==========================================
// 🛰️ CONTROL M1: STEPPERS TÁCTILES CALIBRADOS (Tu Fracción Seleccionada)
// ==========================================
function M1StepperControl({ equation, options, handleOptionClick, selectedOption }) {
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(1);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [warningMsg, setWarningMsg] = useState(null);

  const stopInterval = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startInterval = useCallback((action) => {
    if (selectedOption !== null) return;
    stopInterval();
    action();
    
    // DELAY CALIBRADO PARA MICRO-UX: 550ms para evitar doble salto involuntario
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 150); // INTERVALO DE RAMPA: 150ms para excelente precisión táctil
    }, 550);
  }, [selectedOption, stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  // Bloqueo estricto de disparos dobles por eventos de touch en híbridos
  const bindHoldEvents = (action) => ({
    onMouseDown: (e) => {
      if (e.button !== 0) return; // Solo click izquierdo
      startInterval(action);
    },
    onMouseUp: stopInterval,
    onMouseLeave: stopInterval,
    onTouchStart: (e) => {
      if (e.cancelable) e.preventDefault();
      startInterval(action);
    },
    onTouchEnd: stopInterval
  });

  useEffect(() => {
    if (selectedOption === null) {
      setNum(1);
      setDen(1);
      setWarningMsg(null);
    }
  }, [equation, selectedOption]);

  const parseEquation = (eq) => {
    if (!eq) return { n1: 1, n2: 2, D: 6 };
    const match = eq.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)/);
    if (match) {
      return { n1: parseInt(match[1], 10), D: parseInt(match[2], 10), n2: parseInt(match[3], 10) };
    }
    return { n1: 1, n2: 2, D: 6 };
  };

  const { n1, n2, D } = parseEquation(equation);

  const handleConfirm = () => {
    if (selectedOption !== null) return;
    
    // Advertencia no punitiva si intentan enviar estando 1/1
    if (num === 1 && den === 1) {
      setWarningMsg("Debes colocar el número correspondiente apretando ＋ y － para sintonizar.");
      setTimeout(() => setWarningMsg(null), 5000);
      return;
    }

    const selectedFractionText = `${num}/${den}`;
    const matchingOption = options.find((opt) => opt.value === selectedFractionText);

    if (matchingOption) {
      handleOptionClick(matchingOption);
    } else {
      let code = "ERR_GENERIC";
      let msg = `La señal (${num}/${den}) es inestable. Sintonizá la suma correcta sobre la base orbital.`;
      
      if (den === D + D) {
        code = "ERR_DIRECT";
        msg = `Alerta: Suma Directa (${num}/${den}). Los denominadores no se suman.`;
      } else if (num === n1 || num === n2) {
        code = "ERR_PARTIAL";
        msg = `Alerta: Suma Incompleta. Solo sintonizaste una de las señales.`;
      }

      handleOptionClick({ id: "W", value: selectedFractionText, correct: false, errorCode: code, feedback: msg });
    }
  };

  return (
    <div style={m1Styles.container}>
      <div style={m1Styles.refBox}>
        <span style={m1Styles.refLabel}>📡 Primera Fracción: <strong style={{ color: "#38bdf8" }}>{n1}/{D}</strong></span>
        <span style={m1Styles.refLabel}>🛸 Segunda Fracción: <strong style={{ color: "#c084fc" }}>{n2}/{D}</strong></span>
      </div>

      <div style={m1Styles.controlGrid}>
        <div style={m1Styles.stepperBox}>
          <div style={m1Styles.boxTitle}>PARTES SELECCIONADAS (Numerador)</div>
          <div style={m1Styles.ledDisplay}>{num}</div>
          <div style={m1Styles.buttonRow}>
            <button {...bindHoldEvents(() => setNum((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setNum((p) => (p < 20 ? p + 1 : 20)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">＋</button>
          </div>
        </div>

        <div style={m1Styles.stepperBox}>
          <div style={m1Styles.boxTitle}>DIVISIONES DE LA UNIDAD (Denominador)</div>
          <div style={m1Styles.ledDisplay}>{den}</div>
          <div style={m1Styles.buttonRow}>
            <button {...bindHoldEvents(() => setDen((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setDen((p) => (p < 20 ? p + 1 : 20)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">＋</button>
          </div>
        </div>
      </div>

      <div style={m1Styles.previewScreen}>
        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Tu Fracción Seleccionada</div>
        <div style={m1Styles.previewFraction}>
          <span style={{ color: "#38bdf8" }}>{num}</span>
          <span style={{ color: "#334155", margin: "0 12px" }}>/</span>
          <span style={{ color: "#c084fc" }}>{den}</span>
        </div>
        {warningMsg && (
          <p style={{ fontSize: "11px", color: "#fb923c", fontWeight: "bold", margin: "8px 0 0 0" }}>⚠️ {warningMsg}</p>
        )}
      </div>

      <button onClick={handleConfirm} disabled={selectedOption !== null} style={m1Styles.confirmBtn(selectedOption !== null)} type="button">
        📊 CONFIRMAR FRACCIÓN Y PROBAR
      </button>
    </div>
  );
}

const m1Styles = {
  container: { backgroundColor: "#05091c", border: "2px solid #1e293b", borderRadius: "12px", padding: "20px", marginTop: "10px" },
  refBox: { display: "flex", justifyContent: "space-around", backgroundColor: "#02040e", padding: "10px", borderRadius: "8px", border: "1px solid #111827", marginBottom: "15px" },
  refLabel: { fontSize: "12px", fontWeight: "bold", color: "#94a3b8" },
  controlGrid: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px", width: "100%" },
  stepperBox: { backgroundColor: "#080d24", border: "1px solid #1e293b", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "180px" },
  boxTitle: { fontSize: "9px", fontWeight: "bold", color: "#64748b", letterSpacing: "0.5px", marginBottom: "10px", textAlign: "center" },
  ledDisplay: { fontSize: "32px", fontFamily: "monospace", fontWeight: "bold", color: "#38bdf8", backgroundColor: "#02040e", width: "70px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #1e293b", marginBottom: "12px" },
  buttonRow: { display: "flex", gap: "15px" },
  stepBtn: { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #38bdf8", backgroundColor: "rgba(56, 189, 248, 0.08)", color: "#38bdf8", fontSize: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  previewScreen: { backgroundColor: "#02040e", border: "1px solid #111827", borderRadius: "8px", padding: "12px", textAlign: "center", marginBottom: "15px" },
  previewFraction: { fontSize: "36px", fontWeight: "bold", marginTop: "4px" },
  yellowNeonHelpBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#02040e",
    border: "2px solid #fb923c",
    color: "#fb923c",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(251, 146, 60, 0.25)",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease"
  },
  confirmBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#475569" : "#ffffff", border: "none", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 📦 CONTROL M2: SEGUNDA CAPA DE STEPPERS CALIBRADOS (Almacenamiento de Alimentos)
// ==========================================
function M2TurbineStepperControl({ equation, options, handleOptionClick, selectedOption }) {
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(1);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [warningMsg, setWarningMsg] = useState(null);

  const stopInterval = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startInterval = useCallback((action) => {
    if (selectedOption !== null) return;
    stopInterval();
    action();
    
    // DELAY CALIBRADO: 550ms
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 150); // INTERVALO DE RAMPA: 150ms
    }, 550);
  }, [selectedOption, stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const bindHoldEvents = (action) => ({
    onMouseDown: (e) => {
      if (e.button !== 0) return;
      startInterval(action);
    },
    onMouseUp: stopInterval,
    onMouseLeave: stopInterval,
    onTouchStart: (e) => {
      if (e.cancelable) e.preventDefault();
      startInterval(action);
    },
    onTouchEnd: stopInterval
  });

  useEffect(() => {
    if (selectedOption === null) {
      setNum(1);
      setDen(1);
      setWarningMsg(null);
    }
  }, [equation, selectedOption]);

  const parseEquation = (eq) => {
    if (!eq) return { n1: 1, d1: 4, n2: 1, d2: 8 };
    const match = eq.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)/);
    if (match) {
      return {
        n1: parseInt(match[1], 10),
        d1: parseInt(match[2], 10),
        n2: parseInt(match[3], 10),
        d2: parseInt(match[4], 10)
      };
    }
    return { n1: 1, d1: 4, n2: 1, d2: 8 };
  };

  const { n1, d1, n2, d2 } = parseEquation(equation);

  const handleConfirm = () => {
    if (selectedOption !== null) return;
    
    if (num === 1 && den === 1) {
      setWarningMsg("Debes colocar el número correspondiente apretando ＋ y － para registrar el alimento.");
      setTimeout(() => setWarningMsg(null), 5000);
      return;
    }

    const selectedFractionText = `${num}/${den}`;
    const matchingOption = options.find((opt) => opt.value === selectedFractionText);

    if (matchingOption) {
      handleOptionClick(matchingOption);
    } else {
      let code = "ERR_GENERIC";
      let msg = `Almacenamiento errático (${num}/${den}). Registrá el total unificado de raciones secas.`;
      
      if (den === d1 + d2) {
        code = "ERR_DIRECT";
        msg = `Alerta: Suma Directa (${num}/${den}). Los tamaños de las cajas no se suman linealmente.`;
      } else if (num === n1 || num === n2) {
        code = "ERR_PARTIAL";
        msg = `Alerta: Suma Incompleta. Solo inyectaste combustible de uno de los depósitos.`;
      } else if (den === d1 * d2 && num === n1 + n2) {
        code = "ERR_LCD";
        msg = `Alerta: MCD Distorsionado. Multiplicaste los tanques sin amplificar numeradores.`;
      }

      handleOptionClick({ id: "W", value: selectedFractionText, correct: false, errorCode: code, feedback: msg });
    }
  };

  return (
    <div style={m2Styles.container}>
      <div style={m2Styles.refBox}>
        <span style={m2Styles.refLabel}>⛽ Primera Fracción: <strong style={{ color: "#38bdf8" }}>{n1}/{d1}</strong></span>
        <span style={m2Styles.refLabel}>⛽ Segunda Fracción (Auxiliar): <strong style={{ color: "#fb923c" }}>{n2}/{d2}</strong></span>
      </div>

      <div style={m2Styles.controlGrid}>
        <div style={m2Styles.stepperBox}>
          <div style={m2Styles.boxTitle}>TOTAL DE PARTES (Numerador)</div>
          <div style={m2Styles.ledDisplay}>{num}</div>
          <div style={m2Styles.buttonRow}>
            <button {...bindHoldEvents(() => setNum((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m2Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setNum((p) => (p < 20 ? p + 1 : 20)))} disabled={selectedOption !== null} style={m2Styles.stepBtn} type="button">＋</button>
          </div>
        </div>

        <div style={m2Styles.stepperBox}>
          <div style={m2Styles.boxTitle}>DENOMINADOR COMÚN (En cuántas partes cortamos)</div>
          <div style={m2Styles.ledDisplay}>{den}</div>
          <div style={m2Styles.buttonRow}>
            <button {...bindHoldEvents(() => setDen((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m2Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setDen((p) => (p < 20 ? p + 1 : 20)))} disabled={selectedOption !== null} style={m2Styles.stepBtn} type="button">＋</button>
          </div>
        </div>
      </div>

      <div style={m2Styles.previewScreen}>
        <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Tu Fracción Seleccionada</div>
        <div style={m2Styles.previewFraction}>
          <span style={{ color: "#38bdf8" }}>{num}</span>
          <span style={{ color: "#334155", margin: "0 12px" }}>/</span>
          <span style={{ color: "#fb923c" }}>{den}</span>
        </div>
        {warningMsg && (
          <p style={{ fontSize: "11px", color: "#fb923c", fontWeight: "bold", margin: "8px 0 0 0" }}>⚠️ {warningMsg}</p>
        )}
      </div>

      <button onClick={handleConfirm} disabled={selectedOption !== null} style={m2Styles.ignitionBtn(selectedOption !== null)} type="button">
        📊 CONFIRMAR Y PROBAR FRACCIÓN
      </button>
    </div>
  );
}

const m2Styles = {
  container: { backgroundColor: "rgba(5, 9, 28, 0.8)", border: "2px solid #334155", borderRadius: "14px", padding: "16px", marginTop: "10px" },
  refBox: { display: "flex", justifyContent: "space-around", backgroundColor: "#02040e", padding: "10px", borderRadius: "8px", border: "1px solid #111827", marginBottom: "15px" },
  refLabel: { fontSize: "12px", fontWeight: "bold", color: "#94a3b8" },
  controlGrid: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px", width: "100%" },
  stepperBox: { backgroundColor: "#0c0f24", border: "1px solid #334155", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "180px" },
  boxTitle: { fontSize: "9px", fontWeight: "bold", color: "#64748b", letterSpacing: "0.5px", marginBottom: "10px", textAlign: "center" },
  ledDisplay: { fontSize: "32px", fontFamily: "monospace", fontWeight: "bold", color: "#fb923c", backgroundColor: "#02040e", width: "70px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #334155", marginBottom: "12px" },
  buttonRow: { display: "flex", gap: "15px" },
  stepBtn: { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #fb923c", backgroundColor: "rgba(251, 146, 60, 0.08)", color: "#fb923c", fontSize: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  previewScreen: { backgroundColor: "#02040e", border: "1px solid #111827", borderRadius: "8px", padding: "12px", textAlign: "center", marginBottom: "15px" },
  previewFraction: { fontSize: "36px", fontWeight: "bold", marginTop: "4px" },
  ignitionBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 0 15px rgba(251, 146, 60, 0.4)" })
};

// ==========================================
// 🛸 CONTROL M3: CONSOLA DE ACOPLE NO LINEAL (2×3)
// ==========================================
function M3OrbitalConsole({ options, handleOptionClick, selectedOption }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (selectedOption === null) setActiveId(null);
  }, [selectedOption]);

  const handleConfirm = () => {
    if (!activeId || selectedOption !== null) return;
    const matched = options.find((opt) => opt.id === activeId);
    if (matched) handleOptionClick(matched);
  };

  return (
    <div style={m3MatrixStyles.container}>
      <p style={m3MatrixStyles.title}>🛸 ELEGÍ EL RESULTADO CORRECTO DE LA OPERACIÓN:</p>
      <div style={m3MatrixStyles.grid2x3}>
        {options.map((opt) => {
          const isSelected = activeId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => selectedOption === null && setActiveId(opt.id)}
              style={m3MatrixStyles.podCard(isSelected, selectedOption !== null)}
            >
              <div style={m3MatrixStyles.podHeader}>
                <span style={m3MatrixStyles.podBadge(isSelected)}>{opt.id}</span>
                <div style={m3MatrixStyles.lockPin(isSelected)}>
                  {isSelected ? "● SELECCIONADO" : "○ DISPONIBLE"}
                </div>
              </div>
              <div style={m3MatrixStyles.freqVal(isSelected)}>
                {opt.value}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleConfirm}
        disabled={!activeId || selectedOption !== null}
        style={m3MatrixStyles.engageBtn(!activeId || selectedOption !== null)}
        type="button"
      >
        ⚡ CONFIRMAR Y PROBAR RESULTADO
      </button>
    </div>
  );
}

const m3MatrixStyles = {
  container: { backgroundColor: "rgba(2, 23, 21, 0.8)", border: "2px solid #10b981", borderRadius: "14px", padding: "16px", marginTop: "10px", boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)" },
  title: { fontSize: "11px", color: "#6ee7b7", fontWeight: "900", margin: "0 0 12px 0", letterSpacing: "0.5px" },
  grid2x3: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  podCard: (active, disabled) => ({ display: "flex", flexDirection: "column", padding: "10px 12px", borderRadius: "8px", border: `2px solid ${active ? "#10b981" : "#1e3a35"}`, backgroundColor: active ? "rgba(16, 185, 129, 0.2)" : "#020f0d", boxShadow: active ? "0 0 15px rgba(16, 185, 129, 0.4)" : "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }),
  podHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  podBadge: (active) => ({ fontSize: "10px", fontWeight: "900", backgroundColor: active ? "#10b981" : "#134e4a", color: active ? "#021715" : "#6ee7b7", padding: "2px 6px", borderRadius: "4px" }),
  lockPin: (active) => ({ fontSize: "9px", fontWeight: "bold", color: active ? "#10b981" : "#4b7c75" }),
  freqVal: (active) => ({ fontSize: "18px", fontWeight: "900", color: active ? "#6ee7b7" : "#ffffff", fontFamily: "'Courier New', monospace", textAlign: "center", padding: "4px 0" }),
  engageBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#64748b" : "#021715", border: "none", fontWeight: "900", fontSize: "12px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 0 15px rgba(16, 185, 129, 0.4)" })
};

// ==========================================
// 🎯 CONTROL M4: PALANCAS TÁCTICAS BASCULANTES COMPACTAS
// ==========================================
function M4ToggleSwitches({ options, onConfirm, disabled }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setSelectedId(null);
  }, [options]);

  const handleExecute = () => {
    if (!selectedId || disabled) return;
    const chosen = options.find((o) => o.id === selectedId);
    if (chosen) onConfirm(chosen);
  };

  return (
    <div style={m4ToggleStyles.wrapper}>
      <div style={m4ToggleStyles.compactGrid}>
        {options.map((opt) => {
          const isFlipped = selectedId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => !disabled && setSelectedId(opt.id)}
              style={m4ToggleStyles.switchPanel(isFlipped, disabled)}
            >
              <div style={m4ToggleStyles.leverAssembly}>
                <div style={m4ToggleStyles.leverBase}>
                  <div style={m4ToggleStyles.leverHandle(isFlipped)} />
                </div>
                <div style={m4ToggleStyles.leverLed(isFlipped)} />
              </div>
              <div style={m4ToggleStyles.contentBox}>
                <span style={m4ToggleStyles.idPill}>{opt.id}</span>
                <span style={m4ToggleStyles.optText}>{opt.value}</span>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleExecute}
        disabled={!selectedId || disabled}
        style={m4ToggleStyles.throttleBtn(!selectedId || disabled)}
        type="button"
      >
        📊 CONFIRMAR Y CONTINUAR PASO
      </button>
    </div>
  );
}

const m4ToggleStyles = {
  wrapper: { marginTop: "10px" },
  compactGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "14px" },
  switchPanel: (active, disabled) => ({ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "8px", border: `2px solid ${active ? "#fb923c" : "#334155"}`, backgroundColor: active ? "rgba(251, 146, 60, 0.2)" : "#02040e", boxShadow: active ? "0 0 12px rgba(251, 146, 60, 0.4)" : "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }),
  leverAssembly: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  leverBase: { width: "18px", height: "26px", backgroundColor: "#1e293b", borderRadius: "9px", border: "1px solid #475569", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  leverHandle: (active) => ({ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: active ? "#fb923c" : "#64748b", boxShadow: active ? "0 0 8px #fb923c" : "none", transform: active ? "translateY(-6px)" : "translateY(6px)", transition: "transform 0.2s ease" }),
  leverLed: (active) => ({ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: active ? "#fb923c" : "#334155" }),
  contentBox: { display: "flex", alignItems: "center", gap: "6px", flex: 1, overflow: "visible" },
  idPill: { fontSize: "14px", fontWeight: "900", backgroundColor: "#1e293b", color: "#fb923c", padding: "4px 8px", borderRadius: "4px" },
  optText: { fontSize: "16px", lineHeight: "1.5", color: "#ffffff", fontWeight: "bold", letterSpacing: "0.4px", whiteSpace: "normal" },
  throttleBtn: (disabled) => ({ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "900", fontSize: "12px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 0 15px rgba(251, 146, 60, 0.4)" })
};

// ==========================================
// 🌌 COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const { playCorrect, playError, playRobotChat, playMissionDone, playBadge } = useGameFeedback();

  // Gestión de Nickname persistente en LocalStorage
  const [studentNickname, setStudentNickname] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edumision_nickname") || "Martín G. (Tú)";
    }
    return "Martín G. (Tú)";
  });

  const shipName = "";

  const suitColor = "#38bdf8";

  // Estados de navegación y roles
  const [showStudentWelcome, setShowStudentWelcome] = useState(true);
  const [showInstructionModal, setShowInstructionModal] = useState(null);
  const [view, setView] = useState("alumno");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transitionPhase, setTransitionPhase] = useState(false);
  const [copyToast, setCopyToast] = useState(null);
  const [lobbyBlocked, setLobbyBlocked] = useState(false);

  // CONTROL DE LOBBY / CUPOS (Límite Máximo: 12 estudiantes)
  const MAX_CUPOS = 12;

  // 🔗 DETECCIÓN AUTOMÁTICA DE ROL POR LINK (?rol=docente, ?rol=alumno)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const rolParam = params.get("rol") || params.get("view") || params.get("modo");
      if (rolParam === "docente" || rolParam === "profesor" || rolParam === "profe") {
        setView("docente");
        setShowStudentWelcome(false);
      } else if (rolParam === "alumno" || rolParam === "estudiante" || rolParam === "chicos") {
        setView("alumno");
      }
    }
  }, []);

  // 🎯 SISTEMA DE XP Y ERRORES EXACTOS POR MISIÓN
  const [missionXp, setMissionXp] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
  const [currentMissionErrors, setCurrentMissionErrors] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });

  const [floatingXp, setFloatingXp] = useState(null);
  const [activeMission, setActiveMission] = useState("m1");
  const [missionStatus, setMissionStatus] = useState({
    m1: "activa",
    m2: "bloqueada",
    m3: "bloqueada",
    m4: "bloqueada"
  });

  const [currentLevelData, setCurrentLevelData] = useState(() => MathGenerator.generateM1());
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [interestLogged, setInterestLogged] = useState(false);

  // MEDICIÓN DE TIEMPO DE RESPUESTA EN M4 PARA DETECTAR FRAUDE (Soporte Padres / Calculadora)
  const m4StartTimeRef = useRef(null);
  const [possibleFraud, setPossibleFraud] = useState(false);

  // EDUBOT
  const [copilotMood, setCopilotMood] = useState("idle");
  const [copilotMsg, setCopilotMsg] = useState(
    "🤖 Copiloto listo para registrar telemetría. Solicitá 'Apoyo Matemático' en tu panel para consultar las Reglas de la Misión."
  );
  const [errorWarning, setErrorWarning] = useState(null);
  const errorTimeoutRef = useRef(null);

  // M4 Procedimental
  const [stepIndex, setStepIndex] = useState(0);
  const [m4StepsData, setM4StepsData] = useState(() => MathGenerator.generateM4());

  // Telemetría LRS Local
  const [bitacora, setBitacora] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef(null);
  const [loginTime] = useState(new Date().toLocaleTimeString("es-AR"));

  const [helpsRequested, setHelpsRequested] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [helpsPerMission, setHelpsPerMission] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
  const [errorsPerMission, setErrorsPerMission] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
  const [teacherMessage, setTeacherMessage] = useState("¡Buen viaje espacial, tripulante! Lee con atención cada señal.");

  const totalXp = missionXp.m1 + missionXp.m2 + missionXp.m3 + missionXp.m4;

  // Función para copiar enlaces directos
  const copyDirectLink = (role) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}?rol=${role}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopyToast(`¡Link para ${role === "alumno" ? "Chicos" : "Docentes"} copiado!`);
        setTimeout(() => setCopyToast(null), 3000);
      });
    }
  };

  useEffect(() => {
    setBitacora([
      { time: new Date().toLocaleTimeString("es-AR"), action: "🟢 Conexión a cabina de vuelo.", type: "cidi" },
      { time: new Date().toLocaleTimeString("es-AR"), action: "🛰️ LRS Telemetría activado con UUID: 7a3b2c1d-4e5f-6a7b.", type: "system" }
    ]);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Control de cupo del lobby al iniciar
  useEffect(() => {
    if (students.length >= MAX_CUPOS) {
      setLobbyBlocked(true);
    } else {
      setLobbyBlocked(false);
    }
  }, [students]);

  // Función para cargar misiones
  const loadMissionData = useCallback((missionKey) => {
    setSelectedOption(null);
    setFeedback(null);
    setAttempts(0);

    if (missionKey === "m1") {
      setCurrentLevelData(MathGenerator.generateM1());
    } else if (missionKey === "m2") {
      setCurrentLevelData(MathGenerator.generateM2());
    } else if (missionKey === "m3") {
      setCurrentLevelData(MathGenerator.generateM3());
    } else if (missionKey === "m4") {
      setM4StepsData(MathGenerator.generateM4());
      setStepIndex(0);
      // Iniciar conteo de fraude
      m4StartTimeRef.current = Date.now();
    }
    setCopilotMood("idle");
    setCopilotMsg(
      "🤖 Copiloto listo para registrar telemetría. Solicitá 'Apoyo Matemático' en tu panel para consultar las Reglas de la Misión."
    );
  }, []);

  useEffect(() => {
    loadMissionData(activeMission);
    registrarBitacora("started", `Inició trayectoria: Misión ${activeMission.toUpperCase()}`, "system");
  }, [activeMission, loadMissionData]);

  const triggerFloatingXp = (text, color) => {
    setFloatingXp({ text, color });
    setTimeout(() => setFloatingXp(null), 1600);
  };

  const triggerErrorWarning = (msg) => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setErrorWarning(msg);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorWarning(null);
    }, 10000);
  };

  const registrarBitacora = (verb, action, type) => {
    const timestamp = new Date().toLocaleTimeString("es-AR");
    setBitacora((prev) => [
      { time: timestamp, action: `[xAPI:${verb.toUpperCase()}] ${action}`, type },
      ...prev
    ]);
  };

  // Sincronizar Roster Docente en tiempo real
  useEffect(() => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === 1) {
          return {
            ...s,
            name: studentNickname,
            
            xp: totalXp,
            badgeEarned: badgeEarned,
            interestRegistered: interestLogged,
            helpsRequested: helpsRequested,
            errorsCount: totalErrors,
            missions: {
              m1: {
                status: missionStatus.m1 === "completada" ? "completado" : "activa",
                attempts: activeMission === "m1" ? attempts : s.missions.m1.attempts,
                helps: helpsPerMission.m1,
                errors: errorsPerMission.m1
              },
              m2: {
                status: missionStatus.m2 === "completada" ? "completado" : missionStatus.m2,
                attempts: activeMission === "m2" ? attempts : s.missions.m2.attempts,
                helps: helpsPerMission.m2,
                errors: errorsPerMission.m2
              },
              m3: {
                status: missionStatus.m3 === "completada" ? "completado" : missionStatus.m3,
                attempts: activeMission === "m3" ? attempts : s.missions.m3.attempts,
                helps: helpsPerMission.m3,
                errors: errorsPerMission.m3
              },
              m4: {
                status: missionStatus.m4 === "completada" ? "completado" : missionStatus.m4,
                attempts: activeMission === "m4" ? attempts : s.missions.m4.attempts,
                helps: helpsPerMission.m4,
                errors: errorsPerMission.m4,
                possibleFraud: possibleFraud
              }
            }
          };
        }
        return s;
      })
    );
  }, [totalXp, missionStatus, badgeEarned, interestLogged, attempts, helpsRequested, totalErrors, helpsPerMission, errorsPerMission, studentNickname, shipName, possibleFraud]);

  // Manejo de clicks de opciones
  const handleOptionClick = (option) => {
    // Si es una advertencia de sintonización inicial (M1 / M2 en 1/1)
    if (option.id === "W_WARN") {
      playError();
      setCopilotMood("thinking");
      setCopilotMsg(`⚠️ ${option.feedback}`);
      triggerErrorWarning(option.feedback);
      return;
    }

    setSelectedOption(option.id);
    setAttempts((prev) => prev + 1);
    setFeedback(option);

    if (option.correct) {
      playCorrect();
      setCopilotMood("happy");
      setCopilotMsg("¡Bravísimo, comandante! Los sensores confirman el acople perfecto.");
      setErrorWarning(null);

      if (activeMission !== "m4") {
        registrarBitacora("completed", `Resolvió Misión ${activeMission.toUpperCase()}`, "success");
        const yaCompletada = missionStatus[activeMission] === "completada";

        setMissionXp((prev) => {
          const current = prev[activeMission];
          if (!yaCompletada) {
            const errorsInRun = currentMissionErrors[activeMission] || 0;
            const earned = Math.max(10, 100 - errorsInRun * 10);
            triggerFloatingXp(`+${earned} XP Ganados`, "#4ade80");
            return { ...prev, [activeMission]: earned };
          } else {
            if (current < 100) {
              const nextVal = Math.min(100, current + 10);
              triggerFloatingXp(`+${nextVal - current} XP Farmeado`, "#38bdf8");
              return { ...prev, [activeMission]: nextVal };
            }
            return prev;
          }
        });

        const nextMission = activeMission === "m1" ? "m2" : activeMission === "m2" ? "m3" : "m4";
        setMissionStatus((prev) => ({
          ...prev,
          [activeMission]: "completada",
          [nextMission]: prev[nextMission] === "bloqueada" ? "activa" : prev[nextMission]
        }));
        playMissionDone();

        if (!yaCompletada) {
          setTimeout(() => {
            setTransitionPhase(true);
            setTimeout(() => {
              setActiveMission(nextMission);
              setTransitionPhase(false);
            }, 1000);
          }, 2000);
        }
      } else {
        registrarBitacora("completed", `Superó Paso ${stepIndex + 1} del Cierre`, "success");
        if (stepIndex === 3) {
          // Evaluar sospecha de fraude / velocidad (Misión 4 resuelta en menos de 15 segundos)
          const elapsed = (Date.now() - m4StartTimeRef.current) / 1000;
          if (elapsed < 15) {
            setPossibleFraud(true);
            registrarBitacora("fraud_alert", "⚠️ Velocidad de respuesta excesiva: Posible asistencia o calculadora.", "error");
          }
          
          setStudents((prev) =>
            prev.map((s) => (s.id === 1 ? { ...s, justificationQuality: option.justificationType } : s))
          );
          registrarBitacora("justified", `Justificación: ${option.justificationType.toUpperCase()}`, "success");
        }
      }
    } else {
      playError();
      setCopilotMood("shocked");
      setCopilotMsg("¡Epa, casi cometemos un error de cálculo! Revisá los números en papel, no pasa nada.");

      const yaCompletada = missionStatus[activeMission] === "completada";

      setCurrentMissionErrors((prev) => ({
        ...prev,
        [activeMission]: (prev[activeMission] || 0) + 1
      }));

      if (yaCompletada) {
        setMissionXp((prev) => {
          const nextVal = Math.max(0, prev[activeMission] - 10);
          triggerFloatingXp("-10 XP", "#fb923c");
          return { ...prev, [activeMission]: nextVal };
        });
      } else {
        triggerFloatingXp("-10 XP Potencial", "#fb923c");
      }

      triggerErrorWarning("Revisá con lápiz y papel. Prohibido usar calculadora: ejercitá tu razonamiento.");

      registrarBitacora("failed", `Desvío: ${option.errorCode || "ERR_GENERIC"} en Misión ${activeMission.toUpperCase()}`, "error");
      setTotalErrors((prev) => prev + 1);
      setErrorsPerMission((prev) => ({ ...prev, [activeMission]: prev[activeMission] + 1 }));

      setTimeout(() => {
        if (activeMission !== "m4" && currentLevelData && currentLevelData.options) {
          setCurrentLevelData((prev) => ({
            ...prev,
            options: prepareOptions(prev.options)
          }));
        } else if (activeMission === "m4" && m4StepsData[stepIndex]) {
          setM4StepsData((prev) => {
            const copy = [...prev];
            copy[stepIndex] = {
              ...copy[stepIndex],
              options: prepareOptions(copy[stepIndex].options)
            };
            return copy;
          });
        }
        setSelectedOption(null);
        setCopilotMood("idle");
      }, 2000);
    }
  };

  const handleNextStepM4 = () => {
    if (stepIndex < 3) {
      setStepIndex((p) => p + 1);
      setSelectedOption(null);
      setFeedback(null);
      setCopilotMood("idle");
    } else {
      if (!badgeEarned) {
        const errorsM4 = currentMissionErrors.m4 || 0;
        const earnedM4 = Math.max(20, 200 - errorsM4 * 10);
        setMissionXp((prev) => ({ ...prev, m4: earnedM4 }));
        triggerFloatingXp(`+${earnedM4} XP Ganados`, "#4ade80");
        setBadgeEarned(true);
        playBadge();
        setMissionStatus((prev) => ({ ...prev, m4: "completada" }));
        playMissionDone();
        setCopilotMood("happy");
        setCopilotMsg("¡Aterrizaje épico! Te ganaste la insignia de Experto/a en Gestión de Recursos.");
      } else {
        setMissionXp((prev) => {
          const current = prev.m4;
          const nextVal = Math.min(200, current + 20);
          triggerFloatingXp(`+${nextVal - current} XP Farmeado`, "#38bdf8");
          return { ...prev, m4: nextVal };
        });
      }
      registrarBitacora("badge_earned", "🏆 Insignia acreditada: Experto/a en Gestión de Recursos", "success");
    }
  };

  const handleRegenerate = () => {
    playRobotChat();
    loadMissionData(activeMission);
    setCopilotMood("thinking");
    setCopilotMsg("¡Nuevas coordenadas cargadas! Resolvé correctamente para farmear hasta el tope.");
    registrarBitacora("practiced", `Re-entrenando ${activeMission.toUpperCase()} para recuperar puntos.`, "system");
  };

  const handleCopilotHelpClick = () => {
    playRobotChat();
    setCopilotMood("thinking");
    
    const currentCount = helpsPerMission[activeMission] || 0;
    const helpLevel = (currentCount % 2) + 1; // EXACTAMENTE 2 REGLAS ("dos que no haya 3")
    
    setHelpsRequested((prev) => prev + 1);
    setHelpsPerMission((prev) => ({ ...prev, [activeMission]: currentCount + 1 }));

    let hint = "";
    if (activeMission === "m1") {
      if (helpLevel === 1) {
        hint = "📐 REGLA MATEMÁTICA N° 1 (Numerador y Denominador):\nDebés saber que los dos números se llaman Numerador y Denominador. El de arriba es el Numerador (indica cuántas partes tenés) y el de abajo es el Denominador (indica en cuántas partes iguales está cortada la unidad). Tené bien claro cuál es cuál antes de operar.";
      } else {
        hint = "📐 REGLA MATEMÁTICA N° 2 (Suma Homogénea):\nCuando las fracciones tienen el mismo número abajo (denominadores iguales), la base no cambia porque las porciones ya son del mismo tamaño. Mantené el denominador intacto abajo y sumá únicamente los numeradores arriba. ¡No sumes los de abajo!";
      }
    } else if (activeMission === "m2") {
      if (helpLevel === 1) {
        hint = "📐 REGLA MATEMÁTICA N° 1 (Distinto Denominador):\nNo se pueden sumar directamente las fracciones si tienen diferente denominador. Para sumas de dos o más fracciones sirven las mismas reglas que vimos: primero debemos unificarlas para que compartan la misma base.";
      } else {
        hint = "📐 REGLA MATEMÁTICA N° 2 (Equivalencia):\nPara que dos fracciones tengan la misma base, multiplicamos el número de arriba y el de abajo de una de ellas por el mismo número (amplificación). Por ejemplo: 1/3 es exactamente lo mismo que tener 2/6. Con bases iguales, sumás arriba.";
      }
    } else if (activeMission === "m3") {
      if (helpLevel === 1) {
        hint = "📐 REGLA MATEMÁTICA N° 1 (Denominador Común):\nCuando los números de abajo no se pueden dividir entre sí directamente (como 3 y 4), buscá un número común en las tablas de multiplicar de ambos. El número más chico donde coinciden es el 12. Convertí ambas fracciones antes de operar.";
      } else {
        hint = "📐 REGLA MATEMÁTICA N° 2 (Simplificación):\nSi el resultado final se puede simplificar, dividí el numerador y el de abajo por el mismo divisor común para llegar a la fracción más pura (irreducible). Por ejemplo: 3/6 equivale a 1/2.";
      }
    } else if (activeMission === "m4") {
      if (helpLevel === 1) {
        hint = "📐 REGLA MATEMÁTICA N° 1 (Suma de Tres Fracciones):\nPara sumar tres o más fracciones de diferente denominador, se aplican las mismas reglas de base común: buscamos un denominador que esté en la tabla de multiplicar de todos los números de abajo antes de realizar la suma.";
      } else {
        hint = "📐 REGLA MATEMÁTICA N° 2 (Fracción y Entero):\nRecordá que una unidad entera se representa con el mismo número arriba y abajo (por ejemplo: 4/4 o 12/12). Si tenés 9/12, es menor que el entero entero (12/12).";
      }
    }

    setCopilotMsg(hint);
    registrarBitacora("help", `Consultó Apoyo [Regla ${helpLevel}] en Misión ${activeMission.toUpperCase()}`, "system");
  };

    const handleLogInterest = () => {
    setInterestLogged(true);
    playCorrect();
    registrarBitacora("interest_registered", "El alumno solicitó continuar a la Expedición Interdisciplinaria", "success");
  };

  return (
    <div style={getMissionBackground(view, activeMission)}>
      <style>{`
        @keyframes floatUpFade {
          0% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-35px) scale(1.2); }
        }
        @keyframes pulseWarning {
          0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
        }
      `}</style>

      {/* 🛑 BLOQUEO DE LOBBY POR CUPO LLENO */}
      {lobbyBlocked && view === "alumno" && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, borderColor: "#ef4444" }}>
            <div style={{ ...styles.parentModalTitle, color: "#ef4444" }}>
              <span>🛑</span> AULA COMPLETA 🏕️
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#cbd5e1", margin: "14px 0" }}>
              Expedición Completa. El cupo de esta expedición está lleno (Máximo {MAX_CUPOS} estudiantes activos).
              <br /><br />
              Esperá a que la docente autorice nuevos ingresos o cierre el aula actual para continuar.
            </p>
          </div>
        </div>
      )}

      {/* 🚀 MODAL DE INICIO DE NICKNAME Y REGLAS (REFUGIO DE MONTAÑA) */}
      {showStudentWelcome && view === "alumno" && !lobbyBlocked && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "460px" }}>
            <div style={{ ...styles.parentModalTitle, fontSize: "18px" }}>
              <span>🏕️</span> PROYECTO ÉXODO: ENTRENAMIENTO DE SUPERVIVENCIA
            </div>

            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#38bdf8", display: "block", marginBottom: "8px" }}>
                📝 TU APODO O NICKNAME DE PILOTO:
              </label>
              <input
                type="text"
                placeholder="Escribí tu apodo de entrenamiento (ej: Lauti)"
                value={studentNickname === "Martín G. (Tú)" ? "" : studentNickname}
                onChange={(e) => {
                  const val = e.target.value.trim() || "Martín G. (Tú)";
                  setStudentNickname(val);
                  localStorage.setItem("edumision_nickname", val);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#02040e",
                  border: "1px solid #38bdf8",
                  color: "#ffffff",
                  fontSize: "15px"
                }}
              />
            </div>
            
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>📝</span>
                <div style={{ fontSize: "14px" }}><strong>Lápiz y Papel:</strong> Hacé las cuentas a mano antes de usar los mandos.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🚫</span>
                <div style={{ fontSize: "14px" }}><strong>Sin Calculadora:</strong> Entrená tu mente para estar listo en el refugio.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>⚡</span>
                <div style={{ fontSize: "14px" }}><strong>Puntos Resilientes:</strong> Los errores no te bloquean. Sumás XP que siempre van hacia arriba al practicar y corregir.</div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (!studentNickname || studentNickname === "Martín G. (Tú)") {
                  setStudentNickname("Martín G. (Tú)");
                }
                setShowStudentWelcome(false);
                playRobotChat();
              }}
              style={{ ...styles.parentModalBtn, padding: "14px", fontSize: "15px" }}
              type="button"
            >
              🚀 ¡INICIAR ENTRENAMIENTO EN VIVO!
            </button>
          </div>
        </div>
      )}

      {/* 🌌 EFECTO DE TRANSICIÓN HIPERESPACIAL */}
      {transitionPhase && <HyperspaceJump />}

      {/* ❓ MODAL DE INSTRUCCIONES TÁCTILES */}
      {showInstructionModal && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "540px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #38bdf8", paddingBottom: "10px", marginBottom: "16px" }}>
              <span style={{ color: "#38bdf8", fontSize: "18px", fontWeight: "900" }}>⚙️ MANUAL DE USO DEL PANEL TÁCTIL</span>
              <button 
                onClick={() => setShowInstructionModal(null)} 
                style={{ background: "none", border: "none", color: "#64748b", fontSize: "24px", cursor: "pointer" }}
                type="button"
              >
                ✕
              </button>
            </div>
            
            <div style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: "1.7", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p>Para resolver esta tarea y registrar tus recursos en el refugio, seguí estos pasos:</p>
              
              {showInstructionModal === "m1" && (
                <div style={{ backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <strong style={{ color: "#38bdf8" }}>Misión 1: Suministro de Agua de Emergencia</strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>
                    1. Mirá las dos fracciones de arriba que necesitás sumar (comparten la misma base).<br />
                    2. Usá los botones <strong>＋</strong> y <strong>－</strong> del primer mando para colocar las partes totales reunidas (<strong>Numerador</strong>).<br />
                    3. Usá los botones <strong>＋</strong> y <strong>－</strong> del segundo mando para colocar el tamaño del tanque común (<strong>Denominador</strong>).<br />
                    4. Presioná <strong>📊 CONFIRMAR FRACCIÓN Y PROBAR</strong> para probar el resultado.
                  </p>
                </div>
              )}

              {showInstructionModal === "m2" && (
                <div style={{ backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <strong style={{ color: "#fb923c" }}>Misión 2: Raciones de Alimento Seco</strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>
                    1. Mirá las dos fracciones de raciones con distinto denominador (una es múltiplo de la otra).<br />
                    2. Llevá la fracción de menor denominador a la base de la otra multiplicando arriba y abajo (amplificación).<br />
                    3. Sumá los numeradores unificados sobre la base común.<br />
                    4. Usá los mandos para colocar las raciones en el numerador y la base común en el denominador, y presioná <strong>📊 CONFIRMAR Y PROBAR FRACCIÓN</strong>.
                  </p>
                </div>
              )}

              {showInstructionModal === "m3" && (
                <div style={{ backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <strong style={{ color: "#10b981" }}>Misión 3: Red Eléctrica del Refugio</strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>
                    1. Mirá el cableado instalado por ambos grupos con distinto denominador.<br />
                    2. Buscá un múltiplo común mínimo para unificar los denominadores, suma arriba y simplificá el resultado final si es posible (fracción irreducible).<br />
                    3. Tocá la tarjeta de la cuadrícula que tenga tu resultado e ingresá la confirmación correspondiente.
                  </p>
                </div>
              )}

              {showInstructionModal === "m4" && (
                <div style={{ backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <strong style={{ color: "#fb923c" }}>Misión 4: Gestión de Colonos (El Día 1)</strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>
                    1. Esta es una tarea de consolidación en 4 pasos para analizar los recursos del refugio.<br />
                    2. Leé cada enunciado técnico, resolvé la operación en papel y seleccioná la palanca táctica correspondiente.<br />
                    3. En el paso 4, seleccioná la justificación matemática precisa que valide tus conclusiones.
                  </p>
                </div>
              )}

              <p style={{ fontSize: "13px", color: "#fb923c", fontStyle: "italic", marginTop: "8px" }}>
                💡 ¡Recordá que usar lápiz y papel para hacer las cuentas a mano antes de pulsar ayuda a no cometer errores!
              </p>
            </div>

            <button 
              onClick={() => setShowInstructionModal(null)} 
              style={{ ...styles.parentModalBtn, marginTop: "20px", backgroundColor: "#fb923c" }}
              type="button"
            >
              ✕ CERRAR INSTRUCCIONES
            </button>
          </div>
        </div>
      )}

      {/* TOAST DE COPIADO DE LINK */}
      {copyToast && (
        <div style={styles.copyToastCard}>
          {copyToast}
        </div>
      )}

      {/* 🧭 BARRA DE NAVEGACIÓN */}
      <nav style={styles.navBar}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoEll}>EM</span> 
          <span>EduMisión Córdoba</span>
        </div>
        
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => copyDirectLink("alumno")} style={styles.linkShareBtn} title="Copiar link directo para estudiantes">
            📋 Link Chicos
          </button>
          <button onClick={() => copyDirectLink("docente")} style={styles.linkShareBtnDocente} title="Copiar link directo para la docente">
            📋 Link Docente
          </button>

          <button onClick={() => setView("alumno")} style={view === "alumno" ? styles.activeTabBtn : styles.inactiveTabBtn}>
            🎮 CABINA
          </button>
          <button onClick={() => setView("docente")} style={view === "docente" ? styles.activeTabBtn : styles.inactiveTabBtn}>
            📊 DOCENTE
          </button>
        </div>
      </nav>

      {view === "alumno" ? (
        <div style={styles.gameWrapper}>
          {/* ⚠️ BANNER DE ENCUADRE DE ENTRENAMIENTO DE SUPERVIVENCIA */}
          <div style={{
            backgroundColor: "rgba(251, 146, 60, 0.08)",
            border: "2px solid #fb923c",
            borderRadius: "10px",
            padding: "14px 18px",
            marginBottom: "20px",
            fontSize: "14px",
            lineHeight: "1.7",
            color: "#cbd5e1",
            boxShadow: "0 0 15px rgba(251, 146, 60, 0.15)"
          }}>
            <strong>⚠️ ENCUADRE DE ENTRENAMIENTO DE SUPERVIVENCIA:</strong><br />
            <span style={{ fontStyle: "italic" }}>
              «Necesitamos aprender a gestionar recursos y a construir refugios seguros en la Tierra hoy, porque en el futuro deberemos hacerlo bajo condiciones extremas y mucho menos favorables. Cada cálculo correcto asegura nuestra supervivencia.»
            </span>
          </div>

          <div style={styles.gameHeader}>
            <div>
              <h1 style={{ ...styles.gameTitle, color: suitColor, fontSize: "24px", fontWeight: "bold" }}>Proyecto Éxodo: Entrenamiento de Supervivencia</h1>
              <p style={styles.gameSubtitle}>Refugio de Montaña · Piloto: <strong>{studentNickname}</strong> · Diagnóstico de Fracciones</p>
            </div>
            <div style={styles.sessionStatus}>
              <span style={styles.activePill}>🟢 EN LÍNEA</span>
              <span style={styles.timerPill}>⏱️ {timerSeconds}s</span>
            </div>
          </div>

          {/* BARRA DE XP GIGANTE Y MAPA ORBITAL */}
          <div style={styles.progressionCard}>
            <div style={styles.xpHeader}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={styles.xpBigLabel}>EXPERIENCIA EN MISIONES LOGRADAS:</span>
                <span style={styles.xpBigValue}>{totalXp} / 500 XP</span>
              </div>
              {floatingXp && (
                <span style={{
                  fontSize: "16px",
                  fontWeight: "900",
                  color: floatingXp.color,
                  animation: "floatUpFade 1.4s ease-out forwards"
                }}>
                  {floatingXp.text}
                </span>
              )}
            </div>

            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${(totalXp / 500) * 100}%` }} />
            </div>

            {badgeEarned && (
              <div style={styles.glowingInsigniaCard}>
                <span style={{ fontSize: '40px', filter: 'drop-shadow(0 0 10px #fb923c)' }}>🏆</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <span style={styles.insigniaTitle}>INGENIERO/A DE FUSIÓN ESTELAR</span>
                  <span style={styles.insigniaSubtitle}>Acreditación Oficial de Maestría en Fracciones · EduMisión Córdoba</span>
                </div>
              </div>
            )}

            {/* MAPA TÁCTICO */}
            <div style={styles.tacticalMap}>
              {[
                { key: "m1", title: "M1: SUMINISTRO AGUA", icon: "💧", cap: 100 },
                { key: "m2", title: "M2: RACIONES COMIDA", icon: "🌾", cap: 100 },
                { key: "m3", title: "M3: CONEXIÓN ELÉCTRICA", icon: "☀️", cap: 100 }
              ].map((m) => {
                const isAct = activeMission === m.key;
                const st = missionStatus[m.key];
                return (
                  <button
                    key={m.key}
                    onClick={() => st !== "bloqueada" && setActiveMission(m.key)}
                    disabled={st === "bloqueada"}
                    style={styles.tacticalNode(isAct, st)}
                  >
                    <div style={styles.tacticalNodeHeader}>
                      <span style={{ fontSize: "22px" }}>{m.icon}</span>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: "#38bdf8" }}>{missionXp[m.key]}/{m.cap} XP</span>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "900", color: "#ffffff", margin: "6px 0" }}>{m.title}</div>
                    <div style={styles.statusPill(st)}>
                      {st === "completada" ? "✔ CONSOLIDADA" : isAct ? "⚡ EN CURSO" : st === "bloqueada" ? "🔒 BLOQUEADA" : "LISTA"}
                    </div>
                  </button>
                );
              })}

              {/* M4 PROTAGÓNICA */}
              {(() => {
                const isAct = activeMission === "m4";
                const st = missionStatus.m4;
                return (
                  <button
                    onClick={() => st !== "bloqueada" && setActiveMission("m4")}
                    disabled={st === "bloqueada"}
                    style={styles.tacticalNodeM4(isAct, st)}
                  >
                    <div style={styles.tacticalNodeHeader}>
                      <span style={{ fontSize: "26px" }}>🏕️</span>
                      <span style={{ fontSize: "13px", fontWeight: "900", color: "#fb923c" }}>{missionXp.m4}/200 XP</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#fb923c", margin: "6px 0", letterSpacing: "0.5px" }}>
                      M4: GESTIÓN COLONOS
                    </div>
                    <div style={{ ...styles.statusPill(st), color: st === "completada" ? "#4ade80" : "#fb923c" }}>
                      {st === "completada" ? "🏆 MAESTRÍA LOGRADA" : isAct ? "🔥 MISIÓN ACTIVA" : st === "bloqueada" ? "🔒 BLOQUEADA" : "LISTA"}
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* ÁREA CENTRAL */}
          <div style={styles.mainLayout}>
            <div style={{ ...styles.gameColumn, transition: "all 0.6s ease-in-out", filter: transitionPhase ? "blur(20px) scale(0.95)" : "none", opacity: transitionPhase ? 0.1 : 1 }}>
              {activeMission !== "m4" ? (
                currentLevelData && (
                  <div style={styles.card}>
                    <h2 style={{ ...styles.cardTitle, color: suitColor, fontSize: "16px", fontWeight: "bold" }}>Tarea en Curso: Misión {activeMission.toUpperCase()}</h2>
                    <p style={{ ...styles.instructions, fontSize: "15px", lineHeight: "1.6", color: "#cbd5e1", marginBottom: "14px" }}>
                      {activeMission === "m1" && "El equipo alfa junta 1/5 de un tanque de agua y el equipo beta aporta 2/5 del mismo tanque. Debemos consolidar el total en el medidor."}
                      {activeMission === "m2" && "El refugio cuenta con 1/3 de caja de raciones secas y recibe un aporte de 1/6 de caja de raciones del depósito auxiliar. Para almacenarlo todo junto, debemos unificar los contenedores."}
                      {activeMission === "m3" && "Para conectar la calefacción eléctrica del campamento, un grupo instala 1/3 del cableado del panel solar y otro grupo instala 1/4. Buscá el resultado simplificado para acoplar la energía."}
                    </p>

                    {/* ❓ BOTÓN DE INSTRUCCIONES EMERGENTES */}
                    <button
                      onClick={() => setShowInstructionModal(activeMission)}
                      style={{
                        background: "none",
                        border: "1px dashed #38bdf8",
                        color: "#38bdf8",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                        marginBottom: "16px",
                        fontWeight: "bold",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        width: "100%",
                        justifyContent: "center"
                      }}
                      type="button"
                    >
                      ❓ ¿Cómo usar los mandos de esta tarea?
                    </button>
                    
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fb923c", margin: "14px 0 12px 0", textAlign: "center" }}>
                      👉 Resolvé esta operación:
                    </div>

                    <div style={styles.equationBox}>
                      {currentLevelData.equation}
                    </div>

                    <button
                      onClick={handleCopilotHelpClick}
                      style={styles.yellowNeonHelpBtn}
                      type="button"
                    >
                      💡 CONSULTAR {getMissionRulesName(activeMission).toUpperCase()} (Apoyo N° {((helpsPerMission[activeMission] || 0) % 2) + 1} de 2)
                    </button>

                    {activeMission === "m1" ? (
                      <M1StepperControl
                        equation={currentLevelData.equation}
                        options={currentLevelData.options}
                        handleOptionClick={handleOptionClick}
                        selectedOption={selectedOption}
                      />
                    ) : activeMission === "m2" ? (
                      <M2TurbineStepperControl
                        equation={currentLevelData.equation}
                        options={currentLevelData.options}
                        handleOptionClick={handleOptionClick}
                        selectedOption={selectedOption}
                      />
                    ) : (
                      <M3OrbitalConsole
                        options={currentLevelData.options}
                        handleOptionClick={handleOptionClick}
                        selectedOption={selectedOption}
                      />
                    )}

                    {/* Retroalimentación */}
                    {feedback && (
                      <div style={{
                        ...styles.feedbackCard,
                        borderColor: feedback.correct ? "#10b981" : "#fb923c",
                        backgroundColor: feedback.correct ? "rgba(16, 185, 129, 0.08)" : "rgba(251, 146, 60, 0.08)",
                        color: feedback.correct ? "#4ade80" : "#fb923c"
                      }}>
                        <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                          {feedback.correct ? "🛰️ COMBINACIÓN EXITOSA" : "⚠ ADVERTENCIA DE DESVÍO"}
                        </p>
                        <p style={{ fontSize: "13px", margin: "4px 0 0 0", color: "#cbd5e1" }}>{feedback.feedback}</p>

                        {!feedback.correct && feedback.errorCode && (
                          <div style={styles.expertAlert}>
                            <strong>Sugerencia Pedagógica:</strong> {SYSTEM_EXPERT_ALERTS[feedback.errorCode]}
                          </div>
                        )}
                      </div>
                    )}

                    {missionStatus[activeMission] === "completada" && (
                      <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <button onClick={handleRegenerate} style={styles.farmBtn}>
                          🔁 Cargar nuevos números para farmear (hasta {activeMission === 'm4' ? '200' : '100'} XP)
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* MISIÓN DE CIERRE M4 */
                m4StepsData && m4StepsData[stepIndex] && (
                  <div style={{ ...styles.card, border: "2px solid #fb923c" }}>
                    <div style={styles.closingHeader}>
                      <h2 style={{ ...styles.cardTitle, color: "#fb923c" }}>🚀 Misión de Cierre: Trayectoria Final</h2>
                      <span style={styles.badgePill}>PASO {stepIndex + 1} DE 4</span>
                    </div>
                    
                    <h3 style={{ fontSize: "14px", color: suitColor, margin: "0 0 8px 0" }}>{m4StepsData[stepIndex].title}</h3>

                    <div style={styles.m4PromptBox}>
                      {m4StepsData[stepIndex].prompt}
                    </div>

                    <button
                      onClick={handleCopilotHelpClick}
                      style={styles.yellowNeonHelpBtn}
                      type="button"
                    >
                      💡 CONSULTAR {getMissionRulesName("m4").toUpperCase()} (Apoyo N° {((helpsPerMission.m4 || 0) % 2) + 1} de 2)
                    </button>

                    <M4ToggleSwitches
                      options={m4StepsData[stepIndex].options}
                      onConfirm={handleOptionClick}
                      disabled={selectedOption !== null}
                    />

                    {feedback && (
                      <div style={{
                        ...styles.feedbackCard,
                        borderColor: feedback.correct ? "#10b981" : "#fb923c",
                        backgroundColor: feedback.correct ? "rgba(16, 185, 129, 0.08)" : "rgba(251, 146, 60, 0.08)",
                        color: feedback.correct ? "#4ade80" : "#fb923c"
                      }}>
                        <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                          {feedback.correct ? "🛰️ AJUSTE CONFIRMADO" : "⚠ ALERTA DE PRESIÓN"}
                        </p>
                        <p style={{ fontSize: "13px", margin: "4px 0 0 0", color: "#cbd5e1" }}>{feedback.feedback}</p>
                        
                        {!feedback.correct && feedback.errorCode && (
                          <div style={styles.expertAlert}>
                            <strong>Sugerencia Pedagógica:</strong> {SYSTEM_EXPERT_ALERTS[feedback.errorCode]}
                          </div>
                        )}

                        {feedback.correct && (
                          <button onClick={handleNextStepM4} style={styles.btnPrimary}>
                            {stepIndex < 3 ? "Avanzar al Siguiente Paso ➔" : "Aterrizar Nave e Inscribir Insignia 🏆"}
                          </button>
                        )}
                      </div>
                    )}

                    {badgeEarned && (
                      <div style={styles.rewardCard}>
                        <h3 style={{ color: "#fb923c", margin: "0 0 4px 0" }}>🌌 PRÓXIMA EXPEDICIÓN: El Día 1</h3>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px 0" }}>
                          Lengua + Ciencias Naturales + Matemática integradas en una expedición de supervivencia.
                        </p>
                        {!interestLogged ? (
                          <button onClick={handleLogInterest} style={styles.btnInterest}>
                            🚀 ¡Deseo continuar con esta aventura interdisciplinaria!
                          </button>
                        ) : (
                          <div style={styles.interestConfirmed}>
                            ✨ ¡Anotado, tripulante! Registramos tu interés en la base de datos oficial. Te avisaremos cuando se abra la compuerta.
                          </div>
                        )}
                        <div style={{ marginTop: "14px" }}>
                          <button onClick={handleRegenerate} style={styles.farmBtn}>
                            🔁 Re-jugar Misión de Cierre con nuevas coordenadas
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* COLUMNA DERECHA */}
            <div style={styles.bitacoraColumn}>
              <EduBotCopilot
                mood={copilotMood}
                message={copilotMsg}
                onClickHelp={handleCopilotHelpClick}
                errorWarning={errorWarning}
              />

              <div style={styles.bitacoraCard}>
                <div style={styles.bitacoraHeader}>
                  <h3 style={styles.bitacoraTitle}>📋 Telemetría LRS (Cockpit)</h3>
                  <span style={styles.cidiMockLabel}>Vínculo Pilotín</span>
                </div>
                <p style={styles.bitacoraMeta}>
                  Piloto: <strong>{studentNickname}</strong><br />
                  Acceso unificado: <strong>{loginTime}</strong>
                </p>
                <div style={styles.bitacoraConsole}>
                  {bitacora.map((evt, idx) => (
                    <div key={idx} style={styles.consoleRow}>
                      <span style={styles.consoleTime}>[{evt.time}]</span>{" "}
                      <span style={{
                        ...styles.consoleText,
                        color: evt.type === "success" ? "#4ade80" : evt.type === "error" ? "#fb923c" : "#38bdf8"
                      }}>
                        {evt.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📢 CASILLA DE CONSEJOS GRUPALES DE LA PROFE */}
              <div style={styles.teacherAdviceStudentCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "18px" }}>📢</span>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Transmisión de tu Profe en Vivo:
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#f1f5f9", margin: 0, fontStyle: "italic", fontWeight: "bold", lineHeight: "1.4" }}>
                  "{teacherMessage}"
                </p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* CONSOLA DOCENTE */
        <TeacherDashboard 
          students={students} 
          setStudents={setStudents} 
          teacherMessage={teacherMessage}
          setTeacherMessage={setTeacherMessage}
          copyDirectLink={copyDirectLink}
        />
      )}
    </div>
  );
}

// ==========================================
// 📊 PANEL DOCENTE INTERACTIVO
// ==========================================
function TeacherDashboard({ students, setStudents, teacherMessage, setTeacherMessage, copyDirectLink }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [inputMsg, setInputMsg] = useState(teacherMessage);
  const [pedagogicalPopup, setPedagogicalPopup] = useState(null);

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.xp > 0 || s.id === 1).length;
  const badgesAwarded = students.filter(s => s.badgeEarned).length;
  const partPercentage = totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0;
  const badgePercentage = totalStudents ? Math.round((badgesAwarded / totalStudents) * 100) : 0;

  const errorsCount = {
    ERR_DIRECT: students.filter(s => s.missions.m1.lastErrorCode === "ERR_DIRECT" || s.missions.m2.lastErrorCode === "ERR_DIRECT").length,
    ERR_PARTIAL: students.filter(s => s.missions.m2.lastErrorCode === "ERR_PARTIAL" || s.missions.m1.lastErrorCode === "ERR_PARTIAL").length,
    ERR_LCD: students.filter(s => s.missions.m3.lastErrorCode === "ERR_LCD" || s.missions.m4.lastErrorCode === "ERR_LCD").length,
    ERR_COMPARE: students.filter(s => s.missions.m4.lastErrorCode === "ERR_COMPARE").length
  };

  const handleSendMessage = () => {
    setTeacherMessage(inputMsg);
    alert(`📢 Transmisión Colectiva Enviada a las cabinas:

"${inputMsg}"`);
  };

  // FUNCIÓN DE EXPORTACIÓN NATIVA XML SPREADSHEET 2003 (.XLS)
  // Abre directo en Excel o LibreOffice sin pantallas ni asistentes de importación CSV
  const downloadXLS = (filename, dataRows) => {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n' +
              '<?mso-application progid="Excel.Sheet"?>\n' +
              '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n' +
              ' xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
              ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n' +
              ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n' +
              ' xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
              ' <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\n' +
              '  <Author>EduMisión Córdoba</Author>\n' +
              '  <Created>' + new Date().toISOString() + '</Created>\n' +
              ' </DocumentProperties>\n' +
              ' <Worksheet ss:Name="Reporte">\n' +
              '  <Table>\n';

    dataRows.forEach(row => {
      xml += '   <Row>\n';
      row.forEach(val => {
        const escapedVal = String(val)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        const isNum = !isNaN(val) && val !== '' && val !== null;
        const type = isNum ? 'Number' : 'String';
        xml += `    <Cell><Data ss:Type="${type}">${escapedVal}</Data></Cell>\n`;
      });
      xml += '   </Row>\n';
    });

    xml += '  </Table>\n' +
           ' </Worksheet>\n' +
           '</Workbook>\n';

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 📥 EXPORTACIÓN GRUPAL DE CURSO (XLS / CSV)
  const handleExportCourseXLS = () => {
    const rows = [
      ["REPORTE EVALUATIVO DE CURSO - EDUMISIÓN CÓRDOBA"],
      ["Curso:", "1er Año Secundario 'B'"],
      ["Fecha de Exportación:", new Date().toLocaleDateString("es-AR")],
      ["Métricas Colectivas:"],
      ["Alumnos Activos", `${activeStudents} de ${totalStudents} (${partPercentage}%)`],
      ["Insignias de Maestría Acreditadas", `${badgesAwarded} (${badgePercentage}%)`],
      [],
      ["PLANILLA DE TRAYECTORIAS INDIVIDUALES NOMINAL"],
      ["Nombre Alumno", "Nave", "CUIL Ficticio", "Puntos XP", "M1 (Radar)", "M2 (Flujo)", "M3 (Órbita)", "M4 (Cierre)", "Insignia Maestría", "Calificación Borrador LTI (Moodle)"],
      ...students.map(s => [
        s.name,
        "",
        s.uuid.slice(0, 11),
        s.xp,
        s.missions.m1.status === "completado" ? "CONSOLIDADO" : "ACTIVO",
        s.missions.m2.status === "completado" ? "CONSOLIDADO" : (s.missions.m2.status || "BLOQUEADO"),
        s.missions.m3.status === "completado" ? "CONSOLIDADO" : (s.missions.m3.status || "BLOQUEADO"),
        s.missions.m4.status === "completado" ? "CONSOLIDADO" : (s.missions.m4.status || "BLOQUEADO"),
        s.badgeEarned ? "ADQUIRIDA" : "PENDIENTE",
        `${s.xp}/${500} (Borrador)`
      ]),
      [],
      ["DISTRIBUCIÓN DE DESVÍOS DIDÁCTICOS REGISTRADOS"],
      ["Suma Directa (ERR_DIRECT)", `${errorsCount.ERR_DIRECT} alumnos`],
      ["Suma Incompleta (ERR_PARTIAL)", `${errorsCount.ERR_PARTIAL} alumnos`],
      ["MCD Incorrecto (ERR_LCD)", `${errorsCount.ERR_LCD} alumnos`],
      ["Comparación sin base (ERR_COMPARE)", `${errorsCount.ERR_COMPARE} alumnos`]
    ];

    downloadXLS(`reporte_curso_edumision.xls`, rows);
  };

  // 📥 EXPORTACIÓN INDIVIDUAL DE TRAYECTORIA (XLS / CSV)
  const handleExportStudentXLS = (student) => {
    const rows = [
      ["FICHA INDIVIDUAL DE TRAYECTORIA DE APRENDIZAJE"],
      ["Programa:", "EduMisión Córdoba - Pretest"],
      [],
      ["DATOS DEL PILOTO:"],
      ["Nombre Completo:", student.name],
      ["Nave Asignada:", ""],
      ["Identificador CUIL de Tutor (CiDi):", student.uuid],
      ["Experiencia Acumulada:", `${student.xp} / 500 XP`],
      ["Insignia de Fusión Estelar:", student.badgeEarned ? "Acreditada 🏆" : "Pendiente 🔒"],
      [],
      ["ESTADO DE MISIONES:"],
      ["Misión 1: Sintonía Radar", student.missions.m1.status.toUpperCase(), `Intentos: ${student.missions.m1.attempts}`, `Ayudas: ${student.missions.m1.helps || 0}`],
      ["Misión 2: Válvulas de Flujo", student.missions.m2.status.toUpperCase(), `Intentos: ${student.missions.m2.attempts}`, `Ayudas: ${student.missions.m2.helps || 0}`],
      ["Misión 3: Enlace Órbitas", student.missions.m3.status.toUpperCase(), `Intentos: ${student.missions.m3.attempts}`, `Ayudas: ${student.missions.m3.helps || 0}`],
      ["Misión 4: Crucero Final", student.missions.m4.status.toUpperCase(), `Intentos: ${student.missions.m4.attempts}`, `Ayudas: ${student.missions.m4.helps || 0}`],
      ["Justificación de Cierre M4:", student.justificationQuality ? (student.justificationQuality === "Master" ? "CIENTÍFICA (Dominio Alto)" : "INTUITIVA (Aprobado)") : "Pendiente"],
      [],
      ["TELEMETRÍA COMPLEMENTARIA:"],
      ["Errores totales en cabina:", student.errorsCount || 0],
      ["Ayudas solicitadas totales:", student.helpsRequested || 0],
      ["Anomalías de resolución (Fraude/Calculadora):", student.missions.m4.possibleFraud ? "SÍ (Resolución no humana detectada)" : "No detectada"]
    ];

    downloadXLS(`trayectoria_${student.name.replace(/\s+/g, '_')}.xls`, rows);
  };

  // SIMULADOR DE AVANCE RÁPIDO (Modo Pitch - Carga alumnos dinámicos de prueba)
  const handleSimulateClassProgress = () => {
    setStudents((prev) =>
      prev.map((s, idx) => {
        if (s.id === 1) return s; // Conservar al usuario real
        // Generar avance aleatorio
        const completedM1 = Math.random() > 0.1;
        const completedM2 = completedM1 && Math.random() > 0.2;
        const completedM3 = completedM2 && Math.random() > 0.3;
        const completedM4 = completedM3 && Math.random() > 0.4;

        return {
          ...s,
          xp: completedM4 ? 500 : completedM3 ? 450 : completedM2 ? 250 : completedM1 ? 100 : 0,
          badgeEarned: completedM4,
          errorsCount: Math.floor(Math.random() * 5),
          helpsRequested: Math.floor(Math.random() * 3),
          missions: {
            m1: { status: completedM1 ? "completado" : "activa", attempts: completedM1 ? 1 : 0, lastErrorCode: completedM1 ? null : "ERR_DIRECT", helps: completedM1 ? 0 : 1, errors: completedM1 ? 0 : 1 },
            m2: { status: completedM2 ? "completado" : (completedM1 ? "activa" : "bloqueada"), attempts: completedM2 ? 1 : 0, lastErrorCode: completedM2 ? null : "ERR_PARTIAL", helps: completedM2 ? 0 : 0, errors: completedM2 ? 0 : 1 },
            m3: { status: completedM3 ? "completado" : (completedM2 ? "activa" : "bloqueada"), attempts: completedM3 ? 2 : 0, lastErrorCode: completedM3 ? null : "ERR_LCD", helps: completedM3 ? 1 : 0, errors: completedM3 ? 1 : 0 },
            m4: { status: completedM4 ? "completado" : (completedM3 ? "activa" : "bloqueada"), attempts: completedM4 ? 1 : 0, lastErrorCode: completedM4 ? null : "ERR_COMPARE", helps: completedM4 ? 0 : 0, errors: completedM4 ? 0 : 0 }
          },
          justificationQuality: completedM4 ? (Math.random() > 0.5 ? "Master" : "Intuitive") : null
        };
      })
    );
    alert("🤖 ¡Clase simulada con éxito! Roster y desvíos actualizados en tiempo real para tu defensa del proyecto.");
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <div>
          <h1 style={styles.dashboardTitle}>Consola de Monitoreo de Aprendizaje</h1>
          <p style={styles.dashboardSubtitle}>Módulo Pilotín de Primer Año · Diagnóstico Matemático Situado</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>

          <button onClick={handleExportCourseXLS} style={{ ...styles.linkShareBtn, borderColor: "#10b981", color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.08)" }} title="Descargar planilla Excel de todo el curso">
            📥 Descargar Registro de Curso (XLS)
          </button>
          <button onClick={() => copyDirectLink("alumno")} style={styles.linkShareBtn}>
            📋 Link Chicos
          </button>
          <span style={styles.teacherBadge}>👩‍🏫 DOCENTE AUTENTICADA</span>
        </div>
      </header>

      {/* KPI GRID CON TIME-LAPSE INTEGRADO */}
      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #8b5cf6" }}>
          <p style={styles.kpiLabel}>🔵 % PARTICIPACIÓN</p>
          <p style={{ ...styles.kpiValue, color: "#c084fc" }}>{partPercentage}%</p>
          <div style={styles.kpiSub}>Evolución: {partPercentage}% activos en el hogar</div>
        </div>

        {/* 📊 GRÁFICO TERMÓMETRO DE FRUSTRACIÓN (ACIERTOS VS ERRORES) EN CABECERA */}
        <div style={{ ...styles.kpiCard, gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={styles.kpiLabel}>🌡️ TERMÓMETRO DE CLIMA DE FRUSTRACIÓN DEL AULA (ACIERTOS VS DESVÍOS)</p>
            <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: "bold" }}>EN TIEMPO REAL</span>
          </div>
          
          {(() => {
            const totalMissionsCompleted = students.reduce((acc, s) => {
              let count = 0;
              if (s.missions.m1.status === "completado") count++;
              if (s.missions.m2.status === "completado") count++;
              if (s.missions.m3.status === "completado") count++;
              if (s.missions.m4.status === "completado") count++;
              return acc + count;
            }, 0);
            
            const totalClassErrors = students.reduce((acc, s) => acc + (s.errorsCount || 0), 0);
            const totalSum = totalMissionsCompleted + totalClassErrors || 1;
            const aciertosPct = Math.round((totalMissionsCompleted / totalSum) * 100);
            const erroresPct = 100 - aciertosPct;
            
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", height: "20px", borderRadius: "10px", overflow: "hidden", border: "1px solid #334155" }}>
                  <div style={{ width: `${aciertosPct}%`, backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#000000", fontWeight: "bold" }}>
                    {aciertosPct > 15 ? `Aciertos: ${aciertosPct}%` : ""}
                  </div>
                  <div style={{ width: `${erroresPct}%`, backgroundColor: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#000000", fontWeight: "bold" }}>
                    {erroresPct > 15 ? `Desvíos: ${erroresPct}%` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", fontWeight: "bold" }}>
                  <span>🟢 Misiones Resueltas: {totalMissionsCompleted}</span>
                  <span>🟠 Errores Cometidos: {totalClassErrors}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* FICHA PEDAGÓGICA POPUP */}
      {pedagogicalPopup && (
        <div style={styles.parentModalOverlay} onClick={() => setPedagogicalPopup(null)}>
          <div style={{ ...styles.parentModalCard, maxWidth: "580px", textAlign: "left" }} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8", justifyContent: "space-between" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>📖 FICHA PEDAGÓGICA OFICIAL</span>
              <button onClick={() => setPedagogicalPopup(null)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "26px", cursor: "pointer" }}>×</button>
            </div>
            <h3 style={{ color: "#ffffff", fontSize: "18px", margin: "14px 0 6px 0", fontWeight: "bold" }}>{pedagogicalPopup.title}</h3>
            <p style={{ fontSize: "14px", color: "#a78bfa", fontWeight: "900", margin: "0 0 14px 0" }}>Diseño curricular: {pedagogicalPopup.curriculum}</p>
            
            <div style={{ backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #334155", fontSize: "15px", color: "#cbd5e1", marginBottom: "14px", lineHeight: "1.5" }}>
              <strong style={{ color: "#38bdf8" }}>Objetivo didáctico:</strong> {pedagogicalPopup.objective}
            </div>

            <h4 style={{ fontSize: "14px", color: "#fb923c", textTransform: "uppercase", margin: "14px 0 6px 0", fontWeight: "bold" }}>Acciones Puntuales de Cabina:</h4>
            <p style={{ fontSize: "15px", color: "#ffffff", margin: 0, lineHeight: "1.5", backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" }}>
              {pedagogicalPopup.actions}
            </p>
          </div>
        </div>
      )}

      {/* TRANSMISIÓN DE CONSEJOS COLECTIVOS */}
      <div style={styles.dashboardTeacherControlsCard}>
        <h3 style={{ ...styles.cardSectionTitle, color: "#c084fc", margin: 0 }}>📢 Transmitir Consejos Colectivos en Vivo</h3>
        <p style={{ ...styles.instructions, margin: 0 }}>
          Escribí sugerencias pedagógicas. Aparecerán de forma inmediata en las cabinas de vuelo de todos tus alumnos conectados.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <input 
            type="text" 
            value={inputMsg} 
            onChange={(e) => setInputMsg(e.target.value)} 
            placeholder="Ej: ¡Tripulantes, recuerden usar lápiz y papel para unificar las bases antes de acelerar!"
            style={styles.teacherDashboardInput}
          />
          <button onClick={handleSendMessage} style={styles.teacherDashboardSendBtn}>
            Transmitir Consejo
          </button>
        </div>
      </div>

      <div style={styles.dashboardGrid}>
        <div style={styles.leftColumn}>
          <div style={styles.dashboardCard}>
            <h3 style={styles.cardSectionTitle}>Listado General de Alumnos</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Alumno (Nave)</th>
                  
                  {/* Columnas clickeables para abrir ficha pedagógica */}
                  <th style={{ ...styles.th, fontSize: "12px" }}>
                    M1 (Radar) <br />
                    <span style={{ cursor: "pointer", color: "#38bdf8", textDecoration: "underline", fontSize: "13px", fontWeight: "bold" }} onClick={() => setPedagogicalPopup(MISSION_PEDAGOGICAL_INFO.m1)}>[ Ver ]</span>
                  </th>
                  <th style={{ ...styles.th, fontSize: "12px" }}>
                    M2 (Combust.) <br />
                    <span style={{ cursor: "pointer", color: "#38bdf8", textDecoration: "underline", fontSize: "13px", fontWeight: "bold" }} onClick={() => setPedagogicalPopup(MISSION_PEDAGOGICAL_INFO.m2)}>[ Ver ]</span>
                  </th>
                  <th style={{ ...styles.th, fontSize: "12px" }}>
                    M3 (Órbita) <br />
                    <span style={{ cursor: "pointer", color: "#38bdf8", textDecoration: "underline", fontSize: "13px", fontWeight: "bold" }} onClick={() => setPedagogicalPopup(MISSION_PEDAGOGICAL_INFO.m3)}>[ Ver ]</span>
                  </th>
                  <th style={{ ...styles.th, fontSize: "12px" }}>
                    M4 (Cierre) <br />
                    <span style={{ cursor: "pointer", color: "#38bdf8", textDecoration: "underline", fontSize: "13px", fontWeight: "bold" }} onClick={() => setPedagogicalPopup(MISSION_PEDAGOGICAL_INFO.m4)}>[ Ver ]</span>
                  </th>
                  
                  <th style={styles.th}>Justif. M4</th>
                  <th style={styles.th}>Fase 2</th>
                  <th style={styles.th}>Energía</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "bold", color: "#ffffff" }}>
                      {student.name} <br />
                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>🚀 {""}</span>
                    </td>
                    <td style={styles.td}>{renderMissionCell(student, "m1")}</td>
                    <td style={styles.td}>{renderMissionCell(student, "m2")}</td>
                    <td style={styles.td}>{renderMissionCell(student, "m3")}</td>
                    <td style={styles.td}>{renderMissionCell(student, "m4")}</td>
                    <td style={styles.td}>
                      {student.justificationQuality ? (
                        <span style={justificationLabelStyle(student.justificationQuality)}>
                          {student.justificationQuality === "Master" ? "🎓 CIENTÍFICA" : "🧠 INTUITIVA"}
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 'bold' }}>PENDIENTE</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {student.interestRegistered ? (
                        <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold" }}>✅ INTERESADO</span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#64748b" }}>—</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: "#38bdf8" }}>{student.xp} XP</strong>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setSelectedStudent(student)} style={styles.btnTableAction}>
                          Analizar
                        </button>
                        <button onClick={() => handleExportStudentXLS(student)} style={{ ...styles.btnTableAction, backgroundColor: "#1e3a24", color: "#4ade80" }} title="Descargar XLS individual">
                          📥
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIAGNÓSTICO COLECTIVO */}
        <div style={styles.rightColumn}>
          <div style={styles.dashboardCard}>
            <h3 style={styles.cardSectionTitle}>Diagnóstico Colectivo (Sistema Experto)</h3>
            <p style={styles.instructions}>
              El motor agrupa automáticamente los desvíos matemáticos detectados en el piloto para facilitar la intervención pedagógica.
            </p>

            <div style={styles.alertsContainer}>
              <div style={{
                ...styles.alertBox,
                borderColor: errorsCount.ERR_DIRECT > 0 ? "#fb923c" : "#1e293b",
                backgroundColor: errorsCount.ERR_DIRECT > 0 ? "rgba(251,146,60,0.05)" : "transparent"
              }}>
                <div style={styles.alertHeader}>
                  <span style={errorsCount.ERR_DIRECT > 0 ? styles.alertTitleActive : styles.alertTitleInactive}>
                    ⚠ Suma Directa de Fracciones (ERR_DIRECT)
                  </span>
                  <span style={styles.alertBadge}>{errorsCount.ERR_DIRECT} Alumnos</span>
                </div>
                {errorsCount.ERR_DIRECT > 0 && (
                  <p style={styles.alertDesc}>{SYSTEM_EXPERT_ALERTS.ERR_DIRECT}</p>
                )}
              </div>

              <div style={{
                ...styles.alertBox,
                borderColor: errorsCount.ERR_LCD > 0 ? "#fb923c" : "#1e293b",
                backgroundColor: errorsCount.ERR_LCD > 0 ? "rgba(251,146,60,0.05)" : "transparent"
              }}>
                <div style={styles.alertHeader}>
                  <span style={errorsCount.ERR_LCD > 0 ? styles.alertTitleActive : styles.alertTitleInactive}>
                    🧩 Mínimo Común Denominador Incorrecto (ERR_LCD)
                  </span>
                  <span style={styles.alertBadge}>{errorsCount.ERR_LCD} Alumnos</span>
                </div>
                {errorsCount.ERR_LCD > 0 && (
                  <p style={styles.alertDesc}>{SYSTEM_EXPERT_ALERTS.ERR_LCD}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <DrawerWithSendButton 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          SYSTEM_EXPERT_ALERTS={SYSTEM_EXPERT_ALERTS}
        />
      )}
    </div>
  );
}

// ==========================================
// 🎨 AUXILIARES DE ESTILOS Y TABLAS
// ==========================================
function getMissionBackground(view, activeMission) {
  let bg = "radial-gradient(circle at 50% 10%, #0c1a3d 0%, #030818 45%, #020308 90%)";

  if (view === "docente") {
    bg = "radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0b091e 50%, #020208 100%)";
  } else {
    if (activeMission === "m1") {
      bg = "radial-gradient(circle at 50% 15%, #032b43 0%, #021422 45%, #01060a 100%)";
    } else if (activeMission === "m2") {
      bg = "radial-gradient(circle at 50% 15%, #2a0845 0%, #150526 45%, #03020a 100%)";
    } else if (activeMission === "m3") {
      bg = "radial-gradient(circle at 50% 15%, #052e2b 0%, #021715 45%, #010807 100%)";
    } else if (activeMission === "m4") {
      bg = "radial-gradient(circle at 50% 15%, #3d1c04 0%, #1a0c02 45%, #050200 100%)";
    }
  }

  return {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "0 10px 20px 0",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: "#020308",
    backgroundImage: bg,
    color: "#cbd5e1",
    minHeight: "100vh",
    transition: "background-image 0.6s ease"
  };
}

function justificationLabelStyle(quality) {
  let color = "#cbd5e1";
  let bg = "rgba(148, 163, 184, 0.1)";

  if (quality === "Master" || quality === "Intuitive") {
    color = "#4ade80";
    bg = "rgba(16, 185, 129, 0.15)";
  } else if (quality === "Failed") {
    color = "#fb923c";
    bg = "rgba(251, 146, 60, 0.15)";
  }

  return {
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: bg,
    color: color
  };
}

function renderMissionCell(student, mKey) {
  const mData = student.missions[mKey];
  const status = mData ? mData.status : "no_iniciado";
  const attempts = mData ? mData.attempts : 0;
  const helps = mData ? (mData.helps || 0) : 0;
  const errors = mData ? (mData.errors || 0) : 0;

  let bgColor = "rgba(30, 41, 59, 0.3)";
  let borderColor = "#1e293b";
  let textColor = "#cbd5e1";
  let hasActivity = status === "completado" || status === "completada" || status === "activa" || attempts > 0;

  if (status === "completado" || status === "completada") {
    bgColor = "rgba(16, 185, 129, 0.15)";
    borderColor = "#10b981";
    textColor = "#4ade80";
  } else if (hasActivity) {
    bgColor = "rgba(251, 146, 60, 0.15)";
    borderColor = "#fb923c";
    textColor = "#fb923c";
  } else if (status === "bloqueada" || status === "bloqueado") {
    bgColor = "rgba(148, 163, 184, 0.03)";
    borderColor = "#1e293b";
    textColor = "#64748b";
  }

  const cellStyle = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
    color: textColor,
    display: "inline-flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "70px",
    fontSize: "12px",
    fontWeight: "bold"
  };

  if (!hasActivity) {
    return (
      <span style={{ ...cellStyle, color: "#475569", border: "1px dashed #1e293b", minWidth: "50px" }}>
        —
      </span>
    );
  }

  return (
    <div style={cellStyle}>
      <span title="Ayudas utilizadas">💡 {helps}</span>
      <span style={{ color: "#fb923c" }} title="Errores cometidos">✖ {errors}</span>
    </div>
  );
}

// ==========================================
// 📬 COMPONENTE: FICHA INDIVIDUAL RESPONSIVA (CELULARES HORIZONTALES)
// ==========================================
function DrawerWithSendButton({ student, onClose, SYSTEM_EXPERT_ALERTS }) {
  const [emailSent, setEmailSent] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Detección en vivo de orientación del celular (altura reducida < 550px)
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerHeight < 550 || window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStudentPrimaryDesvio = (s) => {
    if (s.missions.m4.lastErrorCode) return s.missions.m4.lastErrorCode;
    if (s.missions.m3.lastErrorCode) return s.missions.m3.lastErrorCode;
    if (s.missions.m2.lastErrorCode) return s.missions.m2.lastErrorCode;
    if (s.missions.m1.lastErrorCode) return s.missions.m1.lastErrorCode;
    return null;
  };

  const primaryDesvio = getStudentPrimaryDesvio(student);
  let aulaAdvice = "";
  let padresAdvice = "";
  let performanceTitle = "Progreso Regular";
  let performanceColor = "#cbd5e1";

  const hasBadge = student.badgeEarned || student.xp === 500;

  if (hasBadge) {
    if (student.errorsCount === 0) {
      performanceTitle = "Domina sin errores (Master Absoluto)";
      performanceColor = "#10b981";
      aulaAdvice = "El alumno ha alcanzado un dominio conceptual perfecto y sin cometer desvíos. No requiere intervención en clase; continúe motivándolo con desafíos avanzados.";
      padresAdvice = "¡Felicitaciones! Su hijo/a completó todos los desafíos espaciales de fracciones con precisión absoluta y sin un solo error. Demuestra una gran comprensión.";
    } else {
      performanceTitle = "Domina con errores (Dominio Resiliente)";
      performanceColor = "#10b981";
      aulaAdvice = "El alumno logró de forma resiliente consolidar el aprendizaje y dominar el concepto formal, superando los desvíos previos en la bitácora mediante la práctica y la retroalimentación.";
      padresAdvice = "Su hijo/a superó las misiones demostrando perseverancia. Aunque al principio tuvo desvíos, logró corregirse y completó todo con éxito de forma resiliente.";
    }
  } else if (primaryDesvio) {
    performanceTitle = `Alerta: ${translateDesvio(primaryDesvio)}`;
    performanceColor = "#fb923c";

    if (primaryDesvio === "ERR_DIRECT") {
      aulaAdvice = SYSTEM_EXPERT_ALERTS.ERR_DIRECT;
      padresAdvice = "🍳 Actividad para el hogar: midan 1/2 taza de leche y luego 1/4 taza en el mismo vaso medidor. Comprueben juntos que el volumen sube a 3/4, no que 'se achica' el resultado.";
    } else if (primaryDesvio === "ERR_PARTIAL") {
      aulaAdvice = "🛠️ Propuesta para el aula presencial: refuerce con conteo dual (dos manos, una fracción en cada una) antes de pasar a la notación simbólica.";
      padresAdvice = "🥧 Actividad para el hogar: corten una fruta en partes iguales, aparten la porción de cada fracción por separado y luego júntenlas físicamente en un plato.";
    } else if (primaryDesvio === "ERR_LCD") {
      aulaAdvice = "🛠️ Propuesta para el aula presencial: trabaje la tabla de múltiplos de ambos denominadores en paralelo en el pizarrón antes de introducir fórmulas directas.";
      padresAdvice = "🧩 Actividad para el hogar: con dos tableros de Lego de tamaños distintos, busquen juntos el largo más chico donde ambos encajan un número entero de veces.";
    } else if (primaryDesvio === "ERR_COMPARE") {
      aulaAdvice = "🛠️ Propuesta para el aula presencial: antes de comparar dos fracciones con distinto denominador, pida siempre convertirlas al mismo denominador.";
      padresAdvice = "🥤 Actividad para el hogar: sirvan 2/3 de un vaso de jugo y 3/4 de otro idéntico. Pregúntenle cuál tiene más antes de medir y verifiquen juntos.";
    }
  } else {
    aulaAdvice = "El alumno avanza de forma regular dentro de la trayectoria espacial de aprendizaje.";
    padresAdvice = "Acompañen el esfuerzo de su hijo/a en casa y anímenlo/a a seguir completando las misiones pendientes.";
  }

  const handleSendToParents = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 4000);
  };

  // AJUSTE DE ESTILO DE CAJÓN: En celulares horizontales se vuelve modal superpuesto centrado
  const responsiveDrawerStyle = isLandscape
    ? {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "480px",
        height: "85vh",
        backgroundColor: "#070c22",
        borderRadius: "16px",
        border: "2px solid #8b5cf6",
        boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
        overflowY: "auto",
        zIndex: 10002
      }
    : styles.drawer; // En vertical se queda como Drawer a la derecha normal

  return (
    <div style={styles.drawerOverlay} onClick={onClose}>
      <div style={responsiveDrawerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.drawerTitle}>Análisis: {student.name}</h2>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.drawerBody}>
          <div style={styles.profileSection}>
            <p style={{ margin: "0 0 6px 0" }}>Nave: <strong>🚀 {""}</strong></p>
            <p style={{ margin: "0 0 6px 0" }}>CUIL Familiar: <code style={{ color: "#c084fc" }}>{student.uuid.slice(0, 8)}...</code></p>
            <p style={{ margin: "0 0 6px 0" }}>Desempeño: <strong style={{ color: performanceColor }}>{performanceTitle}</strong></p>
            <p style={{ margin: "0 0 6px 0" }}>Experiencia Acumulada: <strong>{student.xp} / 500 XP</strong></p>
            <p style={{ margin: "0" }}>Ayudas / Errores: 💡 <strong>{student.helpsRequested || 0}</strong> | ✖ <strong style={{ color: '#fb923c' }}>{student.errorsCount || 0}</strong></p>
          </div>

          {/* ⚠️ ALERTA INTERNA DE SOSPECHA DE FRAUDE (SÓLO VISIBLE AL DOCENTE) */}
          {student.missions.m4?.possibleFraud && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              borderLeft: "4px solid #ef4444",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px"
            }}>
              <h5 style={{ color: "#ef4444", margin: "0 0 4px 0", fontSize: "12px", fontWeight: "900" }}>⚠️ ALERTA DE CABINA (FRAUDE DETECTADO)</h5>
              <p style={{ fontSize: "11px", color: "#fca5a5", margin: 0, lineHeight: "1.4" }}>
                La consola de cierre M4 se resolvió en menos de 15 segundos. Esto indica una velocidad de cálculo no humana, sugiriendo el uso de calculadora o asistencia externa de un tutor/padre.
              </p>
            </div>
          )}

          <h4 style={{ ...styles.drawerSectionTitle, color: "#10b981" }}>👩‍🏫 Consejo para el Aula (Docente)</h4>
          <div style={{ borderLeft: "4px solid #10b981", backgroundColor: "rgba(16, 185, 129, 0.05)", padding: "12px", borderRadius: "6px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", margin: 0, lineHeight: "1.5", color: "#cbd5e1" }}>{aulaAdvice}</p>
          </div>

          <h4 style={{ ...styles.drawerSectionTitle, color: "#8b5cf6" }}>🏠 Consejo para la Familia (Hogar)</h4>
          <div style={{ borderLeft: "4px solid #8b5cf6", backgroundColor: "rgba(139, 92, 246, 0.05)", padding: "12px", borderRadius: "6px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", margin: 0, lineHeight: "1.5", color: "#cbd5e1" }}>{padresAdvice}</p>
          </div>

          <button onClick={handleSendToParents} style={styles.btnSendToCiDi}>
            ✉️ Enviar consejos directo a la familia
          </button>

          {emailSent && (
            <div style={styles.sentNotification}>
              ✨ ¡Enviado! Los consejos pedagógicos fueron notificados al Domicilio Electrónico de los padres en Ciudadano Digital (CiDi).
            </div>
          )}

          {isLandscape && (
            <button onClick={onClose} style={{ ...styles.btnPrimary, backgroundColor: "#334155", color: "#ffffff", marginTop: "16px" }}>
              ✕ Volver al Listado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🎨 ESTILOS GENERALES (Neon Space Tech)
// ==========================================
const styles = {
  parentModalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(2, 3, 8, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
  parentModalCard: { width: "100%", maxWidth: "520px", backgroundColor: "#080d24", borderRadius: "16px", border: "2px solid #38bdf8", padding: "20px 24px", boxShadow: "0 0 30px rgba(56, 189, 248, 0.35)", textAlign: "center", color: "#cbd5e1" },
  parentModalTitle: { color: "#38bdf8", fontSize: "20px", fontWeight: "900", marginBottom: "12px", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  rulesList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px", textAlign: "left" },
  ruleItem: { display: "flex", gap: "10px", backgroundColor: "#02040e", padding: "8px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "15px", alignItems: "center" },
  ruleIcon: { fontSize: "18px" },
  parentModalBtn: { width: "100%", padding: "12px", backgroundColor: "#38bdf8", color: "#020308", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "13px", boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)" },
  copyToastCard: { position: "fixed", top: "20px", right: "20px", backgroundColor: "#10b981", color: "#021715", padding: "10px 18px", borderRadius: "8px", fontWeight: "900", fontSize: "12px", boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)", zIndex: 10000 },
  navBar: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#070c22", padding: "10px 20px", borderBottom: "1px solid #1e293b", marginBottom: "16px", flexWrap: "wrap", gap: "10px" },
  navLogo: { fontWeight: "bold", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" },
  navLogoEll: { backgroundColor: "#38bdf8", color: "#020308", padding: "4px 8px", fontWeight: "900", borderRadius: "4px", fontSize: "12px" },
  linkShareBtn: { backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid #38bdf8", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" },
  linkShareBtnDocente: { backgroundColor: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid #c084fc", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" },
  activeTabBtn: { backgroundColor: "#1e3a8a", color: "#38bdf8", border: "1px solid #38bdf8", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" },
  inactiveTabBtn: { backgroundColor: "transparent", color: "#64748b", border: "1px solid #1e293b", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" },
  gameWrapper: { padding: "10px" },
  gameHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "20px" },
  gameTitle: { fontSize: "22px", margin: 0, fontWeight: "bold" },
  gameSubtitle: { fontSize: "14px", margin: "4px 0 0 0", color: "#94a3b8" },
  sessionStatus: { display: "flex", gap: "8px" },
  activePill: { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#4ade80", padding: "6px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", border: "1px solid #10b981" },
  timerPill: { backgroundColor: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", padding: "6px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", border: "1px solid #64748b" },
  progressionCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "16px", border: "1px solid #1e293b", marginBottom: "20px" },
  xpHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  xpBigLabel: { fontSize: "14px", color: "#cbd5e1", fontWeight: "bold" },
  xpBigValue: { fontSize: "24px", fontWeight: "900", color: "#38bdf8", textShadow: "0 0 10px rgba(56, 189, 248, 0.5)" },
  progressBarBg: { height: "26px", backgroundColor: "#02040e", borderRadius: "13px", overflow: "hidden", border: "2px solid #334155", boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)", marginBottom: "16px" },
  progressBarFill: { height: "100%", borderRadius: "13px", transition: "width 0.5s ease-in-out", background: "linear-gradient(90deg, #10b981, #38bdf8)" },
  glowingInsigniaCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", backgroundColor: "rgba(251, 146, 60, 0.05)", border: "2px solid #fb923c", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 0 20px rgba(251, 146, 60, 0.3)" },
  insigniaTitle: { color: "#fb923c", fontWeight: "900", fontSize: "15px", letterSpacing: "1px", textTransform: "uppercase" },
  insigniaSubtitle: { color: "#94a3b8", fontSize: "13px", fontWeight: "bold", marginTop: "2px" },
  tacticalMap: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" },
  tacticalNode: (isAct, status) => ({ backgroundColor: isAct ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 4, 14, 0.7)", border: `1px solid ${isAct ? "#38bdf8" : status === "completada" ? "#10b981" : "#1e293b"}`, borderRadius: "8px", padding: "12px 10px", textAlign: "left", cursor: status === "bloqueada" ? "not-allowed" : "pointer", opacity: status === "bloqueada" ? 0.4 : 1, boxShadow: isAct ? "0 0 12px rgba(56, 189, 248, 0.3)" : "none" }),
  tacticalNodeM4: (isAct, status) => ({ backgroundColor: isAct ? "rgba(251, 146, 60, 0.2)" : "rgba(2, 4, 14, 0.7)", border: `2px solid ${isAct ? "#fb923c" : status === "completada" ? "#10b981" : "rgba(251, 146, 60, 0.6)"}`, borderRadius: "8px", padding: "12px 10px", textAlign: "left", cursor: status === "bloqueada" ? "not-allowed" : "pointer", opacity: status === "bloqueada" ? 0.4 : 1, boxShadow: isAct ? "0 0 15px rgba(251, 146, 60, 0.4)" : "none" }),
  tacticalNodeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusPill: (st) => ({ fontSize: "13px", fontWeight: "900", color: st === "completada" ? "#4ade80" : st === "bloqueada" ? "#64748b" : "#38bdf8" }),
  mainLayout: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" },
  gameColumn: { display: "flex", flexDirection: "column", gap: "10px" },
  card: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "20px", border: "1px solid #1e293b" },
  cardTitle: { fontSize: "16px", margin: "0 0 8px 0", textTransform: "uppercase" },
  instructions: { fontSize: "16px", color: "#94a3b8", lineHeight: "1.4", marginBottom: "12px" },
  equationBox: { backgroundColor: "#02040e", padding: "16px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center", fontSize: "36px", fontWeight: "bold", color: "#ffffff", marginBottom: "14px" },
  feedbackCard: { padding: "12px", borderRadius: "6px", border: "1px solid", marginTop: "12px" },
  expertAlert: { fontSize: "14px", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px", marginTop: "6px", color: "#cbd5e1", lineHeight: "1.4" },
  farmBtn: { padding: "10px 18px", backgroundColor: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", boxShadow: "0 0 10px rgba(56, 189, 248, 0.3)" },
  closingHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  badgePill: { backgroundColor: "rgba(251, 146, 60, 0.1)", color: "#fb923c", border: "1px solid #fb923c", padding: "3px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" },
  m4PromptBox: { backgroundColor: "#02040e", padding: "16px", borderRadius: "8px", border: "1px solid #fb923c", fontSize: "15px", color: "#ffffff", marginBottom: "12px", lineHeight: "1.6", letterSpacing: "0.4px" },
  btnPrimary: { width: "100%", padding: "10px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", fontSize: "12px" },
  rewardCard: { marginTop: "16px", padding: "16px", backgroundColor: "rgba(139, 92, 246, 0.08)", border: "2px solid #8b5cf6", borderRadius: "10px", textAlign: "center" },
  btnInterest: { width: "100%", padding: "12px", backgroundColor: "#8b5cf6", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" },
  interestConfirmed: { padding: "10px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#4ade80", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
  bitacoraColumn: { display: "flex", flexDirection: "column" },
  bitacoraCard: { backgroundColor: "rgba(5, 9, 28, 0.75)", borderRadius: "10px", padding: "14px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", maxHeight: "250px", marginBottom: "14px" },
  bitacoraHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "6px", marginBottom: "8px" },
  bitacoraTitle: { fontSize: "11px", margin: 0, color: "#4ade80", fontWeight: "bold" },
  cidiMockLabel: { fontSize: "9px", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "4px", border: "1px solid #38bdf8" },
  bitacoraMeta: { fontSize: "10px", color: "#64748b", margin: "0 0 8px 0", lineHeight: "1.3" },
  bitacoraConsole: { backgroundColor: "#02040e", borderRadius: "6px", padding: "8px", fontFamily: "monospace", fontSize: "10px", overflowY: "auto", flex: 1, border: "1px solid #111827" },
  consoleRow: { marginBottom: "4px", lineHeight: "1.3" },
  consoleTime: { color: "#64748b" },
  teacherAdviceStudentCard: { backgroundColor: "rgba(139, 92, 246, 0.08)", border: "1px solid #8b5cf6", borderRadius: "10px", padding: "12px 14px", boxShadow: "0 0 10px rgba(139, 92, 246, 0.15)" },
  dashboardContainer: { padding: "10px" },
  dashboardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "20px" },
  dashboardTitle: { fontSize: "20px", margin: 0, color: "#38bdf8", fontWeight: "bold" },
  dashboardSubtitle: { fontSize: "12px", margin: "4px 0 0 0", color: "#64748b" },
  teacherBadge: { padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid #38bdf8" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" },
  kpiCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b" },
  kpiLabel: { fontSize: "10px", color: "#cbd5e1", margin: 0, fontWeight: "bold" },
  kpiValue: { fontSize: "30px", fontWeight: "bold", color: "#ffffff", margin: "4px 0" },
  kpiSub: { fontSize: "10px", color: "#94a3b8", fontWeight: "600" },
  dashboardTeacherControlsCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", border: "2px solid #8b5cf6", borderRadius: "10px", padding: "16px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  teacherDashboardInput: { flex: 1, padding: "10px 14px", backgroundColor: "#02040e", border: "1px solid #334155", borderRadius: "6px", color: "#cbd5e1", fontSize: "13px" },
  teacherDashboardSendBtn: { backgroundColor: "#8b5cf6", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" },
  dashboardGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" },
  leftColumn: {},
  rightColumn: {},
  dashboardCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "16px", border: "1px solid #1e293b" },
  cardSectionTitle: { fontSize: "13px", margin: "0 0 12px 0", color: "#38bdf8", textTransform: "uppercase" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderRow: { borderBottom: "1px solid #1e293b", textAlign: "left" },
  th: { padding: "8px", fontSize: "10px", color: "#64748b", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { padding: "8px", fontSize: "12px" },
  btnTableAction: { padding: "4px 10px", fontSize: "10px", borderRadius: "4px", border: "none", backgroundColor: "#1e3a8a", color: "#38bdf8", cursor: "pointer", fontWeight: "bold" },
  alertsContainer: { display: "flex", flexDirection: "column", gap: "12px" },
  alertBox: { padding: "12px", borderRadius: "6px", border: "1px solid" },
  alertHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  alertTitleActive: { fontWeight: "bold", color: "#fb923c", fontSize: "12px" },
  alertTitleInactive: { color: "#64748b", fontSize: "12px" },
  alertBadge: { fontSize: "10px", backgroundColor: "#1e293b", color: "#cbd5e1", padding: "2px 6px", borderRadius: "4px" },
  alertDesc: { fontSize: "11px", margin: "6px 0 0 0", lineHeight: "1.4", color: "#cbd5e1" },
  drawerOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end", zIndex: 10000 },
  drawer: { width: "360px", height: "100%", backgroundColor: "#070c22", padding: "20px", boxSizing: "border-box", borderLeft: "1px solid #1e293b", overflowY: "auto" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "16px" },
  drawerTitle: { fontSize: "16px", margin: 0, color: "#38bdf8" },
  btnClose: { background: "none", border: "none", fontSize: "22px", color: "#64748b", cursor: "pointer" },
  drawerBody: {},
  profileSection: { backgroundColor: "#02040e", padding: "12px", borderRadius: "6px", border: "1px solid #1e293b", fontSize: "11px", marginBottom: "16px" },
  drawerSectionTitle: { fontSize: "12px", color: "#38bdf8", margin: "16px 0 8px 0", textTransform: "uppercase" },
  btnSendToCiDi: { width: "100%", padding: "12px", backgroundColor: "#8b5cf6", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  sentNotification: { marginTop: "12px", padding: "10px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "6px", color: "#4ade80", fontSize: "11px", fontWeight: "bold", textAlign: "center" }
};
