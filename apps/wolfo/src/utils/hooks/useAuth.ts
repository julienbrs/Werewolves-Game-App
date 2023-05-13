import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getToken, setToken } from "../api/api";
// le fetch original
const useAuth = async (): Promise<string | null> => {
  let token = getToken();
  if (token === null) {
    if (Platform.OS === "web") {
      token = localStorage.getItem("token");
    } else {
      token = await SecureStore.getItemAsync("token");
    }
  }
  if (token !== null) {
    setToken(token);
  }
  return Promise.resolve(token);
};

export default useAuth;
