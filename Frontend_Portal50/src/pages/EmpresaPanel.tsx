import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import { getApiUrl } from "../config/api";
import InfoNuevoProceso from "../components/InfoNuevoProceso";

const EmpresaPanel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [solicitudesEmpleo, setSolicitudesEmpleo] = useState<any[]>([]);
  const [tab, setTab] = useState("publicaciones");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      fetchOfertas();
      fetchSolicitudes();
      fetchEmpresaInfo();
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchOfertas = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(getApiUrl('/api/empresa/jobs'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOfertas(data);
      }
    } catch (error) {
      console.error('Error fetching ofertas:', error);
    }
  };

  const fetchSolicitudes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(getApiUrl('/api/empresa/solicitudes'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSolicitudesEmpleo(data);
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
    }
  };

  const fetchEmpresaInfo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(getApiUrl('/api/empresa/info'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmpresa(data);
      }
    } catch (error) {
      console.error('Error fetching empresa info:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(getApiUrl(`/api/jobs/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchOfertas();
      }
    } catch (error) {
      console.error('Error deleting oferta:', error);
    }
  };

  const handleToggleEstado = async (id: string, currentEstado: string) => {
    const newEstado = currentEstado === "activa" ? "pausada" : "activa";
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(getApiUrl(`/api/jobs/${id}/estado`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newEstado })
      });

      if (response.ok) {
        fetchOfertas();
      }
    } catch (error) {
      console.error('Error updating estado:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Panel de Empresa
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Gestiona tus ofertas de empleo, supervisa solicitudes y conecta con el mejor talento
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Ofertas Activas</p>
                  <p className="text-3xl font-bold text-white">
                    {ofertas.filter(o => o.estado === 'activa').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Solicitudes Pendientes</p>
                  <p className="text-3xl font-bold text-white">
                    {solicitudesEmpleo.filter(s => s.estado === 'pendiente').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Ofertas</p>
                  <p className="text-3xl font-bold text-white">{ofertas.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Contact Card */}
          {empresa && empresa.ejecutivo && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {empresa.ejecutivo.nombre ? empresa.ejecutivo.nombre.charAt(0).toUpperCase() : 'E'}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    Tu Ejecutivo Asignado
                  </h3>
                  <p className="text-blue-100 mb-3">
                    {empresa.ejecutivo.nombre} - {empresa.ejecutivo.email}
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center gap-2">
                      Enviar Email
                    </button>
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center gap-2">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setTab("publicaciones")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                tab === "publicaciones"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Mis Publicaciones
            </button>
            <button
              onClick={() => setTab("solicitudes")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                tab === "solicitudes"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Solicitudes de Empleo
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tab === "publicaciones" && (
          <div>
            <InfoNuevoProceso />
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Publicaciones</h2>
                  <p className="text-gray-600">Gestiona y monitorea tus ofertas de empleo publicadas</p>
                </div>
                <Link
                  to="/empresa/crear-solicitud"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Solicitud de Empleo
                </Link>
              </div>

              <div className="space-y-6">
                {ofertas.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No tienes empleos publicados aún</h3>
                    <p className="text-gray-500 mb-2">Las ofertas aparecerán aquí después de ser aprobadas por el ejecutivo.</p>
                    <p className="text-sm text-gray-400 mb-6">Comienza creando tu primera solicitud de empleo.</p>
                    <Link
                      to="/empresa/crear-solicitud"
                      className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Crear solicitud de empleo
                    </Link>
                  </div>
                ) : (
                  ofertas.map((o) => (
                    <div key={o._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{o.titulo}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              o.estado === "archivada" ? "bg-red-100 text-red-800 border border-red-200" :
                              o.estado === "activa" ? "bg-green-100 text-green-800 border border-green-200" :
                              "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}>
                              {o.estado}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Publicada el {new Date(o.fechaPublicacion).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                          
                          {expandedId === o._id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Descripción:</h4>
                                  <p className="text-gray-600 mb-3">{o.descripcion}</p>
                                </div>
                                <div className="space-y-2">
                                  <div><strong>Modalidad:</strong> {o.modalidad}</div>
                                  <div><strong>Jornada:</strong> {o.jornada}</div>
                                  <div><strong>Ubicación:</strong> {o.ubicacion || "N/A"}</div>
                                  <div><strong>Salario:</strong> {o.salario || "No especificado"}</div>
                                </div>
                              </div>
                              
                              {o.etiquetas && o.etiquetas.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="font-semibold text-gray-700 mb-2">Etiquetas:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {o.etiquetas.map((etiqueta: string, index: number) => (
                                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {etiqueta}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => handleDelete(o._id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                  Eliminar
                                </button>
                                <button
                                  onClick={() => handleToggleEstado(o._id, o.estado)}
                                  className={`${
                                    o.estado === "activa"
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  } text-white px-4 py-2 rounded-lg transition-colors font-medium`}
                                >
                                  {o.estado === "activa" ? "Pausar" : "Activar"}
                                </button>
                                <Link
                                  to={`/empresa/postulantes/${o._id}`}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Ver postulantes
                                </Link>
                                <Link
                                  to={`/editar-oferta/${o._id}`}
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                  Editar
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => toggleExpand(o._id)} 
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            {expandedId === o._id ? "Ocultar detalles" : "Ver detalles"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "solicitudes" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {searchParams.get('success') === 'created' && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-400 text-green-800 px-6 py-4 rounded-2xl mb-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">¡Solicitud creada exitosamente!</h4>
                    <p className="text-green-700">Tu solicitud ha sido enviada para revisión. Te notificaremos cuando sea procesada.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitudes de Empleo</h2>
                <p className="text-gray-600">Administra tus solicitudes de publicación de empleos</p>
              </div>
              <Link
                to="/empresa/crear-solicitud"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Solicitud
              </Link>
            </div>

            <div className="space-y-6">
              {solicitudesEmpleo.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    No tienes solicitudes de empleo
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
                    Crea una solicitud para que nuestro equipo revise y publique tu oferta de empleo en la plataforma.
                  </p>
                  <Link
                    to="/empresa/crear-solicitud"
                    className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Crear primera solicitud
                  </Link>
                </div>
              ) : (
                solicitudesEmpleo.map((solicitud) => (
                  <div key={solicitud._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{solicitud.titulo}</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            solicitud.estado === 'pendiente' 
                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                              : solicitud.estado === 'en_revision'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : solicitud.estado === 'aprobada'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : solicitud.estado === 'rechazada'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : solicitud.estado === 'con_correcciones'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                            {solicitud.estado === 'pendiente' && 'Pendiente'}
                            {solicitud.estado === 'en_revision' && 'En revisión'}
                            {solicitud.estado === 'aprobada' && 'Aprobada'}
                            {solicitud.estado === 'rechazada' && 'Rechazada'}
                            {solicitud.estado === 'con_correcciones' && 'Requiere correcciones'}
                            {solicitud.estado === 'publicada' && 'Publicada'}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-600">
                              Creada: {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-600">{solicitud.ubicacion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-gray-600">{solicitud.salario}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {solicitud.descripcion}
                        </p>

                        {solicitud.etiquetas && solicitud.etiquetas.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {solicitud.etiquetas.slice(0, 5).map((etiqueta: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {etiqueta}
                                </span>
                              ))}
                              {solicitud.etiquetas.length > 5 && (
                                <span className="text-gray-500 text-xs font-medium px-2 py-1">
                                  +{solicitud.etiquetas.length - 5} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {solicitud.comentariosEjecutivo && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Comentarios del ejecutivo:
                            </h4>
                            <p className="text-blue-700">{solicitud.comentariosEjecutivo}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="text-sm text-gray-500 mb-2">
                          {solicitud.ejecutivoId ? (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Asignado a ejecutivo</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Sin asignar</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setExpandedId(expandedId === solicitud._id ? null : solicitud._id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          {expandedId === solicitud._id ? "Ocultar detalles" : "Ver detalles"}
                        </button>
                        
                        {solicitud.estado === 'con_correcciones' && (
                          <Link
                            to={`/empresa/editar-solicitud/${solicitud._id}`}
                            className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-medium text-sm text-center"
                          >
                            Corregir
                          </Link>
                        )}
                        
                        {solicitud.estado === 'publicada' && solicitud.jobId && (
                          <Link
                            to={`/empresa/postulantes/${solicitud.jobId}`}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm text-center"
                          >
                            Ver postulantes
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default EmpresaPanel;
