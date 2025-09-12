import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://10.229.52.84:5000/api';

export const api = axios.create({ baseURL: API_URL });

// Interceptor para extraer solo la data de las respuestas
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

// aplicar token guardado al cargar
const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);
