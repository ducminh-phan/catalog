import React from "react";

import { FetchItemsResponse } from "actions/item";
import store from "store";
import Request from "utils/api";
import { Json } from "utils/misc";
import {
  act,
  fireEvent,
  render,
  setupUser,
  wait,
  waitForElementToBeRemoved,
} from "utils/tests";

import DeleteItem from "./DeleteItem";
import ItemList from "./index";

const categoryId = "0";
const itemId = "1";

it("can delete an item", async () => {
  setupUser();
  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchItemsResponse> =>
      Promise.resolve({
        totalItems: 3,
        items: [1, 2].map((id) => ({
          id,
          userId: 0,
          name: `name ${id}`,
          description: `description ${id}`,
          price: 0,
        })),
      }),
  );

  await act(async () => {
    render(<ItemList categoryId={categoryId} />);
  });
  expect(store.getState().item.totalItems).toBe(3);
  expect(Object.keys(store.getState().item.items)).toContain(itemId);

  const { baseElement, getByTestId, getByText, queryByText } = render(
    <DeleteItem categoryId={categoryId} itemId={itemId} />,
  );
  await wait(() => getByTestId("delete-item"));
  expect(baseElement).toMatchSnapshot();

  const deleteButton = getByTestId("delete-item");

  // Click the Delete button
  fireEvent.click(deleteButton);
  await wait(() => getByText("Cancel"));
  expect(getByText("Delete")).toBeInTheDocument();

  // Click the Cancel button
  fireEvent.click(getByText("Cancel"));
  await waitForElementToBeRemoved(() => getByText("Delete"));
  expect(queryByText("Delete")).toBeNull();

  // Click the Delete button
  fireEvent.click(deleteButton);
  await wait(() => getByText("Cancel"));

  expect(store.getState().item.totalItems).toBe(3);

  jest
    .spyOn(Request, "delete")
    .mockImplementation((): Promise<Json> => Promise.resolve({}));

  // Confirm delete
  fireEvent.click(getByText("Delete"));
  await waitForElementToBeRemoved(() => getByText("Delete"));
  expect(Request.delete).toHaveBeenCalledWith(
    `categories/${categoryId}/items/${itemId}`,
  );

  expect(store.getState().item.totalItems).toBe(2);
  expect(Object.keys(store.getState().item.items)).not.toContain(itemId);
});
