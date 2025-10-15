// src/pages/SolicitudEmpleoDetalle.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getApiUrl } from "../config/api";

export default function SolicitudEmpleoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [comentarios, setComentarios] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }

    const user = JSON.parse(stored);
    
    // Verificar que el usuario sea ejecutivo
    if (user.rol !== "ejecutivo") {
      navigate("/");
      return;
    }

    const fetchSolicitud = async () => {
      try {
        setLoading(true);
        const idToken = await auth.currentUser?.getIdToken();

        const res = await fetch(getApiUrl(`/api/solicitudes-empleo/${id}`), {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) {
          throw new Error("Error al obtener la solicitud");
        }

        const data = await res.json();
        setSolicitud(data);
      } catch (err: any) {
        console.error("❌ Error cargando solicitud:", err);
        setError(err.message || "Error cargando solicitud");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id, navigate]);

  const handleAccion = async (accion: string) => {
    if (!solicitud || !accion) return;

    try {
      setProcesando(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const idToken = await auth.currentUser?.getIdToken();

      const res = await fetch(getApiUrl(`/api/solicitudes-empleo/${solicitud._id}/revisar`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          accion,
          comentarios: comentarios.trim() || undefined,
          ejecutivoId: user._id
        }),
      });

      if (!res.ok) {
        throw new Error("Error al procesar la solicitud");
      }

      // Si la acción es aprobar, crear el job
      if (accion === 'aprobar') {
        const resJob = await fetch(getApiUrl(`/api/solicitudes-empleo/${solicitud._id}/crear-job`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            ejecutivoId: user._id
          }),
        });

        if (!resJob.ok) {
          console.warn("Warning: Solicitud aprobada pero error al crear job");
        }
      }

      // Recargar datos de la solicitud
      const resSolicitud = await fetch(getApiUrl(`/api/solicitudes-empleo/${id}`), {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (resSolicitud.ok) {
        const dataSolicitud = await resSolicitud.json();
        setSolicitud(dataSolicitud);
      }

      setComentarios("");
      
    } catch (err: any) {
      console.error("❌ Error procesando solicitud:", err);
      alert(err.message || "Error procesando solicitud");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando solicitud...</p>
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
            onClick={() => navigate("/ejecutivo")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Solicitud no encontrada</h1>
          <button
            onClick={() => navigate("/ejecutivo")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'en_revision': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'aprobada': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rechazada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'con_correcciones': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'publicada': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '⏳ Pendiente';
      case 'en_revision': return '🔍 En revisión';
      case 'aprobada': return '✅ Aprobada';
      case 'rechazada': return '❌ Rechazada';
      case 'con_correcciones': return '[CORRECCIONES] Con correcciones';
      case 'publicada': return '[PUBLICADA] Publicada';
      default: return estado;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/ejecutivo")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Volver al panel
            </button>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(solicitud.estado)}`}>
              {getEstadoTexto(solicitud.estado)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {solicitud.titulo}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Solicitud de {solicitud.empresa?.nombre || 'Empresa'} • {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción del puesto */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                [DESCRIPCIÓN] Descripción del puesto
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {solicitud.descripcion}
              </p>
            </div>

            {/* Detalles del empleo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                [DETALLES] Detalles del empleo
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Modalidad:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.modalidad}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Ubicación:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.ubicacion}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Jornada:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.jornada}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Salario:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.salario}</p>
                  </div>
                </div>
              </div>

              {solicitud.etiquetas && solicitud.etiquetas.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Etiquetas:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {solicitud.etiquetas.map((etiqueta: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {etiqueta}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preguntas para candidatos */}
            {solicitud.preguntas && solicitud.preguntas.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  ❓ Preguntas para candidatos
                </h2>
                <div className="space-y-3">
                  {solicitud.preguntas.map((pregunta: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-gray-800 dark:text-gray-200">{pregunta.pregunta}</p>
                      {pregunta.obligatoria && (
                        <span className="text-xs text-red-600 dark:text-red-400">* Obligatoria</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de acciones */}
            {solicitud.historial && solicitud.historial.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  📚 Historial de acciones
                </h2>
                <div className="space-y-3">
                  {solicitud.historial.map((evento: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-2xl">
                        {evento.accion === 'creada' && '[CREADA]'}
                        {evento.accion === 'en_revision' && '🔍'}
                        {evento.accion === 'aprobada' && '✅'}
                        {evento.accion === 'rechazada' && '❌'}
                        {evento.accion === 'solicitar_correcciones' && '[CORREGIR]'}
                        {evento.accion === 'correcciones_enviadas' && '📤'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {evento.accion === 'creada' && 'Solicitud creada'}
                          {evento.accion === 'en_revision' && 'Tomada para revisión'}
                          {evento.accion === 'aprobada' && 'Solicitud aprobada'}
                          {evento.accion === 'rechazada' && 'Solicitud rechazada'}
                          {evento.accion === 'solicitar_correcciones' && 'Correcciones solicitadas'}
                          {evento.accion === 'correcciones_enviadas' && 'Correcciones enviadas'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(evento.fecha).toLocaleString()}
                        </p>
                        {evento.comentarios && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic">
                            "{evento.comentarios}"
                          </p>
                        )}
                        {evento.ejecutivo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Por: {evento.ejecutivo.nombre} {evento.ejecutivo.apellido}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel de acciones */}
          <div className="space-y-6">
            {/* Información de la empresa */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                🏢 Empresa solicitante
              </h2>
              {solicitud.empresa && (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Nombre:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.empresa.nombre}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    <p className="text-gray-800 dark:text-gray-200">{solicitud.empresa.email}</p>
                  </div>
                  
                  {solicitud.empresa.telefono && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Teléfono:</span>
                      <p className="text-gray-800 dark:text-gray-200">{solicitud.empresa.telefono}</p>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <a
                      href={`mailto:${solicitud.empresa.email}`}
                      className="w-full bg-blue-600 text-white text-center py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm block"
                    >
                      📧 Contactar empresa
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones disponibles */}
            {['pendiente', 'en_revision', 'con_correcciones'].includes(solicitud.estado) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  ⚡ Acciones
                </h2>
                
                <div className="space-y-4">
                  {solicitud.estado === 'pendiente' && (
                    <button
                      onClick={() => handleAccion('tomar_revision')}
                      disabled={procesando}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {procesando ? '[PROCESANDO] Procesando...' : '[REVISAR] Tomar para revisión'}
                    </button>
                  )}

                  {(solicitud.estado === 'en_revision' || solicitud.estado === 'con_correcciones') && (
                    <>
                      {/* Área de comentarios */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Comentarios (opcional):
                        </label>
                        <textarea
                          value={comentarios}
                          onChange={(e) => setComentarios(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                          rows={4}
                          placeholder="Agrega comentarios sobre tu decisión..."
                        />
                      </div>

                      {/* Botones de acción */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAccion('aprobar')}
                          disabled={procesando}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {procesando ? '⏳ Procesando...' : '✅ Aprobar y crear empleo'}
                        </button>
                        
                        <button
                          onClick={() => handleAccion('solicitar_correcciones')}
                          disabled={procesando}
                          className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                        >
                          {procesando ? '[PROCESANDO] Procesando...' : '[CORREGIR] Solicitar correcciones'}
                        </button>
                        
                        <button
                          onClick={() => handleAccion('rechazar')}
                          disabled={procesando}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {procesando ? '⏳ Procesando...' : '❌ Rechazar solicitud'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Estado final */}
            {(['aprobada', 'rechazada', 'publicada'].includes(solicitud.estado)) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  ✨ Estado final
                </h2>
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">
                    {solicitud.estado === 'aprobada' && '✅'}
                    {solicitud.estado === 'rechazada' && '❌'}
                    {solicitud.estado === 'publicada' && '[PUBLICADA]'}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {solicitud.estado === 'aprobada' && 'Solicitud aprobada y empleo creado'}
                    {solicitud.estado === 'rechazada' && 'Solicitud rechazada'}
                    {solicitud.estado === 'publicada' && 'Empleo publicado exitosamente'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}