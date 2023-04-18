// ici on utilise axios et react query pour faire des requêtes http
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api",
  headers: {
    "Content-type": "application/json",
  },
});

api.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// On intercepte les erreurs pour ne pas avoir à les gérer à chaque fois
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.log(JSON.stringify(error.response));
    if (error.response === undefined) {
      Promise.reject(error);
    } else {
      Promise.reject(error.response.data);
    }
  }
);

export default api;
