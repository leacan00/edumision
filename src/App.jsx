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
const INITIAL_STUDENTS = [];

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
    const denoms = [5, 6, 7, 8, 9, 10, 12];
    const D = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const sumN = n1 + n2;

    const narrative = `Dos sondas espaciales transmiten datos en la misma frecuencia orbital (${D}). La Sonda A envía ${n1}/${D} de la señal y la Sonda B aporta ${n2}/${D}. ¿Qué fracción total de la señal sintonizaste?`;

    const raw = [
      { value: `${sumN}/${D}`, correct: true, feedback: `¡Señal fijada! Con igual canal orbital (${D}) sumamos numeradores: ${n1} + ${n2} = ${sumN}.` },
      { value: `${sumN}/${D + D}`, correct: false, errorCode: "ERR_DIRECT", feedback: `Alerta: Sumaste denominadores (${D}+${D}=${D + D}). En el mismo canal, el denominador no cambia.` },
      { value: `${n1}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la primera sonda (${n1}/${D}). Falta sumar la segunda (${n2}/${D}).` },
      { value: `${n2}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la segunda sonda (${n2}/${D}). Falta sumar la inicial (${n1}/${D}).` }
    ];

    return { narrative, equation: `${n1}/${D} + ${n2}/${D} = ?`, n1, n2, D, options: prepareOptions(raw) };
  },

  generateM2() {
    const scenarios = [
      { d1: 3, d2: 6, n1: 1, n2: 1, correct: "3/6", errDirect: "2/9", errLcd: "2/18", errPartial: "1/3", fb: "Denominador común 6: 1/3 equivale a 2/6. Sumando: 2/6 + 1/6 = 3/6." },
      { d1: 2, d2: 4, n1: 1, n2: 1, correct: "3/4", errDirect: "2/6", errLcd: "2/8", errPartial: "1/2", fb: "Denominador común 4: 1/2 equivale a 2/4. Sumando: 2/4 + 1/4 = 3/4." },
      { d1: 4, d2: 8, n1: 1, n2: 1, correct: "3/8", errDirect: "2/12", errLcd: "2/32", errPartial: "1/4", fb: "Denominador común 8: 1/4 equivale a 2/8. Sumando: 2/8 + 1/8 = 3/8." },
      { d1: 5, d2: 10, n1: 1, n2: 1, correct: "3/10", errDirect: "2/15", errLcd: "2/50", errPartial: "1/5", fb: "Denominador común 10: 1/5 equivale a 2/10. Sumando: 2/10 + 1/10 = 3/10." },
      { d1: 3, d2: 9, n1: 2, n2: 1, correct: "7/9", errDirect: "3/12", errLcd: "3/27", errPartial: "2/3", fb: "Denominador común 9: 2/3 equivale a 6/9. Sumando: 6/9 + 1/9 = 7/9." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const narrative = `El tanque principal del propulsor contiene ${choice.n1}/${choice.d1} de combustible y el tanque auxiliar aporta ${choice.n2}/${choice.d2} más. ¿Qué fracción total de combustible lograste cargar?`;

    const raw = [
      { value: choice.correct, correct: true, feedback: `¡Válvula calibrada! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `No sumes directamente denominadores (${choice.d1}+${choice.d2}=${choice.d1+choice.d2}). Buscá la base común.` },
      { value: choice.errPartial, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo cargaste el primer tanque (${choice.n1}/${choice.d1}). Falta sumar el auxiliar.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Multiplicaste denominadores sin amplificar adecuadamente los numeradores.` }
    ];

    return { narrative, equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
  },

  generateM3() {
    const scenarios = [
      { d1: 3, d2: 4, n1: 1, n2: 1, displayCorrect: "7/12", errDirect: "2/7", errLcd: "1/12", fb: "MCM entre 3 y 4 es 12: 1/3 = 4/12 y 1/4 = 3/12. Sumados: 7/12." },
      { d1: 2, d2: 5, n1: 1, n2: 2, displayCorrect: "9/10", errDirect: "3/7", errLcd: "2/10", fb: "MCM entre 2 y 5 es 10: 1/2 = 5/10 y 2/5 = 4/10. Sumados: 9/10." },
      { d1: 3, d2: 5, n1: 1, n2: 1, displayCorrect: "8/15", errDirect: "2/8", errLcd: "1/15", fb: "MCM entre 3 y 5 es 15: 1/3 = 5/15 y 1/5 = 3/15. Sumados: 8/15." },
      { d1: 4, d2: 5, n1: 1, n2: 1, displayCorrect: "9/20", errDirect: "2/9", errLcd: "1/20", fb: "MCM entre 4 y 5 es 20: 1/4 = 5/20 y 1/5 = 4/20. Sumados: 9/20." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const narrative = `Dos módulos espaciales deben empalmar sus órbitas. El Módulo Alfa recorrió ${choice.n1}/${choice.d1} de la trayectoria y el Módulo Beta recorrió ${choice.n2}/${choice.d2}. ¿Qué fracción total cubrieron entre ambos?`;

    const raw = [
      { value: choice.displayCorrect, correct: true, feedback: `¡Órbitas enlazadas! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `Sumar numeradores y denominadores directo (${choice.d1}+${choice.d2}) no funciona cuando las bases difieren.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Buscaste la base común pero cometiste un desvío al amplificar los numeradores.` },
      { value: `${choice.n1}/${choice.d1}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo contabilizaste el Módulo Alfa (${choice.n1}/${choice.d1}).` }
    ];

    return { narrative, equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
  },

  generateM4() {
    const variants = [
      // Variación 1: Depósitos Octales (MCM = 8)
      {
        title: "Soporte Vital: Depósitos Octales de Agua",
        intro: "Tres tanques de reciclaje alimentan el sistema de agua potable de la cabina principal antes del despegue orbital.",
        steps: [
          {
            prompt: "El Tanque A aporta 1/2, el Tanque B aporta 1/4 y el Tanque C aporta 1/8. ¿Cuál es el mínimo común denominador entre 2, 4 y 8?",
            rawOptions: [
              { value: "8", correct: true, feedback: "¡Correcto! 8 es el menor múltiplo común de 2, 4 y 8." },
              { value: "16", correct: false, errorCode: "ERR_LCD", feedback: "16 es múltiplo común, pero no es el mínimo." },
              { value: "4", correct: false, errorCode: "ERR_LCD", feedback: "4 es múltiplo de 2 y 4, pero no de 8." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 no es múltiplo de 4 ni de 8." }
            ]
          },
          {
            prompt: "Convertí los tres tanques a octavos y sumalos: 1/2 + 1/4 + 1/8 = ?",
            rawOptions: [
              { value: "7/8", correct: true, feedback: "1/2 = 4/8, 1/4 = 2/8, 1/8 = 1/8. Sumados: 4/8 + 2/8 + 1/8 = 7/8." },
              { value: "3/14", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores linealmente (1+1+1 sobre 2+4+8)." },
              { value: "6/8", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar el aporte del Tanque C (1/8)." },
              { value: "5/8", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/2 a octavos (es 4/8, no 2/8)." }
            ]
          },
          {
            prompt: "El protocolo de despegue exige contar con al menos 3/4 (6/8) de agua en la reserva. Tenés 7/8. ¿Alcanza la reserva?",
            rawOptions: [
              { value: "Sí, alcanza y sobra 1/8 de reserva", correct: true, feedback: "7/8 es mayor que 3/4 (6/8). La reserva está asegurada con un margen de 1/8." },
              { value: "No alcanza, falta 1/8 de agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 3/4 a octavos (6/8) y compará con 7/8." },
              { value: "Es exactamente igual", correct: false, errorCode: "ERR_COMPARE", feedback: "No son iguales: 3/4 equivale a 6/8 y tenés 7/8." },
              { value: "No se puede saber", correct: false, errorCode: "ERR_COMPARE", feedback: "Al convertir a un denominador común (octavos), la comparación es directa." }
            ]
          }
        ]
      },
      // Variación 2: Reciclado de Hidroponia (MCM = 12)
      {
        title: "Soporte Vital: Reciclado de Hidroponia",
        intro: "El purificador recupera agua de tres sectores del invernadero espacial antes del ciclo de riego.",
        steps: [
          {
            prompt: "El Sector 1 aporta 1/3, el Sector 2 aporta 1/6 y el Sector 3 aporta 5/12. ¿Cuál es el mínimo común denominador entre 3, 6 y 12?",
            rawOptions: [
              { value: "12", correct: true, feedback: "¡Correcto! 12 es el mínimo común múltiplo entre 3, 6 y 12." },
              { value: "24", correct: false, errorCode: "ERR_LCD", feedback: "24 funciona pero no es el mínimo común denominador." },
              { value: "18", correct: false, errorCode: "ERR_LCD", feedback: "18 no es múltiplo de 4 ni divisible por 12." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 no puede contener al denominador 12." }
            ]
          },
          {
            prompt: "Convertí los tres sectores a doceavos y sumalos: 1/3 + 1/6 + 5/12 = ?",
            rawOptions: [
              { value: "11/12", correct: true, feedback: "1/3 = 4/12, 1/6 = 2/12, 5/12 = 5/12. Sumados: 4/12 + 2/12 + 5/12 = 11/12." },
              { value: "7/21", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores de forma directa (1+1+5 sobre 3+6+12)." },
              { value: "9/12", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/3 a doceavos (es 4/12, no 2/12)." },
              { value: "6/12", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar la contribución del Sector 3 (5/12)." }
            ]
          },
          {
            prompt: "El sistema requiere un piso de 5/6 (10/12) de capacidad para habilitar el circuito general. Tenés 11/12. ¿Se autoriza el riego?",
            rawOptions: [
              { value: "Sí, se autoriza (supera el mínimo por 1/12)", correct: true, feedback: "11/12 es mayor que 5/6 (10/12). El circuito tiene agua suficiente." },
              { value: "No se autoriza, falta 1/12", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 5/6 a doceavos (10/12) y compará con 11/12." },
              { value: "Es igual al mínimo requerido", correct: false, errorCode: "ERR_COMPARE", feedback: "5/6 es 10/12 y tenés 11/12, tenés 1/12 más." },
              { value: "Falta la mitad del agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Compará los numeradores con el mismo denominador 12." }
            ]
          }
        ]
      },
      // Variación 3: Condensadores de Emergencia (MCM = 10)
      {
        title: "Soporte Vital: Condensadores de Emergencia",
        intro: "Tres filtros de condensación recogen la humedad ambiental para llenar el tanque de agua purificada.",
        steps: [
          {
            prompt: "El Filtro A aporta 2/5, el Filtro B aporta 1/2 y el Filtro C aporta 1/10. ¿Cuál es el mínimo común denominador entre 5, 2 y 10?",
            rawOptions: [
              { value: "10", correct: true, feedback: "¡Exacto! 10 es el menor múltiplo de 5, 2 y 10." },
              { value: "20", correct: false, errorCode: "ERR_LCD", feedback: "20 es múltiplo común, pero no el menor." },
              { value: "15", correct: false, errorCode: "ERR_LCD", feedback: "15 es múltiplo de 5, pero no de 2 ni de 10." },
              { value: "5", correct: false, errorCode: "ERR_LCD", feedback: "5 no puede contener al 10." }
            ]
          },
          {
            prompt: "Convertí las tres fracciones a décimos y sumalas: 2/5 + 1/2 + 1/10 = ?",
            rawOptions: [
              { value: "10/10 (1 entero)", correct: true, feedback: "2/5 = 4/10, 1/2 = 5/10, 1/10 = 1/10. Sumados: 4/10 + 5/10 + 1/10 = 10/10 (tanque lleno)." },
              { value: "4/17", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores directo (2+1+1 sobre 5+2+10)." },
              { value: "8/10", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/2 a décimos (es 5/10, no 3/10)." },
              { value: "9/10", correct: false, errorCode: "ERR_PARTIAL", feedback: "Omitiste sumar el aporte del Filtro C (1/10)." }
            ]
          },
          {
            prompt: "Se necesita contar con al menos 4/5 (8/10) de reserva para la caminata espacial. Tenés 10/10. ¿Hay suficiente agua?",
            rawOptions: [
              { value: "Sí, la capacidad está al 100% y supera el 4/5 requerido", correct: true, feedback: "10/10 (1 entero) es mayor que 4/5 (8/10). Hay margen de sobra." },
              { value: "No alcanza, falta 2/10", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 4/5 a décimos (8/10) y compará con 10/10." },
              { value: "Es exactamente igual al mínimo", correct: false, errorCode: "ERR_COMPARE", feedback: "4/5 es 8/10, mientras que tenés 10/10." },
              { value: "No se puede comparar", correct: false, errorCode: "ERR_COMPARE", feedback: "Con denominador común 10 se compara directamente." }
            ]
          }
        ]
      },
      // Variación 4: Refrigeración del Reactor (Caso Deficitario, MCM = 12)
      {
        title: "Soporte Vital: Refrigeración del Reactor",
        intro: "Tres depósitos inyectan refrigerante líquido al circuito de soporte vital del reactor.",
        steps: [
          {
            prompt: "El Depósito 1 aporta 1/3, el Depósito 2 aporta 1/4 y el Depósito 3 aporta 1/6. ¿Cuál es el mínimo común denominador entre 3, 4 y 6?",
            rawOptions: [
              { value: "12", correct: true, feedback: "¡Correcto! 12 es el menor múltiplo de 3, 4 y 6." },
              { value: "24", correct: false, errorCode: "ERR_LCD", feedback: "24 es múltiplo pero no es el mínimo." },
              { value: "18", correct: false, errorCode: "ERR_LCD", feedback: "18 no es divisible por 4." },
              { value: "36", correct: false, errorCode: "ERR_LCD", feedback: "36 es múltiplo pero muy alto." }
            ]
          },
          {
            prompt: "Convertí los tres depósitos a doceavos y sumalos: 1/3 + 1/4 + 1/6 = ?",
            rawOptions: [
              { value: "9/12 (o 3/4)", correct: true, feedback: "1/3 = 4/12, 1/4 = 3/12, 1/6 = 2/12. Sumados: 4/12 + 3/12 + 2/12 = 9/12." },
              { value: "3/13", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores en línea recta (1+1+1 sobre 3+4+6)." },
              { value: "7/12", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar el Depósito 3 (1/6 = 2/12)." },
              { value: "8/12", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/3 a doceavos (es 4/12, no 3/12)." }
            ]
          },
          {
            prompt: "La computadora exige un nivel mínimo de 5/6 (10/12) para evitar el sobrecalentamiento. Tenés 9/12. ¿Alcanza la carga?",
            rawOptions: [
              { value: "No alcanza, falta 1/12 para llegar al nivel de seguridad", correct: true, feedback: "5/6 equivale a 10/12. Al tener 9/12, falta exactamente 1/12 para el mínimo de seguridad." },
              { value: "Sí alcanza y sobra refrigerante", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 5/6 a doceavos (10/12) y compará con 9/12." },
              { value: "Es exactamente igual al requerimiento", correct: false, errorCode: "ERR_COMPARE", feedback: "9/12 es menor que 10/12 (5/6)." },
              { value: "Sobra la mitad del refrigerante", correct: false, errorCode: "ERR_COMPARE", feedback: "Analizá las fracciones en doceavos: 9/12 vs 10/12." }
            ]
          }
        ]
      },
      // Variación 5: Módulo de Ensayos Biológicos (MCM = 20)
      {
        title: "Soporte Vital: Módulo de Ensayos Biológicos",
        intro: "Se consolidan tres reservas de agua destilada para los laboratorios de cultivo de la base.",
        steps: [
          {
            prompt: "La Reserva Alfa aporta 2/5, la Beta aporta 1/4 y la Gamma aporta 3/20. ¿Cuál es el mínimo común denominador entre 5, 4 y 20?",
            rawOptions: [
              { value: "20", correct: true, feedback: "¡Excelente! 20 es el MCM entre 5, 4 y 20." },
              { value: "40", correct: false, errorCode: "ERR_LCD", feedback: "40 es múltiplo común, pero no el mínimo." },
              { value: "10", correct: false, errorCode: "ERR_LCD", feedback: "10 no es múltiplo de 4." },
              { value: "15", correct: false, errorCode: "ERR_LCD", feedback: "15 no es múltiplo de 4 ni de 20." }
            ]
          },
          {
            prompt: "Convertí las tres reservas a veintiavos y sumalas: 2/5 + 1/4 + 3/20 = ?",
            rawOptions: [
              { value: "16/20 (o 4/5)", correct: true, feedback: "2/5 = 8/20, 1/4 = 5/20, 3/20 = 3/20. Sumados: 8/20 + 5/20 + 3/20 = 16/20." },
              { value: "6/29", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste directamente numeradores y denominadores (2+1+3 sobre 5+4+20)." },
              { value: "13/20", correct: false, errorCode: "ERR_PARTIAL", feedback: "Omitiste sumar el aporte de la Reserva Gamma (3/20)." },
              { value: "14/20", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 2/5 a veintiavos (es 8/20, no 6/20)." }
            ]
          },
          {
            prompt: "El laboratorio exige un piso de 7/10 (14/20) para habilitar los cultivos. Tenés 16/20. ¿Se pueden iniciar las pruebas?",
            rawOptions: [
              { value: "Sí, alcanza y queda una reserva de 2/20 (1/10)", correct: true, feedback: "16/20 es mayor que 7/10 (14/20). Hay suficiente agua destilada." },
              { value: "No se puede, falta agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 7/10 a veintiavos (14/20) y compará con 16/20." },
              { value: "Es exactamente igual al mínimo", correct: false, errorCode: "ERR_COMPARE", feedback: "16/20 supera a 14/20 por 2/20." },
              { value: "No hay suficiente información", correct: false, errorCode: "ERR_COMPARE", feedback: "Comparando en veintiavos la solución es directa." }
            ]
          }
        ]
      }
    ];

    const chosenVariant = variants[Math.floor(Math.random() * variants.length)];
    return chosenVariant.steps.map((st) => ({
      ...st,
      title: chosenVariant.title,
      intro: chosenVariant.intro,
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
  hintBtn: { padding: "6px 12px", backgroundColor: "rgba(139, 92, 246, 0.15)", border: "1px solid #8b5cf6", color: "#c084fc", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" },
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

  const isTouchHandledRef = useRef(false);

  const startInterval = useCallback((action, isTouch = false) => {
    if (selectedOption !== null) return;
    if (isTouch) {
      isTouchHandledRef.current = true;
    } else if (isTouchHandledRef.current) {
      // Ignorar mouse synthetic event inmediatamente posterior a touchstart
      return;
    }
    stopInterval();
    action();
    
    // DELAY CALIBRADO: 600ms para evitar saltos dobles involuntarios
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 180); // INTERVALO DE RAMPA
    }, 600);
  }, [selectedOption, stopInterval]);

  const stopIntervalAndResetTouch = useCallback(() => {
    stopInterval();
    setTimeout(() => {
      isTouchHandledRef.current = false;
    }, 400);
  }, [stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  // Previene estrictamente incrementos dobles por touch + mousedown
  const bindHoldEvents = (action) => ({
    onMouseDown: (e) => {
      if (e.button !== 0) return;
      startInterval(action, false);
    },
    onMouseUp: stopIntervalAndResetTouch,
    onMouseLeave: stopIntervalAndResetTouch,
    onTouchStart: (e) => {
      startInterval(action, true);
    },
    onTouchEnd: stopIntervalAndResetTouch
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
    padding: "14px 18px",
    backgroundColor: "#f59e0b",
    border: "2px solid #fbbf24",
    color: "#020308",
    borderRadius: "10px",
    fontWeight: "900",
    fontSize: "15px",
    letterSpacing: "0.5px",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.45)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.15s ease",
    textTransform: "uppercase"
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

  const isTouchHandledRef = useRef(false);

  const startInterval = useCallback((action, isTouch = false) => {
    if (selectedOption !== null) return;
    if (isTouch) {
      isTouchHandledRef.current = true;
    } else if (isTouchHandledRef.current) {
      return;
    }
    stopInterval();
    action();
    
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 180);
    }, 600);
  }, [selectedOption, stopInterval]);

  const stopIntervalAndResetTouch = useCallback(() => {
    stopInterval();
    setTimeout(() => {
      isTouchHandledRef.current = false;
    }, 400);
  }, [stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const bindHoldEvents = (action) => ({
    onMouseDown: (e) => {
      if (e.button !== 0) return;
      startInterval(action, false);
    },
    onMouseUp: stopIntervalAndResetTouch,
    onMouseLeave: stopIntervalAndResetTouch,
    onTouchStart: (e) => {
      startInterval(action, true);
    },
    onTouchEnd: stopIntervalAndResetTouch
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

  // Onboarding en 3 Carteles para el Alumno
  const [studentOnboarded, setStudentOnboarded] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edumision_student_onboarded") === "true";
    }
    return false;
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [studentProfile, setStudentProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumision_student_profile");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return { nick: "", edad: "", curso: "", escuela: "" };
  });
  const [studentNickname, setStudentNickname] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumision_student_profile");
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (p.nick) return p.nick;
        } catch (e) {}
      }
      return localStorage.getItem("edumision_nickname") || "Martín G.";
    }
    return "Martín G.";
  });

  const shipName = "";

  const suitColor = "#38bdf8";

  // Estados de navegación y roles
  const [showStudentWelcome, setShowStudentWelcome] = useState(true);
  
  
  const [showInstructionModal, setShowInstructionModal] = useState(null);
  
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

    // 📡 Ingesta de Telemetría xAPI en tiempo real al LRS en Vercel (/api/lrs)
    try {
      fetch("/api/lrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: { name: studentNickname || "Alumna", uuid: "7a3b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d" },
          verb: { id: verb, display: { "es-AR": verb } },
          object: { id: activeMission, description: action },
          xp: totalXp,
          errors: totalErrors,
          timestamp: new Date().toISOString()
        })
      }).catch((err) => console.log("LRS Buffer Offline:", err));
    } catch (e) {
      console.log("Error enviando telemetría xAPI:", e);
    }
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
      {/* 🪐 ONBOARDING EN 3 CARTELES PARA EL ALUMNO */}
  {!studentOnboarded && view === "alumno" && (
    <div style={styles.parentModalOverlay}>
      <div style={{ ...styles.parentModalCard, maxWidth: "460px" }}>
        {onboardingStep === 1 && (
          <div>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8" }}>
              <span>🪐</span> PRUEBA DE EXPLORACIÓN EDUCATIVA — EDUMISIÓN
            </div>
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🔬</span>
                <div><strong>Prueba de Experiencia:</strong> Vas a participar de una prueba para evaluar el funcionamiento de un juego educativo.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>📋</span>
                <div><strong>Sin Nota Escolar:</strong> Tu actividad no va a generar ninguna nota y no se envía nada a tus profes ni a la escuela (solo a tus padres si lo solicitan).</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>📝</span>
                <div><strong>Sin Calculadora:</strong> Te pedimos que hagas las cuentas a mano en papel para ejercitar tu propio razonamiento.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🔒</span>
                <div><strong>Protección de Datos:</strong> Por seguridad, no ingreses tu nombre completo.</div>
              </div>

            </div>

            <button 
              onClick={() => {
                playRobotChat();
                setOnboardingStep(2);
              }}
              style={styles.parentModalBtn}
              type="button"
            >
              Siguiente ➔
            </button>
          </div>
        )}

        {onboardingStep === 2 && (
          <div>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8" }}>
              <span>🚀</span> FICHA DE LA TRIPULACIÓN
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px", lineHeight: "1.4" }}>
              Completá tus datos de piloto para registrar tus avances en la base de datos oficial:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px", textAlign: "left" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "3px" }}>
                  Nick / Apodo (no ingreses tu nombre completo):
                </label>
                <input 
                  type="text" 
                  value={studentProfile.nick}
                  onChange={(e) => setStudentProfile({ ...studentProfile, nick: e.target.value })}
                  placeholder="Ej: Marto_05"
                  style={styles.teacherDashboardInput}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "3px" }}>
                    Edad:
                  </label>
                  <input 
                    type="text" 
                    value={studentProfile.edad}
                    onChange={(e) => setStudentProfile({ ...studentProfile, edad: e.target.value })}
                    placeholder="Ej: 12 años"
                    style={styles.teacherDashboardInput}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "3px" }}>
                    Año / Curso:
                  </label>
                  <input 
                    type="text" 
                    value={studentProfile.curso}
                    onChange={(e) => setStudentProfile({ ...studentProfile, curso: e.target.value })}
                    placeholder="Ej: 1° Año B"
                    style={styles.teacherDashboardInput}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "3px" }}>
                  Escuela:
                </label>
                <input 
                  type="text" 
                  value={studentProfile.escuela}
                  onChange={(e) => setStudentProfile({ ...studentProfile, escuela: e.target.value })}
                  placeholder="Ej: IPEM 128"
                  style={styles.teacherDashboardInput}
                />
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "#38bdf8", marginBottom: "14px", fontStyle: "italic", textAlign: "center" }}>
              ¡Gracias por sumarte a estas misiones que van a ser parte de una gran aventura! 🚀
            </p>

            <button 
              onClick={() => {
                playRobotChat();
                const finalNick = studentProfile.nick || "Martín G.";
                setStudentNickname(finalNick);
                if (typeof window !== "undefined") {
                  localStorage.setItem("edumision_student_profile", JSON.stringify({ ...studentProfile, nick: finalNick }));
                  localStorage.setItem("edumision_nickname", finalNick);
                }
                setOnboardingStep(3);
              }}
              style={styles.parentModalBtn}
              type="button"
            >
              🚀 CONTINUAR A LA CABINA
            </button>
          </div>
        )}

        {onboardingStep === 3 && (
          <div>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8" }}>
              <span>🗺️</span> TU MAPA DE NAVEGACIÓN ESPACIAL
            </div>
            
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🌲</span>
                <div><strong>Árbol de Misiones:</strong> Vas a avanzar paso a paso desde la Misión 1 hasta la Misión 4 de Cierre para obtener la Insignia de Maestría.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🔄</span>
                <div><strong>Reintento Libre:</strong> Si cometés un desvío, no perdés tu avance. Podés volver a realizar las misiones cuando quieras para recuperar el XP.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>💡</span>
                <div><strong>Pistas Sin Penalización:</strong> Pedir pistas a EduBot no te resta experiencia; solo queda registrado en la bitácora para tu docente.</div>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>📝</span>
                <div><strong>Lápiz y Papel:</strong> Tené siempre a mano hoja y lápiz para resolver las cuentas antes de presionar los botones.</div>
              </div>
            </div>

            <button 
              onClick={() => {
                playRobotChat();
                setStudentOnboarded(true);
                if (typeof window !== "undefined") {
                  localStorage.setItem("edumision_student_onboarded", "true");
                }
              }}
              style={{ ...styles.parentModalBtn, backgroundColor: "#10b981" }}
              type="button"
            >
              🛰️ ENTENDIDO, ¡A LAS MISIONES!
            </button>
          </div>
        )}
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
        {/* 🧭 BARRA DE NAVEGACIÓN - MÓDULO ALUMNO */}
  <nav style={styles.navBar}>
    <div style={styles.navLogo}>
      <span style={styles.navLogoEll}>EM</span> 
      <span>EduMisión Córdoba · <strong style={{ color: "#38bdf8" }}>{shipName}</strong></span>
    </div>
    
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={() => copyDirectLink("alumno")} style={styles.linkShareBtn} title="Copiar link para compartir">
        📋 Copiar Link de Juego
      </button>
    </div>
  </nav>

      
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
      
    </div>
  );
}

// ==========================================
