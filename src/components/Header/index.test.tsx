import React from "react";

import { fireEvent, render, setupUser, wait } from "utils/tests";

import Header from "./index";

it("renders correctly", async () => {
  setupUser();

  const { baseElement, getByText } = render(<Header />);

  await wait(() => getByText("Logout"));
  expect(baseElement).toMatchSnapshot();

  await wait(() => fireEvent.click(getByText("Logout")));
  expect(getByText("Login")).toBeInTheDocument();
  expect(getByText("Register")).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();
});
