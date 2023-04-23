import { getToken, setToken } from "../api/api";

// le fetch original
const useAuth = async (): Promise<string | null> => {
  const token = getToken();
  if (token) {
    setToken(token);
    console.log("useAuth resolve");
    return Promise.resolve(token);
  }
  console.log("useAuth reject");
  return Promise.resolve(null);
};

export default useAuth;
