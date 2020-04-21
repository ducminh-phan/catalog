import React from "react";

import { FetchCategoriesResponse } from "actions/category";
import { CATEGORIES_PER_PAGE } from "enums";
import Request from "utils/api";
import { fireEvent, render, setupUser, wait } from "utils/tests";

import CategoryList from "./index";

it("renders the list of categories correctly", async () => {
  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchCategoriesResponse> =>
      Promise.resolve({
        totalCategories: 3,
        categories: [1, 2].map((id) => ({
          id,
          name: `name ${id}`,
          description: `description ${id}`,
        })),
      }),
  );

  // Render the first page
  const { baseElement, getByText, getAllByText } = render(<CategoryList />);
  await wait(() => getByText("name 1"));
  expect(baseElement).toMatchSnapshot();
  expect(getAllByText(/name.*/)).toHaveLength(2);
  expect(Request.get).toHaveBeenNthCalledWith(
    1,
    `categories?offset=0&limit=${CATEGORIES_PER_PAGE}`,
  );

  // We can navigate to the next page
  const nextPageButton = getByText("2");
  expect(nextPageButton).toBeInTheDocument();

  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchCategoriesResponse> =>
      Promise.resolve({
        totalCategories: 3,
        categories: [
          {
            id: 3,
            name: `name 3`,
            description: `description 3`,
          },
        ],
      }),
  );

  await wait(() => fireEvent.click(nextPageButton));
  expect(baseElement).toMatchSnapshot();
  expect(getAllByText(/name.*/)).toHaveLength(1);
  expect(Request.get).toHaveBeenLastCalledWith(
    `categories?offset=${CATEGORIES_PER_PAGE}&limit=${CATEGORIES_PER_PAGE}`,
  );
});

it("show the button to add category to logged in users", async () => {
  setupUser();
  jest.spyOn(Request, "get").mockImplementation(
    (): Promise<FetchCategoriesResponse> =>
      Promise.resolve({
        totalCategories: 3,
        categories: [1, 2].map((id) => ({
          id,
          name: `name ${id}`,
          description: `description ${id}`,
        })),
      }),
  );

  // Render the first page
  const { getByTestId, getByText } = render(<CategoryList />);
  await wait(() => getByText("name 1"));
  expect(getByTestId("add-category")).toBeInTheDocument();
});
