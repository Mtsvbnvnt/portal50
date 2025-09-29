import { getAuth } from 'firebase/auth';
import { getApiUrl } from '../config/api';

export const getUserRoleByUid = async (uid: string): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    
    const idToken = await user.getIdToken();
    
    // Intentar obtener como usuario
    let res = await fetch(getApiUrl(`/api/users/uid/${uid}`), {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.rol || 'profesional';
    }
    
    // Si no es usuario, intentar como empresa
    res = await fetch(getApiUrl(`/api/empresas/uid/${uid}`), {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    
    if (res.ok) {
      return 'empresa';
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo rol del usuario:', error);
    return null;
  }
};