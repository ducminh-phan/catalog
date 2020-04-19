import { createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";
import * as types from "utils/types";

import type { PaginationParams } from "../utils/types";

type FetchItemsRequest = PaginationParams & {
  categoryId?: string;
};

type FetchItemsResponse = {
  totalItems: number;
  items: types.Item[];
};

export const fetchItems = createAsyncThunk(
  "items/fetch",
  ({ categoryId, offset, limit }: FetchItemsRequest) => {
    return Request.get<FetchItemsResponse>(
      `categories/${categoryId}/items?offset=${offset}&limit=${limit}`,
    );
  },
);

export const addItem = createAsyncThunk("item/add", () => Promise.resolve());
