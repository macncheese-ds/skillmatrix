import axios from 'axios';

// Default to local backend during development when no VITE_API_URL is set
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_URL });

// Interceptor para extraer solo la data de las respuestas
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Usar sessionStorage en lugar de localStorage para que se limpie al cerrar/recargar
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('tokenTime', Date.now().toString());
  } else {
    delete api.defaults.headers.common['Authorization'];
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenTime');
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

// Función para verificar si el token es válido
export function getValidToken() {
  const token = sessionStorage.getItem('token');
  const tokenTime = sessionStorage.getItem('tokenTime');
  
  if (!token || !tokenTime) {
    return null;
  }

  // Si el token existe en sessionStorage, verificar que no haya pasado más de 5 minutos
  const elapsed = Date.now() - parseInt(tokenTime);
  const FIVE_MINUTES = 5 * 60 * 1000;
  
  if (elapsed > FIVE_MINUTES) {
    // Token expirado
    clearAuthToken();
    return null;
  }

  return token;
}

// Aplicar token guardado al cargar (solo si es válido)
const saved = getValidToken();
if (saved) {
  setAuthToken(saved);
}
