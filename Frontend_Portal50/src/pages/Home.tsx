// src/pages/Home.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success);
  const [showLoginSuccess, setShowLoginSuccess] = useState(location.state?.loginSuccess);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (location.state?.loginSuccess) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-200">
      {/* Barra verde de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ Registro exitoso
        </div>
      )}
      {showLoginSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ Inicio de sesión exitoso
        </div>
      )}

      {/* Hero principal */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20 px-4 text-center transition-colors duration-200">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          Bienvenido a <span className="text-black dark:text-white">Portal</span>
          <span className="text-blue-600 dark:text-blue-400">50+</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto font-medium">
          Tu comunidad para conectar empresas, profesionales y aprendices con oportunidades reales.
        </p>
        {user ? (
          <div className="flex justify-center items-center min-h-[300px] mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
              {/* Empresa: Quiero contratar y Quiero aprender */}
              {user.rol === "empresa" && (
                <>
                  <Link to="/quiero-contratar" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-blue-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600">Quiero contratar</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Encuentra talento certificado para tu empresa.</p>
                  </Link>
                  <Link to="/aprender" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-green-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600">Quiero aprender</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Accede a cursos y mentorías para potenciar tus habilidades.</p>
                  </Link>
                </>
              )}
              {/* Trabajador: Quiero trabajar y Quiero aprender */}
              {(user.rol === "profesional" || user.rol === "profesional-ejecutivo") && (
                <>
                  <Link to="/trabajar" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-green-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600">Quiero trabajar</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Encuentra ofertas laborales y postula a empleos.</p>
                  </Link>
                  <Link to="/aprender" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-blue-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600">Quiero aprender</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Accede a cursos y mentorías para potenciar tus habilidades.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* Sección de información destacada */}
      <section className="pt-8 pb-20 px-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">¿Qué es Portal50+?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Portal50+ es una plataforma que impulsa la conexión entre profesionales con experiencia,
              empresas que valoran el talento y aprendices que buscan crecer.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quiero trabajar */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-blue-600 dark:bg-blue-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Quiero trabajar</h3>
                <div className="w-12 h-0.5 bg-blue-200"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    ¿Tienes experiencia y buscas nuevas oportunidades laborales? Únete como profesional para:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">▪</span>
                      Encontrar empleos que valoren tu experiencia
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">▪</span>
                      Crear un perfil profesional destacado
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">▪</span>
                      Acceder a cursos de actualización
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">▪</span>
                      Conectar con empresas que te buscan
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-usuario"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 border-2 border-blue-600 hover:border-blue-700"
                >
                  Registrarse como Profesional
                </Link>
              </div>
            </div>

            {/* Quiero contratar */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-green-600 dark:bg-green-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Quiero contratar</h3>
                <div className="w-12 h-0.5 bg-green-200 dark:bg-green-300"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    ¿Necesitas talento experimentado para tu empresa? Regístrate como empresa para:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">▪</span>
                      Publicar ofertas laborales específicas
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">▪</span>
                      Buscar profesionales calificados
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">▪</span>
                      Acceder a una base de talento +50
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">▪</span>
                      Gestionar postulaciones de manera eficiente
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-empresa"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 border-2 border-green-600 hover:border-green-700"
                >
                  Registrarse como Empresa
                </Link>
              </div>
            </div>

            {/* Quiero aprender */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-purple-600 dark:bg-purple-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Quiero aprender</h3>
                <div className="w-12 h-0.5 bg-purple-200 dark:bg-purple-300"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    ¿Quieres aprender y crecer profesionalmente? Únete como aprendiz para:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-3 mt-1">▪</span>
                      Acceder a cursos y capacitaciones
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-3 mt-1">▪</span>
                      Recibir mentorías de profesionales
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-3 mt-1">▪</span>
                      Encontrar oportunidades de inicio
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-3 mt-1">▪</span>
                      Desarrollar habilidades relevantes
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-usuario?rol=aprendiz"
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 border-2 border-purple-600 hover:border-purple-700"
                >
                  Registrarse como Aprendiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
