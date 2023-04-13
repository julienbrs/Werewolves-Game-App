// ici on utilise axios et react query pour faire des requêtes http
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const api =  axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;