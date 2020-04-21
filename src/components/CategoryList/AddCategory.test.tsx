import React from "react";

import store from "store";
import Request from "utils/api";
import {
  fireEvent,
  render,
  setupUser,
  wait,
  waitForElementToBeRemoved,
} from "utils/tests";
import * as types from "utils/types";

import AddCategory from "./AddCategory";

it("can add new category", async () => {
  setupUser();
  const {
    baseElement,
    getByLabelText,
    queryByLabelText,
    getByRole,
    getByText,
    queryByText,
    getByTestId,
  } = render(<AddCategory />);

  await wait(() => getByTestId("add-category"));
  expect(queryByText("Cancel")).toBeNull();

  const addButton = getByTestId("add-category");

  // Click the Add button
  fireEvent.click(addButton);
  await wait(() => getByText("Cancel"));
  expect(queryByLabelText(/Name.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Description.*/)).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();

  // Click the Cancel button
  fireEvent.click(getByText("Cancel"));
  await waitForElementToBeRemoved(() => queryByText("Cancel"));
  expect(queryByLabelText(/Name.*/)).toBeNull();
  expect(queryByLabelText(/Description.*/)).toBeNull();

  // Click the Add button again
  fireEvent.click(addButton);
  await wait(() => getByText("Cancel"));

  // The submit button should be disabled
  const submitButton = [
    ...getByRole("presentation").querySelectorAll("button"),
  ].filter((node) => node.textContent === "Submit")[0];
  expect(submitButton).toHaveAttribute("disabled");

  // Fill in mock values
  const nameField = getByLabelText(/Name.*/) as HTMLInputElement;
  const descriptionField = getByLabelText(/Description.*/) as HTMLInputElement;
  const mockId = 0;
  const mockName = "mockName";
  const mockDescription = "mockDescription";
  const mockCategory: types.Category = {
    id: mockId,
    name: mockName,
    description: mockDescription,
  };
  await wait(() => {
    fireEvent.change(nameField, {
      target: { value: mockName },
    });
    fireEvent.change(descriptionField, {
      target: { value: mockDescription },
    });
  });

  expect(nameField.value).toBe(mockName);
  expect(descriptionField.value).toBe(mockDescription);
  expect(submitButton).not.toHaveAttribute("disabled");

  // Submit
  jest
    .spyOn(Request, "post")
    .mockImplementation(
      (): Promise<types.Category> => Promise.resolve(mockCategory),
    );

  await wait(() => fireEvent.click(submitButton));
  expect(Request.post).toHaveBeenCalledWith("categories", {
    name: mockName,
    description: mockDescription,
  });

  const { categories } = store.getState().category;
  expect(Object.keys(categories)).toHaveLength(1);
  expect(categories[mockId.toString()]).toEqual(mockCategory);
});
