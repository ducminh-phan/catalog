import { createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";
import * as types from "utils/types";

import type { PaginationParams } from "../utils/types";

type FetchCategoriesResponse = {
  totalCategories: number;
  categories: types.Category[];
};

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  ({ offset, limit }: PaginationParams) => {
    return Request.get<FetchCategoriesResponse>(
      `categories?offset=${offset}&limit=${limit}`,
    );
  },
);

export const addCategory = createAsyncThunk("categories/add", () =>
  Promise.resolve(),
);
