import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";
import React, { createContext, useState } from "react";
import { Platform } from "react-native";
interface AuthContextType {
  token: string;
  name: string;
  id: string;
  handleSetToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: "",
  name: "",
  id: "",
  handleSetToken: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<string>("");

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    if (Platform.OS === "web") {
      localStorage.setItem("token", newToken);
    } else {
      SecureStore.setItemAsync("token", newToken);
    }
    const decodedToken: any = jwtDecode(newToken);
    setName(decodedToken.name);
    setId(decodedToken.id);
  };
  return (
    <AuthContext.Provider value={{ token, name, id, handleSetToken }}>
      {children}
    </AuthContext.Provider>
  );
};
