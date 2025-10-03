import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login' 
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(redirectTo);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol || '')) {
      alert('No tienes permisos para acceder a esta sección');
      navigate('/');
      return;
    }
  }, [user, navigate, requiredRoles, redirectTo]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <p>No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};