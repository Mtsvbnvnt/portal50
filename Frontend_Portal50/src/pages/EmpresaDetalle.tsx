import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmpresaDetalle: React.FC = () => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresaId) return;
    setLoading(true);
  fetch(`http://localhost:3000/api/empresas/${empresaId}`)
      .then(res => res.json())
      .then(data => setEmpresa(data))
      .catch(() => setError("Error al cargar la empresa"))
      .finally(() => setLoading(false));
  }, [empresaId]);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!empresa) return <div className="p-8">Empresa no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        onClick={() => navigate('/admin-fraccional')}
      >
        <span className="mr-2">&larr;</span> Volver al panel de empresas
      </button>
      <h1 className="text-3xl font-bold mb-2">{empresa.nombre}</h1>
      <p className="mb-2">Email: {empresa.email}</p>
      <p className="mb-2">Teléfono: {empresa.telefono}</p>
      <p className="mb-4">RUT: {empresa.rut}</p>

      <h2 className="text-2xl font-bold mt-8 mb-2">Publicaciones activas</h2>
      {empresa.ofertas && empresa.ofertas.length > 0 ? (
        empresa.ofertas.map((oferta: any) => (
          <div key={oferta._id} className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold text-lg">{oferta.titulo}</h3>
            <p className="text-gray-600">{oferta.descripcion}</p>
            <p className="text-sm">Postulantes: {oferta.postulantes?.length || 0}</p>
            {/* Aquí puedes agregar stats y entrevistas */}
            {oferta.postulantes && oferta.postulantes.length > 0 && (
              <div className="mt-2">
                <strong>Postulantes:</strong>
                <ul className="list-disc pl-6">
                  {oferta.postulantes.map((post: any) => (
                    <li key={post._id}>
                      {post.nombre} ({post.email})
                      {/* Aquí puedes mostrar estado de entrevista, etc. */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No hay publicaciones activas.</p>
      )}
    </div>
  );
};

export default EmpresaDetalle;
