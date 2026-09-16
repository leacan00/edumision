import React, { useState } from "react";

// ==========================================
// 📚 FICHA PEDAGÓGICA Y OBJETIVOS DE MISIONES (POPUP DOCENTE)
// ==========================================
const MISSION_PEDAGOGICAL_INFO = {
  m1: {
    title: "Misión 1: Reserva de Agua Vital",
    subtitle: "Suma de Fracciones con Igual Denominador",
    action: "Luego de un simulacro paso a paso con EduBot (con la ecuación 1/5 + 2/5 = 3/5 visible), los alumnos operan de forma autónoma seleccionando la respuesta entre 6 opciones.",
    objectives: "Comprender la suma homogénea: cuando las partes de la unidad son iguales (mismo denominador), la base se conserva intacta y solo se suman los numeradores de arriba (1 + 2 = 3).",
    evidence: "Evidencia que el estudiante distingue el rol del numerador (partes) y del denominador (base) sin incurrir en el desvío común de sumar denominadores directo (ERR_DIRECT)."
  },
  m2: {
    title: "Misión 2: Mezcla de Combustible",
    subtitle: "Suma con Denominadores Múltiples Simples",
    action: "Luego de un simulador de numerador con denominador común prefijado (1/3 + 1/6 = ?/6), los alumnos resuelven sumas heterogéneas con resultados irreducibles.",
    objectives: "Identificar y calcular el menor común denominador (LCM) para unificar las bases de medición antes de sumar.",
    evidence: "Evidencia si el estudiante logra realizar la conversión previa de fracciones equivalentes o si tiende a sumar en línea recta numeradores y denominadores."
  },
  m3: {
    title: "Misión 3: Acople de Víveres y Raciones",
    subtitle: "Suma y Simplificación a Fracción Irreducible",
    action: "Luego de un simulador conceptual de simplificación (3/6 → 1/2), los alumnos resuelven sumas donde cada resultado exige simplificarse obligatoriamente.",
    objectives: "Dominar la simplificación dividiendo numerador y denominador por factores comunes hasta obtener la versión irreducible.",
    evidence: "Evidencia la capacidad de llevar una suma a su expresión matemática estándar irreducible sin detenerse en el resultado intermedio."
  },
  m4: {
    title: "Misión 4: Travesía Integrada de Despegue",
    subtitle: "Suma Triple + Simplificación + Comparación y Justificación",
    action: "Secuencia integradora en 3 partes sin simulacro pasivo: Parte 1 (Suma triple), Parte 2 (Simplificación), Parte 3 (Comparación de magnitudes y justificación científica).",
    objectives: "Integrar el corpus completo de saberes desarrollados en el módulo aplicando razonamiento crítico para argumentar decisiones sobre recursos.",
    evidence: "Evidencia la capacidad de razonamiento científico y argumentativo (Maestría / Intuición), permitiendo acreditar la insignia final de Fusión Estelar."
  }
};

