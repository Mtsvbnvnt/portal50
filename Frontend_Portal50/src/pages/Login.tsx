import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getApiUrl } from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !pass) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      setError("El correo debe ser válido.");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await cred.user.getIdToken();
      const uid = cred.user.uid;

      let res = await fetch(getApiUrl(`/api/users/uid/${uid}`), {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        res = await fetch(getApiUrl(`/api/empresas/uid/${uid}`), {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error("No se encontró el perfil en ninguna colección");
        data = await res.json();
        if (!data.rol) data.rol = "empresa";
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      setSuccess(true);
      
      // Redirección basada en el rol del usuario
      let redirectPath = "/";
      switch (data.rol) {
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
          redirectPath = "/dashboard";
          break;
        default:
          redirectPath = "/";
      }
      
      setTimeout(() => navigate(redirectPath, { state: { loginSuccess: true } }), 1000);
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no existe.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/bg_portal.png')` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-8 transition-all duration-300 shadow-lg hover:shadow-blue-500/80">
        {/* Logo y Título */}
        <div className="text-center mb-6">
          <img
            src="/Portal50.png"
            alt="Portal 50+"
            className="w-24 h-auto mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-black">Portal</span>
            <span className="text-blue-600">50+</span>
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border p-3 rounded ${
              error && !email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={`w-full border p-3 rounded ${
              error && !pass ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-200"
          >
            Iniciar Sesión
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {success && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            ✅ Inicio de sesión exitoso. Redirigiendo...
          </div>
        )}
      </div>
    </div>
  );
}
