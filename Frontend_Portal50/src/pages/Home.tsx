// src/pages/Home.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success);
  const [showLoginSuccess, setShowLoginSuccess] = useState(location.state?.loginSuccess);

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
    <main className="min-h-screen bg-white text-gray-800 relative">
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
      <section className="bg-gray-100 py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Bienvenido a <span className="text-black">Portal</span>
          <span className="text-blue-600">50+</span>
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Tu comunidad para conectar empresas, profesionales y aprendices con oportunidades reales.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Regístrate
          </Link>
          <Link
            to="/login"
            className="bg-gray-300 text-gray-800 px-8 py-3 rounded-full hover:bg-gray-400 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </section>

      {/* Sección de información destacada */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">¿Qué es Portal50+?</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Portal50+ es una plataforma que impulsa la conexión entre profesionales con experiencia,
          empresas que valoran el talento y aprendices que buscan crecer.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="border p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Profesionales</h3>
            <p className="text-gray-600">
              Publica tu perfil, muestra tu experiencia y encuentra proyectos alineados a tu trayectoria.
            </p>
          </div>
          <div className="border p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Empresas</h3>
            <p className="text-gray-600">
              Accede a un banco de talento calificado y crea ofertas laborales con impacto.
            </p>
          </div>
          <div className="border p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Aprendices</h3>
            <p className="text-gray-600">
              Encuentra cursos, mentorías y oportunidades para potenciar tus habilidades.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="bg-blue-600 py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para unirte?</h2>
        <p className="mb-8">Crea tu cuenta hoy mismo y comienza a conectar con oportunidades reales.</p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-slate-400 transition"
        >
          Crear Cuenta
        </Link>
      </section>
    </main>
  );
}
