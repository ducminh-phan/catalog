import { createReducer } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import { fetchItems } from "actions/item";
import * as schemas from "utils/schemas";
import * as types from "utils/types";

interface ItemState {
  totalItems: number;
  items: {
    [key: string]: types.Item;
  };
  ids: string[];
}

const initialState: ItemState = {
  totalItems: 0,
  items: {},
  ids: [],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(fetchItems.fulfilled, (state, action) => {
    const { payload } = action;
    const normalized = normalize(payload.items, schemas.items);

    return {
      totalItems: payload.totalItems,
      items: normalized.entities.items ?? {},
      ids: normalized.result,
    };
  }),
);
