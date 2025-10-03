// src/pages/Aprender.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../config/api";

interface Curso {
  _id: string;
  titulo: string;
  descripcion: string;
  videoIntro: string;
  precio: number;
  categoria: string;
  instructor: {
    nombre: string;
    avatar?: string;
  };
  rating: number;
  numeroEstudiantes: number;
  duracion: string;
  nivel: string;
}

const categorias = [
  { nombre: "Todas las categorías", valor: "" },
  { nombre: "Programación", valor: "programacion" },
  { nombre: "Marketing", valor: "marketing" },
  { nombre: "Data Science", valor: "data-science" },
  { nombre: "Diseño", valor: "diseño" },
  { nombre: "Negocios", valor: "negocios" },
  { nombre: "Idiomas", valor: "idiomas" }
];

const opcionesOrden = [
  { nombre: "Más relevantes", valor: "relevancia" },
  { nombre: "Más recientes", valor: "recientes" },
  { nombre: "Mejor valorados", valor: "rating" },
  { nombre: "Precio menor", valor: "precio-asc" },
  { nombre: "Precio mayor", valor: "precio-desc" }
];

export default function Aprender() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("relevancia");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const res = await fetch(getApiUrl("/api/cursos"));
        const data = await res.json();
        console.log("🎥 Cursos obtenidos:", data);
        
        // Simular datos adicionales si no vienen del backend
        const cursosEnriquecidos = data.map((curso: any) => ({
          ...curso,
          instructor: curso.instructor || { nombre: "Instructor" },
          rating: curso.rating || 4.5,
          numeroEstudiantes: curso.numeroEstudiantes || Math.floor(Math.random() * 1000) + 100,
          duracion: curso.duracion || "3h 30min",
          nivel: curso.nivel || "Intermedio",
          categoria: curso.categoria || "programacion"
        }));
        
        setCursos(cursosEnriquecidos);
      } catch (error) {
        console.error("❌ Error al obtener cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'programacion': return '💻';
      case 'marketing': return '📈';
      case 'data-science': return '📊';
      case 'diseño': return '🎨';
      case 'negocios': return '💼';
      case 'idiomas': return '🌍';
      default: return '📚';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'programacion': return 'from-blue-500 to-purple-600';
      case 'marketing': return 'from-green-500 to-teal-600';
      case 'data-science': return 'from-purple-500 to-pink-600';
      case 'diseño': return 'from-pink-500 to-red-600';
      case 'negocios': return 'from-yellow-500 to-orange-600';
      case 'idiomas': return 'from-indigo-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const cursosFiltrados = cursos.filter(curso => {
    const matchesBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           curso.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategoria = !categoriaSeleccionada || curso.categoria === categoriaSeleccionada;
    return matchesBusqueda && matchesCategoria;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Cursos <span className="text-blue-600">Portal50+</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre cursos impartidos por profesionales experimentados. Aprende nuevas 
              habilidades y potencia tu carrera.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex-1 min-w-80">
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categorias.map(categoria => (
                <option key={categoria.valor} value={categoria.valor}>
                  {categoria.nombre}
                </option>
              ))}
            </select>

            <select
              value={ordenSeleccionado}
              onChange={(e) => setOrdenSeleccionado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {opcionesOrden.map(opcion => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.nombre}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Buscar
            </button>
            
            <button 
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("");
                setOrdenSeleccionado("relevancia");
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Categorías destacadas */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { nombre: "Programación", categoria: "programacion", icono: "💻" },
            { nombre: "Marketing", categoria: "marketing", icono: "📈" },
            { nombre: "Data Science", categoria: "data-science", icono: "📊" }
          ].map(cat => (
            <div
              key={cat.categoria}
              onClick={() => setCategoriaSeleccionada(cat.categoria)}
              className={`cursor-pointer bg-gradient-to-r ${getCategoriaColor(cat.categoria)} rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="text-4xl mb-2">{cat.icono}</div>
              <h3 className="text-xl font-bold">{cat.nombre}</h3>
            </div>
          ))}
        </div>

        {/* Lista de cursos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando cursos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosFiltrados.map((curso) => (
              <div key={curso._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Imagen/Video del curso */}
                <div className="relative">
                  <div className={`h-48 bg-gradient-to-r ${getCategoriaColor(curso.categoria)} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">{getCategoriaIcon(curso.categoria)}</div>
                      <div className="text-sm opacity-90">{curso.categoria.charAt(0).toUpperCase() + curso.categoria.slice(1)}</div>
                    </div>
                  </div>
                  
                  {/* Badge de categoría */}
                  <div className="absolute top-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    {curso.categoria.charAt(0).toUpperCase() + curso.categoria.slice(1)}
                  </div>
                </div>

                <div className="p-6">
                  {/* Instructor */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                      <span className="text-sm">👨‍🏫</span>
                    </div>
                    <span className="text-sm text-gray-600">Instructor</span>
                  </div>

                  {/* Título */}
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {curso.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {curso.descripcion}
                  </p>

                  {/* Rating y detalles */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex">{renderStars(curso.rating)}</div>
                      <span className="text-sm text-gray-600 ml-1">({curso.rating})</span>
                    </div>
                    <span className="text-xs text-gray-500">{curso.duracion}</span>
                  </div>

                  {/* Precio y botón */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${curso.precio.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">por mes</div>
                    </div>
                    
                    <Link
                      to={`/aprender/curso/${curso._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ver curso
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay cursos */}
        {!loading && cursosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </main>
  );
}
