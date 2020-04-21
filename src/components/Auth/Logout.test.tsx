import React from "react";

import storage from "utils/storage";
import { fireEvent, render, setupUser, wait } from "utils/tests";

import Logout from "./Logout";

it("can logout", async () => {
  setupUser();

  const { baseElement, getByText } = render(<Logout />);

  await wait(() => getByText("Logout"));
  expect(baseElement).toMatchSnapshot();

  // Click the Login button
  await wait(() => fireEvent.click(getByText("Logout")));

  expect(storage.getToken()).toBeNull();
});
