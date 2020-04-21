import { createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";
import * as types from "utils/types";

type FetchItemsRequest = types.PaginationParams & {
  categoryId?: string;
};

export type FetchItemsResponse = {
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

type AddItemRequest = {
  categoryId?: string;
  data: {
    name: string;
    description: string;
    price: number;
  };
};

type AddItemResponse = types.Item;

export const addItem = createAsyncThunk(
  "item/add",
  ({ categoryId, data }: AddItemRequest) =>
    Request.post<AddItemResponse>(`categories/${categoryId}/items`, data),
);

type DeleteItemRequest = {
  categoryId?: string;
  itemId: string;
};

export const deleteItem = createAsyncThunk(
  "item/delete",
  ({ categoryId, itemId }: DeleteItemRequest) =>
    Request.delete(`categories/${categoryId}/items/${itemId}`),
);
