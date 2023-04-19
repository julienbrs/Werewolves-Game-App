import * as SecureStore from "expo-secure-store";
import { setToken } from "../api/api";

// le fetch original
const useAuth = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    setToken(token);
    return token;
  }
  return Promise.reject(new Error("No token"));
};

export default useAuth;
