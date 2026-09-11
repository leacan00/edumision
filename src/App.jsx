import React, { useState, useEffect } from "react";
import AppAlumno from "./AppAlumno";
import AppDocente from "./AppDocente";
import AppControlCentral from "./AppControlCentral";

export default function App() {
  const [rol, setRol] = useState("alumno");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const rolParam = params.get("rol") || params.get("modo") || params.get("view");
      
      if (rolParam === "docente" || rolParam === "profe" || rolParam === "profesor") {
        setRol("docente");
      } else if (rolParam === "cc" || rolParam === "admin" || rolParam === "central") {
        setRol("cc");
      } else {
        setRol("alumno"); // Por defecto entra como alumno
      }
    }
  }, []);

  if (rol === "docente") return <AppDocente />;
  if (rol === "cc") return <AppControlCentral />;
  return <AppAlumno />;
}