const INITIAL_STUDENTS = [
  {
    id: 1, name: "Martín G.", shipName: "Halcón de las Sierras", uuid: "7a3b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    xp: 750, badgeEarned: true, interestRegistered: true, helpsRequested: 0, errorsCount: 0,
    justificationQuality: "Master",
    missions: {
      m1: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 2, name: "Sofía V.", shipName: "Centella Alfa", uuid: "8b4c3d2e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    xp: 250, badgeEarned: false, interestRegistered: true, helpsRequested: 1, errorsCount: 4,
    justificationQuality: null,
    missions: {
      m1: { status: "completado", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_DIRECT" },
      m2: { status: "en_curso", attempts: 3, helps: 0, errors: 3, lastErrorCode: "ERR_DIRECT" },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 3, name: "Facundo S.", shipName: "Meteoro Austral", uuid: "9c5d4e3f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    xp: 450, badgeEarned: false, interestRegistered: false, helpsRequested: 2, errorsCount: 3,
    justificationQuality: null,
    missions: {
      m1: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completado", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_PARTIAL" },
      m3: { status: "completado", attempts: 3, helps: 1, errors: 2, lastErrorCode: "ERR_LCD" },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 4, name: "Valentina R.", shipName: "Cóndor Estelar", uuid: "1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
    xp: 750, badgeEarned: true, interestRegistered: true, helpsRequested: 0, errorsCount: 0,
    justificationQuality: "Master",
    missions: {
      m1: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 5, name: "Tomás B.", shipName: "Rayo Cba", uuid: "2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b",
    xp: 100, badgeEarned: false, interestRegistered: false, helpsRequested: 2, errorsCount: 2,
    justificationQuality: null,
    missions: {
      m1: { status: "completado", attempts: 3, helps: 2, errors: 2, lastErrorCode: "ERR_PARTIAL" },
      m2: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 6, name: "Camila O.", shipName: "Pampa Orbital", uuid: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
    xp: 450, badgeEarned: false, interestRegistered: true, helpsRequested: 1, errorsCount: 3,
    justificationQuality: null,
    missions: {
      m1: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completado", attempts: 4, helps: 1, errors: 3, lastErrorCode: "ERR_LCD" },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 7, name: "Bautista L.", shipName: "Vanguardia 1", uuid: "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
    xp: 750, badgeEarned: true, interestRegistered: true, helpsRequested: 2, errorsCount: 2,
    justificationQuality: "Intuitive",
    missions: {
      m1: { status: "completado", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_DIRECT" },
      m2: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completado", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_COMPARE" },
      m4: { status: "completado", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    }
  },
  {
    id: 8, name: "Delfina P.", shipName: "Sonda Traslasierra", uuid: "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
    xp: 0, badgeEarned: false, interestRegistered: false, helpsRequested: 0, errorsCount: 0,
    justificationQuality: null,
    missions: {
      m1: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    }
  }
];

const SYSTEM_EXPERT_ALERTS = {
  ERR_DIRECT: "🛠️ Propuesta para el aula presencial: dinámica de doblado de tiras de papel para visualizar por qué el denominador nunca se suma.",
  ERR_PARTIAL: "🍳 Actividad para el hogar: usen elementos divisibles en la mesa para representar la agregación de partes.",
  ERR_LCD: "🧩 Actividad para el hogar: repasen juntos las tablas de multiplicar de los denominadores antes de operar.",
  ERR_COMPARE: "🥤 Actividad para el hogar: sirvan agua en vasos de diferente diámetro para ilustrar la necesidad de una base común."
};

function renderMissionCell(student, mKey) {
  const mData = student.missions[mKey];
  const status = mData ? mData.status : "bloqueada";
  const helps = mData ? (mData.helps || 0) : 0;
  const errors = mData ? (mData.errors || 0) : 0;

  let bgColor = "rgba(30, 41, 59, 0.3)";
  let borderColor = "#1e293b";
  let textColor = "#cbd5e1";
  let hasActivity = status === "completado" || status === "en_curso" || (mData && mData.attempts > 0);

  if (status === "completado") {
    bgColor = "rgba(16, 185, 129, 0.15)";
    borderColor = "#10b981";
    textColor = "#4ade80";
  } else if (hasActivity) {
    bgColor = "rgba(251, 146, 60, 0.15)";
    borderColor = "#fb923c";
    textColor = "#fb923c";
  }

  if (!hasActivity) {
    return <span style={{ padding: "4px 8px", borderRadius: "4px", border: "1px dashed #1e293b", color: "#475569", fontSize: "11px" }}>—</span>;
  }

  return (
    <div style={{ padding: "4px 8px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: bgColor, color: textColor, display: "inline-flex", gap: "6px", fontSize: "11px", fontWeight: "bold" }}>
      <span>💡 {helps}</span>
      <span style={{ color: "#fb923c" }}>✖ {errors}</span>
    </div>
  );
}

function justificationLabelStyle(quality) {
  let color = "#cbd5e1";
  let bg = "rgba(148, 163, 184, 0.1)";
  if (quality === "Master" || quality === "Intuitive") {
    color = "#4ade80";
    bg = "rgba(16, 185, 129, 0.15)";
  }
  return { padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", backgroundColor: bg, color: color };
}

// ==========================================
// 📬 COMPONENTE MODAL DE ANÁLISIS (ARRIBA EN PANTALLA, NO AL COSTADO)
// ==========================================
function DrawerWithSendButton({ student, onClose }) {
  const [emailSent, setEmailSent] = useState(false);

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

  if (student.badgeEarned) {
    if (student.errorsCount === 0) {
      performanceTitle = "Domina sin errores (Master Absoluto)";
      performanceColor = "#10b981";
      aulaAdvice = "El alumno ha alcanzado un dominio conceptual perfecto y sin cometer desvíos. No requiere intervención en clase; continúe motivándolo con desafíos avanzados.";
      padresAdvice = "¡Felicitaciones! Su hijo/a completó todos los desafíos de matemática con precisión absoluta y sin un solo error.";
    } else {
      performanceTitle = "Domina con errores (Dominio Resiliente)";
      performanceColor = "#10b981";
      aulaAdvice = "El alumno logró de forma resiliente consolidar el aprendizaje, superando los desvíos previos en la bitácora mediante el reintento.";
      padresAdvice = "Su hijo/a superó las misiones demostrando perseverancia y corrigiendo sus desvíos de forma resiliente.";
    }
  } else if (primaryDesvio) {
    performanceTitle = `Alerta de Desvío: ${primaryDesvio}`;
    performanceColor = "#fb923c";
    aulaAdvice = SYSTEM_EXPERT_ALERTS[primaryDesvio] || "Reforzar con guía personalizada en clase.";
    padresAdvice = "Acompañen a su hijo/a en casa revisando juntos el ejercicio con elementos físicos.";
  } else {
    aulaAdvice = "El alumno avanzó de forma regular dentro de la trayectoria de aprendizaje.";
    padresAdvice = "Acompañen el esfuerzo de su hijo/a en casa y anímenlo/a a seguir completando las misiones.";
  }

  const handleSendToParents = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div style={styles.topModalOverlay} onClick={onClose}>
      <div style={styles.topModalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={{ margin: 0, color: "#38bdf8", fontSize: "18px" }}>Análisis de Trayectoria: {student.name}</h2>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>🚀 {student.shipName} · CUIL: {student.uuid.slice(0, 8)}...</span>
          </div>
          <button style={styles.btnCloseModal} onClick={onClose}>✕</button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.profileSection}>
            <p style={{ margin: "0 0 6px 0" }}>Desempeño Global: <strong style={{ color: performanceColor }}>{performanceTitle}</strong></p>
            <p style={{ margin: "0 0 6px 0" }}>Experiencia Acumulada: <strong>{student.xp} / 750 XP</strong></p>
            <p style={{ margin: "0" }}>Ayudas Solicitadas / Errores: 💡 <strong>{student.helpsRequested}</strong> | ✖ <strong style={{ color: "#fb923c" }}>{student.errorsCount}</strong></p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={{ borderLeft: "4px solid #10b981", backgroundColor: "rgba(16, 185, 129, 0.05)", padding: "12px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 6px 0", color: "#10b981", fontSize: "12px", textTransform: "uppercase" }}>👩‍🏫 Consejo para el Aula (Docente)</h4>
              <p style={{ fontSize: "12px", margin: 0, lineHeight: "1.5", color: "#cbd5e1" }}>{aulaAdvice}</p>
            </div>

            <div style={{ borderLeft: "4px solid #8b5cf6", backgroundColor: "rgba(139, 92, 246, 0.05)", padding: "12px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 6px 0", color: "#8b5cf6", fontSize: "12px", textTransform: "uppercase" }}>🏠 Consejo para la Familia (Hogar)</h4>
              <p style={{ fontSize: "12px", margin: 0, lineHeight: "1.5", color: "#cbd5e1" }}>{padresAdvice}</p>
            </div>
          </div>

          <button onClick={handleSendToParents} style={styles.btnSendToCiDi}>
            ✉️ Enviar consejos directo a la familia (Domicilio Electrónico CiDi)
          </button>

          {emailSent && (
            <div style={styles.sentNotification}>
              ✨ ¡Enviado! Los consejos pedagógicos fueron notificados al Domicilio Electrónico de los padres en Ciudadano Digital (CiDi).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherMessage, setTeacherMessage] = useState("¡Buen viaje espacial, tripulantes! Lean con atención cada consigna.");
  const [inputMsg, setInputMsg] = useState(teacherMessage);
  const [pedagogicalPopup, setPedagogicalPopup] = useState(null); // 'm1', 'm2', 'm3', 'm4'

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.xp > 0).length;
  const badgesAwarded = students.filter((s) => s.badgeEarned).length;
  const partPercentage = Math.round((activeStudents / totalStudents) * 100);
  const badgePercentage = Math.round((badgesAwarded / totalStudents) * 100);

  const errorsCount = {
    ERR_DIRECT: students.filter((s) => s.missions.m1.lastErrorCode === "ERR_DIRECT" || s.missions.m2.lastErrorCode === "ERR_DIRECT").length,
    ERR_PARTIAL: students.filter((s) => s.missions.m2.lastErrorCode === "ERR_PARTIAL" || s.missions.m1.lastErrorCode === "ERR_PARTIAL").length,
    ERR_LCD: students.filter((s) => s.missions.m3.lastErrorCode === "ERR_LCD" || s.missions.m4.lastErrorCode === "ERR_LCD").length,
    ERR_COMPARE: students.filter((s) => s.missions.m4.lastErrorCode === "ERR_COMPARE").length
  };

  const handleSendMessage = () => {
    setTeacherMessage(inputMsg);
    alert(`📢 Transmisión enviada a las cabinas de los alumnos:

"${inputMsg}"`);
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <div>
          <h1 style={styles.dashboardTitle}>Consola de Monitoreo Docente</h1>
          <p style={styles.dashboardSubtitle}>Módulo Pilotín de Primer Año · Diagnóstico Matemático Situado (EduMisión Córdoba)</p>
        </div>
        <span style={styles.teacherBadge}>👩‍🏫 DOCENTE AUTENTICADA</span>
      </header>

      {/* 📖 FICHA PEDAGÓGICA BARRA DE MISIONES */}
      <div style={styles.missionPedagogicalBar}>
        <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginRight: "8px" }}>
          📖 FICHA Y OBJETIVOS DE MISIONES (Hacé clic para ver qué hacen y sus aprendizajes):
        </span>
        <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
          <button onClick={() => setPedagogicalPopup("m1")} style={styles.btnPedagogicalPill}>
            ℹ️ M1: Agua (Mismo Denominador)
          </button>
          <button onClick={() => setPedagogicalPopup("m2")} style={styles.btnPedagogicalPill}>
            ℹ️ M2: Combustible (Múltiplo Simple)
          </button>
          <button onClick={() => setPedagogicalPopup("m3")} style={styles.btnPedagogicalPill}>
            ℹ️ M3: Víveres (Simplificación)
          </button>
          <button onClick={() => setPedagogicalPopup("m4")} style={styles.btnPedagogicalPillGold}>
            🏆 M4: Despegue (Misión Integradora)
          </button>
        </div>
      </div>

      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #8b5cf6" }}>
          <p style={styles.kpiLabel}>🔵 % PARTICIPACIÓN</p>
          <p style={{ ...styles.kpiValue, color: "#c084fc" }}>{partPercentage}%</p>
          <div style={styles.kpiSub}>Evolución: 📈 Sem 1: 12% ➔ Sem 2: {partPercentage}%</div>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #10b981" }}>
          <p style={styles.kpiLabel}>🟢 % COMPLETITUD (EN VERDE)</p>
          <p style={{ ...styles.kpiValue, color: "#4ade80" }}>85%</p>
          <div style={styles.kpiSub}>Evolución: 📈 Sem 1: 5% ➔ Sem 2: 85%</div>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #10b981" }}>
          <p style={styles.kpiLabel}>🟢 % DOMINANTES (EN VERDE)</p>
          <p style={{ ...styles.kpiValue, color: "#4ade80" }}>{badgePercentage}%</p>
          <div style={styles.kpiSub}>Evolución: 📈 Sem 1: 0% ➔ Sem 2: {badgePercentage}%</div>
        </div>
      </div>

      <div style={styles.dashboardTeacherControlsCard}>
        <h3 style={{ ...styles.cardSectionTitle, color: "#c084fc", margin: 0 }}>📢 Enviar Consejos Colectivos a las Cabinas</h3>
        <p style={{ ...styles.instructions, margin: 0 }}>
          Escribí un aviso o sugerencia de aula. Aparecerá inmediatamente en las pantallas de todos los estudiantes.
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ej: ¡Tripulantes, recuerden usar lápiz y papel antes de responder!"
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
                  <th style={styles.thClickable} onClick={() => setPedagogicalPopup("m1")} title="Ver objetivos M1">
                    M1 (Agua) ℹ️
                  </th>
                  <th style={styles.thClickable} onClick={() => setPedagogicalPopup("m2")} title="Ver objetivos M2">
                    M2 (Combust.) ℹ️
                  </th>
                  <th style={styles.thClickable} onClick={() => setPedagogicalPopup("m3")} title="Ver objetivos M3">
                    M3 (Víveres) ℹ️
                  </th>
                  <th style={styles.thClickable} onClick={() => setPedagogicalPopup("m4")} title="Ver objetivos M4">
                    M4 (Despegue) ℹ️
                  </th>
                  <th style={styles.th}>Justif. M4</th>
                  <th style={styles.th}>Experiencia</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "bold", color: "#ffffff" }}>
                      {student.name} <br />
                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>🚀 {student.shipName}</span>
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
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>PENDIENTE</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: "#38bdf8" }}>{student.xp} XP</strong>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => setSelectedStudent(student)} style={styles.btnTableAction}>
                        Analizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.dashboardCard}>
            <h3 style={styles.cardSectionTitle}>Diagnóstico Colectivo (Sistema Experto)</h3>
            <p style={styles.instructions}>
              El motor agrupa los desvíos detectados en el piloto para facilitar la intervención presencial del docente.
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

      {/* POPUP DE FICHA PEDAGÓGICA (ARRIBA EN PANTALLA) */}
      {pedagogicalPopup && (
        <div style={styles.topModalOverlay} onClick={() => setPedagogicalPopup(null)}>
          <div style={styles.topModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, color: "#38bdf8", fontSize: "18px" }}>
                  {MISSION_PEDAGOGICAL_INFO[pedagogicalPopup].title}
                </h3>
                <span style={{ fontSize: "12px", color: "#c084fc", fontWeight: "bold" }}>
                  {MISSION_PEDAGOGICAL_INFO[pedagogicalPopup].subtitle}
                </span>
              </div>
              <button style={styles.btnCloseModal} onClick={() => setPedagogicalPopup(null)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={{ marginBottom: "14px" }}>
                <strong style={{ color: "#eab308", fontSize: "13px" }}>🎮 ¿Qué hacen los alumnos en esta Misión?</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", lineHeight: "1.5", color: "#e2e8f0" }}>
                  {MISSION_PEDAGOGICAL_INFO[pedagogicalPopup].action}
                </p>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <strong style={{ color: "#4ade80", fontSize: "13px" }}>🎯 Objetivos de Aprendizaje:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", lineHeight: "1.5", color: "#e2e8f0" }}>
                  {MISSION_PEDAGOGICAL_INFO[pedagogicalPopup].objectives}
                </p>
              </div>

              <div>
                <strong style={{ color: "#38bdf8", fontSize: "13px" }}>📊 Evidencia Pedagógica Esperada:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", lineHeight: "1.5", color: "#e2e8f0" }}>
                  {MISSION_PEDAGOGICAL_INFO[pedagogicalPopup].evidence}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DE ANÁLISIS INDIVIDUAL (ARRIBA EN PANTALLA, NO AL COSTADO) */}
      {selectedStudent && (
        <DrawerWithSendButton
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

const styles = {
  dashboardContainer: {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#030712",
    color: "#f3f4f6",
    minHeight: "100vh"
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  dashboardTitle: {
    fontSize: "20px",
    margin: 0,
    color: "#38bdf8",
    fontWeight: "bold"
  },
  dashboardSubtitle: {
    fontSize: "12px",
    margin: "4px 0 0 0",
    color: "#64748b"
  },
  teacherBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    border: "1px solid #38bdf8"
  },
  missionPedagogicalBar: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    border: "1px solid #38bdf8",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px"
  },
  btnPedagogicalPill: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    color: "#38bdf8",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  btnPedagogicalPillGold: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #fb923c",
    backgroundColor: "rgba(251, 146, 60, 0.12)",
    color: "#fb923c",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "20px"
  },
  kpiCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #1e293b"
  },
  kpiLabel: {
    fontSize: "10px",
    color: "#cbd5e1",
    margin: 0,
    fontWeight: "bold"
  },
  kpiValue: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: "4px 0"
  },
  kpiSub: {
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: "600"
  },
  dashboardTeacherControlsCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    border: "2px solid #8b5cf6",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  teacherDashboardInput: {
    flex: 1,
    padding: "10px 14px",
    backgroundColor: "#02040e",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#cbd5e1",
    fontSize: "13px"
  },
  teacherDashboardSendBtn: {
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "12px",
    cursor: "pointer"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px"
  },
  leftColumn: {},
  rightColumn: {},
  dashboardCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #1e293b"
  },
  cardSectionTitle: {
    fontSize: "13px",
    margin: "0 0 12px 0",
    color: "#38bdf8",
    textTransform: "uppercase"
  },
  instructions: {
    fontSize: "12px",
    color: "#94a3b8",
    lineHeight: "1.4",
    marginBottom: "12px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeaderRow: {
    borderBottom: "1px solid #1e293b",
    textAlign: "left"
  },
  th: {
    padding: "8px",
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase"
  },
  thClickable: {
    padding: "8px",
    fontSize: "10px",
    color: "#38bdf8",
    textTransform: "uppercase",
    cursor: "pointer",
    textDecoration: "underline"
  },
  tr: {
    borderBottom: "1px solid #1e293b"
  },
  td: {
    padding: "8px",
    fontSize: "12px"
  },
  btnTableAction: {
    padding: "4px 10px",
    fontSize: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1e3a8a",
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: "bold"
  },
  alertsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  alertBox: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid"
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  alertTitleActive: {
    fontWeight: "bold",
    color: "#fb923c",
    fontSize: "12px"
  },
  alertTitleInactive: {
    color: "#64748b",
    fontSize: "12px"
  },
  alertBadge: {
    fontSize: "10px",
    backgroundColor: "#1e293b",
    color: "#cbd5e1",
    padding: "2px 6px",
    borderRadius: "4px"
  },
  alertDesc: {
    fontSize: "11px",
    margin: "6px 0 0 0",
    lineHeight: "1.4",
    color: "#cbd5e1"
  },
  // ESTILOS DE MODAL ARRIBA EN PANTALLA (SIN DRAWERS AL COSTADO QUE ROMPAN LA PANTALLA)
  topModalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(2, 3, 8, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "20px",
    paddingBottom: "20px",
    zIndex: 3000,
    overflowY: "auto"
  },
  topModalCard: {
    width: "90%",
    maxWidth: "680px",
    backgroundColor: "#080d24",
    padding: "24px",
    boxSizing: "border-box",
    borderRadius: "14px",
    border: "2px solid #38bdf8",
    boxShadow: "0 0 35px rgba(56, 189, 248, 0.35)",
    color: "#cbd5e1"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  btnCloseModal: {
    background: "none",
    border: "none",
    fontSize: "22px",
    color: "#64748b",
    cursor: "pointer",
    padding: "0 4px"
  },
  modalBody: {},
  profileSection: {
    backgroundColor: "#02040e",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    fontSize: "12px",
    marginBottom: "16px"
  },
  btnSendToCiDi: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  sentNotification: {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    border: "1px solid #10b981",
    borderRadius: "6px",
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center"
  }
};
