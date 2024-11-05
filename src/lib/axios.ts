import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Headers de la petición:', config.headers);
    } else {
      console.warn('⚠️ No hay token disponible');
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en el interceptor de petición:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa:', response);
    return response;
  },
  (error) => {
    console.error('❌ Error en la respuesta:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log('🚫 Error de autorización, redirigiendo a login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
  
export default api;