import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getApiUrl } from "../config/api";

export default function AdminLogin() {
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

      // Buscar usuario en la base de datos usando la misma API que el login normal
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

      // Verificar que el usuario sea admin o ejecutivo
      const adminRoles = ['admin-fraccional', 'ejecutivo'];
      if (!adminRoles.includes(userData.rol)) {
        await auth.signOut();
        setError("Este portal es exclusivo para administradores y ejecutivos.");
        setLoading(false);
        return;
      }

      // Guardar datos del usuario
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Mostrar mensaje de éxito
      setSuccess(true);
      setError(""); // Limpiar cualquier error previo

      setTimeout(() => {
        // Redirigir según el rol
        if (userData.rol === 'admin-fraccional') {
          navigate("/admin-fraccional", { state: { loginSuccess: true } });
        } else if (userData.rol === 'ejecutivo') {
          navigate("/ejecutivo", { state: { loginSuccess: true } });
        }
      }, 1500);

    } catch (err: any) {
      console.error("Error en login administrativo:", err);
      setSuccess(false);
      
      // Manejo específico de errores
      if (err.code === 'auth/user-not-found') {
        setError("No existe una cuenta administrativa con este correo electrónico.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Contraseña incorrecta.");
      } else if (err.code === 'auth/invalid-email') {
        setError("El formato del correo electrónico no es válido.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Demasiados intentos fallidos. Intenta de nuevo más tarde.");
      } else if (err.message?.includes("perfil")) {
        setError("Usuario autenticado pero sin permisos administrativos.");
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
      <div className="absolute inset-0 bg-black bg-opacity-60 dark:bg-opacity-80" />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-8 transition-all duration-300 shadow-lg hover:shadow-red-500/80 dark:shadow-gray-700/50">
        {/* Logo y Título */}
        <div className="text-center mb-6">
          <img
            src="/Portal50.png"
            alt="Portal 50+"
            className="w-24 h-auto mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-black dark:text-white">Portal</span>
            <span className="text-red-600 dark:text-red-400">50+</span>
          </h1>
          <div className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full inline-block">
            <span className="text-red-800 dark:text-red-200 text-sm font-semibold">
              🔐 Acceso Administrativo
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Email administrativo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              error && !email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500`}
            disabled={loading}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={`w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              error && !pass ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500`}
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white py-2 rounded font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Acceso Administrativo"}
          </button>

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
        </form>

        {success && (
          <div className="mt-4 text-green-600 dark:text-green-400 font-semibold text-center">
            ✅ Acceso autorizado. Redirigiendo...
          </div>
        )}

        {/* Enlace al login normal */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            ¿Eres empresa o buscas trabajo?
          </p>
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Ir al login de clientes
          </Link>
        </div>
      </div>
    </div>
  );
}