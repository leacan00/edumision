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
// 🛠️ BASE DE DATOS LOCAL
// ==========================================
const INITIAL_STUDENTS = [];

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

    const narrative = `Dos sondas espaciales transmiten datos en el mismo canal orbital (${D}). La Sonda A envía ${n1}/${D} de la señal y la Sonda B aporta ${n2}/${D}. ¿Qué fracción total de la señal sintonizaste?`;

    const raw = [
      { value: `${sumN}/${D}`, correct: true, feedback: `¡Señal sintonizada! Con igual canal orbital (${D}) sumamos numeradores: ${n1} + ${n2} = ${sumN}.` },
      { value: `${sumN}/${D + D}`, correct: false, errorCode: "ERR_DIRECT", feedback: `Alerta: Sumaste denominadores (${D}+${D}=${D + D}). En el mismo canal orbital, la base no cambia.` },
      { value: `${n1}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la primera sonda. No olvides sumar la segunda.` },
      { value: `${n2}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la segunda sonda. Falta la inicial.` },
      { value: `${n1 * n2}/${D}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Multiplicaste los numeradores en vez de sumarlos.` },
      { value: `${sumN + 1}/${D}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Desvío en el cálculo del numerador acumulado.` }
    ];

    return { narrative, equation: `${n1}/${D} + ${n2}/${D} = ?`, n1, n2, D, options: prepareOptions(raw) };
  },

  generateM2() {
    const scenarios = [
      { d1: 2, d2: 4, n1: 1, n2: 1, correct: "3/4", errDirect: "2/6", errLcd: "2/8", errPartial: "1/2", d1Val: "1/4", d2Val: "5/4", fb: "Denominador común 4: 1/2 equivale a 2/4. Sumando: 2/4 + 1/4 = 3/4." },
      { d1: 3, d2: 6, n1: 1, n2: 1, correct: "3/6", errDirect: "2/9", errLcd: "2/18", errPartial: "1/3", d1Val: "1/6", d2Val: "4/6", fb: "Denominador común 6: 1/3 equivale a 2/6. Sumando: 2/6 + 1/6 = 3/6." },
      { d1: 4, d2: 8, n1: 1, n2: 1, correct: "3/8", errDirect: "2/12", errLcd: "2/32", errPartial: "1/4", d1Val: "1/8", d2Val: "5/8", fb: "Denominador común 8: 1/4 equivale a 2/8. Sumando: 2/8 + 1/8 = 3/8." },
      { d1: 5, d2: 10, n1: 1, n2: 1, correct: "3/10", errDirect: "2/15", errLcd: "2/50", errPartial: "1/5", d1Val: "1/10", d2Val: "4/10", fb: "Denominador común 10: 1/5 equivale a 2/10. Sumando: 2/10 + 1/10 = 3/10." },
      { d1: 2, d2: 6, n1: 1, n2: 1, correct: "4/6", errDirect: "2/8", errLcd: "2/12", errPartial: "1/2", d1Val: "2/6", d2Val: "5/6", fb: "Denominador común 6: 1/2 equivale a 3/6. Sumando: 3/6 + 1/6 = 4/6." },
      { d1: 3, d2: 9, n1: 2, n2: 1, correct: "7/9", errDirect: "3/12", errLcd: "3/27", errPartial: "2/3", d1Val: "4/9", d2Val: "5/9", fb: "Denominador común 9: 2/3 equivale a 6/9. Sumando: 6/9 + 1/9 = 7/9." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const narrative = `El tanque principal contiene ${choice.n1}/${choice.d1} de su capacidad y el auxiliar aporta ${choice.n2}/${choice.d2} más. ¿Cuánto combustible total lograste cargar?`;

    const raw = [
      { value: choice.correct, correct: true, feedback: `¡Válvula calibrada! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `No sumes directamente denominadores (${choice.d1}+${choice.d2}). Buscá la base común.` },
      { value: choice.errPartial, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo cargaste el primer depósito. Te falta el auxiliar.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Multiplicaste denominadores sin amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo cargaste el depósito auxiliar sin el principal.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Flujo sobrecargado. Revisá la proporción con lápiz y papel.` }
    ];

    return { narrative, equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
  },

  generateM3() {
    const scenarios = [
      { d1: 3, d2: 6, n1: 1, n2: 1, displayCorrect: "1/2", errDirect: "2/9", errLcd: "2/18", d1Val: "1/3", d2Val: "4/6", d3Val: "2/3", fb: "1/3 + 1/6 = 3/6. Simplificado por 3 da la frecuencia pura de 1/2." },
      { d1: 4, d2: 12, n1: 1, n2: 1, displayCorrect: "1/3", errDirect: "2/16", errLcd: "2/48", d1Val: "1/4", d2Val: "3/12", d3Val: "5/12", fb: "1/4 + 1/12 = 4/12. Simplificado por 4 da la frecuencia pura de 1/3." },
      { d1: 6, d2: 10, n1: 1, n2: 1, displayCorrect: "4/15", errDirect: "2/16", errLcd: "2/60", d1Val: "1/6", d2Val: "1/10", d3Val: "7/30", fb: "MCM 30: 5/30 + 3/30 = 8/30, que simplificado es 4/15." },
      { d1: 2, d2: 10, n1: 1, n2: 1, displayCorrect: "3/5", errDirect: "2/12", errLcd: "2/20", d1Val: "1/2", d2Val: "4/10", d3Val: "7/10", fb: "1/2 + 1/10 = 5/10 + 1/10 = 6/10, que simplificado por 2 da 3/5." },
      { d1: 5, d2: 15, n1: 2, n2: 1, displayCorrect: "7/15", errDirect: "3/20", errLcd: "3/75", d1Val: "2/5", d2Val: "4/15", d3Val: "8/15", fb: "2/5 + 1/15 = 6/15 + 1/15 = 7/15 (fracción irreducible)." }
    ];
    const choice = scenarios[Math.floor(Math.random() * scenarios.length)];
    const narrative = `Dos módulos espaciales deben empalmar sus órbitas. Uno avanzó ${choice.n1}/${choice.d1} del recorrido y el otro ${choice.n2}/${choice.d2}. ¿Qué fracción del recorrido total cubrieron entre ambos?`;

    const raw = [
      { value: choice.displayCorrect, correct: true, feedback: `¡Órbitas enlazadas! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `Sumar directo no sirve cuando las frecuencias orbitales difieren.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Buscaste base común pero olvidaste amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Falta enlazar la trayectoria del segundo módulo.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Frecuencia distorsionada. Revisá la simplificación con lápiz y papel.` },
      { value: choice.d3Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Desvío en el cálculo del mínimo común múltiplo.` }
    ];

    return { narrative, equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
  },

  generateM4() {
    const variants = [
      // Variación 1: Depósitos Octales (MCM = 8)
      {
        title: "Soporte Vital: Depósitos Octales de Agua",
        steps: [
          {
            prompt: "Paso 1 (MCM): El Tanque A aporta 1/2, el Tanque B aporta 1/4 y el Tanque C aporta 1/8. ¿Cuál es el mínimo común denominador entre 2, 4 y 8?",
            rawOptions: [
              { value: "8", correct: true, feedback: "¡Correcto! 8 es el menor múltiplo común de 2, 4 y 8." },
              { value: "16", correct: false, errorCode: "ERR_LCD", feedback: "16 es múltiplo común, pero no es el mínimo." },
              { value: "4", correct: false, errorCode: "ERR_LCD", feedback: "4 es múltiplo de 2 y 4, pero no de 8." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 no es múltiplo de 4 ni de 8." },
              { value: "12", correct: false, errorCode: "ERR_LCD", feedback: "12 no es divisible de forma exacta por 8." },
              { value: "24", correct: false, errorCode: "ERR_LCD", feedback: "24 es múltiplo común elevado, no el mínimo." }
            ]
          },
          {
            prompt: "Paso 2 (Suma Triple): Convertí los tres tanques a octavos y sumalos: 1/2 + 1/4 + 1/8 = ?",
            rawOptions: [
              { value: "7/8", correct: true, feedback: "1/2 = 4/8, 1/4 = 2/8, 1/8 = 1/8. Sumados: 4/8 + 2/8 + 1/8 = 7/8." },
              { value: "3/14", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores linealmente (1+1+1 sobre 2+4+8)." },
              { value: "6/8", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar el aporte del Tanque C (1/8)." },
              { value: "5/8", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/2 a octavos (es 4/8, no 2/8)." },
              { value: "3/8", correct: false, errorCode: "ERR_PARTIAL", feedback: "Solo sumaste dos depósitos parcialmente." },
              { value: "8/8 (1 entero)", correct: false, errorCode: "ERR_GENERIC", feedback: "Te pasaste de la suma real de las tres fracciones." }
            ]
          },
          {
            prompt: "Paso 3 (Comparación): El protocolo exige contar con al menos 3/4 (6/8) de agua en la reserva. Tenés 7/8. ¿Alcanza la reserva?",
            rawOptions: [
              { value: "Sí, alcanza y sobra 1/8 de reserva", correct: true, feedback: "7/8 es mayor que 3/4 (6/8). La reserva está asegurada con un margen de 1/8." },
              { value: "No alcanza, falta 1/8 de agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Convertí 3/4 a octavos (6/8) y compará con 7/8." },
              { value: "Es exactamente igual", correct: false, errorCode: "ERR_COMPARE", feedback: "No son iguales: 3/4 equivale a 6/8 y tenés 7/8." },
              { value: "No se puede saber sin medir en litros", correct: false, errorCode: "ERR_COMPARE", feedback: "Al convertir a un denominador común (octavos), la comparación es directa." },
              { value: "Sí, alcanza y sobra 2/8", correct: false, errorCode: "ERR_COMPARE", feedback: "7/8 - 6/8 es 1/8, no 2/8." },
              { value: "No alcanza, faltan 3/8", correct: false, errorCode: "ERR_COMPARE", feedback: "Revisá la resta de magnitudes sobre la misma base." }
            ]
          }
        ]
      },
      // Variación 2: Reciclado de Hidroponia (MCM = 12)
      {
        title: "Soporte Vital: Reciclado de Hidroponia",
        steps: [
          {
            prompt: "Paso 1 (MCM): El Sector 1 aporta 1/3, el Sector 2 aporta 1/6 y el Sector 3 aporta 5/12. ¿Cuál es el mínimo común denominador entre 3, 6 y 12?",
            rawOptions: [
              { value: "12", correct: true, feedback: "¡Correcto! 12 es el menor múltiplo común entre 3, 6 y 12." },
              { value: "24", correct: false, errorCode: "ERR_LCD", feedback: "24 funciona pero no es el mínimo." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 es múltiplo de 3 y 6, pero no alcanza a 12." },
              { value: "18", correct: false, errorCode: "ERR_LCD", feedback: "18 no es múltiplo de 12." },
              { value: "36", correct: false, errorCode: "ERR_LCD", feedback: "36 es un múltiplo común innecesariamente grande." },
              { value: "9", correct: false, errorCode: "ERR_LCD", feedback: "9 no es múltiplo de 6 ni de 12." }
            ]
          },
          {
            prompt: "Paso 2 (Suma Triple): Convertí todo a doceavos y sumá: 1/3 + 1/6 + 5/12 = ?",
            rawOptions: [
              { value: "11/12", correct: true, feedback: "1/3 = 4/12, 1/6 = 2/12, 5/12 = 5/12. Sumados: 4+2+5 = 11/12." },
              { value: "7/21", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste directo numeradores (1+1+5) y denominadores (3+6+12)." },
              { value: "9/12", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar una parte del tercer sector." },
              { value: "8/12", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 1/3 a doceavos (es 4/12)." },
              { value: "10/12", correct: false, errorCode: "ERR_GENERIC", feedback: "Desvío en la suma de los tres numeradores." },
              { value: "12/12 (1 entero)", correct: false, errorCode: "ERR_GENERIC", feedback: "Sobremencionaste la suma total." }
            ]
          },
          {
            prompt: "Paso 3 (Comparación): El sistema requiere al menos 5/6 (10/12) para habilitar el riego. Recuperaste 11/12. ¿Se autoriza el riego?",
            rawOptions: [
              { value: "Sí, se autoriza (11/12 supera el mínimo de 10/12 por 1/12)", correct: true, feedback: "11/12 es mayor que 5/6 (10/12). Riego habilitado." },
              { value: "No se autoriza, falta 1/12", correct: false, errorCode: "ERR_COMPARE", feedback: "5/6 equivale a 10/12 y tenés 11/12. Tenés más del mínimo." },
              { value: "Son exactamente iguales", correct: false, errorCode: "ERR_COMPARE", feedback: "11/12 es strictly mayor que 10/12." },
              { value: "No se autoriza, faltan 2/12", correct: false, errorCode: "ERR_COMPARE", feedback: "Revisá la comparación de doceavos." },
              { value: "Se autoriza pero sobra 1/2 de tanque", correct: false, errorCode: "ERR_COMPARE", feedback: "11/12 - 10/12 = 1/12, no 1/2." },
              { value: "Falta información de volumen", correct: false, errorCode: "ERR_COMPARE", feedback: "Con la fracción sobre base común es suficiente para decidir." }
            ]
          }
        ]
      },
      // Variación 3: Condensadores de Emergencia (MCM = 10)
      {
        title: "Soporte Vital: Condensadores de Emergencia",
        steps: [
          {
            prompt: "Paso 1 (MCM): El Filtro A aporta 2/5, el Filtro B aporta 1/2 y el Filtro C aporta 1/10. ¿Cuál es el mínimo común denominador entre 5, 2 y 10?",
            rawOptions: [
              { value: "10", correct: true, feedback: "¡Correcto! 10 es el menor múltiplo común de 5, 2 y 10." },
              { value: "20", correct: false, errorCode: "ERR_LCD", feedback: "20 es múltiplo común, pero no es el mínimo." },
              { value: "5", correct: false, errorCode: "ERR_LCD", feedback: "5 no es múltiplo de 2 ni de 10." },
              { value: "15", correct: false, errorCode: "ERR_LCD", feedback: "15 no es múltiplo de 2 ni de 10." },
              { value: "30", correct: false, errorCode: "ERR_LCD", feedback: "30 es un múltiplo común pero muy elevado." },
              { value: "8", correct: false, errorCode: "ERR_LCD", feedback: "8 no es múltiplo de 5 ni de 10." }
            ]
          },
          {
            prompt: "Paso 2 (Suma Triple): Convertí los tres filtros a décimos y sumalos: 2/5 + 1/2 + 1/10 = ?",
            rawOptions: [
              { value: "10/10 (1 entero completo)", correct: true, feedback: "2/5 = 4/10, 1/2 = 5/10, 1/10 = 1/10. Suma: 4+5+1 = 10/10 = 1." },
              { value: "4/17", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste directo numeradores (2+1+1) y denominadores (5+2+10)." },
              { value: "8/10", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó incorporar la conversión del Filtro A (4/10)." },
              { value: "9/10", correct: false, errorCode: "ERR_LCD", feedback: "Revisá la conversión de 2/5 a décimos (es 4/10)." },
              { value: "7/10", correct: false, errorCode: "ERR_PARTIAL", feedback: "Omitiste sumar el aporte del Filtro B." },
              { value: "11/10", correct: false, errorCode: "ERR_GENERIC", feedback: "Suma excedida del límite real." }
            ]
          },
          {
            prompt: "Paso 3 (Comparación): Se exige al menos 4/5 (8/10) de agua para activar la maniobra. Tenés 10/10. ¿Hay suficiente agua?",
            rawOptions: [
              { value: "Sí, la capacidad está al 100% (10/10) y supera los 8/10 requeridos", correct: true, feedback: "10/10 es mayor que 4/5 (8/10). Maniobra autorizada." },
              { value: "No alcanza, falta 1/10", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 es superior a 8/10." },
              { value: "Es exactamente la misma cantidad", correct: false, errorCode: "ERR_COMPARE", feedback: "8/10 es menor que 10/10." },
              { value: "No alcanza, faltan 2/10", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 supera los 8/10 por 2/10." },
              { value: "Sombra 5/10 de agua", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 - 8/10 es 2/10, no 5/10." },
              { value: "Indeterminado", correct: false, errorCode: "ERR_COMPARE", feedback: "La comparación entre décimos es exacta." }
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
  ERR_DIRECT: "🛠️ Propuesta para el aula presencial: detenga la ejercitación algorítmica. Use tiras de papel dobladas para visualizar que los denominadores no se suman.",
  ERR_PARTIAL: "🍳 Actividad para el hogar: usen objetos cotidianos divididos en partes para representar la suma de todas las porciones.",
  ERR_LCD: "🧩 Actividad para el hogar: repasen juntos las tablas de multiplicar de los denominadores para hallar el menor múltiplo común.",
  ERR_COMPARE: "🥤 Actividad para el hogar: sirvan líquidos en vasos idénticos convertidos a la misma base para comparar magnitudes."
};

// ==========================================
// 🔊 MÓDULO DE AUDIO
// ==========================================
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
      osc1.frequency.setValueAtTime(523.25, t);
      gain1.gain.setValueAtTime(0.04, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.1);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, t + 0.08);
      gain2.gain.setValueAtTime(0.04, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.18);
    } catch (e) { console.warn(e); }
  };

  const playError = () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, t);
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
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
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
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
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.25);
      });
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
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.2);
      });
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
        @keyframes streak { 0% { transform: translateX(-150vw); } 100% { transform: translateX(150vw); } }
        @keyframes glowFlash { 0% { background-color: rgba(3, 8, 24, 0.4); } 50% { background-color: rgba(56, 189, 248, 0.25); } 100% { background-color: rgba(3, 8, 24, 0.8); } }
      `}</style>
      {stars.map((star) => (
        <div key={star.id} style={{
          position: "absolute", top: star.top, left: "0px",
          width: star.width, height: star.height,
          background: "linear-gradient(90deg, transparent, #38bdf8, #ffffff, #c084fc, transparent)",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.9)", opacity: 0.9,
          animation: `streak ${star.duration} linear infinite`, animationDelay: star.delay
        }} />
      ))}
      <div style={hyperspaceStyles.hudText}>⚡ SALTO HIPERESPACIAL EN CURSO... ⚡</div>
    </div>
  );
}

const hyperspaceStyles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(2, 3, 8, 0.75)", zIndex: 9000, overflow: "hidden", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", animation: "glowFlash 1.2s ease-in-out infinite" },
  hudText: { fontSize: "18px", fontWeight: "900", color: "#38bdf8", letterSpacing: "2px", textShadow: "0 0 15px #38bdf8", backgroundColor: "rgba(2, 3, 8, 0.85)", padding: "10px 24px", borderRadius: "20px", border: "2px solid #38bdf8" }
};

// ==========================================
// 🤖 EDUBOT (COPILOTO ROBOT)
// ==========================================
function EduBotCopilot({ mood, message, onShowMathRules, errorWarning }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => { setIsBlinking(false); }, 400);
    }, 20000);
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
          <div style={astroStyles.copilotName}>🤖 EDUBOT (Copiloto de Cabina)</div>
          <div style={astroStyles.copilotSub}>Asistencia Técnica y Didáctica</div>
          <button onClick={onShowMathRules} style={astroStyles.mathRulesBtn} type="button">
            📐 REGLAS MATEMÁTICAS DE LA MISIÓN
          </button>
        </div>
      </div>

      <div style={astroStyles.speechBubble}>
        <div style={astroStyles.copilotText}>{message}</div>
      </div>

      {errorWarning && (
        <div style={astroStyles.errorAlertBox}>
          <span style={{ fontSize: "24px" }}>📝⚠️</span>
          <div style={{ fontSize: "13px", color: "#fca5a5", lineHeight: "1.4", fontFamily: "monospace" }}>
            <strong style={{ color: "#ffffff" }}>¡ALERTA DE REVISIÓN!</strong><br />
            {errorWarning}
          </div>
        </div>
      )}
    </div>
  );
}

const astroStyles = {
  container: { display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "rgba(139, 92, 246, 0.12)", border: "2px solid #8b5cf6", borderRadius: "14px", padding: "16px", marginBottom: "16px", boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
  header: { display: "flex", alignItems: "center", gap: "14px" },
  robotBody: { display: "flex", flexDirection: "column", alignItems: "center" },
  antenna: { width: "4px", height: "12px", backgroundColor: "#64748b", position: "relative" },
  antennaLight: (mood) => ({ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8", position: "absolute", top: "-10px", left: "-4px", boxShadow: `0 0 10px ${mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8"}` }),
  head: (mood) => ({ width: "70px", height: "56px", backgroundColor: "#1e293b", borderRadius: "12px", border: `2px solid ${mood === "shocked" ? "#ef4444" : mood === "happy" ? "#10b981" : "#38bdf8"}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", boxShadow: "inset 0 0 10px rgba(0,0,0,0.7)" }),
  screen: { width: "100%", height: "100%", backgroundColor: "#03040b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155" },
  eyesHappy: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#10b981", textShadow: "0 0 8px #10b981" },
  eyesShock: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#ef4444", textShadow: "0 0 8px #ef4444" },
  eyesThink: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#fb923c", textShadow: "0 0 8px #fb923c" },
  eyesIdle: { fontFamily: "monospace", fontWeight: "900", fontSize: "16px", color: "#38bdf8", textShadow: "0 0 8px #38bdf8" },
  titleBlock: { flex: 1 },
  copilotName: { fontSize: "14px", fontWeight: "900", color: "#c084fc", letterSpacing: "1px" },
  copilotSub: { fontSize: "11px", color: "#94a3b8", marginBottom: "8px" },
  mathRulesBtn: { width: "100%", padding: "10px 14px", backgroundColor: "#8b5cf6", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "0.5px", boxShadow: "0 0 12px rgba(139, 92, 246, 0.5)" },
  speechBubble: { backgroundColor: "#03040b", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px 14px" },
  copilotText: { fontSize: "14px", fontWeight: "bold", color: "#ffffff", lineHeight: "1.5", fontFamily: "'Segoe UI', Roboto, sans-serif" },
  errorAlertBox: { backgroundColor: "rgba(239, 68, 68, 0.15)", border: "2px solid #ef4444", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", gap: "10px", animation: "pulseWarning 1.5s infinite" }
};

// ==========================================
// 🛰️ CONTROLES TÁCTILES M1-M4
// ==========================================
function M1StepperControl({ equation, options, handleOptionClick, selectedOption }) {
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(1);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const stopInterval = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startInterval = useCallback((action) => {
    if (selectedOption !== null) return;
    stopInterval();
    action();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => { action(); }, 100);
    }, 350);
  }, [selectedOption, stopInterval]);

  useEffect(() => { return () => stopInterval(); }, [stopInterval]);

  const bindHoldEvents = (action) => ({
    onMouseDown: () => startInterval(action),
    onMouseUp: stopInterval,
    onMouseLeave: stopInterval,
    onTouchStart: (e) => { e.preventDefault(); startInterval(action); },
    onTouchEnd: stopInterval
  });

  useEffect(() => {
    if (selectedOption === null) { setNum(1); setDen(1); }
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
    if (num === 1 && den === 1) {
      handleOptionClick({ id: "W_WARN", correct: false, feedback: "Apretá ＋ y － para colocar la fracción calculada antes de sintonizar." });
      return;
    }

    const selectedFractionText = `${num}/${den}`;
    const matchingOption = options.find((opt) => opt.value.startsWith(selectedFractionText));

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
        <span style={m1Styles.refLabel}>📡 Canal Sonda A: <strong style={{ color: "#38bdf8" }}>{n1}/{D}</strong></span>
        <span style={m1Styles.refLabel}>🛸 Canal Sonda B: <strong style={{ color: "#c084fc" }}>{n2}/{D}</strong></span>
      </div>

      <div style={m1Styles.controlGrid}>
        <div style={m1Styles.stepperBox}>
          <div style={m1Styles.boxTitle}>AMPLITUD DE ONDA (Numerador)</div>
          <div style={m1Styles.ledDisplay}>{num}</div>
          <div style={m1Styles.buttonRow}>
            <button {...bindHoldEvents(() => setNum((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setNum((p) => (p < 30 ? p + 1 : 30)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">＋</button>
          </div>
        </div>

        <div style={m1Styles.stepperBox}>
          <div style={m1Styles.boxTitle}>CANAL DE ÓRBITA (Denominador)</div>
          <div style={m1Styles.ledDisplay}>{den}</div>
          <div style={m1Styles.buttonRow}>
            <button {...bindHoldEvents(() => setDen((p) => (p > 1 ? p - 1 : 1)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">－</button>
            <button {...bindHoldEvents(() => setDen((p) => (p < 30 ? p + 1 : 30)))} disabled={selectedOption !== null} style={m1Styles.stepBtn} type="button">＋</button>
          </div>
        </div>
      </div>

      <div style={m1Styles.previewScreen}>
        <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Frecuencia Sintonizada</div>
        <div style={m1Styles.previewFraction}>
          <span style={{ color: "#38bdf8" }}>{num}</span>
          <span style={{ color: "#334155", margin: "0 12px" }}>/</span>
          <span style={{ color: "#c084fc" }}>{den}</span>
        </div>
      </div>

      <button onClick={handleConfirm} disabled={selectedOption !== null} style={m1Styles.confirmBtn(selectedOption !== null)} type="button">
        🛰️ SINTONIZAR FRECUENCIA Y TRANSMITIR
      </button>
    </div>
  );
}

const m1Styles = {
  container: { backgroundColor: "#05091c", border: "2px solid #1e293b", borderRadius: "12px", padding: "20px", marginTop: "10px" },
  refBox: { display: "flex", justifyContent: "space-around", backgroundColor: "#02040e", padding: "10px", borderRadius: "8px", border: "1px solid #111827", marginBottom: "15px" },
  refLabel: { fontSize: "13px", fontWeight: "bold", color: "#94a3b8" },
  controlGrid: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px", width: "100%" },
  stepperBox: { backgroundColor: "#080d24", border: "1px solid #1e293b", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "180px" },
  boxTitle: { fontSize: "10px", fontWeight: "bold", color: "#64748b", letterSpacing: "0.5px", marginBottom: "10px", textAlign: "center" },
  ledDisplay: { fontSize: "32px", fontFamily: "monospace", fontWeight: "bold", color: "#38bdf8", backgroundColor: "#02040e", width: "75px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #1e293b", marginBottom: "12px" },
  buttonRow: { display: "flex", gap: "15px" },
  stepBtn: { width: "42px", height: "42px", borderRadius: "50%", border: "1px solid #38bdf8", backgroundColor: "rgba(56, 189, 248, 0.08)", color: "#38bdf8", fontSize: "22px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  previewScreen: { backgroundColor: "#02040e", border: "1px solid #111827", borderRadius: "8px", padding: "12px", textAlign: "center", marginBottom: "15px" },
  previewFraction: { fontSize: "32px", fontWeight: "bold", marginTop: "4px" },
  confirmBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#475569" : "#ffffff", border: "none", fontWeight: "bold", fontSize: "13px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

function M2TurbineControl({ options, handleOptionClick, selectedOption }) {
  const [selectedFrac, setSelectedFrac] = useState(null);

  useEffect(() => { if (selectedOption === null) setSelectedFrac(null); }, [selectedOption]);

  const handleConfirm = () => {
    if (!selectedFrac || selectedOption !== null) return;
    const matched = options.find((opt) => opt.value === selectedFrac);
    if (matched) handleOptionClick(matched);
  };

  return (
    <div style={m2Styles.container}>
      <p style={m2Styles.title}>🧪 SELECCIONA LA VÁLVULA DE CALIBRACIÓN DE COMBUSTIBLE:</p>
      <div style={m2Styles.turbinesGrid}>
        {options.map((opt) => {
          const isCurrent = selectedFrac === opt.value;
          return (
            <div key={opt.id} onClick={() => selectedOption === null && setSelectedFrac(opt.value)} style={m2Styles.turbineRing(isCurrent, selectedOption !== null)}>
              <div style={m2Styles.turbineCore(isCurrent)}>
                <div style={m2Styles.coreLed(isCurrent)} />
                <span style={m2Styles.turbineText(isCurrent)}>{opt.value}</span>
                <span style={m2Styles.turbineLetter}>VALV-{opt.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={handleConfirm} disabled={!selectedFrac || selectedOption !== null} style={m2Styles.ignitionBtn(!selectedFrac || selectedOption !== null)} type="button">
        🔥 INICIAR IGNICIÓN Y SELLAR NÚCLEO
      </button>
    </div>
  );
}

const m2Styles = {
  container: { backgroundColor: "rgba(5, 9, 28, 0.8)", border: "2px solid #334155", borderRadius: "14px", padding: "16px", marginTop: "10px" },
  title: { fontSize: "12px", color: "#94a3b8", fontWeight: "900", margin: "0 0 14px 0", letterSpacing: "0.5px" },
  turbinesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" },
  turbineRing: (active, disabled) => ({ width: "100%", aspectRatio: "1/1", borderRadius: "50%", backgroundColor: active ? "rgba(56, 189, 248, 0.25)" : "#02040e", border: `3px solid ${active ? "#38bdf8" : "#1e293b"}`, boxShadow: active ? "0 0 20px rgba(56, 189, 248, 0.6), inset 0 0 12px rgba(56, 189, 248, 0.5)" : "inset 0 0 10px rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }),
  turbineCore: (active) => ({ width: "80%", height: "78%", borderRadius: "50%", backgroundColor: active ? "#061a33" : "#0d1326", border: `2px solid ${active ? "#38bdf8" : "#334155"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }),
  coreLed: (active) => ({ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: active ? "#38bdf8" : "#475569", boxShadow: active ? "0 0 10px #38bdf8" : "none", marginBottom: "4px" }),
  turbineText: (active) => ({ fontSize: "18px", fontWeight: "900", color: active ? "#38bdf8" : "#ffffff", fontFamily: "'Courier New', monospace", letterSpacing: "1px", textShadow: active ? "0 0 8px #38bdf8" : "none" }),
  turbineLetter: { fontSize: "10px", fontWeight: "bold", color: "#64748b", marginTop: "2px", letterSpacing: "0.5px" },
  ignitionBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "bold", fontSize: "13px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

function M3OrbitalConsole({ options, handleOptionClick, selectedOption }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => { if (selectedOption === null) setActiveId(null); }, [selectedOption]);

  const handleConfirm = () => {
    if (!activeId || selectedOption !== null) return;
    const matched = options.find((opt) => opt.id === activeId);
    if (matched) handleOptionClick(matched);
  };

  return (
    <div style={m3MatrixStyles.container}>
      <p style={m3MatrixStyles.title}>🛸 CONSOLA DE ACOPLE: SELECCIONA EL MÓDULO DE FRECUENCIA</p>
      <div style={m3MatrixStyles.grid2x3}>
        {options.map((opt) => {
          const isSelected = activeId === opt.id;
          return (
            <div key={opt.id} onClick={() => selectedOption === null && setActiveId(opt.id)} style={m3MatrixStyles.podCard(isSelected, selectedOption !== null)}>
              <div style={m3MatrixStyles.podHeader}>
                <span style={m3MatrixStyles.podBadge(isSelected)}>{opt.id}</span>
                <div style={m3MatrixStyles.lockPin(isSelected)}>{isSelected ? "● ACOPLADO" : "○ LIBRE"}</div>
              </div>
              <div style={m3MatrixStyles.freqVal(isSelected)}>{opt.value}</div>
            </div>
          );
        })}
      </div>

      <button onClick={handleConfirm} disabled={!activeId || selectedOption !== null} style={m3MatrixStyles.engageBtn(!activeId || selectedOption !== null)} type="button">
        ⚡ ENLAZAR ÓRBITAS Y CONSOLIDAR ACOPLE
      </button>
    </div>
  );
}

const m3MatrixStyles = {
  container: { backgroundColor: "rgba(2, 23, 21, 0.8)", border: "2px solid #10b981", borderRadius: "14px", padding: "16px", marginTop: "10px" },
  title: { fontSize: "12px", color: "#6ee7b7", fontWeight: "900", margin: "0 0 12px 0", letterSpacing: "0.5px" },
  grid2x3: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  podCard: (active, disabled) => ({ display: "flex", flexDirection: "column", padding: "12px", borderRadius: "8px", border: `2px solid ${active ? "#10b981" : "#1e3a35"}`, backgroundColor: active ? "rgba(16, 185, 129, 0.2)" : "#020f0d", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }),
  podHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  podBadge: (active) => ({ fontSize: "11px", fontWeight: "900", backgroundColor: active ? "#10b981" : "#134e4a", color: active ? "#021715" : "#6ee7b7", padding: "2px 6px", borderRadius: "4px" }),
  lockPin: (active) => ({ fontSize: "10px", fontWeight: "bold", color: active ? "#10b981" : "#4b7c75" }),
  freqVal: (active) => ({ fontSize: "20px", fontWeight: "900", color: active ? "#6ee7b7" : "#ffffff", fontFamily: "'Courier New', monospace", textAlign: "center", padding: "4px 0" }),
  engageBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#64748b" : "#021715", border: "none", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

function M4ToggleSwitches({ options, onConfirm, disabled }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { setSelectedId(null); }, [options]);

  const handleExecute = () => {
    if (!selectedId || disabled) return;
    const chosen = options.find((o) => o.id === selectedId);
    if (chosen) onConfirm(chosen);
  };

  return (
    <div style={m4ToggleStyles.wrapper}>
      <p style={{ fontSize: "12px", color: "#fb923c", fontWeight: "bold", marginBottom: "10px" }}>
        🎯 SELECCIONÁ UNA DE LAS 6 OPCIONES DE RESPUESTA:
      </p>
      <div style={m4ToggleStyles.compactGrid}>
        {options.map((opt) => {
          const isFlipped = selectedId === opt.id;
          return (
            <div key={opt.id} onClick={() => !disabled && setSelectedId(opt.id)} style={m4ToggleStyles.switchPanel(isFlipped, disabled)}>
              <div style={m4ToggleStyles.contentBox}>
                <span style={m4ToggleStyles.idPill(isFlipped)}>{opt.id}</span>
                <span style={m4ToggleStyles.optText}>{opt.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={handleExecute} disabled={!selectedId || disabled} style={m4ToggleStyles.throttleBtn(!selectedId || disabled)} type="button">
        🚀 EMPUJAR ACELERADOR PRINCIPAL Y CONFIRMAR OPCIÓN
      </button>
    </div>
  );
}

const m4ToggleStyles = {
  wrapper: { marginTop: "10px" },
  compactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" },
  switchPanel: (active, disabled) => ({ display: "flex", alignItems: "center", padding: "14px", borderRadius: "10px", border: `2px solid ${active ? "#fb923c" : "#334155"}`, backgroundColor: active ? "rgba(251, 146, 60, 0.25)" : "#02040e", minHeight: "65px", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }),
  contentBox: { display: "flex", alignItems: "center", gap: "10px", flex: 1 },
  idPill: (active) => ({ fontSize: "13px", fontWeight: "900", backgroundColor: active ? "#fb923c" : "#1e293b", color: active ? "#020308" : "#fb923c", padding: "4px 8px", borderRadius: "6px" }),
  optText: { fontSize: "14px", lineHeight: "1.3", color: "#ffffff", fontWeight: "bold" },
  throttleBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 🌌 COMPONENTE PRINCIPAL (APP ALUMNO V4)
// ==========================================
export default function App() {
  const { playCorrect, playError, playRobotChat, playMissionDone, playBadge } = useGameFeedback();

  const shipName = "Halcón de las Sierras";
  const suitColor = "#38bdf8";

  // ONBOARDING SECUENCIAL (3 CARTELES OBLIGATORIOS)
  const [studentOnboarded, setStudentOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const [studentProfile, setStudentProfile] = useState({
    nickname: "",
    edad: "",
    curso: "",
    escuela: ""
  });

  const [missionXp, setMissionXp] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
  const [currentMissionErrors, setCurrentMissionErrors] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });

  const [floatingXp, setFloatingXp] = useState(null);
  const [activeMission, setActiveMission] = useState("m1");
  const [missionStatus, setMissionStatus] = useState({ m1: "activa", m2: "bloqueada", m3: "bloqueada", m4: "bloqueada" });

  const [currentLevelData, setCurrentLevelData] = useState(() => MathGenerator.generateM1());
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [badgeEarned, setBadgeEarned] = useState(false);

  // EDUBOT
  const [copilotMood, setCopilotMood] = useState("idle");
  const [copilotMsg, setCopilotMsg] = useState(
    "🧠 Tu calculadora mental no necesita pilas: usá hoja y lápiz para representar las partes de la unidad antes de tocar los mandos."
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
  const [teacherMessage] = useState("¡Buen viaje espacial, tripulante! Lee con atención cada señal.");

  const totalXp = missionXp.m1 + missionXp.m2 + missionXp.m3 + missionXp.m4;

  useEffect(() => {
    setBitacora([
      { time: new Date().toLocaleTimeString("es-AR"), action: "🟢 Conexión a cabina de vuelo Halcón de las Sierras.", type: "cidi" },
      { time: new Date().toLocaleTimeString("es-AR"), action: "🛰️ LRS Telemetría activado.", type: "system" }
    ]);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

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
    }
    setCopilotMood("idle");
    setCopilotMsg(
      "🧠 Tu calculadora mental no necesita pilas: usá hoja y lápiz para representar las partes de la unidad antes de tocar los mandos."
    );
  }, []);

  useEffect(() => {
    loadMissionData(activeMission);
  }, [activeMission, loadMissionData]);

  const triggerFloatingXp = (text, color) => {
    setFloatingXp({ text, color });
    setTimeout(() => setFloatingXp(null), 1600);
  };

  const triggerErrorWarning = (msg) => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setErrorWarning(msg);
    errorTimeoutRef.current = setTimeout(() => { setErrorWarning(null); }, 10000);
  };

  const registrarBitacora = (verb, action, type) => {
    const timestamp = new Date().toLocaleTimeString("es-AR");
    setBitacora((prev) => [
      { time: timestamp, action: `[xAPI:${verb.toUpperCase()}] ${action}`, type },
      ...prev
    ]);
  };

  // Botón REGLAS MATEMÁTICAS DE LA MISIÓN
  const handleShowMathRules = () => {
    playRobotChat();
    setCopilotMood("thinking");
    setHelpsRequested((prev) => prev + 1);

    let mathRule = "";
    if (activeMission === "m1") {
      mathRule = "📐 REGLA MATEMÁTICA N° 1 (Denominadores Iguales): Cuando los números de abajo son iguales, la base de la fracción no cambia. Solo sumás los números de arriba (numeradores). Ejemplo: 1/5 + 2/5 = 3/5.";
    } else if (activeMission === "m2") {
      mathRule = "📐 REGLA MATEMÁTICA N° 2 (Denominador Múltiplo): Para sumar fracciones con distinto denominador, primero debés amplificar la fracción menor multiplicando arriba y abajo para igualar la base antes de sumar.";
    } else if (activeMission === "m3") {
      mathRule = "📐 REGLA MATEMÁTICA N° 3 (Mínimo Común Múltiplo): Cuando los denominadores no son múltiplos directos, buscá el menor múltiplo común en las tablas de multiplicar para transformar ambas fracciones a la misma base y simplificá el resultado.";
    } else if (activeMission === "m4") {
      mathRule = "📐 REGLA MATEMÁTICA N° 4 (Fusión de 3 Fracciones y Comparación): Primero hallá el MCM entre los 3 denominadores, amplificá cada fracción a esa base común, sumá los 3 numeradores y finalmente compará el total contra el umbral pedido.";
    }

    setCopilotMsg(mathRule);
    registrarBitacora("math_rules", `Consultó Reglas Matemáticas en Misión ${activeMission.toUpperCase()}`, "system");
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
    setAttempts((prev) => prev + 1);
    setFeedback(option);

    if (option.correct) {
      playCorrect();
      setCopilotMood("happy");
      setCopilotMsg("¡Excelente razonamiento, comandante! Los sensores confirman el cálculo exacto.");
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

      } else {
        registrarBitacora("completed", `Superó Paso ${stepIndex + 1} de M4`, "success");
      }
    } else {
      playError();
      setCopilotMood("shocked");
      setCopilotMsg("¡Epa, casi sobrecargamos la turbina! Revisá los números en papel, no pasa nada.");

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
      }

      triggerErrorWarning("Revisá con lápiz y papel. Prohibido usar calculadora: ejercitá tu razonamiento paso a paso.");
      registrarBitacora("failed", `Desvío: ${option.errorCode || "ERR_GENERIC"} en Misión ${activeMission.toUpperCase()}`, "error");
      setTotalErrors((prev) => prev + 1);

      setTimeout(() => {
        if (activeMission !== "m4" && currentLevelData && currentLevelData.options) {
          setCurrentLevelData((prev) => ({ ...prev, options: prepareOptions(prev.options) }));
        } else if (activeMission === "m4" && m4StepsData && m4StepsData[stepIndex]) {
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
    if (m4StepsData && stepIndex < m4StepsData.length - 1) {
      setStepIndex((p) => p + 1);
      setSelectedOption(null);
      setFeedback(null);
      setCopilotMood("idle");
    } else {
      // M4 COMPLETADA -> OTORGAR INSIGNIA Y XP
      if (!badgeEarned) {
        const errorsM4 = currentMissionErrors.m4 || 0;
        const earnedM4 = Math.max(50, 200 - errorsM4 * 10);
        setMissionXp((prev) => ({ ...prev, m4: earnedM4 }));
        triggerFloatingXp(`+${earnedM4} XP Ganados`, "#4ade80");
        setBadgeEarned(true);
        playBadge();
        setMissionStatus((prev) => ({ ...prev, m4: "completada" }));
        playMissionDone();
        setCopilotMood("happy");
        setCopilotMsg("¡Aterrizaje épico! Te ganaste la insignia oficial de Ingeniero/a de Fusión Estelar.");
      } else {
        setMissionXp((prev) => {
          const current = prev.m4;
          const nextVal = Math.min(200, current + 20);
          triggerFloatingXp(`+${nextVal - current} XP Farmeado`, "#38bdf8");
          return { ...prev, m4: nextVal };
        });
      }
      registrarBitacora("badge_earned", "🏆 Insignia acreditada: Ingeniero/a de Fusión Estelar", "success");
    }
  };

  const handleRegenerate = () => {
    playRobotChat();
    loadMissionData(activeMission);
    setCopilotMood("thinking");
    setCopilotMsg("¡Nuevos números cargados! Resolvé correctamente para farmear hasta el tope de la misión.");
    registrarBitacora("practiced", `Re-entrenando ${activeMission.toUpperCase()} con nuevos datos.`, "system");
  };

  return (
    <div style={getMissionBackground("alumno", activeMission)}>
      <style>{`
        @keyframes floatUpFade { 0% { opacity: 1; transform: translateY(0px) scale(1); } 100% { opacity: 0; transform: translateY(-35px) scale(1.2); } }
        @keyframes pulseWarning { 0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); } 50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); } }
      `}</style>

      {/* 🪐 ONBOARDING 1: ENCUADRE Y REGLAS */}
      {!studentOnboarded && onboardingStep === 1 && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "460px" }}>
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
        </div>
      )}

      {/* 🚀 ONBOARDING 2: FICHA DE LA TRIPULACIÓN (REGISTRO) */}
      {!studentOnboarded && onboardingStep === 2 && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "460px" }}>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8" }}>
              <span>🚀</span> FICHA DE LA TRIPULACIÓN
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px", lineHeight: "1.4" }}>
              Completá tus datos de piloto para registrar tus avances en la base de datos oficial:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px", textAlign: "left" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", display: "block", marginBottom: "4px" }}>
                  Nick / Apodo de Vuelo (Sin nombre completo):
                </label>
                <input 
                  type="text" 
                  value={studentProfile.nickname} 
                  onChange={(e) => setStudentProfile({ ...studentProfile, nickname: e.target.value })}
                  placeholder="Ej: Marto_05 (NO uses tu nombre real)"
                  style={styles.profileInput}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", display: "block", marginBottom: "4px" }}>Edad:</label>
                  <input 
                    type="text" 
                    value={studentProfile.edad} 
                    onChange={(e) => setStudentProfile({ ...studentProfile, edad: e.target.value })}
                    placeholder="Ej: 12 años"
                    style={styles.profileInput}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", display: "block", marginBottom: "4px" }}>Año / Curso:</label>
                  <input 
                    type="text" 
                    value={studentProfile.curso} 
                    onChange={(e) => setStudentProfile({ ...studentProfile, curso: e.target.value })}
                    placeholder="Ej: 1° Año B"
                    style={styles.profileInput}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", display: "block", marginBottom: "4px" }}>Escuela:</label>
                <input 
                  type="text" 
                  value={studentProfile.escuela} 
                  onChange={(e) => setStudentProfile({ ...studentProfile, escuela: e.target.value })}
                  placeholder="Ej: IPEM 128"
                  style={styles.profileInput}
                />
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "#c084fc", fontStyle: "italic", marginBottom: "16px" }}>
              ¡Gracias por sumarte a estas misiones que van a ser parte de una gran aventura! 🚀
            </p>

            <button 
              onClick={() => {
                if (!studentProfile.nickname.trim()) {
                  alert("Por favor ingresá un apodo o nick para continuar.");
                  return;
                }
                setStudentOnboarded(true);
                setShowInstructionModal(true);
                playRobotChat();
              }}
              style={{ ...styles.parentModalBtn, backgroundColor: "#10b981", color: "#ffffff" }}
              type="button"
            >
              🚀 ¡INICIAR DESPEGUE!
            </button>
          </div>
        </div>
      )}

      {/* 🗺️ ONBOARDING 3: MAPA DE NAVEGACIÓN Y EXPLICACIÓN DE MISIONES */}
      {showInstructionModal && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "540px", textAlign: "left" }}>
            <div style={{ ...styles.parentModalTitle, color: "#38bdf8", justifyContent: "flex-start" }}>
              <span>🗺️</span> TU MAPA DE NAVEGACIÓN ESPACIAL
            </div>
            
            <p style={{ fontSize: "13px", color: "#f1f5f9", lineHeight: "1.5", marginBottom: "14px" }}>
              ¡Hola <strong>{studentProfile.nickname || "Piloto"}</strong>! Antes de tomar los mandos, tené en cuenta cómo funciona tu tablero de misiones:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <div style={styles.instructionBox}>
                <span style={{ fontSize: "20px" }}>🌲</span>
                <div>
                  <strong style={{ color: "#38bdf8" }}>Árbol de Misiones:</strong> Avanzás paso a paso desde la Misión 1 hasta la Misión 4 de Cierre para obtener tu Insignia.
                </div>
              </div>

              <div style={styles.instructionBox}>
                <span style={{ fontSize: "20px" }}>🔄</span>
                <div>
                  <strong style={{ color: "#4ade80" }}>Reintentos Libres:</strong> Si un desvío te resta algo de XP, podés volver a reintentar y farmear las misiones para recuperar todo tu puntaje.
                </div>
              </div>

              <div style={styles.instructionBox}>
                <span style={{ fontSize: "20px" }}>💡</span>
                <div>
                  <strong style={{ color: "#c084fc" }}>Pistas Sin Penalización:</strong> Presionar el botón de <strong>Reglas Matemáticas</strong> de EduBot NO te resta experiencia.
                </div>
              </div>

              <div style={styles.instructionBox}>
                <span style={{ fontSize: "20px" }}>📝</span>
                <div>
                  <strong style={{ color: "#fb923c" }}>Tablero de Papel:</strong> Tené siempre a mano papel y lápiz para resolver las cuentas antes de presionar los botones.
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowInstructionModal(false);
                playRobotChat();
              }}
              style={{ ...styles.parentModalBtn, backgroundColor: "#38bdf8" }}
              type="button"
            >
              ENTENDIDO, ¡IR AL CENTRO DE MANDOS! 🚀
            </button>
          </div>
        </div>
      )}

      {/* CABINA DE JUEGO */}
      <div style={styles.gameWrapper}>
        <div style={styles.gameHeader}>
          <div>
            <h1 style={{ ...styles.gameTitle, color: suitColor }}>Odisea Espacial: Galaxia Fracciones</h1>
            <p style={styles.gameSubtitle}>
              Nave: <strong>{shipName}</strong> · Piloto: <strong>{studentProfile.nickname || "Piloto"}</strong> ({studentProfile.curso || "1° Año"})
            </p>
          </div>
          <div style={styles.sessionStatus}>
            <span style={styles.activePill}>🟢 EN LÍNEA</span>
            <span style={styles.timerPill}>⏱️ {timerSeconds}s</span>
          </div>
        </div>

        {/* BARRA DE XP Y MAPA TÁCTICO */}
        <div style={styles.progressionCard}>
          <div style={styles.xpHeader}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={styles.xpBigLabel}>EXPERIENCIA GANADA EN MISIONES LOGRADAS:</span>
              <span style={styles.xpBigValue}>{totalXp} / 500 XP</span>
            </div>
            {floatingXp && (
              <span style={{ fontSize: "16px", fontWeight: "900", color: floatingXp.color, animation: "floatUpFade 1.4s ease-out forwards" }}>
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

          {/* MAPA TÁCTICO DE MISIÓN */}
          <div style={styles.tacticalMap}>
            {[
              { key: "m1", title: "M1: RADAR DE SEÑALES", icon: "🛰️", cap: 100 },
              { key: "m2", title: "M2: CÁLCULO DE VÁLVULAS", icon: "🚀", cap: 100 },
              { key: "m3", title: "M3: ENLACE ÓRBITAS", icon: "🛸", cap: 100 }
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
                    <span style={{ fontSize: "26px" }}>👑</span>
                    <span style={{ fontSize: "13px", fontWeight: "900", color: "#fb923c" }}>{missionXp.m4}/200 XP</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "900", color: "#fb923c", margin: "6px 0", letterSpacing: "0.5px" }}>
                    M4: TRAYECTORIA FINAL
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
          <div style={styles.gameColumn}>
            
            {activeMission !== "m4" ? (
              currentLevelData && (
                <div style={styles.card}>
                  <h2 style={{ ...styles.cardTitle, color: suitColor }}>
                    Nivel en Curso: Misión {activeMission.toUpperCase()}
                  </h2>

                  {/* NARRATIVA Y CONSIGNA QUE COINCIDE EXACTAMENTE CON LA CUENTA */}
                  <div style={styles.narrativeBox}>
                    <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "#f1f5f9", fontWeight: "bold" }}>
                      📖 {currentLevelData.narrative}
                    </p>
                  </div>
                  
                  <div style={styles.equationBox}>
                    {currentLevelData.equation}
                  </div>

                  {activeMission === "m1" ? (
                    <M1StepperControl
                      equation={currentLevelData.equation}
                      options={currentLevelData.options}
                      handleOptionClick={handleOptionClick}
                      selectedOption={selectedOption}
                    />
                  ) : activeMission === "m2" ? (
                    <M2TurbineControl
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
                        {feedback.correct ? "🛰️ COMBINACIÓN EXITOSA" : "⚠ ADVERTENCIA DE DESVÍO (-10 XP)"}
                      </p>
                      <p style={{ fontSize: "13px", margin: "4px 0 0 0", color: "#cbd5e1" }}>{feedback.feedback}</p>

                      {!feedback.correct && feedback.errorCode && (
                        <div style={styles.expertAlert}>
                          <strong>Recomendación:</strong> {SYSTEM_EXPERT_ALERTS[feedback.errorCode]}
                        </div>
                      )}
                    </div>
                  )}

                  {missionStatus[activeMission] === "completada" && (
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                      <button onClick={handleRegenerate} style={styles.farmBtn}>
                        🔁 Cargar nuevos números para farmear Misión {activeMission.toUpperCase()} (hasta 100 XP)
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* MISIÓN DE CIERRE M4 PROCEDURAL CON 6 OPCIONES */
              m4StepsData && m4StepsData[stepIndex] && (
                <div style={{ ...styles.card, border: "2px solid #fb923c" }}>
                  <div style={styles.closingHeader}>
                    <h2 style={{ ...styles.cardTitle, color: "#fb923c" }}>🚀 Misión de Cierre: Trayectoria Final</h2>
                    <span style={styles.badgePill}>PASO {stepIndex + 1} DE 3</span>
                  </div>

                  <div style={styles.m4PromptBox}>
                    <p style={{ margin: 0, fontSize: "16px", color: "#ffffff", fontWeight: "bold", lineHeight: "1.5" }}>
                      {m4StepsData[stepIndex].prompt}
                    </p>
                  </div>

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
                        {feedback.correct ? "🛰️ PASO COMPLETADO" : "⚠ ALERTA DE PRESIÓN"}
                      </p>
                      <p style={{ fontSize: "13px", margin: "4px 0 0 0", color: "#cbd5e1" }}>{feedback.feedback}</p>

                      {feedback.correct && (
                        <button onClick={handleNextStepM4} style={styles.btnPrimary}>
                          {stepIndex < m4StepsData.length - 1 ? `Avanzar al Paso ${stepIndex + 2} ➔` : "Aterrizar Nave e Inscribir Insignia 🏆"}
                        </button>
                      )}
                    </div>
                  )}

                  {badgeEarned && (
                    <div style={styles.rewardCard}>
                      <h3 style={{ color: "#fb923c", margin: "0 0 6px 0" }}>🏆 ¡INVENTARIO Y MAESTRÍA LOGRADA!</h3>
                      <p style={{ fontSize: "13px", color: "#e2e8f0", margin: "0 0 14px 0", lineHeight: "1.4" }}>
                        Demostraste un dominio conceptual de la suma de fracciones y comparación de magnitudes. Podés farmear esta misión para obtener hasta 200 XP.
                      </p>
                      <button onClick={handleRegenerate} style={styles.farmBtn}>
                        🔁 Cargar nuevos números para farmear M4 (hasta 200 XP)
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* COLUMNA DERECHA: EDUBOT Y TELEMETRÍA */}
          <div style={styles.bitacoraColumn}>
            <EduBotCopilot
              mood={copilotMood}
              message={copilotMsg}
              onShowMathRules={handleShowMathRules}
              errorWarning={errorWarning}
            />

            <div style={styles.bitacoraCard}>
              <div style={styles.bitacoraHeader}>
                <h3 style={styles.bitacoraTitle}>📋 Telemetría LRS (Cockpit)</h3>
                <span style={styles.cidiMockLabel}>Vínculo Pilotín</span>
              </div>
              <p style={styles.bitacoraMeta}>
                Piloto: <strong>{studentProfile.nickname || "Martín G."}</strong> · Nave: <strong style={{ color: suitColor }}>{shipName}</strong><br />
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

            {/* TRANSMISIÓN EN VIVO DE LA PROFE */}
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
// 🎨 ESTILOS GENERALES
// ==========================================
function getMissionBackground(view, activeMission) {
  let bg = "radial-gradient(circle at 50% 10%, #0c1a3d 0%, #030818 45%, #020308 90%)";
  if (activeMission === "m1") {
    bg = "radial-gradient(circle at 50% 15%, #032b43 0%, #021422 45%, #01060a 100%)";
  } else if (activeMission === "m2") {
    bg = "radial-gradient(circle at 50% 15%, #2a0845 0%, #150526 45%, #03020a 100%)";
  } else if (activeMission === "m3") {
    bg = "radial-gradient(circle at 50% 15%, #052e2b 0%, #021715 45%, #010807 100%)";
  } else if (activeMission === "m4") {
    bg = "radial-gradient(circle at 50% 15%, #3d1c04 0%, #1a0c02 45%, #050200 100%)";
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

const styles = {
  parentModalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(2, 3, 8, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
  parentModalCard: { width: "100%", maxWidth: "460px", backgroundColor: "#080d24", borderRadius: "16px", border: "2px solid #38bdf8", padding: "24px", boxShadow: "0 0 35px rgba(56, 189, 248, 0.4)", textAlign: "center", color: "#cbd5e1" },
  parentModalTitle: { color: "#38bdf8", fontSize: "16px", fontWeight: "900", marginBottom: "14px", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  rulesList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", textAlign: "left" },
  ruleItem: { display: "flex", gap: "12px", backgroundColor: "#02040e", padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "13px", alignItems: "center" },
  ruleIcon: { fontSize: "20px" },
  parentModalBtn: { width: "100%", padding: "14px", backgroundColor: "#38bdf8", color: "#020308", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "14px", boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)" },
  profileInput: { width: "100%", padding: "10px 12px", backgroundColor: "#02040e", border: "1px solid #334155", borderRadius: "6px", color: "#ffffff", fontSize: "13px", boxSizing: "border-box" },
  instructionBox: { display: "flex", gap: "12px", backgroundColor: "#02040e", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "13px", alignItems: "flex-start", lineHeight: "1.4" },
  gameWrapper: { padding: "10px" },
  gameHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "20px" },
  gameTitle: { fontSize: "22px", margin: 0, fontWeight: "bold" },
  gameSubtitle: { fontSize: "12px", margin: "4px 0 0 0", color: "#64748b" },
  sessionStatus: { display: "flex", gap: "8px" },
  activePill: { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#4ade80", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", border: "1px solid #10b981" },
  timerPill: { backgroundColor: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", border: "1px solid #64748b" },
  progressionCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "16px", border: "1px solid #1e293b", marginBottom: "20px" },
  xpHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  xpBigLabel: { fontSize: "13px", color: "#cbd5e1", fontWeight: "bold" },
  xpBigValue: { fontSize: "24px", fontWeight: "900", color: "#38bdf8", textShadow: "0 0 10px rgba(56, 189, 248, 0.5)" },
  progressBarBg: { height: "26px", backgroundColor: "#02040e", borderRadius: "13px", overflow: "hidden", border: "2px solid #334155", boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)", marginBottom: "16px" },
  progressBarFill: { height: "100%", borderRadius: "13px", transition: "width 0.5s ease-in-out", background: "linear-gradient(90deg, #10b981, #38bdf8)" },
  glowingInsigniaCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", backgroundColor: "rgba(251, 146, 60, 0.05)", border: "2px solid #fb923c", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 0 20px rgba(251, 146, 60, 0.3)" },
  insigniaTitle: { color: "#fb923c", fontWeight: "900", fontSize: "15px", letterSpacing: "1px", textTransform: "uppercase" },
  insigniaSubtitle: { color: "#94a3b8", fontSize: "11px", fontWeight: "bold", marginTop: "2px" },
  tacticalMap: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" },
  tacticalNode: (isAct, status) => ({ backgroundColor: isAct ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 4, 14, 0.7)", border: `1px solid ${isAct ? "#38bdf8" : status === "completada" ? "#10b981" : "#1e293b"}`, borderRadius: "8px", padding: "12px 10px", textAlign: "left", cursor: status === "bloqueada" ? "not-allowed" : "pointer", opacity: status === "bloqueada" ? 0.4 : 1, boxShadow: isAct ? "0 0 12px rgba(56, 189, 248, 0.3)" : "none" }),
  tacticalNodeM4: (isAct, status) => ({ backgroundColor: isAct ? "rgba(251, 146, 60, 0.2)" : "rgba(2, 4, 14, 0.7)", border: `2px solid ${isAct ? "#fb923c" : status === "completada" ? "#10b981" : "rgba(251, 146, 60, 0.6)"}`, borderRadius: "8px", padding: "12px 10px", textAlign: "left", cursor: status === "bloqueada" ? "not-allowed" : "pointer", opacity: status === "bloqueada" ? 0.4 : 1, boxShadow: isAct ? "0 0 15px rgba(251, 146, 60, 0.4)" : "none" }),
  tacticalNodeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusPill: (st) => ({ fontSize: "10px", fontWeight: "900", color: st === "completada" ? "#4ade80" : st === "bloqueada" ? "#64748b" : "#38bdf8" }),
  mainLayout: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" },
  gameColumn: { display: "flex", flexDirection: "column", gap: "10px" },
  card: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "20px", border: "1px solid #1e293b" },
  cardTitle: { fontSize: "14px", margin: "0 0 8px 0", textTransform: "uppercase" },
  narrativeBox: { backgroundColor: "#02040e", borderLeft: "4px solid #38bdf8", borderRadius: "8px", padding: "14px", marginBottom: "14px" },
  equationBox: { backgroundColor: "#02040e", padding: "16px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center", fontSize: "28px", fontWeight: "bold", color: "#ffffff", marginBottom: "14px" },
  feedbackCard: { padding: "12px", borderRadius: "6px", border: "1px solid", marginTop: "12px" },
  expertAlert: { fontSize: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px", marginTop: "6px", color: "#cbd5e1" },
  farmBtn: { padding: "12px 20px", backgroundColor: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", boxShadow: "0 0 10px rgba(56, 189, 248, 0.3)" },
  closingHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  badgePill: { backgroundColor: "rgba(251, 146, 60, 0.1)", color: "#fb923c", border: "1px solid #fb923c", padding: "3px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" },
  m4PromptBox: { backgroundColor: "#02040e", padding: "16px", borderRadius: "10px", border: "1px solid #fb923c", fontSize: "16px", color: "#ffffff", marginBottom: "14px", lineHeight: "1.5", fontWeight: "bold" },
  btnPrimary: { width: "100%", padding: "12px", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", fontSize: "13px" },
  rewardCard: { marginTop: "16px", padding: "16px", backgroundColor: "rgba(139, 92, 246, 0.08)", border: "2px solid #8b5cf6", borderRadius: "10px", textAlign: "center" },
  bitacoraColumn: { display: "flex", flexDirection: "column" },
  bitacoraCard: { backgroundColor: "rgba(5, 9, 28, 0.75)", borderRadius: "10px", padding: "14px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", maxHeight: "250px", marginBottom: "14px" },
  bitacoraHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "6px", marginBottom: "8px" },
  bitacoraTitle: { fontSize: "11px", margin: 0, color: "#4ade80", fontWeight: "bold" },
  cidiMockLabel: { fontSize: "9px", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "4px", border: "1px solid #38bdf8" },
  bitacoraMeta: { fontSize: "10px", color: "#64748b", margin: "0 0 8px 0", lineHeight: "1.3" },
  bitacoraConsole: { backgroundColor: "#02040e", borderRadius: "6px", padding: "8px", fontFamily: "monospace", fontSize: "10px", overflowY: "auto", flex: 1, border: "1px solid #111827" },
  consoleRow: { marginBottom: "4px", lineHeight: "1.3" },
  consoleTime: { color: "#64748b" },
  teacherAdviceStudentCard: { backgroundColor: "rgba(139, 92, 246, 0.08)", border: "1px solid #8b5cf6", borderRadius: "10px", padding: "12px 14px", boxShadow: "0 0 10px rgba(139, 92, 246, 0.15)" }
};

