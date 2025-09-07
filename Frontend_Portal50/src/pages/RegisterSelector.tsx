import React from "react";
import { Link } from "react-router-dom";

export default function RegisterSelector() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-8">¿Qué tipo de cuenta deseas crear?</h1>
      <div className="space-y-6 w-full max-w-md">
        <Link
          to="/register-empresa"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded text-center text-lg font-semibold transition"
        >
          Registrar empresa
        </Link>
        <Link
          to="/register-usuario"
          className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded text-center text-lg font-semibold transition"
        >
          Registrar trabajador / usuario
        </Link>
      </div>
    </div>
  );
}
