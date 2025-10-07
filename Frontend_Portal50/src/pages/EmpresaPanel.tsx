// src/pages/EmpresaPanel.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import { getApiUrl } from "../config/api";
import InfoNuevoProceso from "../components/InfoNuevoProceso";

export default function EmpresaPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [solicitudesEmpleo, setSolicitudesEmpleo] = useState<any[]>([]);
  const [tab, setTab] = useState("publicaciones");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);

      const validarAcceso = async () => {
        const idToken = await auth.currentUser?.getIdToken();

        if (user.rol === "empresa") {
          return user.uid; // ✅ Es empresa dueña: devolver su UID
        }

        if (user.rol === "profesional") {
          const empresasRes = await fetch(`http://localhost:3001/api/empresas/activas`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (empresasRes.ok) {
            const empresas = await empresasRes.json();
            const foundEmpresa = empresas.find((e: any) =>
              (e.ejecutivos || []).some((ej: any) => ej._id === user._id)
            );
            if (foundEmpresa) return foundEmpresa.uid; // ✅ Es ejecutivo: devolver UID empresa
          }
        }

        navigate("/");
        return null;
      };

      validarAcceso().then((empresaUid) => {
        if (empresaUid) {
          const fetchData = async () => {
            try {
              const idToken = await auth.currentUser?.getIdToken();

              const resEmpresa = await fetch(`http://localhost:3001/api/empresas/uid/${empresaUid}`, {
                headers: { Authorization: `Bearer ${idToken}` },
              });
              if (!resEmpresa.ok) throw new Error("Error obteniendo empresa");
              const empresaData = await resEmpresa.json();
              setEmpresa(empresaData);

              const resOfertas = await fetch(`http://localhost:3001/api/jobs`, {
                headers: { Authorization: `Bearer ${idToken}` },
              });
              if (!resOfertas.ok) throw new Error("Error obteniendo ofertas");
              const allJobs = await resOfertas.json();
              const ownJobs = allJobs.filter((job: any) => job.empresaId === empresaData._id);
              setOfertas(ownJobs);

              // Cargar solicitudes de empleo
              const resSolicitudes = await fetch(getApiUrl(`/api/solicitudes-empleo/empresa/${empresaData._id}/lista`), {
                headers: { Authorization: `Bearer ${idToken}` },
              });
              if (resSolicitudes.ok) {
                const solicitudes = await resSolicitudes.json();
                setSolicitudesEmpleo(solicitudes);
              }
            } catch (err) {
              console.error("❌ Error cargando datos:", err);
            }
          };

          fetchData();
        }
      });
    } else {
      navigate("/");
    }

    // Manejar parámetros de URL para tab inicial y mensajes
    const tabParam = searchParams.get('tab');
    const successParam = searchParams.get('success');
    
    if (tabParam === 'solicitudes') {
      setTab('solicitudes');
    }
    
    // Mostrar mensaje de éxito si viene de crear solicitud
    if (successParam === 'created') {
      // Limpiar el parámetro de la URL después de un momento
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url.toString());
      }, 3000);
    }
  }, [navigate, searchParams]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3001/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Error eliminando oferta");
      setOfertas((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("❌ Error eliminando oferta:", err);
    }
  };

  const handleToggleEstado = async (id: string, currentEstado: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const nuevoEstado = currentEstado === "activa" ? "pausada" : "activa";

      const res = await fetch(`http://localhost:3001/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error actualizando estado");

      setOfertas((prev) =>
        prev.map((o) => (o._id === id ? { ...o, estado: nuevoEstado } : o))
      );
    } catch (err) {
      console.error("❌ Error actualizando estado:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-1">Dashboard Empresarial</h1>
      <p className="mb-4 text-gray-600">Gestiona tus publicaciones y tu equipo ejecutivo</p>

      <div className="border rounded p-4 mb-4 bg-white shadow">
        <h2 className="font-semibold mb-2 text-lg text-gray-800">
          👤 Ejecutivo Asignado
        </h2>

        {empresa?.ejecutivos?.length > 0 ? (
          empresa.ejecutivos.map((ej: any) => (
            <div key={ej._id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {ej.nombre} {ej.apellido || ''}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">📧 Email:</span>
                      <span className="text-gray-800">{ej.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">📞 Teléfono:</span>
                      <span className="text-gray-800">
                        {ej.telefono || "Sin teléfono registrado"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">🎯 Rol:</span>
                      <span className="text-gray-800 capitalize">{ej.rol}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">🟢 Estado:</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`mailto:${ej.email}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    title="Enviar correo electrónico"
                  >
                    📧 Email
                  </a>
                  
                  {ej.telefono && (
                    <a
                      href={`https://wa.me/${ej.telefono.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      title="Enviar mensaje por WhatsApp"
                    >
                      📱 WhatsApp
                    </a>
                  )}
                  
                  {ej.telefono && (
                    <a
                      href={`tel:${ej.telefono}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      title="Llamar por teléfono"
                    >
                      📞 Llamar
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-lg font-medium">No tienes ejecutivos asignados aún</p>
            <p className="text-sm">Un administrador debe asignarte un ejecutivo desde el panel de administración.</p>
          </div>
        )}
      </div>

      <div className="flex border-b mb-4">
        <button
          onClick={() => setTab("publicaciones")}
          className={`px-4 py-2 ${tab === "publicaciones" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Publicaciones
        </button>
        <button
          onClick={() => setTab("solicitudes")}
          className={`px-4 py-2 ${tab === "solicitudes" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Solicitudes de Empleo
          {solicitudesEmpleo.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {solicitudesEmpleo.length}
            </span>
          )}
        </button>
      </div>

      {tab === "publicaciones" && (
        <section>
          {/* Información sobre el nuevo proceso */}
          <InfoNuevoProceso />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mis Publicaciones</h2>
            <Link
              to="/empresa/crear-solicitud"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              📝 Nueva Solicitud de Empleo
            </Link>
          </div>

          <div className="space-y-4">
            {ofertas.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-600 mb-2">No tienes empleos publicados aún.</p>
                <p className="text-sm text-gray-500 mb-4">Las ofertas aparecerán aquí después de ser aprobadas por el ejecutivo.</p>
                <Link
                  to="/empresa/crear-solicitud"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Crear solicitud de empleo
                </Link>
              </div>
            ) : (
              ofertas.map((o) => (
                <div key={o._id} className="border rounded p-4 bg-white shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{o.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        Publicada el {new Date(o.fechaPublicacion).toLocaleDateString()} • Estado: {o.estado || "N/A"}
                      </p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      o.estado === "archivada" ? "bg-red-200 text-red-800" :
                      o.estado === "activa" ? "bg-green-200 text-green-800" :
                      "bg-yellow-200 text-yellow-800"}`}>
                      {o.estado}
                    </span>
                  </div>
                  <div className="mt-2 text-right">
                    <button onClick={() => toggleExpand(o._id)} className="text-blue-600 underline">
                      {expandedId === o._id ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                  </div>

                  {expandedId === o._id && (
                    <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                      <p><strong>Descripción:</strong> {o.descripcion}</p>
                      <p><strong>Modalidad:</strong> {o.modalidad}</p>
                      <p><strong>Jornada:</strong> {o.jornada}</p>
                      <p><strong>Ubicación:</strong> {o.ubicacion || "N/A"}</p>
                      <p><strong>Salario:</strong> {o.salario || "No especificado"}</p>
                      <p><strong>Etiquetas:</strong> {(o.etiquetas || []).join(", ")}</p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(o._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleToggleEstado(o._id, o.estado)}
                          className={`${
                            o.estado === "activa"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white px-4 py-2 rounded`}
                        >
                          {o.estado === "activa" ? "Pausar" : "Activar"}
                        </button>
                        <Link
                          to={`/empresa/postulantes/${o._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Ver postulantes
                        </Link>
                        <Link
                          to={`/editar-oferta/${o._id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {tab === "solicitudes" && (
        <section>
          {/* Mensaje de éxito */}
          {searchParams.get('success') === 'created' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <div>
                <strong>¡Solicitud creada exitosamente!</strong>
                <p className="text-sm">Tu solicitud ha sido enviada para revisión. Te notificaremos cuando sea procesada.</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Solicitudes de Empleo</h2>
            <Link
              to="/empresa/crear-solicitud"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              + Nueva Solicitud
            </Link>
          </div>

          <div className="space-y-4">
            {solicitudesEmpleo.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes solicitudes de empleo
                </h3>
                <p className="text-gray-500 mb-4">
                  Crea una solicitud para que nuestro equipo revise y publique tu oferta de empleo.
                </p>
                <Link
                  to="/empresa/crear-solicitud"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear primera solicitud
                </Link>
              </div>
            ) : (
              solicitudesEmpleo.map((solicitud) => (
                <div key={solicitud._id} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{solicitud.titulo}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Creada el {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                        {solicitud.fechaActualizacion && (
                          <> • Actualizada el {new Date(solicitud.fechaActualizacion).toLocaleDateString()}</>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📍 {solicitud.ubicacion}</span>
                        <span>💼 {solicitud.modalidad}</span>
                        <span>💰 {solicitud.salario}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        solicitud.estado === 'pendiente' 
                          ? 'bg-orange-100 text-orange-800'
                          : solicitud.estado === 'en_revision'
                          ? 'bg-blue-100 text-blue-800'
                          : solicitud.estado === 'aprobada'
                          ? 'bg-green-100 text-green-800'
                          : solicitud.estado === 'rechazada'
                          ? 'bg-red-100 text-red-800'
                          : solicitud.estado === 'con_correcciones'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {solicitud.estado === 'pendiente' && '⏳ Pendiente'}
                        {solicitud.estado === 'en_revision' && '🔍 En revisión'}
                        {solicitud.estado === 'aprobada' && '✅ Aprobada'}
                        {solicitud.estado === 'rechazada' && '❌ Rechazada'}
                        {solicitud.estado === 'con_correcciones' && '✏️ Requiere correcciones'}
                        {solicitud.estado === 'publicada' && '🚀 Publicada'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {solicitud.descripcion}
                    </p>
                  </div>

                  {solicitud.etiquetas && solicitud.etiquetas.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {solicitud.etiquetas.map((etiqueta: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comentarios del ejecutivo */}
                  {solicitud.comentariosEjecutivo && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-medium text-blue-800 mb-1">Comentarios del ejecutivo:</h4>
                      <p className="text-blue-700 text-sm">{solicitud.comentariosEjecutivo}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {solicitud.ejecutivoId ? (
                        <span>Asignado a ejecutivo</span>
                      ) : (
                        <span>Sin asignar</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedId(expandedId === solicitud._id ? null : solicitud._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        {expandedId === solicitud._id ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                      
                      {solicitud.estado === 'con_correcciones' && (
                        <Link
                          to={`/empresa/editar-solicitud/${solicitud._id}`}
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                        >
                          Corregir
                        </Link>
                      )}
                      
                      {solicitud.estado === 'publicada' && solicitud.jobId && (
                        <Link
                          to={`/empresa/postulantes/${solicitud.jobId}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Ver postulantes
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {expandedId === solicitud._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Detalles del puesto:</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Jornada:</strong> {solicitud.jornada}</p>
                            <p><strong>Modalidad:</strong> {solicitud.modalidad}</p>
                            <p><strong>Ubicación:</strong> {solicitud.ubicacion}</p>
                            <p><strong>Salario:</strong> {solicitud.salario}</p>
                          </div>
                        </div>
                        
                        {solicitud.preguntas && solicitud.preguntas.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Preguntas para candidatos ({solicitud.preguntas.length}):
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              {solicitud.preguntas.slice(0, 3).map((pregunta: any, index: number) => (
                                <p key={index} className="truncate">
                                  • {pregunta.pregunta}
                                  {pregunta.obligatoria && <span className="text-red-500 ml-1">*</span>}
                                </p>
                              ))}
                              {solicitud.preguntas.length > 3 && (
                                <p className="text-gray-500 italic">
                                  ... y {solicitud.preguntas.length - 3} más
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Historial */}
                      {solicitud.historial && solicitud.historial.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Historial:</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {solicitud.historial.map((evento: any, index: number) => (
                              <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                <span className="font-medium">
                                  {new Date(evento.fecha).toLocaleDateString()} - {evento.estado}
                                </span>
                                {evento.comentario && (
                                  <p className="mt-1 italic">"{evento.comentario}"</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}
