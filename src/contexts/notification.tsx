import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Severity = "error" | "warning" | "info" | "success";

type Notification = {
  severity: Severity;
  message: string;
};

type NotificationContextValue = Notification & {
  setNotification: Dispatch<SetStateAction<Notification>>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationProvider = (
  props: PropsWithChildren<object>,
): ReactElement => {
  const [{ severity, message }, setNotification] = useState<Notification>({
    severity: "info",
    message: "",
  });

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
