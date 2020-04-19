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
  ({ categoryId, offset, limit }: FetchItemsRequest) =>
    Request.get<FetchItemsResponse>(
      `categories/${categoryId}/items?offset=${offset}&limit=${limit}`,
    ),
);

type EditItemsRequest = {
  categoryId?: string;
  itemId: string;
  data: {
    name: string;
    description: string;
    price: number;
  };
};

type EditItemsResponse = types.Item;

export const editItem = createAsyncThunk(
  "items/edit",
  ({ categoryId, itemId, data }: EditItemsRequest) =>
    Request.put<EditItemsResponse>(
      `categories/${categoryId}/items/${itemId}`,
      data,
    ),
);

export const addItem = createAsyncThunk("item/add", () => Promise.resolve());
