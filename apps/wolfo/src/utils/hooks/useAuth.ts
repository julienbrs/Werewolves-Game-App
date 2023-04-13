import * as SecureStore from 'expo-secure-store';
import { useQuery } from '@tanstack/react-query';

// le fetch original
const useAuth = async () => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    return token;
  }
  return null;
}

// on wrap le fetch dans une query de la librairie react-query
const useAuthQuery = () => useQuery({
  queryKey: ['auth'], // clé de cache
  queryFn: useAuth,
});
export default useAuthQuery;