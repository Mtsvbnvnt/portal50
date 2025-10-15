import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import jsPDF from "jspdf";

interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  modalidadPreferida?: string;
  cv?: string;
  fotoPerfil?: string;
  disponibilidad?: "disponible" | "con condiciones" | "no disponible";
  rol?: string;
  educaciones?: { institucion: string; titulo: string; desde: string; hasta: string }[];
  experiencias?: { empresa: string; cargo: string; desde: string; hasta: string }[];
  habilidades?: string[];
}

export default function Dashboard() {
  const generarPDF = () => {
    if (!user) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Curriculum Vitae", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Nombre: ${user.nombre}`, 20, y);
    y += 8;
    doc.text(`Email: ${user.email}`, 20, y);
    y += 8;
    doc.text(`Teléfono: ${user.telefono || ""}`, 20, y);
    y += 8;
    doc.text(`País: ${user.pais || ""}`, 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.text("Educación", 20, y);
    y += 8;
    doc.setFontSize(12);
    if (user.educaciones) {
      user.educaciones.forEach((edu: any) => {
        doc.text(`Institución: ${edu.institucion}`, 22, y);
        y += 6;
        doc.text(`Título: ${edu.titulo} (${edu.ciudad}, ${edu.pais})`, 22, y);
        y += 6;
        doc.text(`Desde: ${edu.desde} - Hasta: ${edu.hasta}`, 22, y);
        y += 6;
        if (edu.cursos) {
          doc.text(`Cursos relevantes: ${edu.cursos}`, 22, y);
          y += 6;
        }
        y += 2;
      });
    }
    y += 6;
    doc.setFontSize(14);
    doc.text("Experiencia Laboral", 20, y);
    y += 8;
    doc.setFontSize(12);
    if (user.experiencias) {
      user.experiencias.forEach((exp: any) => {
        doc.text(`Año: ${exp.anio} - Empresa: ${exp.empresa} - Cargo: ${exp.cargo}`, 22, y);
        y += 6;
      });
    }
    y += 6;
    if (user.habilidades) {
      doc.setFontSize(14);
      doc.text("Habilidades Técnicas", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(user.habilidades, 22, y);
      y += 6;
    }
    doc.save("CV.pdf");
  };
  
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState("perfil");
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursosExpandido, setCursosExpandido] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      if (
        parsedUser.fotoPerfil &&
        typeof parsedUser.fotoPerfil === "string" &&
        !parsedUser.fotoPerfil.startsWith("http")
      ) {
        parsedUser.fotoPerfil = `http://localhost:3000${parsedUser.fotoPerfil}`;
      }
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      if (!user?._id) return;
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:3000/api/postulaciones/usuario/${user._id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPostulaciones(data);
      } catch (err) {
        console.error("❌ Error cargando postulaciones:", err);
      }
    };

    if (tab === "postulaciones" || tab === "perfil") {
      fetchPostulaciones();
    }
  }, [tab, user]);

  useEffect(() => {
    const fetchCursos = async () => {
      if (!user?._id || !user.rol || !["profesional"].includes(user.rol)) return;
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:3000/api/cursos/usuario/${user._id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error("❌ Error cargando cursos:", err);
      }
    };

    if (tab === "cursos" || tab === "perfil") {
      fetchCursos();
    }
  }, [tab, user]);

  

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header del Dashboard */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user?.fotoPerfil || "/default-user.png"}
                  alt="Foto de perfil"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-user.png";
                  }}
                />
                {user?.disponibilidad && (
                  <div
                    className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${
                      user.disponibilidad === "disponible"
                        ? "bg-green-500"
                        : user.disponibilidad === "con condiciones"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    title={`Estado: ${user.disponibilidad}`}
                  />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  ¡Hola, {user?.nombre}! 👋
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Bienvenido a tu panel profesional
                </p>
                {user?.disponibilidad && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.disponibilidad === "disponible"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : user.disponibilidad === "con condiciones"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        user.disponibilidad === "disponible" ? "bg-green-500" :
                        user.disponibilidad === "con condiciones" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      {user.disponibilidad === "disponible" && "Disponible para trabajar"}
                      {user.disponibilidad === "con condiciones" && "Disponible con condiciones"}
                      {user.disponibilidad === "no disponible" && "No disponible"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generarPDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar CV
              </button>
              <Link
                to="/configuracion"
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Postulaciones</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {postulaciones.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ofertas aplicadas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cursos Publicados</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {cursos.filter((c) => {
                    const profId = typeof c.profesionalId === "string" ? c.profesionalId : c.profesionalId?._id;
                    return profId === user?._id;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Compartiendo conocimiento</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cursos Tomados</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {cursos.filter((c) => {
                    const profId = typeof c.profesionalId === "string" ? c.profesionalId : c.profesionalId?._id;
                    return profId !== user?._id;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Aprendizaje continuo</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visitas al Perfil</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">0</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Visibilidad del perfil</p>
          </div>
        </div>

        {/* Navegación por pestañas mejorada */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTab("perfil")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                tab === "perfil"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Perfil
            </button>
            <button
              onClick={() => setTab("postulaciones")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                tab === "postulaciones"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Mis Postulaciones
              {postulaciones.length > 0 && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {postulaciones.length}
                </span>
              )}
            </button>
            {["profesional", "profesional-ejecutivo"].includes(user?.rol || "") && (
              <button
                onClick={() => setTab("cursos")}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  tab === "cursos"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Mis Cursos
                {cursos.length > 0 && (
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                    {cursos.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Contenido de las pestañas */}
        {/* Mi Perfil */}
        {tab === "perfil" && (
          <div className="space-y-8">
            {/* Información Personal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Información Personal</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.nombre || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.email || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.telefono || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">País</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.pais || "No especificado"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Modalidad preferida</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.modalidadPreferida || "No especificada"}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Descripción profesional</p>
                    </div>
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {user?.experiencia || "Sin descripción registrada."}
                    </p>
                  </div>

                  {user?.cv ? (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-200">CV Disponible</p>
                            <p className="text-sm text-green-600 dark:text-green-400">Tu currículum está listo</p>
                          </div>
                        </div>
                        <a
                          href={`http://localhost:3000/api/users/download/${user.cv.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Descargar
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.958-.833-2.728 0L4.186 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Completa tu perfil
                      </h3>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                        Sube tu CV y completa tu información para tener mayor visibilidad
                      </p>
                      <Link
                        to="/completar-perfil"
                        className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Completar Perfil
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acciones Rápidas</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  to="/trabajar"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Buscar Trabajo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explora nuevas oportunidades</p>
                  </div>
                </Link>

                <Link
                  to="/aprender"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Aprender</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Descubre nuevos cursos</p>
                  </div>
                </Link>

                <Link
                  to="/subir-curso"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Crear Curso</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comparte tu conocimiento</p>
                  </div>
                </Link>

                <Link
                  to="/completar-cv"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Completar CV</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mejora tu perfil profesional</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mis Postulaciones */}
        {tab === "postulaciones" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Postulaciones</h2>
                <p className="text-gray-600 dark:text-gray-400">Seguimiento de tus aplicaciones laborales</p>
              </div>
            </div>

            {postulaciones.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Aún no tienes postulaciones
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Comienza tu búsqueda laboral explorando las ofertas disponibles en nuestra plataforma
                </p>
                <Link
                  to="/trabajar"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar Ofertas de Trabajo
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {postulaciones.map((p) => {
                  const getEstadoColor = (estado: string) => {
                    switch (estado) {
                      case "preseleccionado":
                        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
                      case "rechazado":
                        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
                      case "en revision":
                        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
                      default:
                        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
                    }
                  };

                  const getEstadoIcon = (estado: string) => {
                    switch (estado) {
                      case "preseleccionado":
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      case "rechazado":
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      case "en revision":
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      default:
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                    }
                  };

                  return (
                    <div
                      key={p._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {p.ofertaId?.titulo?.[0] || "?"}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {p.ofertaId?.titulo || "Oferta desconocida"}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                  </svg>
                                  Postulado el {new Date(p.fechaPostulacion).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                                {p.ofertaId?.empresaId && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {p.ofertaId.empresaId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getEstadoColor(p.estado)}`}
                          >
                            {getEstadoIcon(p.estado)}
                            {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Mis Cursos */}
        {tab === "cursos" && (
          <div className="space-y-8">
            {/* Cursos Suscritos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cursos Suscritos</h2>
                  <p className="text-gray-600 dark:text-gray-400">Cursos en los que estás inscrito</p>
                </div>
              </div>

              {cursos.filter((c) => {
                const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                return profId !== user?._id;
              }).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    No tienes cursos suscritos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Explora nuestra plataforma de aprendizaje y encuentra cursos que te interesen
                  </p>
                  <Link
                    to="/aprender"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explorar Cursos
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cursos.filter((c) => {
                    const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                    return profId !== user?._id;
                  }).map((curso) => (
                    <div key={curso._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{curso.titulo}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{curso.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Duración: {curso.duracionMinutos} min
                        </span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ${curso.precio} CLP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mis Cursos Publicados */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Cursos Publicados</h2>
                    <p className="text-gray-600 dark:text-gray-400">Comparte tu conocimiento con otros</p>
                  </div>
                </div>
                <Link
                  to="/subir-curso"
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Curso
                </Link>
              </div>

              {cursos.filter((c) => {
                const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                return profId === user?._id;
              }).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    No has publicado cursos aún
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Comparte tu experiencia y conocimiento creando cursos para otros profesionales
                  </p>
                  <Link
                    to="/subir-curso"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Mi Primer Curso
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cursos.filter((c) => {
                    const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                    return profId === user?._id;
                  }).map((curso) => {
                    const estaExpandido = cursosExpandido.includes(curso._id);
                    const toggleExpandir = () => {
                      setCursosExpandido((prev) =>
                        prev.includes(curso._id)
                          ? prev.filter((id) => id !== curso._id)
                          : [...prev, curso._id]
                      );
                    };

                    const eliminarCurso = async () => {
                      if (!confirm("¿Estás seguro de eliminar este curso?")) return;
                      try {
                        const idToken = await auth.currentUser?.getIdToken();
                        const res = await fetch(`http://localhost:3000/api/cursos/${curso._id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${idToken}` },
                        });
                        if (!res.ok) throw new Error("No se pudo eliminar");
                        setCursos((prev) => prev.filter((c) => c._id !== curso._id));
                      } catch (error) {
                        console.error("Error eliminando curso:", error);
                        alert("No se pudo eliminar el curso.");
                      }
                    };

                    const toggleEstadoCurso = async () => {
                      try {
                        const idToken = await auth.currentUser?.getIdToken();
                        const res = await fetch(`http://localhost:3000/api/cursos/${curso._id}/estado`, {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${idToken}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            activo: !curso.activo,
                          }),
                        });
                        if (!res.ok) throw new Error("No se pudo actualizar estado");
                        const actualizado = await res.json();
                        setCursos((prev) =>
                          prev.map((c) => (c._id === curso._id ? actualizado : c))
                        );
                      } catch (err) {
                        console.error("Error al cambiar estado del curso:", err);
                        alert("No se pudo cambiar el estado del curso.");
                      }
                    };

                    return (
                      <div key={curso._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{curso.titulo}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            curso.activo 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {curso.activo ? "Activo" : "Pausado"}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{curso.descripcion}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Categoría:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{curso.categoria}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Duración:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{curso.duracionMinutos} min</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Precio:</span>
                            <p className="font-medium text-green-600 dark:text-green-400">${curso.precio} CLP</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{curso.tipoPago}</p>
                          </div>
                        </div>

                        {estaExpandido && (
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                onClick={() => alert("Función de edición en desarrollo")}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                              </button>
                              <button
                                className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                                  curso.activo 
                                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                                onClick={toggleEstadoCurso}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                    curso.activo 
                                      ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      : "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 5a9 9 0 1118 0 9 9 0 01-18 0z"
                                  } />
                                </svg>
                                {curso.activo ? "Pausar" : "Reanudar"}
                              </button>
                              <button
                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                onClick={eliminarCurso}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                              </button>
                              <button
                                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                onClick={() => alert("Próximamente: ver inscritos")}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Ver Inscritos
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={toggleExpandir}
                          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium w-full text-center py-2 border-t border-gray-200 dark:border-gray-600"
                        >
                          {estaExpandido ? "Ocultar opciones" : "Ver opciones"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
