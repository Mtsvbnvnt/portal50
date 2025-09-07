// src/pages/Aprender.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Curso {
  _id: string;
  titulo: string;
  descripcion: string;
  videoIntro: string;
  precio: number;
}

export default function Aprender() {
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cursos");
        const data = await res.json();
        console.log("🎥 Cursos obtenidos:", data);
        setCursos(data);
      } catch (error) {
        console.error("❌ Error al obtener cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Explora Cursos Profesionales</h1>
      <p className="text-center text-gray-600 mb-10">Aprende nuevas habilidades directamente de expertos certificados.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cursos.map((curso) => (
          <div key={curso._id} className="border-2 border-gray-200/80 bg-white rounded-lg hover:shadow-blue-400/80 overflow-hidden flex flex-col transition transform hover:-translate-y-1 hover:shadow-lg">
            {/* Video de introducción */}
            <div className="w-full aspect-video">
              <video controls className="w-full h-full object-cover">
                <source src={`http://localhost:3000${curso.videoIntro}`} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            {/* Contenido del curso */}
            <div className="flex-1 p-4 flex flex-col">
              <h2 className="text-lg font-bold mb-1">{curso.titulo}</h2>
              <p className="text-gray-600 text-sm mb-2 flex-1">{curso.descripcion}</p>
              <p className="text-blue-600 font-semibold mb-3">Valor: ${curso.precio.toLocaleString()} CLP</p>
            </div>

            {/* Banner inferior */}
            <Link
              to={`/aprender/curso/${curso._id}`}
              className="block text-center bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition-colors rounded-b-lg"
            >
              Ver más
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
