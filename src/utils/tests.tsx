import { StylesProvider } from "@material-ui/styles";
import { render as rtlRender, RenderResult } from "@testing-library/react";
import { Rule, StyleSheet } from "jss";
import React, { ComponentType, ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";

import Notification from "components/Notification";
import { AuthProvider } from "contexts/auth";
import { NotificationProvider } from "contexts/notification";
import store from "store";

import Request from "./api";
import { UserResponse } from "./auth";
import storage from "./storage";

// Custom logic to make Material UI class names consistent in snapshots
const generateClassName = (
  rule: Rule,
  styleSheet?: StyleSheet<string>,
): string => `${styleSheet?.options.classNamePrefix}-${rule.key}`;

const render = (ui: ReactElement, renderOptions = {}): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }): ReactElement => {
    return (
      <StylesProvider generateClassName={generateClassName}>
        <Provider store={store}>
          <NotificationProvider>
            <AuthProvider>{children}</AuthProvider>
            <Notification />
          </NotificationProvider>
        </Provider>
      </StylesProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper as ComponentType, ...renderOptions });
};

export const setupUser = (): void => {
  storage.setToken("accessToken");
  expect(storage.getToken()).toBe("accessToken");
  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<UserResponse> =>
      Promise.resolve({
        email: "minhπ",
        username: "minhπ",
        created: "",
        updated: "",
        name: "minhπ",
        id: 0,
      }),
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
