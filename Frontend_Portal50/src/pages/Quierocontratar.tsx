import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


export default function QuieroContratar() {
  const { user } = useContext(UserContext);

  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* HERO: ¿Quieres contratar? */}
      <section className="py-20 text-center px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            ¿Quieres contratar talento senior?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Conecta con profesionales certificados mayores de 50 años. Experiencia, conocimiento y compromiso para tu empresa.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Profesionales Tiempo Completo */}
            <div className="bg-white border-2 border-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Profesionales Tiempo Completo</h3>
              <p className="text-gray-600 text-base leading-relaxed">Profesionales verificados para posiciones permanentes en tu empresa con dedicación completa.</p>
            </div>

            {/* Profesionales Fraccionales */}
            <div className="bg-white border-2 border-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Profesionales Fraccionales</h3>
              <p className="text-gray-600 text-base leading-relaxed">Especialistas para trabajar por horas, proyectos o necesidades puntuales específicas.</p>
            </div>

            {/* Consultorías */}
            <div className="bg-white border-2 border-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Consultorías Especializadas</h3>
              <p className="text-gray-600 text-base leading-relaxed">Recibe asesoría experta para resolver desafíos específicos de tu organización.</p>
            </div>

            {/* Mentorías */}
            <div className="bg-white border-2 border-orange-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Mentorías Personalizadas</h3>
              <p className="text-gray-600 text-base leading-relaxed">Accede a mentoría personalizada para potenciar el desarrollo de tu equipo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA: pasos */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">¿Cómo funciona nuestro proceso?</h2>
          
          <div className="space-y-12">
            {/* Paso 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border-l-4 border-blue-500">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Conversación inicial para entender tus necesidades</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Nuestro equipo especializado te contactará para comprender a fondo tu cultura empresarial, requisitos específicos y expectativas del perfil ideal.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Agendar llamada
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Iniciar chat en vivo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border-l-4 border-green-500">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Acceso a perfiles preseleccionados</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    En nuestra plataforma tendrás acceso exclusivo a los perfiles de candidatos cuidadosamente preseleccionados según tus criterios específicos.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Lo que puedes hacer:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Revisar perfiles detallados con experiencia verificada
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Agendar entrevistas directamente desde la plataforma
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Proporcionar feedback para expandir la búsqueda si es necesario
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border-l-4 border-purple-500">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Acompañamiento en contratación e inducción</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Te acompañamos en todo el proceso de contratación e inducción para asegurar una integración exitosa del nuevo talento en tu equipo.
                  </p>
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold text-purple-800 text-lg">Garantía de satisfacción de 3 meses</span>
                    </div>
                    <p className="text-purple-700">Si no estás completamente satisfecho, trabajamos juntos para encontrar la solución perfecta.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invitación a empresas (solo si no es empresa) */}
      {(!user || user.rol !== "empresa") && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">¿Eres una empresa?</h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Únete a Portal 50+ y accede a una red exclusiva de trabajadores certificados con experiencia comprobada. 
                Crea solicitudes de empleo que serán revisadas por nuestro equipo especializado antes de ser publicadas.
              </p>
              <Link
                to="/register-empresa"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Únete como empresa ahora
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
