// Endpoint LRS para Vercel Serverless Function (/api/lrs)
// Registra telemetría xAPI de alumnos y sirve el Roster en vivo al Panel Docente

if (!global.edumisionLRS) {
  global.edumisionLRS = {
    statements: [],
    activeStudents: {}
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. RECEPCIÓN DE TELEMETRÍA XAPI (DESDE EL CELULAR DEL ALUMNO)
  if (req.method === 'POST') {
    const statement = req.body || {};
    const actor = statement.actor || {};
    const uuid = actor.uuid || "anon-student";
    const name = actor.name || "Alumno/a";
    const verb = statement.verb?.id || "interacted";
    const object = statement.object?.id || "mision";
    const action = statement.object?.description || "";
    const xp = statement.xp || 0;
    const errors = statement.errors || 0;

    // Registrar evento xAPI
    const newEntry = {
      timestamp: new Date().toLocaleTimeString("es-AR"),
      uuid,
      name,
      verb,
      object,
      action
    };

    global.edumisionLRS.statements.unshift(newEntry);
    if (global.edumisionLRS.statements.length > 100) {
      global.edumisionLRS.statements.pop();
    }

    // Incorporar automáticamente al chico nuevo al Roster del aula
    if (!global.edumisionLRS.activeStudents[uuid]) {
      global.edumisionLRS.activeStudents[uuid] = {
        id: Object.keys(global.edumisionLRS.activeStudents).length + 10,
        name: name,
        shipName: `Nave ${name}`,
        uuid: uuid,
        xp: xp,
        badgeEarned: false,
        interestRegistered: false,
        helpsRequested: 0,
        errorsCount: errors,
        lastActive: new Date().toLocaleTimeString("es-AR"),
        missions: {
          m1: { status: object === "m1" ? "activa" : "no_iniciado", attempts: 1, lastErrorCode: null, helps: 0, errors: 0 },
          m2: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
          m3: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 },
          m4: { status: "bloqueada", attempts: 0, lastErrorCode: null, helps: 0, errors: 0 }
        }
      };
    } else {
      // Actualizar progreso del chico en tiempo real
      const st = global.edumisionLRS.activeStudents[uuid];
      st.name = name;
      st.xp = Math.max(st.xp, xp);
      st.errorsCount = Math.max(st.errorsCount, errors);
      st.lastActive = new Date().toLocaleTimeString("es-AR");
      if (object && st.missions[object]) {
        st.missions[object].status = verb === "completed" ? "completado" : "activa";
      }
    }

    return res.status(200).json({
      status: "persisted",
      timestamp: new Date().toISOString(),
      studentCount: Object.keys(global.edumisionLRS.activeStudents).length
    });
  }

  // 2. CONSULTA EN VIVO DEL ROSTER Y MÉTRICAS (DESDE EL PANEL DOCENTE)
  if (req.method === 'GET') {
    const studentsList = Object.values(global.edumisionLRS.activeStudents);

    return res.status(200).json({
      status: "active",
      serverTime: new Date().toLocaleTimeString("es-AR"),
      totalActiveStudents: studentsList.length,
      students: studentsList,
      recentStatements: global.edumisionLRS.statements.slice(0, 15)
    });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
