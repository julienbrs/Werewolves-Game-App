import * as SecureStore from "expo-secure-store";
import { setToken } from "../api/api";

// le fetch original
const useAuth = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    setToken(token);
    return Promise.resolve(token);
  }
  return Promise.reject("No token");
};

export default useAuth;
