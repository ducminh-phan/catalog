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

import AddItem from "./AddItem";

const categoryId = "0";

it("can add new item", async () => {
  setupUser();
  const {
    baseElement,
    getByLabelText,
    queryByLabelText,
    getByRole,
    getByText,
    queryByText,
    getByTestId,
  } = render(<AddItem categoryId={categoryId} />);

  await wait(() => getByTestId("add-item"));
  expect(queryByText("Cancel")).toBeNull();

  const addButton = getByTestId("add-item");

  // Click the Add button
  fireEvent.click(addButton);
  await wait(() => getByText("Cancel"));
  expect(queryByLabelText(/Name.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Description.*/)).toBeInTheDocument();
  expect(queryByLabelText(/Price.*/)).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();

  // Click the Cancel button
  fireEvent.click(getByText("Cancel"));
  await waitForElementToBeRemoved(() => queryByText("Cancel"));
  expect(queryByLabelText(/Name.*/)).toBeNull();
  expect(queryByLabelText(/Description.*/)).toBeNull();
  expect(queryByLabelText(/Price.*/)).toBeNull();

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
  const priceField = getByLabelText(/Price.*/) as HTMLInputElement;
  const mockId = 0;
  const mockName = "mockName";
  const mockDescription = "mockDescription";
  const mockPrice = 123;
  const mockItem: types.Item = {
    id: mockId,
    userId: 0,
    name: mockName,
    description: mockDescription,
    price: mockPrice,
  };
  await wait(() => {
    fireEvent.change(nameField, {
      target: { value: mockName },
    });
    fireEvent.change(descriptionField, {
      target: { value: mockDescription },
    });
    fireEvent.change(priceField, {
      target: { value: mockPrice },
    });
  });

  expect(nameField.value).toBe(mockName);
  expect(descriptionField.value).toBe(mockDescription);
  expect(priceField.value).toBe(mockPrice.toString());
  expect(submitButton).not.toHaveAttribute("disabled");

  // Submit
  jest
    .spyOn(Request, "post")
    .mockImplementation((): Promise<types.Item> => Promise.resolve(mockItem));

  await wait(() => fireEvent.click(submitButton));
  expect(Request.post).toHaveBeenCalledWith(`categories/${categoryId}/items`, {
    name: mockName,
    description: mockDescription,
    price: mockPrice.toString(),
  });

  const { items } = store.getState().item;
  expect(Object.keys(items)).toHaveLength(1);
  expect(items[mockId.toString()]).toEqual(mockItem);
});
