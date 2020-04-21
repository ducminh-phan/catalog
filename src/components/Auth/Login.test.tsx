import React from "react";

import Request from "utils/api";
import { LoginResponse } from "utils/auth";
import storage from "utils/storage";
import {
  fireEvent,
  render,
  wait,
  waitForElementToBeRemoved,
} from "utils/tests";

import Login from "./Login";

it("can login", async () => {
  const {
    baseElement,
    getByLabelText,
    getByRole,
    getByText,
    queryByText,
  } = render(<Login />);

  await wait(() => getByText("Login"));
  expect(queryByText("Login")).toBeInTheDocument();
  expect(queryByText("Cancel")).toBeNull();

  // Click the Login button
  fireEvent.click(getByText("Login"));
  await wait(() => getByText("Cancel"));
  expect(queryByText("Password")).toBeInTheDocument();
  expect(queryByText("Username")).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();

  // Click the Cancel button
  fireEvent.click(getByText("Cancel"));
  await waitForElementToBeRemoved(() => queryByText("Cancel"));
  expect(queryByText("Password")).toBeNull();
  expect(queryByText("Username")).toBeNull();

  // Click the Login button again
  fireEvent.click(getByText("Login"));
  await wait(() => getByText("Cancel"));

  // The login button should be disabled
  const loginButton = [
    ...getByRole("presentation").querySelectorAll("button"),
  ].filter((node) => node.textContent === "Login")[0];
  expect(loginButton).toHaveAttribute("disabled");

  // Fill in mock username and password
  const usernameField = getByLabelText(/Username.*/) as HTMLInputElement;
  const passwordField = getByLabelText(/Password.*/) as HTMLInputElement;
  const mockUsername = "mockUsername";
  const mockPassword = "mockPassword";
  await wait(() => {
    fireEvent.change(usernameField, {
      target: { value: mockUsername },
    });
    fireEvent.change(passwordField, {
      target: { value: mockPassword },
    });
  });

  expect(usernameField.value).toBe(mockUsername);
  expect(passwordField.value).toBe(mockPassword);
  expect(loginButton).not.toHaveAttribute("disabled");

  // Login
  jest
    .spyOn(Request, "post")
    .mockImplementation(
      (): Promise<LoginResponse> =>
        Promise.resolve({ accessToken: "accessToken" }),
    );

  await wait(() => fireEvent.click(loginButton));
  expect(Request.post).toHaveBeenCalledWith("login", {
    password: mockPassword,
    username: mockUsername,
  });
  expect(storage.getToken()).toBe("accessToken");
});
