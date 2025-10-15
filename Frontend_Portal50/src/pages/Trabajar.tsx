import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Trabajar() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<Map<string, { nombre: string, fotoPerfil?: string }>>(new Map());
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/jobs`);
        if (!res.ok) throw new Error("Error cargando ofertas");
        const allJobs = await res.json();
        const activas = allJobs.filter((job: any) => job.estado === "activa");

        const uniqueEmpresaIds: string[] = Array.from(new Set(activas.map((job: any) => job.empresaId)));

        const empresasMap = new Map<string, { nombre: string, fotoPerfil?: string }>();
        await Promise.all(
          uniqueEmpresaIds.map(async (id) => {
            const resEmpresa = await fetch(`http://localhost:3001/api/empresas/${id}`);
            if (resEmpresa.ok) {
              const empresa = await resEmpresa.json();
              empresasMap.set(id, {
                nombre: empresa.nombre,
                fotoPerfil: empresa.fotoPerfil
                  ? empresa.fotoPerfil.startsWith("http")
                    ? empresa.fotoPerfil
                    : `http://localhost:3001${empresa.fotoPerfil}`
                  : undefined,
              });
            }
          })
        );

        setEmpresas(empresasMap);
        setOfertas(activas);
      } catch (err) {
        console.error("Error cargando ofertas o empresas:", err);
      }
    };

    fetchOfertas();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ofertas de Trabajo Disponibles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra tu próximo desafío profesional en una red de empresas que valoran la experiencia y el conocimiento
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mensaje llamativo para usuarios no logueados */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-10 mb-12 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¡Tu próxima oportunidad profesional te está esperando!
                </h2>
                <p className="text-xl mb-2 leading-relaxed text-blue-100">
                  <strong>Accede a cientos de ofertas exclusivas</strong> diseñadas para profesionales con experiencia
                </p>
                <p className="text-lg text-blue-200">
                  Crea tu perfil, destaca tus habilidades y conecta con empresas que valoran tu talento senior
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div className="font-semibold">Ofertas Exclusivas</div>
                  <div className="text-sm text-blue-200">Para profesionales +50</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="font-semibold">100% Gratuito</div>
                  <div className="text-sm text-blue-200">Sin costos ocultos</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="font-semibold">Rápido y Fácil</div>
                  <div className="text-sm text-blue-200">Proceso simplificado</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link
                  to="/register-trabajador"
                  className="inline-block bg-white text-blue-600 font-bold text-xl px-10 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Regístrate Gratis Ahora
                </Link>
                <p className="text-blue-200 text-sm">
                  Sin compromisos • Sin costos ocultos • Comienza en menos de 2 minutos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de bienvenida para usuarios logueados */}
        {user && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 mb-12 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  ¡Hola {user.nombre}! Bienvenido a las ofertas laborales
                </h2>
                <p className="text-green-100 text-lg">
                  Explora las ofertas disponibles y postula a las que más te interesen
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-6 text-center min-w-[120px]">
                <div className="text-3xl font-bold">{ofertas.length}</div>
                <div className="text-sm text-green-100">Ofertas disponibles</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de ofertas */}
        <div className="space-y-8">
          {ofertas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No hay ofertas activas por ahora
              </h3>
              <p className="text-gray-500 text-lg">¡Vuelve pronto para ver nuevas oportunidades!</p>
            </div>
          ) : (
            ofertas.map((oferta) => {
              const empresaData = empresas.get(oferta.empresaId);

              return (
                <div key={oferta._id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        {empresaData?.fotoPerfil ? (
                          <img
                            src={empresaData.fotoPerfil}
                            alt="Logo Empresa"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                            {empresaData?.nombre?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="flex-1">
                          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{oferta.titulo}</h2>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
                            <div className="font-semibold text-lg">
                              {empresaData?.nombre || "Empresa Desconocida"}
                            </div>
                            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="text-sm">
                              Publicada: {new Date(oferta.fechaPublicacion).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mb-6 text-gray-700 text-lg leading-relaxed">
                        {oferta.descripcion?.slice(0, 300)}
                        {oferta.descripcion?.length > 300 && "..."}
                      </p>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Modalidad</div>
                            <div className="font-semibold text-gray-900">{oferta.modalidad}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Jornada</div>
                            <div className="font-semibold text-gray-900">{oferta.jornada || "No especificada"}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ubicación</div>
                            <div className="font-semibold text-gray-900">{oferta.ubicacion || "No especificada"}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Salario</div>
                            <div className="font-semibold text-gray-900">{oferta.salario || "A convenir"}</div>
                          </div>
                        </div>
                      </div>

                      {oferta.etiquetas && oferta.etiquetas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {oferta.etiquetas.map((etiqueta: string, index: number) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                            >
                              {etiqueta}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-4 min-w-[200px]">
                      {user ? (
                        <Link
                          to={`/postular-oferta/${oferta._id}`}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl text-center font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Postular Ahora
                        </Link>
                      ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Regístrate para ver todos los detalles y postular
                          </p>
                          <Link
                            to="/register-trabajador"
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg text-sm hover:bg-orange-600 transition-colors font-semibold block"
                          >
                            Crear cuenta gratis
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
