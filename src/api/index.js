import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  },

  withCredentials: true,

});

api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('jwt'); // JWT'yi localStorage'dan al


    const noAuthRoutes = [
      '/authentication/login',
      '/authentication/register/customer',
      '/authentication/register/seller'
    ];



    if (token && !noAuthRoutes.some(route => config.url.includes(route))) {
      config.headers.Authorization = `Bearer ${token}`; // Header'a ekle
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
