// src/pages/CrearSolicitudEmpleo.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getApiUrl } from "../config/api";

export default function CrearSolicitudEmpleo() {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    modalidad: "presencial" as "presencial" | "remota" | "híbrida",
    jornada: "",
    ubicacion: "",
    salario: "",
    etiquetas: [] as string[],
    preguntas: [] as Array<{ pregunta: string; obligatoria: boolean }>
  });
  
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [nuevaPregunta, setNuevaPregunta] = useState({ pregunta: "", obligatoria: false });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }

    const user = JSON.parse(stored);
    
    // Verificar que el usuario sea empresa
    if (user.rol !== "empresa") {
      navigate("/");
      return;
    }

    const fetchEmpresaData = async () => {
      try {
        setLoading(true);
        const idToken = await auth.currentUser?.getIdToken();

        // Obtener datos de la empresa
        const res = await fetch(getApiUrl(`/api/empresas/${user._id}`), {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) {
          throw new Error("Error al obtener datos de la empresa");
        }

        const data = await res.json();
        setEmpresa(data);
      } catch (err: any) {
        console.error("❌ Error cargando datos de empresa:", err);
        setError(err.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaData();
  }, [navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const agregarEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !formData.etiquetas.includes(nuevaEtiqueta.trim())) {
      setFormData(prev => ({
        ...prev,
        etiquetas: [...prev.etiquetas, nuevaEtiqueta.trim()]
      }));
      setNuevaEtiqueta("");
    }
  };

  const eliminarEtiqueta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((_, i) => i !== index)
    }));
  };

  const agregarPregunta = () => {
    if (nuevaPregunta.pregunta.trim()) {
      setFormData(prev => ({
        ...prev,
        preguntas: [...prev.preguntas, { ...nuevaPregunta }]
      }));
      setNuevaPregunta({ pregunta: "", obligatoria: false });
    }
  };

  const eliminarPregunta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresa) return;

    try {
      setEnviando(true);
      const idToken = await auth.currentUser?.getIdToken();

      const res = await fetch(getApiUrl(`/api/solicitudes-empleo/empresa/${empresa._id}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al enviar la solicitud");
      }

      // Redirigir a panel de empresa con mensaje de éxito
      navigate("/empresa?tab=solicitudes&success=created");
    } catch (err: any) {
      console.error("❌ Error enviando solicitud:", err);
      setError(err.message || "Error enviando solicitud");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/empresa")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/empresa")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Volver al panel
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Solicitar Publicación de Empleo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Completa la información del puesto de trabajo que deseas publicar. Nuestro equipo la revisará antes de publicarla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              📝 Información básica del puesto
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del puesto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: Desarrollador Frontend Senior"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modalidad de trabajo *
                </label>
                <select
                  required
                  value={formData.modalidad}
                  onChange={(e) => handleInputChange('modalidad', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="presencial">Presencial</option>
                  <option value="remota">Remota</option>
                  <option value="híbrida">Híbrida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jornada laboral *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jornada}
                  onChange={(e) => handleInputChange('jornada', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: Tiempo completo, Part-time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: Santiago, Chile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rango salarial *
                </label>
                <input
                  type="text"
                  required
                  value={formData.salario}
                  onChange={(e) => handleInputChange('salario', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: $800.000 - $1.200.000"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción del puesto *
              </label>
              <textarea
                required
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
              />
            </div>
          </div>

          {/* Etiquetas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              🏷️ Etiquetas y habilidades
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agregar etiquetas (tecnologías, habilidades, etc.)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevaEtiqueta}
                  onChange={(e) => setNuevaEtiqueta(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarEtiqueta())}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: React, Python, Excel"
                />
                <button
                  type="button"
                  onClick={agregarEtiqueta}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>

            {formData.etiquetas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.etiquetas.map((etiqueta, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {etiqueta}
                    <button
                      type="button"
                      onClick={() => eliminarEtiqueta(index)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preguntas para candidatos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              ❓ Preguntas para candidatos (opcional)
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agregar pregunta personalizada
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={nuevaPregunta.pregunta}
                  onChange={(e) => setNuevaPregunta(prev => ({ ...prev, pregunta: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Ej: ¿Tienes experiencia en metodologías ágiles?"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nuevaPregunta.obligatoria}
                      onChange={(e) => setNuevaPregunta(prev => ({ ...prev, obligatoria: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pregunta obligatoria</span>
                  </label>
                  <button
                    type="button"
                    onClick={agregarPregunta}
                    disabled={!nuevaPregunta.pregunta.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar pregunta
                  </button>
                </div>
              </div>
            </div>

            {formData.preguntas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Preguntas agregadas:</h3>
                {formData.preguntas.map((pregunta, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-gray-200">{pregunta.pregunta}</p>
                      {pregunta.obligatoria && (
                        <span className="text-xs text-red-600 dark:text-red-400 mt-1 inline-block">* Obligatoria</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarPregunta(index)}
                      className="text-red-600 hover:text-red-800 ml-3"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/empresa")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? '⏳ Enviando solicitud...' : '📤 Enviar solicitud'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}