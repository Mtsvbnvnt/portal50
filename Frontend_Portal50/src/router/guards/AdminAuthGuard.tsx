import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children, 
  requiredRoles = ['admin-fraccional', 'ejecutivo'], 
  redirectTo = '/admin' 
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(redirectTo);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol || '')) {
      alert('Acceso denegado. Se requieren permisos administrativos.');
      navigate('/admin');
      return;
    }
  }, [user, navigate, requiredRoles, redirectTo]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Verificando credenciales administrativas...</p>
        </div>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">[PROHIBIDO]</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Se requieren permisos administrativos para acceder a esta sección</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Volver al login administrativo
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};