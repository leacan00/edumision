import React, { useState, useEffect, useRef, useCallback } from "react";

// ==========================================
// 🛠️ MOTOR MATEMÁTICO PROCEDIMENTAL (M1 - M4)
// ==========================================
function prepareOptions(optionsList) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const copy = [...optionsList];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.map((opt, idx) => ({ ...opt, id: letters[idx] || `${idx + 1}` }));
}

const MathGenerator = {
  generateM1() {
    const denoms = [5, 6, 7, 8, 9, 10, 12];
    const D = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (D / 2 - 1)) + 1;
    const sumN = n1 + n2;

    const raw = [
      { value: `${sumN}/${D}`, correct: true, feedback: `¡Señal sintonizada! Con igual canal orbital (${D}) sumamos numeradores: ${n1} + ${n2} = ${sumN}.` },
      { value: `${sumN}/${D + D}`, correct: false, errorCode: "ERR_DIRECT", feedback: `Alerta: Sumaste denominadores (${D}+${D}=${D + D}). En el mismo canal, el denominador no cambia.` },
      { value: `${n1}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la primera sonda. No olvides sumar la segunda.` },
      { value: `${n2}/${D}`, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo registraste la segunda sonda. Falta la inicial.` },
      { value: `${n1 * n2}/${D}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Multiplicaste los numeradores en vez de sumarlos.` },
      { value: `${sumN}/${D * 2 + 2}`, correct: false, errorCode: "ERR_GENERIC", feedback: `Frecuencia no coincidente con el canal orbital.` }
    ];

    return { equation: `${n1}/${D} + ${n2}/${D} = ?`, n1, n2, D, options: prepareOptions(raw) };
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
    const raw = [
      { value: choice.correct, correct: true, feedback: `¡Válvula calibrada! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `No sumes directamente denominadores (${choice.d1}+${choice.d2}). Buscá la base común.` },
      { value: choice.errPartial, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo cargaste el primer depósito. Te falta el auxiliar.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Multiplicaste denominadores sin amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Solo cargaste el depósito auxiliar sin el principal.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Flujo sobrecargado. Revisá la proporción con lápiz y papel.` }
    ];

    return { equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
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
    const raw = [
      { value: choice.displayCorrect, correct: true, feedback: `¡Órbitas enlazadas! ${choice.fb}` },
      { value: choice.errDirect, correct: false, errorCode: "ERR_DIRECT", feedback: `Sumar directo no sirve cuando las frecuencias orbitales difieren.` },
      { value: choice.errLcd, correct: false, errorCode: "ERR_LCD", feedback: `Buscaste base común pero olvidaste amplificar numeradores.` },
      { value: choice.d1Val, correct: false, errorCode: "ERR_PARTIAL", feedback: `Falta enlazar la trayectoria del segundo módulo.` },
      { value: choice.d2Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Frecuencia distorsionada. Revisá la simplificación con lápiz y papel.` },
      { value: choice.d3Val, correct: false, errorCode: "ERR_GENERIC", feedback: `Desvío en el cálculo del mínimo común múltiplo.` }
    ];

    return { equation: `${choice.n1}/${choice.d1} + ${choice.n2}/${choice.d2} = ?`, d1: choice.d1, d2: choice.d2, options: prepareOptions(raw) };
  },

  generateM4() {
    // 5 Variaciones de Soporte Vital y Reserva de Agua
    const variants = [
      {
        theme: "Soporte Vital: Depósitos Octales de Agua",
        steps: [
          {
            title: "Paso 1: Mínimo Común Denominador de Tanques",
            prompt: "Tres tanques de reciclaje alimentan el agua de la cabina: Tanque A aporta 1/2, Tanque B 1/4 y Tanque C 1/8. ¿Cuál es el mínimo común denominador entre 2, 4 y 8?",
            rawOptions: [
              { value: "8", correct: true, feedback: "¡Correcto! 8 es el menor múltiplo común entre 2, 4 y 8." },
              { value: "16", correct: false, errorCode: "ERR_LCD", feedback: "16 es múltiplo pero no es el MÍNIMO común denominador." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 no es múltiplo de 4 ni de 8." },
              { value: "4", correct: false, errorCode: "ERR_LCD", feedback: "4 no sirve para convertir octavos." }
            ]
          },
          {
            title: "Paso 2: Suma Total de Reservas",
            prompt: "Convertí todos los tanques a octavos y sumalos: 1/2 + 1/4 + 1/8 = (4/8 + 2/8 + 1/8). ¿Cuál es la suma total?",
            rawOptions: [
              { value: "7/8", correct: true, feedback: "¡Excelente! 4/8 + 2/8 + 1/8 = 7/8 de reserva purificada." },
              { value: "3/14", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores linealmente (1+1+1 sobre 2+4+8)." },
              { value: "6/8", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar el aporte de uno de los tanques." },
              { value: "3/8", correct: false, errorCode: "ERR_LCD", feedback: "Olvidaste amplificar los numeradores al cambiar la base a octavos." }
            ]
          },
          {
            title: "Paso 3: Evaluación de Margen para Caminata Espacial",
            prompt: "El protocolo exige disponer de al menos 3/4 (6/8) de agua para autorizar la salida. Tenés 7/8 cargados. ¿Alcanza el suministro?",
            rawOptions: [
              { value: "Sí, alcanza y sobra 1/8 de margen", correct: true, feedback: "¡Correcto! 7/8 es mayor que 6/8 (3/4). Hay agua suficiente." },
              { value: "No alcanza, falta agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Compará 7/8 contra 3/4 (convertido a 6/8)." },
              { value: "Es exactamente igual", correct: false, errorCode: "ERR_COMPARE", feedback: "7/8 es strictly mayor a 6/8." },
              { value: "No se puede determinar", correct: false, errorCode: "ERR_COMPARE", feedback: "Con el mismo denominador (8) se comparan directo los numeradores." }
            ]
          },
          {
            title: "Paso 4: Justificación Científica",
            prompt: "¿Cómo justificás técnicamente la decisión de autorizar la caminata espacial?",
            rawOptions: [
              { value: "Convertí 3/4 a 6/8 y comprobé que la reserva acumulada de 7/8 supera el mínimo exigido.", correct: true, justificationType: "Master", feedback: "¡Justificación impecable de nivel Comandante!" },
              { value: "A ojo en la pantalla se veía que el tanque estaba casi lleno.", correct: true, justificationType: "Intuitive", feedback: "Intuición correcta, pero recordá respaldar con cuentas." },
              { value: "Resté 7 menos 6 y me dio 1, así que supuse que alcanzaba.", correct: false, justificationType: "Failed", errorCode: "ERR_DIRECT", feedback: "Operar números aislados sin contexto de fracción no es suficiente." }
            ]
          }
        ]
      },
      {
        theme: "Soporte Vital: Reciclado de Hidroponia",
        steps: [
          {
            title: "Paso 1: Denominador Común del Invernadero",
            prompt: "El purificador recupera agua de 3 sectores: Sector 1 (1/3), Sector 2 (1/6) y Sector 3 (5/12). ¿Cuál es el mínimo común denominador entre 3, 6 y 12?",
            rawOptions: [
              { value: "12", correct: true, feedback: "¡Correcto! 12 es el MCM de 3, 6 y 12." },
              { value: "24", correct: false, errorCode: "ERR_LCD", feedback: "24 es múltiplo pero no es el MÍNIMO." },
              { value: "18", correct: false, errorCode: "ERR_LCD", feedback: "18 no es múltiplo de 12." },
              { value: "6", correct: false, errorCode: "ERR_LCD", feedback: "6 no alcanza para convertir doceavos." }
            ]
          },
          {
            title: "Paso 2: Suma de Caudales Recuperados",
            prompt: "Convertí a doceavos y sumá: 1/3 (4/12) + 1/6 (2/12) + 5/12. ¿Cuál es el total?",
            rawOptions: [
              { value: "11/12", correct: true, feedback: "¡Muy bien! 4/12 + 2/12 + 5/12 = 11/12." },
              { value: "7/21", correct: false, errorCode: "ERR_DIRECT", feedback: "Sumaste numeradores y denominadores en línea recta." },
              { value: "9/12", correct: false, errorCode: "ERR_PARTIAL", feedback: "Te faltó sumar uno de los sectores." },
              { value: "7/12", correct: false, errorCode: "ERR_LCD", feedback: "Error al amplificar las fracciones a doceavos." }
            ]
          },
          {
            title: "Paso 3: Verificación de Nivel para Riego",
            prompt: "Se requiere un mínimo de 5/6 (10/12) para habilitar el riego. Teniendo 11/12, ¿se autoriza?",
            rawOptions: [
              { value: "Sí, se autoriza (11/12 supera el mínimo de 10/12)", correct: true, feedback: "¡Correcto! 11/12 > 10/12." },
              { value: "No, no alcanza el agua", correct: false, errorCode: "ERR_COMPARE", feedback: "5/6 equivale a 10/12. 11/12 es superior." },
              { value: "Falta la mitad del agua", correct: false, errorCode: "ERR_COMPARE", feedback: "Solo falta 1/12 para el tanque lleno." },
              { value: "Son equivalentes", correct: false, errorCode: "ERR_COMPARE", feedback: "11/12 es mayor que 10/12." }
            ]
          },
          {
            title: "Paso 4: Justificación Científica",
            prompt: "¿Cuál es el sustento matemático de esta habilitación?",
            rawOptions: [
              { value: "Al pasar 5/6 a doceavos (10/12), se observa que 11/12 supera el requerimiento por 1/12.", correct: true, justificationType: "Master", feedback: "¡Argumentación lógica perfecta!" },
              { value: "Calculé que 11 de 12 es casi todo el tanque.", correct: true, justificationType: "Intuitive", feedback: "Buena estimación intuitiva." },
              { value: "Sumé 5 más 6 y dio 11.", correct: false, justificationType: "Failed", errorCode: "ERR_DIRECT", feedback: "Coincidencia numérica engañosa. Recordá comparar fracciones con base común." }
            ]
          }
        ]
      },
      {
        theme: "Soporte Vital: Condensadores de Emergencia",
        steps: [
          {
            title: "Paso 1: MCM de Condensación",
            prompt: "Filtro A (2/5), Filtro B (1/2) y Filtro C (1/10). ¿MCM entre 5, 2 y 10?",
            rawOptions: [
              { value: "10", correct: true, feedback: "¡Correcto! 10 es el mínimo común múltiplo." },
              { value: "20", correct: false, errorCode: "ERR_LCD", feedback: "20 es múltiplo pero no el mínimo." },
              { value: "15", correct: false, errorCode: "ERR_LCD", feedback: "15 no es múltiplo de 2." },
              { value: "5", correct: false, errorCode: "ERR_LCD", feedback: "5 no sirve para décimos." }
            ]
          },
          {
            title: "Paso 2: Condensación Total Acumulada",
            prompt: "Suma en décimos: 2/5 (4/10) + 1/2 (5/10) + 1/10 = ?",
            rawOptions: [
              { value: "10/10 (1 entero, Tanque Lleno)", correct: true, feedback: "¡Perfecto! 4/10 + 5/10 + 1/10 = 10/10." },
              { value: "4/17", correct: false, errorCode: "ERR_DIRECT", feedback: "Suma directa prohibida." },
              { value: "8/10", correct: false, errorCode: "ERR_PARTIAL", feedback: "Suma incompleta de los filtros." },
              { value: "4/10", correct: false, errorCode: "ERR_LCD", feedback: "Olvidaste transformar las fracciones." }
            ]
          },
          {
            title: "Paso 3: Evaluación de Maniobra",
            prompt: "Se requiere al menos 4/5 (8/10). Con 10/10 cargados, ¿hay suficiente agua?",
            rawOptions: [
              { value: "Sí, la capacidad está al 100% y supera el 4/5 requerido", correct: true, feedback: "¡Capacidad máxima alcanzada!" },
              { value: "No alcanza", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 es el máximo posible." },
              { value: "Falta un décimo", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 está completo." },
              { value: "Indeterminado", correct: false, errorCode: "ERR_COMPARE", feedback: "10/10 > 8/10." }
            ]
          },
          {
            title: "Paso 4: Justificación",
            prompt: "¿Cuál es el motivo técnico?",
            rawOptions: [
              { value: "Al tener 10/10 la reserva está completa (100%), superando el 80% (8/10) necesario.", correct: true, justificationType: "Master", feedback: "¡Excelente dominio!" },
              { value: "Se nota porque no entra más agua en el tanque.", correct: true, justificationType: "Intuitive", feedback: "Cálculo práctico aceptado." },
              { value: "Multipliqué 4 por 2 y dio 8.", correct: false, justificationType: "Failed", errorCode: "ERR_GENERIC", feedback: "Atención: la justificación debe respaldarse en la suma de fracciones." }
            ]
          }
        ]
      }
    ];

    const chosen = variants[Math.floor(Math.random() * variants.length)];
    return chosen.steps.map((st) => ({
      ...st,
      options: prepareOptions(st.rawOptions)
    }));
  }
};

const SYSTEM_EXPERT_ALERTS = {
  ERR_DIRECT: "🛠️ Propuesta para el cuaderno: representar en tiras de papel por qué los denominadores no se suman.",
  ERR_PARTIAL: "🍳 Consejo: usar elementos concretos en mesa para no olvidar ninguna parte de la suma.",
  ERR_LCD: "🧩 Consejo: repasar las tablas de multiplicar de los denominadores para hallar la base común.",
  ERR_COMPARE: "🥤 Consejo: convertir ambas fracciones al mismo denominador antes de comparar."
};

// ==========================================
// 🔊 MÓDULO DE AUDIO (SINTETIZADOR WEB AUDIO)
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
    } catch (e) {
      console.warn(e);
    }
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
    } catch (e) {
      console.warn(e);
    }
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
    } catch (e) {
      console.warn(e);
    }
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
    } catch (e) {
      console.warn(e);
    }
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
    } catch (e) {
      console.warn(e);
    }
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
    top: 0, left: 0, right: 0, bottom: 0,
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
// 🤖 EDUBOT COPILOTO
// ==========================================
function EduBotCopilot({ mood, message, onClickHelp, errorWarning }) {
  return (
    <div style={astroStyles.container}>
      <div style={astroStyles.header}>
        <div style={astroStyles.robotBody}>
          <div style={astroStyles.antenna}>
            <div style={astroStyles.antennaLight(mood)} />
          </div>
          <div style={astroStyles.head(mood)}>
            <div style={astroStyles.screen}>
              {mood === "happy" && <span style={astroStyles.eyesHappy}>^ ‿ ^</span>}
              {mood === "shocked" && <span style={astroStyles.eyesShock}>O ⍜ O</span>}
              {mood === "thinking" && <span style={astroStyles.eyesThink}>o _ O</span>}
              {mood === "idle" && <span style={astroStyles.eyesIdle}>• _ •</span>}
            </div>
          </div>
        </div>

        <div style={astroStyles.titleBlock}>
          <div style={astroStyles.copilotName}>🤖 EDUBOT (Copiloto)</div>
          <div style={astroStyles.copilotSub}>IA de Asistencia a Bordo</div>
          <button onClick={onClickHelp} style={astroStyles.hintBtn} type="button">
            💡 Pedir pista a EduBot
          </button>
        </div>
      </div>

      <div style={astroStyles.speechBubble}>
        <div style={astroStyles.copilotText}>{message}</div>
      </div>

      {errorWarning && (
        <div style={astroStyles.errorAlertBox}>
          <span style={{ fontSize: "22px" }}>📝⚠️</span>
          <div style={{ fontSize: "12px", color: "#fca5a5", lineHeight: "1.4", fontFamily: "monospace" }}>
            <strong style={{ color: "#ffffff" }}>¡ALERTA DE EDUBOT!</strong><br />
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
  copilotText: { fontSize: "13px", fontWeight: "bold", color: "#ffffff", lineHeight: "1.5", fontFamily: "'Segoe UI', Roboto, sans-serif" },
  errorAlertBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }
};

// ==========================================
// 🛰️ CONTROL M1: STEPPERS TÁCTILES
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
      intervalRef.current = setInterval(() => {
        action();
      }, 100);
    }, 350);
  }, [selectedOption, stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const bindHoldEvents = (action) => ({
    onMouseDown: () => startInterval(action),
    onMouseUp: stopInterval,
    onMouseLeave: stopInterval,
    onTouchStart: (e) => {
      e.preventDefault();
      startInterval(action);
    },
    onTouchEnd: stopInterval
  });

  useEffect(() => {
    if (selectedOption === null) {
      setNum(1);
      setDen(1);
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
    if (num === 1 && den === 1) {
      handleOptionClick({ id: "W_WARN", correct: false, feedback: "Debes colocar el número correspondiente apretando ＋ y － para sintonizar." });
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
        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Frecuencia Sintonizada</div>
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
  refLabel: { fontSize: "12px", fontWeight: "bold", color: "#94a3b8" },
  controlGrid: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px", width: "100%" },
  stepperBox: { backgroundColor: "#080d24", border: "1px solid #1e293b", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "180px" },
  boxTitle: { fontSize: "9px", fontWeight: "bold", color: "#64748b", letterSpacing: "0.5px", marginBottom: "10px", textAlign: "center" },
  ledDisplay: { fontSize: "32px", fontFamily: "monospace", fontWeight: "bold", color: "#38bdf8", backgroundColor: "#02040e", width: "70px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #1e293b", marginBottom: "12px" },
  buttonRow: { display: "flex", gap: "15px" },
  stepBtn: { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #38bdf8", backgroundColor: "rgba(56, 189, 248, 0.08)", color: "#38bdf8", fontSize: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  previewScreen: { backgroundColor: "#02040e", border: "1px solid #111827", borderRadius: "8px", padding: "12px", textAlign: "center", marginBottom: "15px" },
  previewFraction: { fontSize: "30px", fontWeight: "bold", marginTop: "4px" },
  confirmBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#475569" : "#ffffff", border: "none", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 🚀 CONTROL M2: BOTONES REDONDOS DE TURBINA
// ==========================================
function M2TurbineControl({ options, handleOptionClick, selectedOption }) {
  const [selectedFrac, setSelectedFrac] = useState(null);

  useEffect(() => {
    if (selectedOption === null) setSelectedFrac(null);
  }, [selectedOption]);

  const handleConfirm = () => {
    if (!selectedFrac || selectedOption !== null) return;
    const matched = options.find((opt) => opt.value === selectedFrac);
    if (matched) handleOptionClick(matched);
  };

  return (
    <div style={m2Styles.container}>
      <p style={m2Styles.title}>🧪 SELECCIONA EL NÚCLEO DE INYECCIÓN DE LA TURBINA:</p>
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
  title: { fontSize: "11px", color: "#94a3b8", fontWeight: "900", margin: "0 0 14px 0", letterSpacing: "0.5px" },
  turbinesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "16px" },
  turbineRing: (active, disabled) => ({
    width: "100%", aspectRatio: "1/1", borderRadius: "50%",
    backgroundColor: active ? "rgba(56, 189, 248, 0.25)" : "#02040e",
    border: `3px solid ${active ? "#38bdf8" : "#1e293b"}`,
    boxShadow: active ? "0 0 20px rgba(56, 189, 248, 0.6), inset 0 0 12px rgba(56, 189, 248, 0.5)" : "inset 0 0 10px rgba(0,0,0,0.8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer"
  }),
  turbineCore: (active) => ({
    width: "78%", height: "78%", borderRadius: "50%",
    backgroundColor: active ? "#061a33" : "#0d1326",
    border: `2px solid ${active ? "#38bdf8" : "#334155"}`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
  }),
  coreLed: (active) => ({ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: active ? "#38bdf8" : "#475569", marginBottom: "4px" }),
  turbineText: (active) => ({ fontSize: "18px", fontWeight: "900", color: active ? "#38bdf8" : "#ffffff", fontFamily: "'Courier New', monospace" }),
  turbineLetter: { fontSize: "9px", fontWeight: "bold", color: "#64748b", marginTop: "2px" },
  ignitionBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "bold", fontSize: "12px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 🛸 CONTROL M3: CONSOLA DE ACOPLE (2×3)
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
      <p style={m3MatrixStyles.title}>🛸 CONSOLA DE ACOPLE: SELECCIONA EL MÓDULO DE FRECUENCIA</p>
      <div style={m3MatrixStyles.grid2x3}>
        {options.map((opt) => {
          const isSelected = activeId === opt.id;
          return (
            <div key={opt.id} onClick={() => selectedOption === null && setActiveId(opt.id)} style={m3MatrixStyles.podCard(isSelected, selectedOption !== null)}>
              <div style={m3MatrixStyles.podHeader}>
                <span style={m3MatrixStyles.podBadge(isSelected)}>{opt.id}</span>
                <div style={m3MatrixStyles.lockPin(isSelected)}>
                  {isSelected ? "● ACOPLADO" : "○ LIBRE"}
                </div>
              </div>
              <div style={m3MatrixStyles.freqVal(isSelected)}>
                {opt.value}
              </div>
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
  title: { fontSize: "11px", color: "#6ee7b7", fontWeight: "900", margin: "0 0 12px 0" },
  grid2x3: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  podCard: (active, disabled) => ({
    display: "flex", flexDirection: "column", padding: "10px 12px", borderRadius: "8px",
    border: `2px solid ${active ? "#10b981" : "#1e3a35"}`,
    backgroundColor: active ? "rgba(16, 185, 129, 0.2)" : "#020f0d",
    cursor: disabled ? "not-allowed" : "pointer"
  }),
  podHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  podBadge: (active) => ({ fontSize: "10px", fontWeight: "900", backgroundColor: active ? "#10b981" : "#134e4a", color: active ? "#021715" : "#6ee7b7", padding: "2px 6px", borderRadius: "4px" }),
  lockPin: (active) => ({ fontSize: "9px", fontWeight: "bold", color: active ? "#10b981" : "#4b7c75" }),
  freqVal: (active) => ({ fontSize: "18px", fontWeight: "900", color: active ? "#6ee7b7" : "#ffffff", fontFamily: "'Courier New', monospace", textAlign: "center" }),
  engageBtn: (disabled) => ({ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: disabled ? "rgba(16, 185, 129, 0.2)" : "#10b981", color: disabled ? "#64748b" : "#021715", border: "none", fontWeight: "900", fontSize: "12px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 🎯 CONTROL M4: PALANCAS TÁCTICAS BASCULANTES
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
            <div key={opt.id} onClick={() => !disabled && setSelectedId(opt.id)} style={m4ToggleStyles.switchPanel(isFlipped, disabled)}>
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

      <button onClick={handleExecute} disabled={!selectedId || disabled} style={m4ToggleStyles.throttleBtn(!selectedId || disabled)} type="button">
        🚀 EMPUJAR ACELERADOR PRINCIPAL Y CONFIRMAR ORDEN
      </button>
    </div>
  );
}

const m4ToggleStyles = {
  wrapper: { marginTop: "10px" },
  compactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" },
  switchPanel: (active, disabled) => ({
    display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px",
    border: `2px solid ${active ? "#fb923c" : "#334155"}`,
    backgroundColor: active ? "rgba(251, 146, 60, 0.2)" : "#02040e",
    cursor: disabled ? "not-allowed" : "pointer"
  }),
  leverAssembly: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  leverBase: { width: "18px", height: "26px", backgroundColor: "#1e293b", borderRadius: "9px", border: "1px solid #475569", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  leverHandle: (active) => ({ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: active ? "#fb923c" : "#64748b", transform: active ? "translateY(-6px)" : "translateY(6px)", transition: "transform 0.2s ease" }),
  leverLed: (active) => ({ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: active ? "#fb923c" : "#334155" }),
  contentBox: { display: "flex", alignItems: "center", gap: "6px", flex: 1, overflow: "hidden" },
  idPill: { fontSize: "10px", fontWeight: "900", backgroundColor: "#1e293b", color: "#fb923c", padding: "2px 5px", borderRadius: "4px" },
  optText: { fontSize: "11px", lineHeight: "1.3", color: "#ffffff", fontWeight: "600" },
  throttleBtn: (disabled) => ({ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: disabled ? "rgba(251, 146, 60, 0.2)" : "#fb923c", color: disabled ? "#64748b" : "#020308", border: "none", fontWeight: "900", fontSize: "12px", cursor: disabled ? "not-allowed" : "pointer" })
};

// ==========================================
// 🌌 APLICACIÓN PRINCIPAL (MÓDULO ALUMNO DEDICADO)
// ==========================================
export default function App() {
  const { playCorrect, playError, playRobotChat, playMissionDone, playBadge } = useGameFeedback();

  // Generar o recuperar UUID único permanente para la alumna/o
  const [studentUuid] = useState(() => {
    if (typeof window !== "undefined") {
      let savedUuid = localStorage.getItem("edumision_student_uuid");
      if (!savedUuid) {
        savedUuid = "student-" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("edumision_student_uuid", savedUuid);
      }
      return savedUuid;
    }
    return "student-demo-123";
  });

  // Estado del Onboarding (Carteles iniciales)
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [studentOnboarded, setStudentOnboarded] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edumision_student_onboarded") === "true";
    }
    return false;
  });

  // Ficha de Tripulación
  const [studentProfile, setStudentProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumision_student_profile");
      if (saved) return JSON.parse(saved);
    }
    return { nick: "", edad: "", curso: "", escuela: "" };
  });

  // Modal Explicativo del Árbol al Iniciar Misión
  const [showMissionTreeModal, setShowMissionTreeModal] = useState(false);

  // Estados del juego
  const [transitionPhase, setTransitionPhase] = useState(false);
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
  const [interestLogged, setInterestLogged] = useState(false);

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

  // Bitácora y telemetría xAPI
  const [bitacora, setBitacora] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef(null);
  const [helpsRequested, setHelpsRequested] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [helpsPerMission, setHelpsPerMission] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
  const [errorsPerMission, setErrorsPerMission] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });

  const totalXp = missionXp.m1 + missionXp.m2 + missionXp.m3 + missionXp.m4;

  const registrarBitacora = useCallback((verb, action, type) => {
    const timestamp = new Date().toLocaleTimeString("es-AR");
    setBitacora((prev) => [
      { time: timestamp, action: `[xAPI:${verb.toUpperCase()}] ${action}`, type },
      ...prev
    ]);

    // Envío silencioso al servidor LRS (/api/lrs)
    try {
      fetch("/api/lrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: { name: studentProfile.nick || "Piloto", uuid: studentUuid },
          verb: { id: verb, display: { "es-AR": verb } },
          object: { id: activeMission, description: action },
          xp: totalXp,
          helpsRequested: helpsRequested,
          errorsCount: totalErrors,
          helpsPerMission: helpsPerMission,
          errorsPerMission: errorsPerMission,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch (e) {}
  }, [studentProfile.nick, studentUuid, activeMission, totalXp, helpsRequested, totalErrors, helpsPerMission, errorsPerMission]);

  // Temporizador y Bitácora Inicial
  useEffect(() => {
    setBitacora([
      { time: new Date().toLocaleTimeString("es-AR"), action: "🟢 Conexión a cabina espacial activa.", type: "cidi" },
      { time: new Date().toLocaleTimeString("es-AR"), action: `🛰️ LRS Telemetría activado con UUID: ${studentUuid.slice(0, 12)}.`, type: "system" }
    ]);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [studentUuid]);

  // Carga de Misiones
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
    registrarBitacora("started", `Inició trayectoria: Misión ${activeMission.toUpperCase()}`, "system");
  }, [activeMission, loadMissionData, registrarBitacora]);

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

  const handleOptionClick = (option) => {
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
      } else {
        triggerFloatingXp("-10 XP Potencial", "#fb923c");
      }

      triggerErrorWarning("Revisá con lápiz y papel. Prohibido usar calculadora: ejercitá tu razonamiento paso a paso.");

      registrarBitacora("failed", `Desvío: ${option.errorCode || "ERR_GENERIC"} en Misión ${activeMission.toUpperCase()}`, "error");
      setTotalErrors((prev) => prev + 1);
      setErrorsPerMission((prev) => ({ ...prev, [activeMission]: (prev[activeMission] || 0) + 1 }));

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
      playCorrect();
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
        setCopilotMsg("¡Aterrizaje épico! Te ganaste la insignia de Ingeniero/a de Fusión.");
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
    setCopilotMsg("¡Nuevas coordenadas cargadas! Resolvé correctamente para farmear hasta el tope de la misión.");
    registrarBitacora("practiced", `Re-entrenando ${activeMission.toUpperCase()} para recuperar puntos.`, "system");
  };

  const handleCopilotHelpClick = () => {
    playRobotChat();
    setCopilotMood("thinking");
    setHelpsRequested((prev) => prev + 1);
    setHelpsPerMission((prev) => ({ ...prev, [activeMission]: (prev[activeMission] || 0) + 1 }));

    let hint = "";
    if (activeMission === "m1") hint = "💡 Pista EduBot: Con igual denominador (el de abajo), solo sumá los números de arriba y mantené la misma base.";
    else if (activeMission === "m2") hint = "💡 Pista EduBot: Buscá llevar la fracción de menor denominador a la base de la otra antes de sumar.";
    else if (activeMission === "m3") hint = "💡 Pista EduBot: Buscá el mínimo común múltiplo en las tablas de multiplicar y simplificá al final dividiendo por un divisor común.";
    else if (activeMission === "m4") hint = "💡 Pista EduBot: Calculá cuánto le falta al numerador para llegar al entero completo.";

    setCopilotMsg(hint);
    registrarBitacora("help", `Consultó pista en Misión ${activeMission.toUpperCase()} (sin restar XP)`, "system");
  };

  const handleLogInterest = () => {
    setInterestLogged(true);
    playCorrect();
    registrarBitacora("interest_registered", "El alumno solicitó continuar a la Expedición Interdisciplinaria", "success");
  };

  const handleCompleteProfile = () => {
    if (!studentProfile.nick.trim()) {
      alert("Por favor ingresá un apodo o Nick para continuar.");
      return;
    }
    localStorage.setItem("edumision_student_onboarded", "true");
    localStorage.setItem("edumision_student_profile", JSON.stringify(studentProfile));
    setStudentOnboarded(true);
    setShowMissionTreeModal(true);
    playRobotChat();
  };

  return (
    <div style={getMissionBackground(activeMission)}>
      <style>{`
        @keyframes floatUpFade {
          0% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-35px) scale(1.2); }
        }
      `}</style>

      {/* 🪐 ONBOARDING 1: ENCUADRE Y REGLAS (4 PUNTOS LIMPIOS) */}
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

      {/* 🚀 ONBOARDING 2: FICHA DE LA TRIPULACIÓN */}
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
                <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                  Nick / Apodo de Vuelo:
                </label>
                <input
                  type="text"
                  value={studentProfile.nick}
                  onChange={(e) => setStudentProfile({ ...studentProfile, nick: e.target.value })}
                  placeholder="Ej: Marto_05 (NO uses tu nombre completo)"
                  style={styles.profileInput}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Edad:
                  </label>
                  <input
                    type="text"
                    value={studentProfile.edad}
                    onChange={(e) => setStudentProfile({ ...studentProfile, edad: e.target.value })}
                    placeholder="Ej: 12 años"
                    style={styles.profileInput}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Año / Curso:
                  </label>
                  <input
                    type="text"
                    value={studentProfile.curso}
                    onChange={(e) => setStudentProfile({ ...studentProfile, curso: e.target.value })}
                    placeholder="Ej: 1° B"
                    style={styles.profileInput}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                  Escuela:
                </label>
                <input
                  type="text"
                  value={studentProfile.escuela}
                  onChange={(e) => setStudentProfile({ ...studentProfile, escuela: e.target.value })}
                  placeholder="Ej: IPEM 128"
                  style={styles.profileInput}
                />
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "#38bdf8", fontStyle: "italic", marginBottom: "16px" }}>
              "¡Gracias por sumarte a estas misiones que van a ser parte de una gran aventura!"
            </p>

            <button 
              onClick={handleCompleteProfile}
              style={{ ...styles.parentModalBtn, backgroundColor: "#10b981", color: "#ffffff" }}
              type="button"
            >
              🚀 ¡INICIAR DESPEGUE!
            </button>
          </div>
        </div>
      )}

      {/* 🌲 MODAL 3: EXPLICACIÓN DEL ÁRBOL DE MISIONES */}
      {showMissionTreeModal && (
        <div style={styles.parentModalOverlay}>
          <div style={{ ...styles.parentModalCard, maxWidth: "480px" }}>
            <div style={{ ...styles.parentModalTitle, color: "#10b981" }}>
              <span>🗺️</span> TU MAPA DE NAVEGACIÓN ESPACIAL
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px", textAlign: "left" }}>
              <div style={styles.ruleItem}>
                <span style={{ fontSize: "20px" }}>🌲</span>
                <div style={{ fontSize: "12px" }}>
                  <strong>Árbol de Misiones:</strong> Avanzás paso a paso desde la M1 hasta la M4 de Cierre.
                </div>
              </div>

              <div style={styles.ruleItem}>
                <span style={{ fontSize: "20px" }}>🔄</span>
                <div style={{ fontSize: "12px" }}>
                  <strong>Reintento Libre:</strong> Si cometés un error, podés reintentar para recuperar todo el XP de la misión.
                </div>
              </div>

              <div style={styles.ruleItem}>
                <span style={{ fontSize: "20px" }}>💡</span>
                <div style={{ fontSize: "12px" }}>
                  <strong>Pistas Sin Penalización:</strong> Pedir ayuda a EduBot <strong>NO resta XP</strong>. Solo queda registrado en la bitácora.
                </div>
              </div>

              <div style={styles.ruleItem}>
                <span style={{ fontSize: "20px" }}>📝</span>
                <div style={{ fontSize: "12px" }}>
                  <strong>Cuentas en Papel:</strong> Tené siempre listo papel y lápiz antes de presionar los botones.
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowMissionTreeModal(false);
                playRobotChat();
              }}
              style={{ ...styles.parentModalBtn, backgroundColor: "#10b981" }}
              type="button"
            >
              🛰️ ¡ENTRAR A LA CABINA!
            </button>
          </div>
        </div>
      )}

      {/* 🌌 EFECTO DE TRANSICIÓN HIPERESPACIAL */}
      {transitionPhase && <HyperspaceJump />}

      {/* 🧭 BARRA DE ENCABEZADO */}
      <nav style={styles.navBar}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoEll}>EM</span> 
          <span>EduMisión Córdoba · <strong style={{ color: "#38bdf8" }}>{studentProfile.nick || "Piloto"}</strong></span>
        </div>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>Escuela: <strong>{studentProfile.escuela || "Sin registrar"}</strong></span>
          <span style={styles.activePill}>🟢 CABINA AUTÓNOMA</span>
        </div>
      </nav>

      {/* JUEGO PRINCIPAL */}
      <div style={styles.gameWrapper}>
        <div style={styles.gameHeader}>
          <div>
            <h1 style={{ ...styles.gameTitle, color: "#38bdf8" }}>Odisea Espacial: Galaxia Fracciones</h1>
            <p style={styles.gameSubtitle}>Piloto: <strong>{studentProfile.nick || "Martín G."}</strong> · Curso: {studentProfile.curso || "1° Año"}</p>
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
              { key: "m1", title: "M1: SINTONÍA RADAR", icon: "🛰️", cap: 100 },
              { key: "m2", title: "M2: VÁLVULAS DE FLUJO", icon: "🚀", cap: 100 },
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
                    M4: CRUCERO FINAL
                  </div>
                  <div style={{ ...styles.statusPill(st), color: st === "completada" ? "#4ade80" : "#fb923c" }}>
                    {st === "completada" ? "🏆 MAESTRÍA LOGRADA" : isAct ? "🔥 MISIÓN ACTIVA" : st === "bloqueada" ? "🔒 BLOQUEADA" : "LISTA"}
                  </div>
                </button>
              );
            })()}
          </div>
        </div>

        {/* ÁREA CENTRAL DE JUEGO */}
        <div style={styles.mainLayout}>
          <div style={styles.gameColumn}>
            {activeMission !== "m4" ? (
              currentLevelData && (
                <div style={styles.card}>
                  <h2 style={{ ...styles.cardTitle, color: "#38bdf8" }}>Nivel en Curso: Misión {activeMission.toUpperCase()}</h2>
                  <p style={styles.instructions}>
                    {activeMission === "m1" && "Dos señales orbitales laten en la misma frecuencia. Sintonizá los mandos para fijar la base."}
                    {activeMission === "m2" && "Calibrá las válvulas de inyección para combinar el combustible de ambos depósitos."}
                    {activeMission === "m3" && "Enlazá las órbitas simplificando la fracción al valor más puro para acoplar los módulos."}
                  </p>
                  
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
                        🔁 Cargar nuevos números para farmear (hasta 100 XP)
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              m4StepsData && m4StepsData[stepIndex] && (
                <div style={{ ...styles.card, border: "2px solid #fb923c" }}>
                  <div style={styles.closingHeader}>
                    <h2 style={{ ...styles.cardTitle, color: "#fb923c" }}>🚀 Misión de Cierre: Trayectoria Final</h2>
                    <span style={styles.badgePill}>PASO {stepIndex + 1} DE 4</span>
                  </div>
                  
                  <h3 style={{ fontSize: "14px", color: "#38bdf8", margin: "0 0 8px 0" }}>
                    {m4StepsData[stepIndex].title}
                  </h3>

                  <div style={styles.m4PromptBox}>
                    {m4StepsData[stepIndex].prompt}
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
                        {feedback.correct ? "🛰️ AJUSTE CONFIRMADO" : "⚠ ALERTA DE PRESIÓN"}
                      </p>
                      <p style={{ fontSize: "13px", margin: "4px 0 0 0", color: "#cbd5e1" }}>{feedback.feedback}</p>
                      
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
                          ✨ ¡Anotado, tripulante! Registramos tu interés en la base de datos oficial.
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

          {/* COLUMNA DERECHA: EDUBOT Y BITÁCORA */}
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
                <span style={styles.cidiMockLabel}>Vínculo Directo</span>
              </div>
              <p style={styles.bitacoraMeta}>
                Piloto: <strong>{studentProfile.nick || "Martín G."}</strong> · UUID: <strong style={{ color: "#38bdf8" }}>{studentUuid.slice(0, 10)}...</strong>
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
          </div>
        </div>
      </div>
    </div>
  );
}

function getMissionBackground(activeMission) {
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
  parentModalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(2, 3, 8, 0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px"
  },
  parentModalCard: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#080d24",
    borderRadius: "16px",
    border: "2px solid #38bdf8",
    padding: "20px 24px",
    boxShadow: "0 0 30px rgba(56, 189, 248, 0.35)",
    textAlign: "center",
    color: "#cbd5e1"
  },
  parentModalTitle: {
    color: "#38bdf8",
    fontSize: "15px",
    fontWeight: "900",
    marginBottom: "12px",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  rulesList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px", textAlign: "left" },
  ruleItem: { display: "flex", gap: "10px", backgroundColor: "#02040e", padding: "8px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px", alignItems: "center" },
  ruleIcon: { fontSize: "18px" },
  parentModalBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#38bdf8",
    color: "#020308",
    border: "none",
    borderRadius: "8px",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "13px",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)"
  },
  profileInput: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#02040e",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "12px",
    boxSizing: "border-box"
  },
  navBar: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#070c22", padding: "10px 20px", borderBottom: "1px solid #1e293b", marginBottom: "16px" },
  navLogo: { fontWeight: "bold", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" },
  navLogoEll: { backgroundColor: "#38bdf8", color: "#020308", padding: "4px 8px", fontWeight: "900", borderRadius: "4px", fontSize: "12px" },
  activePill: { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#4ade80", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", border: "1px solid #10b981" },
  timerPill: { backgroundColor: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", border: "1px solid #64748b" },
  gameWrapper: { padding: "10px" },
  gameHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "20px" },
  gameTitle: { fontSize: "22px", margin: 0, fontWeight: "bold" },
  gameSubtitle: { fontSize: "12px", margin: "4px 0 0 0", color: "#64748b" },
  sessionStatus: { display: "flex", gap: "8px" },
  progressionCard: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "16px", border: "1px solid #1e293b", marginBottom: "20px" },
  xpHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  xpBigLabel: { fontSize: "13px", color: "#cbd5e1", fontWeight: "bold" },
  xpBigValue: { fontSize: "24px", fontWeight: "900", color: "#38bdf8" },
  progressBarBg: { height: "26px", backgroundColor: "#02040e", borderRadius: "13px", overflow: "hidden", border: "2px solid #334155", marginBottom: "16px" },
  progressBarFill: { height: "100%", borderRadius: "13px", transition: "width 0.5s ease-in-out", background: "linear-gradient(90deg, #10b981, #38bdf8)" },
  glowingInsigniaCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", backgroundColor: "rgba(251, 146, 60, 0.05)", border: "2px solid #fb923c", borderRadius: "12px", padding: "16px", marginBottom: "16px" },
  insigniaTitle: { color: "#fb923c", fontWeight: "900", fontSize: "15px", letterSpacing: "1px", textTransform: "uppercase" },
  insigniaSubtitle: { color: "#94a3b8", fontSize: "11px", fontWeight: "bold", marginTop: "2px" },
  tacticalMap: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" },
  tacticalNode: (isAct, status) => ({
    backgroundColor: isAct ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 4, 14, 0.7)",
    border: `1px solid ${isAct ? "#38bdf8" : status === "completada" ? "#10b981" : "#1e293b"}`,
    borderRadius: "8px", padding: "12px 10px", textAlign: "left",
    cursor: status === "bloqueada" ? "not-allowed" : "pointer",
    opacity: status === "bloqueada" ? 0.4 : 1
  }),
  tacticalNodeM4: (isAct, status) => ({
    backgroundColor: isAct ? "rgba(251, 146, 60, 0.2)" : "rgba(2, 4, 14, 0.7)",
    border: `2px solid ${isAct ? "#fb923c" : status === "completada" ? "#10b981" : "rgba(251, 146, 60, 0.6)"}`,
    borderRadius: "8px", padding: "12px 10px", textAlign: "left",
    cursor: status === "bloqueada" ? "not-allowed" : "pointer",
    opacity: status === "bloqueada" ? 0.4 : 1
  }),
  tacticalNodeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusPill: (st) => ({ fontSize: "10px", fontWeight: "900", color: st === "completada" ? "#4ade80" : st === "bloqueada" ? "#64748b" : "#38bdf8" }),
  mainLayout: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" },
  gameColumn: { display: "flex", flexDirection: "column", gap: "10px" },
  card: { backgroundColor: "rgba(7, 12, 34, 0.75)", borderRadius: "10px", padding: "20px", border: "1px solid #1e293b" },
  cardTitle: { fontSize: "14px", margin: "0 0 8px 0", textTransform: "uppercase" },
  instructions: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.4", marginBottom: "12px" },
  equationBox: { backgroundColor: "#02040e", padding: "16px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "14px" },
  feedbackCard: { padding: "12px", borderRadius: "6px", border: "1px solid", marginTop: "12px" },
  expertAlert: { fontSize: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px", marginTop: "6px", color: "#cbd5e1" },
  farmBtn: { padding: "10px 18px", backgroundColor: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  closingHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  badgePill: { backgroundColor: "rgba(251, 146, 60, 0.1)", color: "#fb923c", border: "1px solid #fb923c", padding: "3px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" },
  m4PromptBox: { backgroundColor: "#02040e", padding: "14px", borderRadius: "8px", border: "1px solid #fb923c", fontSize: "13px", color: "#ffffff", marginBottom: "12px", lineHeight: "1.4" },
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
  consoleText: { fontSize: "10px" }
};
