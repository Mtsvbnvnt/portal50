import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function RegisterEmpresa() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !pass || !nombre) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (email && !email.includes("@")) {
      setError("El correo debe tener un formato válido.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const res = await fetch("http://localhost:3000/api/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          email,
          nombre,
          telefono,
          rol: "empresa",
          direccion: pais,
          videoPresentacion: "",
          ejecutivos: [],
        }),
      });
      if (!res.ok) throw new Error("Error guardando en MongoDB");
      setSuccess(true);
      setTimeout(() => {
        navigate("/", { state: { success: true } });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg bg-white shadow-md rounded px-8 py-6"
      >
        <h1 className="text-2xl font-bold mb-4">Registro de Empresa</h1>
        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Contraseña *"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Nombre de la empresa *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="País"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="input mb-4"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Registrar empresa
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && (
          <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
            Registro exitoso, redirigiendo...
          </div>
        )}
      </form>
    </div>
  );
}
