import React, { createContext, useState } from "react";

interface TokenContextType {
  token: string;
  setToken: (token: string) => void;
}

export const TokenContext = createContext<TokenContextType>({
  token: "",
  setToken: () => {},
});

interface TokenProviderProps {
  children: React.ReactNode;
}

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [token, setToken] = useState<string>("");

  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>;
};
