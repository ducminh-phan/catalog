import { createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";
import * as types from "utils/types";

export type FetchCategoriesResponse = {
  totalCategories: number;
  categories: types.Category[];
};

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  ({ offset, limit }: types.PaginationParams) =>
    Request.get<FetchCategoriesResponse>(
      `categories?offset=${offset}&limit=${limit}`,
    ),
);

export type AddCategoryRequest = {
  name: string;
  description: string;
};

export const addCategory = createAsyncThunk(
  "categories/add",
  (payload: AddCategoryRequest) =>
    Request.post<types.Category>("categories", payload),
);
