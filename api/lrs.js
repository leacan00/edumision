// Endpoint LRS / API en Vercel Serverless Function (/api/lrs)
// Manejo multi-aula con aislamiento por docente_id / curso_id

if (!global.edumisionLRS) {
  global.edumisionLRS = {
    statements: [],
    courses: {} // Almacena el roster aislado por curso
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. INGESTA DE TELEMETRÍA XAPI (DESDE EL CELULAR DEL ALUMNO)
  if (req.method === 'POST') {
    const statement = req.body || {};
    const actor = statement.actor || {};
    const cursoId = statement.curso_id || "curso-demo-1a";
    const uuid = actor.uuid || "anon-student";
    const name = actor.name || "Alumno/a";
    const verb = statement.verb?.id || "interacted";
    const object = statement.object?.id || "mision";
    const action = statement.object?.description || "";
    const xp = statement.xp || 0;
    const errors = statement.errors || 0;

    // Asegurar estructura del curso aislado
    if (!global.edumisionLRS.courses[cursoId]) {
      global.edumisionLRS.courses[cursoId] = {
        teacherMessage: "¡Bienvenidos a la cabina espacial! Lean con atención.",
        students: {}
      };
    }

    const currentCourse = global.edumisionLRS.courses[cursoId];

    // Registrar o actualizar alumno dentro de la nómina de su curso
    if (!currentCourse.students[uuid]) {
      currentCourse.students[uuid] = {
        id: Object.keys(currentCourse.students).length + 1,
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
      const st = currentCourse.students[uuid];
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
      cursoId: cursoId,
      studentCount: Object.keys(currentCourse.students).length
    });
  }

  // 2. CONSULTA EN VIVO DEL ROSTER AISLADO POR CURSO (PARA EL DOCENTE)
  if (req.method === 'GET') {
    const cursoId = req.query.curso_id || "curso-demo-1a";
    const courseData = global.edumisionLRS.courses[cursoId] || { teacherMessage: "", students: {} };
    const studentsList = Object.values(courseData.students);

    return res.status(200).json({
      status: "active",
      cursoId: cursoId,
      teacherMessage: courseData.teacherMessage,
      totalActiveStudents: studentsList.length,
      students: studentsList
    });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
