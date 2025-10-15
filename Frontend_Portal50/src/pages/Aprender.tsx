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
        console.log("Cursos obtenidos:", data);
        
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
        console.error("Error al obtener cursos:", error);
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
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'programacion': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'marketing': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'data-science': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'diseño': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        );
      case 'negocios': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      case 'idiomas': 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        );
      default: 
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cursos <span className="text-blue-200">Portal50+</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Descubre cursos impartidos por profesionales experimentados. Aprende nuevas 
              habilidades y potencia tu carrera con conocimiento de calidad.
            </p>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{cursos.length}+</div>
                <div className="text-blue-200">Cursos disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">Instructores expertos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-blue-200">Estudiantes activos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex-1 min-w-80 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar cursos por título o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
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
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              {opcionesOrden.map(opcion => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.nombre}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
              Buscar
            </button>
            
            <button 
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("");
                setOrdenSeleccionado("relevancia");
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors px-4 py-3 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Categorías destacadas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Categorías populares</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { nombre: "Programación", categoria: "programacion" },
              { nombre: "Marketing", categoria: "marketing" },
              { nombre: "Data Science", categoria: "data-science" }
            ].map(cat => (
              <div
                key={cat.categoria}
                onClick={() => setCategoriaSeleccionada(cat.categoria)}
                className={`cursor-pointer bg-gradient-to-r ${getCategoriaColor(cat.categoria)} rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                <div className="flex justify-center mb-4 text-white">
                  {getCategoriaIcon(cat.categoria)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{cat.nombre}</h3>
                <p className="text-white/80">Explora cursos especializados</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de cursos */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando cursos increíbles...</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {categoriaSeleccionada ? `Cursos de ${categorias.find(c => c.valor === categoriaSeleccionada)?.nombre}` : 'Todos los cursos'}
              </h2>
              <span className="text-gray-600">{cursosFiltrados.length} cursos encontrados</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursosFiltrados.map((curso) => (
                <div key={curso._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                  {/* Header del curso */}
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-r ${getCategoriaColor(curso.categoria)} flex items-center justify-center text-white`}>
                      {getCategoriaIcon(curso.categoria)}
                    </div>
                    
                    {/* Badge de categoría */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                      {curso.categoria.charAt(0).toUpperCase() + curso.categoria.slice(1)}
                    </div>
                    
                    {/* Badge de nivel */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-medium">
                      {curso.nivel}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Instructor */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Instructor</div>
                        <div className="text-xs text-gray-500">Profesional certificado</div>
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 leading-tight">
                      {curso.titulo}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {curso.descripcion}
                    </p>

                    {/* Detalles del curso */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600">{curso.duracion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="text-gray-600">{curso.numeroEstudiantes}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(curso.rating)}</div>
                        <span className="text-sm text-gray-600 font-medium">({curso.rating})</span>
                      </div>
                    </div>

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          ${curso.precio.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Precio total</div>
                      </div>
                      
                      <Link
                        to={`/aprender/curso/${curso._id}`}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Ver curso
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay cursos */}
        {!loading && cursosFiltrados.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron cursos</h3>
            <p className="text-gray-500 text-lg mb-6">Intenta ajustar tus filtros de búsqueda o explora otras categorías</p>
            <button 
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("");
                setOrdenSeleccionado("relevancia");
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Ver todos los cursos
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
