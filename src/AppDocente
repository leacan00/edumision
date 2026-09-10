import React, { useState, useEffect } from "react";

// ==========================================
// 🧠 TRADUCTOR DE DESVÍOS DIDÁCTICOS (Sistema Experto)
// ==========================================
const SYSTEM_EXPERT_RULES = {
  ERR_DIRECT: {
    code: "ERR_DIRECT",
    title: "Suma Directa de Numeradores y Denominadores",
    desc: "El alumno sumó numeradores y denominadores linealmente sin unificar la base.",
    aula: "🛠️ Propuesta Aula: Dinámica de doblado y superposición de tiras de cartulina para constatar visualmente que los denominadores no se suman.",
    hogar: "🍳 Actividad Hogar: Medir 1/2 taza de leche y luego 1/4 taza en el mismo vaso medidor. Comprobar que el volumen sube a 3/4."
  },
  ERR_PARTIAL: {
    code: "ERR_PARTIAL",
    title: "Suma Incompleta (Una sola fracción)",
    desc: "El alumno respondió con el valor de una sola fracción, omitiendo la segunda parte.",
    aula: "🛠️ Propuesta Aula: Reforzar con conteo dual (una fracción en cada mano) antes de pasar a la notación simbólica.",
    hogar: "🥧 Actividad Hogar: Cortar una fruta en partes iguales, apartar las porciones de cada fracción y juntarlas físicamente en un plato."
  },
  ERR_LCD: {
    code: "ERR_LCD",
    title: "Mínimo Común Denominador Incorrecto",
    desc: "El alumno usó un denominador común que no es múltiplo de ambos denominadores originales.",
    aula: "🛠️ Propuesta Aula: Trabajar la tabla de múltiplos de ambos denominadores en paralelo en el pizarrón antes de atajos directos.",
    hogar: "🧩 Actividad Hogar: Con dos tableros de Lego de distintos tamaños, buscar el largo más chico donde ambos encajan un número entero de veces."
  },
  ERR_COMPARE: {
    code: "ERR_COMPARE",
    title: "Comparación de Fracciones sin Base Común",
    desc: "El alumno comparó dos fracciones con distinto denominador sin convertirlas previamente.",
    aula: "🛠️ Propuesta Aula: Exigir como paso obligatorio en el pizarrón la conversión al mismo denominador antes de decidir cuál es mayor.",
    hogar: "🥤 Actividad Hogar: Servir 2/3 de un vaso de jugo y 3/4 de otro vaso idéntico para comparar visualmente antes de medir."
  }
};

