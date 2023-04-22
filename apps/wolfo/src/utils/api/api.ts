// ici on utilise axios et react query pour faire des requêtes http
import axios, { AxiosError } from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-type": "application/json",
  },
});

let token: string | null = null;

export const setToken = (newToken: string | null) => {
  token = newToken;
};
export const getToken = () => token;
api.interceptors.request.use(
  async config => {
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
