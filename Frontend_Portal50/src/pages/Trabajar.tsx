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
        console.error("❌ Error cargando ofertas o empresas:", err);
      }
    };

    fetchOfertas();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Ofertas de Trabajo Disponibles</h1>
      <p className="mb-6 text-gray-600">Encuentra tu próximo desafío profesional y postula fácilmente.</p>

      {/* Mensaje llamativo para usuarios no logueados */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white text-center shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              🚀 ¡Tu próxima oportunidad laboral te está esperando!
            </h2>
            <p className="text-xl mb-2 leading-relaxed">
              🎆 <strong>Accede a cientos de ofertas exclusivas</strong> para profesionales con experiencia
            </p>
            <p className="text-lg mb-6 text-blue-100">
              ✨ Crea tu perfil, destaca tus habilidades y conecta con empresas que valoran tu talento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-lg">
                <span className="mr-2">💼</span>
                <span>Ofertas para +50</span>
              </div>
              <div className="flex items-center text-lg">
                <span className="mr-2">💯</span>
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center text-lg">
                <span className="mr-2">⚡</span>
                <span>Rápido y Fácil</span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/register-usuario"
                className="inline-block bg-white text-blue-600 font-bold text-xl px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🎉 Regístrate Gratis Acá
              </Link>
            </div>
            <p className="mt-4 text-blue-100 text-sm">
              🔒 Sin compromisos • Sin costos ocultos • Comienza en menos de 2 minutos
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de bienvenida para usuarios logueados */}
      {user && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                👋 ¡Hola {user.nombre}! Bienvenido a las ofertas laborales
              </h2>
              <p className="text-green-100">
                💼 Explora las ofertas disponibles y postula a las que más te interesen
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{ofertas.length}</div>
              <div className="text-sm text-green-100">Ofertas disponibles</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {ofertas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay ofertas activas por ahora
            </h3>
            <p className="text-gray-500">¡Vuelve pronto para ver nuevas oportunidades!</p>
          </div>
        ) : (
          ofertas.map((oferta) => {
            const empresaData = empresas.get(oferta.empresaId);

            return (
              <div key={oferta._id} className="border rounded-lg p-6 bg-white shadow-md hover:shadow-lg hover:shadow-blue-400/80 transform hover:-translate-y-1 transition duration-300 ease-in-out">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">{oferta.titulo}</h2>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      {empresaData?.fotoPerfil ? (
                        <img
                          src={empresaData.fotoPerfil}
                          alt="Logo Empresa"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {empresaData?.nombre?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {empresaData?.nombre || "Empresa Desconocida"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Publicada: {new Date(oferta.fechaPublicacion).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="ml-4">
                      <Link
                        to={`/postular-oferta/${oferta._id}`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        📝 Postular Ahora
                      </Link>
                    </div>
                  )}
                </div>

                <p className="mb-4 text-gray-700 leading-relaxed">
                  {oferta.descripcion?.slice(0, 200)}
                  {oferta.descripcion?.length > 200 && "..."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">🏢</span>
                    <div>
                      <div className="text-xs text-gray-500">Modalidad</div>
                      <div className="font-medium text-gray-800">{oferta.modalidad}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">⏰</span>
                    <div>
                      <div className="text-xs text-gray-500">Jornada</div>
                      <div className="font-medium text-gray-800">{oferta.jornada || "No especificada"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">📍</span>
                    <div>
                      <div className="text-xs text-gray-500">Ubicación</div>
                      <div className="font-medium text-gray-800">{oferta.ubicacion || "No especificada"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">💰</span>
                    <div>
                      <div className="text-xs text-gray-500">Salario</div>
                      <div className="font-medium text-gray-800">{oferta.salario || "A convenir"}</div>
                    </div>
                  </div>
                </div>

                {oferta.etiquetas && oferta.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {oferta.etiquetas.map((etiqueta: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {etiqueta}
                      </span>
                    ))}
                  </div>
                )}

                {!user && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        🔐 Regístrate para ver todos los detalles y postular
                      </p>
                      <Link
                        to="/register-usuario"
                        className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition-colors font-semibold"
                      >
                        Regístrate para postular
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
