// src/pages/EjecutivoPanel.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getApiUrl } from "../config/api";

export default function EjecutivoPanel() {
  const navigate = useNavigate();
  const [ejecutivo, setEjecutivo] = useState<any>(null);
  const [empresasAsignadas, setEmpresasAsignadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    const fetchEjecutivoData = async () => {
      try {
        setLoading(true);
        const idToken = await auth.currentUser?.getIdToken();

        // Obtener datos del ejecutivo y sus empresas asignadas
        const res = await fetch(getApiUrl(`/api/users/ejecutivo/${user._id}/empresas`), {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) {
          throw new Error("Error al obtener datos del ejecutivo");
        }

        const data = await res.json();
        setEjecutivo(data.ejecutivo);
        setEmpresasAsignadas(data.empresas);
      } catch (err: any) {
        console.error("❌ Error cargando datos del ejecutivo:", err);
        setError(err.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchEjecutivoData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando panel de ejecutivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel de Ejecutivo
          </h1>
          <p className="text-gray-600">
            Gestiona las empresas asignadas a tu cargo
          </p>
        </div>

        {/* Información del ejecutivo */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Información personal */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              👤 Mi información
            </h2>
            
            {ejecutivo && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Nombre:</span>
                  <span className="text-gray-800">
                    {ejecutivo.nombre} {ejecutivo.apellido || ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">{ejecutivo.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Teléfono:</span>
                  <span className="text-gray-800">
                    {ejecutivo.telefono || "Sin teléfono registrado"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Rol:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    Ejecutivo
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📊 Estadísticas
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {empresasAsignadas.length}
                </div>
                <div className="text-sm text-gray-600">
                  Empresa{empresasAsignadas.length !== 1 ? 's' : ''} asignada{empresasAsignadas.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {empresasAsignadas.filter(e => e.activo).length}
                </div>
                <div className="text-sm text-gray-600">
                  Empresa{empresasAsignadas.filter(e => e.activo).length !== 1 ? 's' : ''} activa{empresasAsignadas.filter(e => e.activo).length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empresas asignadas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏢 Empresas asignadas
          </h2>

          {empresasAsignadas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes empresas asignadas
              </h3>
              <p className="text-gray-500">
                Un administrador debe asignarte una o más empresas para que puedas gestionarlas.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {empresasAsignadas.map((empresa) => (
                <div
                  key={empresa._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {empresa.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {empresa.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600">📞 Teléfono:</span>
                      <span className="text-gray-800">
                        {empresa.telefono || "No especificado"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600">📍 Dirección:</span>
                      <span className="text-gray-800">
                        {empresa.direccion || "No especificada"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600">💼 Experiencia:</span>
                      <span className="text-gray-800">
                        {empresa.experiencia || "No especificada"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <a
                      href={`mailto:${empresa.email}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
                      title="Enviar correo electrónico"
                    >
                      📧 Email
                    </a>
                    
                    {empresa.telefono && (
                      <a
                        href={`tel:${empresa.telefono}`}
                        className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
                        title="Llamar por teléfono"
                      >
                        📞 Llamar
                      </a>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Estado:
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Activa
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}