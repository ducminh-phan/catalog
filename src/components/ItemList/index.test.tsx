import React from "react";

import { FetchItemsResponse } from "actions/item";
import { ITEMS_PER_PAGE } from "enums";
import Request from "utils/api";
import { fireEvent, render, setupUser, wait } from "utils/tests";

import ItemList from "./index";

const categoryId = "0";

it("renders the list of items correctly", async () => {
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

  // Render the first page
  const { baseElement, getByText, getAllByText } = render(
    <ItemList categoryId={categoryId} />,
  );
  await wait(() => getByText("name 1"));
  expect(baseElement).toMatchSnapshot();
  expect(getAllByText(/name.*/)).toHaveLength(2);
  expect(Request.get).toHaveBeenNthCalledWith(
    1,
    `categories/${categoryId}/items?offset=0&limit=${ITEMS_PER_PAGE}`,
  );

  // We can navigate to the next page
  const nextPageButton = getByText("2");
  expect(nextPageButton).toBeInTheDocument();

  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchItemsResponse> =>
      Promise.resolve({
        totalItems: 3,
        items: [
          {
            id: 3,
            userId: 0,
            name: `name 3`,
            description: `description 3`,
            price: 0,
          },
        ],
      }),
  );

  await wait(() => fireEvent.click(nextPageButton));
  expect(baseElement).toMatchSnapshot();
  expect(getAllByText(/name.*/)).toHaveLength(1);
  expect(Request.get).toHaveBeenLastCalledWith(
    `categories/${categoryId}/items?offset=${ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`,
  );
});

it("show the button to add items to logged in users", async () => {
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

  // Render the first page
  const { getByTestId, getByText } = render(
    <ItemList categoryId={categoryId} />,
  );
  await wait(() => getByText("name 1"));
  expect(getByTestId("add-item")).toBeInTheDocument();
});
