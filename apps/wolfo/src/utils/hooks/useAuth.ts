import * as SecureStore from "expo-secure-store";

// le fetch original
const useAuth = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    return token;
  }
  return Promise.reject(new Error("No token"));
};

export default useAuth;
