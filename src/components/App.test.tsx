import React from "react";

import { FetchCategoriesResponse } from "actions/category";
import App from "components/App";
import { CATEGORIES_PER_PAGE } from "enums";
import Request from "utils/api";
import { render, wait } from "utils/tests";

it("gets the list of categories", async () => {
  jest
    .spyOn(Request, "get")
    .mockImplementation(
      (): Promise<FetchCategoriesResponse> =>
        Promise.resolve({ totalCategories: 0, categories: [] }),
    );

  expect(Request.get).toHaveBeenCalledTimes(0);

  const { baseElement, getByText } = render(<App />);
  await wait(() => getByText("Home"));

  expect(Request.get).toHaveBeenCalledWith(
    `categories?offset=0&limit=${CATEGORIES_PER_PAGE}`,
  );
  expect(baseElement).toMatchSnapshot();
});

it("shows Home/Login/Register", async () => {
  const { getByText, queryByText } = render(<App />);

  await wait(() => getByText("Home"));
  expect(queryByText("Home")).toBeInTheDocument();
  expect(queryByText("Login")).toBeInTheDocument();
  expect(queryByText("Register")).toBeInTheDocument();
  expect(queryByText("Cancel")).toBeNull();
});
