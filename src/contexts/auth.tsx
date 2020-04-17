import React, { createContext, ReactElement, useContext } from "react";

import { logout } from "actions/auth";
import storage from "utils/storage";

interface AuthContextValue {
  isLoggedIn: boolean;
  logout: typeof logout;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = (props: object): ReactElement => {
  const isLoggedIn: boolean = storage.getToken() !== null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <AuthContext.Provider value={{ isLoggedIn, logout }} {...props} />;
};

const useAuth = (): AuthContextValue => {
  const context = useContext<AuthContextValue | undefined>(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };
