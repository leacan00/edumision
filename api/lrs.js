export default function handler(req, res) {
  // Configuración para permitir peticiones
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const statement = req.body;
    console.log("[LRS Vercel] Enunciado xAPI recibido:", statement);

    // Responde al celular confirmando la recepción del dato
    return res.status(200).json({ 
      status: "persisted", 
      timestamp: new Date().toISOString(),
      received: statement 
    });
  }

  return res.status(200).json({ message: "Servidor de Telemetría EduMisión en Vercel Activo" });
}
