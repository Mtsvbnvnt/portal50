// src/components/InfoNuevoProceso.tsx

import { Link } from "react-router-dom";

export default function InfoNuevoProceso() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl">[INFO]</div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Nuevo proceso de publicación
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
            Ahora todas las ofertas de empleo pasan por un proceso de revisión antes de ser publicadas. 
            Esto garantiza la calidad y consistencia de las ofertas en nuestra plataforma.
          </p>
          <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <p><strong>Paso 1:</strong> Crea una solicitud de empleo</p>
            <p><strong>Paso 2:</strong> Nuestro equipo revisa la solicitud</p>
            <p><strong>Paso 3:</strong> Una vez aprobada, se publica automáticamente</p>
          </div>
          <div className="mt-3">
            <Link
              to="/empresa/crear-solicitud"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Crear solicitud de empleo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}