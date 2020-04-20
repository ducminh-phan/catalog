import { createReducer } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import { addItem, editItem, fetchItems } from "actions/item";
import { ITEMS_PER_PAGE } from "enums";
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
  builder
    .addCase(fetchItems.fulfilled, (state, action) => {
      const { payload } = action;
      const normalized = normalize(payload.items, schemas.items);

      return {
        totalItems: payload.totalItems,
        items: normalized.entities.items ?? {},
        ids: normalized.result,
      };
    })
    .addCase(editItem.fulfilled, (state, action) => {
      const { payload } = action;
      const normalized = normalize(payload, schemas.item);

      return {
        ...state,
        items: {
          ...state.items,
          ...normalized.entities.items,
        },
      };
    })
    .addCase(addItem.fulfilled, (state, action) => {
      const { payload } = action;
      const normalized = normalize(payload, schemas.item);
      const { ids, items } = state;

      if (ids.length < ITEMS_PER_PAGE) {
        return {
          ...state,
          ids: [...ids, normalized.result],
          items: { ...items, ...normalized.entities.items },
        };
      }

      return state;
    }),
);
