import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getApiUrl } from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!email || !pass) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("El correo debe ser válido.");
      setLoading(false);
      return;
    }

    try {
      // Autenticación con Firebase
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await cred.user.getIdToken();
      const uid = cred.user.uid;

      // Buscar usuario en la base de datos
      let res = await fetch(getApiUrl(`/api/users/uid/${uid}`), {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      let userData;
      if (res.ok) {
        userData = await res.json();
      } else {
        // Si no se encuentra en usuarios, buscar en empresas
        res = await fetch(getApiUrl(`/api/empresas/uid/${uid}`), {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          throw new Error("No se encontró el perfil del usuario");
        }
        userData = await res.json();
        if (!userData.rol) userData.rol = "empresa";
      }

      // Guardar datos del usuario
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Mostrar mensaje de éxito
      setSuccess(true);
      setError(""); // Limpiar cualquier error previo
      
      // Redirección basada en el rol del usuario
      let redirectPath = "/dashboard"; // Por defecto dashboard
      switch (userData.rol) {
        case "admin-fraccional":
          redirectPath = "/admin-fraccional";
          break;
        case "empresa":
          redirectPath = "/empresa";
          break;
        case "ejecutivo":
          redirectPath = "/ejecutivo";
          break;
        case "profesional":
        case "profesional-ejecutivo":
        case "aprendiz":
          redirectPath = "/dashboard";
          break;
        default:
          redirectPath = "/dashboard";
      }
      
      // Redirección con delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(redirectPath, { state: { loginSuccess: true } });
      }, 1500);

    } catch (err: any) {
      console.error("Error en login:", err);
      setSuccess(false);
      
      // Manejo específico de errores
      if (err.code === 'auth/user-not-found') {
        setError("No existe una cuenta con este correo electrónico.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Contraseña incorrecta.");
      } else if (err.code === 'auth/invalid-email') {
        setError("El formato del correo electrónico no es válido.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Demasiados intentos fallidos. Intenta de nuevo más tarde.");
      } else if (err.message?.includes("perfil")) {
        setError("Usuario autenticado pero perfil no encontrado. Contacta al administrador.");
      } else {
        setError("Error de conexión. Verifica tu internet e intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center dark:bg-gray-900"
      style={{ backgroundImage: `url('/bg_portal.png')` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-8 transition-all duration-300 shadow-lg hover:shadow-blue-500/80 dark:shadow-gray-700/50">
        {/* Logo y Título */}
        <div className="text-center mb-6">
          <img
            src="/Portal50.png"
            alt="Portal 50+"
            className="w-24 h-auto mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-black dark:text-white">Portal</span>
            <span className="text-blue-600 dark:text-blue-400">50+</span>
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              error && !email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500`}
            disabled={loading}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={`w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              error && !pass ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500`}
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 rounded font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
        </form>

        {success && (
          <div className="mt-4 text-green-600 dark:text-green-400 font-semibold text-center">
            ✅ Inicio de sesión exitoso. Redirigiendo...
          </div>
        )}

        {/* Enlace al login administrativo */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            ¿Eres administrador o ejecutivo?
          </p>
          <Link
            to="/admin"
            className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
          >
            Acceso administrativo
          </Link>
        </div>
      </div>
    </div>
  );
}
