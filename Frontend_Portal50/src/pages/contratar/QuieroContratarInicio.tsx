import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getUserRoleByUid } from "../../services/userRole";
import { saveTipoContratacion } from "../../services/empresaService";

const opciones = [
  {
    key: "tiempo_completo",
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    ),
    title: "Profesionales Certificados Tiempo Completo",
    description: "Contrata talento validado para jornadas completas en tu empresa con dedicación exclusiva.",
  },
  {
    key: "fraccional",
    icon: (
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    title: "Profesionales Certificados Fraccionales",
    description: "Accede a expertos por horas o proyectos específicos con flexibilidad horaria.",
  },
  {
    key: "consultoria",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    ),
    title: "Consultoría Especializada",
    description: "Recibe asesoría estratégica de profesionales senior con experiencia comprobada.",
  },
  {
    key: "mentoria",
    icon: (
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    ),
    title: "Mentoría Personalizada",
    description: "Impulsa el desarrollo de tu equipo con mentoría personalizada y seguimiento continuo.",
  },
];

export default function QuieroContratarInicio() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        navigate(`/auth/login?redirect=/contratar`);
        return;
      }
      const role = await getUserRoleByUid(user.uid);
      if (role !== "empresa") {
       navigate("/acceso-no-autorizado");
      }
    };
    checkAuthAndRole();
  }, [navigate]);

  const handleSelect = async (key: string) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        navigate(`/auth/login?redirect=/contratar`);
        return;
      }
      const token = await user.getIdToken();
      await saveTipoContratacion(user.uid, key, token);
      setSelected(key);
      setTimeout(() => {
        navigate("/contratar/como-funciona");
      }, 600);
    } catch (err) {
      alert("No se pudo guardar la preferencia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            ¿Qué tipo de servicio necesitas?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Selecciona el tipo de colaboración que mejor se adapte a las necesidades de tu empresa. 
            Nuestros profesionales certificados están listos para sumarse a tu equipo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {opciones.map((op) => (
            <div
              key={op.key}
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl ${
                selected === op.key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelect(op.key)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {op.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {op.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {op.description}
                </p>
                <div className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  selected === op.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}>
                  {selected === op.key ? 'Seleccionado' : 'Seleccionar'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {loading && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 font-semibold">Guardando preferencia...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
