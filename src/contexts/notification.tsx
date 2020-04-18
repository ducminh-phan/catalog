import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useState,
} from "react";

type Severity = "error" | "warning" | "info" | "success";

interface NotificationContextValue {
  severity: Severity;
  message: string;
  setNotification: (severity: Severity, message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationProvider = (
  props: PropsWithChildren<object>,
): ReactElement => {
  const [severity, setSeverity] = useState<Severity>("info");
  const [message, setMessage] = useState<string>("");

  const setNotification = (_severity: Severity, _message: string): void => {
    setSeverity(_severity);
    setMessage(_message);
  };

  return (
    <NotificationContext.Provider
      value={{ severity, message, setNotification }}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
};

export const useNotification = (): NotificationContextValue => {
  const context = useContext<NotificationContextValue | undefined>(
    NotificationContext,
  );
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
