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

import { FetchItemsResponse } from "../../actions/item";
import { act } from "../../utils/tests";
import DeleteItem from "./DeleteItem";
import EditItem from "./EditItem";
import ItemList from "./index";

const categoryId = "0";
const itemId = "1";

it("can edit item", async () => {
  setupUser();

  const items = [1, 2].map((id) => ({
    id,
    userId: 0,
    name: `name ${id}`,
    description: `description ${id}`,
    price: 0,
  }));
  const item = items[parseInt(itemId, 10) - 1];

  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchItemsResponse> =>
      Promise.resolve({
        totalItems: 3,
        items,
      }),
  );

  await act(async () => {
    render(<ItemList categoryId={categoryId} />);
  });
  expect(store.getState().item.totalItems).toBe(3);
  expect(store.getState().item.items).toEqual(
    expect.objectContaining({
      [itemId]: item,
    }),
  );

  const {
    baseElement,
    getByTestId,
    getByText,
    queryByText,
    queryByLabelText,
    getByRole,
    getByLabelText,
  } = render(<EditItem categoryId={categoryId} item={item} />);
  await wait(() => getByTestId("edit-item"));
  expect(baseElement).toMatchSnapshot();

  await wait(() => getByTestId("edit-item"));
  expect(queryByText("Cancel")).toBeNull();

  const editButton = getByTestId("edit-item");

  // Click the Add button
  fireEvent.click(editButton);
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

  // Click the Edit button again
  fireEvent.click(editButton);
  await wait(() => getByText("Cancel"));

  // The submit button should be disabled
  const submitButton = [
    ...getByRole("presentation").querySelectorAll("button"),
  ].filter((node) => node.textContent === "Submit")[0];
  expect(submitButton).toHaveAttribute("disabled");

  // Fill in mock values
  const nameField = getByLabelText(/Name.*/) as HTMLInputElement;
  const mockName = "mockName";
  const mockItem: types.Item = {
    ...item,
    name: mockName,
  };
  await wait(() => {
    fireEvent.change(nameField, {
      target: { value: mockName },
    });
  });

  expect(nameField.value).toBe(mockName);
  expect(submitButton).not.toHaveAttribute("disabled");

  // Submit
  jest
    .spyOn(Request, "put")
    .mockImplementation((): Promise<types.Item> => Promise.resolve(mockItem));

  await wait(() => fireEvent.click(submitButton));
  expect(Request.put).toHaveBeenCalledWith(
    `categories/${categoryId}/items/${itemId}`,
    {
      id: parseInt(itemId, 10),
      name: mockName,
      description: item.description,
      price: item.price,
      userId: 0,
    },
  );

  expect(Object.keys(store.getState().item.items)).toHaveLength(2);
  expect(store.getState().item.items).toEqual(
    expect.objectContaining({ [itemId]: mockItem }),
  );
});
