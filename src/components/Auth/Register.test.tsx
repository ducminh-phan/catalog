import React from "react";

import Request from "utils/api";
import { RegisterResponse } from "utils/auth";
import storage from "utils/storage";
import {
  fireEvent,
  render,
  wait,
  waitForElementToBeRemoved,
} from "utils/tests";

import Register from "./Register";

it("can register", async () => {
  const {
    baseElement,
    getByLabelText,
    queryByLabelText,
    getByRole,
    getByText,
    queryByText,
  } = render(<Register />);

  await wait(() => getByText("Register"));
  expect(queryByText("Register")).toBeInTheDocument();
  expect(queryByText("Cancel")).toBeNull();

  // Click the Register button
  fireEvent.click(getByText("Register"));
  await wait(() => getByText("Cancel"));
  expect(queryByLabelText(/Username.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Password.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Email.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Name.*/)).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();

  // Click the Cancel button
  fireEvent.click(getByText("Cancel"));
  await waitForElementToBeRemoved(() => queryByText("Cancel"));
  expect(queryByLabelText(/Username.*/)).toBeNull();
  expect(queryByLabelText(/Password.*/)).toBeNull();

  // Click the Register button again
  fireEvent.click(getByText("Register"));
  await wait(() => getByText("Cancel"));

  // The register button should be disabled
  const registerButton = [
    ...getByRole("presentation").querySelectorAll("button"),
  ].filter((node) => node.textContent === "Register")[0];
  expect(registerButton).toHaveAttribute("disabled");

  // Fill in mock values
  const usernameField = getByLabelText(/Username.*/) as HTMLInputElement;
  const passwordField = getByLabelText(/Password.*/) as HTMLInputElement;
  const emailField = getByLabelText(/Email.*/) as HTMLInputElement;
  const nameField = getByLabelText(/Name.*/) as HTMLInputElement;
  const mockUsername = "mockUsername";
  const mockPassword = "mockPassword";
  const mockEmail = "mockEmail@gmail.com";
  const mockName = "mockName";
  await wait(() => {
    fireEvent.change(usernameField, {
      target: { value: mockUsername },
    });
    fireEvent.change(passwordField, {
      target: { value: mockPassword },
    });
    fireEvent.change(emailField, {
      target: { value: mockEmail },
    });
    fireEvent.change(nameField, {
      target: { value: mockName },
    });
  });

  expect(usernameField.value).toBe(mockUsername);
  expect(passwordField.value).toBe(mockPassword);
  expect(emailField.value).toBe(mockEmail);
  expect(nameField.value).toBe(mockName);
  expect(registerButton).not.toHaveAttribute("disabled");

  // Register
  jest
    .spyOn(Request, "post")
    .mockImplementation(
      (): Promise<RegisterResponse> =>
        Promise.resolve({ accessToken: "accessToken" }),
    );

  await wait(() => fireEvent.click(registerButton));
  expect(Request.post).toHaveBeenCalledWith("registrations", {
    username: mockUsername,
    password: mockPassword,
    email: mockEmail,
    name: mockName,
  });
  expect(storage.getToken()).toBe("accessToken");
});