// Helper para exportar archivos CSV compatibles con Excel/LibreOffice
const exportToExcelCSV = (filename, csvContent) => {
  // UTF-8 BOM (﻿) para apertura directa sin diálogo de codificación
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// 🛠️ MOCK ROSTER INICIAL DE ALUMNOS
// ==========================================
const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Martín G.",
    shipName: "Halcón de las Sierras",
    status: "conectado",
    uuid: "7a3b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    xp: 500,
    badgeEarned: true,
    interestRegistered: true,
    helpsRequested: 1,
    errorsCount: 1,
    missions: {
      m1: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completada", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_LCD" },
      m4: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: "Master",
    xapi_history: [
      { time: "10:14:02", verb: "CONECTÓ", object: "Inicio de sesión en cabina" },
      { time: "10:18:15", verb: "COMPLETÓ", object: "Misión M1: Sintonía Radar" },
      { time: "10:22:40", verb: "COMPLETÓ", object: "Misión M2: Válvulas de Flujo" },
      { time: "10:28:10", verb: "ERROR", object: "M3 · Desvío ERR_LCD (MCM incorrecto)" },
      { time: "10:30:05", verb: "COMPLETÓ", object: "Misión M3: Enlace de Órbitas" },
      { time: "10:35:50", verb: "ACREDITÓ", object: "Misión M4: Insignia de Fusión Estelar" }
    ]
  },
  {
    id: 2,
    name: "Sofía V.",
    shipName: "Centella Alfa",
    status: "conectado",
    uuid: "8b4c3d2e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    xp: 250,
    badgeEarned: false,
    interestRegistered: true,
    helpsRequested: 2,
    errorsCount: 4,
    missions: {
      m1: { status: "completada", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_DIRECT" },
      m2: { status: "activa", attempts: 3, helps: 1, errors: 3, lastErrorCode: "ERR_DIRECT" },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: null,
    xapi_history: [
      { time: "10:02:11", verb: "CONECTÓ", object: "Inicio de sesión en cabina" },
      { time: "10:05:20", verb: "ERROR", object: "M1 · Desvío ERR_DIRECT (Suma directa)" }
    ]
  },
  {
    id: 3,
    name: "Facundo S.",
    shipName: "Meteoro Austral",
    status: "conectado",
    uuid: "9c5d4e3f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    xp: 450,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 2,
    errorsCount: 3,
    missions: {
      m1: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completada", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_PARTIAL" },
      m3: { status: "completada", attempts: 3, helps: 1, errors: 2, lastErrorCode: "ERR_LCD" },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 4,
    name: "Valentina R.",
    shipName: "Cóndor Estelar",
    status: "conectado",
    uuid: "1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
    xp: 500,
    badgeEarned: true,
    interestRegistered: true,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: "Master",
    xapi_history: []
  },
  {
    id: 5,
    name: "Tomás B.",
    shipName: "Rayo Cba",
    status: "pendiente",
    uuid: "2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b",
    xp: 0,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 6,
    name: "Camila O.",
    shipName: "Pampa Orbital",
    status: "conectado",
    uuid: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
    xp: 450,
    badgeEarned: false,
    interestRegistered: true,
    helpsRequested: 1,
    errorsCount: 3,
    missions: {
      m1: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completada", attempts: 4, helps: 1, errors: 3, lastErrorCode: "ERR_LCD" },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: null,
    xapi_history: []
  },
  {
    id: 7,
    name: "Bautista L.",
    shipName: "Vanguardia 1",
    status: "conectado",
    uuid: "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
    xp: 500,
    badgeEarned: true,
    interestRegistered: true,
    helpsRequested: 2,
    errorsCount: 2,
    missions: {
      m1: { status: "completada", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_DIRECT" },
      m2: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "completada", attempts: 2, helps: 1, errors: 1, lastErrorCode: "ERR_COMPARE" },
      m4: { status: "completada", attempts: 1, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: "Intuitive",
    xapi_history: []
  },
  {
    id: 8,
    name: "Delfina P.",
    shipName: "Sonda Traslasierra",
    status: "pendiente",
    uuid: "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
    xp: 0,
    badgeEarned: false,
    interestRegistered: false,
    helpsRequested: 0,
    errorsCount: 0,
    missions: {
      m1: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m2: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m3: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null },
      m4: { status: "bloqueada", attempts: 0, helps: 0, errors: 0, lastErrorCode: null }
    },
    justificationQuality: null,
    xapi_history: []
  }
];

export default function App() {
  // Modal 1: Presentación Institucional (1er Ingreso)
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edumision_teacher_welcome_seen") !== "true";
    }
    return true;
  });

  // Modal 2: Identificación / Nick Docente al inicio de sesión
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edumision_teacher_profile");
      if (saved) return JSON.parse(saved);
    }
    return { name: "Profe Laura", curso: "1° Año B", escuela: "Escuela IPEM 184" };
  });

  const [inputName, setInputName] = useState(teacherProfile.name);
  const [inputCurso, setInputCurso] = useState(teacherProfile.curso);
  const [inputEscuela, setInputEscuela] = useState(teacherProfile.escuela);

  // Estados del Panel
  const [activeTab, setActiveTab] = useState("roster"); // roster | por_mision
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherMessage, setTeacherMessage] = useState("¡Buen viaje espacial, tripulantes! Recuerden resolver en borrador con lápiz y papel.");
  const [inputAdvice, setInputAdvice] = useState(teacherMessage);
  const [toastMsg, setToastMsg] = useState(null);

  // Cierre de Modal 1
  const handleCloseWelcomeModal = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("edumision_teacher_welcome_seen", "true");
    }
    setShowWelcomeModal(false);
    setShowSessionModal(true);
  };

  // Guardado de Modal 2 (Identificación)
  const handleSaveSessionModal = (e) => {
    e.preventDefault();
    const prof = {
      name: inputName.trim() || "Docente",
      curso: inputCurso.trim() || "1° Año",
      escuela: inputEscuela.trim() || "Escuela Secundaria"
    };
    setTeacherProfile(prof);
    if (typeof window !== "undefined") {
      localStorage.setItem("edumision_teacher_profile", JSON.stringify(prof));
    }
    setShowSessionModal(false);
    showToast(`✨ Bienvenida/o ${prof.name}. Consola habilitada para ${prof.curso}.`);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Transmisión de mensaje grupal a cabinas
  const handleSendBroadcastAdvice = (e) => {
    e.preventDefault();
    if (!inputAdvice.trim()) return;
    setTeacherMessage(inputAdvice);
    showToast(`📢 Transmisión enviada a las cabinas del curso.`);
  };

  // Exportar Excel Consolidado del Curso (CSV con BOM UTF-8 y separador ;)
    const handleExportGroupCSV = () => {
    let csv = `Alumno;Nave;Estado Conexión;XP Acumulado;Insignia M4;Justificación M4;Interés Fase 2;Pistas M1;Errores M1;Pistas M2;Errores M2;Pistas M3;Errores M3;Pistas M4;Errores M4
`;

    students.forEach((s) => {
      const m1 = s.missions.m1 || {};
      const m2 = s.missions.m2 || {};
      const m3 = s.missions.m3 || {};
      const m4 = s.missions.m4 || {};

      csv += `"${s.name}";"${s.shipName}";"${s.status.toUpperCase()}";${s.xp};"${s.badgeEarned ? "ACREDITADA" : "PENDIENTE"}";"${s.justificationQuality || "PENDIENTE"}";"${s.interestRegistered ? "SÍ" : "NO"}";${m1.helps || 0};${m1.errors || 0};${m2.helps || 0};${m2.errors || 0};${m3.helps || 0};${m3.errors || 0};${m4.helps || 0};${m4.errors || 0}
`;
    });

    const filename = `Reporte_EduMision_Curso_${teacherProfile.curso.replace(/\s+/g, "_")}.csv`;
    exportToExcelCSV(filename, csv);
    showToast(`📥 Descargado reporte Excel de grupo: ${filename}`);
  };

  // Exportar Excel Individual de un Alumno
  const handleExportIndividualCSV = (student) => {
    let csv = `REPORTE INDIVIDUAL DE TRAYECTORIA EDUCATIVA - EDUMISIÓN
`;
    csv += `Docente Evaluador/a:;${teacherProfile.name}
`;
    csv += `Curso:;${teacherProfile.curso}
`;
    csv += `Escuela:;${teacherProfile.escuela}
`;
    csv += `Alumno/a:;${student.name}
`;
    csv += `Nave:;${student.shipName}
`;
    csv += `UUID xAPI:;${student.uuid}
`;
    csv += `XP Total:;${student.xp} / 500 XP
`;
    csv += `Insignia M4:;${student.badgeEarned ? "Inscripta - Ingeniero/a de Fusión Estelar" : "Pendiente"}

`;

    csv += `DETALLE DE MISIONES Y DESVÍOS
`;
    csv += `Misión;Estado;Consultas Pistas (💡);Errores Cometidos (✖);Último Código Desvío
`;

    const mKeys = [
      { key: "m1", label: "M1 · Radar de Señales" },
      { key: "m2", label: "M2 · Carga de Combustible" },
      { key: "m3", label: "M3 · Empalme de Órbitas" },
      { key: "m4", label: "M4 · Trayectoria Final" }
    ];

    mKeys.forEach((m) => {
      const data = student.missions[m.key] || {};
      csv += `"${m.label}";"${data.status || "bloqueada"}";${data.helps || 0};${data.errors || 0};"${data.lastErrorCode || "Ninguno"}"
`;
    });

    csv += `
RECOMENDACIÓN PEDAGÓGICA PARA AULA Y HOGAR
`;
    const primaryDesvio = student.missions.m4?.lastErrorCode || student.missions.m3?.lastErrorCode || student.missions.m2?.lastErrorCode || student.missions.m1?.lastErrorCode;
    if (primaryDesvio && SYSTEM_EXPERT_RULES[primaryDesvio]) {
      const rule = SYSTEM_EXPERT_RULES[primaryDesvio];
      csv += `Desvío Principal Detectado:;"${rule.title}"
`;
      csv += `Sugerencia Didáctica Aula:;"${rule.aula}"
`;
      csv += `Actividad Sugerida Hogar:;"${rule.hogar}"
`;
    } else if (student.badgeEarned) {
      csv += `Diagnóstico:;"Dominio conceptual sólido y autónomo. Sin intervenciones prioritarias."
`;
    } else {
      csv += `Diagnóstico:;"Avance curricular en proceso normal."
`;
    }

    const filename = `Bitacora_Alumno_${student.name.replace(/\s+/g, "_")}.csv`;
    exportToExcelCSV(filename, csv);
    showToast(`📥 Descargada bitacora de ${student.name}`);
  };

  // Métricas Calculadas
  const totalRoster = students.length;
  const connectedCount = students.filter((s) => s.status === "conectado").length;
  const badgesCount = students.filter((s) => s.badgeEarned).length;
  const partPercentage = totalRoster ? Math.round((connectedCount / totalRoster) * 100) : 0;
  const badgePercentage = totalRoster ? Math.round((badgesCount / totalRoster) * 100) : 0;

  // Renderizador de celdas de misión M1-M4
  const renderMissionCell = (student, mKey) => {
    const data = student.missions[mKey] || {};
    const status = data.status || "bloqueada";
    const helps = data.helps || 0;
    const errors = data.errors || 0;

    let bg = "rgba(15, 23, 42, 0.6)";
    let border = "#1e293b";
    let color = "#64748b";

    if (status === "completada" || status === "completado") {
      bg = "rgba(16, 185, 129, 0.12)";
      border = "#10b981";
      color = "#4ade80";
    } else if (status === "activa" || errors > 0 || helps > 0) {
      bg = "rgba(251, 146, 60, 0.12)";
      border = "#fb923c";
      color = "#fb923c";
    }

    if (status === "bloqueada" && helps === 0 && errors === 0) {
      return <span style={styles.cellBlocked}>—</span>;
    }

    return (
      <div style={{ ...styles.cellPill, backgroundColor: bg, borderColor: border, color }}>
        <span title="Pistas solicitadas a EduBot">💡 {helps}</span>
        <span title="Errores cometidos" style={{ color: errors > 0 ? "#f87171" : "#94a3b8" }}>
          ✖ {errors}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.appContainer}>
      {/* 🪐 MODAL 1: BIENVENIDA E INSTRUCCIÓN INSTITUCIONAL (1er Ingreso) */}
      {showWelcomeModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: "520px" }}>
            <div style={styles.modalHeader}>
              <span style={{ fontSize: "28px" }}>🪐</span>
              <div>
                <h2 style={styles.modalTitle}>¡GRACIAS POR SUMARTE A EDUMISIÓN!</h2>
                <p style={styles.modalSub}>Proyecto de Acompañamiento y Diagnóstico Matemático</p>
              </div>
            </div>

            <div style={styles.welcomeBox}>
              <p style={styles.welcomeText}>
                Vas a estar recibiendo información en tiempo real de los alumnos que realizan las misiones espaciales.
                Los datos de tu panel se irán cargando automáticamente a medida que los chicos juegan y resuelven en borrador.
              </p>
              <div style={styles.welcomePoint}>
                <span>📊</span>
                <div><strong>Monitoreo Sin Burocracia:</strong> Analizá los desvíos didácticos del curso sin necesidad de corregir planillas manualmente.</div>
              </div>
              <div style={styles.welcomePoint}>
                <span>📝</span>
                <div><strong>Encuesta de Cierre:</strong> Al finalizar la prueba del piloto, te agradeceremos responder unas breves preguntas para ayudarnos a mejorar.</div>
              </div>
            </div>

            <button onClick={handleCloseWelcomeModal} style={styles.btnPrimaryModal} type="button">
              🚀 Entendido · Ingresar a la Consola
            </button>
          </div>
        </div>
      )}

      {/* 🔑 MODAL 2: IDENTIFICACIÓN Y REGISTRO DE SESIÓN DOCENTE */}
      {showSessionModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: "420px" }}>
            <div style={styles.modalHeader}>
              <span style={{ fontSize: "28px" }}>👩‍🏫</span>
              <div>
                <h2 style={styles.modalTitle}>FIRMA DE SESIÓN DOCENTE</h2>
                <p style={styles.modalSub}>Ingresá tus datos para habilitar el seguimiento del aula</p>
              </div>
            </div>

            <form onSubmit={handleSaveSessionModal} style={styles.sessionForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tu Nombre / Nick Docente:</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ej: Profe Laura"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Curso / División:</label>
                <input
                  type="text"
                  value={inputCurso}
                  onChange={(e) => setInputCurso(e.target.value)}
                  placeholder="Ej: 1° Año B"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Institución Escolar:</label>
                <input
                  type="text"
                  value={inputEscuela}
                  onChange={(e) => setInputEscuela(e.target.value)}
                  placeholder="Ej: IPEM 184"
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.btnPrimaryModal}>
                ✅ Habilitar Consola de Monitoreo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICACIÓN */}
      {toastMsg && <div style={styles.toastCard}>{toastMsg}</div>}

      {/* 🧭 NAV SUPERIOR */}
      <nav style={styles.navBar}>
        <div style={styles.navBrand}>
          <span style={styles.brandBadge}>EM</span>
          <div>
            <span style={styles.brandTitle}>EduMisión Córdoba · Consola Docente</span>
            <div style={styles.brandMeta}>
              Profe: <strong style={{ color: "#38bdf8" }}>{teacherProfile.name}</strong> | Curso: <strong>{teacherProfile.curso}</strong> ({teacherProfile.escuela})
            </div>
          </div>
        </div>

        <div style={styles.navActions}>
          <button onClick={() => setShowSessionModal(true)} style={styles.btnNavOutline} title="Cambiar datos de sesión docente">
            🔑 {teacherProfile.name}
          </button>
          <button onClick={handleExportGroupCSV} style={styles.btnNavExcel}>
            📥 Exportar Excel Curso (.CSV)
          </button>
        </div>
      </nav>

      {/* 📊 TARJETAS KPI DE METRICAS GLOBALES */}
      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #38bdf8" }}>
          <div style={styles.kpiLabel}>ALUMNOS CONECTADOS</div>
          <div style={{ ...styles.kpiValue, color: "#38bdf8" }}>
            {connectedCount} <span style={{ fontSize: "16px", color: "#64748b" }}>/ {totalRoster}</span>
          </div>
          <div style={styles.kpiSub}>Tasa de participación: {partPercentage}% del roster</div>
        </div>

        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #10b981" }}>
          <div style={styles.kpiLabel}>MAESTRÍA LOGRADA (M4)</div>
          <div style={{ ...styles.kpiValue, color: "#4ade80" }}>
            {badgesCount} <span style={{ fontSize: "16px", color: "#64748b" }}>/ {totalRoster}</span>
          </div>
          <div style={styles.kpiSub}>Insignia "Fusión Estelar": {badgePercentage}% del curso</div>
        </div>

        <div style={{ ...styles.kpiCard, borderLeft: "4px solid #c084fc" }}>
          <div style={styles.kpiLabel}>INTERACCIÓN Y CONSULTAS</div>
          <div style={{ ...styles.kpiValue, color: "#c084fc" }}>
            💡 {students.reduce((acc, s) => acc + (s.helpsRequested || 0), 0)}
            <span style={{ fontSize: "18px", color: "#fb923c", marginLeft: "12px" }}>
              ✖ {students.reduce((acc, s) => acc + (s.errorsCount || 0), 0)}
            </span>
          </div>
          <div style={styles.kpiSub}>Consultas a EduBot vs. Desvíos cometidos</div>
        </div>
      </div>

      {/* 📢 BARRA DE TRANSMISIÓN EN VIVO A CABINAS */}
      <div style={styles.broadcastCard}>
        <div style={styles.broadcastHeader}>
          <span style={{ fontSize: "18px" }}>📢</span>
          <strong style={{ color: "#c084fc", fontSize: "13px" }}>Transmitir Consejo o Sugerencia a las Cabinas:</strong>
        </div>
        <form onSubmit={handleSendBroadcastAdvice} style={styles.broadcastForm}>
          <input
            type="text"
            value={inputAdvice}
            onChange={(e) => setInputAdvice(e.target.value)}
            placeholder="Escribí un consejo (aparecerá en tiempo real en la pantalla de los chicos)..."
            style={styles.broadcastInput}
          />
          <button type="submit" style={styles.btnBroadcast}>
            📡 Transmitir Consejo
          </button>
        </form>
      </div>

      {/* 🔀 NAVEGACIÓN DE SECCIONES (TABS) */}
      <div style={styles.tabNav}>
        <button
          onClick={() => setActiveTab("roster")}
          style={activeTab === "roster" ? styles.tabActive : styles.tabInactive}
        >
          📋 Matriz General de Alumnos ({totalRoster})
        </button>
        <button
          onClick={() => setActiveTab("por_mision")}
          style={activeTab === "por_mision" ? styles.tabActive : styles.tabInactive}
        >
          🔍 Analizar Misión por Misión (M1 a M4)
        </button>
      </div>

      {/* 📋 VISTA 1: MATRIZ GENERAL DE ALUMNOS */}
      {activeTab === "roster" && (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Seguimiento Nominal del Roster ({teacherProfile.curso})</h3>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              💡 = Pistas Pedir a EduBot | ✖ = Errores cometidos antes de consolidar
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHeader}>
                  <th style={styles.th}>Alumno (Nave Estelar)</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>M1 (Radar)</th>
                  <th style={styles.th}>M2 (Válvulas)</th>
                  <th style={styles.th}>M3 (Órbitas)</th>
                  <th style={styles.th}>M4 (Cierre)</th>
                  <th style={styles.th}>Justif. M4</th>
                  <th style={styles.th}>XP Total</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id} style={styles.tr}>
                    <td style={styles.tdName}>
                      <div>{st.name}</div>
                      <div style={styles.shipSub}>🚀 {st.shipName}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={st.status === "conectado" ? styles.badgeConnected : styles.badgePending}>
                        {st.status === "conectado" ? "🟢 CONECTADO" : "⏳ PENDIENTE"}
                      </span>
                    </td>
                    <td style={styles.td}>{renderMissionCell(st, "m1")}</td>
                    <td style={styles.td}>{renderMissionCell(st, "m2")}</td>
                    <td style={styles.td}>{renderMissionCell(st, "m3")}</td>
                    <td style={styles.td}>{renderMissionCell(st, "m4")}</td>
                    <td style={styles.td}>
                      {st.justificationQuality ? (
                        <span style={st.justificationQuality === "Master" ? styles.justMaster : styles.justIntuitive}>
                          {st.justificationQuality === "Master" ? "🎓 CIENTÍFICA" : "🧠 INTUITIVA"}
                        </span>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "11px" }}>—</span>
                      )}
                    </td>
                    <td style={styles.tdXP}>
                      <strong>{st.xp} XP</strong>
                    </td>
                    <td style={styles.tdActions}>
                      <button onClick={() => setSelectedStudent(st)} style={styles.btnActionAnalyze}>
                        🔍 Analizar
                      </button>
                      <button onClick={() => handleExportIndividualCSV(st)} style={styles.btnActionExport} title="Descargar CSV Excel individual">
                        📄 CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🔍 VISTA 2: DESGLOSE MISION POR MISIÓN */}
      {activeTab === "por_mision" && (
        <div style={styles.misionBreakdownGrid}>
          {[
            { key: "m1", title: "Misión 1: Radar de Señales", math: "Denominadores Iguales", icon: "🛰️" },
            { key: "m2", title: "Misión 2: Carga de Combustible", math: "Denominador Múltiplo", icon: "🚀" },
            { key: "m3", title: "Misión 3: Empalme de Órbitas", math: "Denominadores Coprimos", icon: "🛸" },
            { key: "m4", title: "Misión 4: Trayectoria Final", math: "Cierre Integrador", icon: "👑" }
          ].map((m) => {
            const completed = students.filter((s) => s.missions[m.key]?.status === "completada").length;
            const activeOrErr = students.filter((s) => (s.missions[m.key]?.errors || 0) > 0).length;
            const compPercent = Math.round((completed / totalRoster) * 100);

            // Conteo de errores específicos en esta misión
            const errorCounts = { ERR_DIRECT: 0, ERR_PARTIAL: 0, ERR_LCD: 0, ERR_COMPARE: 0 };
            students.forEach((s) => {
              const code = s.missions[m.key]?.lastErrorCode;
              if (code && errorCounts[code] !== undefined) {
                errorCounts[code]++;
              }
            });

            return (
              <div key={m.key} style={styles.misionCard}>
                <div style={styles.misionHeader}>
                  <span style={{ fontSize: "24px" }}>{m.icon}</span>
                  <div>
                    <h3 style={styles.misionTitle}>{m.title}</h3>
                    <div style={styles.misionSub}>{m.math}</div>
                  </div>
                </div>

                <div style={styles.misionProgressBox}>
                  <div style={styles.misionProgressLabel}>
                    <span>Completitud del Curso:</span>
                    <strong>{completed} / {totalRoster} ({compPercent}%)</strong>
                  </div>
                  <div style={styles.progressBarBg}>
                    <div style={{ ...styles.progressBarFill, width: `${compPercent}%` }} />
                  </div>
                </div>

                <div style={styles.desviosSection}>
                  <div style={styles.desviosTitle}>Mapa de Desvíos Didácticos Registrados:</div>
                  {Object.entries(errorCounts).map(([code, count]) => {
                    const rule = SYSTEM_EXPERT_RULES[code];
                    if (!rule) return null;
                    return (
                      <div key={code} style={styles.desvioRow(count > 0)}>
                        <div style={styles.desvioRowHeader}>
                          <span style={styles.desvioCode}>{code}</span>
                          <span style={styles.desvioCount}>{count} alumnos</span>
                        </div>
                        <div style={styles.desvioTitle}>{rule.title}</div>
                        {count > 0 && <div style={styles.desvioAulaTip}>{rule.aula}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 📑 DRAWER/MODAL ANÁLISIS INDIVIDUAL DE UN ALUMNO */}
      {selectedStudent && (
        <div style={styles.drawerOverlay} onClick={() => setSelectedStudent(null)}>
          <div style={styles.drawerCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div>
                <h2 style={styles.drawerTitle}>Ficha de Análisis: {selectedStudent.name}</h2>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>🚀 Nave: {selectedStudent.shipName} | UUID: {selectedStudent.uuid.slice(0, 13)}...</div>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={styles.btnCloseDrawer} type="button">×</button>
            </div>

            <div style={styles.drawerBody}>
              <div style={styles.drawerKpiBox}>
                <div>XP Acumulado: <strong style={{ color: "#38bdf8" }}>{selectedStudent.xp} XP</strong></div>
                <div>Insignia M4: <strong style={{ color: selectedStudent.badgeEarned ? "#4ade80" : "#64748b" }}>{selectedStudent.badgeEarned ? "🏆 ACREDITADA" : "PENDIENTE"}</strong></div>
                <div>Pistas Pedidas: 💡 <strong>{selectedStudent.helpsRequested || 0}</strong></div>
                <div>Errores Cometidos: ✖ <strong style={{ color: "#fb923c" }}>{selectedStudent.errorsCount || 0}</strong></div>
              </div>

              <h4 style={styles.drawerSectionTitle}>📋 Detalle por Misión</h4>
              <div style={styles.drawerMissionsList}>
                {[
                  { key: "m1", label: "M1 · Radar de Señales" },
                  { key: "m2", label: "M2 · Carga de Combustible" },
                  { key: "m3", label: "M3 · Empalme de Órbitas" },
                  { key: "m4", label: "M4 · Trayectoria Final" }
                ].map((m) => {
                  const data = selectedStudent.missions[m.key] || {};
                  return (
                    <div key={m.key} style={styles.drawerMisionItem}>
                      <strong>{m.label}</strong>
                      <div>
                        Estado: <span style={{ color: data.status === "completada" ? "#4ade80" : "#fb923c" }}>{data.status || "bloqueada"}</span> |
                        💡 Pistas: {data.helps || 0} | ✖ Errores: {data.errors || 0}
                      </div>
                      {data.lastErrorCode && (
                        <div style={{ fontSize: "11px", color: "#f87171", marginTop: "2px" }}>
                          Último desvío: {data.lastErrorCode} ({SYSTEM_EXPERT_RULES[data.lastErrorCode]?.title})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <h4 style={styles.drawerSectionTitle}>💡 Recomendaciones del Sistema Experto</h4>
              {(() => {
                const primaryCode = selectedStudent.missions.m4?.lastErrorCode || selectedStudent.missions.m3?.lastErrorCode || selectedStudent.missions.m2?.lastErrorCode || selectedStudent.missions.m1?.lastErrorCode;
                if (primaryCode && SYSTEM_EXPERT_RULES[primaryCode]) {
                  const rule = SYSTEM_EXPERT_RULES[primaryCode];
                  return (
                    <div style={styles.expertBox}>
                      <div style={{ fontWeight: "bold", color: "#fb923c", marginBottom: "6px" }}>Desvío Principal: {rule.title}</div>
                      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#cbd5e1" }}><strong>Para el Aula Presencial:</strong> {rule.aula}</div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1" }}><strong>Para Sugerir al Hogar:</strong> {rule.hogar}</div>
                    </div>
                  );
                } else if (selectedStudent.badgeEarned) {
                  return (
                    <div style={{ ...styles.expertBox, borderLeftColor: "#10b981" }}>
                      <div style={{ color: "#4ade80", fontWeight: "bold" }}>🎓 Dominio Conceptual Excelente</div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>El alumno resolvió las misiones con autonomía. Continuar motivándolo con desafíos avanzados.</div>
                    </div>
                  );
                } else {
                  return <div style={{ fontSize: "12px", color: "#94a3b8" }}>El alumno se encuentra en proceso de avance normal.</div>;
                }
              })()}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={() => handleExportIndividualCSV(selectedStudent)} style={styles.btnDrawerExport}>
                  📄 Exportar Ficha a Excel (.CSV)
                </button>
                <button
                  onClick={() => {
                    showToast(`✉️ Sugerencia notificada al Domicilio Electrónico de los padres de ${selectedStudent.name}`);
                  }}
                  style={styles.btnDrawerCiDi}
                >
                  ✉️ Notificar a Padres (CiDi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🎨 ESTILOS CSS-IN-JS
// ==========================================
const styles = {
  appContainer: {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "16px",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: "#020308",
    color: "#cbd5e1",
    minHeight: "100vh"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(2, 3, 8, 0.92)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "16px"
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#080d24",
    borderRadius: "16px",
    border: "2px solid #38bdf8",
    padding: "24px",
    boxShadow: "0 0 35px rgba(56, 189, 248, 0.3)",
    color: "#cbd5e1"
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "900",
    color: "#38bdf8",
    margin: 0,
    letterSpacing: "0.5px"
  },
  modalSub: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: "2px 0 0 0"
  },
  welcomeBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px"
  },
  welcomeText: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#e2e8f0",
    backgroundColor: "#02040e",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    margin: 0
  },
  welcomePoint: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    backgroundColor: "#02040e",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    fontSize: "12px"
  },
  btnPrimaryModal: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#38bdf8",
    color: "#020308",
    border: "none",
    borderRadius: "8px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)"
  },
  sessionForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left"
  },
  label: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#94a3b8"
  },
  input: {
    padding: "10px",
    backgroundColor: "#02040e",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "13px"
  },
  toastCard: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#10b981",
    color: "#021715",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "900",
    fontSize: "12px",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
    zIndex: 10000
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(8, 13, 36, 0.8)",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "12px 18px",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "10px"
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  brandBadge: {
    backgroundColor: "#38bdf8",
    color: "#020308",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "900",
    fontSize: "14px"
  },
  brandTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#ffffff"
  },
  brandMeta: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "2px"
  },
  navActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },
  btnNavOutline: {
    padding: "7px 12px",
    backgroundColor: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  btnNavExcel: {
    padding: "7px 14px",
    backgroundColor: "#10b981",
    color: "#021715",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)"
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "16px"
  },
  kpiCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  kpiLabel: {
    fontSize: "10px",
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: "0.5px"
  },
  kpiValue: {
    fontSize: "26px",
    fontWeight: "900"
  },
  kpiSub: {
    fontSize: "10px",
    color: "#64748b"
  },
  broadcastCard: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    border: "1px solid #8b5cf6",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px"
  },
  broadcastHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px"
  },
  broadcastForm: {
    display: "flex",
    gap: "10px"
  },
  broadcastInput: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "#02040e",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "12px"
  },
  btnBroadcast: {
    padding: "8px 16px",
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "11px",
    cursor: "pointer"
  },
  tabNav: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px"
  },
  tabActive: {
    padding: "8px 16px",
    backgroundColor: "#1e3a8a",
    color: "#38bdf8",
    border: "1px solid #38bdf8",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "12px",
    cursor: "pointer"
  },
  tabInactive: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#64748b",
    border: "1px solid #1e293b",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "12px",
    cursor: "pointer"
  },
  tableCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "16px"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  },
  tableTitle: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: 0,
    textTransform: "uppercase"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  trHeader: {
    borderBottom: "1px solid #1e293b"
  },
  th: {
    padding: "10px 8px",
    fontSize: "10px",
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase"
  },
  tr: {
    borderBottom: "1px solid #111827"
  },
  tdName: {
    padding: "10px 8px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff"
  },
  shipSub: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "normal"
  },
  td: {
    padding: "10px 8px",
    fontSize: "12px"
  },
  tdXP: {
    padding: "10px 8px",
    fontSize: "12px",
    color: "#38bdf8"
  },
  tdActions: {
    padding: "10px 8px",
    display: "flex",
    gap: "6px"
  },
  badgeConnected: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#4ade80",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #10b981"
  },
  badgePending: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#94a3b8",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #475569"
  },
  cellPill: {
    display: "inline-flex",
    gap: "6px",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid",
    fontSize: "11px",
    fontWeight: "bold"
  },
  cellBlocked: {
    color: "#475569",
    fontSize: "12px",
    paddingLeft: "12px"
  },
  justMaster: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#4ade80",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    padding: "2px 6px",
    borderRadius: "4px"
  },
  justIntuitive: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    padding: "2px 6px",
    borderRadius: "4px"
  },
  btnActionAnalyze: {
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "#1e3a8a",
    color: "#38bdf8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  btnActionExport: {
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "#065f46",
    color: "#34d399",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  misionBreakdownGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },
  misionCard: {
    backgroundColor: "rgba(7, 12, 34, 0.75)",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  misionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  misionTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: 0
  },
  misionSub: {
    fontSize: "11px",
    color: "#94a3b8"
  },
  misionProgressBox: {
    backgroundColor: "#02040e",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #111827"
  },
  misionProgressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    marginBottom: "6px"
  },
  progressBarBg: {
    height: "8px",
    backgroundColor: "#1e293b",
    borderRadius: "4px",
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: "4px"
  },
  desviosSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  desviosTitle: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#cbd5e1"
  },
  desvioRow: (hasErrors) => ({
    backgroundColor: hasErrors ? "rgba(251, 146, 60, 0.08)" : "#02040e",
    border: `1px solid ${hasErrors ? "#fb923c" : "#111827"}`,
    borderRadius: "6px",
    padding: "8px 10px"
  }),
  desvioRowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2px"
  },
  desvioCode: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#fb923c"
  },
  desvioCount: {
    fontSize: "10px",
    color: "#94a3b8"
  },
  desvioTitle: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#ffffff"
  },
  desvioAulaTip: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "4px",
    fontStyle: "italic"
  },
  drawerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000
  },
  drawerCard: {
    width: "400px",
    height: "100%",
    backgroundColor: "#070c22",
    padding: "20px",
    boxSizing: "border-box",
    borderLeft: "1px solid #1e293b",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "10px",
    marginBottom: "14px"
  },
  drawerTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: 0
  },
  btnCloseDrawer: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#64748b",
    cursor: "pointer"
  },
  drawerBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  drawerKpiBox: {
    backgroundColor: "#02040e",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "11px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px"
  },
  drawerSectionTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: "8px 0 4px 0",
    textTransform: "uppercase"
  },
  drawerMissionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  drawerMisionItem: {
    backgroundColor: "#02040e",
    border: "1px solid #1e293b",
    borderRadius: "6px",
    padding: "8px",
    fontSize: "11px"
  },
  expertBox: {
    backgroundColor: "rgba(251, 146, 60, 0.08)",
    borderLeft: "4px solid #fb923c",
    borderRadius: "6px",
    padding: "10px"
  },
  btnDrawerExport: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#065f46",
    color: "#34d399",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "11px",
    cursor: "pointer"
  },
  btnDrawerCiDi: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "11px",
    cursor: "pointer"
  }
};
