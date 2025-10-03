import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";

const AdminFraccional: React.FC = () => {
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoApellido, setNuevoApellido] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [creando, setCreando] = useState(false);
  const [creaError, setCreaError] = useState("");
  const [creaSuccess, setCreaSuccess] = useState("");
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState("");
  const [ejecutivos, setEjecutivos] = useState<any[]>([]);
  const [ejecutivosLoading, setEjecutivosLoading] = useState(false);
  const [ejecutivosError, setEjecutivosError] = useState("");
  const [showEjecutivos, setShowEjecutivos] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<any>(null);
  const [ejecutivoSeleccionado, setEjecutivoSeleccionado] = useState("");
  const [asignandoEjecutivo, setAsignandoEjecutivo] = useState(false);
  const [asignarError, setAsignarError] = useState("");
  const [desasignandoEjecutivo, setDesasignandoEjecutivo] = useState(false);

  // Cargar empresas al montar el componente
  useEffect(() => {
    setEmpLoading(true);
    fetch(getApiUrl("/api/empresas/activas"))
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(() => setEmpError("Error al cargar empresas"))
      .finally(() => setEmpLoading(false));
  }, [creaSuccess]);

  // Función para cargar ejecutivos
  const cargarEjecutivos = async () => {
    setEjecutivosLoading(true);
    setEjecutivosError("");
    try {
      const res = await fetch(getApiUrl("/api/users/ejecutivos"));
      if (!res.ok) throw new Error("Error al cargar ejecutivos");
      const data = await res.json();
      setEjecutivos(data);
    } catch (error) {
      setEjecutivosError("Error al cargar la lista de ejecutivos");
      console.error(error);
    } finally {
      setEjecutivosLoading(false);
    }
  };

  // Función para asignar ejecutivo a empresa
  const asignarEjecutivoAEmpresa = async () => {
    if (!ejecutivoSeleccionado || !empresaSeleccionada) {
      setAsignarError("Debe seleccionar un ejecutivo");
      return;
    }

    setAsignandoEjecutivo(true);
    setAsignarError("");
    
    try {
      const res = await fetch(getApiUrl(`/api/empresas/${empresaSeleccionada._id}/asignar-ejecutivo`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ejecutivoId: ejecutivoSeleccionado })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al asignar ejecutivo");
      }

      // Recargar lista de empresas
      const empresasRes = await fetch(getApiUrl("/api/empresas/activas"));
      const empresasData = await empresasRes.json();
      setEmpresas(empresasData);

      // Cerrar modal
      setShowAsignarModal(false);
      setEmpresaSeleccionada(null);
      setEjecutivoSeleccionado("");
      
      alert("Ejecutivo asignado exitosamente");
    } catch (error: any) {
      setAsignarError(error.message || "Error al asignar ejecutivo");
    } finally {
      setAsignandoEjecutivo(false);
    }
  };

  // Función para desasignar ejecutivo de empresa
  const desasignarEjecutivoDeEmpresa = async (empresaId: string, ejecutivoId: string, ejecutivoNombre: string) => {
    if (!confirm(`¿Está seguro de desasignar a ${ejecutivoNombre} de esta empresa?`)) {
      return;
    }

    setDesasignandoEjecutivo(true);
    
    try {
      const res = await fetch(getApiUrl(`/api/empresas/${empresaId}/desasignar-ejecutivo`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ejecutivoId })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al desasignar ejecutivo");
      }

      // Recargar lista de empresas
      const empresasRes = await fetch(getApiUrl("/api/empresas/activas"));
      const empresasData = await empresasRes.json();
      setEmpresas(empresasData);
      
      alert("Ejecutivo desasignado exitosamente");
    } catch (error: any) {
      alert(error.message || "Error al desasignar ejecutivo");
    } finally {
      setDesasignandoEjecutivo(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Panel Administrador Fraccional</h1>
      <p className="mb-6 text-gray-700">Aquí podrás gestionar ejecutivos, ver todas las empresas, sus ofertas y postulantes.</p>
      
      <div className="flex gap-4 mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          onClick={() => setShowModal(true)}
        >
          Crear Ejecutivo Nuevo
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          onClick={() => {
            setShowEjecutivos(!showEjecutivos);
            if (!showEjecutivos) {
              cargarEjecutivos();
            }
          }}
        >
          {showEjecutivos ? 'Ocultar Ejecutivos' : 'Ver Ejecutivos'}
        </button>
      </div>

      {/* Modal para crear ejecutivo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold" 
              onClick={() => { 
                setShowModal(false); 
                setCreaError(""); 
                setCreaSuccess(""); 
                setNuevoNombre("");
                setNuevoApellido("");
                setNuevoEmail("");
                setNuevaPassword("");
                setNuevoTelefono("");
              }}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Ejecutivo Fraccional</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreaError("");
                setCreaSuccess("");
                setCreando(true);
                try {
                  const res = await fetch(getApiUrl("/api/users/adminfraccional"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      nombre: nuevoNombre, 
                      apellido: nuevoApellido,
                      email: nuevoEmail, 
                      password: nuevaPassword,
                      telefono: nuevoTelefono, 
                      rol: "ejecutivo" 
                    })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Error al crear ejecutivo");
                  setCreaSuccess("Ejecutivo creado exitosamente.");
                  setNuevoNombre(""); 
                  setNuevoApellido("");
                  setNuevoEmail(""); 
                  setNuevaPassword("");
                  setNuevoTelefono("");
                  
                  // Cerrar modal después de 2 segundos
                  setTimeout(() => {
                    setShowModal(false);
                    setCreaSuccess("");
                  }, 2000);
                } catch (err: any) {
                  setCreaError(err.message || "Error al crear ejecutivo");
                } finally {
                  setCreando(false);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    placeholder="Ej: Juan"
                    value={nuevoNombre}
                    onChange={e => setNuevoNombre(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    placeholder="Ej: Pérez"
                    value={nuevoApellido}
                    onChange={e => setNuevoApellido(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  placeholder="ejemplo@empresa.com"
                  type="email"
                  value={nuevoEmail}
                  onChange={e => setNuevoEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  value={nuevaPassword}
                  onChange={e => setNuevaPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  placeholder="Ej: +56 9 1234 5678"
                  value={nuevoTelefono}
                  onChange={e => setNuevoTelefono(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCreaError("");
                    setCreaSuccess("");
                    setNuevoNombre("");
                    setNuevoApellido("");
                    setNuevoEmail("");
                    setNuevaPassword("");
                    setNuevoTelefono("");
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={creando}
                >
                  {creando ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </span>
                  ) : (
                    "Crear Ejecutivo"
                  )}
                </button>
              </div>
              
              {creaError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <strong>Error:</strong> {creaError}
                </div>
              )}
              {creaSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <strong>Éxito:</strong> {creaSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Sección de Ejecutivos */}
      {showEjecutivos && (
        <section className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Ejecutivos</h2>
            
            {ejecutivosLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando ejecutivos...</span>
              </div>
            )}
            
            {ejecutivosError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <strong>Error:</strong> {ejecutivosError}
              </div>
            )}
            
            {!ejecutivosLoading && ejecutivos.length === 0 && !ejecutivosError && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No hay ejecutivos registrados</p>
                <p className="text-sm">Crea el primer ejecutivo usando el botón "Crear Ejecutivo Nuevo"</p>
              </div>
            )}
            
            {!ejecutivosLoading && ejecutivos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ejecutivos.map((ejecutivo) => (
                  <div
                    key={ejecutivo._id}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {ejecutivo.nombre?.charAt(0)?.toUpperCase() || 'E'}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{ejecutivo.nombre}</h3>
                        <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {ejecutivo.rol === 'ejecutivo' ? 'Ejecutivo' : 'Admin'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="break-all">{ejecutivo.email}</span>
                      </div>
                      
                      {ejecutivo.telefono && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{ejecutivo.telefono}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {ejecutivo.activo ? (
                            <span className="text-green-600 font-medium">Activo</span>
                          ) : (
                            <span className="text-red-600 font-medium">Inactivo</span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
                          onClick={() => {
                            // Aquí se puede agregar funcionalidad para editar
                            alert(`Editar ejecutivo: ${ejecutivo.nombre}`);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className={`flex-1 text-xs py-2 px-3 rounded transition-colors ${
                            ejecutivo.activo 
                              ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                          onClick={() => {
                            // Aquí se puede agregar funcionalidad para activar/desactivar
                            alert(`${ejecutivo.activo ? 'Desactivar' : 'Activar'} ejecutivo: ${ejecutivo.nombre}`);
                          }}
                        >
                          {ejecutivo.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Listado de empresas */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Empresas registradas</h2>
        {empLoading && <p>Cargando empresas...</p>}
        {empError && <p className="text-red-500">{empError}</p>}
        {empresas.length === 0 && !empLoading ? (
          <p className="text-gray-500">No hay empresas activas.</p>
        ) : (
          empresas.map((empresa) => (
            <div
              key={empresa._id}
              className="bg-white rounded shadow p-4 mb-6 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => navigate(`/admin-fraccional/empresa/${empresa._id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-lg">{empresa.nombre}</h3>
                  <p className="text-sm text-gray-600">Email: {empresa.email}</p>
                  <p className="text-sm text-gray-600">Teléfono: {empresa.telefono}</p>
                </div>
                {/* Botón para asignar ejecutivo */}
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  onClick={e => { 
                    e.stopPropagation(); 
                    setEmpresaSeleccionada(empresa);
                    setShowAsignarModal(true);
                    if (ejecutivos.length === 0) {
                      cargarEjecutivos();
                    }
                  }}
                >
                  Asignar ejecutivo
                </button>
              </div>
              <div>
                <strong>Ejecutivos:</strong>
                {empresa.ejecutivos && empresa.ejecutivos.length > 0 ? (
                  <div className="ml-2 space-y-2">
                    {empresa.ejecutivos.map((ej: any) => (
                      <div key={ej._id || ej.uid} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">
                          {ej.nombre} {ej.apellido || ''} ({ej.email})
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            desasignarEjecutivoDeEmpresa(
                              empresa._id, 
                              ej._id, 
                              `${ej.nombre} ${ej.apellido || ''}`
                            );
                          }}
                          disabled={desasignandoEjecutivo}
                          className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xs rounded transition-colors"
                          title="Desasignar ejecutivo"
                        >
                          {desasignandoEjecutivo ? "..." : "✕"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 ml-2">Sin ejecutivos asignados</span>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Modal para asignar ejecutivo */}
      {showAsignarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              Asignar ejecutivo a {empresaSeleccionada?.nombre}
            </h3>
            
            {asignarError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {asignarError}
              </div>
            )}

            {ejecutivosLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2">Cargando ejecutivos...</p>
              </div>
            ) : ejecutivosError ? (
              <div className="text-red-600 mb-4">{ejecutivosError}</div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar ejecutivo:
                </label>
                <select
                  value={ejecutivoSeleccionado}
                  onChange={(e) => setEjecutivoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecciona un ejecutivo --</option>
                  {ejecutivos
                    .filter(ej => {
                      // Mostrar ejecutivos que no estén asignados a ESTA empresa específica
                      const yaAsignado = empresaSeleccionada?.ejecutivos?.some((empEj: any) => 
                        empEj._id === ej._id || empEj.uid === ej.uid
                      );
                      return !yaAsignado;
                    })
                    .map(ejecutivo => (
                      <option key={ejecutivo._id} value={ejecutivo._id}>
                        {ejecutivo.nombre} {ejecutivo.apellido} - {ejecutivo.email}
                      </option>
                    ))}
                </select>
                {ejecutivos.filter(ej => {
                  const yaAsignado = empresaSeleccionada?.ejecutivos?.some((empEj: any) => 
                    empEj._id === ej._id || empEj.uid === ej.uid
                  );
                  return !yaAsignado;
                }).length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Todos los ejecutivos ya están asignados a esta empresa
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAsignarModal(false);
                  setEmpresaSeleccionada(null);
                  setEjecutivoSeleccionado("");
                  setAsignarError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                disabled={asignandoEjecutivo}
              >
                Cancelar
              </button>
              <button
                onClick={asignarEjecutivoAEmpresa}
                disabled={asignandoEjecutivo || !ejecutivoSeleccionado || ejecutivosLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {asignandoEjecutivo ? "Asignando..." : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminFraccional;
