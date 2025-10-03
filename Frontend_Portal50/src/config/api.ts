// src/config/api.ts

// Función para detectar la IP del host actual
const detectHostIP = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si estamos en localhost, mantener localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // Si estamos accediendo por IP, usar la misma IP para el backend
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return `http://${hostname}:3001`;
    }
    
    // Para desarrollo, intentar con la IP detectada
    return `http://${hostname}:3001`;
  }
  
  // Fallback para SSR o entornos sin window
  return 'http://localhost:3001';
};

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || detectHostIP();

export const getApiUrl = (endpoint: string) => {
  // Limpiar endpoint duplicado
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${cleanEndpoint}`;
  
  // Debug en desarrollo
  if (import.meta.env.DEV) {
    console.log(`🔗 API Request: ${fullUrl}`);
  }
  
  return fullUrl;
};

// Función para probar conectividad
export const testApiConnection = async () => {
  try {
    const response = await fetch(getApiUrl('/ping'));
    const data = await response.json();
    console.log('✅ API conectada:', data);
    return true;
  } catch (error) {
    console.error('❌ Error conectando API:', error);
    return false;
  }
};

// Exportar configuración
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3
};

console.log(`🌐 API configurada: ${API_BASE_URL}`);

export default API_BASE_URL;
