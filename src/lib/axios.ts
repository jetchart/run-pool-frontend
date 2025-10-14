import axios from 'axios';

// Instancia sin autenticación (para endpoints públicos)
export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

// Instancia con autenticación automática
export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

// Interceptor solo para la instancia autenticada
axiosAuth.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('userCredential');
    if (storedUser) {
      try {
        const userCredential = JSON.parse(storedUser);
        const token = userCredential.token || userCredential.accessToken;
        
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing stored user credentials:', error);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 401 para ambas instancias
const handle401 = (error: any) => {
  if (error.response?.status === 401) {
    console.log('Token expirado o inválido, redirigiendo a login...');
    localStorage.removeItem('userCredential');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Interceptor de respuesta para manejo de errores comunes
const handleCommonErrors = (response: any) => response;

axiosAuth.interceptors.response.use(handleCommonErrors, handle401);
axiosPublic.interceptors.response.use(handleCommonErrors, handle401);

// Export default para endpoints que requieren auth (más común)
export default axiosAuth;