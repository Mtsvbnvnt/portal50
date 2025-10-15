import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getApiUrl } from '../config/api';

interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  desde: string;
  hasta: string;
  principales_logros: string;
}

interface Educacion {
  institucion: string;
  grado_obtenido: string;
  titulo: string;
  desde: string;
  hasta: string;
}

interface Idioma {
  idioma: string;
  nivel: string;
}

export default function CompletarCV() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Estados para los formularios
  const [experienciasLaborales, setExperienciasLaborales] = useState<ExperienciaLaboral[]>([
    { empresa: '', cargo: '', desde: '', hasta: '', principales_logros: '' }
  ]);

  const [principalesHabilidades, setPrincipalesHabilidades] = useState<string[]>(['']);

  const [educaciones, setEducaciones] = useState<Educacion[]>([
    { institucion: '', grado_obtenido: '', titulo: '', desde: '', hasta: '' }
  ]);

  const [idiomas, setIdiomas] = useState<Idioma[]>([
    { idioma: '', nivel: '' }
  ]);

  // Funciones para manejar experiencias laborales
  const agregarExperiencia = () => {
    setExperienciasLaborales([...experienciasLaborales, { empresa: '', cargo: '', desde: '', hasta: '', principales_logros: '' }]);
  };

  const eliminarExperiencia = (index: number) => {
    if (experienciasLaborales.length > 1) {
      setExperienciasLaborales(experienciasLaborales.filter((_, i) => i !== index));
    }
  };

  const actualizarExperiencia = (index: number, campo: keyof ExperienciaLaboral, valor: string) => {
    const nuevasExperiencias = [...experienciasLaborales];
    nuevasExperiencias[index][campo] = valor;
    setExperienciasLaborales(nuevasExperiencias);
  };

  // Funciones para manejar habilidades
  const agregarHabilidad = () => {
    setPrincipalesHabilidades([...principalesHabilidades, '']);
  };

  const eliminarHabilidad = (index: number) => {
    if (principalesHabilidades.length > 1) {
      setPrincipalesHabilidades(principalesHabilidades.filter((_, i) => i !== index));
    }
  };

  const actualizarHabilidad = (index: number, valor: string) => {
    const nuevasHabilidades = [...principalesHabilidades];
    nuevasHabilidades[index] = valor;
    setPrincipalesHabilidades(nuevasHabilidades);
  };

  // Funciones para manejar educación
  const agregarEducacion = () => {
    setEducaciones([...educaciones, { institucion: '', grado_obtenido: '', titulo: '', desde: '', hasta: '' }]);
  };

  const eliminarEducacion = (index: number) => {
    if (educaciones.length > 1) {
      setEducaciones(educaciones.filter((_, i) => i !== index));
    }
  };

  const actualizarEducacion = (index: number, campo: keyof Educacion, valor: string) => {
    const nuevasEducaciones = [...educaciones];
    nuevasEducaciones[index][campo] = valor;
    setEducaciones(nuevasEducaciones);
  };

  // Funciones para manejar idiomas
  const agregarIdioma = () => {
    setIdiomas([...idiomas, { idioma: '', nivel: '' }]);
  };

  const eliminarIdioma = (index: number) => {
    if (idiomas.length > 1) {
      setIdiomas(idiomas.filter((_, i) => i !== index));
    }
  };

  const actualizarIdioma = (index: number, campo: keyof Idioma, valor: string) => {
    const nuevosIdiomas = [...idiomas];
    nuevosIdiomas[index][campo] = valor;
    setIdiomas(nuevosIdiomas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuario no autenticado');
        return;
      }

      const idToken = await user.getIdToken();

      // Filtrar datos vacíos
      const experienciasValidas = experienciasLaborales.filter(exp => 
        exp.empresa.trim() || exp.cargo.trim() || exp.desde.trim() || exp.hasta.trim()
      );

      const habilidadesValidas = principalesHabilidades.filter(hab => hab.trim());

      const educacionesValidas = educaciones.filter(edu => 
        edu.institucion.trim() || edu.grado_obtenido.trim() || edu.titulo.trim()
      );

      const idiomasValidos = idiomas.filter(idioma => 
        idioma.idioma.trim() && idioma.nivel.trim()
      );

      const datosCV = {
        experienciasLaborales: experienciasValidas,
        principalesHabilidades: habilidadesValidas,
        educaciones: educacionesValidas,
        idiomas: idiomasValidos
      };

      const response = await fetch(getApiUrl('/api/users/completar-cv'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(datosCV)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la información del CV');
      }

      setSuccess('¡CV completado exitosamente!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Error al completar el CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Completar CV
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Completa los siguientes campos con tu experiencia de los <span className="font-semibold text-orange-600">últimos 10 años</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Experiencia Laboral */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1) Experiencia Laboral</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 10 años</p>
              </div>
            </div>

            {experienciasLaborales.map((exp, index) => (
              <div key={index} className="mb-6 p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Experiencia {index + 1}
                  </h3>
                  {experienciasLaborales.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarExperiencia(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={exp.empresa}
                      onChange={(e) => actualizarExperiencia(index, 'empresa', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={exp.cargo}
                      onChange={(e) => actualizarExperiencia(index, 'cargo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Tu posición en la empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desde (fecha)
                    </label>
                    <input
                      type="month"
                      value={exp.desde}
                      onChange={(e) => actualizarExperiencia(index, 'desde', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hasta (fecha)
                    </label>
                    <input
                      type="month"
                      value={exp.hasta}
                      onChange={(e) => actualizarExperiencia(index, 'hasta', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Principales logros
                  </label>
                  <textarea
                    value={exp.principales_logros}
                    onChange={(e) => actualizarExperiencia(index, 'principales_logros', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Describe tus principales logros y responsabilidades en este puesto..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={agregarExperiencia}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar otra experiencia
            </button>
          </div>

          {/* 2. Principales Habilidades */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2) Principales Habilidades</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Campo abierto para ingresar lista</p>
              </div>
            </div>

            {principalesHabilidades.map((habilidad, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={habilidad}
                  onChange={(e) => actualizarHabilidad(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Ej: JavaScript, Liderazgo de equipos, Análisis de datos..."
                />
                {principalesHabilidades.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarHabilidad(index)}
                    className="text-red-500 hover:text-red-700 p-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={agregarHabilidad}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-500 transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar otra habilidad
            </button>
          </div>

          {/* 3. Educación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3) Educación</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Institución, grado obtenido, título</p>
              </div>
            </div>

            {educaciones.map((edu, index) => (
              <div key={index} className="mb-6 p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Educación {index + 1}
                  </h3>
                  {educaciones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarEducacion(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institución
                    </label>
                    <input
                      type="text"
                      value={edu.institucion}
                      onChange={(e) => actualizarEducacion(index, 'institucion', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Universidad, instituto, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grado Obtenido
                    </label>
                    <select
                      value={edu.grado_obtenido}
                      onChange={(e) => actualizarEducacion(index, 'grado_obtenido', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Seleccionar grado</option>
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Ingeniería">Ingeniería</option>
                      <option value="Maestría">Maestría</option>
                      <option value="Doctorado">Doctorado</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Diplomado">Diplomado</option>
                      <option value="Certificación">Certificación</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={edu.titulo}
                      onChange={(e) => actualizarEducacion(index, 'titulo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Nombre del título o carrera"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Desde
                      </label>
                      <input
                        type="number"
                        value={edu.desde}
                        onChange={(e) => actualizarEducacion(index, 'desde', e.target.value)}
                        min="1950"
                        max="2030"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hasta
                      </label>
                      <input
                        type="number"
                        value={edu.hasta}
                        onChange={(e) => actualizarEducacion(index, 'hasta', e.target.value)}
                        min="1950"
                        max="2030"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                        placeholder="2024"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={agregarEducacion}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-500 transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar otra educación
            </button>
          </div>

          {/* 4. Idiomas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4) Idiomas</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Idioma y nivel</p>
              </div>
            </div>

            {idiomas.map((idioma, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={idioma.idioma}
                    onChange={(e) => actualizarIdioma(index, 'idioma', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Inglés, Francés, Portugués..."
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={idioma.nivel}
                    onChange={(e) => actualizarIdioma(index, 'nivel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Seleccionar nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                    <option value="C2">C2 - Dominio</option>
                    <option value="C1">C1 - Avanzado</option>
                    <option value="B2">B2 - Intermedio alto</option>
                    <option value="B1">B1 - Intermedio</option>
                    <option value="A2">A2 - Básico alto</option>
                    <option value="A1">A1 - Básico</option>
                  </select>
                </div>
                {idiomas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarIdioma(index)}
                    className="text-red-500 hover:text-red-700 p-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={agregarIdioma}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-rose-500 hover:text-rose-500 transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar otro idioma
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 px-6 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar CV Completado
                </>
              )}
            </button>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}
        </form>

        {/* Nota sobre guardado */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💾 Guardar en cualquier paso</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Puede guardar en cualquier paso y continuar después</li>
                <li>• Debe tener la opción de agregar más experiencias, idiomas, educación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}