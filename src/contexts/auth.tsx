import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
} from "react";
import { useAsync } from "react-async";

import * as auth from "utils/auth";
import storage from "utils/storage";

import { useNotification } from "./notification";

interface AuthContextValue {
  data: auth.AppData | null;
  register: (payload: auth.RegisterRequest) => void;
  login: (payload: auth.LoginRequest) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = (
  props: PropsWithChildren<object>,
): ReactElement => {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);
  const { data = null, error, isRejected, isSettled, reload } = useAsync({
    promiseFn: auth.getAppData,
  });

  React.useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true);
    }
  }, [isSettled]);

  const { setNotification } = useNotification();

  if (!firstAttemptFinished) {
    if (isRejected) {
      setNotification("error", error?.message ?? "Something went wrong");
    }

    return <div />;
  }

  const login = (payload: auth.LoginRequest): void => {
    auth
      .login(payload)
      .then(reload)
      .catch(({ message }) => {
        setNotification("error", message);
      });
  };

  const register = (payload: auth.RegisterRequest): void => {
    auth
      .register(payload)
      .then(reload)
      .catch(({ message }) => {
        setNotification("error", message);
      });
  };

  const logout = (): void => {
    Promise.resolve(storage.removeToken()).then(reload);
  };

  return (
    <AuthContext.Provider
      value={{ data, login, logout, register }}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext<AuthContextValue | undefined>(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
