import { Link } from "react-router-dom";

export default function QuieroContratar() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* HERO */}
      <section className="py-20 text-center px-4 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ¿Buscas talento para tu empresa?
        </h1>
        <p className="mb-6 max-w-2xl mx-auto text-lg text-gray-600">
          Te ayudamos a encontrar profesionales certificados, ya sea para trabajos por horas o jornadas completas.
        </p>
      </section>

      {/* SELECCIÓN DE CONTRATACIÓN */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-8">
          Selecciona el tipo de contratación
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-bold text-lg mb-2">Profesionales Certificados</h3>
            <p className="text-gray-600 mb-4">
              Contrata profesionales verificados para posiciones permanentes.
            </p>
            <Link
              to="/quiero-contratar/trabajadores"
              className="bg-blue-600 text-white px-6 py-2 rounded-full inline-block"
            >
              Ver profesionales
            </Link>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="font-bold text-lg mb-2">Profesionales Fraccionales</h3>
            <p className="text-gray-600 mb-4">
              Accede a profesionales para trabajar por horas o proyectos.
            </p>
            <Link
              to="/quiero-contratar/trabajadores"
              className="bg-blue-600 text-white px-6 py-2 rounded-full inline-block"
            >
              Ver por horas
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-10">Cómo funciona</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition text-center">
            <div className="text-xl font-bold mb-2">1</div>
            <h3 className="font-semibold mb-2">Hablemos de tus necesidades</h3>
            <p className="text-gray-600">
              Inicia una conversación para entender tu cultura y requisitos.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition text-center">
            <div className="text-xl font-bold mb-2">2</div>
            <h3 className="font-semibold mb-2">Acceso a perfiles preseleccionados</h3>
            <p className="text-gray-600">
              Te presentamos candidatos ajustados a tu requerimiento.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition text-center">
            <div className="text-xl font-bold mb-2">3</div>
            <h3 className="font-semibold mb-2">Acompañamiento continuo</h3>
            <p className="text-gray-600">
              Te apoyamos durante todo el proceso de contratación.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Crea tu cuenta empresarial</h2>
        <p className="text-gray-600 mb-6">
          Comienza a contratar talento de calidad hoy mismo.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition"
        >
          Crear cuenta empresarial
        </Link>
        <p className="mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
