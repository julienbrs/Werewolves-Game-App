import jwtDecode from "jwt-decode";
import React, { createContext, useState } from "react";

interface AuthContextType {
  token: string;
  name: string;
  id: string;
  handleSetToken: (token: string) => void;
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
