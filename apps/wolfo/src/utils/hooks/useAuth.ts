import { getToken } from "../api/api";

// le fetch original
const useAuth = async (): Promise<string | null> => {
  const token = getToken();
  return Promise.resolve(token);
};

export default useAuth;
