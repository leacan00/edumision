// Endpoint LRS / API en Vercel Serverless Function (/api/lrs)
// Administra telemetría xAPI, persistencia por alumno y balanceo de carga entre docentes.

if (!global.edumisionLRS) {
  global.edumisionLRS = {
    teachers: {},      // { [teacherId]: { name, curso, registeredAt } }
    teacherOrder: [],  // ["profe-laura", "profe-carlos", ...]
    students: {},      // { [uuid]: { name, uuid, assignedTeacherId, xp, helpsRequested, errorsCount, ... } }
    statements: []
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const lrs = global.edumisionLRS;

  // 1. REGISTRO / ACTIVACIÓN DE DOCENTE
  if (req.method === 'POST' && req.query?.action === 'register_teacher') {
    const { teacher_id, teacher_name, curso_id } = req.body || {};
    const tid = (teacher_id || teacher_name || "docente-1").toLowerCase().trim().replace(/\s+/g, '-');
    
    if (!lrs.teachers[tid]) {
      lrs.teachers[tid] = {
        id: tid,
        name: teacher_name || "Docente",
        curso: curso_id || "1° Año B",
        registeredAt: new Date().toISOString()
      };
      if (!lrs.teacherOrder.includes(tid)) {
        lrs.teacherOrder.push(tid);
      }
    }
    return res.status(200).json({ status: "teacher_registered", teacher: lrs.teachers[tid] });
  }

  // 2. RECEPCIÓN DE TELEMETRÍA XAPI DE ALUMNOS (POST /api/lrs)
  if (req.method === 'POST') {
    const statement = req.body || {};
    const actor = statement.actor || {};
    const uuid = actor.uuid || "anon-student";
    const name = actor.name || "Alumno/a";
    const verb = statement.verb?.id || "interacted";
    const object = statement.object?.id || "mision";
    const action = statement.object?.description || "";
    const xp = statement.xp || 0;
    const helpsRequested = statement.helpsRequested || 0;
    const errorsCount = statement.errorsCount || 0;
    const helpsPerMission = statement.helpsPerMission || {};
    const errorsPerMission = statement.errorsPerMission || {};
    const lastErrorCode = statement.lastErrorCode || null;
    const clientTeacherId = statement.teacher_id;

    // Balanceo de Carga entre docentes activos registrados:
    let assignedTeacherId = null;

    if (lrs.students[uuid]?.assignedTeacherId) {
      assignedTeacherId = lrs.students[uuid].assignedTeacherId;
    } else if (clientTeacherId && lrs.teachers[clientTeacherId]) {
      assignedTeacherId = clientTeacherId;
    } else {
      const activeTeachers = lrs.teacherOrder;
      if (activeTeachers.length === 0) {
        assignedTeacherId = "default-teacher";
      } else if (activeTeachers.length === 1) {
        assignedTeacherId = activeTeachers;
      } else {
        let minCount = Infinity;
        let selectedTeacher = activeTeachers;
        
        activeTeachers.forEach(tId => {
          const count = Object.values(lrs.students).filter(s => s.assignedTeacherId === tId).length;
          if (count < minCount) {
            minCount = count;
            selectedTeacher = tId;
          }
        });
        assignedTeacherId = selectedTeacher;
      }
    }

    // Crear o actualizar alumno permanente en LRS
    if (!lrs.students[uuid]) {
      lrs.students[uuid] = {
        id: Object.keys(lrs.students).length + 1,
        name: name,
        uuid: uuid,
        assignedTeacherId: assignedTeacherId,
        xp: xp,
        badgeEarned: statement.badgeEarned || false,
        interestRegistered: statement.interestRegistered || false,
        helpsRequested: helpsRequested,
        errorsCount: errorsCount,
        helpsPerMission: helpsPerMission,
        errorsPerMission: errorsPerMission,
        lastActive: new Date().toLocaleTimeString("es-AR"),
        missions: {
          m1: { status: object === "m1" ? "activa" : "no_iniciado", attempts: 1, helps: helpsPerMission.m1 || 0, errors: errorsPerMission.m1 || 0, lastErrorCode: null },
          m2: { status: "bloqueada", attempts: 0, helps: helpsPerMission.m2 || 0, errors: errorsPerMission.m2 || 0, lastErrorCode: null },
          m3: { status: "bloqueada", attempts: 0, helps: helpsPerMission.m3 || 0, errors: errorsPerMission.m3 || 0, lastErrorCode: null },
          m4: { status: "bloqueada", attempts: 0, helps: helpsPerMission.m4 || 0, errors: helpsPerMission.m4 || 0, lastErrorCode: null }
        }
      };
    }

    const st = lrs.students[uuid];
    st.name = name;
    st.assignedTeacherId = assignedTeacherId;
    st.xp = Math.max(st.xp, xp);
    st.helpsRequested = Math.max(st.helpsRequested, helpsRequested);
    st.errorsCount = Math.max(st.errorsCount, errorsCount);
    st.helpsPerMission = { ...st.helpsPerMission, ...helpsPerMission };
    st.errorsPerMission = { ...st.errorsPerMission, ...errorsPerMission };
    st.badgeEarned = statement.badgeEarned || st.badgeEarned;
    st.interestRegistered = statement.interestRegistered || st.interestRegistered;
    st.justificationQuality = statement.justificationQuality || st.justificationQuality;
    st.lastActive = new Date().toLocaleTimeString("es-AR");

    if (object && st.missions[object]) {
      if (verb === "completed") st.missions[object].status = "completado";
      else if (verb === "started" && st.missions[object].status !== "completado") st.missions[object].status = "activa";
      st.missions[object].helps = helpsPerMission[object] ?? st.missions[object].helps;
      st.missions[object].errors = errorsPerMission[object] ?? st.missions[object].errors;
      if (lastErrorCode) st.missions[object].lastErrorCode = lastErrorCode;
    }

    lrs.statements.unshift({
      timestamp: new Date().toLocaleTimeString("es-AR"),
      uuid, name, verb, object, action
    });
    if (lrs.statements.length > 100) lrs.statements.pop();

    return res.status(200).json({
      status: "persisted",
      assignedTeacherId: assignedTeacherId,
      studentCount: Object.keys(lrs.students).length
    });
  }

  // 3. CONSULTA EN VIVO PARA EL PANEL DOCENTE (GET /api/lrs)
  if (req.method === 'GET') {
    const teacherId = req.query.teacher_id || req.query.curso_id;
    let studentsList = Object.values(lrs.students);

    if (teacherId && teacherId !== "all") {
      const normalizedTid = teacherId.toLowerCase().trim().replace(/\s+/g, '-');
      studentsList = studentsList.filter(s => !s.assignedTeacherId || s.assignedTeacherId === normalizedTid || s.assignedTeacherId === "default-teacher");
    }

    return res.status(200).json({
      status: "active",
      serverTime: new Date().toLocaleTimeString("es-AR"),
      teacherId: teacherId || "all",
      registeredTeachersCount: Object.keys(lrs.teachers).length,
      totalActiveStudents: studentsList.length,
      students: studentsList,
      recentStatements: lrs.statements.slice(0, 15)
    });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
