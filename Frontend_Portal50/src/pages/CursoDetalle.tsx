// src/pages/CursoDetalle.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Evaluacion {
  _id: string;
  evaluador: {
    nombre: string;
    fotoPerfil: string;
  };
  estrellas: number;
  comentario: string;
  fecha: string;
}

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState<any>(null);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cursos/${id}`);
        if (!res.ok) throw new Error("Error al obtener curso");
        const data = await res.json();
        setCurso(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/evaluacion/curso/${id}`);
        if (!res.ok) throw new Error("Error al obtener evaluaciones");
        const data = await res.json();
        setEvaluaciones(data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchCurso(), fetchEvaluaciones()]).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  if (!curso) {
    return <div className="p-10 text-center text-red-500">No se pudo cargar el curso.</div>;
  }

  const estrellas = "[★]".repeat(Math.round(curso.calificacionPromedio || 0));

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Video Intro */}
        <div className="aspect-video mb-8">
          <video controls className="w-full h-full object-cover rounded-lg shadow">
            <source src={`http://localhost:3000${curso.videoIntro}`} type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        </div>

        {/* Información principal */}
        <h1 className="text-3xl font-bold mb-2">{curso.titulo}</h1>
        <p className="text-gray-600 mb-4">{curso.descripcion}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {curso.categoria}
          </span>
          <span className="text-yellow-500 text-lg">
            {estrellas || "Sin valoración aún"}
          </span>
          <span className="text-green-700 font-semibold text-lg">
            ${curso.precio.toLocaleString()}{" "}
            {curso.tipoPago === "paquete" ? "por paquete" : "por sesión"}
          </span>
        </div>

        {/* Duración */}
        <div className="mb-6 text-sm text-gray-700">
          [DURACIÓN] Duración estimada: <strong>{curso.duracionMinutos || "?"} minutos</strong>
        </div>

        {/* Profesional */}
        {curso.profesionalId && (
          <div className="flex items-center space-x-4 mb-8">
            <img
              src={
                curso.profesionalId.fotoPerfil
                  ? `http://localhost:3000${curso.profesionalId.fotoPerfil}`
                  : "/default-user.png"
              }
              alt="Profesional"
              className="w-14 h-14 rounded-full border object-cover"
              onError={(e) => (e.currentTarget.src = "/default-user.png")}
            />
            <div>
              <Link
                to={`/perfil-trabajador/${curso.profesionalId.uid}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {curso.profesionalId.nombre || "Profesional"}
              </Link>
            </div>
          </div>
        )}

        {/* Agenda */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-lg font-bold mb-2">📅 Fechas disponibles</h2>
          {curso.agendaDisponible?.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {curso.agendaDisponible.map((fecha: string, index: number) => (
                <li key={index}>{new Date(fecha).toLocaleString("es-CL")}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Este curso aún no tiene fechas disponibles.</p>
          )}
        </div>

        {/* Botón Comprar */}
        <div className="mb-10 text-center">
          <button
            onClick={() => {}}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow"
          >
            [COMPRAR] Comprar curso
          </button>
        </div>

        {/* Evaluaciones del curso */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">[OPINIONES] Opiniones de estudiantes</h2>

          {evaluaciones.length === 0 ? (
            <p className="text-gray-500">Aún no hay evaluaciones para este curso.</p>
          ) : (
            <ul className="space-y-6">
              {evaluaciones.map((evaluacion) => (
                <li key={evaluacion._id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={evaluacion.evaluador.fotoPerfil || "/default-user.png"}
                      alt="Evaluador"
                      className="w-10 h-10 rounded-full border object-cover mr-3"
                      onError={(e) => (e.currentTarget.src = "/default-user.png")}
                    />
                    <div>
                      <p className="font-semibold">{evaluacion.evaluador.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(evaluacion.fecha).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <p className="text-yellow-500 text-lg mb-1">
                    {"[★]".repeat(evaluacion.estrellas)}
                  </p>
                  <p className="text-gray-700 text-sm">{evaluacion.comentario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
